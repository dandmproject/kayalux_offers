import json,struct,glob,os,array
def read(f):
    b=open(f,'rb').read();ln=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+ln]);off=20+ln;bl=struct.unpack('<I',b[off:off+4])[0];return j,b[off+8:off+8+bl]
CT={5126:('f',4),5123:('H',2),5121:('B',1),5122:('h',2),5120:('b',1),5125:('I',4)}
N={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def acc_data(j,bin_,i):
    a=j['accessors'][i];bv=j['bufferViews'][a['bufferView']];fmt,cs=CT[a['componentType']];n=N[a['type']]
    stride=bv.get('byteStride',cs*n);start=bv.get('byteOffset',0)+a.get('byteOffset',0)
    out=bytearray()
    for k in range(a['count']):
        s=start+k*stride;out+=bin_[s:s+cs*n]
    return a,bytes(out)
base,bbin=read('anims/m_walk_neutral.glb')
nodes=[dict(n) for n in base['nodes']]
for n in nodes: n.pop('mesh',None); n.pop('skin',None)
name2i={n.get('name'):i for i,n in enumerate(nodes)}
g={'asset':{'version':'2.0','generator':'kayalux-rocketbox-anims'},'scene':0,'scenes':[{'nodes':base['scenes'][0]['nodes']}],'nodes':nodes,'animations':[],'accessors':[],'bufferViews':[],'buffers':[{}]}
out=bytearray()
clips={'walk_m':'m_walk_neutral','walk_f':'f_walk_neutral','walkslow_m':'m_walk_slow_01','walkslow_f':'f_walk_slow_01','idle_m':'m_idle_neutral_01','idle_f':'f_idle_neutral_01','wait_m':'m_idle_waiting_01','wait_f':'f_idle_waiting_01','look_m':'m_idle_look_around_01','look_f':'f_idle_look_around_01','phone_m':'m_cell_phone_textmessage','phone_f':'f_cell_phone_textmessage','bag_m':'m_hold_bag_idle','bag_f':'f_hold_bag_idle_01'}
MAXSEC=8.0
for cname,fn in clips.items():
    j,bin_=read('anims/%s.glb'%fn); a=j['animations'][0]
    accmap={};chans=[];samps=[]
    def add_pair(si,oi_,fix):
        ta,tdata=acc_data(j,bin_,si); oa,odata=acc_data(j,bin_,oi_)
        tl=array.array('f');tl.frombytes(tdata); n=N[oa['type']]; ol=array.array('f');ol.frombytes(odata)
        keep=[k for k in range(len(tl)) if tl[k]<=MAXSEC and (k%2==0 or k==len(tl)-1)]
        tl2=array.array('f',[tl[k] for k in keep]); ol2=array.array('f')
        for k in keep: ol2.extend(ol[k*n:(k+1)*n])
        if fix=='root':
            x0,z0=ol2[0],ol2[2]
            for k in range(0,len(ol2),3): ol2[k]=x0; ol2[k+2]=z0
        res=[]
        for acc,fl,typ in ((ta,tl2,'SCALAR'),(oa,ol2,oa['type'])):
            acc=dict(acc); data=fl.tobytes()
            while len(out)%4: out.extend(b'\0')
            g['bufferViews'].append({'buffer':0,'byteOffset':len(out),'byteLength':len(data)}); out.extend(data)
            acc['bufferView']=len(g['bufferViews'])-1; acc.pop('byteOffset',None); acc['count']=len(keep); acc.pop('min',None); acc.pop('max',None)
            if typ=='SCALAR': acc['min']=[fl[0]]; acc['max']=[fl[-1]]
            g['accessors'].append(acc); res.append(len(g['accessors'])-1)
        return res
    for ch in a['channels']:
        nn=j['nodes'][ch['target']['node']].get('name'); 
        if nn not in name2i: continue
        s=a['samplers'][ch['sampler']]
        fix='root' if (ch['target']['path']=='translation' and nn=='Bip01') else None
        if ch['target']['path']=='translation' and nn not in ('Bip01','Bip01 Pelvis'): continue  # rotations only elsewhere
        ti,oi=add_pair(s['input'],s['output'],fix)
        samps.append({'input':ti,'output':oi,'interpolation':s.get('interpolation','LINEAR')})
        chans.append({'sampler':len(samps)-1,'target':{'node':name2i[nn],'path':ch['target']['path']}})
    g['animations'].append({'name':cname,'channels':chans,'samplers':samps})
    print(cname,len(chans),'channels')
while len(out)%4: out.extend(b'\0')
g['buffers'][0]['byteLength']=len(out)
js=json.dumps(g,separators=(',',':')).encode()
while len(js)%4: js+=b' '
blob=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(out))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(out))+b'BIN\0'+bytes(out)
open('rb-anims.glb','wb').write(blob); print('rb-anims.glb',len(blob))

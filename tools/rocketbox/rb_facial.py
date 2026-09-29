# Strip a Rocketbox "_facial" GLB to a few morph targets stored as sparse accessors (smile, blink, jaw, visemes).
import json,struct,sys,array
src,dst=sys.argv[1],sys.argv[2]
KEEP={'smile':['AK_44_MouthSmileLeft','AK_45_MouthSmileRight'],'squint':['AK_19_EyeSquintLeft','AK_20_EyeSquintRight','AK_07_CheekSquintLeft','AK_08_CheekSquintRight'],'blink':['AK_09_EyeBlinkLeft','AK_10_EyeBlinkRight'],'jaw':['AK_25_JawOpen'],'oh':['AK_32_MouthFunnel'],'brows':['AK_03_BrowInnerUp','AK_04_BrowOuterUpLeft','AK_05_BrowOuterUpRight'],'frown':['AK_30_MouthFrownLeft','AK_31_MouthFrownRight','AK_01_BrowDownLeft','AK_02_BrowDownRight'],'surprise':['AK_21_EyeWideLeft','AK_22_EyeWideRight','AK_04_BrowOuterUpLeft','AK_05_BrowOuterUpRight']}
b=open(src,'rb').read();ln=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+ln]);off=20+ln;bl=struct.unpack('<I',b[off:off+4])[0];bin_=b[off+8:off+8+bl]
def acc_bytes(i):
    a=j['accessors'][i];bv=j['bufferViews'][a['bufferView']];n=3;cs=4;stride=bv.get('byteStride',cs*n);start=bv.get('byteOffset',0)+a.get('byteOffset',0)
    out=bytearray()
    for k in range(a['count']): s=start+k*stride;out+=bin_[s:s+cs*n]
    return a,bytes(out)
names_all=[]
newbin=bytearray()
orig_n=len(j['bufferViews'])
for m in j['meshes']:
    for p in m['primitives']:
        if 'targets' not in p: continue
        tnames=[j['accessors'][t['POSITION']].get('name','').split('.')[-1] for t in p['targets']]
        names_all=tnames
        newt=[];newnames=[]
        for key,cands in KEEP.items():
            # merge candidates (e.g. left+right) into one target by summing deltas
            idxs=[tnames.index(c) for c in cands if c in tnames]
            if not idxs: continue
            acc=None;total=None
            for ix in idxs:
                a,data=acc_bytes(p['targets'][ix]['POSITION']);fl=array.array('f');fl.frombytes(data)
                if total is None: total=fl;acc=a
                else:
                    for q in range(len(fl)): total[q]+=fl[q]
            # sparse: indices of vertices with any nonzero delta
            cnt=acc['count'];idx=[v for v in range(cnt) if total[v*3] or total[v*3+1] or total[v*3+2]]
            if not idx: continue
            vals=array.array('f');[vals.extend(total[v*3:v*3+3]) for v in idx]
            ind=array.array('I',idx)
            # append buffer views
            def bv(data):
                global newbin
                while len(newbin)%4: newbin+=b'\0'
                j['bufferViews'].append({'buffer':0,'byteOffset':len(newbin),'byteLength':len(data)});newbin+=data;return len(j['bufferViews'])-1
            ibv=bv(ind.tobytes());vbv=bv(vals.tobytes())
            j['accessors'].append({'componentType':5126,'type':'VEC3','count':cnt,'name':key,'sparse':{'count':len(idx),'indices':{'bufferView':ibv,'componentType':5125},'values':{'bufferView':vbv}},'min':[min(vals[0::3]),min(vals[1::3]),min(vals[2::3])],'max':[max(vals[0::3]),max(vals[1::3]),max(vals[2::3])]})
            newt.append({'POSITION':len(j['accessors'])-1});newnames.append(key)
        p['targets']=newt
        if newt: m['weights']=[0]*len(newt);m['extras']={'targetNames':newnames}
        else: m.pop('weights',None);m.pop('extras',None)
# prune accessors no longer referenced (old morph targets)
ref=set()
for m in j['meshes']:
    for p in m['primitives']:
        ref.update(p['attributes'].values())
        if 'indices' in p: ref.add(p['indices'])
        for t in p.get('targets',[]): ref.update(t.values())
for sk in j.get('skins',[]):
    if 'inverseBindMatrices' in sk: ref.add(sk['inverseBindMatrices'])
amap={};newacc=[]
for i,a in enumerate(j['accessors']):
    if i in ref: amap[i]=len(newacc);newacc.append(a)
j['accessors']=newacc
for m in j['meshes']:
    for p in m['primitives']:
        p['attributes']={k:amap[v] for k,v in p['attributes'].items()}
        if 'indices' in p: p['indices']=amap[p['indices']]
        p['targets']=[{k:amap[v] for k,v in t.items()} for t in p.get('targets',[])]
for sk in j.get('skins',[]):
    if 'inverseBindMatrices' in sk: sk['inverseBindMatrices']=amap[sk['inverseBindMatrices']]
# rebuild binary
used=set()
for i,a in enumerate(j['accessors']):
    if 'bufferView' in a: used.add(a['bufferView'])
    if 'sparse' in a: used.add(a['sparse']['indices']['bufferView']);used.add(a['sparse']['values']['bufferView'])
for im in j.get('images',[]):
    if 'bufferView' in im: used.add(im['bufferView'])
remap={};out=bytearray();nbv=[]
for i,bvw in enumerate(j['bufferViews']):
    if i not in used: continue
    if i>=len(j['bufferViews'])-0 or 'byteOffset' not in bvw and False: pass
    # source: original bin for old views, newbin for appended ones (they were appended after original count)
    data=None
    if bvw['byteOffset']<len(bin_) and i<orig_n if 'orig_n' in globals() else True: pass
    nbv.append((i,bvw))
# simpler: we know appended views were added at the end with offsets into newbin; determine original count
final=[];remap={}
for i,bvw in enumerate(j['bufferViews']):
    if i not in used: continue
    srcbuf=bin_ if i<orig_n else bytes(newbin)
    data=srcbuf[bvw['byteOffset']:bvw['byteOffset']+bvw['byteLength']]
    while len(out)%4: out+=b'\0'
    nb=dict(bvw);nb['byteOffset']=len(out);nb['byteLength']=len(data);remap[i]=len(final);final.append(nb);out+=data
j['bufferViews']=final
for a in j['accessors']:
    if 'bufferView' in a: a['bufferView']=remap[a['bufferView']]
    if 'sparse' in a: a['sparse']['indices']['bufferView']=remap[a['sparse']['indices']['bufferView']];a['sparse']['values']['bufferView']=remap[a['sparse']['values']['bufferView']]
for im in j.get('images',[]):
    if 'bufferView' in im: im['bufferView']=remap[im['bufferView']]
# drop unused accessors? (targets removed) – keep list compact
j['buffers'][0]['byteLength']=len(out);j['animations']=[]
js=json.dumps(j,separators=(',',':')).encode()
while len(js)%4: js+=b' '
blob=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(out))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(out))+b'BIN\0'+bytes(out)
open(dst,'wb').write(blob);print(dst,len(blob),'targets',[m.get('extras') for m in j['meshes']])

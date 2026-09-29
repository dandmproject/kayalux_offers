import json,struct,io,os,sys
from PIL import Image
def shrink(src,dst):
    b=open(src,'rb').read();ln=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+ln]);off=20+ln;bl=struct.unpack('<I',b[off:off+4])[0];bin_=b[off+8:off+8+bl]
    imgbv={im['bufferView']:im for im in j['images'] if 'bufferView' in im}
    out=bytearray();newbv=[]
    for i,bv in enumerate(j['bufferViews']):
        data=bin_[bv.get('byteOffset',0):bv.get('byteOffset',0)+bv['byteLength']]
        if i in imgbv:
            im=Image.open(io.BytesIO(data));kind=imgbv[i].get('name','body');size={'body':768,'head':512,'opacity':512}.get(kind,768)
            if im.mode=='RGBA':
                im=im.resize((size,size),Image.LANCZOS);bo=io.BytesIO();im.save(bo,'PNG',optimize=True);data=bo.getvalue();imgbv[i]['mimeType']='image/png'
            else:
                im=im.convert('RGB').resize((size,size),Image.LANCZOS);bo=io.BytesIO();im.save(bo,'JPEG',quality=80);data=bo.getvalue();imgbv[i]['mimeType']='image/jpeg'
        while len(out)%4: out+=b'\0'
        nb=dict(bv);nb['byteOffset']=len(out);nb['byteLength']=len(data)
        if i in imgbv: nb.pop('byteStride',None)
        newbv.append(nb);out+=data
    j['bufferViews']=newbv;j['buffers'][0]['byteLength']=len(out)
    js=json.dumps(j,separators=(',',':')).encode()
    while len(js)%4: js+=b' '
    blob=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(out))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(out))+b'BIN\0'+bytes(out)
    open(dst,'wb').write(blob);return len(blob)
tot=0
for f in sorted(os.listdir('rocketbox/people')):
    if f.endswith('.glb'): tot+=shrink('rocketbox/people/'+f,'people/'+f)
print('total KB',tot//1024)

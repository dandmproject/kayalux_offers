# re-encode the textures of a Rocketbox GLB before gltfpack: body 512 JPEG, head 384 JPEG, opacity 256 palettised PNG
import json,struct,io,sys
from PIL import Image
def prep(src,dst):
    b=open(src,'rb').read();ln=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+ln]);off=20+ln;bl=struct.unpack('<I',b[off:off+4])[0];bin_=b[off+8:off+8+bl]
    imgbv={im['bufferView']:im for im in j.get('images',[]) if 'bufferView' in im}
    out=bytearray();newbv=[]
    for i,bv in enumerate(j['bufferViews']):
        data=bin_[bv.get('byteOffset',0):bv.get('byteOffset',0)+bv['byteLength']]
        if i in imgbv:
            im=Image.open(io.BytesIO(data));kind=imgbv[i].get('name','body')
            if kind=='opacity' or im.mode in ('RGBA','LA','P'):
                im=im.convert('RGBA').resize((256,256),Image.LANCZOS).quantize(colors=48,method=Image.FASTOCTREE);bo=io.BytesIO();im.save(bo,'PNG',optimize=True);data=bo.getvalue();imgbv[i]['mimeType']='image/png'
            else:
                sz={'head':384}.get(kind,512);im=im.convert('RGB').resize((sz,sz),Image.LANCZOS);bo=io.BytesIO();im.save(bo,'JPEG',quality=76,optimize=True,progressive=False);data=bo.getvalue();imgbv[i]['mimeType']='image/jpeg'
        while len(out)%4: out+=b'\0'
        nb=dict(bv);nb['byteOffset']=len(out);nb['byteLength']=len(data)
        if i in imgbv: nb.pop('byteStride',None)
        newbv.append(nb);out+=data
    j['bufferViews']=newbv;j['buffers'][0]['byteLength']=len(out)
    js=json.dumps(j,separators=(',',':')).encode()
    while len(js)%4: js+=b' '
    while len(out)%4: out+=b'\0'
    blob=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(out))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(out))+b'BIN\0'+bytes(out)
    open(dst,'wb').write(blob);return len(blob)
if __name__=='__main__':prep(sys.argv[1],sys.argv[2])

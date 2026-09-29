import json,struct,sys,glob,os
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
b=open(src,'rb').read();ln=struct.unpack('<I',b[12:16])[0];j=json.loads(b[20:20+ln]);off=20+ln;bl=struct.unpack('<I',b[off:off+4])[0];bin_=bytearray(b[off+8:off+8+bl])
tgas={os.path.basename(p):p for p in glob.glob('*.tga')}
def find(kind):
    for n,p in tgas.items():
        if kind in n: return p
    if kind=='body':
        for n,p in tgas.items():
            if 'head' not in n and 'opacity' not in n: return p
for m in j['materials']:
    pbr=m.setdefault('pbrMetallicRoughness',{});bt=pbr.get('baseColorTexture')
    name=m.get('name','').lower()
    kind='opacity' if 'opacity' in name else ('head' if 'head' in name else 'body')
    p=find(kind)
    if p is None or bt is None: continue
    im=Image.open(p); rgba=im.mode=='RGBA'
    size=1024 if kind!='head' else 768
    rgb=im.convert('RGB').resize((size,size),Image.LANCZOS)
    out='tex_%s.jpg'%kind
    if kind=='opacity' and rgba:
        # keep alpha as mask -> png (smaller size)
        im.resize((768,768),Image.LANCZOS).save('tex_opacity.png',optimize=True); out='tex_opacity.png'; mime='image/png'
    else:
        rgb.save(out,quality=82); mime='image/jpeg'
    data=open(out,'rb').read()
    while len(bin_)%4: bin_+=b'\0'
    j['bufferViews'].append({'buffer':0,'byteOffset':len(bin_),'byteLength':len(data)}); bin_+=data
    img=j['textures'][bt['index']]['source']
    j['images'][img]={'mimeType':mime,'bufferView':len(j['bufferViews'])-1,'name':kind}
    m.pop('extensions',None); pbr['metallicFactor']=0; pbr['roughnessFactor']=0.85
    if kind=='opacity': m['alphaMode']='MASK'; m['alphaCutoff']=0.5; m['doubleSided']=True
j.pop('extensionsUsed',None); j.pop('extensionsRequired',None)
j['animations']=[]
j['buffers'][0]['byteLength']=len(bin_)
js=json.dumps(j,separators=(',',':')).encode()
while len(js)%4: js+=b' '
out=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(bin_))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(bin_))+b'BIN\0'+bytes(bin_)
open(dst,'wb').write(out); print(dst,len(out))

// Builds the public (no-photo) offline copy of the 3D model.
const fs=require('fs');const [src,out]=process.argv.slice(2);let h=fs.readFileSync(src,'utf8');
const mural=`(()=>{const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#cfe3ee');g.addColorStop(1,'#e9dcc2');x.fillStyle=g;x.fillRect(0,0,512,256);
  x.strokeStyle='rgba(90,110,120,.25)';for(let i=0;i<512;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();}
  for(let j=0;j<256;j+=32){x.beginPath();x.moveTo(0,j);x.lineTo(512,j);x.stroke();}
  x.fillStyle='rgba(140,160,120,.55)';[[90,80,70,45],[250,70,90,55],[400,110,60,70],[160,170,50,35]].forEach(([a,b,r1,r2])=>{x.beginPath();x.ellipse(a,b,r1,r2,0.3,0,7);x.fill();});
  return new THREE.CanvasTexture(c);})()`;
const floor=`(()=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');
  for(let i=0;i<4;i++){x.fillStyle=['#b08a62','#a7805a','#b89469','#a27c55'][i];x.fillRect(i*64,0,64,256);
  x.fillStyle='rgba(60,40,20,.5)';x.fillRect(i*64,0,2,256);x.fillRect(i*64,(i*97)%256,64,2);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})()`;
h=h.replace(/const texMural=TL\.load\('data:image[^']*',\(\)=>\{\}\);/,'const texMural='+mural+';')
 .replace(/const texFloor=TL\.load\('data:image[^']*',\(\)=>\{\}\);/,'const texFloor='+floor+';')
 .replace(/<link rel="preconnect"[^>]*>\n?/,'').replace(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>\n?/,'')
 .replace(/<script src="https:\/\/cdnjs[^"]*three\.min\.js"><\/script>/,'<script src="three.min.js"></script>')
 .replace(/<script src="https:\/\/cdn\.jsdelivr[^"]*OrbitControls\.js"><\/script>/,'<script src="OrbitControls.js"></script>');
if(!/^<!doctype/i.test(h))h=`<!doctype html>\n<html lang="bg">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex, nofollow">\n<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}</style>\n`+h.replace(/(<\/style>\s*)(?![\s\S]*<\/style>)/,'$1</head>\n<body>\n')+'\n</body>\n</html>\n';
if(/data:image\/jpeg/.test(h))throw new Error('photo left');fs.writeFileSync(out,h);

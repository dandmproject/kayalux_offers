
(function(){
'use strict';
const root=document.documentElement;
root.classList.add('js');
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const reduce=false; // Reduce Motion (on for many iPhones) must not change the site: same animations, same presentation
/* quality tier for the 3D set: 2 strong machine, 1 laptop / phone, 0 weak (no shadows, no antialias, lower resolution); ?q=0|1|2 forces one */
const TIER=(()=>{try{const q=new URLSearchParams(location.search).get('q');if(q!=null&&q!=='')return Math.max(0,Math.min(2,+q|0));}catch(e){}
  const mem=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8,mob=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);let gpu='';
  try{const c=document.createElement('canvas'),gl=c.getContext('webgl');const e=gl&&gl.getExtension('WEBGL_debug_renderer_info');gpu=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';const lx=gl&&gl.getExtension('WEBGL_lose_context');if(lx)lx.loseContext();}catch(e){}
  let t=2;if(mob||mem<=4||cores<=4||/Intel|Mali|Adreno|PowerVR|SwiftShader|llvmpipe|Microsoft Basic/i.test(gpu))t=1;
  if(mem<=2||cores<=2||/SwiftShader|llvmpipe|Microsoft Basic|Mali-[4T]|Adreno \(TM\) [3-5]|PowerVR SGX/i.test(gpu))t=0;return t;})();
if(TIER<2)root.classList.add('lowfx');
const DIAG=/[?&]diag=1/.test(location.search); // ?diag=1: live performance panel over the page (for finding a stutter on a real machine)
const NB=' ';
const fmt=v=>{const [i,d]=Math.abs(v).toFixed(2).split('.');return (v<0?'−':'')+i.replace(/\B(?=(\d{3})+(?!\d))/g,NB)+','+d;};
const eur=v=>fmt(v)+NB+'€';
const num=s=>parseFloat(String(s).replace(/\s/g,'').replace(',','.'));
const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(Math.round(m%60)).padStart(2,'0');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const store={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
const cssVar=n=>getComputedStyle(root).getPropertyValue(n).trim();

/* ---------- data ---------- */
const ROWS=[{"n":1,"nm":"Хайдушка поляна","a":"ж.к. Лагера, ул. Баба Илийца 37А","ar":"36,22","s":"15,50","f":"18,75","c":"София"},{"n":2,"nm":"Несторов","a":"ул. Ами Буе 55","ar":"96,10","s":"24,50","f":"29,50","c":"София"},{"n":3,"nm":"НДК","a":"ул. Фритьоф Нансен 37А","ar":"164,00","s":"34,50","f":"41,25","c":"София"},{"n":4,"nm":"Борово","a":"ул. Тодор Каблешков 39","ar":"90,00","s":"23,50","f":"28,75","c":"София"},{"n":5,"nm":"Мотописта","a":"ул. Луи Айер, бл. 260А","ar":"86,00","s":"23,00","f":"28,25","c":"София"},{"n":6,"nm":"Баучер","a":"ул. Света гора 42","ar":"30,27","s":"14,50","f":"17,75","c":"София"},{"n":7,"nm":"Цариградско шосе","a":"бул. Цариградско шосе 60","ar":"197,17","s":"39,50","f":"46,25","c":"София"},{"n":8,"nm":"Красна поляна","a":"ул. Алеко Туранджа 49","ar":"99,04","s":"25,00","f":"30,00","c":"София"},{"n":9,"nm":"Хаджи Димитър","a":"ул. Скайлер 60","ar":"104,47","s":"25,50","f":"30,50","c":"София"},{"n":10,"nm":"Кирков","a":"ул. Братя Миладинови 29","ar":"60,76","s":"19,00","f":"22,25","c":"София"},{"n":11,"nm":"Павлово","a":"ул. Вихрен / Ген. Суворов","ar":"88,70","s":"23,50","f":"28,75","c":"София"},{"n":12,"nm":"Люлин","a":"ул. Луи Пастьор 9","ar":"80,00","s":"22,00","f":"27,25","c":"София"},{"n":13,"nm":"Варна, Бенковски","a":"ул. Г. Бенковски 53, Варна","ar":"120,00","s":"28,00","f":"31,00","c":"Варна"},{"n":14,"nm":"Варна, Дубровник","a":"ул. Дубровник 54, Варна","ar":"192,30","s":"39,00","f":"43,75","c":"Варна"},{"n":15,"nm":"Бели брези","a":"ул. Нишава 58","ar":"135,60","s":"30,50","f":"35,50","c":"София"},{"n":16,"nm":"Пирогов","a":"ул. Виктор Григорович 1","ar":"140,38","s":"31,00","f":"36,00","c":"София"},{"n":17,"nm":"Бургас, В. Търново","a":"ул. Велико Търново 12, Бургас","ar":"99,00","s":"25,00","f":"30,00","c":"Бургас"},{"n":18,"nm":"Бургас, Гладстон","a":"ул. Уилям Гладстон 94, Бургас","ar":"93,48","s":"24,00","f":"29,25","c":"Бургас"},{"n":19,"nm":"Галакси","a":"бул. Шипченски проход 18","ar":"211,53","s":"41,50","f":"48,25","c":"София"},{"n":20,"nm":"Люлин 2","a":"ул. ген. Асен Николов 19","ar":"162,49","s":"34,50","f":"41,25","c":"София"},{"n":21,"nm":"Опълченска","a":"ул. Опълченска 117-123","ar":"140,00","s":"31,00","f":"36,00","c":"София"},{"n":22,"nm":"Красно село","a":"ул. Дебър 3","ar":"104,00","s":"25,50","f":"30,50","c":"София"},{"n":23,"nm":"Монтевидео","a":"бул. Президент Линкълн / Монтевидео","ar":"105,00","s":"25,50","f":"31,00","c":"София"},{"n":24,"nm":"Иван Вазов","a":"ул. Стефан Сарафов, бл. 1, маг. 4","ar":"72,91","s":"21,00","f":"24,25","c":"София"},{"n":25,"nm":"Стрелбище","a":"ул. Нишава 167-171","ar":"346,99","s":"62,00","f":"68,25","c":"София"},{"n":26,"nm":"Лозенец","a":"бул. Христо Смирненски 46","ar":"82,41","s":"22,50","f":"27,75","c":"София"},{"n":27,"nm":"Стамболийски","a":"бул. Ал. Стамболийски 81","ar":"100,00","s":"25,00","f":"30,00","c":"София"},{"n":28,"nm":"Костенски водопад","a":"ул. Костенски водопад 41-47","ar":"144,39","s":"31,50","f":"36,50","c":"София"},{"n":29,"nm":"Димитър Петков","a":"бул. Тодор Александров 132","ar":"95,00","s":"24,00","f":"29,25","c":"София"},{"n":30,"nm":"Дойран","a":"ул. Ген. Стефан Тошев 1","ar":"210,60","s":"41,50","f":"48,25","c":"София"},{"n":31,"nm":"Горубляне","a":"ул. Самоковско шосе 57","ar":"150,00","s":"32,50","f":"37,50","c":"София"},{"n":32,"nm":"Надежда II","a":"ул. Република / Добри Чинтолов","ar":"24,00","s":"13,50","f":"17,00","c":"София"},{"n":33,"nm":"Обеля","a":"ж.к. Обеля 2, ул. 104/106","ar":"154,00","s":"33,00","f":"40,00","c":"София"},{"n":34,"nm":"Мусагеница","a":"ж.к. Мусагеница, бл. 110","ar":"117,00","s":"27,50","f":"32,50","c":"София"},{"n":35,"nm":"М. Ливади","a":"ж.к. М. Ливади, ул. Пирин 81","ar":"145,42","s":"32,00","f":"37,00","c":"София"},{"n":36,"nm":"Иван Асен II","a":"ул. Иван Асен II 25","ar":"96,00","s":"24,50","f":"29,50","c":"София"},{"n":37,"nm":"Славянска","a":"ул. Славянска 22","ar":"80,00","s":"22,00","f":"27,25","c":"София"},{"n":38,"nm":"Младост","a":"ж.к. Младост 3, бл. 301","ar":"127,00","s":"29,00","f":"34,00","c":"София"},{"n":39,"nm":"Оборище","a":"ул. Оборище 72","ar":"94,32","s":"24,00","f":"29,25","c":"София"},{"n":40,"nm":"Васил Левски","a":"бул. Васил Левски 60","ar":"75,00","s":"21,00","f":"24,25","c":"София"},{"n":41,"nm":"Велико Търново","a":"ул. Мармалийска 10, В. Търново","ar":"179,00","s":"37,00","f":"41,75","c":"Велико Търново"},{"n":42,"nm":"Златен рог","a":"ул. Златен рог 22","ar":"165,76","s":"35,00","f":"41,75","c":"София"},{"n":43,"nm":"Дианабад","a":"ж.к. Дианабад, бл. 53, маг. 3","ar":"232,48","s":"45,00","f":"51,75","c":"София"},{"n":44,"nm":"Слатина","a":"ул. Слатинска 92А","ar":"176,00","s":"36,50","f":"43,25","c":"София"},{"n":45,"nm":"Варна 3","a":"ул. Брегалница 32, Варна","ar":"159,50","s":"34,00","f":"40,75","c":"Варна"},{"n":46,"nm":"Търново 2","a":"ул. Вихрен 2, магазин 1, В. Търново","ar":"185,24","s":"37,50","f":"44,75","c":"Велико Търново"},{"n":47,"nm":"Бургас 3","a":"ж.к. Зорница, бл. 75, вх. 3, Бургас","ar":"198,78","s":"40,00","f":"46,75","c":"Бургас"},{"n":48,"nm":"Дондуков","a":"бул. Княз Александър Дондуков 32","ar":"152,00","s":"33,00","f":"40,00","c":"София"}].map(r=>({n:r.n,name:r.nm,addr:r.a,area:num(r.ar),std:num(r.s),full:num(r.f),city:r.c}));
const TOT={std:ROWS.reduce((a,r)=>a+r.std,0),full:ROWS.reduce((a,r)=>a+r.full,0)};
const MODES={std:{name:'Стандартен режим'},full:{name:'Пълно работно време'}};

/* ---------- theme ---------- */
const themeSubs=[];
function effTheme(){const t=root.getAttribute('data-theme');if(t==='light'||t==='dark'||t==='olive')return t;return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
const isDark=()=>effTheme()!=='light';
const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
const themeBtn=$('#themeBtn');
const PAL_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-.9-.6-1.2-.6-2 0-1 .8-1.7 1.9-1.7H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10.5" cy="7" r="1.1" fill="currentColor"/><circle cx="15" cy="7.5" r="1.1" fill="currentColor"/></svg>';
function paintThemeBtn(){const t=effTheme();themeBtn.innerHTML=PAL_ICON;themeBtn.title='Тема: '+(t==='dark'?'Нощ':t==='light'?'Ден':'Маслина');$$('#themePop [data-t]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.t===t)));}
function applyTheme(t){root.setAttribute('data-theme',t);store.set('kl-offer-theme',t);paintThemeBtn();themeSubs.forEach(f=>f());}
const saved=store.get('kl-offer-theme');if(saved==='light'||saved==='dark'||saved==='olive')root.setAttribute('data-theme',saved);
const themePop=$('#themePop');themeBtn.addEventListener('click',()=>{themePop.hidden=!themePop.hidden;themeBtn.setAttribute('aria-expanded',String(!themePop.hidden));});
$$('#themePop [data-t]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.t);themePop.hidden=true;themeBtn.setAttribute('aria-expanded','false');}));
document.addEventListener('click',e=>{if(!e.target.closest('.theme-menu')){themePop.hidden=true;themeBtn.setAttribute('aria-expanded','false');}});
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{paintThemeBtn();themeSubs.forEach(f=>f());});}catch(e){}
paintThemeBtn();

/* ---------- mode (one state, many controls) ---------- */
let mode='full';
const modeSubs=[];
function setMode(m){if(m!=='std'&&m!=='full')return;mode=m;paintMode();modeSubs.forEach(f=>f());}
function paintMode(){
  $$('[data-mode-group] [data-mode]').forEach(b=>{const on=b.dataset.mode===mode;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;});
  $$('[data-bind="total"]').forEach(e=>e.textContent=eur(TOT[mode]));
  $$('[data-bind="modeLabel"]').forEach(e=>e.textContent=MODES[mode].name+', за 48 обекта');
}
$$('[data-mode-group]').forEach(g=>{
  g.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode);});
  g.addEventListener('keydown',e=>{
    const b=e.target.closest('[data-mode]');
    if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setMode(b.dataset.mode);return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
    e.preventDefault();const bs=$$('[data-mode]',g);const i=bs.findIndex(x=>x.dataset.mode===mode);
    const n=bs[(i+((e.key==='ArrowRight'||e.key==='ArrowDown')?1:bs.length-1))%bs.length];setMode(n.dataset.mode);n.focus();
  });
});

/* ---------- validity ---------- */
(function(){const el=$('#validLeft');if(!el)return;const t=new Date();t.setHours(0,0,0,0);const d=Math.round((new Date(2026,9,16)-t)/864e5); // calendar days left, the last day included
  if(d>=1){el.textContent=d===1?'остава 1 ден':'остават '+d+' дни';}else if(d===0){el.textContent='последен ден';}else{el.textContent='валидността изтече на 16.10.2026 г.';el.classList.add('gone');}})();

/* ---------- nav: scrolled, progress, current chapter ---------- */
const nav=$('#nav'),prog=$('.progress',nav);
const dock=$('.dock');
function onScroll(){const y=scrollY;nav.classList.toggle('scrolled',y>8);if(dock)dock.classList.toggle('scrolled',y>innerHeight*.8);const h=root.scrollHeight-innerHeight;prog.style.setProperty('--p',h>0?Math.min(1,y/h):0);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const links=$$('.chapters a');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(a=>{const s=$(a.getAttribute('href'));if(s)io.observe(s);});
}

/* ---------- copy helpers ---------- */
function copyText(text,btn,selEl){
  const old=btn.textContent;
  const done=ok=>{btn.textContent=ok?'Копирано':'Маркирано · Ctrl+C';setTimeout(()=>btn.textContent=old,2200);};
  const fallback=()=>{if(selEl){const r=document.createRange();r.selectNodeContents(selEl);const s=getSelection();s.removeAllRanges();s.addRange(r);}done(false);};
  try{navigator.clipboard.writeText(text).then(()=>done(true),fallback);}catch(e){fallback();}
}
{const up=$('#toTop');if(up)up.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:reduce?'auto':'smooth'});});}
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const el=document.getElementById(b.dataset.copy);copyText(el.textContent.trim(),b,el);}));

/* ---------- brand logo: the real artwork, recoloured per theme ---------- */
const LOGO_SRC='assets/img/logo.jpg';
const logoImg=new Image();let logoMono=null;
function tint(hex,crop){
  const [sx,sy,sw,sh]=crop||[0,0,logoImg.naturalWidth,logoImg.naturalHeight];
  const c=document.createElement('canvas');c.width=sw;c.height=sh;const g=c.getContext('2d');g.drawImage(logoImg,sx,sy,sw,sh,0,0,sw,sh);
  const d=g.getImageData(0,0,sw,sh),a=d.data,n=parseInt((hex||'#D4AF63').replace('#','').slice(0,6),16),R=(n>>16)&255,G=(n>>8)&255,B=n&255;
  for(let i=0;i<a.length;i+=4){const l=(a[i]+a[i+1]+a[i+2])/3;a[i]=R;a[i+1]=G;a[i+2]=B;a[i+3]=Math.round(clamp((238-l)/190,0,1)*255);}
  g.putImageData(d,0,0);return c;
}
function paintLogos(){
  if(!logoImg.naturalWidth)return;
  const dark=isDark(),col=dark?(cssVar('--gold')||'#D4AF63'):(cssVar('--ink')||'#1A1713');
  const full=tint(col).toDataURL('image/png');
  const hl=$('#heroLogo');if(hl){hl.src=full;const sh=$('#logoStage .sheen');sh.style.webkitMaskImage=sh.style.maskImage='url('+full+')';$('#logoStage').classList.add('ready');}
  const pl=$('#paperLogo');if(pl)pl.src=tint('#1A1713').toDataURL('image/png');
  logoMono=tint(dark?'#E8C77E':'#D9BC7C',[300,62,186,248]);
}
logoImg.onload=paintLogos;logoImg.src=LOGO_SRC;
themeSubs.push(paintLogos);

/* ---------- background: a KAYA LUX diffuser and its scent, behind the whole page ---------- */
(function(){
  const cv=document.createElement('canvas');cv.className='bgsmoke';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  const ctx=cv.getContext('2d');if(!ctx)return;
  const hero=$('.hero');
  let W=0,H=0,P=[],puffs=[],dark=true,gold=[212,175,99],raf=0,last=0,px=-1e4,py=-1e4,lastY=scrollY,T=0;
  const small=()=>W<900;
  function size(){const d=Math.min(devicePixelRatio||1,TIER<2?1:1.5);W=innerWidth;H=innerHeight;cv.width=Math.round(W*d);cv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);}
  function colours(){dark=isDark();const m=(cssVar('--gold')||'#D4AF63').match(/#([0-9a-f]{6})/i);if(m){const n=parseInt(m[1],16);gold=[(n>>16)&255,(n>>8)&255,n&255];}
    const th=effTheme(),tone=th==='olive'?[226,232,196]:(dark?[255,228,178]:[150,128,92]);puffs=[];
    for(let k=0;k<5;k++){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
      for(let i=0;i<8;i++){const x=64+(Math.random()-.5)*48,y=64+(Math.random()-.5)*48,r=18+Math.random()*30,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+tone+','+(dark?.5:.32)+')');gr.addColorStop(1,'rgba('+tone+',0)');g.fillStyle=gr;g.fillRect(0,0,128,128);}
      puffs.push(c);}
  }
  function unit(){const r=hero.getBoundingClientRect(),s=small()?.66:clamp(W/1250,.9,1.4),h=300*s,w=78*s;
    const x=small()?W*.86:W*.8,base=r.top+Math.min(r.height,H)*.9;return {x,base,top:base-h,w,h,s,vis:!small()&&base>-40&&base-h<H+40};}
  function spawn(u,ambient){
    const p={};
    if(ambient){p.x=Math.random()*W;p.y=H+60;p.vx=0;p.vy=-(8+Math.random()*10);p.s0=60+Math.random()*80;p.s1=p.s0*2.6;p.a=dark?.035:.05;p.max=16+Math.random()*10;}
    else{p.x=u.x+u.w*1.7*.32+(Math.random()-.5)*4*u.s;p.y=u.top+u.h*.38-4*u.s;p.vx=(Math.random()-.5)*10;p.vy=-(30+Math.random()*24)*u.s;p.s0=8*u.s;p.s1=(90+Math.random()*110)*u.s;p.a=dark?.05:.07;p.max=8+Math.random()*7;}
    p.life=0;p.r=Math.random()*6.28;p.vr=(Math.random()-.5)*.35;p.k=(Math.random()*puffs.length)|0;p.seed=Math.random()*100;P.push(p);
  }
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  function drawUnit(u,t){
    if(!u.vis)return;const {x,top,w,h,s}=u,g_=gold.join(','),a=small()?.6:1;
    // Plug'n Go proportions: about 0.72 × 1, rounded corners, matte black shell
    const W_=w*1.7,H_=h*.62,X=x-W_/2,Y=top+h-H_,R=W_*.16;
    ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation='source-over';
    const fl=ctx.createRadialGradient(x,Y+H_*.5,0,x,Y+H_*.5,W_*1.4);fl.addColorStop(0,'rgba('+g_+','+(dark?.10:.08)+')');fl.addColorStop(1,'rgba('+g_+',0)');ctx.fillStyle=fl;ctx.fillRect(X-W_,Y-W_*.6,W_*3,H_+W_*1.4);
    // shadow + body
    ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=30*s;ctx.shadowOffsetY=12*s;
    const body=ctx.createLinearGradient(X,Y,X+W_,Y+H_);
    if(dark){body.addColorStop(0,'#2a2622');body.addColorStop(.35,'#17140f');body.addColorStop(.7,'#0d0b09');body.addColorStop(1,'#1d1915');}
    else{body.addColorStop(0,'#3a3530');body.addColorStop(.4,'#201c18');body.addColorStop(1,'#2c2722');}
    rr(X,Y,W_,H_,R);ctx.fillStyle=body;ctx.fill();ctx.shadowColor='transparent';
    // edge light
    ctx.strokeStyle='rgba(255,236,200,'+(dark?.18:.25)+')';ctx.lineWidth=1;rr(X+.5,Y+.5,W_-1,H_-1,R);ctx.stroke();
    ctx.strokeStyle='rgba('+g_+',.35)';rr(X-1,Y-1,W_+2,H_+2,R+1);ctx.stroke();
    // nozzle top right
    ctx.fillStyle='#0a0908';ctx.beginPath();ctx.arc(X+W_*.82,Y+H_*.07,W_*.045,0,6.283);ctx.fill();ctx.strokeStyle='rgba('+g_+',.6)';ctx.lineWidth=1.2;ctx.stroke();
    // two LEDs left
    const pulse=.6+.4*Math.sin(t*2.2);
    for(const [dy,col] of [[.13,'143,180,127'],[.19,'127,208,224']]){const ly=Y+H_*dy,lx=X+W_*.12;const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,7*s);lg.addColorStop(0,'rgba('+col+','+(.9*pulse)+')');lg.addColorStop(1,'rgba('+col+',0)');ctx.fillStyle=lg;ctx.beginPath();ctx.arc(lx,ly,7*s,0,6.283);ctx.fill();ctx.fillStyle='rgba('+col+',.95)';ctx.beginPath();ctx.arc(lx,ly,1.6*s,0,6.283);ctx.fill();}
    // logo + wordmark
    if(logoMono){const lw=W_*.24,lh=lw*logoMono.height/logoMono.width;ctx.globalAlpha=a*.85;ctx.drawImage(logoMono,x-lw/2,Y+H_*.12,lw,lh);ctx.globalAlpha=a;}
    ctx.fillStyle='rgba('+g_+',.85)';ctx.font='500 '+(W_*.11)+'px "Cormorant Garamond", Georgia, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('KAYA LUX',x,Y+H_*.42);
    ctx.fillStyle='rgba(200,190,170,.55)';ctx.font='400 '+(W_*.045)+'px Inter, sans-serif';ctx.fillText('Professional Scenting Solutions',x,Y+H_*.485);
    // QR block
    const q=W_*.2,qx=x-q/2,qy=Y+H_*.53;ctx.fillStyle='rgba(120,112,100,.35)';let seed=7;for(let i=0;i<9;i++)for(let j=0;j<9;j++){seed=(seed*9301+49297)%233280;if(seed/233280<.45||(i<3&&j<3)||(i<3&&j>5)||(i>5&&j<3))ctx.fillRect(qx+i*q/9,qy+j*q/9,q/9-.6,q/9-.6);}
    // diamond grille, fading upward
    const gw=W_*.62,gx=x-gw/2,gy=Y+H_*.72,cols=7,rows=6,cs=gw/cols;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const k=r/(rows-1),sz=cs*(.28+.62*k),cx_=gx+c*cs+cs/2+(r%2?cs/2:0),cy_=gy+r*cs*.85;if(cx_>gx+gw)continue;ctx.save();ctx.translate(cx_,cy_);ctx.rotate(Math.PI/4);const dg=ctx.createLinearGradient(-sz/2,-sz/2,sz/2,sz/2);dg.addColorStop(0,'rgba(60,54,46,'+(.25+.5*k)+')');dg.addColorStop(1,'rgba(0,0,0,'+(.5+.4*k)+')');ctx.fillStyle=dg;ctx.fillRect(-sz/2,-sz/2,sz,sz);ctx.restore();}
    // subtle sheen
    const hl=ctx.createLinearGradient(X,Y,X+W_*.5,Y+H_);hl.addColorStop(0,'rgba(255,240,210,'+(dark?.07:.1)+')');hl.addColorStop(.5,'rgba(255,240,210,0)');ctx.fillStyle=hl;rr(X,Y,W_,H_,R);ctx.fill();
    ctx.restore();
  }
  function step(dt){
    T+=dt;const u=unit(),dy=scrollY-lastY;lastY=scrollY;
    if(u.vis){const rate=small()?7:11;let n=rate*dt;while(n>0){if(Math.random()<n)spawn(u,false);n-=1;}}
    if(Math.random()<(u.vis?.9:2.2)*dt)spawn(u,true);
    for(const p of P){
      p.life+=dt;p.y-=dy*.35;
      const f=Math.sin(p.y*.007+T*.45+p.seed)*16+Math.sin((p.x*.004)-T*.3)*11;
      p.vx+=(f-p.vx)*dt*.7;p.vy*=Math.pow(.985,dt*60);p.vy=Math.min(p.vy,-7);
      const dx=p.x-px,dy2=p.y-py,d2=dx*dx+dy2*dy2;if(d2<30000){const d=Math.sqrt(d2)||1,k=(1-d2/30000)*90*dt;p.vx+=dx/d*k;p.vy+=dy2/d*k*.5;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
    }
    const PMX=TIER===2?320:TIER===1?110:60;P=P.filter(p=>p.life<p.max&&p.y>-400);if(P.length>PMX)P.splice(0,P.length-PMX);
    return u;
  }
  function draw(u){
    ctx.clearRect(0,0,W,H);
    drawUnit(u,T);
    ctx.globalCompositeOperation=dark?'lighter':'source-over';
    for(const p of P){const k=p.life/p.max,fade=Math.min(1,p.life/.9)*Math.pow(1-k,1.4),s=p.s0+(p.s1-p.s0)*Math.sqrt(k);
      ctx.globalAlpha=p.a*fade;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.drawImage(puffs[p.k],-s/2,-s/2,s,s);ctx.restore();}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  }
  let heroVis=true,lastD=0;function loop(t){raf=0;if(document.hidden||!heroVis||window.__klBusy)return;if(TIER<2&&t-lastD<31){raf=requestAnimationFrame(loop);return;}lastD=t;const dt=Math.min(.05,(t-(last||t))/1000);last=t;draw(step(dt));raf=requestAnimationFrame(loop);} // phones / weak machines: the smoke at 30 fps
  if('IntersectionObserver' in window){const h=document.querySelector('.hero');if(h)new IntersectionObserver(en=>{heroVis=en[0].isIntersecting;if(heroVis&&!raf&&!reduce){last=0;raf=requestAnimationFrame(loop);}},{rootMargin:'120px'}).observe(h);}
  document.addEventListener('kl-resume',()=>{if(!raf&&heroVis&&!reduce){last=0;raf=requestAnimationFrame(loop);}});
  size();colours();
  if(reduce){for(let i=0;i<300;i++)step(1/30);draw(unit());addEventListener('scroll',()=>draw(unit()),{passive:true});}
  else{for(let i=0;i<120;i++)step(1/30);raf=requestAnimationFrame(loop);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=0;raf=requestAnimationFrame(loop);}});}
  addEventListener('resize',()=>{size();if(reduce)draw(unit());},{passive:true});
  addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;},{passive:true});
  document.addEventListener('pointerleave',()=>{px=py=-1e4;});
  themeSubs.push(()=>{colours();if(reduce)draw(unit());});
  logoImg.addEventListener('load',()=>{if(reduce)draw(unit());});
})();

/* ---------- chapters menu (hamburger) when the chapter bar does not fit ---------- */
(function(){const btn=$('#menuBtn'),sh=$('#navSheet'),ch=$('.chapters');if(!btn||!sh||!ch)return;sh.innerHTML='<ul>'+ch.innerHTML+'</ul>';
  const set=o=>{sh.hidden=!o;btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'Затвори съдържанието':'Съдържание');
    if(o){const tp=$('#themePop');if(tp&&!tp.hidden){tp.hidden=true;$('#themeBtn').setAttribute('aria-expanded','false');}const a=sh.querySelector('a.on')||sh.querySelector('a');if(a)a.focus({preventScroll:true});}};
  btn.addEventListener('click',e=>{e.stopPropagation();set(sh.hidden);});
  sh.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sh.hidden){set(false);btn.focus();}});
  document.addEventListener('click',e=>{if(!sh.hidden&&!e.target.closest('#nav'))set(false);});
  const mq=matchMedia('(min-width:1301px)');const big=()=>{if(mq.matches)set(false);};mq.addEventListener?mq.addEventListener('change',big):mq.addListener(big);
  // the chapter being read is marked in the menu too
  const sync=()=>{const on=ch.querySelector('a.on'),h=on&&on.getAttribute('href');sh.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===h));};sync();
  new MutationObserver(sync).observe(ch,{subtree:true,attributes:true,attributeFilter:['class']});})();
/* ---------- the brand at the foot: the glint runs only while the footer is (nearly) on screen; paused, not restarted ---------- */
(function(){const el=document.querySelector('.kl-marka');if(!el)return;el.classList.add('kl-spryano');if(!('IntersectionObserver' in window)){el.classList.remove('kl-spryano');return;}
  new IntersectionObserver(es=>es.forEach(e=>el.classList.toggle('kl-spryano',!e.isIntersecting)),{rootMargin:'120px 0px'}).observe(el);})();
/* ---------- cinematic reveal + chapter watermarks + counters ---------- */
(function(){
  $$('.head').forEach(h=>{const b=$('.no b',h);if(b)h.setAttribute('data-no',b.textContent);});
  if(reduce||!('IntersectionObserver' in window))return;
  const sel='.head,.parties,.letter-grid > *,.timeline li,.accord,.why3 > div,.seasons > *,.sched-top,.chartbox,.hours3,.cols2 > *,.live,.clock,.flat,.map-grid > *,.formula,.modes > *,.regional,.summary,.controls,.tablebox,.incl section,.energy > *,.status-strip,.decide > *,.deadlines li,.paper';
  const els=$$(sel).filter(e=>!e.closest('.hero'));
  const vh=innerHeight;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const sib=[...el.parentNode.children].filter(x=>x.classList.contains('rv'));const i=Math.max(0,sib.indexOf(el));el.style.transitionDelay=(Math.min(i,4)*.05)+'s';el.classList.remove('pre');io.unobserve(el);}),{rootMargin:'0px 0px 12% 0px'}); // revealed just before they scroll in, never an empty band
  // a light fade-up (opacity + 14 px, no blur: cheap on phones) only for blocks below the first screen; it starts 12 % before a block
  // scrolls in, so it is already appearing when it comes into view — never an empty band; one layout read for all of them
  const tops=els.map(el=>el.getBoundingClientRect().top);els.forEach((el,i)=>{el.classList.add('rv');if(tops[i]>vh*1.05){el.classList.add('pre');io.observe(el);}});
  // counters in the letter figures
  const figs=$$('.fig b');
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,m=el.textContent.match(/^(\D*)(\d+)(.*)$/s);if(!m)return;const end=+m[2],t0=performance.now();
    (function tick(t){const k=Math.min(1,(t-t0)/900),v=Math.round(end*(1-Math.pow(1-k,3)));el.textContent=m[1]+v+m[3];if(k<1)requestAnimationFrame(tick);})(t0);}),{threshold:0,rootMargin:'0px 0px 10% 0px'});
  figs.forEach(f=>{if(/^\d/.test(f.textContent)&&f.getBoundingClientRect().top>vh)cio.observe(f);});
})();

/* ---------- II: season ring ---------- */
(function(){
  const svg=$('#ring'),NS='http://www.w3.org/2000/svg',txt=$('#seasonText');
  const S=[
    {k:'Есен',c1:'Tobacco Vanille',c2:'ЕСЕН · СЕГА',t:'Tobacco Vanille е топъл аромат и е подходящ за есенно-зимния сезон. Затова той е първият сезонен аромат на веригата. Ако някой аромат стане любим на клиентите и екипите, той може да се връща всяка година в същия сезон и да стане разпознаваем символ на АВАНТИ.'},
    {k:'Зима',c1:'Toffee',c2:'ЗИМА · ОТ ДЕКЕМВРИ',t:'За сезона, започващ от декември 2026 г., с голяма част от служителите се насочваме към аромата Toffee: мляко, карамел и коледно настроение. В случай че голяма част от персонала се спре на него, той ще бъде зареден едновременно във всички 48 обекта при посещението на обектите през декември.'},
    {k:'Пролет',c1:'Изборът на екипите',c2:'ПРОЛЕТ',t:'В началото на пролетта предлагаме нови подходящи аромата. Изборът отново е на екипите, а смяната става едновременно в цялата верига.'},
    {k:'Лято',c1:'Изборът на екипите',c2:'ЛЯТО',t:'В началото на лятото ароматът се сменя по същия начин: предложение, избор от служителите и едновременно зареждане във всички 48 обекта.'}
  ];
  const cx=150,cy=150,R=118,gap=.07;
  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const pt=(a,r)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];
  const arcs=[],labels=[];
  S.forEach((s,i)=>{
    const a0=i*Math.PI/2+gap,a1=(i+1)*Math.PI/2-gap,[x0,y0]=pt(a0,R),[x1,y1]=pt(a1,R);
    const p=el('path',{d:`M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,class:'arc',tabindex:'0',role:'button','aria-label':s.k});
    p.addEventListener('click',()=>sel(i));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(i);}});
    svg.appendChild(p);arcs.push(p);
    const am=(a0+a1)/2,[lx,ly]=pt(am,R+30);
    const t=el('text',{x:lx.toFixed(1),y:ly.toFixed(1),'text-anchor':'middle','dominant-baseline':'middle'});t.textContent=s.k;svg.appendChild(t);labels.push(t);
  });
  const c1=el('text',{x:cx,y:cy-4,'text-anchor':'middle',class:'c1'}),c2=el('text',{x:cx,y:cy+22,'text-anchor':'middle',class:'c2'});
  svg.appendChild(c1);svg.appendChild(c2);
  function sel(i){arcs.forEach((a,j)=>a.classList.toggle('on',j===i));labels.forEach((l,j)=>l.classList.toggle('on',j===i));c1.textContent=S[i].c1;c2.textContent=S[i].c2;txt.textContent=S[i].t;}
  sel(0);
})();

const HOURS={1:[420,1260,480,1200],2:[420,1260,480,1200],3:[420,1260,480,1200],4:[420,1260,480,1200],5:[420,1260,480,1200],6:[480,1260,480,1200],7:[420,1260,480,1200],8:[420,1260,480,1200],9:[420,1260,480,1200],10:[420,1260,480,1200],11:[420,1260,480,1200],12:[420,1260,480,1200],13:[480,1260,540,1200],14:[480,1260,540,1200],15:[420,1260,480,1200],16:[420,1260,480,1200],17:[420,1260,480,1200],18:[420,1260,480,1200],19:[480,1290,510,1230],20:[420,1260,480,1200],21:[420,1260,480,1200],22:[420,1260,480,1200],23:[420,1260,480,1200],24:[420,1260,480,1200],25:[420,1320,480,1320],26:[420,1260,480,1200],27:[420,1320,480,1320],28:[420,1260,480,1200],29:[420,1260,480,1200],30:[420,1260,480,1200],31:[420,1260,480,1200],32:[420,1260,480,1200],33:[420,1260,480,1200],34:[420,1260,480,1200],35:[480,1320,480,1320],36:[480,1320,480,1320],37:[420,1260,480,1200],38:[420,1260,480,1200],39:[420,1260,480,1200],40:[480,1290,480,1200],41:[480,1260,540,1200],42:[420,1260,480,1200],43:[450,1290,480,1200],44:[420,1260,480,1200],45:[420,1260,480,1200],46:[420,1260,480,1200],47:[420,1260,480,1200],48:[420,1260,480,1200]};
function hoursFor(n){const h=HOURS[n]||[420,1260,480,1200];const mk=(o,c)=>{const full=[o-10,c-10];let s0=Math.max(o,480),s1=Math.min(c,s0+720);if(c-o<=720){s0=o-10;s1=c-10;}return {open:o,close:c,full,std:[s0,s1]};};return {wd:mk(h[0],h[1]),sun:mk(h[2],h[3])};}

/* ---------- V: map of the chain ---------- */
const cityApi=(function(){
  const svg=$('#map'),panel=$('#cityPanel'),NS='http://www.w3.org/2000/svg';
  const BG=[[22.68,44.21],[22.88,43.99],[23.24,43.83],[23.96,43.74],[24.9,43.7],[25.35,43.62],[25.96,43.85],[26.61,44.05],[27.26,44.12],[27.72,43.95],[28.2,43.78],[28.58,43.74],[28.6,43.54],[28.47,43.36],[27.93,43.2],[27.9,42.85],[27.73,42.66],[27.47,42.49],[27.7,42.42],[27.76,42.27],[27.85,42.17],[28.03,41.98],[27.53,41.98],[27.05,42.08],[26.55,41.77],[26.33,41.72],[26.13,41.53],[25.9,41.35],[25.29,41.24],[24.6,41.43],[24.05,41.52],[23.63,41.38],[22.93,41.34],[22.95,41.6],[22.87,42.02],[22.36,42.31],[22.52,42.6],[22.44,42.85],[22.75,43.05],[22.36,43.4],[22.45,43.6],[22.55,43.9]];
  const K=128,KX=Math.cos(42.7*Math.PI/180),P=([lo,la])=>[(lo-22.2)*KX*K,(44.35-la)*K];
  const C=[{id:'София',lo:23.32,la:42.70,base:true,at:'left'},{id:'Велико Търново',lo:25.63,la:43.08,at:'right'},{id:'Варна',lo:27.91,la:43.21,base:true,at:'top'},{id:'Бургас',lo:27.47,la:42.50,at:'left'}];
  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  svg.appendChild(el('path',{d:'M'+BG.map(p=>P(p).map(v=>v.toFixed(1)).join(' ')).join(' L')+' Z',class:'land'}));
  const sea=el('text',{x:0,y:0,class:'sea',transform:'translate(636 150) rotate(90)'});sea.textContent='Черно море';svg.appendChild(sea);
  const pos={};C.forEach(c=>pos[c.id]=P([c.lo,c.la]));
  const route=(a,b,bend,cls)=>{const [x1,y1]=pos[a],[x2,y2]=pos[b],mx=(x1+x2)/2,my=(y1+y2)/2-bend;svg.appendChild(el('path',{d:`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`,class:'route'+(cls?' '+cls:'')}));};
  route('София','Велико Търново',40);route('София','Варна',110,'b');route('Варна','Бургас',-30);
  const G={};
  C.forEach(c=>{
    const n=ROWS.filter(r=>r.city===c.id).length,[x,y]=pos[c.id],r=5.5+Math.sqrt(n)*2.1;
    const g=el('g',{class:'city',tabindex:'0',role:'button','aria-label':c.id+', '+n+' обекта'});
    g.appendChild(el('circle',{cx:x,cy:y,r:r+6,class:'h'}));g.appendChild(el('circle',{cx:x,cy:y,r:r,class:'d'}));
    const cn=el('text',{x:x,y:y,class:'c'});cn.textContent=n;g.appendChild(cn);
    const lx=c.at==='left'?x-(r+10):c.at==='right'?x+r+10:x,an=c.at==='left'?'end':c.at==='right'?'start':'middle',ly=c.at==='top'?y-r-26:y-2;
    const t=el('text',{x:lx,y:ly,'text-anchor':an});t.textContent=c.id;g.appendChild(t);
    const s=el('text',{x:lx,y:ly+15,'text-anchor':an,class:'s'});s.textContent=c.base?'сервизен екип':'обслужва се от екипа във '+(c.id==='Велико Търново'?'София':'Варна');g.appendChild(s);
    
    g.addEventListener('click',()=>sel(c.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(c.id);}});
    svg.appendChild(g);G[c.id]=g;
  });
  const chips=$('#cityChips');C.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.c=c.id;b.innerHTML=c.id+' <b>'+ROWS.filter(r=>r.city===c.id).length+'</b>';b.addEventListener('click',()=>sel(c.id));chips.appendChild(b);});
  function sel(id){
    Object.entries(G).forEach(([k,g])=>g.classList.toggle('on',k===id));$$('#cityChips .chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===id)));
    const list=ROWS.filter(r=>r.city===id);
    panel.innerHTML='<h4>'+id+' <small>'+list.length+' '+(list.length===1?'обект':'обекта')+'</small></h4>'+
      '<ul>'+list.map(r=>'<li><b style="font-weight:500">'+r.name+'</b><span class="num">'+fmt(r.area)+' м²</span></li>').join('')+'</ul>'+
      '<button type="button" class="btn small" id="cityGo">Покажи в таблицата с цените</button>';
    $('#cityGo').addEventListener('click',()=>{tableApi.setCity(id);$('#ceni .controls').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});});
  }
  sel('Варна');
  return {sel};
})();


/* ---------- VI: summary + object table ---------- */
const tableApi=(function(){
  const tb=$('#rows'),tbl=$('#objTable'),more=$('#more'),PREVIEW=12;
  const LAT={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',ъ:'a',ь:'y',ю:'yu',я:'ya'};
  const lat=s=>s.toLowerCase().replace(/[а-я]/g,c=>LAT[c]||c).replace(/ts/g,'c').replace(/zh/g,'j').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ');
  let city='',q='',all=true,sk='n',sd=1,open=0;
  function list(){
    const ql=q.trim().toLowerCase();
    const fold=s=>lat(s).replace(/y(?=[aeiou])/g,'').replace(/j(?=[aeiou])/g,'').replace(/y/g,'i').replace(/sht|sh|ch/g,m=>m[0]).replace(/zh/g,'z').replace(/ts/g,'c');return ROWS.filter(r=>{if(city&&r.city!==city)return false;if(!ql)return true;const hay=(r.n+' '+r.name+' '+r.addr+' '+(r.city||'')).toLowerCase();return hay.includes(ql)||lat(hay).includes(lat(ql))||fold(hay).includes(fold(ql));})
      .sort((a,b)=>{const A=a[sk],B=b[sk];return (typeof A==='string'?A.localeCompare(B,'bg'):A-B)*sd;});
  }
  function render(){
    const L=list(),limited=!city&&!q.trim()&&!all&&sk==='n'&&sd===1,shown=limited?L.slice(0,PREVIEW):L;
    let s=0,f=0;L.forEach(r=>{s+=r.std;f+=r.full;});
    tb.innerHTML=shown.map((r,ri)=>'<tr class="row'+(ri%2?' alt':'')+'">'+
        '<td class="m n">'+r.n+'</td><td><b style="font-weight:600">'+r.name+'</b></td>'+
        '<td class="m">'+r.addr+'</td><td class="r">'+fmt(r.area)+'</td><td class="r cs">'+fmt(r.std)+'</td><td class="r cf">'+fmt(r.full)+'</td></tr>').join('')||'<tr><td colspan="6" class="m">Няма обект с това име, адрес или номер. Опитайте с част от името.</td></tr>';
    const n=L.length;
    $('#tLabel').textContent=(!city&&!q.trim()?'Общо на месец, 48 обекта, без ДДС':'Общо на месец, '+n+' '+(n===1?'обект':'обекта')+(city?' · '+city:'')+', без ДДС');
    $('#tStd').textContent=eur(s);$('#tFull').textContent=eur(f);
    if(more){more.hidden=!(limited&&L.length>PREVIEW);more.textContent='Покажи всички '+L.length+' обекта';}
    $$('#objTable thead th').forEach(th=>{const on=th.dataset.k===sk;th.setAttribute('aria-sort',on?(sd>0?'ascending':'descending'):'none');const b=$('button',th);b.querySelectorAll('.arr').forEach(x=>x.remove());if(on&&!(sk==='n'&&sd===1)){const a=document.createElement('span');a.className='arr';a.textContent=sd>0?'↑':'↓';b.appendChild(a);}});
  }
  $$('#ceni .controls .chip').forEach(b=>b.addEventListener('click',()=>setCity(b.dataset.city)));
  function setCity(c){city=c;$$('#ceni .controls .chip').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.city===c)));render();}
  $('#q').addEventListener('input',e=>{q=e.target.value;render();});
  if(more)more.addEventListener('click',()=>{all=true;render();});
  $$('#objTable thead th').forEach(th=>$('button',th).addEventListener('click',()=>{const k=th.dataset.k;if(sk===k)sd=-sd;else{sk=k;sd=1;}render();}));
  function paint(){tbl.classList.toggle('m-std',mode==='std');tbl.classList.toggle('m-full',mode==='full');
    $$('#summary .cs').forEach(c=>c.classList.toggle('sel',mode==='std'));$$('#summary .cf').forEach(c=>c.classList.toggle('sel',mode==='full'));}
  modeSubs.push(paint);
  render();paint();
  return {setCity};
})();

/* ---------- VIII: decision + letter ---------- */
(function(){
  let inv='split';
  const pre=$('#letter'),mt=$('#mailto');
  $('#bar48').innerHTML='<i></i>'.repeat(48);
  function text(){
    const sub=TOT[mode];
    return ['До: KAYA LUX („Унищожители“ ЕООД)','Относно: Оферта № 2026-148-А (актуализирана) от 01.10.2026 г.','',
      'Уважаеми г-н Великов,','',
      'Потвърждаваме, че за всички 48 обекта на веригата „АВАНТИ“ избираме режим „'+MODES[mode].name+'“.',
      'Месечна стойност по офертата: '+eur(sub)+' без ДДС за 48 обекта.',
      mode==='std'?'Моля, пренастройте графиците на системите при следващата Ви обиколка.':'Системите продължават да работят по сегашния график, без промени.',
      'Месечна фактура: '+(inv==='split'?'една фактура с разбивка по обекти.':'една фактура с обща стойност по офертата.'),'',
      'С уважение,','Татяна Попова','Верига „АВАНТИ“'].join('\n');
  }
  function upd(){if(!pre)return;const t=text();pre.textContent=t;mt.href='mailto:scent@kayalux.bg?subject='+encodeURIComponent('Потвърждение на режим · Оферта № 2026-148-А')+'&body='+encodeURIComponent(t);}
  $$('#invSeg [data-inv]').forEach(b=>b.addEventListener('click',()=>{inv=b.dataset.inv;$$('#invSeg [data-inv]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));upd();}));
  const cl=$('#copyLetter');if(cl)cl.addEventListener('click',e=>copyText(pre.textContent,e.currentTarget,pre));
  modeSubs.push(upd);upd();
})();


/*!
 * Signature Pad v5.1.4 | https://github.com/szimek/signature_pad
 * (c) 2026 Szymon Nowak | Released under the MIT license
 */
(function(g,f){if(typeof exports=="object"&&typeof module<"u"){module.exports=f()}else if("function"==typeof define && define.amd){define("SignaturePad",f)}else {g["SignaturePad"]=f()}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};
var y=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var W=Object.prototype.hasOwnProperty;var f=(u,n,t)=>()=>{if(t)throw t[0];try{return u&&(n=u(u=0)),n}catch(e){throw t=[e],e}};var L=(u,n)=>{for(var t in n)y(u,t,{get:n[t],enumerable:!0})},A=(u,n,t,e)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of U(n))!W.call(u,i)&&i!==t&&y(u,i,{get:()=>n[i],enumerable:!(e=M(n,i))||e.enumerable});return u};var G=u=>A(y({},"__esModule",{value:!0}),u);var b,P=f(()=>{"use strict";b=class{x;y;pressure;time;constructor(n,t,e,i){if(isNaN(n)||isNaN(t))throw new Error(`Point is invalid: (${n}, ${t})`);this.x=+n,this.y=+t,this.pressure=e||0,this.time=i||Date.now()}distanceTo(n){return Math.sqrt(Math.pow(this.x-n.x,2)+Math.pow(this.y-n.y,2))}equals(n){return this.x===n.x&&this.y===n.y&&this.pressure===n.pressure&&this.time===n.time}velocityFrom(n){return this.time!==n.time?this.distanceTo(n)/(this.time-n.time):0}}});var x,S=f(()=>{"use strict";P();x=class u{constructor(n,t,e,i,o,r){this.startPoint=n;this.control2=t;this.control1=e;this.endPoint=i;this.startWidth=o;this.endWidth=r}startPoint;control2;control1;endPoint;startWidth;endWidth;static fromPoints(n,t){let e=this.calculateControlPoints(n[0],n[1],n[2]).c2,i=this.calculateControlPoints(n[1],n[2],n[3]).c1;return new u(n[1],e,i,n[2],t.start,t.end)}static calculateControlPoints(n,t,e){let i=n.x-t.x,o=n.y-t.y,r=t.x-e.x,l=t.y-e.y,a={x:(n.x+t.x)/2,y:(n.y+t.y)/2},c={x:(t.x+e.x)/2,y:(t.y+e.y)/2},h=Math.sqrt(i*i+o*o),s=Math.sqrt(r*r+l*l),p=a.x-c.x,v=a.y-c.y,d=h+s==0?0:s/(h+s),_={x:c.x+p*d,y:c.y+v*d},m=t.x-_.x,g=t.y-_.y;return{c1:new b(a.x+m,a.y+g),c2:new b(c.x+m,c.y+g)}}length(){let t=0,e,i;for(let o=0;o<=10;o+=1){let r=o/10,l=this.point(r,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),a=this.point(r,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y);if(o>0){let c=l-e,h=a-i;t+=Math.sqrt(c*c+h*h)}e=l,i=a}return t}point(n,t,e,i,o){return t*(1-n)*(1-n)*(1-n)+3*e*(1-n)*(1-n)*n+3*i*(1-n)*n*n+o*n*n*n}}});var w,C=f(()=>{"use strict";w=class{_et;constructor(){try{this._et=new EventTarget}catch{this._et=document}}addEventListener(n,t,e){this._et.addEventListener(n,t,e)}dispatchEvent(n){return this._et.dispatchEvent(n)}removeEventListener(n,t,e){this._et.removeEventListener(n,t,e)}}});function O(u,n=250){let t=0,e=null,i,o,r,l=()=>{t=Date.now(),e=null,i=u.apply(o,r),e||(o=null,r=[])};return function(...c){let h=Date.now(),s=n-(h-t);return o=this,r=c,s<=0||s>n?(e&&(clearTimeout(e),e=null),t=h,i=u.apply(o,r),e||(o=null,r=[])):e||(e=window.setTimeout(l,s)),i}}var k=f(()=>{"use strict"});var T={};L(T,{default:()=>E});var E,D=f(()=>{"use strict";S();P();C();k();P();E=class u extends w{constructor(t,e={}){super();this.canvas=t;this.velocityFilterWeight=e.velocityFilterWeight||.7,this.minWidth=e.minWidth||.5,this.maxWidth=e.maxWidth||2.5,this.throttle=e.throttle??16,this.minDistance=e.minDistance??5,this.dotSize=e.dotSize||0,this.penColor=e.penColor||"black",this.backgroundColor=e.backgroundColor||"rgba(0,0,0,0)",this.compositeOperation=e.compositeOperation||"source-over",this.canvasContextOptions=e.canvasContextOptions??{},this._strokeMoveUpdate=this.throttle?O(u.prototype._strokeUpdate,this.throttle):u.prototype._strokeUpdate,this._handleMouseDown=this._handleMouseDown.bind(this),this._handleMouseMove=this._handleMouseMove.bind(this),this._handleMouseUp=this._handleMouseUp.bind(this),this._handleTouchStart=this._handleTouchStart.bind(this),this._handleTouchMove=this._handleTouchMove.bind(this),this._handleTouchEnd=this._handleTouchEnd.bind(this),this._handlePointerDown=this._handlePointerDown.bind(this),this._handlePointerMove=this._handlePointerMove.bind(this),this._handlePointerUp=this._handlePointerUp.bind(this),this._handlePointerCancel=this._handlePointerCancel.bind(this),this._handleTouchCancel=this._handleTouchCancel.bind(this),this._ctx=t.getContext("2d",this.canvasContextOptions),this.clear(),this.on()}canvas;dotSize;minWidth;maxWidth;penColor;minDistance;velocityFilterWeight;compositeOperation;backgroundColor;throttle;canvasContextOptions;_ctx;_drawingStroke=!1;_isEmpty=!0;_dataUrl;_dataUrlOptions;_lastPoints=[];_data=[];_lastVelocity=0;_lastWidth=0;_strokeMoveUpdate;_strokePointerId;clear(){let{_ctx:t,canvas:e}=this;t.fillStyle=this.backgroundColor,t.clearRect(0,0,e.width,e.height),t.fillRect(0,0,e.width,e.height),this._data=[],this._reset(this._getPointGroupOptions()),this._isEmpty=!0,this._dataUrl=void 0,this._dataUrlOptions=void 0,this._strokePointerId=void 0}redraw(){let t=this._data,e=this._dataUrl,i=this._dataUrlOptions;this.clear(),e&&this.fromDataURL(e,i),this.fromData(t,{clear:!1})}fromDataURL(t,e={}){return new Promise((i,o)=>{let r=new Image,l=e.ratio||window.devicePixelRatio||1,a=e.width||this.canvas.width/l,c=e.height||this.canvas.height/l,h=e.xOffset||0,s=e.yOffset||0;this._reset(this._getPointGroupOptions()),r.onload=()=>{this._ctx.drawImage(r,h,s,a,c),i()},r.onerror=p=>{o(p)},r.crossOrigin="anonymous",r.src=t,this._isEmpty=!1,this._dataUrl=t,this._dataUrlOptions={...e}})}toDataURL(t="image/png",e){return t==="image/svg+xml"?(typeof e!="object"&&(e=void 0),`data:image/svg+xml;base64,${btoa(this.toSVG(e))}`):(typeof e!="number"&&(e=void 0),this.canvas.toDataURL(t,e))}on(){this.canvas.style.touchAction="none",this.canvas.style.msTouchAction="none",this.canvas.style.userSelect="none",this.canvas.style.webkitUserSelect="none";let t=/Macintosh/.test(navigator.userAgent)&&"ontouchstart"in document;window.PointerEvent&&!t?this._handlePointerEvents():(this._handleMouseEvents(),"ontouchstart"in window&&this._handleTouchEvents())}off(){this.canvas.style.touchAction="auto",this.canvas.style.msTouchAction="auto",this.canvas.style.userSelect="auto",this.canvas.style.webkitUserSelect="auto",this.canvas.removeEventListener("pointerdown",this._handlePointerDown),this.canvas.removeEventListener("mousedown",this._handleMouseDown),this.canvas.removeEventListener("touchstart",this._handleTouchStart),this._removeMoveUpEventListeners()}_getListenerFunctions(){let t=window.document===this.canvas.ownerDocument?window:this.canvas.ownerDocument.defaultView??this.canvas.ownerDocument;return{addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}_removeMoveUpEventListeners(){let{removeEventListener:t}=this._getListenerFunctions();t("pointermove",this._handlePointerMove),t("pointerup",this._handlePointerUp),t("pointercancel",this._handlePointerCancel),t("mousemove",this._handleMouseMove),t("mouseup",this._handleMouseUp),t("touchmove",this._handleTouchMove),t("touchend",this._handleTouchEnd),t("touchcancel",this._handleTouchCancel)}isEmpty(){return this._isEmpty}fromData(t,{clear:e=!0}={}){e&&this.clear(),this._fromData(t,this._drawCurve.bind(this),this._drawDot.bind(this),this._drawLine.bind(this)),this._data=this._data.concat(t)}toData(){return this._data}_isLeftButtonPressed(t,e){return e?t.buttons===1:(t.buttons&1)===1}_pointerEventToSignatureEvent(t){return{event:t,type:t.type,x:t.clientX,y:t.clientY,pressure:"pressure"in t?t.pressure:0}}_touchEventToSignatureEvent(t){let e=t.changedTouches[0];return{event:t,type:t.type,x:e.clientX,y:e.clientY,pressure:e.force}}_handleMouseDown(t){!this._isLeftButtonPressed(t,!0)||this._drawingStroke||this._strokeBegin(this._pointerEventToSignatureEvent(t))}_handleMouseMove(t){if(!this._isLeftButtonPressed(t,!0)||!this._drawingStroke){this._strokeEnd(this._pointerEventToSignatureEvent(t),!1);return}this._strokeMoveUpdate(this._pointerEventToSignatureEvent(t))}_handleMouseUp(t){this._isLeftButtonPressed(t)||this._strokeEnd(this._pointerEventToSignatureEvent(t))}_handleTouchStart(t){t.targetTouches.length!==1||this._drawingStroke||(t.cancelable&&t.preventDefault(),this._strokeBegin(this._touchEventToSignatureEvent(t)))}_handleTouchMove(t){if(t.targetTouches.length===1){if(t.cancelable&&t.preventDefault(),!this._drawingStroke){this._strokeEnd(this._touchEventToSignatureEvent(t),!1);return}this._strokeMoveUpdate(this._touchEventToSignatureEvent(t))}}_handleTouchEnd(t){t.targetTouches.length===0&&(t.cancelable&&t.preventDefault(),this._strokeEnd(this._touchEventToSignatureEvent(t)))}_handlePointerCancel(t){this._allowPointerId(t)&&(t.preventDefault(),this._strokeEnd(this._pointerEventToSignatureEvent(t),!1))}_handleTouchCancel(t){t.cancelable&&t.preventDefault(),this._strokeEnd(this._touchEventToSignatureEvent(t),!1)}_getPointerId(t){return t.persistentDeviceId||t.pointerId}_allowPointerId(t,e=!1){return typeof this._strokePointerId>"u"?e:this._getPointerId(t)===this._strokePointerId}_handlePointerDown(t){this._drawingStroke||!this._isLeftButtonPressed(t)||!this._allowPointerId(t,!0)||(this._strokePointerId=this._getPointerId(t),t.preventDefault(),this._strokeBegin(this._pointerEventToSignatureEvent(t)))}_handlePointerMove(t){if(this._allowPointerId(t)){if(!this._isLeftButtonPressed(t,!0)||!this._drawingStroke){this._strokeEnd(this._pointerEventToSignatureEvent(t),!1);return}t.preventDefault(),this._strokeMoveUpdate(this._pointerEventToSignatureEvent(t))}}_handlePointerUp(t){this._isLeftButtonPressed(t)||!this._allowPointerId(t)||(t.preventDefault(),this._strokeEnd(this._pointerEventToSignatureEvent(t)))}_getPointGroupOptions(t){return{penColor:t&&"penColor"in t?t.penColor:this.penColor,dotSize:t&&"dotSize"in t?t.dotSize:this.dotSize,minWidth:t&&"minWidth"in t?t.minWidth:this.minWidth,maxWidth:t&&"maxWidth"in t?t.maxWidth:this.maxWidth,velocityFilterWeight:t&&"velocityFilterWeight"in t?t.velocityFilterWeight:this.velocityFilterWeight,compositeOperation:t&&"compositeOperation"in t?t.compositeOperation:this.compositeOperation}}_strokeBegin(t){if(!this.dispatchEvent(new CustomEvent("beginStroke",{detail:t,cancelable:!0})))return;let{addEventListener:i}=this._getListenerFunctions();switch(t.event.type){case"mousedown":i("mousemove",this._handleMouseMove,{passive:!1}),i("mouseup",this._handleMouseUp,{passive:!1});break;case"touchstart":i("touchmove",this._handleTouchMove,{passive:!1}),i("touchend",this._handleTouchEnd,{passive:!1}),i("touchcancel",this._handleTouchCancel,{passive:!1});break;case"pointerdown":i("pointermove",this._handlePointerMove,{passive:!1}),i("pointerup",this._handlePointerUp,{passive:!1}),i("pointercancel",this._handlePointerCancel,{passive:!1});break;default:}this._drawingStroke=!0;let o=this._getPointGroupOptions(),r={...o,points:[]};this._data.push(r),this._reset(o),this._strokeUpdate(t)}_strokeUpdate(t){if(!this._drawingStroke)return;if(this._data.length===0){this._strokeBegin(t);return}this.dispatchEvent(new CustomEvent("beforeUpdateStroke",{detail:t}));let e=this._createPoint(t.x,t.y,t.pressure),i=this._data[this._data.length-1],o=i.points,r=o.length>0&&o[o.length-1],l=r?e.distanceTo(r)<=this.minDistance:!1,a=this._getPointGroupOptions(i);if(!r||!(r&&l)){let c=this._addPoint(e,a);r?c&&this._drawCurve(c,a):this._drawDot(e,a),o.push({time:e.time,x:e.x,y:e.y,pressure:e.pressure})}this.dispatchEvent(new CustomEvent("afterUpdateStroke",{detail:t}))}_strokeEnd(t,e=!0){this._removeMoveUpEventListeners(),this._drawingStroke&&(e&&this._strokeUpdate(t),this._drawingStroke=!1,this._strokePointerId=void 0,this.dispatchEvent(new CustomEvent("endStroke",{detail:t})))}_handlePointerEvents(){this._drawingStroke=!1,this.canvas.addEventListener("pointerdown",this._handlePointerDown,{passive:!1})}_handleMouseEvents(){this._drawingStroke=!1,this.canvas.addEventListener("mousedown",this._handleMouseDown,{passive:!1})}_handleTouchEvents(){this.canvas.addEventListener("touchstart",this._handleTouchStart,{passive:!1})}_reset(t){this._lastPoints=[],this._lastVelocity=0,this._lastWidth=(t.minWidth+t.maxWidth)/2,this._ctx.fillStyle=t.penColor,this._ctx.globalCompositeOperation=t.compositeOperation}_createPoint(t,e,i){let o=this.canvas.getBoundingClientRect();return new b(t-o.left,e-o.top,i,new Date().getTime())}_addPoint(t,e){let{_lastPoints:i}=this;if(i.push(t),i.length>2){i.length===3&&i.unshift(i[0]);let o=this._calculateCurveWidths(i[1],i[2],e),r=x.fromPoints(i,o);return i.shift(),r}return null}_calculateCurveWidths(t,e,i){let o=i.velocityFilterWeight*e.velocityFrom(t)+(1-i.velocityFilterWeight)*this._lastVelocity,r=this._strokeWidth(o,i),l={end:r,start:this._lastWidth};return this._lastVelocity=o,this._lastWidth=r,l}_strokeWidth(t,e){return Math.max(e.maxWidth/(t+1),e.minWidth)}_drawCurveSegment(t,e,i){let o=this._ctx;o.moveTo(t,e),o.arc(t,e,i,0,2*Math.PI,!1),this._isEmpty=!1}_drawCurve(t,e){let i=this._ctx,o=t.endWidth-t.startWidth,r=Math.ceil(t.length())*2;i.beginPath(),i.fillStyle=e.penColor;for(let l=0;l<r;l+=1){let a=l/r,c=a*a,h=c*a,s=1-a,p=s*s,v=p*s,d=v*t.startPoint.x;d+=3*p*a*t.control1.x,d+=3*s*c*t.control2.x,d+=h*t.endPoint.x;let _=v*t.startPoint.y;_+=3*p*a*t.control1.y,_+=3*s*c*t.control2.y,_+=h*t.endPoint.y;let m=Math.min(t.startWidth+h*o,e.maxWidth);this._drawCurveSegment(d,_,m)}i.closePath(),i.fill()}_getDotSize(t){return t.dotSize>0?t.dotSize:(t.minWidth+t.maxWidth)/2}_drawDot(t,e){let i=this._ctx,o=this._getDotSize(e);i.beginPath(),this._drawCurveSegment(t.x,t.y,o),i.closePath(),i.fillStyle=e.penColor,i.fill()}_drawLine(t,e,i){let o=this._ctx;o.save(),o.beginPath(),o.moveTo(t.x,t.y),o.lineTo(e.x,e.y),o.lineWidth=this._getDotSize(i)*2,o.lineCap="round",o.strokeStyle=i.penColor,o.stroke(),o.restore(),this._isEmpty=!1}_fromData(t,e,i,o){for(let r of t){let{points:l}=r,a=this._getPointGroupOptions(r);if(l.length>2)for(let c=0;c<l.length;c+=1){let h=l[c],s=new b(h.x,h.y,h.pressure,h.time);c===0&&this._reset(a);let p=this._addPoint(s,a);p&&e(p,a)}else l.length===2?(this._reset(a),o(l[0],l[1],a)):(this._reset(a),i(l[0],a))}}toSVG({includeBackgroundColor:t=!1,includeDataUrl:e=!1}={}){let i=this._data,o=Math.max(window.devicePixelRatio||1,1),r=0,l=0,a=this.canvas.width/o,c=this.canvas.height/o,h=document.createElementNS("http://www.w3.org/2000/svg","svg");if(h.setAttribute("xmlns","http://www.w3.org/2000/svg"),h.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),h.setAttribute("viewBox",`${r} ${l} ${a} ${c}`),h.setAttribute("width",a.toString()),h.setAttribute("height",c.toString()),t&&this.backgroundColor){let s=document.createElement("rect");s.setAttribute("width","100%"),s.setAttribute("height","100%"),s.setAttribute("fill",this.backgroundColor),h.appendChild(s)}if(e&&this._dataUrl){let s=this._dataUrlOptions?.ratio||window.devicePixelRatio||1,p=this._dataUrlOptions?.width||this.canvas.width/s,v=this._dataUrlOptions?.height||this.canvas.height/s,d=this._dataUrlOptions?.xOffset||0,_=this._dataUrlOptions?.yOffset||0,m=document.createElement("image");m.setAttribute("x",d.toString()),m.setAttribute("y",_.toString()),m.setAttribute("width",p.toString()),m.setAttribute("height",v.toString()),m.setAttribute("preserveAspectRatio","none"),m.setAttribute("href",this._dataUrl),h.appendChild(m)}return this._fromData(i,(s,{penColor:p})=>{let v=document.createElement("path");if(!isNaN(s.control1.x)&&!isNaN(s.control1.y)&&!isNaN(s.control2.x)&&!isNaN(s.control2.y)){let d=`M ${s.startPoint.x.toFixed(3)},${s.startPoint.y.toFixed(3)} C ${s.control1.x.toFixed(3)},${s.control1.y.toFixed(3)} ${s.control2.x.toFixed(3)},${s.control2.y.toFixed(3)} ${s.endPoint.x.toFixed(3)},${s.endPoint.y.toFixed(3)}`;v.setAttribute("d",d),v.setAttribute("stroke-width",(s.endWidth*2.25).toFixed(3)),v.setAttribute("stroke",p),v.setAttribute("fill","none"),v.setAttribute("stroke-linecap","round"),h.appendChild(v)}},(s,{penColor:p,dotSize:v,minWidth:d,maxWidth:_})=>{let m=document.createElement("circle"),g=v>0?v:(d+_)/2;m.setAttribute("r",g.toString()),m.setAttribute("cx",s.x.toString()),m.setAttribute("cy",s.y.toString()),m.setAttribute("fill",p),h.appendChild(m)},(s,p,v)=>{let d=document.createElement("line");d.setAttribute("x1",s.x.toString()),d.setAttribute("y1",s.y.toString()),d.setAttribute("x2",p.x.toString()),d.setAttribute("y2",p.y.toString()),d.setAttribute("stroke",v.penColor),d.setAttribute("stroke-width",(this._getDotSize(v)*2).toString()),d.setAttribute("stroke-linecap","round"),h.appendChild(d)}),h.outerHTML}}});module.exports=(D(),G(T)).default;

if(__exports != exports)module.exports = exports;return module.exports}));
//# sourceMappingURL=signature_pad.umd.min.js.map
/* ---------- signature pad: SignaturePad (безие, дебелина по скорост и натиск), безкрайно „Назад“, повторно подписване ---------- */
(function(){
  const cv=$('#pad'),wrap=$('#padWrap'),box=$('#clientBox'),when=$('#signedWhen'),mail=$('#padMail'),bUndo=$('#padUndo'),bClear=$('#padClear'),bSign=$('#padSign'),bEdit=$('#padEdit'),bUp=$('#padUpload'),file=$('#padFile');if(!cv||!window.SignaturePad)return;
  let img=null,imgUrl='';/* качена снимка на подпис/печат – ляга под щрихите */
  const pad=new SignaturePad(cv,{penColor:'#15205c',minWidth:0.8,maxWidth:2.6,velocityFilterWeight:0.7,minDistance:0,throttle:0,dotSize:1.6});
  let cssW=0,cssH=0;
  const norm=data=>data.map(s=>({...s,points:s.points.map(p=>({x:p.x/cssW,y:p.y/cssH,pressure:p.pressure,time:p.time}))}));
  const denorm=data=>data.map(s=>({...s,points:s.points.map(p=>({x:p.x*cssW,y:p.y*cssH,pressure:p.pressure,time:p.time}))}));
  let keep=[];/* щрихите в относителни координати – за преоразмеряване, „Назад“ и запис */
  function underlay(g,w,h){if(!img)return;const k=Math.min((w*.9)/img.width,(h*.9)/img.height);const iw=img.width*k,ih=img.height*k;g.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih);}
  function paint(){pad.clear();underlay(cv.getContext('2d'),cssW,cssH);if(keep.length)pad.fromData(denorm(keep),{clear:false});ui();}
  function fit(){const r=cv.getBoundingClientRect();if(r.width<10)return;const dpr=Math.min(3,window.devicePixelRatio||1);cssW=r.width;cssH=r.height;cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);cv.getContext('2d').scale(dpr,dpr);paint();}
  const locked=()=>box.classList.contains('signed');
  function ui(){wrap.classList.toggle('has',keep.length>0||!!img);if(bUndo)bUndo.disabled=!keep.length||locked();}
  pad.addEventListener('beginStroke',()=>{window.__klBusy=true;wrap.classList.add('has');});
  pad.addEventListener('endStroke',()=>{window.__klBusy=false;document.dispatchEvent(new Event('kl-resume'));keep=norm(pad.toData());ui();});
  if(bUndo)bUndo.addEventListener('click',()=>{if(locked())return;keep.pop();paint();});
  bClear.addEventListener('click',()=>{if(locked())return;keep=[];img=null;imgUrl='';paint();});
  if(bUp&&file){bUp.addEventListener('click',()=>{if(!locked())file.click();});file.addEventListener('change',()=>{const f=file.files&&file.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{/* свиваме до 1600 px, за да е леко за запис и изпращане */const k=Math.min(1,1600/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);imgUrl=c.toDataURL(f.type==='image/png'?'image/png':'image/jpeg',0.9);const im2=new Image();im2.onload=()=>{img=im2;paint();};im2.src=imgUrl;};im.src=rd.result;};rd.readAsDataURL(f);file.value='';});}
  wrap.tabIndex=0;wrap.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!locked()){e.preventDefault();bUndo&&bUndo.click();}});
  function png(){/* 2x PNG, прозрачен фон; снимката (ако има) е под щрихите */const c=document.createElement('canvas');const s=1200/cssW;c.width=1200;c.height=Math.round(cssH*s);const p2=new SignaturePad(c,{penColor:'#15205c',minWidth:0.8*s,maxWidth:2.6*s,velocityFilterWeight:0.7});underlay(c.getContext('2d'),c.width,c.height);
    p2.fromData(keep.map(st=>({...st,points:st.points.map(p=>({x:p.x*1200,y:p.y*c.height,pressure:p.pressure,time:p.time}))})),{clear:false});p2.off();return c.toDataURL('image/png');}
  function hasSig(){return keep.length>0||!!img;}
  function mailLink(d){const t=['До: KAYA LUX („Унищожители“ ЕООД)','Относно: Оферта № 2026-148-А (актуализирана) от 01.10.2026 г.','',
    'Потвърждавам офертата за всички 48 обекта на веригата „АВАНТИ“ в режим „'+MODES[mode].name+'“, '+eur(TOT[mode])+' на месец без ДДС.',
    'Подписано на '+d+' на екрана на офертата.','','Татяна Попова','Верига „АВАНТИ“'].join('\n');
    mail.href='mailto:scent@kayalux.bg?subject='+encodeURIComponent('Подписана оферта № 2026-148-А · АВАНТИ')+'&body='+encodeURIComponent(t);}
  function sealed(d){box.classList.add('signed');pad.off();when.innerHTML='<span class="sealed">✓ Подписано на '+d+'</span>';mail.hidden=false;if(bEdit)bEdit.hidden=false;mailLink(d);ui();}
  function unseal(){box.classList.remove('signed');pad.on();when.textContent='';mail.hidden=true;if(bEdit)bEdit.hidden=true;store.set('kl-offer-sig','');ui();}
  bSign.addEventListener('click',()=>{if(!hasSig()){wrap.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260});return;}
    const dd=new Date(),d=String(dd.getDate()).padStart(2,'0')+'.'+String(dd.getMonth()+1).padStart(2,'0')+'.'+dd.getFullYear()+' г.',data=png();
    store.set('kl-offer-sig',JSON.stringify({d,data,mode,strokes:keep,img:imgUrl}));sealed(d);
    if(location.protocol.startsWith('http')){fetch('api/sign.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Татяна Попова',mode,total:TOT[mode],png:data})}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(j&&j.ok){when.innerHTML='<span class="sealed">✓ Подписано на '+d+' · получено от KAYA LUX</span>';mail.hidden=true;}}).catch(()=>{});}});
  if(bEdit)bEdit.addEventListener('click',unseal);
  modeSubs.push(()=>{if(locked())mailLink(when.textContent.replace(/^.*на /,''));});
  try{const s=JSON.parse(store.get('kl-offer-sig')||'null');if(s&&((s.strokes&&s.strokes.length)||s.img)){keep=s.strokes||[];if(s.img){imgUrl=s.img;const im=new Image();im.onload=()=>{img=im;paint();};im.src=imgUrl;}sealed(s.d);}}catch(e){}
  fit();if('ResizeObserver' in window)new ResizeObserver(()=>fit()).observe(cv);else addEventListener('resize',fit,{passive:true});
})();

/* ---------- IV: the store in 3D ---------- */
let HRS=hoursFor(7);
const space=(function(){
  const stage=$('#stage'),ovl=$('#ovl'),sel=$('#storeSel'),hud=$('#hud');
  const state={n:7,ceil:3.0,t:1050,day:'wd',unit:0,playing:false}; // схемата показва оживен следобед (17:30)
  // store picker
  ['София','Варна','Бургас','Велико Търново'].forEach(c=>{const og=document.createElement('optgroup');const L=ROWS.filter(r=>r.city===c);og.label=c+' ('+L.length+')';
    L.forEach(r=>{const o=document.createElement('option');o.value=r.n;o.textContent='№ '+r.n+' · '+r.name+' · '+fmt(r.area)+' м²';og.appendChild(o);});sel.appendChild(og);});
  sel.value=state.n;
  const row=()=>ROWS.find(r=>r.n===state.n);
  function syncHours(){HRS=hoursFor(state.n);}
  const PLAN=(()=>{const m={};ROWS.forEach(r=>{const a=r.area,c=r.city;let mdl='PG',n;
    if(c==='Варна'||c==='Велико Търново'){mdl='PL';n=1;}
    else if(c==='Бургас'){mdl='PL';n=1;}
    else if(r.n===25||r.n===43)n=3;else n=a<=90?1:(a<=144?2:3);
    // dark interior (wood/black shelving) -> black unit; light interior -> white unit: seeded per store so it is stable
    const col=((r.n*7919)%10)<8?'b':'w';m[r.n]={mdl,n,col};});return m;})();
  const plan=()=>PLAN[state.n];
  const count=()=>plan().n;
  $('#cntPG').firstChild.nodeValue=Object.values(PLAN).filter(p=>p.mdl==='PG').reduce((s,p)=>s+p.n,0)+' ';
  $('#cntPL').firstChild.nodeValue=Object.values(PLAN).filter(p=>p.mdl==='PL').reduce((s,p)=>s+p.n,0)+' ';
  const H=()=>state.ceil;

  function unitsFor(A){
    const P=plan(),n=P.n,hi=state.ceil>=3.3,pl=P.mdl==='PL',colN=pl?'черно стъкло и рамка в цвят шампанско':(P.col==='w'?'бял корпус':'черен корпус');
    const model=(pl?'Prime Lux':'Plug’n Go')+', '+colN+(hi?'. При висок таван системата е настроена на по-висока интензивност, за да е ароматът еднакво силен навсякъде.':'.');
    const base={model};
    if(pl)return [{...base,title:'Дифузер Prime Lux',zone:'Търговска зала',why:'Една по-мощна система с голямо покритие вместо няколко по-малки. Поставена високо на стената, тя разпределя аромата равномерно в цялото помещение, а в залата има по-малко оборудване.',at:'L',f:-.05}];
    if(n===1)return [{...base,title:'Дифузер при входа',zone:'Над входната врата',why:'В обект до 90 м² една система над входа е достатъчна: ароматът посреща клиента още при влизането и стига до цялата зала.',at:'D',f:0}];
    if(n===2)return [
      {...base,title:'Дифузер при входа',zone:'Над входната врата',why:'Входът и касата са зоните с най-голям поток клиенти. Ароматът посреща клиентите още при влизането.',at:'D',f:0},
      {...base,title:'Дифузер във вътрешната част',zone:'Вътрешна част на обекта',why:'Покрива далечната половина на залата, включително хладилните витрини, за да е ароматът еднакво силен навсякъде.',at:'B',f:-.12}];
    return [
      {...base,title:'Дифузер при входа',zone:'Над входната врата',why:'Входът и касата са зоните с най-голям поток клиенти. Ароматът посреща клиентите още при влизането.',at:'D',f:0},
      {...base,title:'Дифузер в залата',zone:'Странична стена, средата на залата',why:'При голяма площ ароматът се подава от няколко точки, за да е еднакво силен в цялата зала.',at:'L',f:-.18},
      {...base,title:'Дифузер в задната част',zone:'Задна част, към склада',why:'Покрива задната част на залата и зоната към склада, до които ароматът от входа не стига със същата сила.',at:'P',f:0}];
  }
  function schedText(){
    const h=HRS,wk=((h.wd.full[1]-h.wd.full[0])*6+(h.sun.full[1]-h.sun.full[0]))/60;
    if(mode==='full')return 'Пълно работно време: пон.–съб. '+hm(h.wd.full[0])+'–'+hm(h.wd.full[1])+', нед. '+hm(h.sun.full[0])+'–'+hm(h.sun.full[1])+' (10 минути преди отварянето до 10 минути преди затварянето) · '+(wk%1?wk.toFixed(1).replace('.',','):wk)+' ч седмично. Обектът работи '+hm(h.wd.open)+'–'+hm(h.wd.close)+', нед. '+hm(h.sun.open)+'–'+hm(h.sun.close)+'.';
    return 'Стандартен режим: до 12 часа на ден, тук '+hm(h.wd.std[0])+'–'+hm(h.wd.std[1])+' (нед. '+hm(h.sun.std[0])+'–'+hm(h.sun.std[1])+'). Обектът работи '+hm(h.wd.open)+'–'+hm(h.wd.close)+'.';
  }
  function paintCard(){
    const r=row(),U=S.units&&S.units.length?S.units:unitsFor(r.area).map(u=>({info:u})),n=U.length,i=Math.min(state.unit,n-1),u=U[i].info,mdl=plan().mdl,col=plan().col;
    $('#scBadge').textContent=i+1;$('#scTitle').textContent=u.title;$('#scZone').textContent=u.zone;$('#scWhy').textContent=u.why;
    $('#scServe').textContent='≈ '+Math.round(r.area/n)+' м² площ и ≈ '+Math.round(r.area*H()/n)+' м³ обем'+(n>1?' (своята зона)':'');
    $('#scModel').textContent=u.model;$('#scRun').textContent=schedText();
    $('#sysList').innerHTML=U.map((x,j)=>'<button type="button" data-u="'+j+'" aria-pressed="'+(j===i)+'">'+(j+1)+' · '+x.info.zone+'</button>').join('');
    hud.innerHTML='<span class="num">'+(S.shape==='L'?'Г-образен план · ':S.shape==='sq'?'квадратен план · ':'правоъгълен план · ')+fmt(r.area)+' м² · таван '+state.ceil.toFixed(1).replace('.',',')+' м · обем ≈ '+Math.round(r.area*H())+' м³ · '+n+' '+(n===1?'система':'системи')+'</span><em class="tag">'+(mdl==='PL'?'Дифузер Prime Lux · черно стъкло, рамка шампанско':'Дифузер · '+(col==='w'?'бял корпус':'черен корпус'))+' · план: типичен</em>';
    $$('.pin',ovl).forEach((p,j)=>p.classList.toggle('on',j===i));
  }
  let focusUnit=()=>{};
  $('#sysList').addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(b){pick(+b.dataset.u);focusUnit(+b.dataset.u);}});
  function pick(i){state.unit=i;paintCard();}

  // no clock on the page any more: the set shows a busy weekday afternoon with the systems on
  const winOf=()=>HRS[state.day][mode];
  function sysOn(t){const w=winOf();return t>=w[0]&&t<w[1];}
  function isOpen(t){const h=HRS[state.day];return t>=h.open&&t<h.close;}
  function paintClock(){stage.style.setProperty('--night','0');}
  (function(){const r=$('#ceilRange'),o=$('#ceilOut');let tm=0;r.addEventListener('input',()=>{state.ceil=+r.value;o.textContent=r.value.replace('.',',')+' м';clearTimeout(tm);tm=setTimeout(rebuild,180);});})();
  sel.addEventListener('change',()=>{state.n=+sel.value;state.unit=0;rebuild();});
  modeSubs.push(()=>{paintClock();paintCard();});

  let S={units:[]},three=null,kick=()=>{};
  function rebuild(){syncHours();state.unit=0;if(three)three.build();else{S={units:[]};}paintCard();paintClock();}

  function show(n){state.n=n;sel.value=n;syncHours();state.unit=0;rebuild();$('#prostranstvo').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}

  function fallback(){$('#stageFallback').hidden=false;stage.style.cursor='default';}

  function init3D(){
    const T=window.THREE;if(!T){fallback();return;}
    let renderer;try{renderer=new T.WebGLRenderer({antialias:TIER>0,alpha:true,powerPreference:'high-performance'});}catch(e){fallback();return;}
    if(!renderer.getContext()){fallback();return;}
    if(window.KL_GLTF){KL_GLTF.renderer=renderer;KL_GLTF.models.forEach(m=>m.scene.traverse(x=>{if(x.isMesh&&x.material)['map','normalMap','alphaMap'].forEach(k=>{if(x.material[k])renderer.initTexture(x.material[k]);});}));}
    const small=()=>stage.clientWidth<640;
    const DPR=devicePixelRatio||1,dprMax=TIER===2?Math.min(DPR,1.25):TIER===1?Math.min(DPR,1.15):Math.min(DPR,.85);let dpr=dprMax;renderer.setPixelRatio(dpr);
    renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=TIER>0;renderer.shadowMap.autoUpdate=false; /* shadows of the fixed store only: drawn once per build, not every frame */renderer.shadowMap.type=TIER===2?T.PCFSoftShadowMap:T.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden','true');
    stage.insertBefore(renderer.domElement,stage.firstChild);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,300);
    const hemi=new T.HemisphereLight(0xfff6e8,0x3a2a2c,.42),amb=new T.AmbientLight(0xffffff,.14),key=new T.DirectionalLight(0xfff1d6,.5),fill=new T.DirectionalLight(0xdfe8ff,.16);fill.position.set(12,8,-6);scene.add(fill);
    key.castShadow=true;{const SM=small()?512:1024;key.shadow.mapSize.set(SM,SM);}key.shadow.bias=-.0006;scene.add(hemi,amb,key,key.target);
    const room=new T.Group();scene.add(room);
    const lin=hex=>new T.Color(hex||'#888').convertSRGBToLinear();
    const M={};
    function roundedBox(w,h,d,r){const s=new T.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
      const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelThickness:r*.6,bevelSize:r*.6,bevelSegments:2});g.translate(0,0,-d/2);return g;}
    function badgeTex(){if(!logoMono)return null;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const iw=logoMono.width,ih=logoMono.height,k=Math.min(96/iw,96/ih);g.drawImage(logoMono,64-iw*k/2,64-ih*k/2,iw*k,ih*k);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
    const tex2=(w,h,fn,rep)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;}t.anisotropy=4;return t;};
    const speck=(g,w,h,n,a,col,sz)=>{for(let i=0;i<n;i++){g.fillStyle='rgba('+(col||'0,0,0')+','+(Math.random()*a).toFixed(3)+')';g.fillRect(Math.random()*w,Math.random()*h,sz||1.5,sz||1.5);}};
    // floor: polished black stone, 60 cm tiles with hair-thin warm joints and faint veining; low roughness so the store lights and the scent glow reflect
    // floor: polished dark porcelain, 60 cm tiles (2x2 per 1.2 m repeat) with light veining, a fine bevel at every edge (normal map) and grey grout;
    // the tiles are glossy (roughness map), the grout matt, so the ceiling strips and the fridges reflect in the floor as in a real shop
    M.floor=new T.MeshStandardMaterial({roughness:1,metalness:.02,envMapIntensity:1.0});
    M.floor.map=tex2(512,512,(g,w,h)=>{g.fillStyle='#2c2b2c';g.fillRect(0,0,w,h);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const v=14+Math.random()*6;g.fillStyle='rgb('+v+','+v+','+(v+2)+')';g.fillRect(i*256+2,j*256+2,252,252);
        for(let n=0;n<7;n++){g.strokeStyle='rgba(215,205,185,'+(.03+Math.random()*.06).toFixed(3)+')';g.lineWidth=.6+Math.random()*1.6;g.beginPath();const x0=i*256+Math.random()*256,y0=j*256+Math.random()*256;g.moveTo(x0,y0);g.bezierCurveTo(x0+Math.random()*160-80,y0+Math.random()*160-80,x0+Math.random()*200-100,y0+Math.random()*200-100,x0+Math.random()*260-130,y0+Math.random()*260-130);g.stroke();}
        const sh=g.createLinearGradient(i*256,j*256,i*256+256,j*256+256);sh.addColorStop(0,'rgba(255,255,255,.035)');sh.addColorStop(1,'rgba(0,0,0,.05)');g.fillStyle=sh;g.fillRect(i*256+2,j*256+2,252,252);}
      speck(g,w,h,1600,.045,'255,255,255',1.2);},true);
    M.floor.roughnessMap=tex2(512,512,(g,w,h)=>{g.fillStyle='#c0c0c0';g.fillRect(0,0,w,h);g.fillStyle='#5a5a5a';for(let i=0;i<2;i++)for(let j=0;j<2;j++)g.fillRect(i*256+2,j*256+2,252,252);speck(g,w,h,700,.2,'255,255,255',2);},true);
    M.floor.roughnessMap.encoding=T.LinearEncoding;
    M.floor.normalMap=tex2(512,512,(g,w,h)=>{g.fillStyle='rgb(128,128,255)';g.fillRect(0,0,w,h);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=i*256,y=j*256;g.fillStyle='rgb(96,128,255)';g.fillRect(x,y,4,256);g.fillStyle='rgb(160,128,255)';g.fillRect(x+252,y,4,256);g.fillStyle='rgb(128,160,255)';g.fillRect(x,y,256,4);g.fillStyle='rgb(128,96,255)';g.fillRect(x,y+252,256,4);}},true);
    M.floor.normalMap.encoding=T.LinearEncoding;M.floor.normalScale=new T.Vector2(.6,.6);
    // walls: burgundy with a fine plaster speckle
    M.wall=new T.MeshStandardMaterial({roughness:.9,envMapIntensity:.18,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#7a1f2b';g.fillRect(0,0,w,h);for(let n=0;n<26;n++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,220,220')+','+(Math.random()*.035).toFixed(3)+')';g.beginPath();g.ellipse(Math.random()*w,Math.random()*h,20+Math.random()*60,6+Math.random()*18,Math.random()*3,0,6.283);g.fill();}speck(g,w,h,6000,.07,'0,0,0',2);speck(g,w,h,2000,.06,'255,255,255',2);},true)}); // painted plaster: roller marks under the speckle
    M.wallB=M.wall.clone();M.wallL=M.wall.clone();M.wallF=M.wall.clone();
    // light oak / beech shelving with a faint grain
    M.oak=new T.MeshStandardMaterial({roughness:.55,envMapIntensity:.5,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#d9b98a';g.fillRect(0,0,w,h);for(let b_=0;b_<6;b_++){g.fillStyle='rgba(255,236,200,'+(Math.random()*.12).toFixed(3)+')';const x=Math.random()*w;g.fillRect(x,0,10+Math.random()*30,h);}
      for(let i=0;i<48;i++){g.strokeStyle='rgba(118,78,38,'+(.05+Math.random()*.13).toFixed(3)+')';g.lineWidth=.6+Math.random()*2;const x=Math.random()*w;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+Math.random()*10-5,h*.33,x+Math.random()*12-6,h*.66,x+Math.random()*8-4,h);g.stroke();}
      for(let k=0;k<2;k++){const x=Math.random()*w,y=Math.random()*h;for(let r=9;r>1;r-=2){g.strokeStyle='rgba(110,70,32,'+(.1+r*.01).toFixed(2)+')';g.lineWidth=1;g.beginPath();g.ellipse(x,y,r*1.4,r*.7,.3,0,6.283);g.stroke();}}
      speck(g,w,h,1500,.05,'255,255,255',2);},true)}); // oak with real grain: wavy fibres, lighter bands, a knot or two, a satin finish
    // ceiling: white suspended tiles, 60 cm grid (2x2 per 1.2 m repeat)
    M.ceil=new T.MeshBasicMaterial({map:tex2(256,256,(g,w,h)=>{g.fillStyle='#e4e1da';g.fillRect(0,0,w,h);speck(g,w,h,2500,.06,'0,0,0',2);g.fillStyle='#bdb8ae';g.fillRect(0,0,w,2);g.fillRect(0,128,w,2);g.fillRect(0,0,2,h);g.fillRect(128,0,2,h);},true)});
    M.led=new T.MeshBasicMaterial({color:0xdcd9d2});
    M.aoV=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5,depthWrite:false,map:tex2(8,64,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);})}); // the shade every shelf throws on the goods below it
    const signMats={};const signMat=t=>signMats[t]||(signMats[t]=new T.MeshBasicMaterial({map:tex2(512,96,(g,w,h)=>{g.fillStyle='#5a1620';g.fillRect(0,0,w,h);g.strokeStyle='#c9a86a';g.lineWidth=3;g.strokeRect(6,6,w-12,h-12);g.fillStyle='#e8d3a2';g.font='bold 40px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(t.toUpperCase(),w/2,h/2+2);})})); // printed category boards, burgundy with a gold rule
    M.ao=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.42,depthWrite:false,map:tex2(64,8,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);})});
    M.blob=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5,depthWrite:false,map:tex2(64,64,(g,w,h)=>{const gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.5,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);})});
    M.grille=new T.MeshStandardMaterial({roughness:.7,map:tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8d90';g.fillRect(0,0,w,h);g.fillStyle='#3a3c3e';for(let i=0;i<8;i++)g.fillRect(4,4+i*7.5,56,3);})});
    M.glass=new T.MeshStandardMaterial({color:0xa9c0d0,transparent:true,opacity:.1,roughness:.08,metalness:.1,depthWrite:false,envMapIntensity:1});
    M.glassC=new T.MeshStandardMaterial({color:0xd6e6f2,transparent:true,opacity:.18,roughness:.04,metalness:.05,depthWrite:false,envMapIntensity:1.4,side:T.DoubleSide});
    M.cool=new T.MeshStandardMaterial({color:0xdfe7ee,emissive:0xcfe2f4,emissiveIntensity:.5,roughness:.4});
    M.unit=new T.MeshStandardMaterial({color:0x17130f,roughness:.3,metalness:.55});M.champ=new T.MeshStandardMaterial({color:0xcdb792,roughness:.32,metalness:.85,envMapIntensity:1.1});M.bglass=new T.MeshStandardMaterial({color:0x050505,roughness:.06,metalness:.4,envMapIntensity:1.6});M.chrome=new T.MeshStandardMaterial({color:0xd9d9d6,roughness:.18,metalness:.95});M.plDisp=new T.MeshBasicMaterial({color:0x8a8f93});M.unitW=new T.MeshStandardMaterial({color:0xf4f1ea,roughness:.42,metalness:.05});
    M.grB=new T.MeshStandardMaterial({color:0x0a0908,roughness:.9});M.grW=new T.MeshStandardMaterial({color:0xdad6cd,roughness:.9});
    M.ledDot=new T.MeshBasicMaterial({vertexColors:true});
    M.badge=new T.MeshBasicMaterial({transparent:true,opacity:.9,depthWrite:false});
    // vertex-coloured props: every small coloured object in the store shares these two materials (one draw call each)
    M.vc=new T.MeshStandardMaterial({vertexColors:true,roughness:.62,envMapIntensity:.35});
    M.vcF=M.vc.clone();M.vcC=M.vc.clone();M.ledC=new T.MeshBasicMaterial({color:0xdcd9d2});
    M.vcm=new T.MeshStandardMaterial({vertexColors:true,roughness:.28,metalness:.75,envMapIntensity:1});
    M.vc2=new T.MeshStandardMaterial({vertexColors:true,roughness:.7,side:T.DoubleSide,envMapIntensity:.3});
    M.screen=new T.MeshStandardMaterial({color:0x0b1a2a,emissive:0x9fc7ff,emissiveIntensity:.6,roughness:.2,map:tex2(128,96,(g,w,h)=>{g.fillStyle='#0e2740';g.fillRect(0,0,w,h);g.fillStyle='#1f5a8a';g.fillRect(0,0,w,16);g.fillStyle='#fff';g.font='bold 9px Arial';g.fillText('АВАНТИ · КАСА 1',6,11);g.fillStyle='#d8e8f8';g.font='8px Arial';['Вино 0,75 л         4,59','Чипс 140 г          1,29','Кафе 250 г          3,59','Вода 1,5 л          0,49'].forEach((s,i)=>g.fillText(s,6,30+i*12));g.fillStyle='#ffd27a';g.font='bold 11px Arial';g.fillText('ОБЩО   9,96 €',6,88);})});
    M.screen.emissiveMap=M.screen.map;M.screen.emissive.set(0xffffff);M.screen.emissiveIntensity=.9;
    M.screen2=new T.MeshStandardMaterial({color:0x111,emissive:0x8fd0a0,emissiveIntensity:.8});M.keys=new T.MeshStandardMaterial({color:0x2a2a2a,roughness:.6,map:tex2(64,64,(g,w,h)=>{g.fillStyle='#2a2a2a';g.fillRect(0,0,w,h);g.fillStyle='#d8d8d8';for(let i=0;i<3;i++)for(let j=0;j<4;j++)g.fillRect(4+i*20,4+j*15,14,10);g.fillStyle='#3c9a3e';g.fillRect(44,49,14,10);g.fillStyle='#c8382e';g.fillRect(4,49,14,10);})});
    const script=(g,w,h,bg,txt,fg,size)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='italic bold '+size+'px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2);};
    M.headCoke=new T.MeshBasicMaterial({map:tex2(256,80,(g,w,h)=>{script(g,w,h,'#d3232a','Coca-Cola','#fff',44);g.fillStyle='#fff';g.fillRect(0,0,w,3);g.fillRect(0,h-3,w,3);})});
    M.headBeer=new T.MeshBasicMaterial({map:tex2(256,80,(g,w,h)=>{g.fillStyle='#f28c28';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.beginPath();g.arc(30,40,22,0,6.283);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.arc(30,40,14,0,6.283);g.fill();const t_='СТУДЕНА БИРА',x0=60,x1=w-8;let fs=30;g.font='bold '+fs+'px Inter, Arial';while(g.measureText(t_).width>x1-x0&&fs>14){fs--;g.font='bold '+fs+'px Inter, Arial';}g.textAlign='center';g.textBaseline='middle';g.fillText(t_,(x0+x1)/2,h/2); /* the text fits right of the cap, whole (the cap used to cover the „С“) */})});
    M.milka=new T.MeshBasicMaterial({map:tex2(256,512,(g,w,h)=>{script(g,w,h,'#5b2d8e','Milka','#fff',72);g.fillStyle='#e9e2f2';g.beginPath();g.arc(128,380,60,0,6.283);g.fill();g.fillStyle='#4a2a14';g.beginPath();g.arc(128,380,44,0,6.283);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(128,380,16,0,6.283);g.fill();})});
    M.haribo=new T.MeshBasicMaterial({map:tex2(256,96,(g,w,h)=>{g.fillStyle='#f5c400';g.fillRect(0,0,w,h);g.fillStyle='#d3232a';g.font='bold 54px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('HARIBO',w/2,h/2);})});
    M.headBurg=new T.MeshBasicMaterial({map:tex2(256,80,(g,w,h)=>{g.fillStyle='#f2c400';g.fillRect(0,0,w,h);g.fillStyle='#8a1a1a';g.font='bold 40px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('БУРГАСКО',w/2,h/2);g.fillStyle='#8a1a1a';g.fillRect(0,0,w,4);g.fillRect(0,h-4,w,4);})});
    M.facade=new T.MeshBasicMaterial({map:tex2(1024,128,(g,w,h)=>{g.fillStyle='#141414';g.fillRect(0,0,w,h);g.fillStyle='#e3202b';g.font='bold 74px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('АВАНТИ',w/2,50);g.fillStyle='#f4f4f4';g.font='bold 20px Inter, Arial';g.fillText('БЕЗАЛКОХОЛНИ · СОКОВЕ · КАФЕ · ЗАХАРНИ ИЗДЕЛИЯ',w/2,106);g.fillRect(60,88,w-120,1);})});
    M.adPoster=new T.MeshBasicMaterial({map:tex2(256,384,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#f3e6d2');gr.addColorStop(1,'#c9a37a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#e8c4a4';g.beginPath();g.arc(150,120,44,0,6.283);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.ellipse(150,92,50,30,0,Math.PI,6.283);g.fill();g.fillStyle='#1b1917';g.fillRect(132,98,36,12);g.fillStyle='#e8c4a4';g.fillRect(96,170,108,150);g.fillStyle='#f6c04a';g.fillRect(52,200,34,80);g.fillStyle='#fff6d6';g.fillRect(52,196,34,14);g.fillStyle='#d3232a';g.fillRect(14,14,80,44);g.fillStyle='#fff';g.font='bold 15px Inter, Arial';g.textAlign='center';g.fillText('АВАНТИ',54,42);g.fillStyle='#4a3a2a';g.font='italic 16px Georgia, serif';g.fillText('The best is just before you',128,360);})});
    M.avantiRed=new T.MeshBasicMaterial({side:T.DoubleSide,map:tex2(96,128,(g,w,h)=>{g.fillStyle='#d3232a';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='bold 18px Inter, Arial';g.textAlign='center';g.fillText('АВАНТИ',48,40);g.font='9px Arial';for(let i=0;i<5;i++)g.fillRect(14,60+i*11,68-i*8,3);})});
    M.exit=new T.MeshBasicMaterial({map:tex2(128,52,(g,w,h)=>{g.fillStyle='#1f7a3e';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='bold 22px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('ИЗХОД →',w/2-4,h/2);})});
    M.asphalt=new T.MeshStandardMaterial({roughness:1,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#4a4a4c';g.fillRect(0,0,w,h);speck(g,w,h,5000,.25,'0,0,0',2);speck(g,w,h,2500,.12,'255,255,255',2);g.fillStyle='#d8d8d2';g.fillRect(0,120,w,6);},true)});
    M.asphalt.map.repeat.set(8,4);
    M.street=new T.MeshBasicMaterial({map:tex2(1024,160,(g,w,h)=>{const sk=g.createLinearGradient(0,0,0,h);sk.addColorStop(0,'#9fb6c8');sk.addColorStop(1,'#d9d4c8');g.fillStyle=sk;g.fillRect(0,0,w,h);g.fillStyle='#6f6a63';for(let i=0;i<9;i++){const bw=60+Math.random()*90,bh=40+Math.random()*70,x=i*115;g.fillRect(x,h-50-bh,bw,bh);}g.fillStyle='#3f6a3a';for(let i=0;i<14;i++){g.beginPath();g.arc(30+i*75,h-60,22+Math.random()*10,0,6.283);g.fill();}g.fillStyle='#3a3a3c';g.fillRect(0,h-50,w,50);const cols=['#dedede','#2a2a2e','#8a1a1a','#3a4a7a','#c8c8c8','#5a5a5a'];for(let i=0;i<12;i++){g.fillStyle=cols[i%cols.length];g.fillRect(20+i*84,h-46,60,26);g.fillStyle='#1a1a1a';g.fillRect(26+i*84,h-24,12,6);g.fillRect(62+i*84,h-24,12,6);}})});
    M.promoHead=new T.MeshBasicMaterial({map:tex2(256,160,(g,w,h)=>{g.fillStyle='#f3efe6';g.fillRect(0,0,w,h);g.fillStyle='#d3232a';g.fillRect(0,0,w,60);g.fillStyle='#fff';g.font='bold 40px Inter, Arial';g.textAlign='center';g.fillText('ПРОМО',128,46);g.fillStyle='#141210';g.font='bold 64px Inter, Arial';g.fillText('-20%',128,130);})});
    M.poster=new T.MeshStandardMaterial({roughness:.8,map:tex2(256,384,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1f6b3a');gr.addColorStop(1,'#5aa050');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#d3232a';g.fillRect(0,300,w,84);g.fillStyle='#fff';g.font='bold 44px Inter, Arial';g.textAlign='center';g.fillText('АВАНТИ',128,356);g.fillStyle='#f3e2b8';g.font='italic 30px Georgia, serif';g.fillText('Мечтай за',128,80);g.fillText('лятото',128,120);g.fillStyle='#e8c46a';g.beginPath();g.arc(128,210,60,0,6.283);g.fill();g.fillStyle='#3c7a3e';g.fillRect(118,140,20,30);})});
    M.signOpen=new T.MeshBasicMaterial({side:T.DoubleSide,map:tex2(256,160,(g,w,h)=>{g.fillStyle='#1f7a3e';g.fillRect(0,0,w,h);g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#fff';g.font='bold 44px Inter, Arial';g.textAlign='center';g.fillText('ОТВОРЕНО',128,96);})});
    M.signClosed=new T.MeshBasicMaterial({side:T.DoubleSide,map:tex2(256,160,(g,w,h)=>{g.fillStyle='#a8231f';g.fillRect(0,0,w,h);g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#fff';g.font='bold 40px Inter, Arial';g.textAlign='center';g.fillText('ЗАТВОРЕНО',128,96);})});
    M.cctv=new T.MeshBasicMaterial({side:T.DoubleSide,map:tex2(160,224,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#d3232a';g.fillRect(0,0,w,10);g.fillRect(0,h-10,w,10);g.fillStyle='#333';g.fillRect(40,60,70,34);g.fillRect(104,70,26,16);g.fillRect(70,94,8,30);g.fillStyle='#d3232a';g.font='bold 15px Inter, Arial';g.textAlign='center';g.fillText('ОБЕКТЪТ Е ПОД',80,150);g.fillText('ВИДЕОНАБЛЮДЕНИЕ',80,172);g.strokeStyle='#d3232a';g.lineWidth=4;for(const x of [50,110]){g.beginPath();g.arc(x,200,14,0,6.283);g.stroke();g.beginPath();g.moveTo(x-10,190);g.lineTo(x+10,210);g.stroke();}})});
    // white price rails with paper price tags, some promo-red
    M.rail=new T.MeshStandardMaterial({roughness:.5,map:tex2(1024,64,(g,w,h)=>{g.fillStyle='#f2f1ee';g.fillRect(0,0,w,h);g.fillStyle='#d9d7d2';g.fillRect(0,0,w,5);g.fillRect(0,h-5,w,5);for(let i=0;i<8;i++){const x=i*128+8,vip=i===2||i===6,promo=i===4;g.fillStyle=promo?'#ffd400':vip?'#1f9d4a':'#fbfaf6';g.fillRect(x,10,110,44);g.strokeStyle='#cfcbc3';g.lineWidth=1;g.strokeRect(x,10,110,44);g.fillStyle=promo?'#c8102e':vip?'#fff':'#141210';g.font='bold 26px Inter, Arial';g.textAlign='left';g.fillText((0.5+Math.random()*9.5).toFixed(2).replace('.',','),x+8,46);g.font='11px Inter, Arial';g.fillText('€',x+82,46);g.fillStyle=promo?'#c8102e':vip?'#eafff1':'#777';g.font=(promo||vip?'bold ':'')+'9px Arial';g.fillText(promo?'ШОК ЦЕНА':vip?'VIP ЦЕНА':'ПРОДУКТ 0,7 л',x+8,22);}},true)});
    M.mat=new T.MeshStandardMaterial({roughness:1,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#2e2a26';g.fillRect(0,0,w,h);speck(g,w,h,6000,.25,'120,100,70',2);speck(g,w,h,3000,.3,'0,0,0',2);g.strokeStyle='#8a7a5a';g.lineWidth=10;g.strokeRect(14,14,w-28,h-28);g.fillStyle='#c9b58a';g.font='bold 40px Inter, Arial';g.textAlign='center';g.fillText('ДОБРЕ',128,110);g.fillText('ДОШЛИ',128,160);})});
    // labelled products: the instance colour tints the package, a band of the texture (v0..v1) stays as printed
    // product artwork: printed labels drawn like real ones (paper, header band, serif brand, small print, barcode, foil capsule, gloss),
    // one texture per family; the instance colour tints the package outside the label band, so a shelf reads as many brands
    const barcode=(g,x,y,w,h)=>{g.fillStyle='#fff';g.fillRect(x,y,w,h);g.fillStyle='#111';for(let i=0;i<w;i+=3)if(((i*7)%5)<3)g.fillRect(x+i,y+1,1+((i*3)%2),h-2);};
    const paper=(g,x,y,w,h,col,brand,line)=>{g.fillStyle='#f6f1e4';g.fillRect(x,y,w,h);g.fillStyle=col;g.fillRect(x,y,w,h*.27);g.fillStyle='#c9a86a';g.fillRect(x,y+h*.27,w,1);g.fillRect(x+w*.1,y+h*.62,w*.8,1);
      g.fillStyle='#fff';g.font='bold '+Math.round(h*.16)+'px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText(brand,x+w/2,y+h*.14);
      g.fillStyle='#2a2420';g.font='italic '+Math.round(h*.12)+'px Georgia, serif';g.fillText(line,x+w/2,y+h*.44);
      g.fillStyle='#555';for(let i=0;i<3;i++)g.fillRect(x+w*(.2+i*.05),y+h*(.68+i*.08),w*(.6-i*.1),Math.max(1,h*.03));
      g.fillStyle=col;g.beginPath();g.arc(x+w/2,y+h*.27,h*.07,0,6.283);g.fill();g.fillStyle='#f6f1e4';g.beginPath();g.arc(x+w/2,y+h*.27,h*.04,0,6.283);g.fill();};
    const gloss=(g,w,h,x,ww,a)=>{const gr=g.createLinearGradient(x,0,x+ww,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,'+a+')');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x,0,ww,h);};
    const lblMat=(tex,v0,v1,rough,metal,env)=>{const m=new T.MeshStandardMaterial({map:tex,roughness:rough||.5,metalness:metal||0,envMapIntensity:env||.5});m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#if defined( USE_COLOR )\n diffuseColor.rgb *= mix( vColor, vec3(1.0), step('+v0.toFixed(3)+', vUv.y) * step( vUv.y, '+v1.toFixed(3)+') );\n#endif');};m.customProgramCacheKey=()=>'lbl'+v0+v1;return m;};
    // glass bottle: gold foil capsule with an embossed ring, a paper label with a crest and a barcode, a highlight down the body
    M.bottle=lblMat(tex2(128,256,(g,w,h)=>{g.fillStyle='#8f8f8f';g.fillRect(0,0,w,h);const fo=g.createLinearGradient(0,0,w,0);fo.addColorStop(0,'#b8963f');fo.addColorStop(.5,'#f0d98a');fo.addColorStop(1,'#a8842f');g.fillStyle=fo;g.fillRect(0,0,w,34);g.fillStyle='#6b4f14';g.fillRect(0,30,w,2);g.fillRect(0,8,w,1);
      paper(g,0,h*.5,w,h*.28,'#7a1f2b','RESERVA','Cabernet · 2019');barcode(g,w*.3,h*.72,w*.4,h*.05);g.fillStyle='#3a3a3a';g.fillRect(0,h*.78,w,2);gloss(g,w,h,w*.08,w*.14,.35);speck(g,w,h,200,.05,'255,255,255');}),.22,.5,.16,.05,1.0);
    // drinks carton / coffee box: printed front with a product picture, brand band, small print and a barcode on the side
    M.carton=lblMat(tex2(128,128,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);paper(g,0,h*.28,w,h*.44,'#274a7a','CAFFÈ','espresso · 250 g');g.fillStyle='#4a2a14';g.beginPath();g.ellipse(w*.5,h*.62,w*.12,h*.05,0,0,6.283);g.fill();g.fillStyle='#f6f1e4';g.beginPath();g.ellipse(w*.5,h*.61,w*.1,h*.035,0,0,6.283);g.fill();
      g.fillStyle='#2a2a2a';g.fillRect(6,10,44,4);g.fillRect(6,h-16,70,4);barcode(g,w*.62,h*.06,w*.3,h*.12);}),.28,.72,.62,0,.4);
    // aluminium can: brushed rims, a bold italic brand on a white swoosh, the volume in small print, a highlight
    M.can=lblMat(tex2(128,128,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);const al=g.createLinearGradient(0,0,w,0);al.addColorStop(0,'#9a9a9a');al.addColorStop(.5,'#e6e6e6');al.addColorStop(1,'#8e8e8e');g.fillStyle=al;g.fillRect(0,0,w,14);g.fillRect(0,h-14,w,14);g.fillStyle='#666';g.fillRect(0,13,w,1);g.fillRect(0,h-15,w,1);
      g.fillStyle='#fff';g.beginPath();g.moveTo(0,h*.42);g.quadraticCurveTo(w*.5,h*.3,w,h*.44);g.lineTo(w,h*.6);g.quadraticCurveTo(w*.5,h*.72,0,h*.58);g.closePath();g.fill();
      g.fillStyle='#1a1a1a';g.font='italic bold 22px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('COLA',w*.5,h*.5);g.fillStyle='#fff';g.font='bold 9px Inter, Arial';g.fillText('0,33 l',w*.5,h*.8);gloss(g,w,h,w*.1,w*.12,.3);}),.41,.59,.28,.55,1.2);
    // sweets / tea wrapper: glossy foil, a white window with the brand and a row of chocolate pieces, a red "NEW" corner
    M.pack=lblMat(tex2(128,128,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);g.fillStyle='#fbf8f0';g.fillRect(0,h*.3,w,h*.44);g.fillStyle='#2a1a10';g.font='bold 20px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Choco',w*.5,h*.43);
      g.fillStyle='#4a2a14';for(let i=0;i<4;i++)g.fillRect(w*(.16+i*.18),h*.56,w*.14,h*.12);g.fillStyle='#6a4020';for(let i=0;i<4;i++)g.fillRect(w*(.18+i*.18),h*.58,w*.1,h*.08);
      g.fillStyle='#d3232a';g.beginPath();g.moveTo(w,0);g.lineTo(w,h*.22);g.lineTo(w*.78,0);g.closePath();g.fill();g.fillStyle='#fff';g.font='bold 7px Inter, Arial';g.fillText('NEW',w*.9,h*.07);gloss(g,w,h,w*.05,w*.2,.22);}),.3,.74,.32,0,.8);
    // crisps bag: foil with crimped top and bottom, an oval brand plate, a picture disc of crisps, flavour text
    M.bag=lblMat(tex2(128,128,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);g.fillStyle='#b8b8b8';g.fillRect(0,0,w,10);g.fillRect(0,h-10,w,10);g.fillStyle='#777';for(let x=0;x<w;x+=6){g.fillRect(x,0,1,10);g.fillRect(x,h-10,1,10);}
      g.fillStyle='#fbf8f0';g.beginPath();g.ellipse(w*.5,h*.3,w*.34,h*.11,0,0,6.283);g.fill();g.fillStyle='#d3232a';g.font='bold 15px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('CHIPS',w*.5,h*.3);
      g.fillStyle='#e8b640';g.beginPath();g.arc(w*.5,h*.62,w*.2,0,6.283);g.fill();g.fillStyle='#f3cf70';for(let i=0;i<5;i++){g.beginPath();g.ellipse(w*(.4+i*.05),h*(.56+(i%2)*.1),w*.07,h*.035,i*.6,0,6.283);g.fill();}
      g.fillStyle='#fff';g.font='bold 8px Inter, Arial';g.fillText('SEA SALT · 140 g',w*.5,h*.86);gloss(g,w,h,w*.12,w*.16,.25);}),.0,.0,.3,0,.9);
    const box5=(()=>{const mk=(rx,ry,tx,ty,tz)=>{const p=new T.PlaneGeometry(1,1);if(rx)p.rotateX(rx);if(ry)p.rotateY(ry);p.translate(tx,ty,tz);return p;};return mergeGeos([mk(-Math.PI/2,0,0,.5,0),mk(0,0,0,0,.5),mk(0,Math.PI,0,0,-.5),mk(0,Math.PI/2,.5,0,0),mk(0,-Math.PI/2,-.5,0,0)]);})();
    // rounder bottles and cans (8 sides instead of 5), a real shoulder and neck on the bottle
    const GEO={bottle:new T.LatheGeometry([new T.Vector2(.44,0),new T.Vector2(.5,.06),new T.Vector2(.5,.6),new T.Vector2(.34,.74),new T.Vector2(.17,.84),new T.Vector2(.17,1)],8),can:new T.CylinderGeometry(.5,.5,1,8,1,true),box:box5};
    GEO.bottle.translate(0,-.5,0);const GEOSET=new Set([GEO.bottle,GEO.can,GEO.box]);
    // procedural environment cube: white ceiling with strips, burgundy/grey walls, dark floor — gives glossy surfaces something to reflect
    const envCube=(()=>{const mk=fn=>{const c=document.createElement('canvas');c.width=c.height=64;fn(c.getContext('2d'));return c;};
      const side=()=>mk(g=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#d8d4cc');gr.addColorStop(.42,'#6a2a32');gr.addColorStop(.5,'#5a1f28');gr.addColorStop(1,'#2a2a2c');g.fillStyle=gr;g.fillRect(0,0,64,64);g.fillStyle='#c9a86a';g.fillRect(0,30,64,3);});
      const t=new T.CubeTexture([side(),side(),mk(g=>{g.fillStyle='#d8d4cc';g.fillRect(0,0,64,64);g.fillStyle='#ffffff';for(let i=0;i<3;i++)g.fillRect(8+i*20,0,4,64);}),mk(g=>{g.fillStyle='#2a2b2d';g.fillRect(0,0,64,64);}),side(),side()]);t.encoding=T.sRGBEncoding;t.needsUpdate=true;return t;})();
    scene.environment=envCube;
    ['glass','glassC','cool','unit','unitW','grB','grW','screen2','keys','champ','bglass','chrome'].forEach(k=>M[k].color.convertSRGBToLinear());
    M.avanti=(()=>{const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle='#f3efe6';g.fillRect(0,0,256,96);g.fillStyle='#d3232a';g.font='bold 58px Inter, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('АВАНТИ',128,50);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return new T.MeshBasicMaterial({map:t});})();
    M.flow=new T.MeshBasicMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,color:0xE6C27A,polygonOffset:true,polygonOffsetFactor:-2,map:(()=>{const c=document.createElement('canvas');c.width=64;c.height=32;const g=c.getContext('2d');g.fillStyle='rgba(255,255,255,.28)';g.fillRect(0,12,64,8);g.fillStyle='#fff';g.beginPath();g.moveTo(18,2);g.lineTo(40,16);g.lineTo(18,30);g.lineTo(26,16);g.closePath();g.fill();const t=new T.CanvasTexture(c);t.wrapS=T.RepeatWrapping;t.anisotropy=4;return t;})()});
    // АВАНТИ shopping bag: white, red handles, the logo on both faces (faces point sideways, as a bag hangs from the hand)
    M.bagLogo=(()=>{const c=document.createElement('canvas');c.width=128;c.height=160;const g=c.getContext('2d');g.fillStyle='#fbfaf7';g.fillRect(0,0,128,160);g.fillStyle='#d3232a';g.fillRect(0,128,128,32);g.font='bold 27px Inter, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('АВАНТИ',64,66);g.fillRect(22,86,84,3);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return new T.MeshStandardMaterial({map:t,roughness:.7,envMapIntensity:.3});})();
    function mkOpenBag(){const w=.27,h=.33,d=.11,t=.004,Wc='#fbfaf7',R='#d3232a';const m=new T.Mesh(mergeColored([[new T.BoxGeometry(t,h,w).translate(d/2,0,0),Wc],[new T.BoxGeometry(t,h,w).translate(-d/2,0,0),Wc],[new T.BoxGeometry(d-t,h,t).translate(0,0,w/2-t/2),Wc],[new T.BoxGeometry(d-t,h,t).translate(0,0,-w/2+t/2),Wc],[new T.BoxGeometry(d-t,t,w-t).translate(0,-h/2+t/2,0),Wc],
        [new T.TorusGeometry(.065,.008,4,10,Math.PI).rotateY(Math.PI/2).translate(d*.3,h/2,0),R],[new T.TorusGeometry(.065,.008,4,10,Math.PI).rotateY(Math.PI/2).translate(-d*.3,h/2,0),R]]),M.vc2);m.castShadow=true;const g=new T.Group();g.add(m);for(const sd of [-1,1]){const l=new T.Mesh(new T.PlaneGeometry(w*.97,h*.97),M.bagLogo);l.rotation.y=sd*Math.PI/2;l.position.x=sd*(d/2+.003);g.add(l);}return g;} // the same АВАНТИ print as the bag that leaves with the customer
    function mkBag(k){const bag=new T.Group(),w=.27*k,h=.33*k,d=.11*k;const bm=new T.Mesh(mergeColored([[new T.BoxGeometry(d,h,w),'#fbfaf7'],[new T.TorusGeometry(.065*k,.008,4,10,Math.PI).rotateY(Math.PI/2).translate(d*.3,h/2,0),'#d3232a'],[new T.TorusGeometry(.065*k,.008,4,10,Math.PI).rotateY(Math.PI/2).translate(-d*.3,h/2,0),'#d3232a']]),M.vc2);bm.castShadow=true;bag.add(bm);
      for(const s of [-1,1]){const l=new T.Mesh(new T.PlaneGeometry(w*.97,h*.97),M.bagLogo);l.rotation.y=s*Math.PI/2;l.position.x=s*(d/2+.002);bag.add(l);}return bag;}
    const SHARED=(()=>{let b=null,bg=null,ph=null,bl=null;return {
      basket:()=>b||(b=(()=>{const L=[[new T.CylinderGeometry(.15,.12,.2,8,1,true),'#d0212b'],[new T.CircleGeometry(.12,8).rotateX(Math.PI/2).translate(0,-.1,0),'#d0212b'],[new T.TorusGeometry(.14,.008,4,10,Math.PI).translate(0,.1,0),'#3a1a14']];[[-.05,.06,.04,'#e8e2d0'],[.05,.08,-.03,'#1f3a24'],[0,.05,.05,'#c9a24a'],[-.04,.09,-.05,'#7a1f1f'],[.06,.04,.05,'#2f6fb5']].forEach(([x,y,z,c])=>L.push([new T.CylinderGeometry(.025,.025,.11,6).translate(x,y,z),c]));return mergeColored(L);})()),
      bag:()=>{if(!bg)bg=mkBag(1);return bg.clone();},
      phone:()=>ph||(ph=mergeColored([[new T.BoxGeometry(.07,.14,.01),'#111111']])),
      blob:()=>bl||(bl=new T.CircleGeometry(1,12)),
      card:(()=>{let c=null;return ()=>c||(c=mergeColored([[new T.BoxGeometry(.085,.054,.006),'#1d4f9a']]));})(),
      note:(()=>{let c=null;return ()=>c||(c=mergeColored([[new T.BoxGeometry(.13,.065,.003),'#5f8f55']]));})(),
      item:(()=>{const c=[];return i=>{i=i%5;if(!c[i]){const col=['#c8382e','#2f6fb5','#e0b23a','#3c7a3e','#e8e2d0'][i];c[i]=i%2?mergeColored([[new T.CylinderGeometry(.032,.032,.22,8),col]]):mergeColored([[new T.BoxGeometry(.085,.12,.055),col]]);}return c[i];};})()};})();
    // one InstancedMesh per product family for the whole store; each item = [x,y,z,sx,sy,sz,colour]
    function instanced(geo,list,shadow,pal,mat){const im=new T.InstancedMesh(geo,mat,list.length),m4=new T.Matrix4(),q=new T.Quaternion(),v=new T.Vector3(),sc=new T.Vector3(),c=new T.Color();
      list.forEach((p,i)=>{v.set(p[0],p[1]+p[4]/2,p[2]);sc.set(p[3],p[4],p[5]);m4.compose(v,q,sc);im.setMatrixAt(i,m4);c.set(p[6]||pal[(Math.random()*pal.length)|0]).convertSRGBToLinear();im.setColorAt(i,c);});
      im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=shadow;im.receiveShadow=true;room.add(im);return im;}
    // merge [geometry, colourHex] pairs into one vertex-coloured geometry
    function mergeColored(list){const geos=[],cols=[];list.forEach(([g,c])=>{const n=g.index?g.toNonIndexed():g;if(n!==g)g.dispose();geos.push(n);const col=new T.Color(c).convertSRGBToLinear();cols.push([col,n.attributes.position.count]);});
      const out=mergeGeos(geos);const cnt=out.attributes.position.count,arr=new Float32Array(cnt*3);let k=0;cols.forEach(([c,n])=>{for(let i=0;i<n;i++){arr[k++]=c.r;arr[k++]=c.g;arr[k++]=c.b;}});out.setAttribute('color',new T.BufferAttribute(arr,3));return out;}
    const edgeMat=new T.LineBasicMaterial({transparent:true,opacity:.45}),gridMat=new T.LineBasicMaterial({transparent:true,opacity:.22}),flowMat=new T.LineDashedMaterial({dashSize:.42,gapSize:.3,transparent:true,opacity:.95});

    // scent particles: custom shader so every particle can fade on its own
    const PN=620,MIST=7,PMAX=(90).toFixed(1); // the same scent everywhere: a phone shows as many particles as a desktop
    const PUFF_T=8,PUFF_ON=3; // each diffuser puffs ~3 s, rests ~5 s, the units out of step with each other
    const pSz=new Float32Array(PN).fill(1),pPos=new Float32Array(PN*3),pAl=new Float32Array(PN),pv=new Float32Array(PN*3),page=new Float32Array(PN),plife=new Float32Array(PN),pown=new Int8Array(PN).fill(-1);
    const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pPos,3));pg.setAttribute('alpha',new T.BufferAttribute(pAl,1));pg.setAttribute('psize',new T.BufferAttribute(pSz,1));
    const spr=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new T.CanvasTexture(c);})();
    const pm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
      uniforms:{uTex:{value:spr},uColor:{value:new T.Color(0xd4af63)},uSize:{value:.3},uScale:{value:400},uOp:{value:.5}},
      vertexShader:'attribute float alpha;attribute float psize;varying float vA;uniform float uSize;uniform float uScale;void main(){vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=min('+PMAX+',uSize*psize*uScale/max(.1,-mv.z));gl_Position=projectionMatrix*mv;}',
      fragmentShader:'uniform sampler2D uTex;uniform vec3 uColor;uniform float uOp;varying float vA;void main(){vec4 t=texture2D(uTex,gl_PointCoord);float a=t.a*vA*uOp;if(a<.004)discard;gl_FragColor=vec4(uColor,a);}'});
    const points=new T.Points(pg,pm);points.frustumCulled=false;points.renderOrder=5;scene.add(points);

    // coverage heat on the floor, measured from the particles themselves
    let heat=null;
    const people=[],extras=[];let flowLine=null,flowCurve=null,flowLen=1;
    const overlay=[];

    const stdM=o=>{const m=new T.MeshStandardMaterial(o);if(o.color!=null)m.color.convertSRGBToLinear();return m;};
    const SKIN=[0xf3d9c4,0xe8c4a4,0xd9ae8a,0xc99470,0xa9744f,0x8a5a3c,0x6b4028,0x4d2f1f],TOP=[0x1b1917,0x2d3a4f,0x3a3a3a,0x7a2f2f,0x3f5a3a,0x6b6b6b,0x4a4238,0x2f6fb5,0x8a5a3a,0xc46a3a],BOT=[0x1e232b,0x2c3a5a,0x3a3a3a,0x1b1917,0x5a4a3a,0x2c2f4a],JK=[0x1b1917,0x2d3a4f,0x3a3a3a,0x4a4238,0x2d2a2a,0x3f5a3a],HAIR=[0x1a1410,0x3b2a1a,0x6b4a2a,0x9a7a5a,0xd9c3a0,0xb8b0a6,0x2a1a10,0x7a2f2f];
    const pick_=a=>a[(Math.random()*a.length)|0];
    function lathe(pts,mat,seg,phiS,phiL){const g=new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),seg||18,phiS||0,phiL==null?Math.PI*2:phiL);return new T.Mesh(g,mat);}
    const hx=c=>'#'+new T.Color(c).getHexString();
    const shade=(c,m)=>{const x=new T.Color(c);x.r=Math.min(1,x.r*m);x.g=Math.min(1,x.g*m);x.b=Math.min(1,x.b*m);return '#'+x.getHexString();};
    // face texture: painted on the head lathe (front at u=.5, chin at v=0, crown at v=1)
    function faceTex(o){
      const c=document.createElement('canvas');c.width=512;c.height=288;const g=c.getContext('2d');const cx=256,row=y=>(1-(y+.115)/.24)*256;
      g.fillStyle=hx(o.skin);g.fillRect(0,0,512,256);
      // soft shading: darker under the jaw and at the sides, warmer cheeks
      let gr=g.createLinearGradient(0,row(-.06),0,256);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(40,20,10,.35)');g.fillStyle=gr;g.fillRect(0,row(-.06),512,256);
      for(const s of [-1,1]){gr=g.createRadialGradient(cx+s*58,row(-.03),4,cx+s*58,row(-.03),46);gr.addColorStop(0,'rgba(220,90,80,'+(o.fem?.2:.1)+')');gr.addColorStop(1,'rgba(220,90,80,0)');g.fillStyle=gr;g.fillRect(cx+s*58-50,row(-.03)-50,100,100);}
      // eye sockets (slight shadow), eyes: white, iris, pupil, lid line, lashes
      const ey=row(.0),ex=25+Math.random()*5;
      for(const s of [-1,1]){const x=cx+s*ex;
        gr=g.createRadialGradient(x,ey+2,3,x,ey+2,22);gr.addColorStop(0,'rgba(60,30,20,.18)');gr.addColorStop(1,'rgba(60,30,20,0)');g.fillStyle=gr;g.fillRect(x-24,ey-22,48,48);
        g.fillStyle='#f6f3ee';g.beginPath();g.ellipse(x,ey,14,7.5,0,0,6.283);g.fill();
        g.fillStyle=o.iris;g.beginPath();g.arc(x+s*1.5,ey+.5,6.2,0,6.283);g.fill();
        g.fillStyle='#0d0a08';g.beginPath();g.arc(x+s*1.5,ey+.5,3.2,0,6.283);g.fill();
        g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(x+s*1.5-2,ey-1.6,1.3,0,6.283);g.fill();
        g.strokeStyle='#2a1a12';g.lineWidth=o.fem?2.6:2;g.beginPath();g.ellipse(x,ey,14.5,8,0,Math.PI*1.08,Math.PI*1.92);g.stroke();
        g.strokeStyle='rgba(42,26,18,.55)';g.lineWidth=1;g.beginPath();g.ellipse(x,ey+.5,12.5,6.5,0,Math.PI*.1,Math.PI*.9);g.stroke();
        if(o.fem){g.strokeStyle='#1a100c';g.lineWidth=1.2;for(let i=0;i<4;i++){const a=Math.PI*(1.15+i*.2),lx=x+Math.cos(a)*13,ly=ey+Math.sin(a)*7;g.beginPath();g.moveTo(lx,ly);g.lineTo(lx+Math.cos(a)*3,ly+Math.sin(a)*3);g.stroke();}}
        // brow
        g.strokeStyle=o.brow;g.lineWidth=o.fem?3.2:4.6;g.lineCap='round';g.beginPath();g.moveTo(x-s*13,ey-19+(o.elder?1:0));g.quadraticCurveTo(x+s*2,ey-25,x+s*15,ey-20);g.stroke();
        // nose side shadow
        gr=g.createLinearGradient(cx+s*4,0,cx+s*14,0);gr.addColorStop(0,'rgba(40,20,10,.16)');gr.addColorStop(1,'rgba(40,20,10,0)');g.fillStyle=gr;g.fillRect(Math.min(cx+s*4,cx+s*14),ey-6,10,38);
      }
      // nostrils
      g.fillStyle='rgba(40,18,10,.45)';for(const s of [-1,1]){g.beginPath();g.ellipse(cx+s*6,row(-.03),3,1.8,0,0,6.283);g.fill();}
      // lips
      const my=row(-.066),lw=o.fem?20:18;
      g.fillStyle=o.lips;g.beginPath();g.moveTo(cx-lw,my);g.quadraticCurveTo(cx-lw*.5,my-5,cx-3,my-3.5);g.quadraticCurveTo(cx,my-5,cx+3,my-3.5);g.quadraticCurveTo(cx+lw*.5,my-5,cx+lw,my);g.quadraticCurveTo(cx,my+(o.fem?9:7),cx-lw,my);g.fill();
      g.strokeStyle='rgba(60,20,15,.7)';g.lineWidth=1.3;g.beginPath();g.moveTo(cx-lw,my);g.quadraticCurveTo(cx,my+2,cx+lw,my);g.stroke();
      g.fillStyle='rgba(255,255,255,.14)';g.beginPath();g.ellipse(cx,my+4,8,1.6,0,0,6.283);g.fill();
      // stubble / age lines
      if(o.stubble){g.fillStyle='rgba(30,20,15,.05)';for(let i=0;i<900;i++){const x=cx+(Math.random()-.5)*130,y=row(-.045)+Math.random()*60;if(Math.abs(x-cx)<24&&y<my+9&&y>my-8)continue;g.fillRect(x,y,1.5,1.5);}}
      if(o.elder){g.strokeStyle='rgba(50,25,15,.28)';g.lineWidth=1.2;for(const s of [-1,1]){g.beginPath();g.moveTo(cx+s*13,row(-.025));g.quadraticCurveTo(cx+s*24,row(-.05),cx+s*24,my+3);g.stroke();for(let i=0;i<3;i++){g.beginPath();g.moveTo(cx+s*40,ey+i*3-2);g.lineTo(cx+s*52,ey+(i-1)*6-2);g.stroke();}}
        for(let i=0;i<3;i++){g.beginPath();g.moveTo(cx-38,ey-36-i*8);g.quadraticCurveTo(cx,ey-41-i*8,cx+38,ey-36-i*8);g.stroke();}
        g.strokeStyle='rgba(50,25,15,.2)';g.beginPath();g.moveTo(cx-15,my+16);g.quadraticCurveTo(cx,my+22,cx+15,my+16);g.stroke();}
      g.fillStyle='#fff';g.fillRect(0,256,512,32);
      const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t;
    }
    // simple merge of non-indexed geometries (position/normal/uv) so many props share one draw call
    function mergeGeos(list){const P=[],N=[],U=[];list.forEach(g=>{const n=g.index?g.toNonIndexed():g;P.push(n.attributes.position.array);N.push(n.attributes.normal.array);if(n.attributes.uv)U.push(n.attributes.uv.array);else U.push(new Float32Array(n.attributes.position.count*2));if(n!==g)n.dispose();g.dispose();});
      const cat=a=>{let l=0;a.forEach(x=>l+=x.length);const o=new Float32Array(l);let k=0;a.forEach(x=>{o.set(x,k);k+=x.length;});return o;};
      const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(cat(P),3));g.setAttribute('normal',new T.BufferAttribute(cat(N),3));g.setAttribute('uv',new T.BufferAttribute(cat(U),2));return g;}
    function shapeTorso(geo,belly,chest){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),z=p.getZ(i);if(z>0){const b=belly*Math.exp(-Math.pow((y-.14)/.1,2)),c=chest*Math.exp(-Math.pow((y-.36)/.08,2));p.setZ(i,z*(1+b+c));}else p.setZ(i,z*.92);}geo.computeVertexNormals();return geo;}
    function compact(root){const groups=[];root.traverse(n=>{if(n.isGroup)groups.push(n);});groups.forEach(n=>{const by=new Map();n.children.forEach(c=>{if(c.isMesh&&!c.isInstancedMesh){const k=c.material.uuid;if(!by.has(k))by.set(k,[]);by.get(k).push(c);}});
      by.forEach(list=>{if(list.length<2)return;const geos=list.map(c=>{c.updateMatrix();return c.geometry.clone().applyMatrix4(c.matrix);});list.forEach(c=>{n.remove(c);c.geometry.dispose();});const m=new T.Mesh(mergeGeos(geos),list[0].material);m.castShadow=true;n.add(m);});});return root;}
    function mergeAttrs(list,names){const g=new T.BufferGeometry();names.forEach(nm=>{const it=list[0].attributes[nm].itemSize;let n=0;list.forEach(x=>n+=x.attributes[nm].count);const arr=new Float32Array(n*it);let k=0;list.forEach(x=>{arr.set(x.attributes[nm].array,k);k+=x.attributes[nm].array.length;});g.setAttribute(nm,new T.BufferAttribute(arr,it));});list.forEach(x=>x.dispose());return g;}
    // one SkinnedMesh per person: the rig groups are Bones, every body part is baked into one vertex-coloured geometry (face texture on the head, white band for the rest)
    const FV0=32/288,FV1=256/288;
    function skinify(g,faceT){
      g.updateMatrixWorld(true);const bones=[];g.traverse(o=>{if(o.isBone)bones.push(o);});const idx=new Map();bones.forEach((b,i)=>idx.set(b,i));
      const meshes=[];g.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&o.parent&&o.parent.isBone)meshes.push(o);});
      const parts=[],ranges=[];let vc=0;
      const gInv=new T.Matrix4().copy(g.matrixWorld).invert(),bm=new T.Matrix4();
      meshes.forEach(o=>{o.updateMatrixWorld(true);const ge=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();ge.applyMatrix4(bm.multiplyMatrices(gInv,o.matrixWorld));const n=ge.attributes.position.count;
        let uv=ge.attributes.uv;if(!uv){uv=new T.BufferAttribute(new Float32Array(n*2),2);ge.setAttribute('uv',uv);}
        if(o.userData.face){for(let i=0;i<n;i++)uv.setY(i,FV0+uv.getY(i)*FV1);}else{for(let i=0;i<n;i++)uv.setXY(i,.5,16/288);}
        const col=new Float32Array(n*3),c=o.material.color;for(let i=0;i<n;i++){col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}ge.setAttribute('color',new T.BufferAttribute(col,3));
        const bi=idx.get(o.parent),si=new Float32Array(n*4),sw=new Float32Array(n*4);for(let i=0;i<n;i++){si[i*4]=bi;sw[i*4]=1;}ge.setAttribute('skinIndex',new T.BufferAttribute(si,4));ge.setAttribute('skinWeight',new T.BufferAttribute(sw,4));
        const role=o.material.userData&&o.material.userData.role;if(role)ranges.push([role,vc,n]);vc+=n;parts.push(ge);o.parent.remove(o);o.geometry.dispose();});
      const merged=mergeAttrs(parts,['position','normal','uv','color','skinIndex','skinWeight']);
      const mat=new T.MeshStandardMaterial({map:faceT,vertexColors:true,roughness:.78,side:T.DoubleSide,envMapIntensity:.3,skinning:true});
      const sm=new T.SkinnedMesh(merged,mat);sm.castShadow=false;sm.frustumCulled=false;g.add(sm);sm.bind(new T.Skeleton(bones));
      g.userData.skin=sm;g.userData.ranges=ranges;return sm;}
    const SG=(r,a,b,...q)=>new T.SphereGeometry(r,Math.max(5,Math.round(a*.5)),Math.max(3,Math.round(b*.5)),...q),CG=(a,b,h,rs,...q)=>new T.CylinderGeometry(a,b,h,Math.max(5,Math.round((rs||8)*.65)),...q),TG=(r,t,rs,ts,...q)=>new T.TorusGeometry(r,t,Math.max(3,Math.round(rs*.7)),Math.max(8,Math.round(ts*.7)),...q);
    function makePerson(i,pr){pr=pr||{};
      const g=new T.Group(),h=pr.h||(1.58+Math.random()*.28),k=h/1.72,fem=!!pr.fem||!!pr.longHair;
      const skinC=pr.skin||pick_(SKIN),hairC=pr.hair||pick_(HAIR),envI=.35;
      const skin=stdM({color:skinC,roughness:.58,envMapIntensity:envI}),top=stdM({color:pr.top||pick_(TOP),roughness:.86,envMapIntensity:envI}),bot=stdM({color:pr.bot||pick_(BOT),roughness:.9,envMapIntensity:envI});top.userData.role='top';bot.userData.role='bot';const hair=stdM({color:hairC,roughness:pr.elder?.85:.72,envMapIntensity:.12,flatShading:!!pr.curly}),shoe=stdM({color:pr.shoe||pick_([0x14110e,0x3a2a1a,0x2f3a4a,0x5a1f1f,0x6b5a4a]),roughness:.4,envMapIntensity:envI}),sole=stdM({color:0x2a2622,roughness:.7});
      const add=(geo,m,x,y,z,parent)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;(parent||g).add(o);return o;};
      const addM=(mesh,x,y,z,parent)=>{mesh.position.set(x,y,z);mesh.castShadow=true;(parent||g).add(mesh);return mesh;};
      const wd=pr.wide||1,hipY=.9*k,shW=(fem?.175:.2)*k*wd,hipW=(fem?.18:.165)*k*wd,waist=(fem?.135:.155)*k*wd,belly=pr.belly||0;
      // rig: root (ground) -> hips (pelvis, legs) -> torso (chest, arms, neck, head)
      const hips=new T.Bone();hips.position.y=hipY;g.add(hips);const torso=new T.Bone();hips.add(torso);g.userData.hips=hips;g.userData.torso=torso;
      // shirt / dress: one lathe from the waist band to the shoulders, shaped front/back
      const shirtPts=[[hipW*.9,-.02*k],[hipW*.98,.04*k],[waist,.14*k],[waist*1.04,.2*k],[shW*.78,.3*k],[shW*.95,.4*k],[shW*1.02,.47*k],[shW*.98,.52*k],[shW*.7,.555*k],[.07*k,.575*k]];
      const shirt=lathe(shirtPts,top,8);shapeTorso(shirt.geometry,belly,fem?.22:.08);shirt.scale.z=.62;addM(shirt,0,0,0,torso);
      // collar of the shirt
      const colM=pr.collar?stdM({color:pr.collar,roughness:.85}):top;
      if(!pr.tshirt){const col=lathe([[.058*k,.55*k],[.085*k,.6*k],[.1*k,.56*k]],colM,12,.35,Math.PI*2-.7);col.scale.z=.85;addM(col,0,0,0,torso);}
      // trousers top / skirt
      if(pr.skirt){const sk=lathe([[hipW*.85,.02*k],[hipW*1.05,-.06*k],[hipW*1.12,-.2*k],[hipW*1.22,-.42*k],[hipW*1.24,-.44*k]],bot,10);sk.scale.z=.8;addM(sk,0,0,0,hips);}
      else{const pel=lathe([[hipW*.55,-.09*k],[hipW*1.02,-.06*k],[hipW*1.04,.0],[hipW*.98,.06*k]],bot,10);shapeTorso(pel.geometry,belly*.5,0);pel.scale.z=.76;addM(pel,0,0,0,hips);
        const belt=add(TG(hipW*.99,.012*k,4,12),stdM({color:0x2a1f16,roughness:.5}),0,.06*k,0,hips);belt.rotation.x=Math.PI/2;belt.scale.y=.76;}
      // neck, head
      const shY=.53*k;add(CG(.046*k,.054*k,.12*k,8),skin,0,shY+.045*k,-.005*k,torso);
      const headG=new T.Bone();headG.position.set(0,shY+.2*k,0);torso.add(headG);g.userData.head=headG;
      const hp=[];for(let j=0;j<=10;j++){const y=-.115+.24*j/10;let r;if(y>=0)r=.095*Math.sqrt(Math.max(0,1-Math.pow(y/.125,2)));else{const q=-y/.115;r=.095*Math.sqrt(Math.max(0,1-q*q))*(1-.22*q*q);}if(j===0)r=0;else if(j===1)r=Math.max(r,.04);hp.push([r*k,y*k]);}
      const faceM=stdM({map:faceTex({skin:skinC,fem,elder:pr.elder,stubble:pr.stubble,iris:pr.iris||pick_(['#3a2a1a','#2a4a6a','#4a6a3a','#5a3a1a','#2b2b2b']),brow:shade(hairC,.7),lips:fem?'#b0524e':shade(skinC,.78)}),roughness:.58,envMapIntensity:envI});
      const head=lathe(hp,faceM,8);head.scale.set(.85,1,1.02);head.rotation.y=Math.PI;head.userData.face=true;addM(head,0,0,0,headG);
      add(SG(.015*k,7,5),skin,0,-.022*k,.09*k,headG).scale.set(1,.85,1.25); // nose tip
      const br=add(new T.BoxGeometry(.016*k,.05*k,.018*k),skin,0,.0,.084*k,headG);br.rotation.x=-.28; // nose bridge
      for(const s of [-1,1]){add(SG(.02*k,6,4),skin,s*.081*k,-.006*k,-.008*k,headG).scale.set(.4,1.1,.7);} // ears
      // hair
      const style=pr.hairStyle||(fem?'bob':'crop');
      if(style!=='none'){
        const cap=(th0,th1,ph0,phL,r,ry)=>{const m=add(SG((r||.104)*k,9,6,ph0||0,phL==null?6.283:phL,th0||0,th1),hair,0,.014*k,-.006*k,headG);m.scale.set(.88,ry||1.12,1.03);return m;};
        if(style==='crop'){cap(0,1.55).rotation.x=-.26;}
        if(style==='side'){cap(0,1.5).rotation.x=-.24;const fr=add(SG(.052*k,8,5),hair,.028*k,.078*k,.052*k,headG);fr.scale.set(1.35,.42,.8);fr.rotation.z=-.25;fr.rotation.x=.4;}
        if(style==='bob'){cap(0,1.5).rotation.x=-.3;const sk=add(CG(.098*k,.104*k,.13*k,12,1,true,.85,6.283-1.7),stdM({color:hairC,roughness:.72,side:T.DoubleSide,envMapIntensity:.12}),0,-.04*k,-.012*k,headG);sk.scale.x=.9;
          const fr=add(SG(.05*k,8,5),hair,0,.098*k,.04*k,headG);fr.scale.set(1.4,.4,.9);fr.rotation.x=.3;}
        if(style==='pony'){cap(0,1.6,0,6.283,.103).rotation.x=-.32;const tl=add(CG(.03*k,.014*k,.22*k,8),hair,0,-.06*k,-.1*k,headG);tl.rotation.x=.4;add(SG(.033*k,7,5),hair,0,.03*k,-.095*k,headG);}
        if(style==='bun'){cap(0,1.6,0,6.283,.103).rotation.x=-.32;add(SG(.042*k,8,6),hair,0,.045*k,-.095*k,headG).scale.set(1,.85,.8);}
        if(style==='receding'){cap(.55,1.15,Math.PI/2+.95,6.283-1.9,.103,1.06);}
        if(style==='curls'){cap(0,1.65,0,6.283,.11,1.1).rotation.x=-.3;}
        if(style==='shortF'){cap(0,1.55,0,6.283,.106).rotation.x=-.28;const fr=add(SG(.055*k,8,5),hair,.02*k,.08*k,.048*k,headG);fr.scale.set(1.35,.42,.8);fr.rotation.x=.4;}
      }
      if(pr.cap){const cm=stdM({color:pr.cap,roughness:.9});const cr=add(SG(.104*k,12,7,0,6.283,0,1.5),cm,0,.02*k,-.004*k,headG);cr.scale.set(.9,.95,1.02);add(CG(.106*k,.106*k,.012*k,12),cm,0,.02*k,0,headG);
        const peak=add(CG(.11*k,.11*k,.01*k,10,1,false,-.9,1.8),cm,0,.02*k,.0,headG);if(pr.capBack)peak.rotation.y=Math.PI;}
      if(pr.hat){const hm=stdM({color:pr.hat,roughness:.9});add(CG(.095*k,.1*k,.09*k,12),hm,0,.085*k,-.004*k,headG);add(CG(.135*k,.135*k,.008*k,14),hm,0,.045*k,-.004*k,headG);add(TG(.098*k,.006*k,5,14),stdM({color:0x111,roughness:.6}),0,.05*k,-.004*k,headG).rotation.x=Math.PI/2;}
      if(pr.glasses){const gm=stdM({color:0x1c1a18,metalness:.6,roughness:.3});for(const s of [-1,1]){const r=new T.Mesh(TG(.024*k,.003,4,8),gm);r.position.set(s*.031*k,.0,.088*k);headG.add(r);const arm=add(new T.BoxGeometry(.003,.003,.095*k),gm,s*.07*k,.004*k,.04*k,headG);arm.rotation.y=s*.12;}add(new T.BoxGeometry(.016*k,.003,.003),gm,0,.004*k,.09*k,headG);}
      if(pr.beard){const bm=stdM({color:pr.beardC||hairC,roughness:.9,flatShading:true});const bd=add(SG(.09*k,12,6,Math.PI/2+.5,6.283-1,1.75,1.1),bm,0,-.03*k,.005*k,headG);bd.scale.set(.9,1.1,1.02);const ch=add(SG(.05*k,8,5),bm,0,-.108*k,.04*k,headG);ch.scale.set(1.1,.55,.8);add(new T.BoxGeometry(.05*k,.012*k,.02*k),bm,0,-.05*k,.086*k,headG);} // moustache
      // arms: shoulder -> elbow -> hand (mitten with thumb)
      const arms=[],legs=[];const sleeveM=pr.coat?stdM({color:pr.coat,roughness:.92,envMapIntensity:envI}):(pr.jacket?stdM({color:pr.jacket,roughness:.88,envMapIntensity:envI}):top);if(sleeveM!==top)sleeveM.userData.role='jk';
      const longS=!!(pr.coat||pr.jacket||pr.sleeves);
      for(const s of [-1,1]){
        const a=new T.Bone();a.position.set(s*shW*1.02,shY-.03*k,-.01*k);torso.add(a);
        add(SG(.048*k,6,4),sleeveM,0,.005*k,0,a);
        add(CG(.047*k,.04*k,.28*k,8,1,true),sleeveM,0,-.15*k,0,a);
        const fo=new T.Bone();fo.position.set(0,-.29*k,0);a.add(fo);
        add(SG(.04*k,6,4),longS?sleeveM:skin,0,0,0,fo);
        add(CG(.04*k,.031*k,.25*k,8,1,true),longS?sleeveM:skin,0,-.125*k,0,fo);
        if(pr.jacket&&!pr.coat)add(CG(.034*k,.033*k,.03*k,8),colM,0,-.245*k,0,fo); // shirt cuff
        const hd=new T.Bone();hd.position.set(0,-.26*k,0);fo.add(hd);
        add(SG(.037*k,7,5),skin,0,-.035*k,.004*k,hd).scale.set(.72,1.15,.42);
        const th=add(CG(.01*k,.008*k,.045*k,6),skin,s*-.028*k,-.03*k,.014*k,hd);th.rotation.z=s*-.5;th.rotation.x=-.4;
        a.userData.fo=fo;a.userData.hd=hd;arms.push(a);
        // legs: hip -> knee -> ankle(foot)
        const l=new T.Bone();l.position.set(s*hipW*.52,-.06*k,0);hips.add(l);
        const legM=pr.skirt?(pr.tights?stdM({color:pr.tights,roughness:.75}):skin):bot,thin=pr.skirt?.86:1;
        add(SG(.07*k*thin,6,4),legM,0,0,0,l).scale.set(1,.9,.9);
        add(CG(.072*k*thin,.058*k*thin,.42*k,8,1,true),legM,0,-.2*k,0,l).scale.z=.9;
        const sh=new T.Bone();sh.position.set(0,-.41*k,0);l.add(sh);
        add(SG(.052*k*thin,6,4),legM,0,0,0,sh).scale.set(1,.85,1);
        add(CG(.056*k*thin,.043*k*thin,.38*k,8,1,true),legM,0,-.19*k,0,sh);
        if(!pr.skirt)add(CG(.05*k,.05*k,.035*k,8),bot,0,-.385*k,0,sh); // cuff
        const ft=new T.Bone();ft.position.set(0,-.4*k,0);sh.add(ft);
        const heel=pr.heels?.03*k:.0;
        add(new T.BoxGeometry(.085*k,.02*k,.25*k),sole,0,-.008*k-heel*.3,.06*k,ft);
        add(new T.BoxGeometry(.08*k,.048*k,.19*k),shoe,0,.024*k,.03*k,ft);
        add(SG(.042*k,7,5),shoe,0,.02*k,.135*k,ft).scale.set(.95,.62,1.1);
        add(SG(.04*k,6,4),shoe,0,.03*k,-.03*k,ft).scale.set(.95,.9,.8);
        l.userData.sh=sh;l.userData.ft=ft;legs.push(l);
      }
      // jacket / coat: open front over the shirt, lapels, sleeves recoloured above
      if(pr.jacket||pr.coat){const jc=pr.coat||pr.jacket,jm=stdM({color:jc,roughness:.9,side:T.DoubleSide,envMapIntensity:envI}),lo=pr.coat?-.62*k:-.02*k,op=pr.coat?.55:.42;jm.userData.role='jk';
        const jp=pr.coat?[[shW*.68,.55*k],[shW*1.0,.5*k],[shW*1.06,.34*k],[shW*1.0,.16*k],[hipW*1.12,-.1*k],[hipW*1.22,lo]]:[[shW*.68,.55*k],[shW*1.0,.5*k],[shW*1.06,.34*k],[shW*.98,.18*k],[hipW*1.08,.02*k],[hipW*1.12,lo]];
        const jk=lathe(jp,jm,8,op,Math.PI*2-op*2);shapeTorso(jk.geometry,belly*.8,fem?.15:.05);jk.scale.z=.66;addM(jk,0,0,0,torso);
        const cl=lathe([[shW*.6,.545*k],[shW*.78,.58*k],[shW*.9,.53*k]],jm,12,.45,Math.PI*2-.9);cl.scale.z=.85;addM(cl,0,0,0,torso);
        for(const s of [-1,1]){const lp=add(new T.BoxGeometry(.05*k,.16*k,.005*k),jm,s*shW*.4,.42*k,shW*.62,torso);lp.rotation.z=s*.3;lp.rotation.y=s*-.55;}
        if(pr.hood){add(SG(.12*k,10,6,0,6.283,1.3,1.2),jm,0,.5*k,-.06*k,torso).scale.set(.9,.6,.9);}}
      if(pr.vest){const vm=stdM({color:pr.vest,roughness:.92,side:T.DoubleSide});const v=lathe([[shW*.98,.5*k],[shW*1.02,.34*k],[waist*1.12,.14*k],[hipW*1.1,.0]],vm,12,.5,Math.PI*2-1);v.scale.z=.7;addM(v,0,0,0,torso);}
      if(pr.scarf){add(TG(.072*k,.03*k,6,12),stdM({color:pr.scarf,roughness:.95}),0,shY+.03*k,0,torso).rotation.x=Math.PI/2;const tail=add(new T.BoxGeometry(.06*k,.22*k,.02*k),stdM({color:pr.scarf,roughness:.95}),.05*k,shY-.1*k,shW*.6,torso);tail.rotation.z=.15;}
      if(pr.handbag){const bm=stdM({color:pr.handbag,roughness:.5});const b=add(new T.BoxGeometry(.2*k,.15*k,.07*k),bm,-shW*1.25,.0,.0,torso);add(CG(.006,.006,.55*k,6),bm,-shW*1.05,.29*k,.0,torso).rotation.z=.12;b.rotation.y=.1;}
      if(pr.backpack){const bm=stdM({color:pr.backpack,roughness:.85});add(new T.BoxGeometry(.26*k,.34*k,.12*k),bm,0,.32*k,-shW*.62-.06*k,torso);for(const s of [-1,1])add(new T.BoxGeometry(.04*k,.3*k,.02*k),bm,s*.08*k,.38*k,shW*.6,torso);}
      // basket (inside) and АВАНТИ bag (leaving) in the right hand
      const hand=arms[1].userData.hd;
      const basket=new T.Group();{const L=[[CG(.15*k,.12*k,.2*k,8,1,true),'#d0212b'],[new T.CircleGeometry(.12*k,8).rotateX(Math.PI/2).translate(0,-.1*k,0),'#d0212b'],[TG(.14*k,.008,4,10,Math.PI).translate(0,.1*k,0),'#3a1a14']];
        for(let q=0;q<5;q++)L.push([CG(.025*k,.025*k,.11*k,6).translate((Math.random()-.5)*.16*k,(.03+Math.random()*.1)*k,(Math.random()-.5)*.16*k),pick_(['#e8e2d0','#1f3a24','#c9a24a','#7a1f1f','#2f6fb5','#f0e2c4'])]);const bm=new T.Mesh(mergeColored(L),M.vc2);bm.castShadow=true;basket.add(bm);}
      basket.position.set(0,-.2*k,0);hand.add(basket);
      const bag=mkBag(k);
      bag.position.set(0,-.24*k,0);bag.visible=false;hand.add(bag);
      skinify(g,faceM.map);
      {const ph=new T.Mesh(mergeColored([[new T.BoxGeometry(.07*k,.14*k,.01*k),'#111111']]),M.vc2);ph.position.set(0,-.05*k,.03*k);ph.rotation.x=-.9;ph.visible=false;arms[0].userData.hd.add(ph);g.userData.phoneM=ph;
       const bl=new T.Mesh(new T.CircleGeometry(.34*k,12),M.blob);bl.rotation.x=-Math.PI/2;bl.position.y=.012;bl.renderOrder=1;g.add(bl);}
      g.userData.arms=arms;g.userData.legs=legs;g.userData.k=k;g.userData.basket=basket;g.userData.bag=bag;g.userData.hipY=hipY;g.userData.elder=!!pr.elder;g.userData.yaw=0;g.userData.dist=0;
      return g;
    }
    function makeChild(){const g=makePerson(9,{h:1.72,top:pick_([0xe0b23a,0x2f6fb5,0xc8382e]),tshirt:true,bot:0x3b4a6e,cap:Math.random()<.5?0xc8382e:null,hairStyle:'crop',hair:0x3b2a1a,skin:0xe8c4a4,shoe:0xe8e2d6});g.scale.setScalar(.58);g.userData.head.scale.setScalar(1.22);g.userData.basket.visible=false;g.userData.bag.visible=false;g.userData.isChild=true;return g;}
    function makeElder(){const g=makePerson(7,{h:1.66,hair:0xb8b0a6,elder:true,beard:true,hairStyle:'receding',coat:0x4a4238,collar:0xe8e2d6,glasses:Math.random()<.6,hat:0x2b2622,belly:.3,skin:0xe8c4a4,bot:0x5a4a3a,top:0x6b6b6b,iris:'#3a2a1a'});g.userData.basket.visible=false;
      const k=g.userData.k;const cane=new T.Mesh(mergeColored([[new T.CylinderGeometry(.012,.014,.84*k,6).translate(0,-.4*k,.02),'#5a3a1a'],[new T.SphereGeometry(.02,6,5).translate(0,.02,.02),'#c9a24a']]),M.vc2);cane.castShadow=true;g.userData.arms[0].userData.hd.add(cane);
      g.userData.cane=true;return g;}
    function makeStroller(){
      const g=new T.Group(),L=[],fab=pick_(['#3b4a5e','#4a4a4a','#6b4a3a','#2f3a2f']),fr='#1d1f24';
      const m=(geo,col,x,y,z,rx,ry,rz)=>{if(rx)geo.rotateX(rx);if(ry)geo.rotateY(ry);if(rz)geo.rotateZ(rz);geo.translate(x,y,z);L.push([geo,col]);};
      for(const s of [-1,1]){m(new T.CylinderGeometry(.011,.011,.72,6),fr,s*.19,.52,.12,-.62);m(new T.CylinderGeometry(.011,.011,.34,6),fr,s*.19,.9,-.06,.9);}
      m(new T.CylinderGeometry(.011,.011,.44,6),fr,0,.32,.36,.55);
      m(new T.CylinderGeometry(.013,.013,.42,8),fr,0,1.0,-.22,0,0,Math.PI/2);m(new T.CylinderGeometry(.02,.02,.3,8),'#111111',0,1.0,-.22,0,0,Math.PI/2);
      m(new T.BoxGeometry(.36,.2,.44),fab,0,.5,.12);m(new T.BoxGeometry(.36,.34,.06),fab,0,.72,-.1,-.25);
      const can=new T.SphereGeometry(.23,12,8,0,Math.PI,0,Math.PI/2);can.scale(1,.85,1.05);m(can,fab,0,.78,.16,0,Math.PI/2);
      m(new T.BoxGeometry(.3,.1,.34),'#2a2d33',0,.22,.08);
      const wheel=(x,z,r)=>{m(new T.TorusGeometry(r,.028,6,16),'#111111',x,r+.005,z,0,Math.PI/2);m(new T.CylinderGeometry(r*.55,r*.55,.02,12),'#8a8f96',x,r+.005,z,0,0,Math.PI/2);};
      wheel(-.21,-.14,.13);wheel(.21,-.14,.13);wheel(0,.5,.09);
      m(new T.CylinderGeometry(.008,.008,.46,6),fr,0,.135,-.14,0,0,Math.PI/2);
      m(new T.SphereGeometry(.065,10,8),hx(pick_(SKIN)),0,.7,.06);m(new T.BoxGeometry(.26,.06,.3),'#e8dcc8',0,.6,.2);
      const mesh=new T.Mesh(mergeColored(L),M.vc2);g.add(mesh);const bg=mkBag(.9);bg.position.set(.12,.8,-.25);bg.visible=false;g.add(bg);g.userData.bag=bg;return g;
    }
    // full-body pose: walk cycle driven by distance travelled (no foot sliding), blended with idle behaviour
    const sm01=x=>{x=x<0?0:x>1?1:x;return x*x*(3-2*x);};
    function posePerson(g,t,dt,v){
      const ud=g.userData,k=ud.k,st=ud.state||'walk',b=ud.blend==null?1:ud.blend,scl=g.scale.x||1,child=!!ud.isChild,eld=!!ud.elder;
      if(ud.gltfP){gltfPose(g,v);return;}
      if(st==='restock'){ud.hips.position.y=ud.hipY*.52;ud.legs.forEach((l,i)=>{l.rotation.x=i?-1.5:.2;l.userData.sh.rotation.x=i?1.5:1.8;l.userData.ft.rotation.x=i?0:-.3;});ud.torso.rotation.set(.35+.02*Math.sin(t*1.2),0,0);ud.arms.forEach((a,i)=>{a.rotation.set(-.95,i?-.15:.15,i?.2:-.2);a.userData.fo.rotation.x=-.35;});if(ud.head){ud.head.rotation.x=.25;ud.head.rotation.y=.15*Math.sin(t*.7);}return;}
      const legL=.8*k,A=eld?.18:child?.4:(.22+.18*Math.min(1,v/.6)),cyc=4*legL*Math.sin(A)*.9*scl;
      ud.dist+=v*dt;const ph=ud.dist/cyc*6.2832+ud.ph,ib=1-b;
      const K=eld?.55:child?1.05:.85,kneeBase=eld?.2:.05;
      ud.legs.forEach((l,i)=>{const f=ph+(i?Math.PI:0),sn=Math.sin(f),cs=Math.cos(f);
        const hip=-A*b*sn,sw=Math.max(0,Math.cos(f+.5)),knee=kneeBase+K*b*Math.pow(sw,1.4),stc=Math.max(0,-cs);
        const toe=.55*b*Math.pow(Math.max(0,-Math.sin(f+.35)),2),heel=-.3*b*Math.pow(Math.max(0,sn),8);
        l.rotation.x=hip;l.userData.sh.rotation.x=knee;l.userData.ft.rotation.x=-(hip+knee)*stc+toe+heel-kneeBase*(1-b);
        // idle weight shift: one knee slightly softer
        l.userData.sh.rotation.x+=ib*.04*(1+(i?1:-1)*Math.sin(t*.45+ud.ph));});
      const bob=(child?.035:.018)*b*Math.cos(2*ph)*k+ib*.003*Math.sin(t*1.3+ud.ph);
      ud.hips.position.y=ud.hipY+bob-kneeBase*.12*k;
      ud.hips.rotation.y=.08*b*Math.sin(ph)+ib*.02*Math.sin(t*.3+ud.ph);
      ud.hips.rotation.z=.05*b*Math.cos(ph)+ib*.035*Math.sin(t*.45+ud.ph);
      ud.torso.rotation.y=-.15*b*Math.sin(ph)-ib*.03*Math.sin(t*.3+ud.ph);
      ud.torso.rotation.z=-.035*b*Math.cos(ph)-ib*.025*Math.sin(t*.45+ud.ph);
      const lean=(eld?.17:.03)+.09*v*b+(ud.pushing?.04:0);ud.torso.rotation.x=lean+.012*Math.sin(t*1.5+ud.ph);
      g.rotation.z=.012*b*Math.sin(ph);
      // arms
      const carryR=ud.basket&&ud.basket.visible||ud.bag&&ud.bag.visible;
      let reach=0,tob=0;if(st==='browse'){const s=(t*.3+ud.ph*.1)%1;reach=sm01((s-.12)/.2)*(1-sm01((s-.62)/.2));if(carryR)tob=sm01((s-.66)/.12)*(1-sm01((s-.9)/.1));}
      ud.arms.forEach((a,i)=>{const f=ph+(i?Math.PI:0),sn=Math.sin(f),sg=i?1:-1,fo=a.userData.fo;let rx,fx,rz=sg*.1,ry=0;
        if(ud.talking&&!ud.pushing&&!(i===1&&carryR)){rx=-.45+.22*Math.sin(t*4.2+i*2.1+ud.ph);fx=-1.0+.3*Math.sin(t*3.3+i);ry=i?-.3:.3;rz=i?.25:-.25;}
        else if((ud.phase==='tap'||ud.phase==='cash')&&i===0){rx=ud.phase==='tap'?-1.05:-.8;fx=-.35;ry=.15;rz=-.1;}
        else if(st==='scan'&&i===1){const q=(t*1.667)%1;rx=-.7+.45*Math.sin(q*6.283);fx=-.7;rz=.12;}
        else if(ud.pushing&&st==='walk'){rx=-.78;fx=-.06;rz=sg*.06;}
        else if(i===1&&carryR){rx=.06+.05*b*sn;fx=-.22;rz=sg*.14;}
        else if(i===0&&ud.cane){rx=-.22+.16*b*sn;fx=-.3;rz=-.08;}
        else{const amp=(eld?.16:child?.5:.36)*b;rx=amp*sn+ib*.05;fx=-(.25+.45*b*Math.max(0,-sn));
          if(i===0&&st==='browse'){rx=rx*(1-reach)-1.35*reach;fx=fx*(1-reach)-.35*reach;rz=-.1+.15*reach;ry=.2*reach;if(tob){rx=rx*(1-tob)+.25*tob;fx=fx*(1-tob)-.9*tob;ry=ry*(1-tob)-.7*tob;rz=rz*(1-tob)+.35*tob;}}
          if(st==='queue'&&i===0&&ud.phone&&ud.phoneM&&ud.phoneM.visible){rx=.05;fx=-.55-.1*Math.sin(t*.7+ud.ph);ry=.4;rz=-.08;}} // the phone forearm only with a phone in the hand
        a.rotation.set(rx,ry,rz);fo.rotation.x=fx;fo.rotation.y=0;});
      // head: keeps level against the lean, small bob, looks around / at the shelf / down the queue
      const hd=ud.head;if(hd){let ly=0,lx=-lean*.6+.02*b*Math.cos(2*ph);
        if(st==='browse'){ly=.1*Math.sin(t*.8+ud.ph);lx-=.12+.1*reach-.25*tob;}
        else if(st==='queue'){ly=Math.sin(t*.5+ud.ph)*.35;}
        else ly=Math.sin(t*.6+ud.ph)*.2;
        if(ud.lookAtP||ud.gazeP){const LP=ud.lookAtP||ud.gazeP;let a=Math.atan2(LP[0]-g.position.x,LP[1]-g.position.z)-g.rotation.y;a=((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;ly=Math.max(-.9,Math.min(.9,a))*Math.max(0,Math.min(1,1-(Math.abs(a)-1.35)/.45));lx=-lean*.6+(ud.isChild?-.25:.02);}
        if(ud.pushing)lx-=.1;
        hd.rotation.y+=(ly-hd.rotation.y)*Math.min(1,dt*3);hd.rotation.x+=(lx-hd.rotation.x)*Math.min(1,dt*3);}
      ud.yaw+=(((st==='browse'?(ud.lookDir||1)*1.1:0))-ud.yaw)*Math.min(1,dt*2.2);
    }
    function animPerson(g,t,speed,blend){posePerson(g,t,1/60,(speed||.5)*(blend==null?1:blend));}
    function idlePerson(g,t,mode){g.userData.state=mode||'queue';posePerson(g,t,1/60,0);}
    function restyle(g){const sm=g.userData.skin;if(!sm)return;const col=sm.geometry.attributes.color,C={top:new T.Color(pick_(TOP)).convertSRGBToLinear(),bot:new T.Color(pick_(BOT)).convertSRGBToLinear(),jk:new T.Color(pick_(JK)).convertSRGBToLinear()};
      g.userData.ranges.forEach(([r,s0,n])=>{const c=C[r];if(!c)return;for(let i=s0;i<s0+n;i++)col.setXYZ(i,c.r,c.g,c.b);});col.needsUpdate=true;}
    // ---------- navigation: 0.25 m occupancy grid of the floor + A* between waypoints ----------
    // obstacles are registered by build() as axis-aligned rects; two inflated grids: 0.35 m (body) and 0.55 m (stroller)
    let nav=null;const OBS=[],FACES=[],LBLS=[];
    const blk=(x,z,w,d,thin)=>OBS.push([x-w/2,x+w/2,z-d/2,z+d/2,thin?1:0]);
    const face=(x,z,dx,dz,tag)=>FACES.push([x,z,dx,dz,tag||'']);
    function navBuild(W,D,doorX,doorW){
      const c=.25,hw=W/2,hd=D/2,cols=Math.ceil(W/c),rows=Math.ceil((D+1.6)/c),x0=-hw,z0=-hd,N=cols*rows;
      const G0=new Uint8Array(N),G25=new Uint8Array(N),G35=new Uint8Array(N),G55=new Uint8Array(N);
      const mark=(g,r,inf)=>{const i0=Math.max(0,Math.ceil((r[0]-inf-x0)/c-.5)),i1=Math.min(cols-1,Math.floor((r[1]+inf-x0)/c-.5)),j0=Math.max(0,Math.ceil((r[2]-inf-z0)/c-.5)),j1=Math.min(rows-1,Math.floor((r[3]+inf-z0)/c-.5));for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)g[j*cols+i]=1;};
      // outer walls; the front wall is open at the door, with a 1.6 m apron outside it
      const walls=[[-hw-2,-hw,-hd-2,hd+4],[hw,hw+2,-hd-2,hd+4],[-hw-2,hw+2,-hd-2,-hd],[-hw-2,doorX-doorW/2,hd-.02,hd+4],[doorX+doorW/2,hw+2,hd-.02,hd+4]];
      walls.forEach(r=>{mark(G0,r,0);mark(G25,r,.26);mark(G35,r,.32);mark(G55,r,.32);});
      OBS.forEach(r=>{mark(G0,r,0);mark(G25,r,.28);mark(G35,r,.35);mark(G55,r,r[4]?.35:.55);});
      const free=(g,i,j)=>i>=0&&j>=0&&i<cols&&j<rows&&!g[j*cols+i];
      const toCell=(x,z)=>[Math.floor((x-x0)/c),Math.floor((z-z0)/c)],toWorld=(i,j)=>[x0+(i+.5)*c,z0+(j+.5)*c];
      const nearFree=(g,x,z)=>{const [i,j]=toCell(x,z);if(free(g,i,j))return [i,j];for(let r=1;r<8;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;if(free(g,i+di,j+dj))return [i+di,j+dj];}return null;};
      function astar(g,s,t){
        const open=[],gS=new Float32Array(N).fill(1e9),par=new Int32Array(N).fill(-1),closed=new Uint8Array(N);
        const h=(i,j)=>{const dx=Math.abs(i-t[0]),dy=Math.abs(j-t[1]);return Math.max(dx,dy)+.4142*Math.min(dx,dy);};
        const push=(k,f)=>{open.push([f,k]);let a=open.length-1;while(a>0){const p=(a-1)>>1;if(open[p][0]<=open[a][0])break;const tmp=open[p];open[p]=open[a];open[a]=tmp;a=p;}};
        const pop=()=>{const top=open[0],last=open.pop();if(open.length){open[0]=last;let a=0;for(;;){const l=2*a+1,r=l+1;let m=a;if(l<open.length&&open[l][0]<open[m][0])m=l;if(r<open.length&&open[r][0]<open[m][0])m=r;if(m===a)break;const tmp=open[m];open[m]=open[a];open[a]=tmp;a=m;}}return top;};
        const ks=s[1]*cols+s[0],kt=t[1]*cols+t[0];gS[ks]=0;push(ks,h(s[0],s[1]));let it=0;
        while(open.length&&it++<N*4){const k=pop()[1];if(closed[k])continue;if(k===kt){const out=[];let q=k;while(q>=0){out.push([q%cols,(q/cols)|0]);q=par[q];}return out.reverse();}closed[k]=1;const i=k%cols,j=(k/cols)|0;
          for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=i+di,nj=j+dj;if(!free(g,ni,nj))continue;if(di&&dj&&(!free(g,i+di,j)||!free(g,i,j+dj)))continue;const nk=nj*cols+ni;if(closed[nk])continue;const ng=gS[k]+(di&&dj?1.4142:1);if(ng<gS[nk]){gS[nk]=ng;par[nk]=k;push(nk,ng+h(ni,nj));}}}
        return null;}
      // string pulling: keep a node only when the straight line to the next kept node crosses no blocked cell
      const los=(g,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));for(let s=0;s<=n;s++){const x=a[0]+dx*s/n,z=a[1]+dz*s/n;if(!free(g,Math.floor((x-x0)/c),Math.floor((z-z0)/c)))return false;}return true;};
      const simplify=(g,pts)=>{const out=[pts[0]];let i=0;while(i<pts.length-1){let j=pts.length-1;while(j>i+1&&!los(g,pts[i],pts[j]))j--;out.push(pts[j]);i=j;}return out;};
      let failed=0;
      function route(g,from,to){const alt=g.alt;let s=nearFree(g,from[0],from[1]),t=nearFree(g,to[0],to[1]);let cells=s&&t?astar(g,s,t):null;if(!cells&&alt)for(const a of alt){s=nearFree(a,from[0],from[1]);t=nearFree(a,to[0],to[1]);cells=s&&t?astar(a,s,t):null;if(cells){g=a;break;}}if(!cells&&g!==G0&&g!==G25){s=nearFree(G25,from[0],from[1]);t=nearFree(G25,to[0],to[1]);cells=s&&t?astar(G25,s,t):null;if(cells)g=G25;}if(!cells&&g!==G0){s=nearFree(G0,from[0],from[1]);t=nearFree(G0,to[0],to[1]);cells=s&&t?astar(G0,s,t):null;if(cells)g=G0;} // retry without body inflation (tight small stores)
        if(!cells){if(!failed++)console.warn('nav: no path in store №'+state.n+' from',from,'to',to);return null;}
        const pts=cells.map(q=>toWorld(q[0],q[1]));pts[0]=[from[0],from[1]];pts[pts.length-1]=[to[0],to[1]];const sp=simplify(g,pts);return sp.length>1?sp:[pts[0],pts[pts.length-1]];}
      // browse cells: first free cell in front of each registered shelf face
      const browse=[];FACES.forEach(([fx,fz,dx,dz,tag])=>{for(let s=.3;s<=1.6;s+=.125){const x=fx+dx*s,z=fz+dz*s,[i,j]=toCell(x,z);if(free(G35,i,j)){browse.push({p:toWorld(i,j),f:[dx,dz],ok55:free(G55,i,j),tag});break;}}});
      return {c,cols,rows,x0,z0,G0,G25,G35,G55,free,toCell,toWorld,route,browse,queue:[],entry:null,exit:null,hw,hd,doorX,doorW,failed:()=>failed};
    }
    // ---- people on the grid: crowd simulation driven by the researched shopper spec (research/shopper-behaviour-spec.md) ----
    const PARAMS={
      lambda:{7:18,8:28,9:20,10:14,11:18,12:30,13:26,14:14,15:14,16:22,17:36,18:42,19:34,20:22,21:10}, // §1 customers/hour, weekday, ~350 customers/day
      dayMul:{wd:1,sun:.6},areaRef:350,                                                                    // §1 Sunday morning ×0.6; λ scales with area (350 m² = 1.0)
      densityMult:30,timeScale:.28,payScale:.3,speedScale:.55,                                                         // scene-time: visible density and shortened durations, ratios kept
      age:{elder:.2,teen:.05},speed:{adult:[1.2,1.4],browse:[.6,.9],elder:[.9,1.1]},                         // §2
      group:{couple:.12,child:.10},items:[[.45,1,1],[.35,2,3],[.15,4,6],[.05,7,12]],basketMin:4,basketP:.15,basketPickup:[2,4],phoneP:.35, // §2
      dwellMedian:180,impulseP:.65,grab:[3,8],browse:[15,60],browseP:{adult:.3,elder:.45,lunch:.2},standOff:[.4,.7],reach:[1,2], // §3
      decompress:[1.5,3],rightTurnP:.6,loopP:.5,boomerangP:.6,fixtureGap:.5,                                 // §4
      queueGap:.8,balkAt:99,balkP:0,renegeAfter:1e9,renegeP:0,impulseTillP:.15,                           // §5
      greet:[1,2],scanPerItem:3.7,cashP:.5,cash:[9,18],card:[4,8],bagging:[0,15],goodbye:[2,4],elderPayMul:1.5, // §6
      returnBasketP:.95,returnBasket:[2,3],pauseOutsideP:.05,                                                // §7
      restockOn:[600,1200],restockEvery:[3600,7200],buyP:1                                                // §8 (+ share of visitors who actually buy)
    };
    const rnd=(a,b)=>a+Math.random()*(b-a),rr=r=>rnd(r[0],r[1]);
    const qOcc=[];let flowDirty=true,flowT=0,camSub=null;
    const angTo=(a,b,k)=>{let d=b-a;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return a+d*k;};
    // turning like a person: eased toward the new heading, but never faster than w rad/s (≈150–230°/s) — no snapping round on the spot
    const angStep=(a,b,k,dt,w)=>{let d=b-a;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;const st=d*Math.min(1,dt*k),m=w*dt;return a+Math.max(-m,Math.min(m,st));};
    const floorY=(x,z)=>{if(!S.wine)return 0;const zW=S.zW;if(z>zW+.55)return 0;if(z<zW-.55)return S.yF;return S.yF*(zW+.55-z)/1.1;};
    const gridOf=g=>g.userData.stroller?nav.G55:(g.userData.buyer?nav.G35:(nav.G35X||nav.G35));
    // the grid with the people who are standing still (at a shelf, in the queue, at the till, just inside the door) marked as obstacles,
    // so a route is planned round them instead of through them; route() falls back to the bare grid if that leaves no way at all
    function gridDyn(g){const G=gridOf(g);let D=null;for(const o of people){if(o===g||!o.visible||o.userData.follow!=null)continue;const s=o.userData.state;if(!(s==='browse'||s==='queue'||s==='enter'||s==='ddd'||o.userData.pay||(s==='walk'&&(o.userData.yielding||o.userData.holdT>0))))continue;
      if(!D)D=G.slice();const [i,j]=nav.toCell(o.position.x,o.position.z),R_=g.userData.stroller?2:1;for(let dj=-R_;dj<=R_;dj++)for(let di=-R_;di<=R_;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows)D[jj*nav.cols+ii]=1;}}
      for(const o of people){const ou=o.userData;if(o===g||!o.visible||!ou.chat||ou.partner==null)continue;const p_=people[ou.partner];if(!p_||p_===g||!p_.visible)continue;const L_=Math.hypot(p_.position.x-o.position.x,p_.position.z-o.position.z);if(L_>2.4)continue;if(!D)D=G.slice();for(let s_=.25;s_<L_-.2;s_+=.12){const [ci,cj]=nav.toCell(o.position.x+(p_.position.x-o.position.x)*s_/L_,o.position.z+(p_.position.z-o.position.z)*s_/L_);if(ci>=0&&cj>=0&&ci<nav.cols&&cj<nav.rows)D[cj*nav.cols+ci]=1;}NORMS.n.between++;} // manners: not between two people talking
      if(VZ.zone&&!g.userData.ddd&&!g.userData.pay){if(!D)D=G.slice();const Z=VZ.zone,xs=[Z.x-Z.r,Z.x+Z.r],zs=[Z.z-Z.r,Z.z+Z.r];if(Z.cx!=null){xs.push(Z.cx-.5,Z.cx+.5);zs.push(Z.cz-.5,Z.cz+.5);}
        const a=nav.toCell(Math.min(...xs),Math.min(...zs)),b=nav.toCell(Math.max(...xs),Math.max(...zs)),keep=[[g.position.x,g.position.z],nav.entry,nav.exit].concat(nav.queue||[]);
        for(let jj=Math.max(0,Math.min(a[1],b[1]));jj<=Math.min(nav.rows-1,Math.max(a[1],b[1]));jj++)for(let ii=Math.max(0,Math.min(a[0],b[0]));ii<=Math.min(nav.cols-1,Math.max(a[0],b[0]));ii++){const w=nav.toWorld(ii,jj);if(inZone(w[0],w[1])&&!keep.some(k=>k&&Math.hypot(k[0]-w[0],k[1]-w[1])<.7))D[jj*nav.cols+ii]=1;}}
      for(const o of people){const st_=o.userData.stroller;if(o===g||!o.visible||!st_||!st_.visible||o.userData.state==='walk')continue;if(!D)D=G.slice();const [ci,cj]=nav.toCell(st_.position.x,st_.position.z);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=ci+di,jj=cj+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows)D[jj*nav.cols+ii]=1;}} // a parked pram: routes go round it
      if(VZ.fp&&!g.userData.ddd){const gx=g.position.x,gz=g.position.z,mk=B=>{for(const c of VZ.fp){const r=c[2]+.25,a=nav.toCell(c[0]-r,c[1]-r),b=nav.toCell(c[0]+r,c[1]+r);
          for(let jj=Math.max(0,a[1]);jj<=Math.min(nav.rows-1,b[1]);jj++)for(let ii=Math.max(0,a[0]);ii<=Math.min(nav.cols-1,b[0]);ii++){const w=nav.toWorld(ii,jj);if(Math.hypot(w[0]-c[0],w[1]-c[1])<r&&Math.hypot(w[0]-gx,w[1]-gz)>.45)B[jj*nav.cols+ii]=1;}}return B;};
        if(!D)D=G.slice();mk(D);D.alt=[mk(G.slice()),mk(nav.G25.slice()),mk(nav.G0.slice())];} /* if the way is shut by the people standing about, the next try still goes round him, never through */
      return D||G;}
    // §1: arrival rate now → time a slot stays "away" before the next visitor uses it
    function lambdaNow(){const h=Math.floor(state.t/60);const l=PARAMS.lambda[h]||6;return l*(PARAMS.dayMul[state.day]||1)*Math.max(.3,S.A/PARAMS.areaRef);}
    function awayDur(){return Math.max(3,Math.min(30,3600/(lambdaNow()*PARAMS.densityMult)))*rnd(.6,1.5);}
    function nItems(){const r=Math.random();let a=0;for(const [p,lo,hi] of PARAMS.items){a+=p;if(r<a)return Math.round(rnd(lo,hi));}return 1;}
    // §4: nearest-neighbour ordering from the entrance with a right-turn tendency (right = +x side of the door)
    function orderTargets(list){const out=[];let cur=[S.door.x,S.hd];const pool=list.slice();if(pool.length&&Math.random()<PARAMS.rightTurnP){pool.sort((a,b)=>(b.p[0]-a.p[0]));const first=pool.shift();out.push(first);cur=first.p;}
      while(pool.length){let bi=0,bd=1e9;pool.forEach((b,i)=>{const d=Math.hypot(b.p[0]-cur[0],b.p[1]-cur[1]);if(d<bd){bd=d;bi=i;}});const b=pool.splice(bi,1)[0];out.push(b);cur=b.p;}return out;}
    function pickBrowse(g,n){const G=gridOf(g),pool=nav.browse.filter(b=>(!g.userData.stroller||b.ok55)&&(()=>{const [ci,cj]=nav.toCell(b.p[0],b.p[1]);return nav.free(G,ci,cj);})()&&!inZone(b.p[0],b.p[1],.2)&&!people.some(o=>o!==g&&o.visible&&o.userData.state==='browse'&&o.userData.partner!==people.indexOf(g)&&g.userData.partner!==people.indexOf(o)&&Math.hypot(o.position.x-b.p[0],o.position.z-b.p[1])<.9)); /* only spots one can walk to and away from, never at the specialist's work, never right beside a stranger already looking at that shelf (people keep their distance: the butt-brush effect) */const out=[];for(let k=0;k<n&&pool.length;k++){const j=(Math.random()*pool.length)|0;out.push(pool.splice(j,1)[0]);}return orderTargets(out);}
    function fallbackPath(from){const s=S;return [[from[0],from[1]],[s.door.x,s.hd-.9],[s.mainX,s.hd-.9],[s.mainX,s.zTop-.6],[s.mainX,s.hd-.9],[s.door.x-.25,s.hd+1.3]];}
    // a straight leg of the way that cuts close past the corner of a counter or a shelf gets a bend that keeps ~30 cm off it, as people walk
    // round a corner (not at the ends: there one steps right up to the shelf or the counter on purpose)
    function roundCorners(P,G){const near=(x,z)=>{let m=9,nx=0,nz=0;for(const q of OBS){const cx=Math.max(q[0],Math.min(x,q[1])),cz=Math.max(q[2],Math.min(z,q[3])),d=Math.hypot(x-cx,z-cz);if(d<m){m=d;nx=x-cx;nz=z-cz;}}return [m,nx,nz];};
      const out=[P[0]];let added=0;for(let i=1;i<P.length;i++){let a=out[out.length-1];const b=P[i];for(let rep_=0;rep_<3&&added<8;rep_++){const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.8)break;let w=null;
          for(let t=.35;t<=L-.35;t+=.12){const x=a[0]+dx/L*t,z=a[1]+dz/L*t,[m,nx,nz]=near(x,z);if(m<.28&&(!w||m<w[0]))w=[m,x,z,nx,nz];}if(!w)break;
          const n=Math.hypot(w[3],w[4])||1,px=w[1]+w[3]/n*(.34-w[0]),pz=w[2]+w[4]/n*(.34-w[0]),[ci,cj]=nav.toCell(px,pz);if(!nav.free(nav.G0,ci,cj))break;out.push([px,pz]);added++;a=[px,pz];}
        out.push(b);}return out;}
    function setPath(g,path,T_){const ud=g.userData;if(ud.room){ud.room=null;ud.dockV=0;}if(!path){path=fallbackPath([g.position.x,g.position.z]);ud.fallback=true;}
      else if(path.length>1&&!circleFree(path[0][0],path[0][1],.3)){const f0=path[0],n1=path[1],L1=Math.hypot(n1[0]-f0[0],n1[1]-f0[1])||1;let best=null; // standing right at a counter or a shelf: a step back into the aisle first, then off
        for(const r of [.3,.42,.55])for(let a=0;a<6.28;a+=.4){const x=f0[0]+Math.sin(a)*r,z=f0[1]+Math.cos(a)*r,[ci,cj]=nav.toCell(x,z);if(!nav.free(gridOf(g),ci,cj)||!circleFree(x,z,.34))continue;const c=r-.25*((x-f0[0])*(n1[0]-f0[0])+(z-f0[1])*(n1[1]-f0[1]))/(r*L1);if(!best||c<best[2])best=[x,z,c];}
        if(best)path=[f0,[best[0],best[1]]].concat(path.slice(1));}
      if(path&&path.length>1)path=roundCorners(path,gridOf(g));ud.path=path;ud.pi=0;ud.stuckT=0;ud.px=null;ud.pAcc=0;ud.state='walk';ud.blend=ud.blend||0;flowDirty=true;}
    // §2/§3/§9: a visit = ENTER(decompression, basket pickup) → stops (grab | browse) → [QUEUE → PAY → RETURN_BASKET] → EXIT
    // ---- the shopper's mind: who this person is, what they came for, where they look, how they walk -------------------------------------
    // Each visitor is someone of their own: a pace, a curiosity, patience, sociability, decisiveness, thrift, how well they know the shop and
    // how much of a hurry they are in. They come with a short list (the shop's sections, read off its signs), look along the shelves they
    // pass (longer at what is on their list, and slow a little there), glance ahead at the shelf they are making for, stop at a turn to get
    // their bearings when the shop is new to them, take the step with care, and now and then remember something on the way to the till
    const traits=()=>({pace:rnd(.88,1.13),cur:Math.random(),pat:Math.random(),soc:Math.random(),dec:Math.random(),thr:Math.random(),fam:Math.random(),hur:Math.random()});
    function catOf(b){if(b.cat!=null)return b.cat;let c=b.tag||'';if(!c){let bd=4.5;for(const L of LBLS){if(/Вход|Каса|Склад/.test(L[0]))continue;const d=Math.hypot(L[1]-b.p[0],L[2]-b.p[1]);if(d<bd){bd=d;c=L[0];}}}return b.cat=c||'misc';}
    const sweet=c=>/haribo|milka|snack|Сладки/i.test(c||'');
    function candySpot(){if(S._candyTok===buildTok)return S._candy;let best=null,bd=4;const q0=nav&&nav.queue&&nav.queue[0];if(q0)FACES.forEach(f=>{if(!sweet(f[4]))return;const d=Math.hypot(f[0]-q0[0],f[1]-q0[1]);if(d<bd){bd=d;best=[f[0],f[1]];}});S._candy=best;S._candyTok=buildTok;return best;}
    // ---- manners: the unwritten rules people in a shop go by. Each person looks them up in the moment and applies them (or not) in his own
    // way: how polite (soc), how patient (pat), how much in a hurry (hur). Who gives way is settled between the two on the spot: whoever
    // has more to manoeuvre (the ladder, a pram), is older or carries the full basket goes first; between equals the more polite one yields,
    // and the other thanks him with a look. Rules: 1) at the door, those going out first; 2) coming at each other in a gangway, keep to
    // the right (or wait if there is no room); 3) never walk between two people talking (the route goes round them)
    const NORMS={n:{door:0,pass:0,wait:0,between:0,thanks:0}};window.__norms=()=>NORMS.n;
    const nRank=g=>{const u=g.userData;return u.ddd?4:u.stroller?3:u.elder?2:(u.hasBasket||u.carry)?1:0;};
    const nPolite=g=>{const t=g.userData.tr||{};return clamp(.3+.45*(t.soc==null?.5:t.soc)+.3*(t.pat==null?.5:t.pat)-.3*(t.hur||0),0,1);};
    const legOf=o=>{const u=o.userData,l=u.visit&&u.visit[u.legI];return l?l.kind:'';};
    function nThanks(o,g,T_){const u=o.userData;if(u.ddd||u.glanceAt)return;u.glanceAt=T_+1.1;u.glanceTo=g;u.glanceNext=T_+4;NORMS.n.thanks++;}
    function manners(g,ud,T_){if(T_<(ud.nT||0))return;ud.nT=T_+.25+Math.random()*.15;const P=ud.path;if(!P||ud.pi==null||!P[ud.pi+1]||ud.follow!=null||ud.holdT>0||ud.pay)return;
      const x=g.position.x,z=g.position.z,n=P[ud.pi+1],hx=n[0]-x,hz=n[1]-z,hL=Math.hypot(hx,hz)||1,fx=hx/hL,fz=hz/hL,pol=nPolite(g);
      // 0) a parent never walks on away from a child who has fallen behind: stops, turns to look for it and waits a moment, then on
      {const me_=people.indexOf(g),k_=people.find(o=>o.visible&&o.userData.isChild&&o.userData.follow===me_);if(k_&&!k_.userData.want){const kd=Math.hypot(k_.position.x-x,k_.position.z-z);if(!ud.kidW&&kd>2.4){ud.kidW=T_;NORMS.n.kid=(NORMS.n.kid||0)+1;}if(ud.kidW&&(kd<1.6||T_-ud.kidW>14))ud.kidW=0; /* waits until the child is back by the side (never for ever) */if(ud.kidW){ud.pauseT=Math.max(ud.pauseT||0,.45);ud.pauseLook=()=>[k_.position.x,k_.position.z];ud.nT=T_+.2;return;}}else ud.kidW=0;}
      // 1) at the door: whoever comes in steps aside for a moment and lets those going out by
      if(S.door&&Math.abs(z-nav.hd)<1.6&&Math.abs(x-S.door.x)<S.door.w&&fz<-.3&&legOf(g)!=='exit'&&legOf(g)!=='returnBasket'&&T_>(ud.nDoor||0)){
        const o=people.find(o=>o!==g&&o.visible&&o.userData.state==='walk'&&!o.userData.ddd&&o.userData.follow==null&&(legOf(o)==='exit'||legOf(o)==='returnBasket')&&o.position.z<z+.2&&Math.hypot(o.position.x-x,o.position.z-z)<1.7);
        if(o){ud.nDoor=T_+4;if(Math.random()<.35+.65*pol){ud.holdT=rnd(.7,1.3);NORMS.n.door++;nThanks(o,g,T_);return;}}}
      // 2) coming at each other: keep to the right; the one who gives way steps right (or left if the right is shut), or waits
      if(T_>(ud.nPass||0))for(const o of people){const ou=o.userData;if(o===g||!o.visible||ou.state!=='walk'||ou.follow!=null||ou.holdT>0)continue;const ox=o.position.x-x,oz=o.position.z-z,d=Math.hypot(ox,oz);if(d>2.2||d<.55)continue;
        if((ox*fx+oz*fz)/d<.75)continue;const ovx=ou.vx||0,ovz=ou.vz||0,ov=Math.hypot(ovx,ovz);if(ov<.15||(ovx*fx+ovz*fz)/ov>-.6)continue; // ahead, and coming this way
        if(Math.abs(ox*fz-oz*fx)>.75)continue; // they would pass clear anyway
        const rg=nRank(g),ro=nRank(o),po=nPolite(o),meFirst=rg>ro||(rg===ro&&(pol<po||(pol===po&&people.indexOf(g)<people.indexOf(o))));ud.nPass=T_+2.5;if(meFirst)continue;
        if(Math.random()>.5+.5*pol&&rg===ro)continue; // not everyone bothers: then the steering sorts it out as they meet
        const G_=gridOf(g);let done=false;for(const sd of [1,-1]){const rx=fz*sd,rz=-fx*sd,wx=x+rx*.45+fx*.35,wz=z+rz*.45+fz*.35,[ci,cj]=nav.toCell(wx,wz);if(!nav.free(G_,ci,cj)||!circleFree(wx,wz,.24))continue;if(people.some(q=>q!==g&&q.visible&&Math.hypot(q.position.x-wx,q.position.z-wz)<.5))continue;P.splice(ud.pi+1,0,[wx,wz]);done=true;break;}
        if(done)NORMS.n.pass++;else{ud.holdT=rnd(.8,1.4);NORMS.n.wait++;}ou.nPass=T_+2.5;nThanks(o,g,T_);return;}}
    function mindWalk(g,dt,T_){const ud=g.userData,tr=ud.tr||(ud.tr=traits());
      if(ud.pauseT>0){ud.pauseT-=dt;ud.vx=ud.vz=0;ud.vNow=0;if(ud.pauseT<=0){ud.pauseLook=null;const f=ud.pauseThen;ud.pauseThen=null;if(f)f(T_);}return 0;}
      const lg=ud.visit&&ud.visit[ud.legI],k=lg?lg.kind:'',x=g.position.x,z=g.position.z,fa=ud.ang||0,fx=Math.sin(fa),fz=Math.cos(fa),P=ud.path;let m=tr.pace;
      if(k==='ask'&&(ud.stuckT||0)>=2){ud.firstTime=false;navNext(g,T_);return 0;}
      if(k==='queue'||k==='exit')m*=1.03+.1*tr.hur;else m*=.93+.1*tr.hur;if(ud.hasBasket&&ud.items>=4)m*=.95;if(ud.firstTime)m*=.92;
      if(S.wine&&S.zW!=null&&Math.abs(z-S.zW)<.75)m*=.78; // the step down to the wine: taken with care
      const crowd=r=>people.some(o=>o!==g&&o.visible&&!o.userData.ddd&&Math.hypot(o.position.x-x,o.position.z-z)<r);
      // a first-timer at a turn of the way: a moment to get the bearings, the head this way and that
      if(ud.pi!==ud.lastPi){ud.lastPi=ud.pi;if(ud.firstTime&&P&&ud.pi>0&&ud.pi<P.length-1&&Math.random()<.45+.3*(1-tr.hur)){const a=P[ud.pi-1],b=P[ud.pi],c=P[ud.pi+1],a1=Math.atan2(b[0]-a[0],b[1]-a[1]),a2=Math.atan2(c[0]-b[0],c[1]-b[1]);let d=a2-a1;d=Math.abs(((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI);
        if(d>.8&&!crowd(1.1)){const t0=T_,s=Math.random()<.5?1:-1,sw=rnd(.45,.7);ud.pauseT=rnd(.7,1.6);ud.pauseLook=t=>{const ph=((t-t0)/sw|0)%2?s:-s,aa=a2+ph*rnd(.6,.8);return [x+Math.sin(aa)*3,z+Math.cos(aa)*3];};return 0;}}}
      // on the way to the till: "the bread!" - a stop, a look back, and off to one more shelf
      if(k==='queue'&&!ud.forgot&&P&&tr.dec<.35&&Math.random()<dt*.3){ud.forgot=true;const e=P[P.length-1];if(Math.hypot(e[0]-x,e[1]-z)>2.5&&!crowd(1)){const b=pickBrowse(g,6).find(b=>!ud.visit.some(l=>l.b===b));
          if(b){ud.pauseT=rnd(.8,1.4);ud.pauseLook=()=>[x-fx*3+fz*.8,z-fz*3-fx*.8];ud.pauseThen=t=>{if(ud.slot!=null&&qOcc[ud.slot]===g)qOcc[ud.slot]=null;ud.slot=null;ud.visit.splice(ud.legI,0,{kind:'browse',b,dur:rr(PARAMS.grab)*(.7+.6*tr.thr)});startLeg(g,t);};return 0;}}}
      // the shelves on the way: a look along them (longer and slower at what is on the list)
      if(T_>(ud.scanNext||0)&&nav.browse){let best=null,bs=-9;for(const b of nav.browse){const ox=b.p[0]-x,oz=b.p[1]-z,L=Math.hypot(ox,oz);if(L>2.4||L<.4)continue;const ah=(ox*fx+oz*fz)/L;if(ah<-.1)continue;const inL=!!(ud.list&&ud.list.includes(catOf(b))),sc=(inL?2:tr.cur)+ah*.3-L*.2+Math.random()*.3;if(sc>bs){bs=sc;best=[b,inL];}}
        ud.scanNext=T_+rnd(1.2,3.6)*(1.5-tr.cur);if(best&&(best[1]||Math.random()<.2+.6*tr.cur)){const b=best[0];ud.scanP=[b.p[0]-b.f[0]*.6,b.p[1]-b.f[1]*.6];ud.scanUntil=T_+rnd(.6,1.4)*(.8+.5*tr.cur);ud.scanList=best[1];}}
      if(T_<(ud.scanUntil||0))m*=ud.scanList?.72:.88;
      ud.spM=(ud.spM||m)+(m-(ud.spM||m))*Math.min(1,dt*1.8);return ud.spM;}
    function mindGaze(g,T_){const ud=g.userData;let p=null;if(ud.pauseT>0&&ud.pauseLook)p=ud.pauseLook(T_);else if(T_<(ud.scanUntil||0))p=ud.scanP;
      else{const lg=ud.visit&&ud.visit[ud.legI];if(lg&&lg.kind==='browse'&&lg.b){const d=Math.hypot(lg.b.p[0]-g.position.x,lg.b.p[1]-g.position.z);if(d<2.6&&d>.5)p=[lg.b.p[0]-lg.b.f[0]*.6,lg.b.p[1]-lg.b.f[1]*.6];}} // the shelf it makes for, a few steps ahead
      ud.gazeP=p;}
    function planVisit(g,inside){const ud=g.userData,ts=PARAMS.timeScale,eld=!!ud.elder;ud.items=nItems();ud.buyer=Math.random()<PARAMS.buyP;
      ud.hasBasket=!ud.pushing&&!ud.isChild&&(ud.items>=PARAMS.basketMin||Math.random()<PARAMS.basketP);ud.bagTaken=false;ud.basketL=false;ud.basketOnCounter=false;
      const stops=Math.max(1,Math.min(4,(inside?Math.max(1,ud.items-1):ud.items)+(Math.random()<PARAMS.impulseP?1:0)));
      const bp=state.t>=690&&state.t<=810?PARAMS.browseP.lunch:(eld?PARAMS.browseP.elder:PARAMS.browseP.adult);
      ud.tr=traits();ud.firstTime=ud.tr.fam<.28;ud.forgot=false;ud.spM=null;ud.lastPi=null;ud.pauseT=0;ud.carry=false;
      const pool=pickBrowse(g,40),cats=[...new Set(pool.map(catOf))];ud.list=[];const nl=Math.min(stops,1+((Math.random()*Math.min(3,cats.length))|0));for(let i=0;i<nl&&cats.length;i++)ud.list.push(cats.splice((Math.random()*cats.length)|0,1)[0]);
      const sel=[];ud.list.forEach(c=>{const o=pool.filter(b=>catOf(b)===c&&!sel.includes(b));if(o.length)sel.push(o[(Math.random()*o.length)|0]);});while(sel.length<stops){const o=pool.filter(b=>!sel.includes(b));if(!o.length)break;sel.push(o[(Math.random()*o.length)|0]);}
      ud.visit=orderTargets(sel).map(b=>{const inL=ud.list.includes(catOf(b));return {kind:'browse',b,dur:(Math.random()<bp?rr(PARAMS.browse)*ts*1.25:rr(PARAMS.grab))*(inL?.8+.6*ud.tr.thr:.55+.4*ud.tr.cur)};});
      if(ud.phone&&!ud.pushing&&Math.random()<.3){const L_=ud.visit[(Math.random()*ud.visit.length)|0];if(L_)L_.call=rnd(5,11);} // a call comes in: taken standing by a shelf
      if(ud.buyer){ud.visit.push({kind:'queue'});if(ud.hasBasket&&Math.random()<PARAMS.returnBasketP)ud.visit.push({kind:'returnBasket'});}
      ud.visit.push({kind:'exit'});ud.legI=0;}
    const doorBusy=g=>g.userData.follow==null&&people.some(o=>o!==g&&o.visible&&o.userData.follow==null&&Math.hypot(o.position.x-nav.entry[0],o.position.z-nav.entry[1])<.75);
    function navEnter(g,T_){const ud=g.userData;
      // the doorway takes one at a time: if someone is still standing in it, this one comes in a moment later
      if(doorBusy(g)){ud.state='away';ud.until=T_+rnd(1.2,2.6);g.visible=false;if(ud.stroller)ud.stroller.visible=false;return;}
      planVisit(g,false);g.position.set(nav.entry[0],0,nav.entry[1]);ud.ang=Math.PI;g.rotation.y=ud.ang;g.visible=true;ud.trail=[[nav.entry[0],nav.entry[1]]];if(ud.stroller){ud.stroller.visible=true;ud.stroller.position.set(nav.entry[0],0,nav.entry[1]-.4);}
      ud.state='enter';ud.until=T_+(rr(PARAMS.decompress)/1.3+(ud.hasBasket?rr(PARAMS.basketPickup):0))*PARAMS.timeScale*2;}
    function navStart(g,T_,i){const ud=g.userData;ud.blend=0;ud.ang=0;
      if(i===0||!nav.browse.length){navEnter(g,T_);return;}
      const cs=pickBrowse(g,8),b=cs.find(c=>people.every(o=>o===g||o.userData.state==null||o.userData.state==='away'||Math.hypot(o.position.x-c.p[0],o.position.z-c.p[1])>.8))||cs[0];if(!b){navEnter(g,T_);return;} /* a free spot: nobody starts inside somebody else */g.position.set(b.p[0],floorY(b.p[0],b.p[1]),b.p[1]);ud.trail=[[b.p[0],b.p[1]]];ud.ang=Math.atan2(-b.f[0],-b.f[1]);g.rotation.y=ud.ang;
      planVisit(g,true);if(ud.stroller)ud.stroller.position.set(b.p[0],0,b.p[1]);
      ud.state='browse';ud.until=T_+rnd(2,20);ud.faceAng=ud.ang;}
    function startLeg(g,T_){const ud=g.userData,leg=ud.visit[ud.legI],from=[g.position.x,g.position.z];let to;
      if(leg.kind==='browse'&&ud.firstTime&&!ud.asked&&S.tl&&Math.random()<.4&&!people.some(o=>o.userData.pay)&&qOcc.every(q=>!q)&&extras.some(e=>e.userData.cashier)&&Math.hypot(S.tl.E-g.position.x,S.tl.H[2]-g.position.z)<9){ud.asked=true;const sp_=askSpot();if(sp_){ud.visit.splice(ud.legI,0,{kind:'ask',tgt:leg.b.p,at:sp_});return startLeg(g,T_);}}
      if(leg.kind==='ask'){setPath(g,nav.route(gridDyn(g),from,leg.at),T_);return;}
      if(leg.kind==='browse'){const busy=b=>people.some(o=>{if(o===g||!o.visible)return false;const u=o.userData,l=u.visit&&u.visit[u.legI];return (u.state==='browse'&&Math.hypot(o.position.x-b.p[0],o.position.z-b.p[1])<.6)||(u.state==='walk'&&l&&l.kind==='browse'&&l.b&&Math.hypot(l.b.p[0]-b.p[0],l.b.p[1]-b.p[1])<.6);});
        if(busy(leg.b)){const j=ud.visit.findIndex((l,ix)=>ix>ud.legI&&l.kind==='browse');if(j>0&&!leg.deferred){leg.deferred=true;ud.visit.splice(ud.legI,1);ud.visit.splice(j,0,leg);return startLeg(g,T_);}const alt=pickBrowse(g,8).find(b=>!busy(b));if(alt)leg.b=alt;}to=leg.b.p;}
      else if(leg.kind==='queue'){const inQ=qOcc.filter(q=>q).length;if(inQ>=PARAMS.balkAt&&Math.random()<PARAMS.balkP){ud.legI=ud.visit.length-1;return startLeg(g,T_);} // §5 balking
        let k=qOcc.findIndex(q=>!q);if(k<0){const b=pickBrowse(g,1)[0];if(b){ud.visit.splice(ud.legI,0,{kind:'browse',b,dur:rr(PARAMS.grab)});return startLeg(g,T_);}k=qOcc.length-1;}qOcc[k]=g;ud.slot=k;to=nav.queue[k];}
      else if(leg.kind==='returnBasket')to=nav.stack||nav.exit;
      else to=nav.exit;
      setPath(g,nav.route(gridDyn(g),from,to),T_);}
    // a first visit and the shop is new: ask at the till while the cashier is free; she answers and points the way, the eyes follow her hand
    function askSpot(){const T=S.tl;if(!T||!nav.queue||!nav.queue[0])return null;const d0=[T.E-.4,T.H[2]-.41];let best=null;
      for(const r of [.65,.8,.95])for(let a=0;a<6.28;a+=.35){const x=d0[0]+Math.sin(a)*r,z=d0[1]+Math.cos(a)*r,[ci,cj]=nav.toCell(x,z);if(!nav.free(nav.G35,ci,cj)||!circleFree(x,z,.3))continue;if(nav.queue.some(q=>q&&Math.hypot(q[0]-x,q[1]-z)<.65))continue;const c=Math.hypot(x-d0[0],z-d0[1]);if(!best||c<best[2])best=[x,z,c];}
      return best?[best[0],best[1]]:null;}
    function navArrive(g,T_){const ud=g.userData,leg=ud.visit[ud.legI],ts=PARAMS.timeScale;ud.gazeP=null;
      if(leg.kind==='ask'){const cs=extras.find(e=>e.userData.cashier);if(!cs||people.some(o=>o.userData.pay)){navNext(g,T_);return;}ud.state='browse';ud.until=T_+rnd(4.5,7);ud.faceAng=Math.atan2(cs.position.x-g.position.x,cs.position.z-g.position.z);ud.shelfAng=null;ud.ask={cs,t0:T_,tgt:leg.tgt,st0:cs.userData.state};return;}
      if(leg.kind==='browse'){ud.state='browse';ud.until=T_+leg.dur;ud.faceAng=Math.atan2(-leg.b.f[0],-leg.b.f[1]);ud.shelfAng=ud.faceAng;if(leg.call&&ud.phone){ud.call=T_+leg.call;ud.until=Math.max(ud.until,ud.call+rnd(1,3));ud.faceAng+=(Math.random()<.5?1:-1)*rnd(.9,1.5);}}
      else if(leg.kind==='queue'){ud.state='queue';ud.faceAng=Math.atan2(-.55,.83);ud.until=1e12;ud.qT=T_;} /* toward the counter; the one being served turns to the cashier */
      else if(leg.kind==='returnBasket'){ud.state='browse';ud.until=T_+rr(PARAMS.returnBasket)*ts;ud.faceAng=Math.atan2(-1,0);ud.hasBasket=false;}
      else{ud.state='away';ud.until=T_+awayDur();g.visible=false;if(ud.stroller)ud.stroller.visible=false;ud.fallback=false;}}
    function navNext(g,T_){g.userData.legI++;startLeg(g,T_);}
    // walking: a velocity model, as in current crowd simulations. The route gives the direction; the speed and the sideways part come from the
    // people around: personal space (never closer than ~0.6 m), anticipation (where will we and they be in the next second? steer to the side
    // that opens, head-on both keep right), following (a slower walker ahead is followed, not walked through), and only when someone stands
    // right in the way with no room past do we wait, and then a new route is planned round the standing people. A stroller parent stops 0.7 m early
    let _tn=0;const T_now=()=>_tn;
    function advance(g,d,dt){_tn++;const ud=g.userData,P=ud.path;if(!isFinite(ud.ang))ud.ang=isFinite(g.rotation.y)?g.rotation.y:0; /* a heading always defined: an undefined one can never be turned */let x=g.position.x,z=g.position.z;const lg=ud.visit&&ud.visit[ud.legI],stopAt=ud.stroller&&!(lg&&lg.kind==='queue')?.7:0;
      while(ud.pi<P.length-2&&Math.hypot(P[ud.pi+1][0]-x,P[ud.pi+1][1]-z)<.2){ud.pi++;if(P[ud.pi][2]==='hold')ud.holdT=rnd(.8,1.4);}
      if(ud.pi<P.length-2&&P[ud.pi+1][2]!=='hold'){const a_=P[ud.pi+1],b_=P[ud.pi+2];if((x-a_[0])*(b_[0]-a_[0])+(z-a_[1])*(b_[1]-a_[1])>0){const G_=gridOf(g),L_=Math.hypot(b_[0]-x,b_[1]-z),n_=Math.max(1,Math.ceil(L_/.1));let clr=true;for(let s_=1;s_<=n_&&clr;s_++){const c_=nav.toCell(x+(b_[0]-x)*s_/n_,z+(b_[1]-z)*s_/n_);clr=nav.free(G_,c_[0],c_[1]);}if(clr)ud.pi++;}}
      if(ud.holdT>0){ud.holdT-=dt;ud.vx=ud.vz=0;ud.vNow=0;ud.yielding=false;return false;}
      let rem=0;for(let k=ud.pi;k<P.length-1;k++){const a=k===ud.pi?[x,z]:P[k];rem+=Math.hypot(P[k+1][0]-a[0],P[k+1][1]-a[1]);}
      const tol=stopAt+(lg&&lg.kind==='queue'?.15:.03);if(rem<=tol){ud.vx=ud.vz=0;ud.vNow=0;return true;}
      const n=P[ud.pi+1],dx=n[0]-x,dz=n[1]-z,L=Math.hypot(dx,dz)||1,fx=dx/L,fz=dz/L,vx0=ud.vx||0,vz0=ud.vz||0,moving=Math.hypot(vx0,vz0)>.2;
      // from a standstill, first turn towards the next leg when it points more than ~50° away (nobody sets off sideways)
      {const a0=Math.atan2(dx,dz);let dd=a0-ud.ang;dd=((dd+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(dd)>(ud.stroller?1.4:ud.follow!=null&&people[ud.follow]&&people[ud.follow].userData.state==='walk'?2.3:1.1)&&!moving)ud.turning=true;
        if(ud.turning){ud.ang=angStep(ud.ang,a0,ud.stroller?3:7,dt,ud.stroller?1.3:3.0);g.rotation.y=ud.ang;ud.vx=ud.vz=0;ud.vNow=0;ud.turnedAt=T_now();if(Math.abs(dd)<.55)ud.turning=false;else return false;}}
      const sp=d/Math.max(dt,1e-3);let want=Math.min(sp,(rem-stopAt)/Math.max(dt,1e-3),Math.sqrt(2.8*Math.max(0,rem-stopAt))+.05),ax=0,az=0,block=null;{let d_=Math.atan2(fx,fz)-(ud.ang||0);d_=Math.abs(((d_+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI);if(d_>.9)want*=Math.max(ud.stroller?.3:.12,1-(d_-.9)/1.2);} /* the way bends sharply: slow down and turn the body first, as people do */const me=people.indexOf(g);
      for(const o of people){if(o===g||!o.visible||o.userData.follow===me||ud.follow===people.indexOf(o))continue;const ox=o.position.x-x,oz=o.position.z-z,L2=Math.hypot(ox,oz);if(L2>1.8||L2<.02)continue;
        const ou=o.userData,walking=ou.state==='walk'&&!ou.turning&&!ou.yielding,ovx=walking?(ou.vx||0):0,ovz=walking?(ou.vz||0):0;
        if(L2<.6){const w=(.6-L2)/.6;ax-=ox/L2*w*1.4;az-=oz/L2*w*1.4;}                                   // personal space
        const ahead=(ox*fx+oz*fz)/L2;if(ahead<.25)continue;
        const rvx=ovx-fx*want,rvz=ovz-fz*want,rv2=rvx*rvx+rvz*rvz;const t=rv2>1e-4?clamp(-(ox*rvx+oz*rvz)/rv2,0,1.2):0;   // when are we closest?
        const cx=ox+rvx*t,cz=oz+rvz*t,cd=Math.hypot(cx,cz);
        if(cd<.7){const side=(cx*fz-cz*fx),headOn=walking&&(ovx*fx+ovz*fz)<-.2*want,SM=ud.sideMem||(ud.sideMem=new WeakMap()),prev=SM.get(o),s=Math.abs(side)<.12&&prev?prev:(Math.abs(side)<.08&&headOn?-1:(side>0?-1:1)),w=(.7-cd)/.7/(.35+t);SM.set(o,s); /* the side once chosen round someone is kept while it is close to a tie: no left-right-left from frame to frame */ // steer to the side that opens
          ax+=fz*s*w*.9;az+=-fx*s*w*.9;}
        if(walking&&L2<1.0&&ahead>.8&&(ovx*fx+ovz*fz)>.2){want=Math.min(want,Math.max(.25,ovx*fx+ovz*fz));}   // follow a slower walker instead of walking through
        if(walking&&L2<.5&&ahead>.5&&(ovx*fx+ovz*fz)<-.1)want=Math.min(want,.15); // face to face, nearly touching: both slow to a shuffle, the steering takes them past each other
        if(!walking&&L2<.55&&Math.abs((ox*fz-oz*fx)/L2)<.35)block=o;}
      {let OB=view.name==='fp'?(VZ.fp||[]).concat([[FPV.x,FPV.z,.22,1.8]]):VZ.fp;for(const o of people){const st_=o.userData.stroller;if(o===g||!o.visible||!st_||!st_.visible)continue;(OB=OB?OB.slice():[]).push([st_.position.x,st_.position.z,.3,1]);}
        if(ud.stroller&&ud.stroller.visible){const sx=ud.stroller.position.x,sz=ud.stroller.position.z;for(const o of people){if(o===g||!o.visible||o.userData.follow===me)continue;const d=Math.hypot(o.position.x-sx,o.position.z-sz);if(d<.65&&((o.position.x-sx)*fx+(o.position.z-sz)*fz)>-.1){want=Math.min(want,d<.45?.08:.2);const os_=o.userData.state;if(d<.55&&(os_==='browse'||os_==='queue'))askRoom(o,g,fx,fz);if(d<.5){ud.prB=(ud.prB||0)+dt;if((ud.prB>1.2&&!ud.prRe)||(ud.prB>4&&!ud.prRe2)){if(ud.prB>4)ud.prRe2=true;ud.prRe=true;const np=nav.route(gridDyn(g),[x,z],P[P.length-1]);if(np&&np.length>1){setPath(g,np);return false;}}
          if(o.userData.state!=='walk'&&ud.prB>.3&&ud.prB<7){ud.yielding=true;ud.vx=ud.vz=0;ud.vNow=0;ud.vAct=0;return false;}}}}if(!ud.stroller||(ud.prB||0)>0&&!people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-ud.stroller.position.x,o.position.z-ud.stroller.position.z)<.6)){ud.prB=0;ud.prRe=ud.prRe2=false;}} /* someone in front of the pram: slow, stop, never into them */
        if(OB&&!ud.ddd)for(const c of OB){const ox=c[0]-x,oz=c[1]-z,L2=Math.hypot(ox,oz)||.01,R=c[2]+.3;if(L2>R+1.4)continue; // the ladder, the case: kept clear of, passed on the open side
        if(L2<R+.25){const w=(R+.25-L2)/(R+.25);ax-=ox/L2*w*1.6;az-=oz/L2*w*1.6;}
        const ah=ox*fx+oz*fz,lat=ox*fz-oz*fx;if(ah>0&&Math.abs(lat)<R){const s_=lat>0?-1:1,w=(R+1.4-L2)/(R+1.4)*(1-Math.abs(lat)/R);ax+=fz*s_*w*1.2;az+=-fx*s_*w*1.2;}}}
      {const tE_=Math.hypot(P[P.length-1][0]-x,P[P.length-1][1]-z);if(tE_>.6)for(const q of OBS){const cx=Math.max(q[0],Math.min(x,q[1])),cz=Math.max(q[2],Math.min(z,q[3])),ox=x-cx,oz=z-cz,L_=Math.hypot(ox,oz);if(L_<.34&&L_>1e-3){const w=(.34-L_)/.34;let wx=ox/L_*w*1.5,wz=oz/L_*w*1.5;const bk=wx*fx+wz*fz;if(bk<0){wx-=fx*bk;wz-=fz*bk;}ax+=wx;az+=wz;}}} /* a shelf pushes aside, never back against the way */ // a shelf or a counter edge: kept a hand's breadth off (not when stepping up to it)
      const end=P[P.length-1],toEnd=Math.hypot(end[0]-x,end[1]-z),stopHere=()=>{ud.yielding=false;ud.waitAcc=0;ud.squeeze=false;ud.stuckT=0;ud.vx=ud.vz=0;ud.vNow=0;return true;};
      if(block&&lg&&(lg.kind==='queue'||lg.kind==='browse')&&toEnd<.6)return stopHere(); // the place (in the queue, at the shelf) is right here behind whoever stands in front: take it
      // no real progress (eased back as fast as it walks): after 2 s a new route, after 4 s near the goal it stops there, after 6 s it gives up this stop
      {ud.pAcc=(ud.pAcc||0)+dt;if(ud.pAcc>=1){const moved=ud.px!=null?Math.hypot(x-ud.px,z-ud.pz):1;ud.px=x;ud.pz=z;ud.pAcc=0; // once a second: how far did it really get?
          if(moved<.1&&!ud.turning)ud.stuckT=(ud.stuckT||0)+1;else{ud.stuckT=0;ud.replanned=false;ud.nudged=0;}}
        if(ud.stuckT>=7||(ud.stuckT>=5&&toEnd<1.5))return stopHere();
        // anti-stuck ladder: 2 s → a sidestep of 0.3 m, 3 s → a step of 0.4 m across the way, 4 s → a new route; each is a waypoint the
        // body walks to (normal pace, turn limits), never a shift of the body itself
        if(ud.stuckT>=2&&(ud.nudged||0)<(ud.stuckT>=3?2:1)&&ud.path){const lvl=ud.stuckT>=3?2:1,tg=ud.path[Math.min(ud.pi+1,ud.path.length-1)],dx0=tg[0]-x,dz0=tg[1]-z,L0=Math.hypot(dx0,dz0)||1,px_=-dz0/L0,pz_=dx0/L0,d_=lvl===1?.3:.4,s0=Math.random()<.5?1:-1;
          for(const sg of [s0,-s0]){const wx=x+px_*d_*sg+(lvl===2?dx0/L0*.1:0),wz=z+pz_*d_*sg+(lvl===2?dz0/L0*.1:0),[ci,cj]=nav.toCell(wx,wz);if(nav.free(gridOf(g),ci,cj)&&circleFree(wx,wz,.22)&&circleFree((x+wx)/2,(z+wz)/2,.22)){ud.path.splice(ud.pi+1,0,[wx,wz]);break;}}ud.nudged=lvl;}
        if(ud.stuckT>=4&&!ud.replanned){ud.replanned=true;const np=nav.route(gridDyn(g),[x,z],end);if(np&&np.length>2){setPath(g,np);ud.vx=ud.vz=0;return false;}}}
      {const nFP=!ud.ddd&&VZ.fp&&VZ.fp.some(c=>Math.hypot(c[0]-x,c[1]-z)<c[2]+1.2);if(nFP){const tn=T_now();if(!ud.fpW0||tn>ud.fpW0.t+2)ud.fpW0={x,z,t:tn,m:ud.fpW0?Math.hypot(x-ud.fpW0.x,z-ud.fpW0.z):1};} /* real headway over the last 2 s: inching to and fro next to him is no headway */const P_=ud.path,n1=P_&&P_[(ud.pi||0)+1],n2=P_&&P_[(ud.pi||0)+2],blk=nFP&&n1&&(segFP([x,z],n1,.2)||(n2&&Math.hypot(n1[0]-x,n1[1]-z)<1.2&&segFP(n1,n2,.2))); /* only when he really stands in the way ahead, not merely near */
        if(blk&&((ud.stuckT||0)>=2||ud.fpW0.m<.25)){ud.fpWait=(ud.fpWait||0)+dt;if(ud.fpWait>1.5&&!ud.fpRe){ud.fpRe=true;const np=nav.route(gridDyn(g),[x,z],end);if(np&&np.length>1&&!segFP([x,z],np[1],.2)){setPath(g,np);return false;}} /* a way round him first */
          if(ud.fpWait<8){ud.yielding=true;ud.vx=ud.vz=0;ud.vNow=0;ud.vAct=0;ud.stuckT=2;return false;}} /* no way round: one waits a little for him, as people do, then edges past */
        if(!blk){ud.fpWait=0;ud.fpRe=false;if(!nFP)ud.fpW0=null;}} // no way past the specialist at work (on the ladder in the doorway, say): one waits until he is done, as people do
      ud.blockBy=block;
      if(block&&block.userData.blockBy===g&&(ud.waitAcc||0)>1.2&&people.indexOf(g)>people.indexOf(block)&&!ud.backed){const bu=block.userData,bP=bu.path,bn=bP&&bP[Math.min((bu.pi||0)+1,bP.length-1)]||[x,z],ox=block.position.x,oz=block.position.z,lx=bn[0]-ox,lz=bn[1]-oz,lL=Math.hypot(lx,lz)||1;let best=null;
        for(const r of [.6,.85,1.1,1.4])for(let a=0;a<6.28;a+=.4){const px=x+Math.sin(a)*r,pz=z+Math.cos(a)*r,[ci,cj]=nav.toCell(px,pz);if(!nav.free(gridOf(g),ci,cj)||!circleFree(px,pz,.28))continue;let t=((px-ox)*lx+(pz-oz)*lz)/(lL*lL);t=t<0?0:t>1.6?1.6:t;if(Math.hypot(px-(ox+lx*t),pz-(oz+lz*t))<.6)continue;if(people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-px,o.position.z-pz)<.55))continue;const c=r;if(!best||c<best[2])best=[px,pz,c];}
        if(best){ud.backed=true;P.splice(ud.pi+1,0,[best[0],best[1],'hold']);ud.waitAcc=0;ud.squeeze=false;ud.yielding=false;return false;}} // "after you": into a pocket off their line, a moment, then on
      if(!block)ud.backed=false;
      if(block&&((ud.waitAcc||0)>.5||ud.squeeze))askRoom(block,g,fx,fz);
      if(block&&!ud.squeeze){
        const lx=fz*(ax*fz-az*fx>0?1:-1)*.4,lz=-fx*(ax*fz-az*fx>0?1:-1)*.4,[ci,cj]=nav.toCell(x+lx,z+lz);
        if(!nav.free(gridOf(g),ci,cj)){ud.waitAcc=(ud.waitAcc||0)+dt;
          if(ud.waitAcc>1.2&&!ud.rerouted){ud.rerouted=true;const np=nav.route(gridDyn(g),[x,z],end);if(np&&np.length>2){setPath(g,np);ud.vx=ud.vz=0;return false;}} // a way round the people who stand still
          if(ud.waitAcc<(ud.ddd?9:3)){ud.yielding=true;ud.vx=ud.vz=0;ud.vNow=0;return false;}
          ud.squeeze=true;}} // patience over: squeeze past, close but never through (the separation below keeps half a metre)
      ud.yielding=false;if(!block){ud.waitAcc=0;ud.rerouted=false;ud.squeeze=false;}
      if(ud.squeeze){ax*=.25;az*=.25;}
      // desired velocity = route direction + steering, limited to walking speed, reached smoothly (no jitter, no jumps)
      let vdx=fx*want+ax*sp,vdz=fz*want+az*sp;const vm=Math.hypot(vdx,vdz);if(vm>sp*1.05){vdx*=sp*1.05/vm;vdz*=sp*1.05/vm;}
      const k=Math.min(1,dt*8);let vx=vx0+(vdx-vx0)*k,vz=vz0+(vdz-vz0)*k;
      {const hx=Math.sin(ud.ang||0),hz=Math.cos(ud.ang||0),fw=vx*hx+vz*hz,lt=vx*hz-vz*hx,fw2=Math.max(ud.stroller?-.05:-.12,fw),lt2=Math.max(ud.stroller?-.12:-.38,Math.min(ud.stroller?.12:.38,lt));if(fw2!==fw||lt2!==lt){vx=hx*fw2+hz*lt2;vz=hz*fw2-hx*lt2;}} // feet go where the body faces: a short step back or aside, never a backward or crab walk; a sharp change of way means slowing and turning first
      const prOth=(px,pz)=>{for(const o of people){const st_=o.userData.stroller;if(o===g||!o.visible||!st_||!st_.visible||ud.follow===people.indexOf(o))continue;const d1=Math.hypot(st_.position.x-px,st_.position.z-pz);if(d1<.4&&d1<Math.hypot(st_.position.x-x,st_.position.z-z))return false;}return true;},prFree=(px,pz)=>{if(!ud.stroller||!ud.stroller.visible)return true;const a_=ud.ang||0,f_=(qx,qz)=>circleFree(qx+Math.sin(a_)*.62,qz+Math.cos(a_)*.62,.22);return f_(px,pz)||!f_(x,z);},G=gridOf(g),wedged=(()=>{const [ci,cj]=nav.toCell(x,z),inM=!nav.free(G,ci,cj);if(!inM)ud.wdgOn=false;return inM&&((ud.blkT||0)>.5||!!ud.wdgOn);})(),Gb=ud.stroller?nav.G35:G,Gw=(()=>{const [ci,cj]=nav.toCell(x,z);return nav.free(nav.G25,ci,cj)?nav.G25:nav.G0;})(),c0w=fpClr(x,z),nE_=Math.hypot(P[P.length-1][0]-x,P[P.length-1][1]-z)<.7,ok=(px,pz,g0)=>{const [ci,cj]=nav.toCell(px,pz);return nav.free(g0||wedged?Gw:Gb,ci,cj)&&(!(g0||wedged)||nE_||fpClr(px,pz)>=Math.min(c0w,.2)-.003)&&prFree(px,pz)&&prOth(px,pz)&&kidOk(px,pz)&&payOk(px,pz)&&(ud.ddd||!inFP(px,pz,.12)||inFP(x,z,.12));},payOk=(px,pz)=>{if(ud.pay||ud.ddd)return true;for(const o of people){if(o===g||!o.visible||!o.userData.pay||ud.follow===people.indexOf(o))continue;const d1=Math.hypot(o.position.x-px,o.position.z-pz);if(d1<.6&&d1<Math.hypot(o.position.x-x,o.position.z-z))return false;}return true;} /* the one paying gets room: nobody steps up close behind or beside */,kidOk=(px,pz)=>{for(const o of people){if(o===g||!o.visible||o.userData.follow!==me)continue;const d1=Math.hypot(o.position.x-px,o.position.z-pz);if(d1<.3&&d1<Math.hypot(o.position.x-x,o.position.z-z))return false;}return true;}; /* a parent never steps onto her own child either */
      if(wedged)ud.wdgOn=true;let nx=x+vx*dt,nz=z+vz*dt;
      if(!ok(nx,nz)){const f=Math.max(0,vx*fx+vz*fz);nx=x+fx*f*dt;nz=z+fz*f*dt;if(f>.05&&(ok(nx,nz)||ok(nx,nz,true))){vx=fx*f;vz=fz*f;}else if(ok(x+vx*dt,z)){nx=x+vx*dt;nz=z;vz=0;}else if(ok(x,z+vz*dt)){nx=x;nz=z+vz*dt;vx=0;}else{nx=x;nz=z;vx=vz=0;ud.blkT=(ud.blkT||0)+dt;if(ud.blkT>.6){const c0=fpClr(x,z);let bx_=null,bc=c0+1e-4;for(let k_=0;k_<12;k_++){const a_=k_*Math.PI/6,ex=x+Math.sin(a_)*.03,ez=z+Math.cos(a_)*.03,c_=fpClr(ex,ez)+.02*((Math.sin(a_)*fx+Math.cos(a_)*fz));if(c_>bc&&!people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-ex,o.position.z-ez)<.4)){bc=c_;bx_=[ex,ez];}}if(bx_){nx=bx_[0];nz=bx_[1];}} /* wedged: a small step to wherever there is more room, until free */
        if(ud.blkT>.4&&!ud.blkRe){ud.blkRe=true;const np=nav.route(gridDyn(g),[x,z],end);if(np&&np.length>1){setPath(g,np);return false;}}}} // against an edge: slide along it; boxed in a corner: a new route at once
      if(vx||vz){ud.blkT=0;ud.blkRe=false;} // only onto walkable floor: drop the sideways part; along the route the bare walls are the limit
      ud.vAct=(ud.vAct||0)+(Math.hypot(nx-x,nz-z)/Math.max(dt,1e-3)-(ud.vAct||0))*Math.min(1,dt*6);ud.slowT=ud.vAct<.08?(ud.slowT||0)+dt:0;
      if(ud.slowT>.6)for(const o of people){if(o===g||!o.visible)continue;const ou=o.userData;if((ou.state==='browse'||ou.state==='queue')&&Math.hypot(o.position.x-x,o.position.z-z)<.7)askRoom(o,g,fx,fz);}x=nx;z=nz;ud.vx=vx;ud.vz=vz;ud.vNow=Math.hypot(vx,vz);
      // the body faces where it walks, but by a smoothed velocity (~0.2 s): steering that nudges left/right from frame to frame never makes
      // the whole body twitch round its axis (seen most at the hands); pushed back for a moment, it keeps facing its way
      {const kf=Math.min(1,dt*5);ud.fvx=(ud.fvx==null?vx:ud.fvx)+(vx-(ud.fvx==null?vx:ud.fvx))*kf;ud.fvz=(ud.fvz==null?vz:ud.fvz)+(vz-(ud.fvz==null?vz:ud.fvz))*kf;
        if(ud.vNow>.12&&Math.hypot(ud.fvx,ud.fvz)>.1&&ud.turnedAt!==T_now())ud.ang=angStep(ud.ang,(ud.fvx*fx+ud.fvz*fz)>0?Math.atan2(ud.fvx,ud.fvz):Math.atan2(fx,fz),ud.stroller?3:6,dt,ud.stroller?1.6:3.3);}
      g.position.set(x,floorY(x,z),z);g.rotation.y=ud.ang;
      const tr=ud.trail;if(tr){const l=tr[tr.length-1];if(Math.hypot(l[0]-x,l[1]-z)>.2){tr.push([x,z]);if(tr.length>40)tr.shift();}}
      rem=0;for(let k=ud.pi;k<P.length-1;k++){const a=k===ud.pi?[x,z]:P[k];rem+=Math.hypot(P[k+1][0]-a[0],P[k+1][1]-a[1]);}
      return rem<=tol;}
    // making room: someone standing (at a shelf, in the queue) with a walker held up right behind or in front of them takes a small step
    // aside (~0.4 m, onto free floor, away from the walker's line), waits until the walker is past, then steps back to their place
    function askRoom(b,w,fx,fz,stay){const bu=b.userData;if(bu.room||bu.pay||bu.cashier||bu.follow!=null||(bu.state!=='browse'&&bu.state!=='queue'))return;
      const bx=b.position.x,bz=b.position.z,cr=(bx-w.position.x)*fz-(bz-w.position.z)*fx,s0=cr>=0?1:-1;
      for(const s of [s0,-s0])for(const d of stay?[.56,.46]:[.42,.3]){const tx=bx+fz*s*d,tz=bz-fx*s*d,[ci,cj]=nav.toCell(tx,tz);
        if(nav.free(nav.G0,ci,cj)&&circleFree(tx,tz,.2)&&people.every(o=>o===b||o===w||!o.visible||Math.hypot(o.position.x-tx,o.position.z-tz)>.5)){bu.room={w,home:[bx,bz],to:[tx,tz],ph:0,t:0,stay:!!stay};return;}}}
    function makeRoom(g,dt){const ud=g.userData,R=ud.room;if(!R)return;if(ud.pay){ud.room=null;ud.dockV=0;return;}R.t+=dt;
      const w=R.w,past=!w.visible||w.userData.state!=='walk'||Math.hypot(w.position.x-R.home[0],w.position.z-R.home[1])>.95;
      if(R.ph===0&&!R.stay&&R.t>.6&&(past||R.t>5))R.ph=1; // a step along to a free spot at the shelf is for good: it never steps back
      const tg=R.ph===0?R.to:R.home,dx=tg[0]-g.position.x,dz=tg[1]-g.position.z,L=Math.hypot(dx,dz);
      if(L<.01){ud.dockV=0;if(R.ph===1||R.stay){ud.room=null;}return;}
      if(R.ph===1&&!past&&R.t<6){ud.dockV=0;return;} // still passing: wait aside
      const bk=(dx*Math.sin(g.rotation.y)+dz*Math.cos(g.rotation.y))/L<-.5,st=Math.min(L,(bk?.25:.5)*dt),nx=g.position.x+dx/L*st,nz=g.position.z+dz/L*st,me_=people.indexOf(g);if(people.some(o=>{const s_=o.userData.stroller;if(o===g||!o.visible||!s_||!s_.visible||ud.follow===people.indexOf(o)||o.userData.follow===me_)return false;const d1=Math.hypot(s_.position.x-nx,s_.position.z-nz);return d1<.42&&d1<Math.hypot(s_.position.x-g.position.x,s_.position.z-g.position.z);})){ud.dockV=0;R.bw=(R.bw||0)+dt;if(R.bw>1.2)ud.room=null;return;} /* not into someone's pram: a moment's wait, then that step is not taken at all */g.position.set(nx,floorY(nx,nz),nz);ud.dockV=L>.02?(bk?.25:.45):0;} /* a step back from the shelf is a slow one */
    function strollerFollow(g,dt){const ud=g.userData,st=ud.stroller,ry=g.rotation.y,me=people.indexOf(g);
      let rx=st.position.x-g.position.x,rz=st.position.z-g.position.z,r=Math.hypot(rx,rz),a=r>.05?Math.atan2(rx,rz):ry;if(r<.05||r>2)r=.62;
      const moving_=ud.state==='walk'||ud.state==='enter',tr=moving_?.62:.55;
      const free=(aa,rr)=>{const x=g.position.x+Math.sin(aa)*rr,z=g.position.z+Math.cos(aa)*rr;if(!circleFree(x,z,.24))return false;for(const o of people){if(o===g||!o.visible||o.userData.follow===me)continue;if(Math.hypot(o.position.x-x,o.position.z-z)<.42)return false;}return true;};
      if(!moving_&&ud.stSide==null)ud.stSide=Math.random()<.5?1:-1;if(moving_)ud.stSide=null;
            const vm_=Math.hypot(ud.vx||0,ud.vz||0),pref=moving_?(vm_>.2?Math.atan2(ud.vx,ud.vz):ry):ry+ud.stSide*Math.PI/2;let ta=null; /* pushed: in front along the way it is going (not where her shoulders point), so it rolls straight and never crabs sideways */
      for(let k=0;k<=8&&ta==null;k++)for(const sg of k?[1,-1]:[1]){const aa=pref+sg*k*Math.PI/8;if(free(aa,tr)){ta=aa;break;}} /* in front while walking (beside when standing), else the nearest free place round the parent */
      {const rA=Math.hypot(rx,rz),okP=rA>.3&&rA<1&&circleFree(st.position.x,st.position.z,.2),ok_=okP&&!people.some(o=>o!==g&&o.visible&&o.userData.follow!==me&&Math.hypot(o.position.x-st.position.x,o.position.z-st.position.z)<.38);
        if(!moving_){if(ud.stPark&&okP){st.position.set(ud.stPark[0],floorY(ud.stPark[0],ud.stPark[1]),ud.stPark[1]);st.rotation.y=ud.stPark[2];return;}if(ok_&&!ud.stPark){ud.stPark=[st.position.x,st.position.z,st.rotation.y];return;}ud.stPark=null;} /* she stands: the pram stays parked exactly where she left it, as it stood (it does not slide or turn when she turns to a shelf) */
        else{ud.stPark=null;if((ud.vNow||0)<.05&&!ud.turning&&ok_)return;}} /* a moment's stop on the way: it stays in her hands, where it is */
      const a0=a,r0=r,f0=free(a0,r0);if(ta!=null){let d=ta-a;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d)>.2){const arc=(sg,len)=>{let n=0;for(let q=Math.PI/16;q<len;q+=Math.PI/16)if(!free(a0+sg*q,Math.min(r0,tr)))n++;return n;},s1=d>0?1:-1,l1=Math.abs(d),l2=2*Math.PI-l1,b1=arc(s1,l1),b2=arc(-s1,l2);if(b1>0&&b2<b1)d=-s1*l2;} /* swung round only through free floor, the long way if the short one is shut */a+=Math.max(-1.6*dt,Math.min(1.6*dt,d*Math.min(1,dt*6)));}
      r+=(tr-r)*Math.min(1,dt*3);if(!free(a,r)&&f0){if(free(a0,r))a=a0;else if(r0<.95){a=a0;r=r0;}} /* blocked: the pram is not pushed into it, it stays where it is (out of a tight spot it is worked free) */
      st.position.set(g.position.x+Math.sin(a)*r,0,g.position.z+Math.cos(a)*r);st.position.y=floorY(st.position.x,st.position.z);st.rotation.y=moving_?a:ry;if(!moving_)ud.stPark=[st.position.x,st.position.z,st.rotation.y];} /* set down once where there is room, then parked */
    // §2 companions: child / partner follow the leader's trail 0.6–1.0 m behind
    // a child and the sweets: it sees them, stops and points, then turns to the parent and pleads, stamping, arms going. The parent stops,
    // turns round, talks; gives in (the child takes one, beaming) or says no, shaking the head, takes the child by the hand and walks on
    // with it, the child sulking. Each time different: whether it starts at all, how long, how hard, and what the parent decides
    function kidOf(g){const i=people.indexOf(g);return people.find(o=>o.visible&&o.userData.isChild&&o.userData.follow===i)||null;}
    function childWant(g,lead,dt,T_){const ud=g.userData,lu=lead.userData,W=ud.want,x=g.position.x,z=g.position.z;
      if(!W){if(lu.pay||lu.state==='queue'||lu.state==='away'||ud.wantDone||T_<(ud.wantNext||0)||!nav.browse||Math.hypot(lead.position.x-x,lead.position.z-z)>2.2)return false;ud.wantNext=T_+rnd(1.5,3);
        let b=null,bd=1.6;for(const q of nav.browse){if(!sweet(catOf(q)))continue;const d=Math.hypot(q.p[0]-x,q.p[1]-z);if(d<bd){bd=d;b=q;}}
        if(!b||Math.random()>(ud.temper==null?(ud.temper=rnd(.35,.85)):ud.temper))return false;
        const pt=lead.userData.tr||{};ud.wantDone=true;ud.want={ph:'see',t0:T_,b,give:Math.random()<.25+.35*(pt.soc==null?.5:pt.soc),hard:rnd(.5,1),dur:rnd(2.2,4.2)};return true;}
      const u=T_-W.t0,sh=[W.b.p[0]-W.b.f[0]*.55,W.b.p[1]-W.b.f[1]*.55],toLead=Math.atan2(lead.position.x-x,lead.position.z-z),toShelf=Math.atan2(sh[0]-x,sh[1]-z);
      const face=(a,r)=>{ud.ang=angStep(ud.ang||0,a,6,dt,r||3);g.rotation.y=ud.ang;},stand=()=>{g.position.y=floorY(x,z);ud.state='browse';ud.blend=Math.max(0,(ud.blend||0)-dt*4);poseAny(g,T_,dt,0);};
      ud.tantrum=false;ud.ikReq=null;
      if(W.ph==='see'){face(toShelf);ud.gazeP=sh;ud.lookAtP=null;ud.ikReq=[null,{p:[sh[0],.95,sh[1]],w:Math.min(1,u/.4)*.9}];if(u>1.1){W.ph='plead';W.t0=T_;}stand();return true;}
      if(W.ph==='plead'){face(toLead);ud.lookAtP=[lead.position.x,lead.position.z];ud.talking=true;ud.tantrum=true;ud.gazeP=null;stand();g.position.y+=Math.abs(Math.sin(u*(8+4*W.hard)))*.035*W.hard; /* stamping */
        if(u>W.dur){W.ph=W.give?'go':'no';W.t0=T_;}return true;}
      if(W.ph==='go'){const dx=W.b.p[0]-x,dz=W.b.p[1]-z,L=Math.hypot(dx,dz);ud.talking=false;ud.lookAtP=null;ud.gazeP=sh;
        if(L>.12&&u<4){const s=Math.min(L,1.1*dt),nx_=g.position.x+dx/L*s,nz_=g.position.z+dz/L*s,dl_=Math.hypot(lead.position.x-nx_,lead.position.z-nz_);if(!(dl_<.36&&dl_<Math.hypot(lead.position.x-x,lead.position.z-z))){g.position.x=nx_;g.position.z=nz_;} /* round the parent, not into her */face(Math.atan2(dx,dz),5);g.position.y=floorY(g.position.x,g.position.z);ud.state='walk';ud.blend=Math.min(1,(ud.blend||0)+dt*3);poseAny(g,T_,dt,1.1*ud.blend);return true;}
        face(toShelf);ud.ikReq=[null,{p:[sh[0],.85,sh[1]],w:.9}];if(!W.reachT)W.reachT=T_;if(T_-W.reachT>.9){ud.carry=true;ud.ikReq=null;W.ph='done';W.t0=T_;ud.happyT=T_+6;}stand();return true;}
      if(W.ph==='no'){face(toLead);ud.lookAtP=null;ud.gazeP=null;ud.talking=false;ud.tantrum=u<1.2;stand();if(u<1.2)g.position.y+=Math.abs(Math.sin(u*11))*.03*W.hard;if(u>2.4){W.ph='done';W.t0=T_;ud.handT=T_+rnd(4,7);}return true;}
      if(W.ph==='done'){ud.want=null;ud.talking=false;}return false;}
    function parentOfWant(g,ud,T_){const k=kidOf(g),W=k&&k.userData.want;if(!W||W.ph==='done')return false;const u=T_-W.t0,kp=[k.position.x,k.position.z];
      if(W.ph==='see'&&u<.6)return false; /* it takes a moment to notice */
      const kd=Math.hypot(kp[0]-g.position.x,kp[1]-g.position.z);ud.lookAtP=kp;ud.talking=kd<2.5&&(W.ph==='plead'?((u*1.3)|0)%3===2:W.ph==='no'||(W.ph==='go'&&u<1)); /* nobody talks to someone across the shop */
      if(W.ph==='no'&&u<1.6){const a=Math.atan2(kp[0]-g.position.x,kp[1]-g.position.z)+Math.sin(u*9)*.35;ud.lookAtP=[g.position.x+Math.sin(a)*1.5,g.position.z+Math.cos(a)*1.5];} // shakes the head
      ud.faceAng=Math.atan2(kp[0]-g.position.x,kp[1]-g.position.z);ud.ang=angStep(ud.ang||0,ud.faceAng,4,1/30,2.4);g.rotation.y=ud.ang;return true;}
    function followParent(g,dt,T_){const ud=g.userData,lead=people[ud.follow];if(!lead){g.visible=false;return;}const lu=lead.userData;
      if(lu.state==='away'||lu.state==null){if(g.visible&&ud.placed&&nav.exit&&Math.hypot(nav.exit[0]-g.position.x,nav.exit[1]-g.position.z)>.35&&(ud.outT=(ud.outT||0)+dt)<12){const x0=g.position.x,z0=g.position.z;if(!ud.outP){const r_=nav.route(nav.G35,[x0,z0],nav.exit);ud.path=r_&&r_.length>1?r_:[[x0,z0],nav.exit];ud.pi=0;ud.outP=true;}advance(g,Math.min(1.3,(lu.sp||1)*1.4)*dt,dt);const v_=Math.hypot(g.position.x-x0,g.position.z-z0)/Math.max(dt,1e-3);g.position.y=floorY(g.position.x,g.position.z);g.rotation.y=ud.ang||0;ud.state='walk';ud.blend=1;poseAny(g,T_,dt,v_);return;} /* the parent has gone out: it follows through the door, and is gone only there */g.visible=false;ud.placed=false;ud.want=null;ud.wantDone=false;ud.carry=false;ud.handT=0;ud.outT=0;ud.outP=false;return;}g.visible=true;
      ud.ikReq=null;ud.tantrum=false;if(ud.isChild&&childWant(g,lead,dt,T_))return;if(T_>(ud.happyT||0)&&ud.isChild&&!ud.want)ud.lookAtP=null;
      if(ud.isChild&&T_<(ud.handT||0)&&lu.state==='walk'){const a=lead.rotation.y,lx=Math.cos(a),lz=-Math.sin(a),hx=(g.position.x+lead.position.x)/2,hz=(g.position.z+lead.position.z)/2;ud.ikReq=[null,{p:[hx,.74,hz],w:.85}];lu.ikReq=[{p:[hx,.74,hz],w:.85},null];lu.holdKid=T_;} // by the hand, for a while
      else if(ud.isChild&&lu.holdKid&&!lu.pay){lu.ikReq=null;lu.holdKid=0;}if(ud.isChild&&T_<(ud.happyT||0))ud.lookAtP=[lead.position.x,lead.position.z]; /* beaming at the parent */
      if(lu.chat){const dx=lead.position.x-g.position.x,dz=lead.position.z-g.position.z;ud.ang=angStep(ud.ang||0,Math.atan2(dx,dz),4,dt,2.6);g.rotation.y=ud.ang;g.position.y=floorY(g.position.x,g.position.z);ud.state='chat';ud.lookAtP=[lead.position.x,lead.position.z];ud.talking=lu.chat.talker===1;ud.blend=Math.max(0,(ud.blend||0)-dt*3);if(ud.basket){ud.basket.visible=false;ud.bag.visible=false;}poseAny(g,T_,dt,0);return;}else{ud.lookAtP=null;ud.talking=false;}
      const tr=lu.trail||[[lead.position.x,lead.position.z]];let need=ud.gap||.9,tx=lead.position.x,tz=lead.position.z;
      for(let k=tr.length-1;k>=0;k--){const dx=tr[k][0]-tx,dz=tr[k][1]-tz,L=Math.hypot(dx,dz);if(L>=need){tx+=dx/L*need;tz+=dz/L*need;need=0;break;}tx=tr[k][0];tz=tr[k][1];need-=L;}
      if(!ud.isChild&&lu.state==='walk'&&ud.sideS!==0){if(ud.sideS==null)ud.sideS=Math.random()<.5?-1:1;const a=lead.rotation.y,sx=tx+Math.cos(a)*.5*ud.sideS,sz=tz-Math.sin(a)*.5*ud.sideS,[ci,cj]=nav.toCell(sx,sz);if(nav.free(nav.G35,ci,cj)&&fpClr(sx,sz)>=.32){tx=sx;tz=sz;}} // a partner walks beside, not behind, where the aisle is wide enough
      if(ud.isChild&&(lu.state==='queue'||lu.pay)&&ud.qSpot&&Math.hypot(lead.position.x-ud.qSpotL[0],lead.position.z-ud.qSpotL[1])<.25&&!people.some(o=>o!==g&&o!==lead&&o.visible&&Math.hypot(o.position.x-ud.qSpot[0],o.position.z-ud.qSpot[1])<.45)){tx=ud.qSpot[0];tz=ud.qSpot[1];}
      else if(ud.isChild&&(lu.state==='queue'||lu.pay)){let best=null;const ahead=(nav.queue||[]).filter((q,ix)=>q&&(lu.slot==null||ix<lu.slot)),dk=S.tl?[S.tl.E-.4,S.tl.H[2]-.41]:null; // by the parent in the line: of the eight spots round him, the one farthest from everyone else, from the places ahead and from the till
        for(let k_=0;k_<8;k_++){const a=k_*Math.PI/4,x_=lead.position.x+Math.sin(a)*.52,z_=lead.position.z+Math.cos(a)*.52,[ci,cj]=nav.toCell(x_,z_);if(!nav.free(nav.G0,ci,cj)||!circleFree(x_,z_,.2)||people.some(o=>o!==lead&&o!==g&&o.visible&&o.userData.pay&&Math.hypot(o.position.x-x_,o.position.z-z_)<.6))continue;let m_=9; /* never right up against the one paying */people.forEach(o=>{if(o===g||o===lead||!o.visible)return;m_=Math.min(m_,Math.hypot(o.position.x-x_,o.position.z-z_));});ahead.forEach(q=>{m_=Math.min(m_,Math.hypot(q[0]-x_,q[1]-z_)+.1);});if(dk&&!lu.pay)m_=Math.min(m_,Math.hypot(dk[0]-x_,dk[1]-z_));m_-=.05*Math.hypot(x_-g.position.x,z_-g.position.z);if(!best||m_>best[2])best=[x_,z_,m_];}if(best){tx=best[0];tz=best[1];ud.qSpot=[tx,tz];ud.qSpotL=[lead.position.x,lead.position.z];}}
      if(!ud.isChild&&(lu.state==='queue'||lu.pay)&&nav.exit){ // the one who came along does not queue: waits aside, near the way out, facing the door
        if(!ud.waitP){let best=null;for(let r=1.4;r<=3.8&&!best;r+=.3)for(let a=0;a<6.28;a+=.3){const x=lead.position.x+Math.sin(a)*r,z=lead.position.z+Math.cos(a)*r,[ci,cj]=nav.toCell(x,z);if(!nav.free(nav.G35,ci,cj)||inZone(x,z)||inFP(x,z,.4))continue;
            if((nav.queue||[]).some(q=>q&&Math.hypot(q[0]-x,q[1]-z)<.85)||Math.hypot(nav.entry[0]-x,nav.entry[1]-z)<1||Math.hypot(nav.exit[0]-x,nav.exit[1]-z)<.9||people.some(o=>o!==g&&o!==lead&&o.visible&&Math.hypot(o.position.x-x,o.position.z-z)<.7))continue;
            const sc=Math.hypot(nav.exit[0]-x,nav.exit[1]-z);if(!best||sc<best[2])best=[x,z,sc];}
          if(!best&&nav.exit){const ex=nav.exit;for(let r=.9;r<=2.4&&!best;r+=.3)for(let a=0;a<6.28;a+=.4){const x=ex[0]+Math.sin(a)*r,z=ex[1]+Math.cos(a)*r,[ci,cj]=nav.toCell(x,z);if(nav.free(nav.G35,ci,cj)&&!people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-x,o.position.z-z)<.7)&&!(nav.queue||[]).some(q=>q&&Math.hypot(q[0]-x,q[1]-z)<.85))best=[x,z,0];}} // no room near the till: waits by the door
          ud.waitP=best;}
        if(ud.waitP){tx=ud.waitP[0];tz=ud.waitP[1];ud.waitT=T_;}}
      else ud.waitP=null;
      // walking: the same way-finding and the same manners as everyone else (routes round fixtures, personal space, giving way, never
      // through anyone), towards a goal that moves with the leader: beside him where there is room, a step behind where not, aside while
      // he queues or pays, by the hand after a "no"
      const strg=o=>o!==g&&o!==lead&&o.visible&&!(o.userData.follow===ud.follow&&o.userData.follow!=null),onFloor=(x_,z_)=>{const [ci,cj]=nav.toCell(x_,z_);return nav.free(nav.G0,ci,cj);};
      if(ud.isChild&&T_<(ud.handT||0)&&lu.state==='walk'){const a=lead.rotation.y,hx=lead.position.x+Math.cos(a)*.42,hz=lead.position.z-Math.sin(a)*.42;if(onFloor(hx,hz)){tx=hx;tz=hz;}}
      if(!ud.placed){ud.placed=true;const la=lead.rotation.y,cand=[[Math.PI,.6],[Math.PI*.75,.6],[-Math.PI*.75,.6],[Math.PI/2,.55],[-Math.PI/2,.55]];for(let k=0;k<12;k++){cand.push([k*Math.PI/6,.45]);cand.push([k*Math.PI/6,.8]);}let px_=lead.position.x-Math.sin(la)*.4,pz_=lead.position.z-Math.cos(la)*.4;
        for(const [ax,d_] of cand){const qx=lead.position.x+Math.sin(la+ax)*d_,qz=lead.position.z+Math.cos(la+ax)*d_,c_=nav.toCell(qx,qz);if(nav.free(nav.G0,c_[0],c_[1])&&circleFree(qx,qz,.18)&&!people.some(o=>o!==g&&o!==lead&&o.visible&&Math.hypot(o.position.x-qx,o.position.z-qz)<.45)){px_=qx;pz_=qz;break;}}g.position.set(px_,0,pz_);ud.path=null;} /* comes in beside or a step behind the parent, never in the very same spot */
      let dx=tx-g.position.x,dz=tz-g.position.z,L=Math.hypot(dx,dz),v=0;
      const taken=(ud.detour&&lu.state!=='walk'&&L<3.5&&(T_-(ud.detourT||0)<1.5||(ud.path=null,ud.detour=false,false)))||lu.state!=='walk'&&L<1.6&&people.some(o=>strg(o)&&Math.hypot(o.position.x-tx,o.position.z-tz)<.55),arrived=L<((ud.blend||0)>.5?.15:.3);
      if(!arrived&&!taken){const P=ud.path,goal=P&&P.length&&P[P.length-1];
        if(!goal||Math.hypot(goal[0]-tx,goal[1]-tz)>.45){let Gf=L<8?(ud.stroller?nav.G55:nav.G35):gridDyn(g);if(lu.state!=='walk'){Gf=Gf.slice();const [li,lj]=nav.toCell(lead.position.x,lead.position.z),[si,sj]=nav.toCell(g.position.x,g.position.z),[ti,tj]=nav.toCell(tx,tz);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=li+di,jj=lj+dj;if(ii<0||jj<0||ii>=nav.cols||jj>=nav.rows||(ii===si&&jj===sj)||(ii===ti&&jj===tj))continue;Gf[jj*nav.cols+ii]=1;}} /* the parent standing is something to go round, like anyone else */const r=nav.route(Gf,[g.position.x,g.position.z],[tx,tz]);ud.path=r&&r.length>1?r:[[g.position.x,g.position.z],[tx,tz]];ud.pi=0;let rl=0;for(let k=1;k<ud.path.length;k++)rl+=Math.hypot(ud.path[k][0]-ud.path[k-1][0],ud.path[k][1]-ud.path[k-1][1]);ud.detour=lu.state!=='walk'&&L<3.5&&rl>2*L+1.5;if(ud.detour)ud.detourT=T_;}
        const sp_=Math.min(lu.sp*(ud.waitP?1:L>3?(ud.isChild?1.8:1.6):L>1.4?1.35:1.15),ud.isChild?1.35:1.3,L*2.5), /* catching up is a brisk walk, never a run */x0=g.position.x,z0=g.position.z;if(advance(g,sp_*dt,dt))ud.path=null;
        {const lx=lead.position.x,lz=lead.position.z,d1=Math.hypot(g.position.x-lx,g.position.z-lz);if(d1<.36){const d0=Math.hypot(x0-lx,z0-lz),ux=d1>1e-3?(g.position.x-lx)/d1:(d0>1e-3?(x0-lx)/d0:1),uz=d1>1e-3?(g.position.z-lz)/d1:(d0>1e-3?(z0-lz)/d0:0),px=lx+ux*.36,pz=lz+uz*.36,[ci,cj]=nav.toCell(px,pz);if(nav.free(nav.G0,ci,cj)&&circleFree(px,pz,.15)){const cx_=px-g.position.x,cz_=pz-g.position.z,cL=Math.hypot(cx_,cz_),cm=Math.min(cL,.4*dt);if(cL>1e-4){g.position.x+=cx_/cL*cm;g.position.z+=cz_/cL*cm;}}else if(d1<d0){g.position.x=x0;g.position.z=z0;}}} /* eased out to arm's length, never snapped */ /* contact with the parent: it slides round her at arm's length (a contact constraint), never into her */
        v=Math.hypot(g.position.x-x0,g.position.z-z0)/Math.max(dt,1e-3);}
      else{ud.vx=ud.vz=0;ud.vNow=0;for(const o of people){if(!strg(o)&&o!==lead)continue;let ox=g.position.x-o.position.x,oz=g.position.z-o.position.z,d=Math.hypot(ox,oz);const dm=o===lead?.38:.5;if(d<=1e-3){const a_=o.rotation.y+Math.PI;ox=Math.sin(a_)*1e-3;oz=Math.cos(a_)*1e-3;d=1e-3;}if(d<dm){const pu=Math.min(dm-d,.3*dt),nx=g.position.x+ox/d*pu,nz=g.position.z+oz/d*pu;if(onFloor(nx,nz)){g.position.x=nx;g.position.z=nz;}}}} // standing: a stranger too close, a small step away
      if(L>6&&lead.userData.culled&&ud.culled){let need2=.9,px_=lead.position.x,pz_=lead.position.z;for(let k=tr.length-1;k>=0;k--){const ddx=tr[k][0]-px_,ddz=tr[k][1]-pz_,LL=Math.hypot(ddx,ddz);if(LL>=need2){px_+=ddx/LL*need2;pz_+=ddz/LL*need2;break;}px_=tr[k][0];pz_=tr[k][1];need2-=LL;}g.position.set(px_,0,pz_);} // far behind where nobody sees: caught up off screen (on screen it hurries)
      if((arrived||taken)&&ud.waitP){ud.ang=angStep(ud.ang||0,Math.atan2(nav.exit[0]-g.position.x,nav.exit[1]-g.position.z),4,dt,2);}
      g.position.y=floorY(g.position.x,g.position.z);g.rotation.y=ud.ang||0;ud.mvF=v>.06?Math.min(6,Math.max(0,ud.mvF||0)+1):Math.max(-9,Math.min(0,ud.mvF||0)-1);const wk_=ud.state==='walk'?ud.mvF>-9:ud.mvF>=3;ud.state=wk_?'walk':lu.state==='walk'?'queue':lu.state; /* a shuffle of a few centimetres is not setting off: walking starts after a few steps' worth and ends after a moment's standing (no flicker) */ud.blend=v>0?Math.min(1,(ud.blend||0)+dt*3):Math.max(0,(ud.blend||0)-dt*3);
      if(ud.basket){ud.basket.visible=false;ud.bag.visible=false;}poseAny(g,T_,dt,Math.max(v*ud.blend,ud.vR>.15?ud.vR:0));}
    // §6 checkout at the head of the queue: greeting → scan n items → cash | card → bagging → goodbye; the next customer advances only afterwards
    // §6 the till, step by step — every object is always somewhere: in the basket, on the counter, in a hand, in the bag.
    // Each action is reach → carry → (hold) → let go. What is carried rides in the palm of the hand that carries it (the arm drives the
    // object, never the other way round), so nothing floats, jumps or vanishes; when it is let go it settles into its exact place.
    // The customer lifts the basket onto the counter and takes the items out one by one (left hand); the cashier, in parallel, takes each one,
    // passes it over the scanner (beep) and puts it into a carrier bag she has opened on the counter; card at the terminal or a banknote
    // handed over; she lifts the bag across, the customer takes it; the empty basket goes back into the left hand for the stack by the door.
    const tE=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
    // ---- the till as events, not a clock --------------------------------------------------------------------------------------------
    // Every action goes: 0 waiting for what it depends on → 1 reach → 2 carry → 3 hold → 4 let go → 5 done.
    // reach → carry only when the palm really is at the object (< 8 cm); carry → let go only when it really is at the destination.
    // What the next action needs is a state of the previous one (the cashier reaches for an item once the customer has let go of it,
    // a banknote or the bag is let go once the other hand holds it) — no timers between actions, so nothing runs ahead of a hand.
    // Fallback: 3 s without contact → lean in further / step 5 cm closer; 4.5 s → grasp anyway (the offset still melts away, no jump).
    const TST=window.__tillStats={grasp:0,place:0,boost:0};
    function tillPlan(g,T_){const P=PARAMS,ts=P.payScale,ud=g.userData,n=Math.max(1,Math.min(ud.items||1,8)),cash=Math.random()<P.cashP,eld=ud.elder?P.elderPayMul:1,sp=ud.elder?1.25:1,hb=!!ud.hasBasket&&!!S.counterBasket,T=S.tl,B=S.counterBasket,BG=S.counterBag,N=S.tillNote,IT=S.counterItems||[];
      const E=[],mk=o=>{const ev=Object.assign({s:0,a:0,wt:0,hold:0,dep:[],delay:0,off:[0,-.04,0]},o);E.push(ev);return ev;};
      const H=()=>[T.H[0],T.H[1]-.26,T.H[2]],HN=()=>[T.H[0],T.H[1]-.25,T.H[2]],mouth=()=>[T.bag[0],T.bag[1]+.165+.07,T.bag[2]];
      const dock={k:'dock',s:0,a:0}; // the last step up to the counter: every customer action waits for it
      let first=dock,bu=null;
      if(hb){bu=mk({k:'basketUp',who:'c',side:1,re:0,ca:.8*sp,rt:.35,o:B,off:[0,-.2,0],G:.2,dep:[[dock,5]],delay:.15,touchEnd:1,end:()=>T.basket});first=bu;}
      const U=[],SC=[];
      for(let j=0;j<n;j++){const m=IT[j];U.push(mk({k:'unload',j,who:'c',side:0,re:.34*sp,ca:.46*sp,rt:.25*sp,o:m,dep:[j?[U[j-1],4]:[first,5]],delay:j?.05:.1,touch:hb?1:0,start:()=>{const p=B.position,b=m.userData.bo;return [p.x+b[0],p.y-.1+m.userData.hy,p.z+b[1]];},touchEnd:1,end:()=>m.userData.a}));}
      const bo=mk({k:'bagOut',who:'s',side:1,re:.3,ca:.55,rt:.2,o:BG,off:[0,-.2,0],G:.2,delay:.25,start:()=>T.bagStore,touchEnd:1,end:()=>T.bag});
      for(let j=0;j<n;j++){const m=IT[j];SC.push(mk({k:'scan',j,who:'s',side:1,re:.3,ca:.7,rt:.24,o:m,dep:[[U[j],4],j?[SC[j-1],4]:[bo,5]],delay:.08,touch:1,start:()=>m.userData.a,touchEnd:1,end:mouth}));}
      const bk=hb?mk({k:'basketBack',who:'c',side:0,re:.34,ca:.75,rt:.35,o:B,off:[0,-.2,0],G:.2,dep:[[U[n-1],5]],delay:.2,touch:1,start:()=>T.basket}):null;
      const payDep=[[SC[n-1],5],[bk||U[n-1],5]],payD=Math.max(cash?1.8:1.6,(cash?rr(P.cash):rr(P.card))*eld*ts);let pay;
      if(cash){const ng=mk({k:'noteGive',who:'c',side:1,re:.55+payD*.25,ca:.6,rt:.3,hold:.2,o:N,off:[0,-.01,0],G:.02,dep:payDep,delay:.15}),nt=mk({k:'noteTake',who:'s',side:1,re:.25,ca:.55,rt:.25,o:N,off:[0,-.01,0],G:.02,dep:[[ng,3]],delay:.05,touch:1,start:HN,touchEnd:1,end:()=>T.drawer});ng.holdFor=nt;pay=nt;}
      else pay=mk({k:'card',who:'c',side:1,re:.5,ca:0,rt:.45,hold:Math.max(.5,payD-1.1),off:[0,-.01,0],G:.05,dep:payDep,delay:.2,touch:1,start:()=>[S.termP[0],S.termP[1]+.02,S.termP[2]]});
      const bl=mk({k:'bagLift',who:'s',side:1,re:.45,ca:.8,rt:.45,hold:.2,o:BG,off:[0,-.26,0],G:.26,dep:[[pay,5]],delay:.25,touch:1,start:()=>T.bag,touchEnd:1,end:H}),
        bt=mk({k:'bagTake',who:'c',side:1,re:.55,ca:1.05,rt:.9,o:BG,off:[0,-.24,0],G:.26,dep:[[bl,3]],delay:.05,touch:1,start:H});bl.holdFor=bt;
      ud.bagTaken=false;ud.basketOnCounter=false;ud.basketL=false;ud.leanBoost=0;
      return {t0:T_,n,cash,hb,E,dock,U,SC,pay,bt,coffee:S.coffee&&!S.coffee.owner&&!ud.isChild&&Math.random()<(ud.elder?.15:.32)?{t:0}:null,cig:S.cig&&!S.cig.owner&&!ud.isChild&&!ud.follow&&Math.random()<(ud.elder?.08:.2)?{t:0}:null,bye:rr(P.goodbye)*ts,byeA:0,from:[g.position.x,g.position.z],to:[T.E-.3,T.H[2]-.41],steps:0};} /* at the counter as people stand: a hand's breadth off it, not a long arm away */
    // the gap between where the palm is and where it must be to hold `pt` (the object's point minus the way it hangs from the palm)
    function evGap(ev,pt,who){if(!who||!pt)return 0;const G=ev.G!=null?ev.G:.07;let w=null;if(who.userData.gltfP){const a=armBones(who)[ev.side];if(a&&a[2]){a[2].getWorldPosition(_pa);w=[_pa.x,_pa.y,_pa.z];}}if(!w)return 0;return Math.hypot(w[0]-pt[0],w[1]-(pt[1]+G),w[2]-pt[2]);} /* wrist vs where the IK puts it */
    function evStep(ev,dt,g,cs,pl){if(ev.s===5)return;const who=ev.who==='c'?g:cs,tag=ev.k+(ev.j!=null?ev.j:'');
      if(ev.s===0){if(ev.dep.every(([d,l])=>d.s>=l)){ev.a+=dt;if(ev.a>=ev.delay){ev.s=1;ev.a=0;ev.wt=0;}}else ev.a=0;return;}
      ev.a+=dt;
      if(ev.s===1&&ev.a>=ev.re){const gap=ev.touch&&ev.start?evGap(ev,ev.start(),who):0;
        if(gap>.08&&ev.wt<4.5){ev.wt+=dt;if(ev.wt>.6&&!ev.boost){ev.boost=1;TST.boost++;if(who)who.userData.leanBoost=.2;if(ev.who==='c')pl.stepIn=1;console.debug('[till] '+tag+': no contact after 3 s (gap '+gap.toFixed(2)+' m) → leaning in / stepping closer');}return;}
        if(gap>.08){TST.grasp++;console.debug('[till] '+tag+': grasp forced after 4.5 s (gap '+gap.toFixed(2)+' m)');}
        if(who)who.userData.leanBoost=0;
        const p=ev.o&&palmOf(who,ev.side),op=ev.o?((ev.o.visible||!ev.start)?ev.o.position.toArray():ev.start()):null;ev.grip=p&&op?[op[0]-(p[0]+ev.off[0]),op[1]-(p[1]+ev.off[1]),op[2]-(p[2]+ev.off[2])]:[0,0,0]; // the offset at the moment of contact (a hidden object: from where it really starts)
        ev.s=2;ev.a=0;ev.wt=0;}
      if(ev.s===2&&ev.a>=ev.ca){const gap=ev.touchEnd&&ev.end?evGap(ev,ev.end(),who):0;
        if(gap>.08&&ev.wt<1.5){ev.wt+=dt;if(who&&ev.wt>.15)who.userData.leanBoost=.16;if(ev.who==='c'&&ev.wt>.5&&!ev.stepped){ev.stepped=1;pl.stepIn=1;}return;} // not there yet: lean in further, then a small step closer
        if(who)who.userData.leanBoost=0;
        if(gap>.08){TST.place++;console.debug('[till] '+tag+': put down without reaching the spot (gap '+gap.toFixed(2)+' m)');}
        ev.rel=ev.o?ev.o.position.toArray():null;ev.s=(ev.hold||ev.holdFor)?3:4;ev.a=0;ev.wt=0;}
      if(ev.s===3){const hf=ev.holdFor;if(ev.a>=ev.hold&&(!hf||hf.s>=2||ev.a>ev.hold+4)){ev.s=4;ev.a=0;}}
      if(ev.s===4&&ev.a>=ev.rt)ev.s=5;}
    // stage + progress of an action (the drawing code below reads this)
    function evSt(ev){const d=ev.s===1?ev.re:ev.s===2?ev.ca:ev.s===3?ev.hold:ev.s===4?ev.rt:1;return [ev.s,ev.s===5?1:ev.s===0?0:Math.min(1,d>0?ev.a/d:1)];}
    const vl=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
    function arcP(a,b,u,lift){const s_=tE(u),p=vl(a,b,s_);p[1]+=lift*4*s_*(1-s_);return p;}
    function scanPath(a,u){const T=S.tl,sc=T.scan,mo=[T.bag[0],T.bag[1]+.165+.07,T.bag[2]];
      if(u<.38)return arcP(a,sc,u/.38,.05);if(u<.56)return [sc[0]+Math.sin((u-.38)/.18*Math.PI)*.015,sc[1],sc[2]];return arcP(sc,mo,(u-.56)/.44,.06);}
    // a circle (the body, r) against every registered fixture rectangle
    const circleFree=(x,z,r)=>OBS.every(q=>{const cx=Math.max(q[0],Math.min(x,q[1])),cz=Math.max(q[2],Math.min(z,q[3]));return Math.hypot(x-cx,z-cz)>=r;});
    // a coffee ordered at the till: the cashier turns and steps over to the machine, a cup from the stack under the spouts, a press on the
    // panel; while it runs (a few seconds, the coffee running into the cup, a little steam) a word with the customer; the lid on, back, and
    // the cup set down on the counter in front of the customer, who picks it up on the way out. The purchase then goes through as usual
    // cigarettes asked for at the till: the cashier turns round to the gantry behind her, takes the pack off the shelf, turns back and lays
    // it on the counter in front of the customer, who pockets it on the way out
    function cigStep(g,cs,pl,dt){const c=pl.cig,CG=S.cig;if(!c||c.done||!CG||!cs||pl.dock.s<5)return false;if(c.t===0)CG.owner=g;c.t+=dt;const t=c.t,cu=cs.userData,ud=g.userData,u_=(a,b)=>clamp((t-a)/(b-a),0,1);
      const ry=t<.7?Math.PI*(1-tE(u_(0,.7))):t<2.1?0:Math.PI*tE(u_(2.1,2.8));cs.rotation.y=ry;cu.ang=ry;cu.walkV=0;
      const R=[null,null],cp=t>=1.15&&t<3.5?'hand':t>=3.5?'give':null;
      if(t>=.7&&t<1.6)R[1]={p:[CG.shelf[0],CG.shelf[1]+.06,CG.shelf[2]],w:tE(u_(.7,1.05))};
      if(t>=2.8&&t<4)R[1]={p:[CG.give[0],CG.give[1]+.1,CG.give[2]],w:t<3.5?tE(u_(2.8,3.1)):1-tE(u_(3.5,4))};
      cu.ikReq=R;CG.held=cp==='hand'?cs:null;const pk=CG.pack;if(cp==='hand'){pk.visible=true;pk.rotation.set(0,0,0);}else if(cp==='give'){pk.visible=true;pk.position.set(...CG.give);pk.rotation.set(-Math.PI/2,0,0);}else pk.visible=false;
      cu.state='greet';cu.lookAtP=t>=.6&&t<2.2?[CG.shelf[0],CG.shelf[2]]:[g.position.x,g.position.z];cu.talking=t<.6||(t>=3.4&&t<4);cu.smile=true;
      ud.lookAtP=[cs.position.x,cs.position.z];ud.talking=t<.5;ud.ikReq=[null,null];ud.phase='greet';
      if(t>=4){c.done=true;CG.held=null;cs.rotation.y=Math.PI;cu.ang=Math.PI;cu.ikReq=null;}
      return true;}
    function coffeeStep(g,cs,pl,dt){const c=pl.coffee,CF=S.coffee;if(!c||c.done||!CF||!cs||pl.dock.s<5)return false;
      if(c.t===0)CF.owner=g;c.t+=dt;const t=c.t,cu=cs.userData,ud=g.userData,X0=S.cashier[0],Z0=S.cashier[1],X1=CF.sx,u_=(a,b)=>clamp((t-a)/(b-a),0,1),D2=X1<X0?1.5*Math.PI:.5*Math.PI,D3=X1<X0?.5*Math.PI:1.5*Math.PI,wk=Math.abs(X1-X0)/1.5;
      let x=X0,ry=Math.PI,v=0;
      if(t<.5)ry=Math.PI+(D2-Math.PI)*tE(u_(0,.5));else if(t<2)(x=X0+(X1-X0)*u_(.5,2),ry=D2,v=wk);else if(t<2.3)(x=X1,ry=D2+(Math.PI-D2)*tE(u_(2,2.3)));
      else if(t<9)x=X1;else if(t<9.3)(x=X1,ry=Math.PI+(D3-Math.PI)*tE(u_(9,9.3)));else if(t<10.8)(x=X1+(X0-X1)*u_(9.3,10.8),ry=D3,v=wk);else if(t<11.1)ry=D3+(Math.PI-D3)*tE(u_(10.8,11.1));
      cu.walkV=Math.abs(x-cs.position.x)/Math.max(dt,1e-3)>.05?Math.max(v,.3):0;cs.position.x=x;cs.rotation.y=ry;cu.ang=ry; /* the legs go exactly while she really moves */
      const R=[null,null],carry=[x,1.12,Z0-.24],cup=CF.cup;let cp=null;
      if(t>=2.3&&t<2.8)R[1]={p:[CF.cups[0],CF.cups[1]+.07,CF.cups[2]],w:tE(u_(2.3,2.6))};
      if(t>=2.65&&t<3.3)cp='hand';
      if(t>=2.8&&t<3.4)R[1]={p:[CF.under[0],CF.under[1]+.12,CF.under[2]],w:1-tE(u_(3.25,3.4))};
      if(t>=3.3&&t<3.75)R[0]={p:CF.btn,w:Math.sin(Math.PI*u_(3.3,3.75))};
      if(t>=3.3&&t<8.45)cp='under';
      if(t>=8.2&&t<9.1)R[1]={p:[CF.under[0],CF.under[1]+.12,CF.under[2]],w:Math.min(1,u_(8.2,8.45)*4)};
      if(t>=8.5&&t<9.1)R[0]={p:t<8.8?CF.lids:[CF.under[0],CF.under[1]+.15,CF.under[2]],w:Math.sin(Math.PI*u_(8.5,9.1))};
      if(t>=8.45&&t<11.9)cp='hand';
      if(t>=9.1&&t<11.1)R[1]={p:carry.map((q,k)=>k===0?x:q),w:1};
      if(t>=11.1&&t<12.4)R[1]={p:[CF.give[0],CF.give[1]+.12,CF.give[2]],w:t<11.9?1:1-tE(u_(11.9,12.4))};
      if(t>=11.9)cp='give';
      CF.lid.visible=t>=8.9;cu.ikReq=R;
      CF.held=cp==='hand'?cs:null;if(cp==='hand'){const pp=palmOf(cs,1);cup.visible=true;if(pp)cup.position.set(pp[0],pp[1]-.07,pp[2]);}else if(cp==='under'){cup.visible=true;cup.position.set(...CF.under);}else if(cp==='give'){cup.visible=true;cup.position.set(...CF.give);}else cup.visible=false;
      const br=t>=4&&t<7.6;CF.stream.visible=br;if(br){CF.stream.position.set(...CF.spout);CF.stream.scale.set(1,Math.max(.01,CF.spout[1]-CF.under[1]-.06),1);}
      CF.steam.visible=t>=4&&t<8.8;if(CF.steam.visible){CF.steam.position.set(CF.under[0],CF.under[1]+.2+.05*Math.sin(t*2),CF.under[2]);CF.steam.material.opacity=.25*Math.sin(Math.PI*u_(4,8.8));}
      // talk: she says yes at once; while it runs a word or two each way; both look at each other, except while she works the machine
      cu.state='greet';cu.lookAtP=(t>=2.3&&t<4)||(t>=8.2&&t<9.2)?[CF.under[0],CF.under[2]]:[g.position.x,g.position.z];cu.talking=t<.8||(t>=5.6&&t<7)||(t>=11.4&&t<12.2);cu.smile=true;
      ud.lookAtP=[cs.position.x,cs.position.z];ud.talking=(t>=4.4&&t<5.4);ud.smile=true;ud.ikReq=[null,null];ud.phase='greet';
      if(t>=12.4){c.done=true;CF.held=null;cs.position.x=X0;cs.rotation.y=Math.PI;cu.ang=Math.PI;cu.walkV=0;cu.ikReq=null;CF.stream.visible=CF.steam.visible=false;}
      return true;}
    function checkout(g,T_,dt){const ud=g.userData,cs=extras.find(x=>x.userData.cashier),T=S.tl;dt=Math.min(dt||1/30,.1);
      if(!ud.pay){if(people.some(o=>o!==g&&o.visible&&o.userData.state==='walk'&&o.userData.follow==null&&Math.hypot(o.position.x-(T.E-.4),o.position.z-g.position.z)<.7)&&(ud.coW=(ud.coW||0)+dt)<1.5)return; /* the last customer is still stepping away (at most 3 s) */ud.pay=tillPlan(g,T_);}
      const pl=ud.pay;
      // FinalApproach: the grid stops a body ~0.54 m from the counter; the last step is taken off the grid, in small slow steps,
      // straight to 0.40 m from it (each step checked against the fixtures), then the customer is docked (the crowd does not push)
      {const dk=pl.dock;if((pl.dh||0)>0){pl.dh-=dt;ud.dockV=0;}else if(pl.stepIn){pl.stepIn=0;if(pl.steps<3){pl.steps++;dk.s=1;}}
        if(dk.s<5&&!(pl.dh>0)){dk.s=1;const sdx=T.H[0]-pl.to[0],sdz=T.H[2]-pl.to[1],sL=Math.hypot(sdx,sdz)||1,tx=pl.to[0]+sdx/sL*.08*pl.steps,tz=pl.to[1]+sdz/sL*.08*pl.steps,dx=tx-g.position.x,dz=tz-g.position.z,L=Math.hypot(dx,dz);
          if(L<=.02){dk.s=5;ud.dockV=0;}
          else{const st=Math.min(L,.3*dt),nx=g.position.x+dx/L*st,nz=g.position.z+dz/L*st;
            if(people.some(o=>o!==g&&o.visible&&o.userData.follow==null&&Math.hypot(o.position.x-nx,o.position.z-nz)<.55&&Math.hypot(o.position.x-nx,o.position.z-nz)<Math.hypot(o.position.x-g.position.x,o.position.z-g.position.z))){ud.dockV=0;pl.dh=.5;pl.dw=(pl.dw||0)+.5;if(pl.dw>2.5){dk.s=5;console.debug('[till] someone stays in the way, serving from here');}}
            else if(circleFree(nx,nz,.17)){g.position.set(nx,floorY(nx,nz),nz);ud.dockV=.3;}else{dk.s=5;ud.dockV=0;console.debug('[till] final step blocked, staying '+L.toFixed(2)+' m short by '+JSON.stringify(OBS.filter(q=>{const cx=Math.max(q[0],Math.min(nx,q[1])),cz=Math.max(q[2],Math.min(nz,q[3]));return Math.hypot(nx-cx,nz-cz)<.22;}).map(q=>q.slice(0,4).map(v=>+v.toFixed(2))))+' at '+nx.toFixed(2)+','+nz.toFixed(2)+' E '+T.E.toFixed(2)+' H '+T.H[2].toFixed(2));}}}}
      if(cigStep(g,cs,pl,dt))return;if(coffeeStep(g,cs,pl,dt))return;
      pl.E.forEach(ev=>evStep(ev,dt,g,cs,pl));
      const allDone=pl.bt.s===5;if(allDone)pl.byeA+=dt;
      const phase=pl.dock.s<5||(pl.U[0].s<2)?'greet':pl.SC.some(x=>x.s<5)?'scan':pl.pay.s<5?'pay':!allDone?'bag':'bye';
      ud.phase=phase==='pay'?(pl.cash?'cash':'tap'):phase;
      if(cs){cs.userData.state=phase==='scan'?'scan':(phase==='greet'||phase==='bye')?'greet':'queue';cs.userData.lookAtP=(phase==='tap'&&S.screen&&pl.pay.s===3)?[S.screen.getWorldPosition(_hv).x,_hv.z]:(phase==='greet'||phase==='bye'||phase==='tap'||phase==='cash'||phase==='bag')?[g.position.x,g.position.z]:null;cs.userData.talking=phase==='greet'||phase==='bye';cs.userData.smile=phase!=='scan';}
      ud.lookAtP=(phase==='greet'||phase==='bye'||phase==='bag')?[cs?cs.position.x:g.position.x,cs?cs.position.z:g.position.z]:null;ud.talking=phase==='bye';ud.smile=phase!=='scan';
      const RQ={c:[null,null],s:[null,null]},D=[],who=k=>k==='c'?g:cs;
      const req=(ev,p,w)=>{if(w>.001)RQ[ev.who][ev.side]={p,w};};
      // the hand's target is the wrist: a little above what it holds
      const reqStage=(ev,st,u,start,end,path,grip)=>{const G=grip||.07;
        if(st===1)req(ev,[start[0],start[1]+G,start[2]],tE(u));
        else if(st===2){const p=path(u);req(ev,[p[0],p[1]+G,p[2]],ev.fade?1-tE(u):1);}
        else if(st===3)req(ev,[end[0],end[1]+G,end[2]],1);
        else if(st===4){const r=restP(who(ev.who),ev.side),k=tE(u/.6);req(ev,[end[0]+(r[0]-end[0])*k,end[1]+G+(r[1]-end[1]-G)*k,end[2]+(r[2]-end[2])*k],1-tE((u-.4)/.6));}};
      // letting go: the hand first comes down to its own side, in front of the hip, and only then the arm hands back to the body's own motion
      const ev=k=>pl.E.filter(x=>x.k===k);
      function hangP(p,side){const ry=p.rotation.y,fx=Math.sin(ry),fz=Math.cos(ry),o=side?1:-1,k=p.userData.k||1;return [p.position.x+fx*.03-fz*o*.24,.8*k,p.position.z+fz*.03+fx*o*.24];} // where a hand carrying a bag hangs by the side
      function restP(p,side){if(!p)return [0,1,0];const ry=p.rotation.y,fx=Math.sin(ry),fz=Math.cos(ry),o=side?1:-1,k=p.userData.k||1;return [p.position.x+fx*.22-fz*o*.17,.95*k,p.position.z+fz*.22+fx*o*.17];}
      // held: rides in the palm, the offset from the moment of contact melting away (~0.2 s); let go: settles into its spot in 0.15 s
      const held=(e_,o,who_,extra)=>Object.assign({o,m:'hand',who:who_,side:e_.side,off:e_.off,ev:e_},extra||{});
      const at=(e_,o,p)=>({o,m:'at',p,ev:e_});
      let beep=false;const B=S.counterBasket;
      // basket: up onto the counter (right hand), back into the left hand when empty
      if(pl.hb&&B){const up=ev('basketUp')[0],bk=ev('basketBack')[0],[su,uu]=evSt(up),[sb,ub]=bk?evSt(bk):[0,0];
        if(su<1){D.push({o:B,m:'hide'});}
        if(su>=1&&!ud.basketOnCounter){ud.basketOnCounter=true;ud.basket.getWorldPosition(_hv);up.from=[_hv.x,_hv.y,_hv.z];B.position.copy(_hv);up.grip=[0,0,0];}
        if(su===2){reqStage(up,2,uu,null,null,u=>arcP(up.from,T.basket,u,.15),.2);D.push(held(up,B,g));}
        else if(su===4){reqStage(up,4,uu,null,T.basket,null,.2);D.push(at(up,B,T.basket));}
        else if(su>=3&&sb<2)D.push(at(up,B,T.basket));
        if(sb===1){reqStage(bk,1,ub,T.basket,null,null,.2);D.push(at(null,B,T.basket));}
        else if(sb===2){reqStage(bk,2,ub,null,null,u=>arcP(T.basket,hangP(g,0),u,.06),.2);D.push(held(bk,B,g));}
        else if(sb===4){ud.basketL=true;req(bk,[...hangP(g,0)].map((v,i)=>i===1?v+.2:v),1-tE(ub));D.push({o:B,m:'hide'});}
        else if(sb===5){ud.basketL=true;D.push({o:B,m:'hide'});}}
      // the carrier bag: out from under the counter, the items go in, lifted across, taken by the customer
      if(S.counterBag){const bo=ev('bagOut')[0],bl=ev('bagLift')[0],bt=ev('bagTake')[0],[so,uo]=evSt(bo),[sl,ul]=evSt(bl),[st_,ut]=evSt(bt),BG=S.counterBag,Hb=[T.H[0],T.H[1]-.26,T.H[2]];
        BG.rotation.y=0;
        if(st_===5||ud.bagTaken){if(!ud.bagTaken)ud.bagTaken=true;D.push({o:BG,m:'hide'});}
        else if(st_===2){reqStage(bt,2,ut,null,null,u=>arcP(Hb,hangP(g,1),u,.04),.26);D.push(held(bt,BG,g,{ry:g.rotation.y}));if(ut>.97)ud.bagTaken=true;}
        else if(st_===4){ud.bagTaken=true;req(bt,[...hangP(g,1)].map((v,i)=>i===1?v+.26:v),1-tE(ut));D.push({o:BG,m:'hide'});}
        else{if(st_===1)reqStage(bt,1,ut,Hb,null,null,.26);
          if(sl===2){reqStage(bl,2,ul,null,null,u=>arcP(T.bag,Hb,u,.05),.26);D.push(held(bl,BG,cs));}
          else if(sl>=3){reqStage(bl,sl,ul,null,Hb,null,.26);D.push(at(bl,BG,Hb));}
          else{if(sl===1)reqStage(bl,1,ul,T.bag,null,null,.26);
            if(so===2){reqStage(bo,2,uo,null,null,u=>arcP(T.bagStore,T.bag,u,.12),.2);if(!bo.shown){bo.shown=1;BG.position.set(T.bagStore[0],T.bagStore[1],T.bagStore[2]);}D.push(held(bo,BG,cs));}
            else if(so>=3){if(so===4)reqStage(bo,4,uo,null,T.bag,null,.2);D.push(at(bo,BG,T.bag));}
            else{if(so===1)reqStage(bo,1,uo,T.bagStore,null,null,.2);D.push({o:BG,m:'hide'});}}}}
      // the items
      const IT=S.counterItems||[];const un=pl.U,scn=pl.SC;
      IT.forEach((m,j)=>{if(j>=pl.n){D.push({o:m,m:'hide'});return;}
        const ue=un[j],se=scn[j],[su,uu]=evSt(ue),[ss,us]=evSt(se),a=m.userData.a,hy=m.userData.hy,bo_=m.userData.bo;
        const inB=()=>{const p=B?B.position:null;return p?[p.x+bo_[0],p.y-.1+hy,p.z+bo_[1]]:a;};
        const mouthY=T.bag[1]+.165+.07,botY=T.bag[1]-.165+hy;
        if(ss===5||(ss===4&&us>.42)||ud.bagTaken){D.push({o:m,m:'hide'});}
        else if(ss===4){const y=mouthY+(botY-mouthY)*tE(us/.42);D.push(at(se,m,[T.bag[0],y,T.bag[2]]));reqStage(se,4,us,null,[T.bag[0],mouthY,T.bag[2]],null);}
        else if(ss===2){reqStage(se,2,us,null,null,u=>scanPath(a,u));D.push(held(se,m,cs,{plan:scanPath(a,us)}));if(us>=.38&&us<.56)beep=true;}
        else if(su===2){if(!pl.hb&&!ue.from)ue.from=m.visible?m.position.toArray():(()=>{const pp=palmOf(g,0);return pp?[pp[0],pp[1]-.04,pp[2]]:a;})();const fr=pl.hb?inB():ue.from;reqStage(ue,2,uu,null,null,u=>arcP(fr,a,u,.14));D.push(held(ue,m,g,{plan:arcP(fr,a,uu,.14)}));}
        else if(su>=3){D.push(at(ue,m,a));if(su===4)reqStage(ue,4,uu,null,a,null);if(ss===1)reqStage(se,1,us,a,null,null);}
        else{if(su===1&&pl.hb){const p=inB();reqStage(ue,1,uu,p,null,null);}
          else if(su===1){const r=restP(g,0);req(ue,[r[0],r[1],r[2]],1);if(uu<.6){D.push({o:m,m:'hide'});return;}if(!ue.shown){ue.shown=1;ue.grip=[0,0,0];}D.push(held(ue,m,g));return;} /* carried: the hand comes back in front of the body and takes the next one from the other arm, then on to the counter */
          D.push(pl.hb&&ud.basketOnCounter?{o:m,m:'at',p:inB()}:{o:m,m:'hide'});}});
      // paying: the card to the terminal, or a banknote handed across and put in the drawer
      ud.cardOn=false;
      if(pl.cash){const ng=ev('noteGive')[0],nt=ev('noteTake')[0],[sg,ug]=evSt(ng),[sn,un_]=evSt(nt),N=S.tillNote,HN=[T.H[0],T.H[1]-.25,T.H[2]];
        if(sn===2){reqStage(nt,2,un_,null,null,u=>arcP(HN,T.drawer,u,.05),.02);D.push(held(nt,N,cs));}
        else if(sn>=3)D.push({o:N,m:'hide'});
        else if(sg===1){const ry=g.rotation.y,fx=Math.sin(ry),fz=Math.cos(ry),k_=g.userData.k||1,pk=[g.position.x-fx*.04-fz*.2,.93*k_,g.position.z-fz*.04+fx*.2];reqStage(ng,1,Math.min(1,ug*3),pk,null,null,.02);D.push({o:N,m:'hide'});} /* into the pocket for the money */
        else if(sg===2||sg===3){if(sg===2){if(!ng.from){const pp=palmOf(g,1);ng.from=pp||HN;N.position.set(ng.from[0],ng.from[1]-.01,ng.from[2]);ng.grip=[0,0,0];}reqStage(ng,2,ug,null,null,u=>arcP(ng.from,HN,u,.05),.02);}else req(ng,[T.H[0],T.H[1]-.23,T.H[2]],1);
          D.push(held(ng,N,g));if(sn===1)reqStage(nt,1,un_,HN,null,null,.02);}
        else{if(sg===4)reqStage(ng,4,ug,null,HN,null,.02);D.push({o:N,m:'hide'});}}
      else if(S.termP){const cd=pl.pay,[sc_,uc]=evSt(cd),tp_=[S.termP[0],S.termP[1]+.02,S.termP[2]];if(sc_>=1&&sc_<=4){reqStage(cd,sc_,uc,tp_,tp_,null,.05);ud.cardOn=true;}if(S.tillNote)D.push({o:S.tillNote,m:'hide'});}
      if(S.beep)S.beep.visible=beep;
      ud.ikReq=RQ.c;if(cs)cs.userData.ikReq=RQ.s;S.tillD=D;
      {const CF=S.coffee;if(CF&&CF.owner===g&&!CF.carrier&&phase==='bye'){const c_=CF.cup.position,w_=Math.sin(Math.PI*clamp(pl.byeA/.9,0,1));ud.ikReq=[ud.ikReq&&ud.ikReq[0],{p:[c_.x,c_.y+.08,c_.z],w:w_}];if(pl.byeA>.45)CF.carrier=g;}const CG=S.cig;if(CG&&CG.owner===g&&!CG.carrier&&phase==='bye'&&!(CF&&CF.owner===g&&!CF.carrier)){const c_=CG.pack.position;ud.ikReq=[ud.ikReq&&ud.ikReq[0],{p:[c_.x,c_.y+.06,c_.z],w:Math.sin(Math.PI*clamp(pl.byeA/.9,0,1))}];if(pl.byeA>.45){CG.carrier=g;CG.t=0;}}} // the coffee off the counter on the way out; the cigarettes into a pocket
      if(allDone&&pl.byeA>=pl.bye){(S.counterItems||[]).forEach(m=>m.visible=false);[S.counterBag,S.tillNote,S.counterBasket].forEach(o=>{if(o)o.visible=false;});if(S.beep)S.beep.visible=false;S.tillD=null;ud.ikReq=null;ud.coW=0;ud.cardOn=false;ud.basketOnCounter=false;ud.dockV=0;ud.leanBoost=0;
        if(cs){cs.userData.ikReq=null;cs.userData.lookAtP=null;cs.userData.talking=false;cs.userData.smile=false;cs.userData.leanBoost=0;}ud.pay=null;ud.phase=null;ud.lookAtP=null;ud.talking=false;ud.smile=false;qOcc[0]=null;navNext(g,T_);}}
    // after the arms are posed: what is held goes into the palm; what is let go settles exactly into its place
    const _pa=new T.Vector3(),_pb=new T.Vector3();
    function palmOf(g,side){if(!g)return null;const ud=g.userData;if(ud.gltfP){const a=armBones(g)[side];if(a&&a[1]&&a[2]){a[2].getWorldPosition(_pa);a[1].getWorldPosition(_pb);_pb.subVectors(_pa,_pb).normalize();return [_pa.x+_pb.x*.075,_pa.y+_pb.y*.075,_pa.z+_pb.z*.075];}}
      const h=side?ud.rh:ud.lh;if(h){h.getWorldPosition(_pa);return [_pa.x,_pa.y,_pa.z];}return null;}
    function tillPlace(){{const CG=S.cig;if(CG){if(CG.held){const pp=palmOf(CG.held,1);if(pp)CG.pack.position.set(pp[0],pp[1]-.05,pp[2]);}else if(CG.carrier){const k=CG.carrier,pp=palmOf(k,1);CG.t+=1/30;if(pp&&CG.t<.8){CG.pack.visible=true;CG.pack.rotation.set(0,0,0);CG.pack.position.set(pp[0],pp[1]-.05,pp[2]);}else{CG.pack.visible=false;CG.owner=CG.carrier=null;CG.t=0;}}else if(CG.owner&&!CG.owner.userData.pay){CG.carrier=CG.owner;CG.t=0;}}}{const CF=S.coffee;if(CF&&CF.owner&&!CF.carrier&&!CF.held&&!CF.owner.userData.pay)CF.carrier=CF.owner; /* paid and going: the coffee goes with its owner */if(CF&&CF.held){const pp=palmOf(CF.held,1);if(pp)CF.cup.position.set(pp[0],pp[1]-.07,pp[2]);} /* in her hand: placed after her pose, so it never lags a frame */if(CF&&CF.carrier){const k=CF.carrier;if(!k.visible||k.userData.state==='away'){CF.cup.visible=false;CF.lid.visible=false;CF.owner=CF.carrier=null;}else{const pp=palmOf(k,1);if(pp){CF.cup.visible=true;CF.cup.position.set(pp[0],pp[1]-.075,pp[2]);}}}}const D=S.tillD;if(!D)return;D.forEach(d=>{if(d.m==='hand'&&d.who){const u=d.who.userData;(u.tillGrip||(u.tillGrip=[0,0]))[d.side]=1;}});D.forEach(d=>{const o=d.o;if(!o)return;if(d.m==='hide'){o.visible=false;return;}o.visible=true;const e_=d.ev;
      if(d.m==='at'){let p=d.p;if(e_&&e_.rel&&e_.s===4){const T_s=Math.max(.15,Math.hypot(p[0]-e_.rel[0],p[1]-e_.rel[1],p[2]-e_.rel[2])/1.0);if(e_.a<T_s)p=vl(e_.rel,p,tE(e_.a/T_s));}o.position.set(p[0],p[1],p[2]);return;} /* just let go: settles into its spot, never faster than 1 m/s */
      let q=palmOf(d.who,d.side);
      if(q){q=[q[0]+d.off[0],q[1]+d.off[1],q[2]+d.off[2]];const gr=e_&&e_.grip;if(gr){const a_=e_.s===2?e_.a:9,L0=Math.hypot(gr[0],gr[1],gr[2]),k=L0>1e-4?Math.max(0,Math.max(Math.exp(-a_*12),1-a_*1.0/L0)):0;q=[q[0]+gr[0]*k,q[1]+gr[1]*k,q[2]+gr[2]*k];}} /* the contact offset melts away (never faster than 1 m/s) */
      else q=d.plan||[o.position.x,o.position.y,o.position.z];
      o.position.set(q[0],q[1],q[2]);if(d.ry!=null)o.rotation.y=d.ry;});}
    // watchdog: every walker checks that it is really getting closer to where it is going. No headway for a while, or turning on the spot
    // round and round, is a blockage whatever caused it, and it resolves itself the way a person would: (1) step back to where there is room
    // and take a way round the spot that is blocked, (2) a wider way round (the pram set straight first), (3) change of plan: that shelf
    // later or not at all; the till, the basket stack and the door are never given up, only approached another way
    function watchdog(g,dt,T_){const ud=g.userData,P=ud.path;
      if(ud.state!=='walk'||!P||P.length<2||((ud.fpWait||0)>0&&ud.fpWait<8)||ud.holdT>0||ud.pauseT>0||ud.room){ud.wd=null;return;} /* a short wait for the specialist is manners, not a blockage */
      const x=g.position.x,z=g.position.z,e=P[P.length-1],de=Math.hypot(e[0]-x,e[1]-z);let W=ud.wd;
      if(!W||Math.hypot(W.e[0]-e[0],W.e[1]-e[1])>.4){W=ud.wd={e:[e[0],e[1]],best:de,t:T_,lv:0,rot:0,pa:ud.ang||0};return;}
      {let da=(ud.ang||0)-W.pa;da=((da+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;W.rot+=Math.abs(da);W.pa=ud.ang||0;}
      if(de<W.best-.3||de<.35){W.best=Math.min(W.best,de);W.t=T_;W.rot=0;if(de<W.best-.6)W.lv=0;return;}
      const stall=T_-W.t,loop=W.rot>2*Math.PI&&stall>2.5;if(!(stall>(W.lv?4:5)||loop))return;
      W.t=T_;W.rot=0;W.lv++;ud.wdN=(ud.wdN||0)+1;const lg=ud.visit&&ud.visit[ud.legI],must=!lg||lg.kind==='queue'||lg.kind==='exit'||lg.kind==='returnBasket'||lg.kind==='enter';
      if(W.lv>=3&&!must){ud.wd=null;navNext(g,T_);return;}
      if(ud.stroller){ud.turning=false;ud.stPark=null;}
      const G=gridOf(g),Gd=gridDyn(g),G2=(Gd===G?G:Gd).slice(),n1=P[Math.min((ud.pi||0)+1,P.length-1)],L1=Math.hypot(n1[0]-x,n1[1]-z)||1,ax=x+(n1[0]-x)/L1*Math.min(.6,L1),az=z+(n1[1]-z)/L1*Math.min(.6,L1),rr=W.lv>=2?.55:.35;
      for(let s_=0;s_<6.28;s_+=.5)for(let q_=0;q_<=rr;q_+=.1){const [ci,cj]=nav.toCell(ax+Math.sin(s_)*q_,az+Math.cos(s_)*q_);if(ci>=0&&cj>=0&&ci<nav.cols&&cj<nav.rows&&Math.hypot(ax+Math.sin(s_)*q_-e[0],az+Math.cos(s_)*q_-e[1])>.4)G2[cj*nav.cols+ci]=1;}
      let back=null,bc=fpClr(x,z)+.02;for(let k_=0;k_<12;k_++){const a_=k_*Math.PI/6,bx=x+Math.sin(a_)*.5,bz=z+Math.cos(a_)*.5,[ci,cj]=nav.toCell(bx,bz);if(!nav.free(G,ci,cj)||!circleFree(bx,bz,.22)||!circleFree((x+bx)/2,(z+bz)/2,.22)||people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-bx,o.position.z-bz)<.5))continue;const c_=fpClr(bx,bz)+.1*Math.hypot(ax-bx,az-bz);if(c_>bc){bc=c_;back=[bx,bz];}}
      if(VZ.fp)for(const c of VZ.fp){const R_=c[2]+.3;for(let s_=0;s_<6.28;s_+=.4)for(let q_=0;q_<=R_;q_+=.15){const [ci,cj]=nav.toCell(c[0]+Math.sin(s_)*q_,c[1]+Math.cos(s_)*q_);if(ci>=0&&cj>=0&&ci<nav.cols&&cj<nav.rows)G2[cj*nav.cols+ci]=1;}}
      const from=back||[x,z],r_=nav.route(G2,from,e)||(W.lv>=2?nav.route(nav.G0,from,e):null);
      if(r_&&r_.length>1){setPath(g,back?[[x,z]].concat(r_):r_,T_);ud.wd=W;W.e=[e[0],e[1]];}
      else if(W.lv>=3){W.lv=1;} /* the way there is still shut: keep trying, another way each time */}
    function stepPeople(dt,T_,open){
      if(!VZ.g&&T_>VZ.nextTry&&people.length){VZ.nextTry=T_+1.5;vzTex();vzSpawn(T_);} // Венци joins once his model and textures are in
      people.forEach((g,i)=>{const ud=g.userData;if(ud.ddd){vzStep(g,dt,T_,open);g.position.y=floorY(g.position.x,g.position.z)+(ud.dz.lift||0);return;}if(!open){g.visible=false;if(ud.stroller)ud.stroller.visible=false;return;}
        {const lp=ud._lpos,vr=lp&&g.visible?Math.hypot(g.position.x-lp[0],g.position.z-lp[1])/Math.max(dt,1e-3):0;ud.vR=(ud.vR||0)+((vr<3?vr:0)-(ud.vR||0))*Math.min(1,dt*8);ud._lpos=[g.position.x,g.position.z];} /* real speed of the body over the last frames */
        if(ud.follow!=null){followParent(g,dt,T_);return;}if(g.visible)watchdog(g,dt,T_);
        if(ud.state==null)navStart(g,T_,i);
        if(ud.state==='away'){g.visible=false;if(ud.stroller)ud.stroller.visible=false;if(T_>ud.until){if(doorBusy(g))ud.until=T_+rnd(.8,1.6);else if(ud.isChild){restyle(g);navEnter(g,T_);}else navEnter(regen(i),T_);}return;}
        g.visible=true;if(ud.stroller)ud.stroller.visible=true;
        if(ud.state==='enter'){ud.blend=Math.max(0,ud.blend-dt*3);if(T_>ud.until)startLeg(g,T_);}
        else if(ud.state==='walk'){ud.blend=Math.min(1,ud.blend+dt*2);
          if(VZ.fp&&ud.path&&ud.fRe!==VZ.fpTok&&!ud.pay&&!ud.ddd){const P=ud.path;let a=[g.position.x,g.position.z],hit=false;for(let q=(ud.pi||0)+1;q<Math.min(P.length,(ud.pi||0)+5);q++){if(segFP(a,P[q],.2)){hit=true;break;}a=P[q];}
            if(hit){ud.fRe=VZ.fpTok;const tg=P[P.length-1],NP=nav.route(gridDyn(g),[g.position.x,g.position.z],tg);if(NP)setPath(g,NP,T_);}}
          if(VZ.zone&&ud.path&&ud.zRe!==VZ.zone.tok&&!ud.pay&&!ud.ddd){const P=ud.path;let hit=false;for(let q=ud.pi||0;q<Math.min(P.length,(ud.pi||0)+4);q++)if(P[q]&&inZone(P[q][0],P[q][1])){hit=true;break;} // the way ahead runs through the work: round it
            if(hit){ud.zRe=VZ.zone.tok;const tg=P[P.length-1],lg=ud.visit&&ud.visit[ud.legI];if(lg&&lg.kind==='browse'&&inZone(tg[0],tg[1],.2))navNext(g,T_);else{const NP=nav.route(gridDyn(g),[g.position.x,g.position.z],tg);if(NP)setPath(g,NP,T_);}}}
          // nobody walks at a metronome pace: the speed drifts slowly around the person's own (±~7 %, mean-reverting noise, ~3 s memory)
          ud.spN=clamp((ud.spN||1)+(1-(ud.spN||1))*dt/3+(Math.random()-.5)*.25*Math.sqrt(dt),.9,1.1);
          if(ud.holdKid&&T_-ud.holdKid>.2){ud.holdKid=0;if(!ud.pay)ud.ikReq=null;}
          if(parentOfWant(g,ud,T_)){ud.vx=ud.vz=0;ud.vNow=0;ud.vAct=0;}else{ /* stopped for the child: the legs stop too */
          manners(g,ud,T_);const mw=mindWalk(g,dt,T_);if(mw===0)ud.vAct=0;if(mw!==0&&advance(g,ud.sp*ud.spN*mw*ud.blend*dt,dt)){ud.glanceAt=null;ud.lookAtP=null;ud.scanUntil=0;navArrive(g,T_);}
          else if(!ud.pay){ // a glance at whoever comes close on the way: the head turns to them for a second, then looks ahead again
            if(ud.glanceAt&&(T_>ud.glanceAt||!ud.glanceTo.visible)){ud.glanceAt=null;ud.lookAtP=null;}
            if(!ud.glanceAt&&T_>(ud.glanceNext||0)){const fx=Math.sin(ud.ang),fz=Math.cos(ud.ang),me=i;
              const W_=VZ.zone&&VZ.g&&VZ.g.visible?VZ.g:null,wl=W_?(()=>{const ox=W_.position.x-g.position.x,oz=W_.position.z-g.position.z,L=Math.hypot(ox,oz);return L<4.5&&L>1&&(ox*fx+oz*fz)/L>.3;})():false; // someone at work up a ladder or at a box draws a look, as it does in a shop
              const o=wl&&Math.random()<.6?W_:people.find(o=>o!==g&&o.visible&&o.userData.follow!==me&&ud.follow!==people.indexOf(o)&&(()=>{const ox=o.position.x-g.position.x,oz=o.position.z-g.position.z,L=Math.hypot(ox,oz);return L<1.7&&L>.5&&(ox*fx+oz*fz)/L>.2;})());
              if(o){ud.glanceAt=T_+1.2;ud.glanceTo=o;ud.glanceNext=T_+5+Math.random()*7;}}
            if(ud.glanceAt)ud.lookAtP=[ud.glanceTo.position.x,ud.glanceTo.position.z];mindGaze(g,T_);}}}
        else if(ud.state==='browse'){ud.blend=Math.max(0,ud.blend-dt*3);makeRoom(g,dt);
          // couples / parent+child: stop now and then, face each other and talk 6–15 s (talker swaps every ~3 s)
          const pt=ud.partner!=null?people[ud.partner]:null;
          const pd=pt?Math.hypot(pt.position.x-g.position.x,pt.position.z-g.position.z):0;if(pt&&pt.visible&&!ud.chat&&pd>.5&&pd<1.7&&Math.random()<dt*.08){ud.chat={until:T_+rnd(6,15),sw:T_+3,talker:0};ud.until=Math.max(ud.until,ud.chat.until+1);}
          if(ud.chat){if(!pt||!pt.visible||T_>ud.chat.until){ud.chat=null;ud.lookAtP=null;ud.talking=false;}else{if(T_>ud.chat.sw){ud.chat.sw=T_+rnd(2,4);ud.chat.talker^=1;}ud.faceAng=Math.atan2(pt.position.x-g.position.x,pt.position.z-g.position.z);ud.lookAtP=[pt.position.x,pt.position.z];ud.talking=ud.chat.talker===0;}}
          if(VZ.zone&&ud.zTok!==VZ.zone.tok&&inZone(g.position.x,g.position.z)){ud.zTok=VZ.zone.tok;ud.until=Math.min(ud.until,T_+rnd(.5,1.5));ud.chat=null;} // the specialist sets up here: finish and move on
          if(ud.call&&T_>ud.call){ud.call=0;if(ud.shelfAng!=null)ud.faceAng=ud.shelfAng;}
          if(ud.ask){const A=ud.ask,cs=A.cs,cu=cs.userData,u=T_-A.t0,end=()=>{cu.lookAtP=null;cu.talking=false;cu.smile=false;cu.ikReq=null;cu.state=A.st0;ud.ask=null;ud.lookAtP=null;ud.talking=false;ud.firstTime=false;ud.until=Math.min(ud.until,T_+.4);};
            if(people.some(o=>o.userData.pay)||T_>ud.until-.5)end();else{cu.state='greet';cu.lookAtP=[g.position.x,g.position.z];ud.talking=u<1.7;cu.talking=u>=1.7&&u<4.2;cu.smile=true;
              if(u>2&&u<4.2){const w=Math.min(1,(u-2)/.4,(4.2-u)/.4),tg=A.tgt,dx=tg[0]-cs.position.x,dz=tg[1]-cs.position.z,L=Math.hypot(dx,dz)||1;cu.ikReq=[null,{p:[cs.position.x+dx/L*.75,1.45,cs.position.z+dz/L*.75],w:w*.95}];ud.lookAtP=u>2.4?[tg[0],tg[1]]:[cs.position.x,cs.position.z];}else{cu.ikReq=null;ud.lookAtP=[cs.position.x,cs.position.z];}}} // "where is ...?" - she points; the eyes follow her hand
          if(!ud.ask&&parentOfWant(g,ud,T_))ud.until=Math.max(ud.until,T_+.5);
          ud.leftT=ud.until-T_;ud.ang=angStep(ud.ang,ud.faceAng,4,dt,2.6);g.rotation.y=ud.ang;if(T_>ud.until&&!ud.chat){ud.call=0;navNext(g,T_);}}
        else if(ud.state==='queue'){ud.blend=Math.max(0,ud.blend-dt*3);makeRoom(g,dt);const k=ud.slot;
          // in the line: facing the one ahead (the line reads as a line, not as people standing about), now and then a look at the till
          if(k>0&&!ud.pay){const ah=qOcc[k-1],tp=ah&&ah.visible?[ah.position.x,ah.position.z]:nav.queue[k-1];if(tp&&Math.hypot(tp[0]-g.position.x,tp[1]-g.position.z)>.15)ud.faceAng=Math.atan2(tp[0]-g.position.x,tp[1]-g.position.z);
            if(!ud.phone&&S.tl){if(T_>(ud.qLook||0)){const tr_=ud.tr||{},cd=candySpot();ud.qLook=T_+rnd(3.5,10)*(1.3-(tr_.cur||.5)*.6);ud.qLookEnd=T_+rnd(1.2,2.6);ud.qLookP=cd&&Math.random()<.3+.4*(tr_.cur||0)?cd:[S.tl.E-.4,S.tl.H[2]+.5];}ud.lookAtP=T_<(ud.qLookEnd||0)?ud.qLookP:null;}}
          else if(S.tl)ud.faceAng=Math.atan2(S.tl.E-.4-g.position.x,S.tl.H[2]-g.position.z); // head of the line or being served: square up to the counter
          ud.ang=angStep(ud.ang,ud.faceAng,4,dt,2.6);g.rotation.y=ud.ang;
          if(k===0&&!ud.pay&&!ud.room){const me_=people.indexOf(g),fo=people.find(o=>o!==g&&o.visible&&o.userData.follow!=null&&o.userData.follow!==me_&&Math.hypot(o.position.x-g.position.x,o.position.z-g.position.z)<.6);
            if(fo){let best=null;for(const d_ of [.35,.5,.65,.8])for(let a_=0;a_<6.28;a_+=.52){const tx=g.position.x+Math.sin(a_)*d_,tz=g.position.z+Math.cos(a_)*d_,[ci,cj]=nav.toCell(tx,tz);if(!nav.free(nav.G0,ci,cj)||!circleFree(tx,tz,.2))continue;let m_=9;people.forEach(o=>{if(o!==g&&o.visible)m_=Math.min(m_,Math.hypot(o.position.x-tx,o.position.z-tz));});if(m_<.55)continue;const c=-m_+d_*.6;if(!best||c<best[2])best=[tx,tz,c];}if(best)ud.room={w:fo,home:[g.position.x,g.position.z],to:[best[0],best[1]],ph:0,t:0,stay:true};}
            else if(nav.queue[0]&&Math.hypot(g.position.x-nav.queue[0][0],g.position.z-nav.queue[0][1])>.25&&!(VZ.atTill&&VZ.g&&VZ.g.visible)){const q0=nav.queue[0];if(!people.some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-q0[0],o.position.z-q0[1])<.45))ud.room={w:g,home:[g.position.x,g.position.z],to:[q0[0],q0[1]],ph:0,t:0,stay:true};}} // nobody beside the counter any more: back to the place in the line // the one paying has a child or a companion beside: the next in line keeps a step back
          let tillBusy=k===1&&people.some(o=>o!==g&&o.visible&&o.userData.state==='walk'&&!(o.userData.visit&&o.userData.visit[o.userData.legI]&&o.userData.visit[o.userData.legI].kind==='queue')&&Math.hypot(o.position.x-nav.queue[0][0],o.position.z-nav.queue[0][1])<.7);ud.tbT=tillBusy?(ud.tbT||0)+dt:0;if(ud.tbT>1.5)tillBusy=false; // the one just served walks off first (never more than 3 s)
          if(k>0&&!qOcc[k-1]&&!tillBusy){qOcc[k]=null;qOcc[k-1]=g;ud.slot=k-1;setPath(g,nav.route(gridDyn(g),[g.position.x,g.position.z],nav.queue[k-1]),T_);}
          // the place ahead was promised to someone still on the way from the far end of the shop: whoever is already here goes first
          else if(k>0&&qOcc[k-1]&&qOcc[k-1].userData.state==='walk'&&!qOcc[k-1].userData.pay){const o=qOcc[k-1],ou=o.userData,q0=nav.queue[k-1];
            if(Math.hypot(o.position.x-q0[0],o.position.z-q0[1])>Math.max(2.5,Math.hypot(g.position.x-q0[0],g.position.z-q0[1])+.4)&&!(T_<(ou.swapT||0))&&!(T_<(ud.swapT||0))){qOcc[k-1]=g;qOcc[k]=o;ou.slot=k;ud.slot=k-1;ou.swapT=ud.swapT=T_+5;setPath(o,nav.route(gridDyn(o),[o.position.x,o.position.z],nav.queue[k]),T_);setPath(g,nav.route(gridDyn(g),[g.position.x,g.position.z],q0),T_);}}
          else if(k>0&&T_-ud.qT>PARAMS.renegeAfter*PARAMS.timeScale&&Math.random()<dt*.05){qOcc[k]=null;ud.legI=ud.visit.length-1;startLeg(g,T_);} // §5 reneging
          else if(k===0)checkout(g,T_,dt);}
        if(ud.stroller)strollerFollow(g,dt);
        const leg=ud.visit[ud.legI],leaving=leg&&(leg.kind==='exit'||leg.kind==='returnBasket'),entering=ud.state==='enter';
        if(ud.basket){ud.basket.visible=!!ud.hasBasket&&!entering&&(ud.pay?(!ud.basketOnCounter||!!ud.basketL):(!leaving||!!(leg&&leg.kind==='returnBasket')));ud.bag.visible=!!ud.buyer&&(ud.pay?!!ud.bagTaken:leaving);}
        if(ud.stroller&&ud.stroller.userData.bag){ud.stroller.userData.bag.visible=ud.bag.visible;ud.bag.visible=false;}
        if(ud.phoneM)ud.phoneM.visible=!!ud.phone&&ud.state==='queue'&&!ud.pay&&!ud.pushing;
        if(ud.state==='walk'){const va=Math.max(ud.vAct==null?ud.vNow||0:ud.vAct,ud.sepV||0);ud.sepV=0;ud.legsOn=ud.legsOn?va>.05||ud.blend<.5:va>.12||ud.blend<.5;}else ud.legsOn=true;
        ud.lookDir=0;poseAny(g,T_,dt,ud.state==='walk'&&!ud.turning&&!ud.yielding&&ud.legsOn&&!(ud.pauseT>0)&&!(ud.holdT>0)&&(ud.vAct==null||ud.vAct>.05||ud.vR>.05)?Math.min(ud.sp*ud.blend,ud.vNow!=null?Math.max(ud.vNow,ud.sp*.35):9):ud.turning&&ud.state==='walk'?.3:Math.max((ud.room||ud.pay)?ud.dockV||0:0,ud.vR>.15?ud.vR:0));});
      // nobody overlaps anybody: two bodies closer than half a metre are eased apart (a walker moves, someone standing at a shelf or in the
      // queue stays put; a couple or a parent and child may come closer), only onto walkable floor, so no one ever walks through another
      {const n=people.length,mov=u=>(u.state==='walk'&&(u.vNow||0)>.2)||u.follow!=null,wt=u=>u.pay||u.state==='queue'||u.state==='browse'||u.state==='ddd'?0:(mov(u)?1:.25),cap=u=>(mov(u)?.6:.25)*dt; // walkers give way (within their stride); someone standing only shifts a foot; the queue and the till stay
        const ux0=(d,L)=>d/(L||1),acc=new Map(),add=(g,x,z)=>{const v=acc.get(g)||[0,0];v[0]+=x;v[1]+=z;acc.set(g,v);}; // all pushes on a person are summed, then limited once (two neighbours must not push twice as fast)
        for(let a=0;a<n;a++){const A=people[a];if(!A.visible)continue;const ua=A.userData;
          for(let b=a+1;b<n;b++){const B=people[b];if(!B.visible)continue;const ub=B.userData,pair=ua.follow===b||ub.follow===a||ua.partner===b||ub.partner===a,r=pair?.46:(ua.ddd||ub.ddd)?.66:.54+((ua.basket&&ua.basket.visible)||(ub.basket&&ub.basket.visible)||(ua.bag&&ua.bag.visible)||(ub.bag&&ub.bag.visible)||ua.carry||ub.carry?.1:0);
            let dx=B.position.x-A.position.x,dz=B.position.z-A.position.z,L=Math.hypot(dx,dz);if(L>=r)continue;if(L<1e-3){dx=Math.cos(a*2.4),dz=Math.sin(a*2.4);L=1;}
            if(!pair&&ua.state==='browse'&&ub.state==='browse'){askRoom(B,A,ux0(dx,L),ux0(dz,L),true);continue;} // two at one shelf spot: the later one moves along a step
            if(ua.state==='browse'&&mov(ub)&&ub.follow==null)askRoom(A,B,(ub.vx||0)/((ub.vNow||1)),(ub.vz||0)/((ub.vNow||1)));else if(ub.state==='browse'&&mov(ua)&&ua.follow==null)askRoom(B,A,(ua.vx||0)/((ua.vNow||1)),(ua.vz||0)/((ua.vNow||1)));
            let wa=wt(ua),wb=wt(ub);if(ua.ddd&&!ub.pay&&!ub.cashier){wa=0;wb=1;}else if(ub.ddd&&!ua.pay&&!ua.cashier){wb=0;wa=1;}else if(ub.follow!=null&&ua.state==='queue'&&!ua.pay)wa=.6;else if(ua.follow!=null&&ub.state==='queue'&&!ub.pay)wb=.6; /* in the line one shifts a little for a child or a companion pressed against the counter */const ws=wa+wb;if(!ws)continue; /* the specialist at work keeps his place: the other one makes room */const mv=r-L,ux=dx/L,uz=dz/L;
            if(wa)add(A,-ux*mv*wa/ws,-uz*mv*wa/ws);if(wb)add(B,ux*mv*wb/ws,uz*mv*wb/ws);}}
        acc.forEach((v,g)=>{{const a_=g.userData.ang!=null?g.userData.ang:g.rotation.y,hx=Math.sin(a_),hz=Math.cos(a_),fw=v[0]*hx+v[1]*hz,lt=v[0]*hz-v[1]*hx,lim=-.12*dt;if(fw<lim){const ex=lim-fw,l2=lt+(lt>=0?ex:-ex);v[0]=hx*lim+hz*l2;v[1]=hz*lim-hx*l2;}} /* pushed from the front: a step aside, never a slide backwards */const L=Math.hypot(v[0],v[1]),c=cap(g.userData),k=L>c?c/L:1,G=gridOf(g),x0=g.position.x,z0=g.position.z,fr=(px,pz)=>{const [ci,cj]=nav.toCell(px,pz);return nav.free(G,ci,cj)||(nav.free(nav.G0,ci,cj)&&circleFree(px,pz,.17));};
          for(const [px,pz] of [[x0+v[0]*k,z0+v[1]*k],[x0+v[0]*k,z0],[x0,z0+v[1]*k]])if(fr(px,pz)){g.position.set(px,floorY(px,pz),pz);g.userData.sepV=Math.hypot(px-x0,pz-z0)/Math.max(dt,1e-3);break;}});} // never faster than a step: no gliding
      // §8 restocking staff: on the shelf 10–20 min every 1–2 h (scene-time scaled)
      const rs=extras.find(x=>x.userData.state==='restock'||x.userData.restocker);if(rs){const u=rs.userData;u.restocker=true;if(u.rsUntil==null){u.rsOn=true;u.rsUntil=T_+rr(PARAMS.restockOn)*PARAMS.timeScale*.15;}if(T_>u.rsUntil){u.rsOn=!u.rsOn;u.rsUntil=T_+(u.rsOn?rr(PARAMS.restockOn):rr(PARAMS.restockEvery)*.25)*PARAMS.timeScale*.15;}rs.visible=open&&u.rsOn;}
      // the flow layer: planned polylines of the shoppers currently inside
      // flow layer: a gold ribbon with chevrons along each walking shopper's planned route; the chevrons travel toward where the shopper is heading
      if(flowDirty&&flowLine&&T_-flowT>.4){flowT=T_;flowDirty=false;const pos=[],uv=[],w=.09;
        people.forEach(g=>{const ud=g.userData,P=ud.path;if(!P||ud.state!=='walk'||ud.follow!=null||!g.visible)return;let a=[g.position.x,g.position.z],u=0;
          for(let k=ud.pi+1;k<P.length;k++){const b=P[k],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.02){a=b;continue;}const nx=-dz/L*w,nz=dx/L*w,ya=.025+floorY(a[0],a[1]),yb=.025+floorY(b[0],b[1]),u1=u+L/.45;
            pos.push(a[0]+nx,ya,a[1]+nz, a[0]-nx,ya,a[1]-nz, b[0]+nx,yb,b[1]+nz, b[0]+nx,yb,b[1]+nz, a[0]-nx,ya,a[1]-nz, b[0]-nx,yb,b[1]-nz);uv.push(u,1,u,0,u1,1,u1,1,u,0,u1,0);u=u1;a=b;}});
        // one GPU buffer for the whole visit, rewritten in place (no new buffers every 0.4 s); it grows only if a path ever needs more room
        let fg=flowLine.geometry,cap=fg.userData.cap||0;const nv=pos.length/3;
        if(nv>cap||!fg.attributes.position){cap=Math.max(1024,1<<Math.ceil(Math.log2(nv)));fg.dispose();fg=new T.BufferGeometry();fg.userData.cap=cap;
          const pa=new T.BufferAttribute(new Float32Array(cap*3),3),ua=new T.BufferAttribute(new Float32Array(cap*2),2);pa.setUsage(T.DynamicDrawUsage);ua.setUsage(T.DynamicDrawUsage);fg.setAttribute('position',pa);fg.setAttribute('uv',ua);flowLine.geometry=fg;}
        const pa=fg.attributes.position,ua=fg.attributes.uv;pa.array.set(pos);ua.array.set(uv);pa.updateRange.offset=0;pa.updateRange.count=pos.length;ua.updateRange.offset=0;ua.updateRange.count=uv.length;pa.needsUpdate=true;ua.needsUpdate=true;fg.setDrawRange(0,nv);}
    }
    // §2: a new-looking person for a returning slot: age class, sex, height, build, skin, hair, outfit, glasses, phone
    function randomSpec(){const fem=Math.random()<.5,age=Math.random(),elder=age<PARAMS.age.elder,teen=age>1-PARAMS.age.teen,skin=pick_(SKIN),hair=elder?pick_([0xb8b0a6,0xd8d3cc,0x9a9a9a]):pick_(HAIR);
      const h=teen?1.55+Math.random()*.12:elder?1.55+Math.random()*.2:1.58+Math.random()*.37,wide=.9+Math.random()*.3;
      const o={h,fem,skin,hair,hairStyle:pick_(fem?['bob','pony','bun','curls','shortF']:['crop','side','receding','curls','none']),wide,belly:wide>1.1?.25:0,elder,iris:pick_(['#3a2a1a','#2a4a6a','#4a6a3a','#5a3a1a','#2b2b2b']),glasses:Math.random()<.25,shoe:pick_([0x14110e,0xe8e2d6,0x3a2a1a,0x2f3a4a]),bot:pick_(BOT),phone:Math.random()<PARAMS.phoneP};
      const r=Math.random();if(r<.3){o.coat=pick_(JK);o.collar=pick_([0xe8e2d6,0x3a3a3a]);o.top=pick_(TOP);}else if(r<.6){o.jacket=pick_(JK);o.hood=Math.random()<.5;o.top=pick_(TOP);o.tshirt=true;}else if(r<.72){o.jacket=0x1b1917;o.collar=0xe8e2d6;o.top=0xe8e2d6;o.bot=0x1b1917;}else if(r<.86){o.top=pick_([0x2f6fb5,0xc8382e,0x3a3a3a]);o.tshirt=true;o.bot=0x1e232b;o.cap=Math.random()<.6?0x1b1917:null;}else{o.top=pick_(TOP);if(fem){o.skirt=true;o.tights=0x2a2622;}}
      if(fem&&Math.random()<.12){o.hairStyle='none';o.hat=pick_([0x3a3a3a,0x7a2f2f,0x2c3a5a]);}
      if(teen){o.cap=Math.random()<.7?pick_([0x1b1917,0xc8382e]):null;o.backpack=pick_([0x2f6fb5,0x1b1917]);o.hood=true;o.jacket=o.jacket||pick_(JK);}
      if(elder){o.beard=!fem&&Math.random()<.5;o.hairStyle=fem?'curls':'receding';o.glasses=Math.random()<.6;if(!fem&&Math.random()<.4)o.hat=0x2b2622;o.cane=!fem&&Math.random()<.5;}
      if(!fem&&!elder&&Math.random()<.35){o.beard=true;o.stubble=true;}
      if(fem&&Math.random()<.3)o.handbag=pick_([0x2a1f16,0x5a1f1f,0x1b1917]);
      return o;}
    function mkRandom(sp){const g=gltfPerson(sp)||makePerson(9,sp);if(sp.cane&&!g.userData.gltfP){const k=g.userData.k;const cane=new T.Mesh(mergeColored([[new T.CylinderGeometry(.012,.014,.84*k,6).translate(0,-.4*k,.02),'#5a3a1a'],[new T.SphereGeometry(.02,6,5).translate(0,.02,.02),'#c9a24a']]),M.vc2);cane.castShadow=true;g.userData.arms[0].userData.hd.add(cane);g.userData.cane=true;}
      g.userData.phone=!!sp.phone;g.userData.sp=(sp.elder?rr(PARAMS.speed.elder):rr(PARAMS.speed.adult))*PARAMS.speedScale;return g;}
    function regen(i){window.__regenN=(window.__regenN||0)+1;const old=people[i],ud=old.userData,g=mkRandom(randomSpec()),nu=g.userData;nu.ph=Math.random()*6.28;if(ud.follow!=null)nu.follow=ud.follow;if(ud.partner!=null)nu.partner=ud.partner;if(ud.stroller){nu.stroller=ud.stroller;nu.pushing=true;nu.basket.visible=false;}
      room.remove(old);if(ud.gltfP){window.KL_GLTF.release(old);}else old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}else if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();});
      people[i]=g;room.add(g);if(camSub===old)camSub=null;return g;}

    // ---- real human models (hosted build only): window.KL_GLTF from assets/js/people-gltf.js; procedural figures remain the fallback ----
    const GL=()=>{const g=window.KL_GLTF;return g&&g.ready&&!g.failed?g:null;};
    const usedFiles=()=>people.concat(extras).map(p=>p.userData.file).filter(Boolean);
    let warmT=0;const warmSoon=()=>{if(!warmT)warmT=setTimeout(()=>{warmT=0;warm();},120);};
    const WARMED=new Set(); // model files whose shaders are already compiled
    function gltfPerson(spec){const G=GL();if(!G)return null;spec=spec||{};let kind=spec.staff?'staff':spec.isChild?'child':spec.elder?'elderly':(spec.fem?'f':'m');if(!G.has(kind)){if(kind==='child')return null;kind=spec.fem?'f':'m';if(!G.has(kind))return null;}
      const g=G.spawn({kind,height:spec.h||(spec.isChild?1.18:1.72),avoid:usedFiles(),file:spec.file,fresh:spec.fresh});if(!g)return null;if(!WARMED.has(g.userData.file)){WARMED.add(g.userData.file);const mm=G.models.find(m=>m.file===g.userData.file);if(!mm||!mm.warm)warmSoon();} /* models compiled behind the bar need no second pass (a full compile() costs 100+ ms in Firefox) */const ud=g.userData,k=(ud.height||1.72)/1.72;
      ud.gltfP=true;ud.k=k;ud.elder=!!spec.elder||ud.kind==='elderly';ud.isChild=!!spec.isChild||ud.kind==='child';ud.yaw=0;ud.dist=0;ud.blend=0;ud.phone=!!spec.phone;ud.hipY=.9*k;
      ud.rh=g.getObjectByName('Bip01_R_Hand')||g.getObjectByName('Bip02_R_Hand')||null;ud.lh=g.getObjectByName('Bip01_L_Hand')||null;
      const basket=new T.Group();basket.add(new T.Mesh(SHARED.basket(),M.vc2));
      basket.visible=false;g.add(basket);
      const bag=SHARED.bag();bag.visible=false;g.add(bag);
      const ph=new T.Group();{const pb=new T.Mesh(mergeColored([[new T.BoxGeometry(.074,.152,.009),pick_(['#ece9e2','#c9a89b','#2f5f9e','#b9bdc3','#1c1c1e','#7a1f2b','#e0c28a','#3d6b4f'])]]),M.vc2),scr=new T.Mesh(new T.PlaneGeometry(.066,.14),M.phoneScr||(M.phoneScr=new T.MeshBasicMaterial({color:0xcfe0ff})));scr.position.z=.0047;ph.add(pb,scr);} /* a phone in a coloured case (as most are): seen from the side or behind it still reads as a phone, not as an empty hand */ph.visible=false;g.add(ph); // a real phone: dark body, lit screen
      const it=new T.Mesh(SHARED.item((Math.random()*5)|0),M.vc);it.visible=false;it.castShadow=false;g.add(it);ud.itemM=it;const cd=new T.Mesh(SHARED.card(),M.vc);cd.visible=false;g.add(cd);ud.cardM=cd;const nt=new T.Mesh(SHARED.note(),M.vc);nt.visible=false;g.add(nt);ud.noteM=nt;
      const bl=new T.Mesh(SHARED.blob(),M.blob);bl.scale.setScalar(.34*k);bl.rotation.x=-Math.PI/2;bl.position.y=.012;bl.renderOrder=1;g.add(bl);
      ud.basket=basket;ud.bag=bag;ud.phoneM=ph;ud.arms=[{userData:{hd:ud.lh||g}},{userData:{hd:ud.rh||g}}];ud.legs=[];return g;}
    const _hv=new T.Vector3();
    function gltfPose(g,v){const ud=g.userData,st=ud.state;let clip='idle';
      if(v<=.04&&ud.vR>.15&&!ud.cashier&&!ud.ddd)v=ud.vR; // whatever moves the body (a pull by the hand, a step aside), the feet step with it
      if(ud.talking&&!ud.call&&!ud.ddd&&!people.concat(extras).some(o=>o!==g&&o.visible&&Math.hypot(o.position.x-g.position.x,o.position.z-g.position.z)<2.6))ud.talking=false; // nobody talks to the air
      if(v>.04&&ud.vR!=null&&!ud.cashier&&!ud.ddd)v=Math.min(v,ud.vR+.04); /* the legs step only as fast as the body really goes: held up, nobody walks on the spot */
      if(v>.04){clip=ud.elder?'walkslow':'walk';ud.setSpeed(v);}
      else if(st==='queue')clip=(ud.phone&&ud.phoneM&&ud.phoneM.visible)?'phone':'wait';
      else if(st==='browse'||st==='restock'||st==='scan')clip='look';else if(ud.bag&&ud.bag.visible)clip='bag';
      if(v<=.04&&((ud.lookAtP&&!(st==='queue'&&!ud.pay))||st==='chat'||st==='greet'))clip=ud.talking?(ud.ph>3?'talk2':'talk'):(ud.fem||ud.kind==='f'?'listen':'idle'); // a glance from the line is the head only
      if(v<=.04&&ud.bag&&ud.bag.visible&&!ud.cashier)clip='bag';
      if(v<=.04&&ud.call&&ud.rh&&ud.phoneM&&!ud.pushing)clip=ud.fem||ud.kind==='f'?'phone':'phonetalk'; // a call: at the ear (or, where the body has no such move, read off the screen), the phone always in the hand
      if(v<=.04&&ud.tantrum)clip='talk2'; // a full bag in the hand: it hangs, the arms do not gesture with it
      ud.play(clip,.3);
      if(ud.face&&!ud.gltfP){const now=performance.now()/1000,F=ud.fw||(ud.fw={}); /* real models get their faces in gltfHeads (living face) */const ease=(k,tgt,rate)=>{F[k]=(F[k]||0)+(tgt-(F[k]||0))*Math.min(1,rate||.12);ud.face(k,F[k]);};
        // smile: greeting / paying / talking / a child looking up at the parent; elderly concentrate while browsing
        const happy=ud.smile||ud.chat||st==='chat'||st==='greet'||(ud.isChild&&ud.lookAtP);ease('smile',happy?1.0:0);ease('squint',happy?.45:(F.micro==='squint'?.18:0));
        ease('frown',(ud.elder&&st==='browse'&&!happy)?.35:0);
        // blink every 2–6 s, 150 ms, eased
        if(ud.blinkT==null)ud.blinkT=now+rnd(2,6);if(now>ud.blinkT){ud.blinkT=now+rnd(2,6);ud.blinkEnd=now+.15;}ease('blink',ud.blinkEnd&&now<ud.blinkEnd?1:0,.5);
        // micro-expressions: brows / squint at low weight for ~1 s every 4–10 s
        if(ud.microT==null)ud.microT=now+rnd(4,10);if(now>ud.microT){ud.microT=now+rnd(4,10);F.micro=Math.random()<.5?'brows':'squint';ud.microEnd=now+rnd(.8,1.4);}if(ud.microEnd&&now>ud.microEnd)F.micro=null;ease('brows',F.micro==='brows'?.18:(F.surp&&now<F.surp?.6:0));
        // surprise when picking an item (sometimes), mouth while talking (no visemes: jaw pulse + rounded lips)
        if(st==='browse'&&Math.random()<.004&&!F.surp)F.surp=now+.5;if(F.surp&&now>F.surp+.3)F.surp=null;ease('surprise',F.surp&&now<F.surp?.3:0,.3);
        const talking=/talk/.test(ud.clip||'');ease('jaw',talking?.15+.2*Math.abs(Math.sin(now*9+(ud.ph||0))):0,.4);ease('oh',talking&&Math.sin(now*3.7)>.6?.25:0,.3);}
      // hand-held props follow the hand bones but stay upright (basket / bag hang from the palm)
      if(ud.rh&&!ud.swing){ud.rh.getWorldPosition(_hv);g.worldToLocal(_hv);ud.bag.position.set(_hv.x,_hv.y-.24,_hv.z);const bh=ud.basketL&&ud.lh?ud.lh:ud.rh;bh.getWorldPosition(_hv);g.worldToLocal(_hv);ud.basket.position.set(_hv.x,_hv.y-.2,_hv.z);ud.basket.rotation.y=ud.bag.rotation.y=0;}
      if(ud.lh&&ud.phoneM){ud.lh.getWorldPosition(_hv);g.worldToLocal(_hv);ud.phoneM.position.set(_hv.x,_hv.y+.02,_hv.z+.05);ud.phoneM.rotation.x=-.9;}}
    // a bag or basket hangs from the fingers: a damped pendulum (length ~0.24 m, ~1 Hz) driven by how the hand accelerates, so it lags,
    // swings a little and settles — never rigidly glued under the wrist
    const _pw=new T.Vector3(),_pe=new T.Euler(),_pq=new T.Quaternion();
    function hangProps(g,dt){const ud=g.userData;if(!ud.rh||!ud.bag)return;const S_=ud.swing||(ud.swing={b:{x:0,z:0,vx:0,vz:0,p:null,v:null},k:{x:0,z:0,vx:0,vz:0,p:null,v:null}});dt=Math.min(Math.max(dt,1e-3),.05);
      [[ud.bag,ud.rh,.24,S_.b],[ud.basket,ud.basketL&&ud.lh?ud.lh:ud.rh,.2,S_.k]].forEach(([o,hb,L,s])=>{if(!o)return;hb.getWorldPosition(_pw);
        if(!o.visible||(s.p&&s.p.distanceToSquared(_pw)>.04)){s.p=null;s.v=null;s.x=s.z=s.vx=s.vz=0;} /* hidden, or the person was just placed somewhere new: start at rest */
        if(o.visible){if(s.p){const vx=(_pw.x-s.p.x)/dt,vz=(_pw.z-s.p.z)/dt;if(s.v){const ax=clamp((vx-s.v.x)/dt,-12,12),az=clamp((vz-s.v.z)/dt,-12,12),w2=9.81/L;
              // angle θ of the bag from vertical (world x/z tilt): θ'' = -(g/L)·θ − a/L − damping·θ'
              s.vx+=(-w2*s.x-.6*ax/L-4.5*s.vx)*dt;s.vz+=(-w2*s.z-.6*az/L-4.5*s.vz)*dt;s.vx=clamp(s.vx,-4,4);s.vz=clamp(s.vz,-4,4);s.x=clamp(s.x+s.vx*dt,-.35,.35);s.z=clamp(s.z+s.vz*dt,-.35,.35);s.v.set(vx,0,vz);}else s.v=new T.Vector3(vx,0,vz);s.p.copy(_pw);}else s.p=_pw.clone();}
        // world offset of the bag centre from the hanging point, then into the person's frame
        const ox=Math.sin(s.x)*L,oz=Math.sin(s.z)*L,oy=-Math.cos(s.x)*Math.cos(s.z)*L;_pw.set(_pw.x+ox,_pw.y+oy,_pw.z+oz);g.worldToLocal(_pw);o.position.copy(_pw);
        _fq.setFromEuler(_pe.set(-s.z,0,s.x));_pq.copy(g.quaternion).invert();o.quaternion.copy(_pq).multiply(_fq).multiply(g.quaternion);});} /* the world tilt, seen from the person */
    function poseAny(g,t,dt,v){if(g.userData.gltfP)gltfPose(g,v);else posePerson(g,t,dt,v);}
    // after the mixer: head yaw toward whoever the person looks at, pitch for a child looking up / elderly looking down / a nod when handed the bag
    const _q=new T.Quaternion(),_ax=new T.Vector3();
    const _a=new T.Vector3(),_b=new T.Vector3(),_c=new T.Vector3(),_qa=new T.Quaternion(),_qb=new T.Quaternion();
    const _qw=new T.Quaternion();
    function aimBone(bone,child,target,w){bone.getWorldPosition(_a);child.getWorldPosition(_b);_b.sub(_a).normalize();_c.copy(target).sub(_a).normalize();_qa.setFromUnitVectors(_b,_c);if(w!=null&&w<1){_qw.set(0,0,0,1).slerp(_qa,w);_qa.copy(_qw);}
      bone.getWorldQuaternion(_qb);_qb.premultiply(_qa);bone.parent.getWorldQuaternion(_q).invert();bone.quaternion.copy(_q.multiply(_qb));bone.updateMatrixWorld(true);}
    function pushArms(g){const ud=g.userData,st=ud.stroller;if(!st||ud.state!=='walk')return;if(!ud.armB){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.armB=['L','R'].map(s=>[B(s+'_UpperArm'),B(s+'_Forearm'),B(s+'_Hand')]);}
      st.updateMatrixWorld(true);ud.armB.forEach((a,i)=>{if(!a[0]||!a[1]||!a[2])return;const tgt=new T.Vector3(i?-.16:.16,1.0,-.22);st.localToWorld(tgt);aimBone(a[0],a[1],tgt);aimBone(a[1],a[2],tgt);});}
    // hands at work: a shopper at a shelf or fridge reaches in and takes a product (it rides in the hand to the basket), a customer at the till
    // puts the items on the counter one by one, the cashier reaches for each item she scans – arm bones aimed on top of the clip, nothing new to load
    const _rt=new T.Vector3();
    function armBones(g){const ud=g.userData;if(!ud.armB){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.armB=['L','R'].map(s_=>[B(s_+'_UpperArm'),B(s_+'_Forearm'),B(s_+'_Hand')]);}return ud.armB;}
    // a real arm: shoulder–elbow–wrist solved exactly (law of cosines), the elbow kept down, out and a little back (no flips), and when the
    // target is further than the arm the body leans forward from the waist; targets and weights are smoothed, so a hand never trembles or jumps
    const _S0=new T.Vector3(),_E0=new T.Vector3(),_W0=new T.Vector3(),_Dv=new T.Vector3(),_Ed=new T.Vector3(),_Wd=new T.Vector3(),_pl=new T.Vector3(),_rv=new T.Vector3(),_fv=new T.Vector3(),_lq=new T.Quaternion();
    function ik2(g,side,tg,w){const a=armBones(g)[side];if(!a[0]||!a[1]||!a[2]||w<.004)return;
      a[0].getWorldPosition(_S0);a[1].getWorldPosition(_E0);a[2].getWorldPosition(_W0);const l1=_S0.distanceTo(_E0),l2=_E0.distanceTo(_W0);
      _Dv.copy(tg).sub(_S0);let d=_Dv.length();if(d<1e-4)return;_Dv.multiplyScalar(1/d);d=Math.min(Math.max(d,Math.abs(l1-l2)+.02),(l1+l2)*.985);
      const ry=g.rotation.y;_fv.set(Math.sin(ry),0,Math.cos(ry));_rv.set(-_fv.z,0,_fv.x);if(!side)_rv.negate(); // outward = this arm's side
      _pl.set(0,-1,0).addScaledVector(_rv,.55).addScaledVector(_fv,-.3);_pl.addScaledVector(_Dv,-_pl.dot(_Dv));if(_pl.lengthSq()<1e-6)_pl.set(0,-1,0);_pl.normalize();
      const x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x));_Ed.copy(_S0).addScaledVector(_Dv,x).addScaledVector(_pl,h);_Wd.copy(_S0).addScaledVector(_Dv,d);
      aimBone(a[0],a[1],_Ed,w);aimBone(a[1],a[2],_Wd,w);}
    function leanTo(g,ang){const ud=g.userData;if(ud.spB===undefined){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.spB=[B('Spine1'),B('Spine2')].filter(Boolean);}
      if(!ud.spB.length||Math.abs(ang)<.002)return;const ry=g.rotation.y;_rv.set(Math.cos(ry),0,-Math.sin(ry)); // the person's left: turning about it bends the chest forward
      ud.spB.forEach((b,i)=>{_lq.setFromAxisAngle(_rv,ang*(i?.45:.55));b.getWorldQuaternion(_qb);_qb.premultiply(_lq);b.parent.getWorldQuaternion(_q).invert();b.quaternion.copy(_q.multiply(_qb));b.updateMatrixWorld(true);});}
    function armsApply(g,R,dt){const ud=g.userData,A=ud.armS||(ud.armS=[{t:new T.Vector3(),w:0,on:false},{t:new T.Vector3(),w:0,on:false}]),kt=1-Math.exp(-dt*26),kw=1-Math.exp(-dt*16);let lean=0;
      A.forEach((s_,i)=>{const r=R[i];if(r){if(!s_.on){s_.t.set(r.p[0],r.p[1],r.p[2]);s_.on=true;}else{_rt.set(r.p[0],r.p[1],r.p[2]);_rt.sub(s_.t).multiplyScalar(kt);const L_=_rt.length(),mx=2.5*dt;if(L_>mx)_rt.multiplyScalar(mx/L_);s_.t.add(_rt);}} /* never faster than 2.5 m/s */s_.w+=((r?r.w:0)-s_.w)*(r&&r.w>s_.w?kw:1-Math.exp(-dt*7));if(s_.w<.004&&!r){s_.w=0;s_.on=false;}
        if(s_.on&&s_.w>0){const k=ud.k||1,hz=Math.hypot(s_.t.x-g.position.x,s_.t.z-g.position.z);lean=Math.max(lean,clamp((hz-.38*k)/.3,0,1)*(.22+(ud.leanBoost||0)*.3)*s_.w*(s_.t.y<1.35*k?1:.4)); /* a bend from the waist of at most ~15°: what is further away is reached by stepping closer, never by leaning the whole body over */}});
      // the lean comes from where the target is relative to the feet, not to the shoulder (which the lean itself moves): no feedback, no rocking
      ud.leanS=(ud.leanS||0)+(lean-(ud.leanS||0))*(1-Math.exp(-dt*6));leanTo(g,ud.leanS);
      A.forEach((s_,i)=>{if(s_.on&&s_.w>.004)ik2(g,i,s_.t,s_.w);});}
    function reachArm(g,tg,w){const ud=g.userData;if(!ud.armB){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.armB=['L','R'].map(s_=>[B(s_+'_UpperArm'),B(s_+'_Forearm'),B(s_+'_Hand')]);}
      const a=ud.armB[1];if(!a[0]||!a[1]||!a[2]||w<.01)return;aimBone(a[0],a[1],tg,w);aimBone(a[1],a[2],tg,w);}
    function handItem(g,show){const ud=g.userData,it=ud.itemM;if(!it)return;it.visible=show;const sd=ud.rch&&ud.rch.sd===0&&ud.lh?0:1,hb=sd?ud.rh:ud.lh;if(show&&hb){const pp=palmOf(g,sd);if(pp)_hv.set(pp[0],pp[1],pp[2]);else hb.getWorldPosition(_hv);g.worldToLocal(_hv);it.position.set(_hv.x,_hv.y-.03,_hv.z);}} // held in the palm, not inside the wrist
    function hands(g,dt){const ud=g.userData;let show=false;const RB=[null,null];
      // at the shelf, the way people shop: the eyes go along it, a hand takes one, it is turned to the light and read, then into the basket
      // (or kept in the hand when there is no basket) or put back, sometimes for the one next to it; nothing is ever in an empty hand
      if(ud.carry&&(ud.pay||ud.state==='away'||ud.state==='queue'&&ud.slot===0))ud.carry=false;
      if(ud.state==='browse'&&!ud.pushing&&!ud.isChild&&!ud.call&&!ud.ask&&!ud.chat&&!ud.room&&!ud.carry){const r=ud.rch||(ud.rch={t:0,next:rnd(.6,1.6),ph:'wait',sd:1});r.t+=dt;
        const tr=ud.tr||{},k=ud.k||1,fa=ud.shelfAng!=null?ud.shelfAng:(ud.faceAng!=null?ud.faceAng:g.rotation.y),fx=Math.sin(fa),fz=Math.cos(fa),gx=g.position.x,gz=g.position.z,left=ud.leftT!=null?ud.leftT:9,u=r.t-(r.t0||0);r.look=null;
        if(r.ph==='wait'){if(r.t>r.next&&left>3.4){r.ph='scan';r.t0=r.t;r.dur=rnd(.9,2.3)*(.7+.6*(tr.thr==null?.5:tr.thr));r.sw=Math.random()<.5?1:-1;}}
        else if(r.ph==='scan'){const c=Math.cos(u*rnd(1.9,2.3));r.look=[gx+fx*.6+fz*.5*r.sw*c,gz+fz*.6-fx*.5*r.sw*c];
          if(u>r.dur){r.ph='reach';r.t0=r.t;const h=(Math.random()<.6?rnd(1.05,1.45):rnd(.6,1.75))*k,lat=rnd(-.3,.3);r.tg=[gx+fx*.55+fz*lat,g.position.y+h,gz+fz*.55-fx*lat];r.sd=ud.basket&&ud.basket.visible&&!ud.basketL&&ud.lh?0:1;}}
        else if(r.ph==='reach'){const w=u/.75;RB[r.sd]={p:r.tg,w:tE(Math.min(1,w))*.95};r.look=[r.tg[0],r.tg[2]];if(w>=1){r.ph='inspect';r.t0=r.t;r.dur=rnd(1,2.6)*(.6+.8*(tr.thr==null?.5:tr.thr));}}
        else if(r.ph==='inspect'){const ch=[gx+fx*.3,g.position.y+1.12*k,gz+fz*.3];RB[r.sd]={p:ch,w:.95};show=true;r.look=[ch[0]+fx*.25,ch[2]+fz*.25];
          if(u>r.dur){r.t0=r.t;if(Math.random()<.55+.3*(tr.dec==null?.5:tr.dec)){if(ud.basket&&ud.basket.visible){r.ph='basket';}else if(ud.buyer){ud.carry=true;r.ph='wait';}else r.ph='back';}else r.ph='back';}}
        else if(r.ph==='basket'){ud.basket.getWorldPosition(_rt);const w=u/.7;RB[r.sd]={p:[_rt.x,_rt.y+.1,_rt.z],w:.95};show=w<.85;r.look=[_rt.x,_rt.z];if(w>=1){r.ph='wait';r.next=r.t+rnd(1,3.2);}}
        else if(r.ph==='back'){const w=u/.7;RB[r.sd]={p:r.tg,w:.95};show=w<.8;r.look=[r.tg[0],r.tg[2]];
          if(w>=1){if(Math.random()<.3+.35*(tr.thr==null?.5:tr.thr)&&left>3){r.ph='reach';r.t0=r.t;const d_=rnd(.12,.3)*(Math.random()<.5?1:-1);r.tg=[r.tg[0]+fz*d_,r.tg[1]+rnd(-.06,.06),r.tg[2]-fx*d_];}else{r.ph='wait';r.next=r.t+rnd(1,3.2);}}} // not that one: the one next to it
        ud.gazeP=r.look;}
      else if(ud.rch){ud.rch.ph='wait';ud.rch.t0=ud.rch.t;}
      if(ud.carry)show=true;
      if(ud.phoneM){const want=!!ud.clip&&ud.clip.indexOf('phone')===0&&!!ud.rh;ud.phHold=want?.4:Math.max(0,(ud.phHold||0)-dt);const on=want||(ud.phHold>0&&!!ud.rh);ud.phoneM.visible=on;if(!on)ud.phHand=null; /* kept in the hand while the arm blends out of the pose (0.3 s), never a phone pose with an empty hand */ // a phone really in the hand while looking at it
        if(on){const lh=ud.lh||ud.rh;ud.rh.getWorldPosition(_hv);lh.getWorldPosition(_rt);if(ud.phHand==null)ud.phHand=_rt.y>_hv.y&&lh===ud.lh?0:1;const hand=ud.phHand===0&&ud.lh?ud.lh:ud.rh,pp=palmOf(g,hand===ud.lh?0:1);if(pp)_hv.set(pp[0],pp[1],pp[2]);else hand.getWorldPosition(_hv);g.worldToLocal(_hv);ud.phoneM.position.set(_hv.x,_hv.y+.015,_hv.z); /* in the palm, in front of the fingers — at the wrist it was buried inside the hand */if(ud.headB){ud.headB.getWorldPosition(_rt);ud.phoneM.lookAt(_rt);}}}
      if(ud.ikReq){if(ud.ikReq[0])RB[0]=ud.ikReq[0];if(ud.ikReq[1])RB[1]=ud.ikReq[1];}
      armsApply(g,RB,dt);
      if(ud.cardM){ud.cardM.visible=!!ud.cardOn;if(ud.noteM)ud.noteM.visible=false;if(ud.cardOn){const p=palmOf(g,1);if(p){_hv.set(p[0],p[1],p[2]);g.worldToLocal(_hv);ud.cardM.position.set(_hv.x,_hv.y-.01,_hv.z);ud.cardM.rotation.set(-.4,0,0);}}}
      handItem(g,show);}
    // AnimationMixer only writes a bone when the clip's value changed since the last frame; in calm clips (waiting, standing) the spine and
    // arms hardly change, so whatever we added last frame would stay and the next addition would stack on it (a slowly growing lean that
    // suddenly snaps back = trembling). Each bone we touch is first returned to its clean animated pose, then modified, then remembered.
    function poseBones(g){const ud=g.userData;if(!ud.pB){armBones(g);if(ud.spB===undefined)leanTo(g,0);ud.pB=[].concat(...(ud.armB||[]).map(a=>[a[0],a[1]]),ud.spB||[],...fingers(g).map(f=>f.map(x=>x[0]))).filter(Boolean);}return ud.pB;}
    // fingers (Biped: Finger0 = thumb, 1–4, three joints each) — a holding hand closes round what it holds instead of hanging it on a stiff palm
    function fingers(g){const ud=g.userData;if(!ud.fgB){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.fgB=['L','R'].map(s_=>{const L=[];for(let f=0;f<5;f++)['','1','2'].forEach((j,i)=>{const b=B(s_+'_Finger'+f+j);if(b)L.push([b,f,i]);});return L;});}return ud.fgB;}
    const _fq=new T.Quaternion(),_fz=new T.Vector3(0,0,1),_fy=new T.Vector3(0,1,0);
    function gripFingers(g,dt){const ud=g.userData,G=ud.gripW||(ud.gripW=[0,0]),tg=ud.gripT||[0,0];
      for(let s_=0;s_<2;s_++){const t=tg[s_]||0;G[s_]+=(t-G[s_])*(1-Math.exp(-dt*(t>G[s_]?7:4)));if(G[s_]<.01)continue; /* closes in ~0.3 s, opens a little slower */
        fingers(g)[s_].forEach(([b,f,i])=>{const a=f===0?[.15,.22,.2][i]:[.95,1.05,.75][i]*(1-.06*(f-1));_fq.setFromAxisAngle(f===0?_fy:_fz,-a*G[s_]*(f===0?(s_?1:-1):1));b.quaternion.multiply(_fq);});}}
    function poseIn(g){poseBones(g).forEach(b=>{const d=b.userData;if(d.qo&&b.quaternion.equals(d.qo))b.quaternion.copy(d.qi);(d.qi||(d.qi=new T.Quaternion())).copy(b.quaternion);});}
    function poseOut(g){poseBones(g).forEach(b=>{const d=b.userData;(d.qo||(d.qo=new T.Quaternion())).copy(b.quaternion);});}
    // feet on the floor: every model learns its own ankle height while standing; while walking the body is eased up or down so the lower
    // foot keeps that height (a clip or a skeleton that rides a little high or low no longer floats or sinks)
    const _fa=new T.Vector3();
    function ground(g,dt){const ud=g.userData,m=g.children[0];if(!m||ud.isChild||ud.state==='restock')return;if(ud.ftB===undefined){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);ud.ftB=[B('L_Foot'),B('R_Foot')].filter(Boolean);ud.gBase=m.position.y;ud.ftRef=.09*(ud.k||1);}
      if(ud.ftB.length<2)return;if(ud.dz&&ud.dz.lift>0){m.position.y=ud.gBase+(ud.gOff||0);return;} /* on the ladder: his feet are on the step, not on the floor */ud.ftB[0].getWorldPosition(_fa);let y=_fa.y;ud.ftB[1].getWorldPosition(_fa);y=Math.min(y,_fa.y);const fl=floorY(g.position.x,g.position.z),off=ud.gOff||0,walk=/walk/.test(ud.clip||''),k=1-Math.exp(-dt*4);
      if(!walk){const kk=ud.k||1;ud.ftRef=clamp(ud.ftRef+((y-off-fl)-ud.ftRef)*k*.5,.05*kk,.13*kk);ud.gOff=off*(1-k);} /* a real ankle height: the reference can never creep into the floor */else ud.gOff=clamp(off-(y-fl-ud.ftRef)*k,-.22,.06);
      m.position.y=ud.gBase+ud.gOff;}
    function gltfHeads(dt){people.concat(extras).forEach(g=>{const ud=g.userData;if(!ud.gltfP||!g.visible||ud.culledFar){ud.hShow=null;ud.nShow=null;return;}ground(g,dt);poseIn(g);if(ud.ddd)vzPose(g,dt);if(ud.pushing&&!ud.pay)pushArms(g);else hands(g,dt);{const gt=ud.gripT||(ud.gripT=[0,0]),tt=ud.tillGrip||[0,0];gt[0]=tt[0]||((ud.basket&&ud.basket.visible&&ud.basketL)||(ud.phoneM&&ud.phoneM.visible&&ud.phHand===0)?1:0);gt[1]=tt[1]||((ud.bag&&ud.bag.visible)||(ud.basket&&ud.basket.visible&&!ud.basketL)||ud.cardOn||(ud.phoneM&&ud.phoneM.visible&&ud.phHand===1)||(ud.itemM&&ud.itemM.visible&&!(ud.rch&&ud.rch.sd===0))||ud.pushing?1:0);if(ud.itemM&&ud.itemM.visible&&ud.rch&&ud.rch.sd===0)gt[0]=1;ud.tillGrip=null;gripFingers(g,dt);hangProps(g,dt);}poseOut(g);/* at the till the cart is let go of: both hands work */if(ud.headB===undefined)ud.headB=g.getObjectByName('Bip01_Head')||g.getObjectByName('Bip02_Head')||null;const hb=ud.headB;if(!hb)return;
      // a living face (the models carry smile, squint, blink, jaw, oh, brows): a friendly resting expression of their own, natural blinks,
      // now and then a real smile with the eyes, a big one at the till and when taking the bag, the mouth moving while talking; near faces only
      if(ud.face&&g.position.distanceToSquared(camera.position)<110){const f=ud.fx||(ud.fx={t:0,mood:ud.cashier?1.7:1.3+Math.random()*.4,blink:1+Math.random()*3,grin:3+Math.random()*9,gT:0,sm:0,br:0});f.t+=dt;
        let bl=0;const tb=f.t-f.blink;if(tb>0){bl=tb<.07?tb/.07:(tb<.17?1-(tb-.07)/.1:0);if(tb>=.17)f.blink=f.t+(Math.random()<.18?.25:2+Math.random()*4.5);}
        if(f.t>f.grin){f.gT=1.4+Math.random()*1.6;f.grin=f.t+6+Math.random()*12;}if(f.gT>0)f.gT-=dt;
        const atTill=ud.cashier&&qOcc&&qOcc[0],happy=ud.phase==='bag'||!!ud.pay||atTill||f.gT>0,talk=!!ud.clip&&ud.clip.indexOf('talk')===0;
        const smT=happy?2.2:f.mood;f.sm+=(smT-f.sm)*Math.min(1,dt*(smT>f.sm?4:1.6));f.br+=((happy?.32:0)-f.br)*Math.min(1,dt*3);
        const jaw=talk?Math.max(0,.2+.22*Math.sin(f.t*10.5)*Math.sin(f.t*3.1)):0,oh=talk?.16*Math.max(0,Math.sin(f.t*7.7+1)):0;
        ud.face('smile',f.sm);ud.face('squint',f.sm*.38);ud.face('blink',bl);ud.face('jaw',jaw);ud.face('oh',oh);ud.face('brows',f.br);}
      // the turn is always applied to the animation's own head pose, never on top of last frame's turn: when the clip leaves the head alone
      // (or the mixer skipped a frame) the old offset is taken off first, so a head can never keep spinning
      if(ud.hQ&&hb.quaternion.equals(ud.hQ))hb.quaternion.copy(ud.hQ0);ud.hQ=null;
      let yaw=0,pitch=0;const LP=ud.lookAtP||ud.gazeP;if(LP){let a=Math.atan2(LP[0]-g.position.x,LP[1]-g.position.z)-g.rotation.y;a=((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;yaw=Math.max(-.9,Math.min(.9,a))*Math.max(0,Math.min(1,1-(Math.abs(a)-1.35)/.45));if(ud.isChild)pitch=-.35;} /* what is behind is not looked at: the head comes back to the front, never swinging from one shoulder to the other */
      if(ud.elder&&ud.state==='browse')pitch+=.15;if(ud.phase==='bag'){ud.nodT=(ud.nodT||0)+dt;pitch+=.18*Math.max(0,Math.sin(ud.nodT*6));}else ud.nodT=0;
      {const mv=dt*2.1,e=(v,t)=>{const d=(t-v)*Math.min(1,dt*3.5);return v+Math.max(-mv,Math.min(mv,d));};ud.hy=e(ud.hy||0,yaw);ud.hp=e(ud.hp||0,pitch);} /* a natural head turn: eased and never faster than ~120°/s */(ud.hQ0||(ud.hQ0=new T.Quaternion())).copy(hb.quaternion);
      if(Math.abs(ud.hy)>=.01||Math.abs(ud.hp)>=.01){hb.parent.getWorldQuaternion(_q).invert();_ax.set(0,1,0).applyQuaternion(_q);hb.rotateOnAxis(_ax,ud.hy);_ax.set(Math.cos(g.rotation.y),0,-Math.sin(g.rotation.y)).applyQuaternion(_q);hb.rotateOnAxis(_ax,ud.hp);}
      {const nk=ud.neckB!==undefined?ud.neckB:(ud.neckB=g.getObjectByName('Bip01_Neck')||g.getObjectByName('Bip02_Neck')||null);if(nk){if(ud.nShow){const an=ud.nShow.angleTo(nk.quaternion),mn=dt*5;if(an>mn){ud.nShow.slerp(nk.quaternion,mn/an);nk.quaternion.copy(ud.nShow);}else ud.nShow.copy(nk.quaternion);}else ud.nShow=nk.quaternion.clone();}}
      // the head never jumps: a clip that loops or blends with a seam is caught here and eased at most ~7 rad/s
      if(ud.hShow){const ang=ud.hShow.angleTo(hb.quaternion),mx=dt*7;if(ang>mx){ud.hShow.slerp(hb.quaternion,mx/ang);hb.quaternion.copy(ud.hShow);}else ud.hShow.copy(hb.quaternion);}else ud.hShow=hb.quaternion.clone();
      ud.hQ=(ud.hQb||(ud.hQb=new T.Quaternion())).copy(hb.quaternion);});}
    // swap a procedural figure for a real model in place (used after the models arrive; re-entries do it automatically)
    function upgrade(i){const old=people[i],ud=old.userData;if(ud.gltfP||!GL())return null;const spec={fem:!!ud.fem,elder:!!ud.elder,isChild:!!ud.isChild,h:ud.isChild?1.18:1.6+Math.random()*.3,phone:!!ud.phone};const g=gltfPerson(spec);if(!g)return null;const nu=g.userData;
      ['state','visit','legI','path','pi','until','faceAng','slot','hasBasket','buyer','items','trail','ang','sp','follow','partner','gap','turning','pay','phase','placed','ph','camAng','stroller','pushing','fallback','qT'].forEach(k=>{if(ud[k]!==undefined)nu[k]=ud[k];});
      g.position.copy(old.position);g.rotation.copy(old.rotation);g.visible=old.visible;room.remove(old);old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}else if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();});
      qOcc.forEach((q,j)=>{if(q===old)qOcc[j]=g;});people[i]=g;room.add(g);if(camSub===old)camSub=g;return g;}
    // the cashier wears the chain's uniform over her dark suit: a red АВАНТИ vest with a white name badge, so she reads as the seller, not as a guard
    let vestTex=null;const VEST=0xc41f2b;
    function dressCashier(g){const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);const sp=B('Spine2')||B('Spine1')||B('Spine'),nk=B('Neck'),pv=B('Pelvis'),la=B('L_UpperArm'),ra=B('R_UpperArm');if(!sp||!nk||!pv)return;
      if(g.userData.mixer)g.userData.mixer.update(0);g.updateMatrixWorld(true);const L=o=>g.worldToLocal(o.getWorldPosition(new T.Vector3()));const pn=L(nk),pp=L(pv),ps=L(sp);
      const k=g.userData.k||1,sh=la&&ra?L(la).distanceTo(L(ra)):.34*k,rx=Math.max(.14,sh*.5),rz=rx*.82,top=pn.y-.07,bot=pp.y-.1,h=top-bot;
      if(!vestTex){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle='#c41f2b';x.fillRect(0,0,512,256);
        x.fillStyle='#9e1720';x.fillRect(0,0,512,12);x.fillRect(0,244,512,12);x.fillRect(252,0,8,256); // hems and the front zip
        x.fillStyle='#fff';x.font='bold 30px Arial, sans-serif';x.textAlign='center';x.fillText('АВАНТИ',256,78);
        x.fillStyle='#fff';x.fillRect(276,104,62,26);x.fillStyle='#c41f2b';x.font='bold 15px Arial, sans-serif';x.fillText('КАСА',307,123);
        vestTex=new T.CanvasTexture(c);vestTex.encoding=T.sRGBEncoding;vestTex.anisotropy=4;}
      // a thin shell hugging the torso: front of the texture (u = .5) faces the way she looks
      const geo=new T.CylinderGeometry(rx,rx*1.06,h,28,1,true,-Math.PI,Math.PI*2);geo.scale(1,1,rz/rx);
      const vest=new T.Mesh(geo,new T.MeshStandardMaterial({map:vestTex,roughness:.85,side:T.DoubleSide}));vest.castShadow=true;vest.position.set(ps.x,(top+bot)/2,ps.z+.03);
      g.add(vest);g.updateMatrixWorld(true);sp.attach(vest);g.userData.vest=vest;}
    function upgradeCashier(){const i=extras.findIndex(x=>x.userData.cashier&&!x.userData.gltfP);if(i<0||!GL())return;const old=extras[i];const g=gltfPerson({staff:true,h:1.72});if(!g)return;dressCashier(g);g.position.copy(old.position);g.rotation.copy(old.rotation);const nu=g.userData;nu.state='queue';nu.blend=0;nu.ph=old.userData.ph;nu.cashier=true;if(nu.basket)nu.basket.visible=false;room.remove(old);old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}});extras[i]=g;room.add(g);}
    let upBusy=false;
    document.addEventListener('kl-gltf-model',e=>{if(!room||!people.length||upBusy)return;if(!(e.detail.count>=8||window.KL_GLTF&&KL_GLTF.has('staff')&&e.detail.count>=5))return;upBusy=true;people.forEach(p=>{p.userData.noUp=false;});
      const step=()=>{const i=people.findIndex(p=>!p.userData.gltfP&&!p.userData.noUp);if(i<0){try{upgradeCashier();}catch(err){}upBusy=false;kick();return;}try{if(!upgrade(i))people[i].userData.noUp=true;}catch(err){people[i].userData.noUp=true;console.warn('upgrade',err);}kick();requestAnimationFrame(step);};requestAnimationFrame(step);});
    window.__upgradeAll=()=>{let n=0;const err=[];people.forEach((p,i)=>{try{if(upgrade(i))n++;else err.push([i,'null',!!p.userData.gltfP,p.userData.isChild,p.userData.elder,p.userData.fem]);}catch(e){err.push([i,String(e).slice(0,120)]);}});window.__upErr=err;return n;};
    // ---- Венци, the KAYA LUX service man: the real man (his face from his photo on one of the models), a black shirt with the gold
    // KL monogram and KAYA LUX across the back, jeans. He comes in with a folding step ladder and a shoulder bag of aroma oil bottles,
    // sets the ladder under each diffuser, climbs, opens the unit, takes out the empty bottle, puts in a full one, closes it, checks
    // the schedule on his phone (Bluetooth), lets it puff once, climbs down, folds the ladder and goes on to the next one ----
    const VZ={g:null,tex:null,texN:0,geo:null,nextTry:0};
    const _zA=new T.Vector3(),_zB=new T.Vector3(),_zC=new T.Vector3(),_zD=new T.Vector3(),_zQ=new T.Quaternion(),_zQ2=new T.Quaternion(),_zM=new T.Matrix4(),_zM2=new T.Matrix4(),_zS=new T.Vector3(),_zE=new T.Euler();
    function vzTex(){if(VZ.tex)return VZ.tex;const L=new T.TextureLoader(),mk=f=>{const t=L.load('assets/models/'+f,()=>{VZ.texN++;});t.flipY=false;t.encoding=T.sRGBEncoding;t.anisotropy=4;return t;};VZ.tex={head:mk('venci-head.jpg'),body:mk('venci-kl-body.jpg')};return VZ.tex;}
    // the aroma oil bottle these units take (cold-air nebulising diffusers): a round clear bottle with a short screw neck, screwed
    // straight up into the atomiser head at the top of the unit, a dip tube going down to its bottom; the oil level shows through it,
    // the KAYA LUX label round the body. Plug'n'Go: ~120 ml (4.4 cm across); Prime Lux: ~500 ml (8 cm). Origin: the bottle's middle
    function oilBottle(R,H){if(!M.oilG){M.oilG=new T.MeshStandardMaterial({color:0xf4f1ea,roughness:.06,metalness:0,transparent:true,opacity:.3,depthWrite:false,side:T.DoubleSide});
        M.oil=new T.MeshStandardMaterial({color:0xc0872a,roughness:.2,metalness:0,transparent:true,opacity:.9});
        M.oilL=new T.MeshStandardMaterial({map:tex2(256,64,(x,w,h)=>{x.fillStyle='#f3ece0';x.fillRect(0,0,w,h);x.fillStyle='#c9a656';x.fillRect(0,0,w,5);x.fillRect(0,h-5,w,5);x.textAlign='center';x.fillStyle='#1c1b1a';x.font='600 21px Inter, Arial';x.fillText('KAYA LUX',w*.25,h*.55);x.fillStyle='#8a6d2e';x.font='500 10px Inter, Arial';x.fillText('AROMA OIL',w*.25,h*.82);}),roughness:.55});}
      const bH=H*.72,sh=H*.1,nR=R*.52,nH=H-bH-sh,y0=-H/2,g=new T.Group();
      const glass=new T.Mesh(new T.LatheGeometry([[0,0],[R*.9,0],[R,R*.14],[R,bH],[R*.72,bH+sh*.6],[nR,bH+sh],[nR,H]].map(q=>new T.Vector2(q[0],q[1])),20).translate(0,y0,0),M.oilG);glass.renderOrder=3;
      const oil=new T.Mesh(new T.CylinderGeometry(R*.9,R*.9,1,18).translate(0,.5,0),M.oil);oil.position.y=y0+R*.05;oil.userData.max=bH-R*.1;oil.scale.y=oil.userData.max*.92;
      const lbl=new T.Mesh(new T.CylinderGeometry(R*1.012,R*1.012,bH*.46,24,1,true).translate(0,y0+bH*.42,0),M.oilL);
      const neck=new T.Mesh(mergeColored([[new T.CylinderGeometry(nR*1.32,nR*1.32,nH*.12,18).translate(0,y0+bH+sh+nH*.06,0),'#d9d4c8']].concat([1,2,3].map(i=>[new T.TorusGeometry(nR*1.02,nR*.07,4,16).rotateX(Math.PI/2).translate(0,y0+bH+sh+nH*(.25+i*.17),0),'#e6e1d6']))),M.vc2);
      g.add(oil,glass,lbl,neck);g.userData.oil=oil;g.userData.H=H;return g;}
    function oilLevel(b,f){const o=b.userData.oil;o.scale.y=Math.max(.001,o.userData.max*f);o.visible=f>.01;}
    function vzKit(){if(VZ.geo)return;const C=(r0,r1,h,s)=>new T.CylinderGeometry(r0,r1,h,s||10),at=(g,x,y,z)=>g.translate(x,y,z);
      const AL='#c9cdd2',ST='#9aa0a6',BL='#151517',GD='#c9a656';
      // the step ladder: two halves hinged at the top (steps on the front half), 1.25 m rails
      // two of them: a 1.6 m one (4 steps) for most diffusers, a 2.2 m one (6 steps) for those mounted high over shelving
      const ladG=LL=>{const front=[],rear=[];for(const s of [-1,1]){front.push([at(new T.BoxGeometry(.032,LL,.024),s*.22,-LL/2,0),AL]);rear.push([at(new T.BoxGeometry(.028,LL,.02),s*.21,-LL/2,0),AL]);front.push([at(new T.BoxGeometry(.04,.03,.04),s*.22,-LL+.01,0),'#222']);rear.push([at(new T.BoxGeometry(.04,.03,.04),s*.21,-LL+.01,0),'#222']);}
        for(let y=.35;y<=LL-.34;y+=.3)front.push([at(new T.BoxGeometry(.44,.025,.085),0,-LL+y,.03),ST]);front.push([at(new T.BoxGeometry(.5,.04,.2),0,.0,-.05),'#2a2b2e']);front.push([at(new T.BoxGeometry(.47,.03,.06),0,.0,-.01),'#2a2b2e']);return [mergeColored(front),mergeColored(rear)];};
      const [lf1,lr1]=ladG(1.6),[lf2,lr2]=ladG(2.2);
      VZ.geo={front:lf1,rear:lr1,front2:lf2,rear2:lr2,
        bag:mergeColored([[roundedBox(.24,.2,.07,.02),BL],[at(new T.BoxGeometry(.25,.035,.072),0,.07,0),'#26262a']]),
        phone:mergeColored([[new T.BoxGeometry(.072,.15,.009),'#141416'],[at(new T.BoxGeometry(.064,.135,.001),0,0,.005),'#9fd0ff']]),
        can:mergeColored([[at(roundedBox(.11,.19,.075,.012),0,.095,0),'#ece8df'],[at(new T.BoxGeometry(.045,.022,.024),0,.2,-.018),'#ece8df'],[at(C(.011,.013,.026,10),0,.205,.024),GD],[at(new T.BoxGeometry(.07,.05,.002),0,.1,.047),'#7a4a12']]), /* 1 l of aroma oil: white canister, gold spout cap, amber label */
        stream:new T.CylinderGeometry(.0028,.0022,1,6).translate(0,-.5,0)};
      Object.values(VZ.geo).forEach(g=>GEOSET.add(g));
      const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const im=new Image();const tt_=new T.CanvasTexture(c);tt_.encoding=T.sRGBEncoding;
      im.onload=()=>{x.clearRect(0,0,128,128);x.drawImage(im,128/2-36,8,72,96);x.fillStyle='#c9a656';x.font='600 13px Inter, Arial';x.textAlign='center';x.fillText('KAYA LUX',64,122);tt_.needsUpdate=true;};im.src='assets/img/logo-mark.png';
      VZ.mat={decal:new T.MeshStandardMaterial({map:tt_,transparent:true,roughness:.5,depthWrite:false})};M.vz_decal=VZ.mat.decal;VZ.geo.decal=new T.PlaneGeometry(.12,.12);GEOSET.add(VZ.geo.decal);}
    function vzBone(b,obj,wp,wq){b.updateMatrixWorld(true);_zM.compose(wp,wq||_zQ.set(0,0,0,1),_zS.set(1,1,1));_zM2.copy(b.matrixWorld).invert().multiply(_zM);_zM2.decompose(obj.position,obj.quaternion,obj.scale);b.add(obj);return obj;}
    function vzSpawn(T_){const G=GL();if(!G||!nav||!nav.entry||VZ.texN<2)return false;
      const g=gltfPerson({h:1.78,file:'male_adult_08.glb',fresh:true});if(!g||g.userData.file!=='male_adult_08.glb'){if(g&&window.KL_GLTF)KL_GLTF.release(g);return false;}
      vzKit();const ud=g.userData,VT=vzTex();ud.ddd=true;ud.noPool=true;ud.ownMats=[];ud.sp=.95;ud.phone=false;if(ud.basket)ud.basket.visible=false;if(ud.bag)ud.bag.visible=false;
      g.traverse(o=>{if(!o.isSkinnedMesh)return;const om=o.material,m=om.clone(),n=om.name||'';const sw=t=>{if(om.map){t.offset.copy(om.map.offset);t.repeat.copy(om.map.repeat);t.rotation=om.map.rotation;}m.map=t;m.normalMap=null;};
        if(/head/.test(n))sw(VT.head);else if(/body/.test(n))sw(VT.body);else if(/opacity/.test(n))m.color=new T.Color(0x5e5852);m.needsUpdate=true;o.material=m;ud.ownMats.push(m);});
      g.position.set(0,0,0);g.rotation.set(0,0,0);g.updateMatrixWorld(true);const B=n=>g.getObjectByName('Bip01_'+n),P=n=>B(n).getWorldPosition(new T.Vector3());const pv=P('Pelvis');
      const legs=['L','R'].map(s_=>[B(s_+'_Thigh'),B(s_+'_Calf'),B(s_+'_Foot')]);poseBones(g);ud.pB=ud.pB.concat(...legs.map(l=>l.slice(0,3))).filter(Boolean);
      // the shoulder bag with the oil bottles, on his left hip, the gold KL on its flap
      const bag=vzBone(B('Pelvis'),new T.Mesh(VZ.geo.bag,M.vc2),new T.Vector3(.2,pv.y-.02,.02),new T.Quaternion().setFromEuler(_zE.set(0,Math.PI/2,0)));const dec=new T.Mesh(VZ.geo.decal,VZ.mat.decal);dec.position.set(0,0,.037);dec.scale.setScalar(.8);bag.add(dec);
      const lad=new T.Group(),lf=new T.Mesh(VZ.geo.front,M.vc2),lr=new T.Mesh(VZ.geo.rear,M.vc2);lf.castShadow=lr.castShadow=true;lad.add(lf,lr);
      const btl=new T.Group(),btS=oilBottle(.025,.118),btL=oilBottle(.038,.16);const cap=new T.Mesh(mergeColored([[new T.CylinderGeometry(1,1,1,16),'#151517']]),M.vc2);cap.visible=false;room.add(cap);btl.add(btS,btL);btl.userData.S=btS;btl.userData.L=btL;btl.visible=false; /* the diffuser's own bottle, in the size of the unit he serves */const ph=new T.Mesh(VZ.geo.phone,M.vc2);ph.visible=false;const can=new T.Mesh(VZ.geo.can,M.vc2);can.visible=false;const strm=new T.Mesh(VZ.geo.stream,VZ.streamM||(VZ.streamM=new T.MeshStandardMaterial({color:0xb5791d,roughness:.25,metalness:0,transparent:true,opacity:.85})));strm.visible=false;room.add(lad,btl,ph,can,strm);
      const tag=document.createElement('div');tag.className='vztag';tag.innerHTML='<b>Оператор</b><i>KAYA LUX · сервиз</i>';tag.hidden=true;ovl.appendChild(tag);const tagV=new T.Vector3();overlay.push({el:tag,v:tagV,kind:'vz'});
      ud.dz={legs,feet:null,tag,tagV,bag,lad,lf,lr,btl,cap,can,strm,ph,ladTh:0,ladOn:false,ladP:[0,0,0],ladYaw:0,lift:0,holdB:null,phOn:false,q:[],task:null,ph_:'away',t:0,until:T_+rnd(2,6)};
      g.visible=false;ud.state='away';g.position.set(nav.entry[0],0,nav.entry[1]);room.add(g);people.push(g);VZ.g=g;return true;}
    function vzLeg(g,l,tg){const [th,ca,ft]=l;th.getWorldPosition(_S0);ca.getWorldPosition(_E0);ft.getWorldPosition(_W0);const l1=_S0.distanceTo(_E0),l2=_E0.distanceTo(_W0);
      _Dv.copy(tg).sub(_S0);let d=_Dv.length();if(d<1e-4)return;_Dv.multiplyScalar(1/d);d=Math.min(Math.max(d,Math.abs(l1-l2)+.02),(l1+l2)*.995);
      const ry=g.rotation.y;_pl.set(Math.sin(ry),0,Math.cos(ry));_pl.addScaledVector(_Dv,-_pl.dot(_Dv));if(_pl.lengthSq()<1e-6)return;_pl.normalize();
      const x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x));_Ed.copy(_S0).addScaledVector(_Dv,x).addScaledVector(_pl,h);_Wd.copy(_S0).addScaledVector(_Dv,d);
      _zS.set(Math.cos(ry),0,-Math.sin(ry)); /* the knee is a hinge: both bones turn only about his left–right axis, so the knees go forward, never out */
      const hinge=(bn,ch,tg)=>{bn.getWorldPosition(_zA);ch.getWorldPosition(_zB);_zB.sub(_zA);_zC.copy(tg).sub(_zA);_zB.addScaledVector(_zS,-_zB.dot(_zS));_zC.addScaledVector(_zS,-_zC.dot(_zS));
        const an=Math.atan2(_zD.crossVectors(_zB,_zC).dot(_zS),_zB.dot(_zC));_zQ.setFromAxisAngle(_zS,an);bn.getWorldQuaternion(_qb);_qb.premultiply(_zQ);bn.parent.getWorldQuaternion(_q).invert();bn.quaternion.copy(_q.multiply(_qb));bn.updateMatrixWorld(true);};
      ft.getWorldQuaternion(_zQ2);hinge(th,ca,_Ed);hinge(ca,ft,_Wd);ft.parent.getWorldQuaternion(_zQ).invert();ft.quaternion.copy(_zQ.multiply(_zQ2));ft.updateMatrixWorld(true);}
    // on the ladder each foot is placed on its step (or the floor) by the leg IK, the body leaning a little into the ladder
    function vzPose(g,dt){const dz=g.userData.dz;if(!dz||!dz.feet)return;dz.legs.forEach((l,i)=>{const f=dz.feet[i];if(l[2]&&f)vzLeg(g,l,_zA.set(f[0],f[1],f[2]).clone());});if(dz.leanL)leanTo(g,dz.leanL);}
    // the specialist's footprint on the floor while he works: the open ladder (both pairs of feet and the space under it) and himself on it.
    // Nobody walks through it: routes go round it, steering keeps clear of it, and whoever watches through the camera steps round it too
    function vzFP(g){const F=[],dz=g&&g.visible&&g.userData.dz;let k='';
      if(dz&&dz.ladOn&&dz.ladP){const LL=(dz.task&&dz.task.LL)||1.6,th=Math.max(.12,dz.ladTh||.22),s=LL*Math.sin(th),ux=Math.sin(dz.ladYaw),uz=Math.cos(dz.ladYaw),h=LL*Math.cos(th)+.1;
        F.push([dz.ladP[0],dz.ladP[2],.3,h],[dz.ladP[0]+ux*s,dz.ladP[2]+uz*s,.28,h],[dz.ladP[0]-ux*s,dz.ladP[2]-uz*s,.28,h],[g.position.x,g.position.z,.3,1.9+(dz.lift||0)]);k=dz.ladP[0].toFixed(2)+','+dz.ladP[2].toFixed(2);}
      if(dz&&dz.lad&&dz.lad.visible&&!dz.ladOn){const bb=(VZ._bb||(VZ._bb=new T.Box3())).setFromObject(dz.lad),sx=bb.max.x-bb.min.x,sz=bb.max.z-bb.min.z,L=Math.max(sx,sz);if(L>.7&&bb.min.y<1.6){const cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2,ax=sx>=sz;for(const t of [-.5,0,.5]){const o=t*(L-.3);F.push([ax?cx+o:cx,ax?cz:cz+o,.24,1.8]);}}} /* the ladder he carries is something to keep out of too, not only the one he has set up */
      if(k!==VZ.fpK){VZ.fpK=k;VZ.fpTok=(VZ.fpTok||0)+1;}VZ.fp=F.length?F:null;}
    function inFP(x,z,pad){const F=VZ.fp;if(!F)return false;pad=pad||0;for(const c of F)if(Math.hypot(x-c[0],z-c[1])<c[2]+pad)return true;return false;}
    function segFP(a,b,pad){const F=VZ.fp;if(!F)return false;const dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz||1e-6;for(const c of F){let t=((c[0]-a[0])*dx+(c[1]-a[1])*dz)/L2;t=t<0?0:t>1?1:t;if(Math.hypot(a[0]+dx*t-c[0],a[1]+dz*t-c[1])<c[2]+pad)return true;}return false;}
    // the watcher is a person too: in the tour, the free views and behind a shopper the camera steps round the people and round the specialist's
    // ladder or case instead of passing through them (eased, at most 0.9 m, never into a fixture); where it looks is left as it was
    const _ca=new T.Vector3(),_cw=new T.Vector3(),_cl=new T.Vector3();let _clOk=false;
    function camAvoid(dt){const cp=camera.position;_cw.set(0,0,0);if(window.__camLock){_ca.set(0,0,0);_clOk=false;return null;}
      let vx=0,vz=0;if(_clOk&&dt>0){vx=(cp.x-_cl.x)/dt;vz=(cp.z-_cl.z)/dt;if(Math.hypot(vx,vz)>9)vx=vz=0;}_cl.copy(cp);_clOk=true; // which way it is going: it looks ahead along its way, as a walker does
      if(view.name!=='ddd'&&view.name!=='fp'&&cp.y<2.4&&Math.abs(cp.x)<S.hw+.5&&Math.abs(cp.z)<S.hd+2.2){
        const sp=Math.hypot(vx,vz),mv=sp>.15,ux=mv?vx/sp:0,uz=mv?vz/sp:0,Lk=mv?clamp(sp*1.2,.5,2.4):0;
        const push=(cx,cz,r)=>{let qx=cp.x,qz=cp.z,t=0;if(mv){t=clamp((cx-cp.x)*ux+(cz-cp.z)*uz,0,Lk);qx+=ux*t;qz+=uz*t;}
          let dx=qx-cx,dz=qz-cz,L=Math.hypot(dx,dz);if(L>=r)return;if(L<1e-3){if(mv){dx=-uz;dz=ux;}else{dx=1;dz=0;}L=1;}
          const w=(r-Math.hypot(qx-cx,qz-cz))*(mv?1-.2*t/Lk:1);_cw.x+=dx/L*w;_cw.z+=dz/L*w;}; /* someone ahead on the way: the camera bends round them in good time, on the open side */
        if(cp.y<1.95)for(const p of people.concat(extras)){if(!p.visible||p.userData.cashier||(view.name==='walk'&&p===camSub))continue;push(p.position.x,p.position.z,.62);}
        if(VZ.fp)for(const c of VZ.fp)if(cp.y<c[3]+.35)push(c[0],c[1],c[2]+.45);
        const L=Math.hypot(_cw.x,_cw.z);if(L>.9)_cw.multiplyScalar(.9/L);
        if(Math.abs(cp.z-S.hd)<.8&&Math.abs(cp.x-S.door.x)<S.door.w/2+.5){const lo=S.door.x-S.door.w/2+.22,hi=S.door.x+S.door.w/2-.22;_cw.x=clamp(cp.x+_cw.x,lo,hi)-cp.x;}} // through the door: round them, but within the opening
      _ca.lerp(_cw,Math.min(1,dt*(_cw.lengthSq()>_ca.lengthSq()?10:3)));if(_ca.lengthSq()<1e-6)return null; // quick to step aside, slow to come back
      if(nav&&cp.z<S.hd-.3){const nx=cp.x+_ca.x,nz=cp.z+_ca.z,c=nav.toCell(nx,nz);if(Math.abs(nx)<S.hw&&Math.abs(nz)<S.hd&&!nav.free(nav.G0,c[0],c[1]))_ca.multiplyScalar(.5);}
      cp.add(_ca);return _ca;}
    function vzClear(){VZ.fp=null;if(VZ.sub){VZ.sub.classList.remove('on');VZ.subShown=null;}if(VZ.g){(VZ.g.userData.ownMats||[]).forEach(m=>m.dispose());}VZ.g=null;}
    const vzFree=(x,z,r)=>x>-S.hw+r&&x<S.hw-r&&z>-S.hd+r&&z<S.hd-r&&!OBS.some(o=>x+r>o[0]&&x-r<o[1]&&z+r>o[2]&&z-r<o[3]);
    const vzWalk=(x,z)=>{if(!nav)return true;const c=nav.toCell(x,z);return nav.free(nav.G35,c[0],c[1]);}; // a spot the crowd's routes can reach and leave (fixtures +35 cm)
    // one stop per diffuser: the ladder under it (or a little to the side when a fixture stands below), nearest first from the door
    // reality rule for the ladder: he works from a step only if his working hand really reaches the bottle (arm about 0.66 m from the
    // shoulder) with nothing (a shelf, a fridge, a sign) between his shoulder and the diffuser. The ladder stands whole on free floor, its back
    // legs too, so over shelving it stands in front of it. He leans his chest in, one hand on the rail: up to about 25 cm, or up to about
    // 42 cm when his hips are above the shelf top and he can rest on it, as a technician does. For a diffuser high over shelving he brings
    // the 2.2 m ladder. If nothing reaches, that diffuser waits for another visit: an arm never goes through a shelf, a bottle never jumps.
    function vzReach(u,F,k,d,LL,A,tw){const th=.22,st=Math.sin(th),ct=Math.cos(th),dd=A||d,bo=(LL-.05-.3*k)*st+.1,bx=F[0]+dd[0]*bo,bz=F[1]+dd[2]*bo,
        ph_=Math.atan2(-dd[0],-dd[2])+(tw||0),fx_=Math.sin(ph_),fz_=Math.cos(ph_), /* where he faces at the top: the ladder, or turned from it toward the diffuser */
        sx=bx-fz_*.17+fx_*.1,sz=bz+fx_*.17+fz_*.1,sy=(.05+.3*k)*ct+1.4,uf=[u.p[0]+d[0]*(u.bd||.07)*.5,u.p[1]-(u.bh||.26)*.05,u.p[2]+d[2]*(u.bd||.07)*.5];
      const hx=uf[0]-sx,hz=uf[2]-sz,hL=Math.hypot(hx,hz)||1,d0=Math.hypot(hx,uf[1]-sy,hz),rc=VZ.rcR||(VZ.rcR=new T.Raycaster());
      if(d0>1.15)return null;
      _zC.set(u.p[0]+d[0]*.3,u.p[1]-(u.bh||.26)*.6,u.p[2]+d[2]*.3);_zD.set(0,-1,0);rc.set(_zC,_zD);rc.near=0;rc.far=3; /* the shelf top under the diffuser (from just below it, not from above the ceiling) */const hd_=rc.intersectObjects(losMeshes(),false),top=hd_.length?hd_[0].point.y:0,hip=(.05+.3*k)*ct+.95,rest=top>.5&&hip>top+.05;
      const L=Math.max(0,d0-.66),Lmax=rest?.42:.25;if(L>Lmax)return null;
      const ang=L>0?Math.min(rest?1.05:.6,Math.asin(Math.min(1,(L+.04)/.45))):.14,fw=.45*Math.sin(ang)-.45*Math.sin(.14),dn=.45*(Math.cos(.14)-Math.cos(ang)),
        lx=sx+hx/hL*fw,lz=sz+hz/hL*fw,ly=sy-dn,dist=Math.hypot(uf[0]-lx,uf[1]-ly,uf[2]-lz);if(dist>.68)return null;
      _zC.set(lx,ly,lz);_zD.set(uf[0]-lx,uf[1]-ly,uf[2]-lz).normalize();rc.set(_zC,_zD);rc.near=.02;rc.far=Math.max(.05,dist-.1);
      const own=o=>{for(let q=o;q;q=q.parent)if(q===u.grp)return true;return false;}; /* the diffuser itself is where the hand goes, not an obstacle */
      return rc.intersectObjects(losMeshes(),false).some(h=>!own(h.object))?null:{dist,lean:ang};}
    function vzPlan(){const q=[],st=Math.sin(.22);(S.units||[]).forEach((u,i)=>{const d=u.d,tx=-d[2],tz=d[0];let best=null;
      for(const LL of [1.6,2.2]){const kmax=LL>2?5:3,rb=LL*st;
        for(const off of [.42,.5,.6,.7,.8,.9,1.0,1.1])for(const lt of [0,.2,-.2,.35,-.35,.5,-.5,.6,-.6,.75,-.75,.9,-.9,1.1,-1.1]){const fx=u.p[0]+d[0]*off+tx*lt,fz=u.p[2]+d[2]*off+tz*lt,sx=fx+d[0]*(rb+.1),sz=fz+d[2]*(rb+.1);
          if(!(vzFree(fx,fz,.26)&&vzFree(fx-d[0]*(rb-.03),fz-d[2]*(rb-.03),.05)&&vzFree(sx,sz,.2)&&vzWalk(sx,sz)&&!(S.wine&&Math.abs(fz-S.zW)<.8)))continue;
          for(let k=1;k<=kmax;k++){const r=vzReach(u,[fx,fz],k,d,LL);if(r){const sc=r.dist+r.lean*.4+Math.abs(lt)*.25+(LL>2?.3:0)+(off-.42)*.2+k*.02;if(!best||sc<best.sc)best={sc,u:i,F:[fx,fz],stand:[sx,sz],off,face:Math.atan2(-d[0],-d[2]),k,lean:r.lean,LL};}}}
        if(best)break;}
      // side-on: the ladder stands along the wall in front of the shelving, so its back legs do not push him away from it; he climbs
      // facing along the wall and at the top turns his chest to the diffuser, the working (right) hand on the wall side
      if(!best){const A=[d[2],0,-d[0]],fA=Math.atan2(-A[0],-A[2]),fW=Math.atan2(-d[0],-d[2]);let tw=fW-fA;tw=Math.atan2(Math.sin(tw),Math.cos(tw))*.6;
        for(const LL of [1.6,2.2]){const kmax=LL>2?5:3,rb=LL*st;
          for(const off of [.45,.55,.65,.75,.85,.95,1.05])for(const lt of [0,.15,-.15,.3,-.3,.45,-.45]){const fx=u.p[0]+d[0]*off+A[0]*lt,fz=u.p[2]+d[2]*off+A[2]*lt,sx=fx+A[0]*(rb+.1),sz=fz+A[2]*(rb+.1);
            if(!(vzFree(fx,fz,.26)&&vzFree(fx+A[0]*rb,fz+A[2]*rb,.12)&&vzFree(fx-A[0]*rb,fz-A[2]*rb,.12)&&vzFree(sx,sz,.2)&&vzWalk(sx,sz)&&!(S.wine&&Math.abs(fz-S.zW)<.8)))continue;
            for(let k=1;k<=kmax;k++){const r=vzReach(u,[fx,fz],k,d,LL,A,tw);if(r){const sc=r.dist+r.lean*.4+Math.abs(lt)*.25+(LL>2?.3:0)+(off-.45)*.2+k*.02;if(!best||sc<best.sc)best={sc,u:i,F:[fx,fz],stand:[sx,sz],off,face:fA,k,lean:r.lean,LL,A,tw};}}}
          if(best)break;}}
      if(best){delete best.sc;q.push(best);}else console.debug('[vz] diffuser '+(i+1)+': no ladder spot in reach with a clear line, left for another visit');});
      const out=[];let cur=[S.door.x,S.hd];while(q.length){let bi=0,bd=1e9;q.forEach((t,i)=>{const d=Math.hypot(t.stand[0]-cur[0],t.stand[1]-cur[1]);if(d<bd){bd=d;bi=i;}});const t=q.splice(bi,1)[0];out.push(t);cur=t.stand;}return out;}
    // a route; from a spot the routes count as blocked (pushed by the crowd, a corner) it starts at the nearest walkable point
    function vzNearWalk(x,z,r0){for(let r=r0||.25;r<=2;r+=.25)for(let k=0;k<12;k++){const a=k/12*Math.PI*2,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(vzWalk(px,pz)&&vzFree(px,pz,.2))return [px,pz];}return null;}
    // the specialist weighs the situation as he goes, not a fixed list: of the jobs left, the next is the one that is near, has no
    // customers at the spot and nobody looking at that shelf right now (a busy spot is left for later, and he comes back to it); on the
    // way he keeps an eye on it and turns to another job if someone settles there; at the spot he does not set up (ladder, box, gel)
    // while a customer stands close: he waits a few seconds, and if they stay, leaves it for later
    function vzCrowd(p,r){let n=0;for(const o of people)if(o.visible&&!o.userData.ddd&&Math.hypot(o.position.x-p[0],o.position.z-p[1])<r)n++;return n;}
    function vzBrowsing(p,r){return people.some(o=>o.visible&&!o.userData.ddd&&o.userData.state==='browse'&&Math.hypot(o.position.x-p[0],o.position.z-p[1])<r);}
    function vzPick(g,q){if(!q.length)return -1;const x=g.position.x,z=g.position.z;let bi=0,bs=-1e9;
      q.forEach((t,i)=>{const p=t.stand||t.a;if(!p)return;const sc=-Math.hypot(p[0]-x,p[1]-z)*.6-vzCrowd(p,1.3)*2.5-(vzBrowsing(p,1)?4:0)-(t.later||0)*1.2+(i===0?.9:0);if(sc>bs){bs=sc;bi=i;}});return bi;}
    function vzRethink(g,dt,T_,go){const dz=g.userData.dz,t=dz.task;if(!t||!t.stand||t.kind==='hand'||t.kind==='exit'||t.exit||!dz.q.length)return false;dz.rT=(dz.rT||0)+dt;if(dz.rT<1)return false;dz.rT=0;
      const p=t.stand,d=Math.hypot(p[0]-g.position.x,p[1]-g.position.z);if(d<1.2||!vzBrowsing(p,.9))return false;
      t.later=(t.later||0)+1;if(t.later<4)dz.q.push(t);dz.decided=T_;go();return true;}
    function vzHoldFor(g,dt,sp,setNext,look){const dz=g.userData.dz;const nb=people.find(o=>o.visible&&!o.userData.ddd&&Math.hypot(o.position.x-sp[0],o.position.z-sp[1])<.85);
      if(!nb){dz.wc=0;dz.waitCust=false;return false;}dz.wc=(dz.wc||0)+dt;dz.t=0;dz.waitCust=true;look([nb.position.x,nb.position.z]);
      if(dz.wc>(nb.userData.state==='walk'?3:1.8)){dz.wc=0;dz.waitCust=false;const t=dz.task;t.later=(t.later||0)+1;if(t.later<4)dz.q.push(t);setNext();}return true;}
    function vzGo(g,to,T_){const x=g.position.x,z=g.position.z;let P=nav.route(gridDyn(g),[x,z],to);if(!P||!vzWalk(x,z)){const w=vzNearWalk(x,z);if(w){const P2=nav.route(gridDyn(g),w,to);if(P2)P=[[x,z]].concat(P2);}}setPath(g,P,T_);if(!P)g.userData.dz.noRoute=(g.userData.dz.noRoute||0)+1;}
    // a watchdog on his walks: no headway for 5 s (customers in the way, a route that ends in a dead corner) → a fresh route round them;
    // after three tries that point is left for the next visit and he goes on (he never stands in one place for long)
    function vzWatch(g,dt,T_,target,skip){const dz=g.userData.dz,ud=g.userData,x=g.position.x,z=g.position.z;if(dz.wx==null||Math.hypot(x-dz.wx,z-dz.wz)>.25){dz.wx=x;dz.wz=z;dz.wT=0;return;}dz.wT+=dt;
      if(dz.wT>4){dz.wT=0;dz.wTry=(dz.wTry||0)+1;ud.replanned=ud.rerouted=ud.blkRe=false;ud.stuckT=ud.waitAcc=0;if(dz.wTry===2){/* give way: a step aside to a free spot, then on */const w=vzNearWalk(x,z,.9);if(w){setPath(g,[[x,z],w].concat(nav.route(gridDyn(g),w,target())||[]),T_);return;}}if(dz.wTry>4){dz.wTry=0;dz.skipN=(dz.skipN||0)+1;if(dz.skipN>2){dz.skipN=0;dz.q=[];dz.task={kind:'exit',exit:true};dz.ph_='gone';}else skip();}else vzGo(g,target(),T_);}}
    function vzStep(g,dt,T_,open){const ud=g.userData,dz=ud.dz;vzTick(g,dz,dt);
      const faceTo=(a,k)=>{ud.ang=angStep(ud.ang||0,a,k||5,dt,2.4);g.rotation.y=ud.ang;};
      let v=0,lookP=null,clip=null;const R=[null,null];ud.ikReq=R;dz.holdB=null;dz.phOn=false;
      const fwd=_zA.set(Math.sin(ud.ang||0),0,Math.cos(ud.ang||0)),rgt=_zB.set(-fwd.z,0,fwd.x),px=g.position.x,pz=g.position.z;
      let tt=dz.t;const win=(t0,t1,f)=>tt>=t0&&tt<t1?Math.min(1,(tt-t0)/(f||.3),(t1-tt)/(f||.3)):0,ramp=(t0,t1)=>clamp((tt-t0)/(t1-t0),0,1);
      if(dz.ph_==='away'){g.visible=false;if(T_>dz.until&&!doorBusy(g)){dz.q=vzPlan();g.position.set(nav.entry[0],0,nav.entry[1]);ud.ang=Math.PI;g.rotation.y=ud.ang;g.visible=true;ud.blend=0;dz.task=null;dz.ph_='next';dz.t=0;dz.ladOn=false;dz.ladTh=0;}}
      if(dz.ph_==='next'){const pi_=vzPick(g,dz.q);dz.task=(pi_>=0?dz.q.splice(pi_,1)[0]:null)||{exit:true};dz.t=0;dz.ph_='go';vzGo(g,dz.task.exit?nav.exit:dz.task.stand,T_);}
      if(dz.ph_==='go'&&vzRethink(g,dt,T_,()=>{dz.ph_='next';})){}
      if(dz.ph_==='go'){ud.blend=Math.min(1,ud.blend+dt*2);vzWatch(g,dt,T_,()=>{const t_=dz.task;return t_.exit?nav.exit:t_.stand;},()=>{dz.ph_='next';});if(dz.ph_==='go'&&advance(g,ud.sp*ud.blend*dt,dt)){dz.wTry=0;dz.skipN=0;ud.state='ddd';dz.t=0;dz.ph_=dz.task.exit?'gone':'work';}else v=ud.vNow!=null?ud.vNow:ud.sp*ud.blend;}
      if(dz.ph_==='gone'){g.visible=false;dz.ph_='away';dz.until=T_+rnd(600,660); /* the next visit is a different day: someone watching sees him again only after about ten minutes */ud.state='away';}
      tt=dz.t;const t=dz.task; /* read after arriving: the walk's time must not count as work done */
      // refilling a diffuser, as it is done in real life: the step ladder opened slowly and tested; climbed facing it, one foot onto the
      // step, the weight over it, the other foot after, the hands moving up the rails in turn; at the top one hand always on the ladder
      // (three points of contact), the other opens the cover gently, takes the empty bottle out into the bag, a full one from the bag in,
      // closes the cover; a check on the phone; down the same way, facing the ladder, slower; the test puff once he stands on the floor
      if(dz.ph_==='work'&&t&&!t.exit&&dz.t<.45&&vzHoldFor(g,dt,t.F||t.stand,()=>{dz.ph_='next';},q=>{lookP=q;})){}
      else if(dz.ph_==='work'&&t&&!t.exit){const u=S.units[t.u],d=u.d,dd=t.A||d,k=t.k,F=t.F,th=.22,LL=t.LL||1.6,ct=Math.cos(th),tt_=Math.tan(th),hy=LL*ct; /* dd: the ladder's own axis (facing the wall, or side-on along it) */
        const tl_=vzTL(k),onTop=tt>=tl_.tUp-.3&&tt<tl_.tDn+.2,faceNow=t.face+(onTop?(t.tw||0):0),fT=[Math.sin(faceNow),Math.cos(faceNow)];faceTo(faceNow,onTop?2:3); /* side-on: at the top the chest turns to the diffuser */
        const lat=[dd[2],0,-dd[0]],ank=.09*(ud.k||1); /* lat = his right as he faces the ladder */
        const trY=j=>j?(.05+.3*j)*ct:0,trP=j=>j?[F[0]+dd[0]*((LL-.05-.3*j)*Math.sin(th)+.04),F[1]+dd[2]*((LL-.05-.3*j)*Math.sin(th)+.04)]:[t.stand[0],t.stand[1]];
        const bodyP=j=>{const q=trP(j);return j?[q[0]+dd[0]*.06,q[1]+dd[2]*.06]:q;},footP=(j,sd)=>{const q=trP(j);return [q[0]+lat[0]*sd*.1,trY(j)+ank,q[1]+lat[2]*sd*.1];};
        const rail=(sd,y)=>{y=Math.min(y,hy-.08);const o=(hy-y)*tt_;return [F[0]+lat[0]*sd*.22+dd[0]*o,y,F[1]+lat[2]*sd*.22+dd[2]*o];};
        const lerp3=(A,B_,f)=>[A[0]+(B_[0]-A[0])*f,A[1]+(B_[1]-A[1])*f,A[2]+(B_[2]-A[2])*f],arc=(A,B_,f)=>{const q=lerp3(A,B_,tE(f));q[1]+=.11*Math.sin(Math.PI*f);return q;};
        const {SU,SD,cP,c0,tUp,w0,o:oL,tSw,tCl,tPh,tDn,tFl,tOff,tFold,tEnd}=vzTL(k);
        u.vzBusy=tt>.3&&tt<tOff?performance.now()/1000+.3:0; /* it does not puff while he is at it */
        // the ladder: set down, opened slowly, tested with both hands; folded and picked up at the end
        if(tt>.5&&tt<tEnd-.4){if(!dz.ladOn){dz.ladOn=true;dz.ladP=[F[0],0,F[1]];dz.ladYaw=Math.atan2(dd[0],dd[2]);}dz.ladTh=th*Math.min(ramp(.8,2.3),1-ramp(tFold,tFold+1.2));}else dz.ladOn=false;
        if(tt<2.3)R[1]={p:[F[0]+lat[0]*.15,1.15,F[1]+lat[2]*.15],w:win(.3,2.3,.3)};
        if(tt>=2.3&&tt<cP+.2){const w=win(2.3,cP+.2,.25),sh=Math.sin((tt-2.3)*9)*.015;R[0]=({p:rail(-1,1.1),w});R[1]={p:rail(1,1.1+sh),w};} /* a push on the rails: it stands firm */
        // at the foot of the ladder he gets the new bottle ready: refills come full and sealed (no pouring on site). A bottle out of the
        // bag, its transport cap screwed off with the other hand and pocketed in the bag, the open bottle set upright in its slot in the bag
        dz.canOn=false;dz.pour=0;dz.capB=false;dz.capH=false;
        if(tt>=cP&&tt<c0){const s_=tt-cP,fx=-dd[0],fz=-dd[2],sp=(a_,b_)=>s_>=a_&&s_<b_,bagP=[px+lat[0]*-.22,.95,pz+lat[2]*-.22],bP=[px+fx*.3+lat[0]*.05,1.06,pz+fz*.3+lat[2]*.05],tP=[bP[0]-lat[0]*.02,bP[1]+.085,bP[2]-lat[2]*.02];
          if(sp(0,4.0))R[1]={p:s_<.55||s_>3.45?bagP:bP,w:win(0,4.0,.3)};          // out of the bag, held up in front; back into the bag at the end
          if(s_>=.45&&s_<3.7)dz.holdB='prep';dz.capB=s_<1.9;
          if(sp(.9,3.3))R[0]={p:s_<1.25?bagP:s_<2.3?[tP[0],tP[1]+Math.sin(s_*14)*.004,tP[2]]:bagP,w:win(.9,3.3,.3)}; // the other hand to the cap, a few turns, the cap away
          dz.capH=s_>=1.9&&s_<2.85;
          lookP=[px+fx*.32,pz+fz*.32];}
        // where his body and feet are
        let lvl=0,bp=bodyP(0),fL=footP(0,-1),fR=footP(0,1),lift=0,hL=null,hR=null;
        if(tt>=c0&&tt<tUp){const j=Math.min(k,Math.floor((tt-c0)/SU)+1),f=((tt-c0)-(j-1)*SU)/SU,a0=j-1;
          fR=f<.45?arc(footP(a0,1),footP(j,1),f/.45):footP(j,1);fL=f<.65?footP(a0,-1):f<1?arc(footP(a0,-1),footP(j,-1),(f-.65)/.35):footP(j,-1);
          const b_=tE(clamp((f-.35)/.4,0,1));lift=trY(a0)+(trY(j)-trY(a0))*b_;const B0=bodyP(a0),B1=bodyP(j);bp=[B0[0]+(B1[0]-B0[0])*b_,B0[1]+(B1[1]-B0[1])*b_];
          const gy=lift+1.05;hR=rail(1,f<.3?gy-.25+.25*tE(f/.3):gy);hL=rail(-1,f<.5?gy-.3:f<.8?gy-.3+.3*tE((f-.5)/.3):gy);}
        else if(tt>=tUp&&tt<tDn){lift=trY(k);bp=bodyP(k);fL=footP(k,-1);fR=footP(k,1);hL=rail(-1,lift+1.05);}
        else if(tt>=tDn&&tt<tFl){const s_=Math.floor((tt-tDn)/SD),j=k-s_,f=((tt-tDn)-s_*SD)/SD,a1=j-1;
          fL=f<.4?arc(footP(j,-1),footP(a1,-1),f/.4):footP(a1,-1);fR=f<.6?footP(j,1):f<1?arc(footP(j,1),footP(a1,1),(f-.6)/.4):footP(a1,1);
          const b_=tE(clamp((f-.25)/.45,0,1));lift=trY(j)+(trY(a1)-trY(j))*b_;const B0=bodyP(j),B1=bodyP(a1);bp=[B0[0]+(B1[0]-B0[0])*b_,B0[1]+(B1[1]-B0[1])*b_];
          const gy=lift+1.05;hL=rail(-1,f<.3?gy+.2-.2*tE(f/.3):gy);hR=rail(1,f<.5?gy+.25:f<.8?gy+.25-.25*tE((f-.5)/.3):gy);}
        dz.feet=tt>=c0-.2&&tt<tFl+.3?[fL,fR]:null;{const lt_=tt>=w0-.3&&tt<tCl+1.9?(t.lean||.14):tt>=tUp&&tt<tDn?.14:tt>=c0&&tt<tFl?.08:0;dz.leanS=(dz.leanS||0)+(lt_-(dz.leanS||0))*Math.min(1,dt*2.5);dz.leanL=dz.leanS;} /* at the top he leans in to the diffuser as far as the plan found he must (over a shelf, more), one hand on the rail; eased in and out */
        g.position.x=bp[0];g.position.z=bp[1];dz.lift=Math.max(0,lift);
        if(hL)R[0]={p:hL,w:.95};if(hR)R[1]={p:hR,w:.95};
        // at the top: one hand on the ladder, the other does the work, slowly
        const bw_=u.bw||.19,ue=(()=>{if(u.cover){u.cover.updateMatrixWorld(true);_zC.set(bw_*.97,0,(u.bd||.07)*.9);u.cover.localToWorld(_zC);return [_zC.x,_zC.y,_zC.z];}return [u.p[0],u.p[1],u.p[2]];})();
        const uf=u.bottle?(u.bottle.parent.updateMatrixWorld(true),u.bottle.getWorldPosition(_zB),[_zB.x,_zB.y+.01,_zB.z]):[u.p[0]+d[0]*(u.bd||.07)*.5,u.p[1]-(u.bh||.26)*.05,u.p[2]+d[2]*(u.bd||.07)*.5],bag_=[px+lat[0]*-.22,.95+lift,pz+lat[2]*-.22],out_=[uf[0]+d[0]*.18,uf[1]-.05,uf[2]+d[2]*.18];
        dz.open=tt<w0+1.1?0:tt<w0+2.5?tE((tt-w0-1.1)/1.4):tt<tCl+.4?1:tt<tCl+1.8?1-tE((tt-tCl-.4)/1.4):0;
        if(u.bottle){u.bottle.visible=!(tt>tSw+.7&&tt<tSw+3.6);u.bottle.rotation.y=tt>=tSw&&tt<tSw+.7?-3*Math.PI*tE((tt-tSw)/.7):0;if(tt>=tSw+3.6&&tt<tSw+3.7)oilLevel(u.bottle,.92);} /* a few turns off the atomiser head; the new one is full */
        dz.btlSpin=tt>=tSw+3.1&&tt<tSw+3.6?3*Math.PI*tE((tt-tSw-3.1)/.5):0;dz.btlFit=tt>=tSw+3.1&&tt<tSw+3.6?tE(clamp((tt-tSw-3.1)/.15,0,1)):0; /* lined up under the socket before it is turned in */
        if(tt>=w0&&tt<w0+2.6+oL)R[1]={p:ue,w:win(w0,w0+2.6+oL,.4)};                                                            // the cover drawn open by its edge, held while he looks in at the seat and the old bottle
        if(tt>=tSw&&tt<tSw+2.0){R[1]={p:tt<tSw+.7?uf:tt<tSw+1.2?out_:bag_,w:win(tSw,tSw+2.0,.35)};if(tt>tSw+.7&&tt<tSw+1.8)dz.holdB='old';}   // the empty bottle out, down into the bag
        if(tt>=tSw+2.0&&tt<tSw+4.0){R[1]={p:tt<tSw+2.6?bag_:tt<tSw+3.1?out_:uf,w:win(tSw+2.0,tSw+4.0,.35)};if(tt>tSw+2.5&&tt<tSw+3.6)dz.holdB='new';}   // the full one from the bag, set in
        if(tt>=tCl&&tt<tCl+1.8)R[1]={p:ue,w:win(tCl,tCl+1.8,.4)};                                                             // the cover pushed shut, gently
        // the schedule on the phone: thumb on the screen, the phone held up toward the diffuser for a moment, a look at it now and then
        if(tt>=tPh&&tt<tDn-.2){dz.phOn=true;const q_=tt-tPh,up=q_>2.2&&q_<3.4?.07*Math.sin(Math.PI*(q_-2.2)/1.2):0;R[1]={p:[px+fT[0]*(.3+up)-fT[1]*.08,1.25+lift+up+Math.sin(q_*3.1)*.006,pz+fT[1]*(.3+up)+fT[0]*.08],w:win(tPh,tDn-.2,.3)};}
        if(!dz.puffed&&tt>tOff+.4){dz.puffed=true;u.vzPuff=T_+2.6;} /* the test puff once he stands on the floor */
        if(tt>=tFl&&tt<tOff){const B0=bodyP(0);bp=B0;g.position.x=B0[0];g.position.z=B0[1];}
        // after the test puff he waits for the mist and checks the scent with a small wave of the hand toward his face
        if(tt>=tOff+2.0&&tt<tOff+3.8){const q_=tt-tOff-2.0,sw=.06+.05*Math.sin(q_*5);R[1]={p:[px-dd[0]*.22+lat[0]*sw,1.5,pz-dd[2]*.22+lat[2]*sw],w:win(tOff+2.0,tOff+3.8,.35)};}
        dz.u=u;if(!(tt>=cP&&tt<c0))lookP=tt>=tPh&&tt<tDn-.2?((Math.floor((tt-tPh)/1.6)%3===2)?[u.p[0],u.p[2]]:[px+fT[0]*.3,pz+fT[1]*.3]):tt<cP||(tt>=tUp&&tt<tDn)||tt>tOff?[u.p[0],u.p[2]]:[F[0],F[1]];
        if(tt>=tFold&&tt<tEnd)R[1]={p:[F[0]+lat[0]*.15,1.1,F[1]+lat[2]*.15],w:win(tFold,tEnd,.3)};
        if(tt>tEnd){dz.ph_='next';dz.puffed=false;dz.lift=0;dz.open=0;dz.feet=null;dz.leanL=0;if(u.bottle)u.bottle.visible=true;u.vzBusy=0;}}
      if(dz.ph_!=='work'){dz.lift=0;dz.open=0;dz.feet=null;dz.leanL=0;dz.leanS=0;}
      ud.lookAtP=lookP;ud.tillGrip=[R[0]?1:0,dz.holdB||dz.phOn||!dz.ladOn||R[1]?1:0];
      if(!dz.ladOn&&dz.ph_!=='away'&&!R[1])R[1]={p:[px+rgt.x*.24+fwd.x*.05,.92,pz+rgt.z*.24+fwd.z*.05],w:.85}; // carrying the folded ladder at his right side
      if(g.visible){if(v>.04){ud.play(v<.6?'walkslow':'walk',.3);ud.setSpeed(v);}else if(clip){ud.play(clip,.25);ud.setSpeed(.35);}else ud.play('idle',.4);}
      if(ud.state!=='walk'&&dz.ph_!=='go'&&dz.ph_!=='away')ud.state='ddd';}

    // the camera while he works: it looks at the WORK (the box, the gel points, the stretch of skirting he sprays, the diffuser) and at him,
    // from a three-quarter angle on the room side (never from straight behind him); a spot that is open floor and sees both, kept for the
    // whole task (it moves along with him while he sprays) and looked for again only if a fixture or a person comes between
    // the follow views' spring arm (as in game cameras): while the one followed is inside, the lens stays in the room and under the
    // ceiling, and when a wall or a shelf comes between it and them it slides in along the line until nothing is in the way
    function camGuard(focus){const c=camera.position;if(!focus||!isFinite(focus.x+focus.y+focus.z))return;if(focus.z>S.hd-.05)return;
      c.x=clamp(c.x,-S.hw+.22,S.hw-.22);c.z=clamp(c.z,-S.hd+.22,S.hd-.22);c.y=clamp(c.y,.35,(S.H||3)-.25);
      const rc=VZ.gc||(VZ.gc=new T.Raycaster()),d_=c.clone().sub(focus),len=d_.length();if(len<.4)return;d_.normalize();rc.set(focus,d_);rc.near=.2;rc.far=len;const h=rc.intersectObjects(losMeshes(),false)[0];
      if(h)c.copy(focus).addScaledVector(d_,Math.max(.4,h.distance-.2));}
    function vzWorkCam(wk,cell,dt){const W=new T.Vector3(wk.W[0],wk.W[1],wk.W[2]),Hh=new T.Vector3(wk.H[0],wk.H[1],wk.H[2]);let ox=Hh.x-W.x,oz=Hh.z-W.z,L=Math.hypot(ox,oz);if(L<.15){ox=-Math.sin(wk.face||0);oz=-Math.cos(wk.face||0);L=1;}ox/=L;oz/=L;
      const pose=p=>{const c=Math.cos(p.th),s=Math.sin(p.th),rx=ox*c-oz*s,rz=ox*s+oz*c;return new T.Vector3(W.x+rx*p.d,p.h,W.z+rz*p.d);};
      const rc=VZ.rc||(VZ.rc=new T.Raycaster()),LM=losMeshes(),seen=(c,t)=>{const d_=t.clone().sub(c),len=d_.length();if(len<.05)return true;rc.set(c,d_.normalize());rc.far=len-.12;return !rc.intersectObjects(LM,false).length;};
      const Mh=W.clone().lerp(Hh,.5),Wt=W.clone().add(_zC.set(0,.1,0)),
        ppl=c=>people.concat(extras).some(o=>{if(o===VZ.g||!o.visible)return false;const ox_=o.position.x,oz_=o.position.z;return [W,Hh].some(t=>{const dx=t.x-c.x,dz=t.z-c.z,L2=dx*dx+dz*dz||1,u_=((ox_-c.x)*dx+(oz_-c.z)*dz)/L2;return u_>.05&&u_<.95&&Math.hypot(ox_-(c.x+dx*u_),oz_-(c.z+dz*u_))<.3;});}), /* a person (the cashier, a shopper) standing between the camera and the work blocks it too */
        ok=p=>{const c=pose(p);return cell(c.x,c.z)&&(seen(c,W)||seen(c,Wt))&&seen(c,Hh)&&seen(c,Mh)&&!ppl(c);}; /* the work, his head and his hands in between */
      VZ.wkT=(VZ.wkT||0)+dt;let again=VZ.wkFor!==wk.key||!VZ.wkP;if(!again&&VZ.wkT>.8){VZ.wkT=0;again=!ok(VZ.wkP);}
      if(again){VZ.wkFor=wk.key;VZ.wkP=null;for(const th of [-1.3,-1.05,-1.55,-.8,-1.85,-.55,1.3,1.05,1.55,.8,1.85])for(const dh of [0,.55,1.1]){ /* always from his right, as when he shows the work to someone: every distance and height on that side first, the left only if the right is walled in */ /* his working (right) hand's side first: his body never hides what the hand does */ /* from the side: his profile, his hands and the work in one frame; over a fixture: the same from higher up */if(VZ.wkP)break;for(const d of wk.D){const p={th,d,h:wk.h+dh};if(ok(p)){VZ.wkP=p;break;}}}
        if(!VZ.wkP){/* the work is wedged in behind a fixture: over his shoulder from up near the ceiling, looking down at his hands */const hw=Math.hypot(Hh.x-W.x,Hh.z-W.z),top=Math.max(wk.h+.6,(S.H||3)-.3);
          for(const th of [-.35,0,-.7,.35,.7]){if(VZ.wkP)break;for(const d of [hw+.6,hw+.9,hw+.35]){const p={th,d,h:top};const c=pose(p);if(cell(c.x,c.z)&&(seen(c,W)||seen(c,Wt))){VZ.wkP=p;break;}}}
          if(!VZ.wkP)VZ.wkP={th:0,d:hw+.6,h:top};}}
      return [pose(VZ.wkP),W.clone().lerp(Hh,wk.mix==null?.4:wk.mix)];}
    // reality rule: shoppers keep clear of the specialist at work (a ladder up, a box open on the floor): nobody stops at the spot or, while
    // he is being followed, between it and the camera; routes go round it, nobody picks a shelf spot inside it, and whoever was browsing
    // there finishes and moves on (people heading for the till or the door may still pass, as they do in a shop)
    function vzZoneUpd(g){const wk=g&&g.visible&&g.userData.dz&&true?vzWork(g):null;
      if(!wk||(wk.key&&wk.key.kind==='hand')){VZ.zone=null;return;}
      const Z=VZ.zone&&VZ.zone.key===wk.key?VZ.zone:(VZ.zone={key:wk.key,tok:(VZ.zTok=(VZ.zTok||0)+1)}),fol=view.name==='ddd';
      Z.x=(wk.W[0]+g.position.x)/2;Z.z=(wk.W[2]+g.position.z)/2;Z.r=1.15;Z.cx=fol?camera.position.x:null;Z.cz=fol?camera.position.z:null;}
    function inZone(x,z,pad){const Z=VZ.zone;if(!Z)return false;pad=pad||0;if(Math.hypot(x-Z.x,z-Z.z)<Z.r+pad)return true;if(Z.cx==null)return false;
      const dx=Z.cx-Z.x,dz=Z.cz-Z.z,L2=dx*dx+dz*dz||1;let t=((x-Z.x)*dx+(z-Z.z)*dz)/L2;t=t<0?0:t>1?1:t;return Math.hypot(x-(Z.x+dx*t),z-(Z.z+dz*t))<.45+pad;}
    function vzWork(g){const ud=g.userData,dz=ud.dz,t=dz&&dz.task,hd=ud.headB;if(!t||t.exit||dz.ph_!=='work'||!hd)return null;const u=S.units[t.u];if(!u)return null;hd.getWorldPosition(_zS);
      return {key:t,W:[u.p[0],u.p[1],u.p[2]],H:[_zS.x,_zS.y-.1,_zS.z],face:t.face,D:[1.6,1.9,2.2,2.6,3.1],h:clamp(u.p[1]-.4,1.6,2.2),mix:.3};}

    // subtitles under the 3D scene: what he is doing right now and why (shown while you follow him, or while he is on screen nearby)
    function vzSubShow(g,cap){let el=VZ.sub;if(!el){el=VZ.sub=document.createElement('div');el.className='vzsub';el.setAttribute('aria-live','polite');el.innerHTML='<b></b><span></span>';stage.appendChild(el);}
      let show=!!(g&&g.visible)&&view.name==='ddd'; /* his subtitles belong to following him; in every other view the store's own labels speak */
      VZ.subVis=show;const now=performance.now()/1000,cur=VZ.subShown;
      if(!show){if(cur){el.classList.remove('on');VZ.subShown=null;}return;}
      if(cur&&now-cur.at<cur.min)return;                                                    // the line on screen stays until it has been read
      if(!cap){if(cur){el.classList.remove('on');VZ.subShown=null;}return;}
      const key=cap[0]+'|'+cap[1];if(cur&&cur.key===key)return;
      const n=(cap[0]+' '+cap[1]).length;VZ.subShown={key,at:now,min:Math.min(8,Math.max(3,1.2+n/14))}; /* reading time: about 14 letters a second, 3 to 8 s */
      el.firstChild.textContent=cap[0];el.lastChild.textContent=cap[1];el.classList.add('on');el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
    // his work waits for the subtitle: while it is on screen, the next step starts only once the current line has been read (he holds
    // the moment, as someone checking his work does); nobody watching, he works at his own pace
    function vzTick(g,dz,dt){const sh=VZ.subShown;if(VZ.subVis&&sh&&performance.now()/1000-sh.at<sh.min){const t0=dz.t;dz.t+=dt;const c=vzCaption(g),k=c?c[0]+'|'+c[1]:'';dz.t=t0;
        if(k&&k!==sh.key&&(dz.gateT=(dz.gateT||0)+dt)<7)return;}dz.gateT=0;dz.t+=dt;}
    // one timeline for a diffuser job: the actions and the subtitles both read it, so the words never run ahead of the hands; every step
    // lasts as long as its subtitle needs to be read, filled with real work (no standing still waiting for the reader)
    function vzTL(k){const SU=1.5,SD=1.7,cP=3.0,c0=cP+4.2,tUp=c0+SU*k,w0=tUp+.6,o=1.6,tSw=w0+2.6+o,tCl=tSw+4.2,tPh=tCl+2.0,tDn=tPh+5.9,tFl=tDn+SD*k,tOff=tFl+.8,tFold=tOff+5.0,tEnd=tFold+1.8;
      return {SU,SD,cP,c0,tUp,w0,o,tSw,tCl,tPh,tDn,tFl,tOff,tFold,tEnd};}
    function vzCaption(g){const dz=g.userData.dz;if(!dz)return null;if(dz.waitCust)return ['Изчаква клиента до мястото','Работи се само когато наблизо няма хора.'];const t=dz.task,tt=dz.t,ph=dz.ph_;if(!t||t.exit||ph!=='work')return null;const L=vzTL(t.k);
      if(tt>=L.cP+.2&&tt<L.c0)return ['Приготвя пълна бутилка','Запечатана бутилка с ароматно масло: сваля транспортната капачка.'];
      if(tt>=L.tUp&&tt<L.tSw)return ['Зареждане на дифузер №'+(t.u+1),'Отваря капака на дифузера.'];
      if(tt>=L.tSw&&tt<L.tPh)return ['Сменя бутилката с ароматно масло','Празната се развива от главата на дифузера, пълната се завинтва на мястото ѝ.'];
      if(tt>=L.tPh&&tt<L.tDn)return ['Проверява графика на дифузера','Сверява работното време на обекта.'];
      if(tt>=L.tFl&&tt<L.tFold)return ['Пробно пръскане','Проверка, че дифузерът работи след зареждането.'];
      return null;}
    // the props each frame
    function vzProps(dt){const g=VZ.g;if(!g)return;const ud=g.userData,dz=ud.dz;if(!dz)return;vzZoneUpd(g);vzFP(g);vzSubShow(g,vzCaption(g));const vis=g.visible;dz.tag.hidden=!vis;dz.lad.visible=vis;dz.bag.visible=true;
      if(!vis){dz.cap.visible=false;dz.btl.visible=dz.ph.visible=dz.can.visible=dz.strm.visible=false;return;}g.updateMatrixWorld(true);const hd=ud.headB;if(hd){hd.getWorldPosition(_zS);dz.tagV.set(_zS.x,_zS.y+.36,_zS.z);}
      // the ladder: open on the floor under the diffuser, or folded in his right hand
      const LLc=(dz.task&&dz.task.LL)||1.6;if(dz.ladLL!==LLc){dz.ladLL=LLc;dz.lf.geometry=LLc>2?VZ.geo.front2:VZ.geo.front;dz.lr.geometry=LLc>2?VZ.geo.rear2:VZ.geo.rear;}
      dz.lf.rotation.x=-dz.ladTh;dz.lr.rotation.x=dz.ladTh;const hy=LLc*Math.cos(dz.ladTh);
      if(dz.ladOn){dz.lad.position.set(dz.ladP[0],hy,dz.ladP[2]);dz.lad.rotation.set(0,dz.ladYaw,0);}
      else{const rp=palmOf(g,1);if(rp){const a=ud.ang||0;dz.lad.position.set(rp[0],Math.max(LLc+.02,rp[1]+LLc/2-.05),rp[2]);dz.lad.rotation.set(0,a+Math.PI/2,0);}}
      // the unit's cover swings open on its left edge, the bottle inside shows
      if(dz.u&&dz.u.cover){dz.u.cover.rotation.y=-1.75*tE(dz.open||0);}
      dz.btl.visible=!!dz.holdB;if(dz.holdB){const pp=palmOf(g,1);if(pp){const big=!!(dz.u&&dz.u.bw>.25),b=big?dz.btl.userData.L:dz.btl.userData.S;dz.btl.userData.S.visible=!big;dz.btl.userData.L.visible=big;dz.btlH=b.userData.H; /* gripped round the body, a little above its middle */
        dz.btl.position.set(pp[0],pp[1]-b.userData.H*.12,pp[2]);if(dz.holdB==='new'&&dz.btlFit>0&&dz.u&&dz.u.bottle){dz.u.bottle.getWorldPosition(_zA);dz.btl.position.lerp(_zA,dz.btlFit);}dz.btl.rotation.set(0,dz.holdB==='new'?dz.btlSpin||0:0,0);oilLevel(b,dz.holdB==='old'?.05:.92);}}
      {const big=!!(dz.u&&dz.u.bw>.25),cr=(big?.038:.025)*.52*1.3,ch=big?.02:.016;dz.cap.visible=vis&&(!!(dz.holdB==='prep'&&dz.capB&&dz.btl.visible)||!!dz.capH);dz.cap.scale.set(cr,ch,cr);dz.cap.rotation.set(0,0,0); /* the transport cap: on the full bottle, then in the other hand */
        if(dz.cap.visible){if(dz.capB&&dz.holdB==='prep'){dz.cap.position.set(dz.btl.position.x,dz.btl.position.y+(dz.btlH||.118)/2+ch*.35,dz.btl.position.z);}else{const lp=palmOf(g,0);if(lp)dz.cap.position.set(lp[0],lp[1]-.01,lp[2]);}}}
      dz.ph.visible=!!dz.phOn;if(dz.phOn&&hd){const pp=palmOf(g,1);if(pp){dz.ph.position.set(pp[0],pp[1]+.02,pp[2]);dz.ph.lookAt(_zS);}}
      dz.can.visible=!!dz.canOn;if(dz.canOn){const lp=palmOf(g,0);if(lp){dz.can.position.set(lp[0],lp[1]-.03,lp[2]);const bt=dz.btl.visible?dz.btl.position:null,yaw=bt?Math.atan2(bt.x-lp[0],bt.z-lp[2]):(ud.ang||0);dz.can.rotation.set(0,yaw,0);dz.can.rotateX(1.05*(dz.pour||0));}}
      dz.strm.visible=false;if(dz.canOn&&(dz.pour||0)>.9&&dz.btl.visible){dz.can.updateMatrixWorld(true);_zA.set(0,.205,.024);dz.can.localToWorld(_zA);_zB.set(dz.btl.position.x,dz.btl.position.y+(dz.btlH||.115)/2+.004,dz.btl.position.z);const L_=_zA.distanceTo(_zB);if(L_>.02&&L_<.5){dz.strm.visible=true;dz.strm.position.copy(_zA);dz.strm.scale.set(1,L_,1);dz.strm.quaternion.setFromUnitVectors(_zD.set(0,-1,0),_zC.copy(_zB).sub(_zA).normalize());}}}
    window.__vz=()=>{const g=VZ.g;if(!g)return {none:true,texN:VZ.texN};const d=g.userData.dz;return {ph:d.ph_,u:d.task&&d.task.u,t:+d.t.toFixed(1),x:+g.position.x.toFixed(2),y:+g.position.y.toFixed(2),z:+g.position.z.toFixed(2),ang:+(g.userData.ang||0).toFixed(2),vis:g.visible,q:d.q.length,lift:+(d.lift||0).toFixed(2),lad:d.ladOn,st:g.userData.state,clip:g.userData.clip};};
    window.__vzPlan=()=>vzPlan().map(t=>t.u+' k'+t.k+' '+JSON.stringify(t.F.map(v=>+v.toFixed(2))));
    window.__vzSkip=()=>{const g=VZ.g;if(g)g.userData.dz.until=0;};
    window.__vzCam=()=>({cam:camera.position.toArray().map(v=>+v.toFixed(2)),pick:VZ.pick?VZ.pick.toArray().map(v=>+v.toFixed(2)):null,view:view.name});
    function clearRoom(){vzClear();buildTok++;pending.forEach(cancelAnimationFrame);pending=[];camSub=null;
      people.concat(extras).forEach(p=>{if(p.userData.gltfP){room.remove(p);if(window.KL_GLTF)window.KL_GLTF.release(p);}});
      room.traverse(o=>{if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}if(o.isSprite||(o.material&&o.material.userData&&o.material.userData.own))o.material.dispose();});
      // textures and materials made for this store (labels, stickers, signs drawn on canvases...) are freed too; a shared one that is used
      // again is simply uploaded again. Without this every store switch left its textures on the GPU: the scene grew slower over time
      {const MK=['map','emissiveMap','normalMap','roughnessMap','metalnessMap','alphaMap','aoMap','bumpMap'],keepM=new Set(),keepT=new Set();Object.values(M).forEach(m=>{if(m&&m.isMaterial){keepM.add(m);MK.forEach(k=>m[k]&&keepT.add(m[k]));}});
        const seenT=new Set();room.traverse(o=>{if(!o.material)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{MK.forEach(k=>{const t=m[k];if(t&&!keepT.has(t)&&!seenT.has(t)){seenT.add(t);t.dispose();}});if(!keepM.has(m))m.dispose();});});}
      room.clear();overlay.forEach(o=>o.el.remove());overlay.length=0;people.length=0;extras.length=0;heat=null;flowLine=null;flowCurve=null;acc={};vacc=[];vaccM=[];vaccF=[];vaccC=[];LAYER=null;}
    let acc={},vacc=[],vaccM=[],vaccF=[],vaccC=[],LAYER=null,buildTok=0,pending=[]; // LAYER: the shop front (fades when seen from above) or the ceiling fixtures (hidden from above)
    // everything goes to the GPU up front (shader programs + textures), not on the first frame an object comes into view: no hitch when the camera enters the store
    const TEXK=['map','roughnessMap','metalnessMap','normalMap','alphaMap','emissiveMap','bumpMap','aoMap','envMap'];
    // decals (signs, labels, posters, shade and glass sheets, stickers) lie on a surface: a small depth bias keeps them in front of it at every distance and angle,
    // instead of trading pixels with it (flicker). Only materials used solely on flat sheets get it; a material shared with solid boxes is left alone.
    const DECALS=()=>[M.ao,M.aoV,M.glassC,M.headCoke,M.headBeer,M.headBurg].filter(Boolean);
    function decalize(){const solid=new Set(),flat=new Set();room.traverse(o=>{if(!o.isMesh)return;const ms=Array.isArray(o.material)?o.material:[o.material];const pl=o.geometry&&o.geometry.type==='PlaneGeometry';ms.forEach(m=>(pl?flat:solid).add(m));});
      DECALS().forEach(m=>flat.add(m));flat.forEach(m=>{if(solid.has(m)&&!DECALS().includes(m))return;if(!m.polygonOffset){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-2;m.needsUpdate=true;}});}
    function warm(){try{decalize();scene.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):null;if(ms)ms.forEach(m=>TEXK.forEach(k=>{const t=m[k];if(t&&t.isTexture&&t.userData.up!==t.version){renderer.initTexture(t);t.userData.up=t.version;}}));});renderer.compile(scene,camera);}catch(e){}}
    // every person model's materials compiled up front (their originals are briefly part of the scene for the compile): a model walking in for
    // the first time a minute into the presentation must not stall the frame – on Windows/ANGLE (Firefox, Chrome) one shader compile costs 100+ ms
    function warmModels(){const G=GL();if(!G)return;const hold=new T.Group();hold.visible=false;G.models.forEach(m=>{if(!m.warm){m.warm=1;hold.add(m.scene);}});if(!hold.children.length)return;scene.add(hold);warm();scene.remove(hold);[...hold.children].forEach(c=>hold.remove(c));}
    function later(fn){const tok=buildTok;pending.push(requestAnimationFrame(()=>{if(tok!==buildTok)return;fn();S._losTok=null;warm();renderer.shadowMap.needsUpdate=true;kick();}));}
    // ?zf=1 (debug only): every axis-aligned box is recorded, so __zf() can list coplanar overlapping faces of different materials — the cause of flicker (z-fighting)
    const ZF=/[?&]zf=1/.test(location.search),ZB=[];
    const REC=[]; // every axis-aligned box of the build being made: {id (material or colour), g (its geometry), mn, mx, s (source, ?zf=1 only)}
    function zfR(id,g){g.computeBoundingBox();const b=g.boundingBox;let s='';if(ZF){try{s=(((new Error()).stack||'').split('\n')[3]||'').trim();}catch(e){}}REC.push({id,g,mn:b.min.toArray(),mx:b.max.toArray(),s});}
    // two different surfaces in one plane flicker as the camera moves (z-fighting). The thinner of the two boxes — a trim, a strip, a plinth,
    // a pole, a sign board — is the detail that belongs in front, so its face moves out by 2 mm: invisible as a size change, and the flicker is gone
    function unfight(){for(let pass=0;pass<2;pass++){const F=[];REC.forEach((b,bi)=>{for(let a=0;a<3;a++){const o=a===0?[1,2]:a===1?[0,2]:[0,1],r=[b.mn[o[0]],b.mx[o[0]],b.mn[o[1]],b.mx[o[1]]];F.push({bi,a,s:-1,r});F.push({bi,a,s:1,r});}});
        const cur=f=>f.s>0?REC[f.bi].mx[f.a]:REC[f.bi].mn[f.a];
        const Bk=new Map();F.forEach((f,i)=>{const k=(f.a*3+f.s+1)+'|'+Math.round(cur(f)*500);let L=Bk.get(k);if(!L)Bk.set(k,L=[]);L.push(i);});
        const test=(i,j)=>{const f=F[i],g=F[j],A=REC[f.bi],B=REC[g.bi];if(A.id===B.id)return;const pf=cur(f),pg=cur(g);if(Math.abs(pf-pg)>.0012)return;if(f.a===1&&f.s<0&&pf<.01)return;
          const ox=Math.min(f.r[1],g.r[1])-Math.max(f.r[0],g.r[0]),oy=Math.min(f.r[3],g.r[3])-Math.max(f.r[2],g.r[2]);if(ox<=.004||oy<=.004)return;
          const ta=A.mx[f.a]-A.mn[f.a],tb=B.mx[g.a]-B.mn[g.a],aa=(f.r[1]-f.r[0])*(f.r[3]-f.r[2]),ab=(g.r[1]-g.r[0])*(g.r[3]-g.r[2]);
          const pk=(ta<tb-1e-4||(Math.abs(ta-tb)<=1e-4&&aa<=ab))?f:g,other=pk===f?g:f,from=cur(pk),to=cur(other)+pk.s*.002,dv=to-from; // always 2 mm in front of the other face's current position
          if(pk.s*dv<=0)return;const R=REC[pk.bi],P=R.g.attributes.position,arr=P.array;for(let v=0;v<P.count;v++){const q=v*3+pk.a;if(Math.abs(arr[q]-from)<1e-4)arr[q]+=dv;}P.needsUpdate=true;
          if(pk.s>0)R.mx[pk.a]=to;else R.mn[pk.a]=to;};
        Bk.forEach((L,k)=>{const [h,q]=k.split('|'),L2=Bk.get(h+'|'+(+q+1));for(let x=0;x<L.length;x++){for(let y=x+1;y<L.length;y++)test(L[x],L[y]);if(L2)for(const j of L2)test(L[x],j);}});}
      if(ZF){ZB.length=0;REC.forEach(r=>ZB.push({id:r.id,mn:r.mn,mx:r.mx,s:r.s}));}REC.length=0;}
    function boxG(w,h,d,s){const g=new T.BoxGeometry(w,h,d);if(s){const uv=g.attributes.uv,dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let i=0;i<uv.count;i++){const f=(i/4)|0;uv.setXY(i,uv.getX(i)*dims[f][0]/s,uv.getY(i)*dims[f][1]/s);}}return g;}
    // boxes are collected per material and merged into one mesh each at the end of build()
    function box(w,h,d,m,x,y,z,sh){const g=boxG(w,h,d,m.map?1.5:0);g.translate(x,y,z);zfR(m.uuid,g);const key=m.uuid+(sh!==false?'s':'n');if(!acc[key])acc[key]={m,sh:sh!==false,geos:[]};acc[key].geos.push(g);}
    function geo(g,m,sh){const key=m.uuid+(sh!==false?'s':'n');if(!acc[key])acc[key]={m,sh:sh!==false,geos:[]};acc[key].geos.push(g);}
    // vertex-coloured props: all merged into one M.vc mesh (and one M.vcm mesh for metal)
    function cbox(w,h,d,col,x,y,z,metal,ry){const g=new T.BoxGeometry(w,h,d);if(ry)g.rotateY(ry);g.translate(x,y,z);if(!ry||Math.abs(Math.sin(2*ry))<1e-6)zfR((metal?'vm':'v')+col,g);(LAYER||(metal?vaccM:vacc)).push([g,col]);}
    function cgeo(g,col,x,y,z,metal){g.translate(x,y,z);(LAYER||(metal?vaccM:vacc)).push([g,col]);}
    function flush(){unfight();Object.values(acc).forEach(a=>{const o=new T.Mesh(mergeGeos(a.geos),a.m);o.castShadow=a.sh;o.receiveShadow=true;room.add(o);});acc={};
      if(vaccF.length){const o=new T.Mesh(mergeColored(vaccF),M.vcF);o.receiveShadow=true;room.add(o);}if(vaccC.length){const o=new T.Mesh(mergeColored(vaccC),M.vcC);room.add(o);}vaccF=[];vaccC=[];
      if(vacc.length){const o=new T.Mesh(mergeColored(vacc),M.vc);o.castShadow=true;o.receiveShadow=true;room.add(o);}if(vaccM.length){const o=new T.Mesh(mergeColored(vaccM),M.vcm);o.receiveShadow=true;room.add(o);}vacc=[];vaccM=[];}
    const SHORT={'Сладки · снаксове':'Снаксове','Хладилни витрини · напитки':'Витрини','Алкохолни напитки':'Алкохол','Кафе · чай':'Кафе','Склад / офис':'Склад'};
    function label(t,x,y,z){LBLS.push([t,x,z]);const e=document.createElement('div');e.className='ov lbl';e.textContent=(stage.clientWidth<560&&SHORT[t])||t;ovl.appendChild(e);overlay.push({el:e,v:new T.Vector3(x,y,z),kind:'lbl'});}
    const WINE=['#1f3a24','#2a1a10','#5a1a22','#dfe9ee','#e8e2d0','#7a1f1f','#c9a24a','#14301c'],SPIRIT=['#3a2410','#c9862a','#e8e2d0','#1f3a24','#7a1f1f','#dfe9ee','#b8862e','#0d2b45','#e0b23a'],
      SWEET=['#5b2d8e','#6b3fa0','#c8382e','#3a2410','#e0b23a','#e8e2d6','#2f6fb5','#5b2d8e'],BISC=['#c8382e','#e0b23a','#5b2d8e','#f0e2c4','#3c7a3e','#274a7a'],COFFEE=['#3a2410','#c8382e','#1b1917','#e0b23a','#6b3fa0','#0d2b45','#8c3b2e'],
      CHIPS=['#e0b23a','#c8382e','#3c7a3e','#f28c28','#2f6fb5','#5b2d8e','#f0e2c4'],TEA=['#3c7a3e','#c8382e','#e0b23a','#274a7a','#f28c28'],CANS=['#c8382e','#2f6fb5','#e0b23a','#3c7a3e','#e8e2d6','#f28c28','#1b1917'],DRINK=['#2a1a10','#dfe9ee','#f28c28','#3c7a3e','#c9862a','#c8382e','#dfe9ee'];

    // loading bar over the set: store built → figures placed → real people models; the presentation starts when it is full
    const LD={el:$('#stageLoad'),p:0,done:false,t0:performance.now()};
    const pf={t:0,n:0,half:TIER===0,slowN:0}; // frame-time meter for the adaptive quality
    function ldSet(p){if(LD.done)return;LD.p=Math.max(LD.p,Math.min(100,p));const e=LD.el;if(e){e.querySelector('.sl-bar i').style.transform='scaleX('+(LD.p/100).toFixed(3)+')';e.querySelector('.sl-pct').textContent=Math.round(LD.p)+'%';e.setAttribute('aria-valuenow',Math.round(LD.p));}if(LD.p>=100)ldDone();}
    function toFirstKey(){if(view.name!=='tour'||!S.units||!S.units.length)return;const K=tourKeys();tween=null;Object.assign(view,viewFrom(K[0].cam,K[0].tgt));apply();tour.k=0;tour.t=0;tour.first=false;tour.top=false;}
    // the bar leaves only once the first real frame (the store from the street) has been drawn under it: never a glimpse of a wall
    function ldDone(){if(LD.done)return;LD.done=true;if(DIAG)dlog('зареждането приключи за '+((performance.now()-LD.t0)/1000).toFixed(1)+' s');toFirstKey();try{renderer.render(scene,camera);}catch(e){}
      if(LD.el)requestAnimationFrame(()=>requestAnimationFrame(()=>{LD.el.classList.add('out');setTimeout(()=>{LD.el.hidden=true;},600);}));kick();}
    function ldTick(){if(LD.done)return;const G=window.KL_GLTF,need=(G&&G.total)||19,now_=performance.now();let mp=1;if(G&&!G.failed)mp=Math.min(1,(G.doneN||0)/need);
      // last stretch behind the bar: everything to the GPU, then a few seconds of measured frames so a slow phone settles its quality here, not during the presentation
      if(LD.base>=45&&(mp>=1||now_-LD.t0>16000)){if(!LD.settle){LD.settle=now_;toFirstKey();warmModels();warm();pf.t=0;pf.n=0;pf.w=0;pf.ok=0;}
        const st=now_-LD.settle;ldSet(92+Math.min(7,st/600));if(st>1000&&(pf.ok||st>6500))ldSet(100);return;}
      ldSet((LD.base||0)+(92-(LD.base||0))*(LD.base>=45?mp:0));}
    function build(){
      clearRoom();const t0=performance.now();OBS.length=0;FACES.length=0;LBLS.length=0;if(window.__perf)window.__perf.done=0;
      const r=row(),A=r.area,Hh=H();const shape=(r.n%5===0&&A>120)?'L':(r.n%3===0?'sq':'rect');let W=Math.sqrt(A*(shape==='sq'?1.05:1.45)),D=A/W;if(D<3.8){D=3.8;W=A/D;}
      const hw=W/2,hd=D/2,t=.12,yM=Math.min(2.55,Hh-.35),phone=small(),dens=phone?2.6:1;
      const store_=A>=120,sw=store_?Math.min(4,W*.26):0,sd=store_?Math.min(3.4,D*.38):0;
      const wine=A>150,yF=wine?-.12:0;
      const zTop=-hd+Math.max(wine?4.9:2.3,store_?sd+.9:0),zBot=hd-4.0,len=zBot-zTop,zW=wine?zTop-2.4:-hd;
      S={A,W,D,H:Hh,hw,hd,sw,sd,hasStore:store_,units:[],shape,yF,zW,wine};
      const B='#7a1f2b',BD='#4a1119',BLK='#161616',STEEL='#c9cdd1',WHT='#ece9e2';
      const FAM={bottle:[],can:[],carton:[],pack:[],bag:[]};const put=(f,x,y,z,sx,sy,sz,c)=>FAM[f].push([x,y,z,sx,sy,sz,c]);
      const strips=[],glassAcc=[],headAcc=[[],[],[]],aoAcc=[],aoVAcc=[];const shade=(x,y,z,L,side)=>{const g=new T.PlaneGeometry(L,.16);g.rotateY(side);g.translate(x,y-.1,z);aoVAcc.push(g);};const ao=(x,z,L,dx,dz)=>{const g=new T.PlaneGeometry(.42,L);g.rotateX(-Math.PI/2);g.rotateY(dx>0?0:dx<0?Math.PI:dz>0?-Math.PI/2:Math.PI/2);g.translate(x+dx*.21,.007,z+dz*.21);aoAcc.push(g);};
      const rail=(x,y,z,L,ry)=>{const sg=new T.PlaneGeometry(L,.04);sg.rotateY(ry);sg.translate(x,y,z);const uv=sg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*L/.96);strips.push(sg);};
      // floor (two levels when the wine corner is a step down)
      M.floor.map.repeat.set(W/1.2,D/1.2);M.floor.roughnessMap.repeat.set(W/1.2,D/1.2);
      const addFloor=(z0,z1,y)=>{const g=new T.PlaneGeometry(W,z1-z0);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*(z1-z0)/D);g.rotateX(-Math.PI/2);g.translate(0,y,(z0+z1)/2);const m=new T.Mesh(g,M.floor);m.receiveShadow=true;room.add(m);};
      if(wine){addFloor(zW,hd,0);addFloor(-hd,zW,yF);cbox(W,.12,.05,BD,0,-.06,zW+.025);}else addFloor(-hd,hd,0);
      const gp=[];for(let i=1;i<Math.ceil(W);i++){const x=-hw+i;if(x<hw)gp.push(x,.004,-hd,x,.004,hd);}for(let i=1;i<Math.ceil(D);i++){const z=-hd+i;if(z<hd)gp.push(-hw,.004,z,hw,.004,z);}
      const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(gp,3));room.add(new T.LineSegments(gg,gridMat));
      // ceiling: white tile grid
      M.ceil.map.repeat.set(W/1.2,D/1.2);const cp=new T.Mesh(new T.PlaneGeometry(W,D),M.ceil);cp.rotation.x=Math.PI/2;cp.position.y=Hh-.005;room.add(cp);S.ceilPlane=cp;
      // walls: burgundy, oak skirting; the right wall stays low so the diorama reads as a cut-away
      const wh=Hh-yF,wy=(Hh+yF)/2;
      box(W+2*t,wh,t,M.wallB,0,wy,-hd-t/2);box(t,wh,D,M.wallL,-hw-t/2,wy,0);box(t,.32,D,M.wall,hw+t/2,.16,0);
      ao(0,-hd+.45,W,0,1);ao(-hw,0,D,1,0);ao(0,hd-.05,W,0,-1);
      box(W,.1,.03,M.oak,0,yF+.05,-hd+.016);box(.03,.1,D-(hd-zW),M.oak,-hw+.016,.05,(zW+hd)/2);if(wine)box(.03,.1,zW+hd,M.oak,-hw+.016,yF+.05,(-hd+zW)/2);box(.03,.1,D,M.oak,hw-.016,.05,0);
      // glass front with dark frames, double glass door, white header above the door (the diffuser sits on it)
      const doorW=Math.min(1.8,Math.max(1.3,W*.2)),doorX=hw-Math.max(1.3,W*.2)-doorW/2,gH=Hh*.78;S.door={x:doorX,w:doorW};
      [[-hw,doorX-doorW/2],[doorX+doorW/2,hw]].forEach(([a,b])=>{const w=b-a;if(w<.05)return;box(w,.34,t,M.wall,(a+b)/2,.17,hd+t/2);box(w,.1,.03,M.oak,(a+b)/2,.05,hd-.016);const g=new T.PlaneGeometry(w,gH-.34);g.translate((a+b)/2,.34+(gH-.34)/2,hd+t/2);glassAcc.push(g);
        for(let x=a+1.2;x<b-.3;x+=1.2)cbox(.06,gH-.34,.08,BLK,x,.34+(gH-.34)/2,hd+t/2);cbox(w,.06,.08,BLK,(a+b)/2,gH,hd+t/2);});
      box(W+2*t,Hh-gH,t,M.wallF,0,(Hh+gH)/2,hd+t/2);
      cbox(.08,2.3,.12,BLK,doorX-doorW/2,1.15,hd+t/2);cbox(.08,2.3,.12,BLK,doorX+doorW/2,1.15,hd+t/2);cbox(doorW+.08,.08,.12,BLK,doorX,2.3,hd+t/2);
      LAYER=vaccF;cbox(doorW+.16,gH-2.34,.1,WHT,doorX,2.34+(gH-2.34)/2,hd+t/2);LAYER=null;
      {// automatic sliding door: two glass leaves in black frames; they open when someone comes near and close behind them
        S.doorLeaves=[];S.doorK=0;const lw=doorW/2;
        for(const s of [-1,1]){const lf=new T.Group(),gl=new T.Mesh(new T.PlaneGeometry(lw-.06,2.16),M.glassC);gl.position.y=1.13;gl.renderOrder=3;
          const fr=new T.Mesh(mergeColored([[new T.BoxGeometry(lw,.05,.045).translate(0,.05,0),BLK],[new T.BoxGeometry(lw,.05,.045).translate(0,2.2,0),BLK],[new T.BoxGeometry(.035,2.2,.045).translate(-lw/2+.018,1.13,0),BLK],[new T.BoxGeometry(.035,2.2,.045).translate(lw/2-.018,1.13,0),BLK]]),M.vc);
          lf.add(gl,fr);lf.userData.x0=doorX+s*lw/2;lf.userData.s=s;lf.position.set(lf.userData.x0,0,hd+t/2-.035);room.add(lf);S.doorLeaves.push(lf);}
        cbox(.26,.06,.07,'#202020',doorX,2.2,hd-.02);cgeo(new T.SphereGeometry(.012,6,4),'#d23b2e',doorX+.09,2.17,hd-.055);
        const sx=(hw-(doorX+doorW/2)>.75)?doorX+doorW/2+.36:doorX-doorW/2-.36; // signs on the fixed glass beside the sliding door
        const sg=new T.Mesh(new T.PlaneGeometry(.34,.22),M.signOpen);sg.position.set(sx,1.75,hd+t/2+.03);room.add(sg);S.sign=sg;
        const sg2=new T.Mesh(new T.PlaneGeometry(.34,.22),M.signOpen);sg2.rotation.y=Math.PI;sg2.position.set(sx,1.75,hd+t/2-.03);room.add(sg2);S.sign2=sg2;
        const cc=new T.Mesh(new T.PlaneGeometry(.26,.36),M.cctv);cc.position.set(sx,1.32,hd+t/2-.02);room.add(cc);
        {const hk='n'+hm(HRS.wd.open)+hm(HRS.wd.close)+hm(HRS.sun.open)+hm(HRS.sun.close);M.hrsNote=M.hrsNote||{};if(!M.hrsNote[hk])M.hrsNote[hk]=new T.MeshBasicMaterial({map:tex2(128,180,(g,w,h)=>{g.fillStyle='#c8102e';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.textAlign='center';g.font='800 22px Inter, Arial';g.fillText('АВАНТИ',w/2,36);g.font='600 12px Inter, Arial';g.fillText('Работно време',w/2,72);g.font='600 13px Inter, Arial';g.fillText('пон.–съб.',w/2,100);g.fillText(hm(HRS.wd.open)+'–'+hm(HRS.wd.close),w/2,118);g.fillText('нед.',w/2,144);g.fillText(hm(HRS.sun.open)+'–'+hm(HRS.sun.close),w/2,162);})});const hn=new T.Mesh(new T.PlaneGeometry(.21,.3),M.hrsNote[hk]);hn.position.set(sx,1.02,hd+t/2+.03);room.add(hn);}} /* the hours on the door, as on the chain's doors */
      const eg=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(W,Hh,D)),edgeMat);eg.position.y=Hh/2;room.add(eg);
      const mat=new T.Mesh(new T.PlaneGeometry(doorW+.2,1.0),M.mat);mat.rotation.x=-Math.PI/2;mat.position.set(doorX,.006,hd-.6);mat.receiveShadow=true;room.add(mat);
      // light bordered floor inlays in the entry zone
      for(let i=-1;i<=1;i++){const ix=doorX+i*1.3,iz=hd-1.9;if(ix>-hw+.8&&ix<hw-.8){cbox(.62,.004,.62,'#a88a4e',ix,.002,iz);cbox(.56,.005,.56,'#0c0c0c',ix,.003,iz);}}
      // exterior: black fascia with red АВАНТИ + subtitle, poster, canopy with round downlights, pavement, steps, ramp with railing, street backdrop
      {const fz=hd+t+.05;LAYER=vaccF;cbox(W+2*t+.3,Hh-gH+.35,.1,'#151515',0,(Hh+gH)/2+.1,fz);LAYER=null;const fp=new T.Mesh(new T.PlaneGeometry(Math.min(W,9),Hh-gH+.2),M.facade);fp.position.set(doorX,(Hh+gH)/2+.08,fz+.06);room.add(fp);
        // only the real АВАНТИ sign on the fascia (no floating copy above the store)
        const ps=new T.Mesh(new T.PlaneGeometry(1.4,2.1),M.adPoster);ps.position.set(Math.min(hw-.9,doorX+doorW/2+1.3),1.35,hd+t/2+.026); // 4 mm behind the open/closed sign, which can overlap it in a narrow frontroom.add(ps);
        LAYER=vaccF;cbox(doorW+3.2,.14,1.7,'#1c1c1c',doorX+.4,gH+.02,hd+.95);for(let i=-1;i<=1;i+=2){const dl=new T.CylinderGeometry(.13,.13,.02,12);cgeo(dl,'#ffffff',doorX+.4+i*.9,gH-.06,hd+1.0);}LAYER=null;
        const av=new T.Mesh(new T.PlaneGeometry(.3,.4),M.avantiRed);av.position.set((hw-(doorX+doorW/2)>.75)?doorX+doorW/2+.36:doorX-doorW/2-.36,.85,hd+t/2+.02);room.add(av);
        cbox(doorW+3.6,.45,1.75,'#9a9a98',doorX+.4,-.225,hd+.875);cbox(W+2*t,.45,.6,'#8f8f8d',0,-.225,hd+.3);
        for(let i=0;i<3;i++)cbox(doorW+1.0,.15,.32,'#a8a8a6',doorX,-.075-i*.15,hd+1.75+.16+i*.32);
        {const rx=doorX+doorW/2+1.3,a=Math.atan2(.45,2.4);const rg=new T.BoxGeometry(1.2,.06,2.45);rg.rotateX(a);rg.translate(rx,-.24,hd+1.75+1.2);vacc.push([rg,'#a3a3a1']);
          for(const s of [-1,1]){const px=rx+s*.6;[0,1.2,2.4].forEach((d,k)=>cgeo(new T.CylinderGeometry(.02,.02,.9,6),'#8a8f96',px,-d/2.4*.45+.45,hd+1.75+d,true));const bg=new T.CylinderGeometry(.016,.016,2.5,6);bg.rotateX(Math.PI/2-a);cgeo(bg,'#8a8f96',px,.66,hd+1.75+1.2,true);}}
        const gr=new T.Mesh(new T.PlaneGeometry(W+30,16),M.asphalt);gr.rotation.x=-Math.PI/2;gr.position.set(0,-.46,hd+8.5);room.add(gr);
        const bd=new T.Mesh(new T.PlaneGeometry(W+30,5),M.street);bd.rotation.y=Math.PI;bd.position.set(0,2.0,hd+13);room.add(bd);
        // green exit sign above the door (inside), CCTV domes on the ceiling
        const ex=new T.Mesh(new T.PlaneGeometry(.34,.14),M.exit);ex.position.set(doorX+doorW/2-.3,gH-.12,hd-.08);ex.rotation.y=Math.PI;room.add(ex);cbox(.34,.14,.03,'#1f7a3e',doorX+doorW/2-.3,gH-.12,hd-.06);
        LAYER=vaccC;[[doorX-2,hd-1.2],[0,0],[-hw*.5,-hd*.5],[hw*.55,-hd*.35],[-hw*.55,hd*.25],[hw*.5,hd*.55]].forEach(([x,z])=>cgeo(new T.SphereGeometry(.07,8,4,0,Math.PI*2,Math.PI/2,Math.PI/2),'#f2f2f0',x,Hh-.01,z));
        [[hw*.2,-hd*.7],[-hw*.25,-hd*.05]].forEach(([x,z])=>{cgeo(new T.CylinderGeometry(.06,.06,.03,12),'#e9e9e6',x,Hh-.015,z);cgeo(new T.SphereGeometry(.05,8,4,0,Math.PI*2,Math.PI/2,Math.PI/2),'#1b1b1d',x,Hh-.03,z);});LAYER=null;}
      // entrance: red basket stack (left of the door), chest freezer + Milka fridge + Haribo stand (right of the door)
      {const bx=doorX-doorW/2-.35,bz=hd-.55;blk(bx,bz,.5,.36);for(let i=0;i<5;i++){cbox(.46,.2,.32,'#d0212b',bx,.1+i*.075,bz);cbox(.5,.03,.36,'#a8191f',bx,.21+i*.075,bz);}
        const rx=doorX+doorW/2;if(hw-rx>1.9){const fx=rx+.95,fz=hd-.72;blk(fx,fz,1.35,.72);cbox(1.35,.82,.72,'#1fb5b0',fx,.41,fz);cbox(1.35,.05,.72,'#eef2f2',fx,.85,fz);cbox(1.2,.02,.5,'#bfe6f0',fx,.88,fz);cbox(1.35,.06,.72,'#0e7d79',fx,.03,fz);
          const mx=Math.min(hw-.42,rx+2.0),mz=hd-.6;blk(mx,mz,.72,.7);face(mx-.36,mz,-1,0,'milka');cbox(.72,1.95,.7,'#5b2d8e',mx,.975,mz);const mg=new T.PlaneGeometry(.6,1.5);mg.rotateY(Math.PI);mg.translate(mx,1.05,mz-.352);glassAcc.push(mg);box(.6,1.5,.02,M.cool,mx,1.05,mz-.3,false);
          [.45,.85,1.25,1.65].forEach(y=>{cbox(.6,.02,.5,'#e6e8ea',mx,y,mz);for(let x=mx-.24;x<mx+.24;x+=.09*dens)put('pack',x,y+.01,mz-.2,.07,.12,.16,pick_(['#5b2d8e','#e8e2d6','#3a2410','#2f6fb5']));});
          const ml=new T.Mesh(new T.PlaneGeometry(.66,1.6),M.milka);ml.rotation.y=-Math.PI/2;ml.position.set(mx-.364,1.05,mz);room.add(ml);
          const hx=rx+1.7,hz=hd-1.55;blk(hx,hz,.5,.42);face(hx,hz+.2,0,1,'haribo');cbox(.44,1.35,.36,'#f5c400',hx,.675,hz);cbox(.5,.05,.42,'#f5c400',hx,.03,hz);const hb=new T.Mesh(new T.PlaneGeometry(.44,.17),M.haribo);hb.position.set(hx,1.45,hz+.18);room.add(hb);
          for(let lv=0;lv<4;lv++)for(let i=0;i<3;i++)put('bag',hx-.14+i*.14,.2+lv*.3,hz+.2,.11,.2,.05,pick_(['#f5c400','#c8382e','#3c7a3e','#f28c28','#2f6fb5']));
          {const wx=rx+.42,wz=hd-1.38;blk(wx,wz,.36,.26);for(const sg of [1,-1]){const pn=new T.BoxGeometry(.3,.62,.012);pn.rotateX(-.17*sg);cgeo(pn,'#f4c20d',wx,.31,wz+.053*sg);const pc=new T.BoxGeometry(.13,.15,.004);pc.rotateX(-.17*sg);cgeo(pc,'#1c1c1c',wx,.36,wz+.061*sg);const pb=new T.BoxGeometry(.24,.035,.004);pb.rotateX(-.17*sg);cgeo(pb,'#1c1c1c',wx,.17,wz+.068*sg);}}}} /* „мокър под“: the folding warning sign by the door */
      // checkout: oak counter, black POS, terminal, printer, green-vest cashier; cigarette wall behind
      const ckW=Math.min(A<60?1.5:2.2,W*.25),ckX=Math.max(-hw+ckW/2+.35,doorX-doorW/2-ckW/2-.9),ckZ=hd-1.15;
      blk(ckX,ckZ+.39,ckW,1.38);ao(ckX,ckZ+.3,ckW,0,1);ao(ckX+ckW/2,ckZ,.6,1,0);box(ckW,1,.6,M.oak,ckX,.5,ckZ);cbox(ckW+.04,.04,.64,'#3a2a1e',ckX,1.02,ckZ);cbox(ckW,.06,.02,BLK,ckX,.03,ckZ-.29); // a 60 cm counter, as in small shops: the customer and the cashier each reach about 45 cm to the middle
      {const po=new T.Mesh(new T.PlaneGeometry(.6,.5),M.poster);po.position.set(ckX+ckW/2-.5,.55,ckZ+.31);room.add(po);
        const px=ckX+ckW/2-.4,mx=px-.38,mz=ckZ+.18;cbox(.3,.02,.2,BLK,mx,1.05,mz);cbox(.03,.14,.03,BLK,mx,1.12,mz); /* the POS on the cashier's left: stand and screen together, the screen turned to her */
        const mon=new T.Group();mon.position.set(mx,1.3,mz);mon.rotation.y=Math.atan2(px-mx,ckZ+.43-mz);mon.rotation.x=-.15; /* screen with the data turned to face the cashier behind the counter */const bz=new T.Mesh(new T.BoxGeometry(.34,.24,.02),M.unit);const sc=new T.Mesh(new T.PlaneGeometry(.31,.21),M.screen);sc.position.z=.011;mon.add(bz,sc);room.add(mon);S.screen=sc;
        const term=new T.Group();term.position.set(px-.48,1.06,ckZ-.2);term.rotation.y=Math.PI; /* keypad toward the customer, who stands in front of the counter */term.rotation.x=-.3; /* the card terminal stands at the customer's end, within reach */const tb=new T.Mesh(new T.BoxGeometry(.085,.03,.15),M.unit);const ts=new T.Mesh(new T.PlaneGeometry(.06,.035),M.screen2);ts.rotation.x=-Math.PI/2;ts.position.set(0,.016,-.045);const keys=new T.Mesh(new T.PlaneGeometry(.06,.06),M.keys);keys.rotation.x=-Math.PI/2;keys.position.set(0,.016,.03);term.add(tb,ts,keys);room.add(term);S.termP=[term.position.x,term.position.y,term.position.z];
        cbox(.16,.1,.2,BLK,mx-.24,1.09,ckZ+.12);cbox(.1,.02,.02,WHT,mx-.24,1.15,ckZ+.03);cbox(.06,.06,.06,BLK,ckX-ckW/2+.3,1.07,ckZ+.15);S.cashier=[px,ckZ+.43];
        {const cx=px+.42,cz=ckZ+.56,ya=-.5,P=(lx,lz)=>[cx+lx*Math.cos(ya)+lz*Math.sin(ya),cz-lx*Math.sin(ya)+lz*Math.cos(ya)]; /* her office chair, rolled aside while she stands at the till: five chrome legs on castors, a gas column, a black seat, a mesh back */
          for(let k=0;k<5;k++){const a=ya+k*Math.PI*2/5,lg=new T.BoxGeometry(.27,.025,.035);lg.translate(.135,0,0);lg.rotateY(a);cgeo(lg,'#b9bdc3',cx,.075,cz,true);cgeo(new T.SphereGeometry(.026,8,6),'#1a1a1a',cx+Math.cos(a)*.27,.028,cz-Math.sin(a)*.27);}
          cgeo(new T.CylinderGeometry(.024,.03,.34,10),'#c7cbd1',cx,.25,cz,true);const st=new T.BoxGeometry(.46,.07,.44);st.rotateY(ya);cgeo(st,'#1d1d1f',cx,.46,cz);
          const [bx_,bz_]=P(0,.21),bk=new T.BoxGeometry(.42,.5,.03);bk.rotateX(.12);bk.rotateY(ya);cgeo(bk,'#232326',bx_,.82,bz_);const [sx_,sz_]=P(0,.2),sp_=new T.BoxGeometry(.05,.3,.03);sp_.rotateY(ya);cgeo(sp_,'#2a2a2c',sx_,.57,sz_);}}
      // at the counter, as in the shops of the chain: a bean-to-cup coffee machine at the customers' end of the counter with the paper
      // cups (on a red stand, as seen there), lids and sugar beside it and its price list on a small screen; on a long counter a heated glass
      // case of pastries; over the counter a ceiling-hung screen running the shop's adverts
      {const cy=1.04,x0=ckX-ckW/2,pxC=ckX+ckW/2-.4,mxC=Math.max(x0+.2,pxC-.92),mzC=ckZ+.07,DK='#1c1c1e',SL='#b9bdc3',F=1; /* F: the front (panel, spouts, tray) is on the cashier's side (+z) */
        cbox(.32,.5,.42,DK,mxC,cy+.25,mzC);cbox(.3,.3,.012,SL,mxC,cy+.3,mzC+.215);cbox(.13,.06,.004,'#0b1620',mxC,cy+.42,mzC+.222);cbox(.11,.04,.002,'#7fd0ff',mxC,cy+.42,mzC+.225); /* body, brushed front, display */
        cbox(.09,.05,.07,SL,mxC,cy+.2,mzC+.2);cgeo(new T.CylinderGeometry(.006,.006,.03,6),SL,mxC-.015,cy+.165,mzC+.215);cgeo(new T.CylinderGeometry(.006,.006,.03,6),SL,mxC+.015,cy+.165,mzC+.215); /* the outlet with its two spouts */
        cbox(.26,.02,.13,'#8f959b',mxC,cy+.012,mzC+.17);cbox(.24,.004,.11,'#2a2b2e',mxC,cy+.024,mzC+.17); /* drip tray and grid */
        cgeo(new T.CylinderGeometry(.065,.055,.11,14),'#4a2c16',mxC-.06,cy+.56,mzC-.08);cgeo(new T.CylinderGeometry(.07,.07,.014,14),'#242426',mxC-.06,cy+.62,mzC-.08); /* bean hopper (beans showing) and its lid */
        const cx_=mxC+.3,cz_=ckZ-.14;cgeo(new T.CylinderGeometry(.11,.11,.02,16),'#c41e1e',cx_,cy+.01,cz_);[[-.05,-.03,.34],[.05,-.03,.3],[0,.06,.26]].forEach(([dx,dz,h])=>cgeo(new T.CylinderGeometry(.04,.03,h,12),'#f4f4f2',cx_+dx,cy+.02+h/2,cz_+dz)); /* cup stacks */
        cgeo(new T.CylinderGeometry(.042,.042,.12,12),'#1b1b1d',cx_+.13,cy+.08,cz_+.05);cbox(.1,.07,.07,'#6b4a2b',cx_+.14,cy+.035,cz_-.08); /* lids, sugar and stirrers */
        // what the cashier needs when a coffee is ordered: where she stands at the machine, the cup stack, the panel, the place under the spouts, the lids, where she sets the cup down for the customer
        {const cup=new T.Group(),cb=new T.Mesh(mergeColored([[new T.CylinderGeometry(.04,.03,.11,14).translate(0,.055,0),'#f4f4f2'],[new T.CylinderGeometry(.0405,.0405,.035,14,1,true).translate(0,.06,0),'#c8102e']]),M.vc2),ld=new T.Mesh(mergeColored([[new T.CylinderGeometry(.042,.042,.012,14).translate(0,.116,0),'#1b1b1d']]),M.vc2);cup.add(cb,ld);cup.visible=false;room.add(cup);
          const stm=new T.Mesh(new T.CylinderGeometry(.003,.003,1,6).translate(0,-.5,0),new T.MeshStandardMaterial({color:0x5a3010,roughness:.3}));stm.material.userData.own=true;stm.visible=false;room.add(stm);
          const sm=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffffff,transparent:true,opacity:0,depthWrite:false}));sm.material.userData.own=true;sm.scale.set(.12,.18,1);sm.visible=false;room.add(sm);
          S.coffee={sx:mxC,cups:[cx_,cy+.36,cz_-.03],btn:[mxC+.04,cy+.42,mzC+.23],under:[mxC,cy+.026,mzC+.17],spout:[mxC,cy+.15,mzC+.215],lids:[cx_+.13,cy+.15,cz_+.05],give:[pxC-.2,cy+.002,ckZ-.16],cup,lid:ld,stream:stm,steam:sm,owner:null,carrier:null};}
        if(!M.coffMenu)M.coffMenu=new T.MeshBasicMaterial({map:tex2(128,224,(g,w,h)=>{g.fillStyle='#14100c';g.fillRect(0,0,w,h);g.fillStyle='#c9a656';g.font='700 15px Inter, Arial';g.textAlign='center';g.fillText('КАФЕ',w/2,24);g.font='500 11px Inter, Arial';g.textAlign='left';[['Еспресо','1,00 €'],['Дълго кафе','1,20 €'],['Капучино','1,60 €'],['Лате','1,80 €'],['Горещ шоколад','1,60 €'],['Чай','1,00 €']].forEach(([a,b],i)=>{g.fillStyle='#f3ece0';g.fillText(a,10,56+i*26);g.fillStyle='#c9a656';g.textAlign='right';g.fillText(b,w-10,56+i*26);g.textAlign='left';});g.fillStyle='#8a6d2e';g.fillRect(10,h-26,w-20,2);g.fillStyle='#f3ece0';g.font='500 10px Inter, Arial';g.textAlign='center';g.fillText('и за из път',w/2,h-10);})});
        cbox(.15,.25,.02,DK,mxC+.04,cy+.78,mzC-.17);cgeo(new T.CylinderGeometry(.01,.01,.26,6),DK,mxC+.04,cy+.52,mzC-.17);{const mm=new T.Mesh(new T.PlaneGeometry(.13,.23),M.coffMenu);mm.position.set(mxC+.04,cy+.78,mzC-.181);mm.rotation.y=Math.PI;room.add(mm);} /* the price list on its screen, turned to the customers */
        {if(!M.vipStand)M.vipStand=new T.MeshBasicMaterial({map:tex2(96,128,(g,w,h)=>{g.fillStyle='#0f5a32';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.textAlign='center';g.font='800 13px Inter, Arial';g.fillText('АВАНТИ',w/2,22);g.fillStyle='#ffd400';g.font='800 22px Inter, Arial';g.fillText('VIP',w/2,52);g.fillStyle='#fff';g.font='600 10px Inter, Arial';g.fillText('Клуб',w/2,68);g.fillText('Попитай',w/2,96);g.fillText('за VIP карта',w/2,110);})});const vx=pxC-.02,vz=ckZ-.24;cbox(.09,.012,.05,'#d8dde2',vx,cy+.006,vz);const vs=new T.Mesh(new T.PlaneGeometry(.075,.1),M.vipStand);vs.position.set(vx,cy+.062,vz-.005);vs.rotation.set(-.2,Math.PI,0);room.add(vs);}
        if(ckW>=1.9){const wx=x0+.34,wz=ckZ-.1;cbox(.46,.03,.36,DK,wx,cy+.015,wz);cbox(.46,.03,.36,DK,wx,cy+.34,wz);for(const sx of [-1,1])cbox(.015,.32,.36,DK,wx+sx*.222,cy+.18,wz);const gg=new T.BoxGeometry(.43,.3,.34);gg.translate(wx,cy+.18,wz);glassAcc.push(gg);
          cbox(.43,.006,.33,'#c9c9c9',wx,cy+.17,wz);for(let i=0;i<6;i++)cgeo(new T.SphereGeometry(.035,8,6),i%2?'#d79a3a':'#c8843a',wx-.15+(i%3)*.15,cy+.05+(i>2?.15:0),wz-.06+(i>2?.06:0));cbox(.4,.005,.3,'#ffcf7a',wx,cy+.33,wz);} /* heated pastry case: glass, two trays, warm light */
        // the advert screen over the counter (a 55" panel on two rods from the ceiling), slides changing with a soft cross-fade
        if(!M.adTex){const sl=(bg,fn)=>tex2(512,288,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);fn(g,w,h);});const T1=(g,t,y,sz,c,wt)=>{g.fillStyle=c||'#fff';g.font=(wt||800)+' '+sz+'px Inter, Arial';g.textAlign='center';g.fillText(t,256,y);};
          // the chain's own messages (its slogans, its campaigns: ШОК ЦЕНА, the VIP Club and its green tags, weekend discounts, Играй и спечели!)
          M.adTex=[sl('#111',(g,w,h)=>{T1(g,'АВАНТИ',128,72,'#e0202c');T1(g,'Най-доброто е точно пред ТЕБ!',196,27);}),
            sl('#ffd400',(g,w,h)=>{g.fillStyle='#e0202c';g.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?92:120;g.lineTo(256+Math.cos(a)*r*1.9,118+Math.sin(a)*r*.62);}g.closePath();g.fill();T1(g,'ШОК ЦЕНА',138,58,'#fff');T1(g,'ликьори · уиски · джин · вино',222,24,'#1c1c1c',700);T1(g,'търси жълтите етикети',258,19,'#5a4a00',600);}),
            sl('#0f5a32',(g,w,h)=>{T1(g,'АВАНТИ VIP Клуб',80,40);T1(g,'Безплатна VIP карта',138,30,'#d8f5e2',700);T1(g,'специални цени · без обвързване',182,22,'#d8f5e2',600);T1(g,'Попитай на касата!',246,30,'#ffd400');}),
            sl('#1f9d4a',(g,w,h)=>{g.fillStyle='#fff';g.fillRect(156,36,200,70);g.fillStyle='#1f9d4a';g.font='800 34px Inter, Arial';g.textAlign='center';g.fillText('VIP',256,84);T1(g,'Зелени етикети',160,38);T1(g,'неограничено пазаруване',206,24,'#eafff1',600);T1(g,'с VIP карта',244,24,'#eafff1',600);}),
            sl('#c8102e',(g,w,h)=>{T1(g,'ОТСТЪПКИ',100,56);T1(g,'всяка събота и неделя',160,30,'#fff',700);T1(g,'+ промоции два пъти месечно',230,24,'#ffe8a0',600);}),
            sl('#2a1240',(g,w,h)=>{T1(g,'ИГРАЙ И СПЕЧЕЛИ!',100,46,'#ffd400');T1(g,'награди: вина и уиски',162,28,'#fff',700);T1(g,'следи ни във Facebook',224,24,'#cdb8ff',600);}),
            sl('#f7f3ec',(g,w,h)=>{T1(g,'Истински продукти',104,40,'#c8102e');T1(g,'на честни цени',156,40,'#c8102e');T1(g,'над 5000 артикула · алкохол · цигари · сладко',228,19,'#333',600);}),
            sl('#2b1a10',(g,w,h)=>{T1(g,'КАФЕ ЗА ИЗ ПЪТ',84,40,'#ffcf7a');g.fillStyle='#fff';g.beginPath();g.moveTo(216,112);g.lineTo(296,112);g.lineTo(288,212);g.lineTo(224,212);g.closePath();g.fill();g.fillStyle='#c8102e';g.fillRect(220,138,72,22);T1(g,'прясно смляно, на касата',258,24,'#f3ece0',600);})];}
        {const hk=hm(HRS.wd.open)+hm(HRS.wd.close)+hm(HRS.sun.open)+hm(HRS.sun.close);M.adHours=M.adHours||{};if(!M.adHours[hk])M.adHours[hk]=tex2(512,288,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.textAlign='center';g.fillStyle='#e0202c';g.font='800 40px Inter, Arial';g.fillText('АВАНТИ',256,74);g.fillStyle='#fff';g.font='700 28px Inter, Arial';g.fillText('Работно време',256,130);g.font='600 30px Inter, Arial';g.fillText('пон.–съб.  '+hm(HRS.wd.open)+'–'+hm(HRS.wd.close),256,188);g.fillText('нед.  '+hm(HRS.sun.open)+'–'+hm(HRS.sun.close),256,236);});S.adSlides=M.adTex.concat([M.adHours[hk]]);} /* this shop's own hours */
        const ay=Math.min(Hh-.5,2.55),ax=ckX,az=ckZ-.42;cbox(1.24,.71,.05,'#0d0d0f',ax,ay,az);for(const sx of [-.4,.4])cgeo(new T.CylinderGeometry(.012,.012,Math.max(.05,Hh-ay-.35),6),'#2a2a2c',ax+sx,(Hh+ay+.35)/2,az+.01);
        const pA=new T.Mesh(new T.PlaneGeometry(1.2,.675),new T.MeshBasicMaterial({map:M.adTex[0]})),pB=new T.Mesh(new T.PlaneGeometry(1.2,.675),new T.MeshBasicMaterial({map:M.adTex[1],transparent:true,opacity:0,depthWrite:false}));
        pA.material.userData.own=pB.material.userData.own=true;pA.position.set(ax,ay,az-.027);pB.position.set(ax,ay,az-.028);pA.rotation.y=pB.rotation.y=Math.PI;pB.renderOrder=2;room.add(pA,pB);S.ads={A:pA,B:pB,i:Math.floor(Math.random()*9)};}
      label('Каса',ckX,1.5,ckZ);
      // tobacco, as in the chain's shops: the gantry on the wall right behind the cashier, at arm's length when she turns round (a dark unit,
      // lit shelves, the packs in rows with price strips, closed cupboards below, its sign and the 18+ notice); the fire extinguisher by the side wall
      {const gx0=ckX-ckW/2+.04,gx1=ckX+ckW/2-.04,gw=gx1-gx0,gc=(gx0+gx1)/2,gz=hd-.17;if(gw>.8){blk(gc,gz,gw,.34); /* as in the shops here: a closed back cupboard with a worktop, and above it, up high, the lit tobacco cabinet within the cashier's reach */
        cbox(gw,.9,.34,'#232326',gc,.45,gz);cbox(gw+.02,.03,.36,'#3a2a1e',gc,.915,gz-.01);for(let x=gx0+.3;x<gx1-.1;x+=.55)cbox(.12,.02,.005,'#9aa0a6',x,.7,gz-.172); /* the cupboard, its worktop, the handles */
        cbox(gw,.98,.02,'#1b1b1e',gc,1.74,gz+.15);cbox(.02,.98,.3,'#111',gx0,1.74,gz+.01);cbox(.02,.98,.3,'#111',gx1,1.74,gz+.01);cbox(gw,.06,.32,'#111',gc,2.25,gz); /* the upper cabinet */
        for(let lv=0;lv<5;lv++){const y=1.3+lv*.19;cbox(gw-.04,.012,.29,'#2c2c30',gc,y,gz-.005);cbox(gw-.04,.018,.004,'#f4f4f2',gc,y+.004,gz-.152);cbox(gw-.06,.004,.006,'#fff1cc',gc,y+.18,gz-.13); /* shelf, white price strip, LED under the shelf above */
          for(let x=gx0+.05;x<gx1-.04;x+=.064*dens)put('pack',x,y+.012,gz-.12,.055,.088,.022,pick_(['#f2f2f0','#c8102e','#1f3f7a','#c9a24a','#b7b7b7','#3a3a3a','#2f6fb5','#1d6b3a']));}
        {const sg=new T.Mesh(new T.PlaneGeometry(Math.min(gw-.1,1.6),.16),signMat('Тютюневи изделия'));sg.position.set(gc,2.36,gz-.15);sg.rotation.y=Math.PI;room.add(sg);if(!M.age18)M.age18=new T.MeshBasicMaterial({map:tex2(64,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.strokeStyle='#d0101c';g.lineWidth=6;g.beginPath();g.arc(32,32,26,0,7);g.stroke();g.fillStyle='#d0101c';g.font='800 22px Inter, Arial';g.textAlign='center';g.fillText('18+',32,40);})});const ag=new T.Mesh(new T.PlaneGeometry(.1,.1),M.age18);ag.position.set(gx1-.12,1.2,gz-.16);ag.rotation.y=Math.PI;room.add(ag);}
        label('Цигари',gc,2.5,gz);
        {const pk=new T.Mesh(mergeColored([[new T.BoxGeometry(.055,.088,.022),'#f2f2f0'],[new T.BoxGeometry(.056,.03,.023).translate(0,.03,0),'#c8102e']]),M.vc2);pk.visible=false;room.add(pk);S.cig={pack:pk,shelf:[S.cashier?S.cashier[0]:gc,1.68,gz-.16],give:[(S.cashier?S.cashier[0]:gc)+.12,1.045,ckZ-.12],owner:null,carrier:null,t:0};}}
        cgeo(new T.CylinderGeometry(.065,.065,.48,8),'#c41e1e',-hw+.16,.65,ckZ-1.15);cgeo(new T.CylinderGeometry(.03,.05,.08,8),BLK,-hw+.16,.93,ckZ-1.15);cbox(.06,.05,.16,BLK,-hw+.1,.7,ckZ-1.15);}
      // Г-образен план: заден ъгъл е отделен (склад/офис), залата обхожда около него
      const lw=W*.38,ld=D*.42;
      if(shape==='L'){blk(-hw+(lw+t)/2,-hd+(ld+t)/2,lw+t,ld+t);box(lw,wh,t,M.wall,-hw+lw/2,wy,-hd+ld);box(t,wh,ld,M.wall,-hw+lw,wy,-hd+ld/2);box(lw,.1,.03,M.oak,-hw+lw/2,.05,-hd+ld+t/2+.016);box(.03,.1,ld,M.oak,-hw+lw+t/2+.016,.05,-hd+ld/2);
        cbox(.9,2.05,.05,'#4a4038',-hw+lw*.5,1.02,-hd+ld+t/2+.03);label('Склад / офис',-hw+lw/2,1.2,-hd+ld/2);}
      // storage room
      if(store_){const zp=-hd+sd,y0=zp<zW?yF:0;blk(hw-(sw+t)/2,-hd+(sd+t)/2,sw+t,sd+t);box(sw,wh,t,M.wall,hw-sw/2,wy,zp);const side=Math.max(.6,sd-1.05);box(t,wh,side,M.wall,hw-sw,wy,-hd+side/2);box(sw,.1,.03,M.oak,hw-sw/2,y0+.05,zp+t/2+.016);
        cbox(.9,2.05,.05,'#4a4038',hw-sw/2,y0+1.02,zp+t/2+.03);cbox(.05,.05,.02,STEEL,hw-sw/2+.35,y0+1.0,zp+t/2+.07,true);label('Склад',hw-sw/2,.8,-hd+sd/2);
        cgeo(new T.CylinderGeometry(.065,.065,.48,8),'#c41e1e',hw-sw+.35,y0+.65,zp+t/2+.12);cgeo(new T.CylinderGeometry(.03,.05,.08,8),BLK,hw-sw+.35,y0+.93,zp+t/2+.12);cbox(.16,.05,.06,BLK,hw-sw+.35,y0+.7,zp+t/2+.05);}
      // wine corner: oak wall shelving on the back burgundy wall, full of bottles; a step down guarded by stainless rails
      {const x0=(shape==='L'?-hw+lw+t:-hw)+.15,x1=(store_?hw-sw:hw)-.15-(wine?1.2:0),wl=x1-x0;if(wl>1){const xm=(x0+x1)/2,nb=Math.max(1,Math.round(wl/1.0)),LV=[.4,.95,1.5];
        blk(xm,-hd+.22,wl+.1,.44);for(let x=x0+.5;x<x1-.4;x+=1)face(x,-hd+.44,0,1,'wine');
        box(wl,.12,.42,M.oak,xm,yF+.06,-hd+.21);box(wl,.05,.44,M.oak,xm,yF+2.15,-hd+.22,false);for(let i=0;i<=nb;i++)box(.04,2.1,.42,M.oak,x0+i*wl/nb,yF+1.05,-hd+.21,false);
        {const sg=new T.Mesh(new T.PlaneGeometry(Math.min(wl*.8,3),.2),signMat('Вина'));sg.position.set(xm,yF+2.32,-hd+.03);room.add(sg);}
        LV.forEach(y=>{box(wl,.03,.4,M.oak,xm,yF+y,-hd+.2,false);shade(xm,yF+y,-hd+.02,wl,0);rail(xm,yF+y+.01,-hd+.405,wl,0);for(const dz of [-hd+.13,-hd+.3])for(let x=x0+.08;x<x1-.06;x+=.1*dens){if(Math.random()<.03)continue;put('bottle',x,yF+y+.015,dz,.085,.3,.085,pick_(WINE));}});
        label('Вина',xm,yF+2.4,-hd+.3);
        if(wine&&zW+hd>2.3){const cx=x1+.65,cz=-hd+.32;blk(cx,cz,.9,.6);cbox(.85,1.8,.45,B,cx,yF+.9,cz);[.45,.95,1.45].forEach(y=>{cbox(.85,.03,.42,BD,cx,yF+y,cz);for(let i=0;i<3;i++)put('carton',cx-.26+i*.26,yF+y+.02,cz+.02,.16,.24,.14,pick_(['#c8382e','#1b1917','#e0b23a','#5a1a22']));});}
        cbox(.34,.26,.24,'#efe9dc',xm+.9,yF+1.5+.14,-hd+.21);cbox(.34,.05,.24,'#3c7a3e',xm+.9,yF+1.5+.28,-hd+.21);}}
      // glass-door drink coolers along both side walls: black cabinets, lit interiors, brand headers, LED door edges
      const coolers=(side,z0,z1,xwall,hs)=>{const n=Math.floor((z1-z0)/.74);if(n<1)return 0;const xw=xwall!=null?xwall:(side<0?-hw:hw),xc=xw-side*.37,xf=xw-side*.74,zc_=z0+n*.37,L=n*.74;hs=hs||[1,2];
        blk(xc,zc_,.76,L);for(let i=0;i<n;i++)face(xf,z0+.37+i*.74,-side,0,'cooler');
        ao(xf,zc_,L,-side,0);
        cbox(.05,2.0,L,BLK,xw-side*.025,1.0,zc_);cbox(.74,.06,L,BLK,xc,.03,zc_);cbox(.74,.06,L,BLK,xc,1.97,zc_);cbox(.74,.26,L,BLK,xc,2.13,zc_);for(let i=0;i<=n;i++)cbox(.68,1.9,.05,BLK,xc,1.0,z0+i*.74);
        box(.03,1.65,L-.1,M.cool,xw-side*.07,1.05,zc_,false);[.28,.66,1.04,1.42,1.78].forEach(y=>cbox(.55,.02,L-.1,'#e6e8ea',xc,y,zc_));
        for(let i=0;i<n;i++){const zz=z0+.37+i*.74;const gl=new T.PlaneGeometry(.64,1.72);gl.rotateY(side<0?Math.PI/2:-Math.PI/2);gl.translate(xf,1.0,zz);glassAcc.push(gl);
          cbox(.03,1.76,.03,BLK,xf,1.0,zz-.33);cbox(.03,1.76,.03,BLK,xf,1.0,zz+.33);cbox(.02,.42,.02,STEEL,xf-side*.02,1.05,zz+.27,true);box(.012,1.6,.012,M.led,xf-side*.03,1.0,zz-.3,false);box(.012,1.6,.012,M.led,xf-side*.03,1.0,zz+.3,false);
          const hp=new T.PlaneGeometry(.66,.22);hp.rotateY(side<0?Math.PI/2:-Math.PI/2);hp.translate(xf+.001*side,2.13,zz);headAcc[hs[i%hs.length]].push(hp);
          [.28,.66,1.04,1.42,1.78].forEach((y,li)=>{for(let d=0;d<3;d++){const px=xf+side*(.13+d*.17);for(let z=zz-.28;z<zz+.28;z+=(li<2?.1:li<4?.075:.1)*dens){if(Math.random()<.03)continue;if(li<2)put('bottle',px,y+.01,z,.075,.27,.075,pick_(DRINK));else if(li<4)put('can',px,y+.01,z,.064,.12,.064,pick_(CANS));else put('carton',px,y+.01,z,.08,.18,.08,pick_(['#f4f2ec','#2f6fb5','#3c7a3e','#c8382e']));}}});} // three rows deep on every level: a full fridge, as in the shops
        return n;};
      // gondolas: oak, white price rails, products by zone (spirits / sweets / coffee-tea-snacks); burgundy end panels, promo end-caps by the till
      const xs=[];if(len>1.3){for(let x=-hw+2.7;x<=hw-2.6;x+=2.6){if(shape==='L'&&x<-hw+lw+1.4)continue;xs.push(x);}}
      const zc=(zTop+zBot)/2,LV=[.3,.68,1.06,1.44],ZL={spirits:'Алкохолни напитки',sweets:'Сладки · снаксове',coffee:'Кафе · чай'},done={};
      const lz0=shape==='L'?-hd+ld+.3:zTop+.15,lz1=zBot-.3,nl=coolers(-1,lz0,lz1);if(nl)label('Хладилни витрини · напитки',-hw+1.6,2.5,lz0+nl*.37);
      xs.forEach((x,gi)=>{const zone=['spirits','sweets','coffee'][gi%3];
        if(gi===0&&nl&&xs.length>2){coolers(1,lz0,lz1,x+.5,[0]);cbox(.06,2.1,nl*.74+.1,B,x+.5,1.05,lz0+nl*.37);box(.98,1.7,.03,M.oak,x,.85,zTop+.02,false);return;}
        blk(x,zc,1.0,len+.1);ao(x-.48,zc,len,-1,0);ao(x+.48,zc,len,1,0);ao(x,zBot+.04,.96,0,1);
        if(zone==='spirits'){blk(x,zTop-.35,.96,.6);cbox(.92,1.6,.5,B,x,.8,zTop-.33);[.5,1.0].forEach(y=>cbox(.92,.03,.32,B,x,y,zTop-.72));[.52,1.02,1.6].forEach(y=>{for(let i=0;i<5;i++)put('bottle',x-.34+i*.17,y,zTop-.74+(y>1.5?.2:0),.085,.3,.085,pick_(SPIRIT));});}
        if(gi===1){cgeo(new T.CylinderGeometry(.065,.065,.48,8),'#c41e1e',x+.6,.24,zBot+.25);cgeo(new T.CylinderGeometry(.03,.05,.08,8),BLK,x+.6,.52,zBot+.25);}for(let z=zTop+.6;z<zBot-.5;z+=1){face(x-.5,z,-1,0,zone);face(x+.5,z,1,0,zone);}
        box(.08,1.7,len,M.oak,x,.85,zc);box(.96,.12,len,M.oak,x,.06,zc);box(.96,.05,len+.04,M.oak,x,1.72,zc,false);const nu=Math.max(1,Math.round(len/1.2));for(let i=0;i<=nu;i++)box(.96,1.7,.03,M.oak,x,.85,zTop+i*len/nu,false);
        cbox(.98,1.74,.04,B,x,.87,zBot+.02);cbox(.98,1.74,.04,B,x,.87,zTop-.02);
        {const sm=signMat(ZL[zone]),sw=Math.min(len*.9,2.6);for(const sd_ of [-1,1]){const sg=new T.Mesh(new T.PlaneGeometry(sw,.2),sm);sg.rotation.y=sd_>0?Math.PI/2:-Math.PI/2;sg.position.set(x+sd_*.5,1.86,zc);room.add(sg);}} // the category board on the gondola's top rail
        LV.forEach((y,li)=>{box(.92,.03,len,M.oak,x,y,zc,false);shade(x-.045,y,zc,len,-Math.PI/2);shade(x+.045,y,zc,len,Math.PI/2);
          for(const sd_ of [-1,1]){rail(x+sd_*.47,y+.01,zc,len,sd_>0?Math.PI/2:-Math.PI/2);for(const px of [x+sd_*.36,x+sd_*.19]){ // two rows deep, the front one at the rail: a stocked shelf, as in the shops
            if(zone==='spirits'){if(li===1||li===2){for(let z=zTop+.14;z<zBot-.12;z+=.14*dens)if(Math.random()>.03)put('carton',px,y+.015,z,.12,.22,.1,pick_(['#c8382e','#1b1917','#3a2410','#e0b23a','#5a1a22']));}else{for(let z=zTop+.12;z<zBot-.1;z+=.1*dens)if(Math.random()>.03)put('bottle',px,y+.015,z,.085,.3,.085,pick_(SPIRIT));}}
            else if(zone==='sweets'){if(li<2){for(let z=zTop+.12;z<zBot-.1;z+=.12*dens)if(Math.random()>.03){put('pack',px,y+.015,z,.1,.15,.06,pick_(SWEET));if(Math.random()<.6)put('pack',px,y+.165,z,.1,.15,.06,pick_(SWEET));}}else{for(let z=zTop+.14;z<zBot-.12;z+=.14*dens)if(Math.random()>.03)put('carton',px,y+.015,z,.12,.18,.09,pick_(BISC));}}
            else{if(li<2){for(let z=zTop+.12;z<zBot-.1;z+=.11*dens)if(Math.random()>.03)put('carton',px,y+.015,z,.09,.2,.07,pick_(COFFEE));}else if(li===2){for(let z=zTop+.14;z<zBot-.12;z+=.15*dens)if(Math.random()>.03)put('bag',px+sd_*.05,y+.015,z,.05,.24,.14,pick_(CHIPS));}else{for(let z=zTop+.12;z<zBot-.1;z+=.12*dens)if(Math.random()>.03){put('pack',px,y+.015,z,.1,.08,.06,pick_(TEA));if(Math.random()<.7)put('pack',px,y+.095,z,.1,.08,.06,pick_(TEA));}}}}}});
        if(!done[zone]){done[zone]=1;label(ZL[zone],x,1.95,zc+((gi%3)-1)*Math.min(2,len*.3));}});
      // promo end-caps (Coca-Cola, Milka) on the two gondolas nearest the till
      {const order=xs.map((x,i)=>[Math.abs(x-doorX),i]).filter(([,i])=>xs[i]>ckX+ckW/2+1.7).sort((a,b)=>a[0]-b[0]).slice(0,2);order.forEach(([,i],k)=>{const x=xs[i],pz=zBot+.35,red=k===0;blk(x,pz,.92,.52);cbox(.9,1.45,.5,red?'#d3232a':'#5b2d8e',x,.725+.02,pz);
          const hb=new T.Mesh(new T.PlaneGeometry(.9,.28),red?M.headCoke:M.milka);hb.position.set(x,1.62,pz+.26);room.add(hb);cbox(.02,.3,.02,BLK,x,1.62,pz+.2); /* the header's post stands on the cabinet behind the header (it used to sit half inside the front face: a flickering black line) */
          for(let i=0;i<20;i++){const cx=x-.36+(i%5)*.18,cz=pz-.18+((i/5)|0)*.12;if(red)put('bottle',cx,1.47,cz,.085,.3,.085,pick_(['#2a1a10','#dfe9ee','#f28c28']));else{put('pack',cx,1.47,cz,.1,.15,.06,pick_(['#5b2d8e','#6b3fa0','#e8e2d6']));if(i%2)put('pack',cx,1.62,cz,.1,.15,.06,pick_(['#5b2d8e','#6b3fa0']));}}});}
      {const rz0=Math.max(zTop+.15,store_?-hd+sd+.35:-hd+.3),rz1=Math.min(zBot-.3,rz0+4.5);coolers(1,rz0,rz1,null,[1,2]);
        // snack wall (chips) on the left wall between the coolers and the till
        const sz0=lz0+(nl?nl*.74+.3:0),sz1=ckZ-1.3,sl=sz1-sz0;if(sl>1.2&&A>=60){blk(-hw+.24,(sz0+sz1)/2,.5,sl);for(let z=sz0+.5;z<sz1-.4;z+=1)face(-hw+.48,z,1,0,'snack');box(.42,1.8,sl,M.oak,-hw+.22,.9,(sz0+sz1)/2);for(let lv=0;lv<5;lv++){box(.4,.02,sl,M.oak,-hw+.24,.05+lv*.34,(sz0+sz1)/2,false);rail(-hw+.44,.07+lv*.34,(sz0+sz1)/2,sl,Math.PI/2);for(let z=sz0+.08;z<sz1-.08;z+=.15*dens){put('bag',-hw+.46,.07+lv*.34,z,.05,.24,.14,pick_(CHIPS));put('bag',-hw+.32,.07+lv*.34,z+.075,.05,.24,.14,pick_(CHIPS));}}
          if(!done.sweets)label('Сладки · снаксове',-hw+.5,2.05,(sz0+sz1)/2);const po=new T.Mesh(new T.PlaneGeometry(.7,1.0),M.poster);po.rotation.y=Math.PI/2;po.position.set(-hw+.02,2.4,(sz0+sz1)/2);room.add(po);}}
      // step down to the wine corner: ramp with a white edge stripe and stainless handrails at each aisle crossing
      const aisles=[];if(xs.length){for(let i=0;i<xs.length-1;i++)aisles.push((xs[i]+xs[i+1])/2);if(xs[0]-1.1>-hw+.3)aisles.unshift(xs[0]-1.15);if(xs[xs.length-1]+1.1<hw-.3)aisles.push(xs[xs.length-1]+1.15);}
      const aR=aisles.length?aisles[aisles.length-1]:-hw*.5,aL=aisles.length?aisles[0]:-hw*.5;
      if(wine){const openL=(shape==='L'?-hw+lw+t:-hw)+.95,openR=(store_?hw-sw-t:hw)-.95,cand=aisles.filter(x=>x>openL&&x<openR),ramps=cand.length?(cand[0]===cand[cand.length-1]?[cand[0]]:[cand[0],cand[cand.length-1]]):[(openL+openR)/2];S.ramps=ramps;const rs=ramps.slice().sort((a,b)=>a-b);let xr=-hw;rs.forEach(rx=>{if(rx-.8>xr)blk((xr+rx-.8)/2,zW,rx-.8-xr,.16,true);xr=rx+.8;});if(hw>xr)blk((xr+hw)/2,zW,hw-xr,.16,true);
        ramps.forEach(rx=>{for(const s of [-1,1])blk(rx+s*.8,zW,.06,1.3,true);const a=Math.atan2(.12,1.05);const rg=new T.BoxGeometry(1.56,.04,1.12);rg.rotateX(-a);rg.translate(rx,-.08,zW-.02);vacc.push([rg,'#4e5052']);cbox(1.56,.006,.08,'#d8d4c8',rx,.004,zW+.55);
          for(const s of [-1,1]){const px=rx+s*.8;cgeo(new T.CylinderGeometry(.018,.018,.95,6),STEEL,px,.475,zW+.62,true);cgeo(new T.CylinderGeometry(.018,.018,.95,6),STEEL,px,yF+.475,zW-.62,true);
            [.32,.6,.9].forEach(h=>{const bg=new T.CylinderGeometry(.014,.014,1.26,6);bg.rotateX(Math.PI/2-Math.atan2(.12,1.24));cgeo(bg,STEEL,px,h-.06,zW,true);});}});}
      label('Вход',doorX,2.75,hd+.1);
      // ceiling: LED strips over each aisle, AC grilles, a few real point lights
      {LAYER=vaccC;const sl=len+1.6;aisles.forEach(ax=>box(.09,.025,sl,M.ledC,ax,Hh-.02,zc+.3,false));box(W*.7,.025,.09,M.ledC,0,Hh-.02,hd-1.3,false);box(W*.6,.025,.09,M.ledC,0,Hh-.02,zTop-.9,false);
        const gz=[zTop+1.2,zBot-1.2];if(D>10)gz.push(zc);gz.forEach(z=>box(.6,.03,.6,M.grille,W*.1,Hh-.02,z,false));
        LAYER=null; // no black track rails on the ceiling: from below they read as cables running to the diffusers
        const NL=TIER===2?2:0,nx=Math.max(1,Math.round(Math.sqrt(NL*W/D))),ny=Math.max(1,Math.ceil(NL/nx));S.lights=[];
        for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){if(S.lights.length>=NL)break;const l=new T.PointLight(0xfff4e2,.22,Math.max(W,D)*.7,2);l.position.set(-hw+W*(i+.5)/nx,Hh-.15,-hd+D*(j+.5)/ny);room.add(l);S.lights.push(l);}
        if(TIER===2){const lt=new T.PointLight(0xd8ecff,.3,Math.max(4,len*.8),1.8);lt.position.set(-hw+1,1.5,zTop+1.8);room.add(lt);S.coolLight=lt;}else S.coolLight=null;S.ambAdd=.06*(2-NL);}
      // diffusers
      const U=unitsFor(A);
      U.forEach((u,i)=>{
        let p,d;
        if(u.at==='D'){p=[doorX,Math.min(2.34+.2,Hh-.4),hd-.05];d=[0,0,-1];}
        else if(u.at==='L'){p=[-hw+.09,yM,D*u.f];d=[1,0,0];}
        else if(u.at==='B'){p=[W*u.f,Math.min(yF+2.7,Hh-.35),-hd+.09];d=[0,0,1];}
        else{p=[hw-sw/2,yM,-hd+sd+t/2+.05];d=[0,0,1];}
        const g=new T.Group();g.position.set(p[0],p[1],p[2]);g.rotation.y=Math.atan2(d[0],d[2]);
        const PL=plan().mdl==='PL',white=plan().col==='w';let bw,bh,bd,led;
        if(PL){// Prime Lux: black glass front in a champagne frame, nozzle on top, small display and touch keys
          bw=.3;bh=.4;bd=.17;
          const frame=new T.Mesh(roundedBox(bw,bh,bd,.03).translate(0,0,bd/2),M.champ);frame.castShadow=true;
          const front=new T.Mesh(roundedBox(bw-.012,bh-.012,.012,.025).translate(0,0,bd+.004),M.bglass);
          const noz=new T.Mesh(mergeGeos([new T.CylinderGeometry(.045,.05,.02,20).translate(0,bh/2+.01,bd*.55),new T.CylinderGeometry(.012,.012,.03,10).translate(0,bh/2+.03,bd*.55)]),M.chrome);
          const disp=new T.Mesh(new T.PlaneGeometry(.1,.055),M.plDisp);disp.position.set(-.01,-bh*.22,bd+.012);
          led=new T.Group();const dot=new T.Mesh(new T.CircleGeometry(.006,10),M.led);dot.position.set(bw*.36,-bh*.2,bd+.012);led.add(dot);
          const glow=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));glow.position.set(0,bh/2+.06,bd*.55);glow.scale.set(.2,.1,1);led.add(glow);
          var cover=new T.Group();cover.position.set(-bw/2,0,0);[frame,front,noz,disp,led].forEach(o=>{o.position.x+=bw/2;cover.add(o);});g.add(cover);
        }else{
          bw=.19;bh=.26;bd=.07;const shell=white?M.unitW:M.unit;
          const body=new T.Mesh(mergeGeos([roundedBox(bw,bh,bd,.035).translate(0,0,bd/2),new T.CylinderGeometry(.012,.012,.03,8).rotateX(Math.PI/2).translate(bw*.3,bh*.38,bd+.008)]),shell);body.castShadow=true;
          const grille=new T.Mesh(new T.PlaneGeometry(bw*.62,bh*.3),white?M.grW:M.grB);grille.position.set(0,-bh*.28,bd+.002);
          const badge=new T.Mesh(new T.PlaneGeometry(bw*.34,bw*.34),M.badge);badge.position.set(0,bh*.3,bd+.002);badge.scale.setScalar(.7);
          led=new T.Group();led.add(new T.Mesh(mergeColored([[new T.SphereGeometry(.008,6,5).translate(-bw*.34,bh*.22,bd+.006),'#ffc766'],[new T.SphereGeometry(.008,6,5).translate(-bw*.34,bh*.12,bd+.006),'#4fb8d0']]),M.ledDot));
          const oval=new T.Mesh(new T.CircleGeometry(.028,14),M.led);oval.scale.set(1,1.45,1);oval.position.set(0,bh*.05,bd+.003);led.add(oval);
          const glow=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));glow.position.set(bw*.3,bh*.38,bd+.03);glow.scale.set(.16,.1,1);led.add(glow);
          var cover=new T.Group();cover.position.set(-bw/2,0,0);[body,grille,badge,led].forEach(o=>{o.position.x+=bw/2;cover.add(o);});g.add(cover);
          if(!M.acryl){M.acryl=new T.MeshStandardMaterial({color:0xeef3f6,roughness:.15,metalness:0,transparent:true,opacity:.42,depthWrite:false});}const foot=new T.Mesh(roundedBox(bw*1.04,.022,bd*1.15,.008).translate(0,-bh/2-.011,bd/2),M.acryl);foot.renderOrder=2;g.add(foot);
        }
        // inside, behind the cover (seen only when it is open): the back plate, the pump block and the aroma oil bottle
        // the unit inside, as these cold-air (Venturi) diffusers are built: a small air pump blows through a clear silicone hose into the
        // atomiser head; the air jet at its aluminium nozzle draws the oil up the dip tube from the bottle screwed into the head and
        // breaks it into a dry mist that goes up the mist line to the outlet; the heavy drops run back into the bottle. A control board
        // (Bluetooth, timer; on the Prime Lux behind the display), and power: a rechargeable Li-ion cell with a USB-C port on the
        // Plug'n'Go, a mains adapter socket on the Prime Lux. Bottles: Plug'n'Go 150 ml, Prime Lux 500 ml, both screw-neck
        const bR=PL?.038:.025,bH=PL?.16:.118,bX=-bw*(PL?.18:.17),bY=PL?-bh*.12:-bh*.1,bZ=bd*.5,hY=bY+bH/2-.008,hH=PL?.046:.034,hD=Math.min(bd*.62,bR*2.2),nzY=PL?bh/2-.004:bh*.38,nzX=PL?0:bw*.3,nzZ=PL?bd*.55:bd*.85,tw=.0028;
        const tube=(a,b,r,c)=>{const v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),L=v.length()||.001,q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return [new T.CylinderGeometry(r,r,L,6).applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(q)).translate((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),c];};
        const pR=PL?.016:.011,pL=PL?.055:.04,pX=bw*(PL?.24:.25),pY=-bh*(PL?.28:.3),pZ=Math.min(bd*.45,pR+.016),hx=bX+bR*1.1,hTop=hY+hH;
        const parts=[[new T.BoxGeometry(bw-.02,bh-.02,.008).translate(0,0,.006),'#1e1f22'],
          [new T.BoxGeometry(bw*.42,bh*.3,.003).translate(bw*.2,bh*.06,.012),'#1f5a3a'],                                       // the control board
          [new T.BoxGeometry(.018,.018,.003).translate(bw*.14,bh*.1,.0145),'#111'],[new T.BoxGeometry(.01,.008,.003).translate(bw*.27,bh*.02,.0145),'#111'],[new T.BoxGeometry(.012,.006,.004).translate(bw*.3,bh*.15,.0145),'#d8d8d8'],
          [new T.BoxGeometry(bR*2.2,hH,hD).translate(bX,hY+hH/2,bZ),'#e9e6df'],                                               // the atomiser head
          [new T.CylinderGeometry(bR*.62,bR*.62,.01,18).translate(bX,hY-.001,bZ),'#cfcac0'],                                  // its threaded socket, the bottle screwed in from below
          [new T.CylinderGeometry(bR*.32,bR*.4,.012,14).translate(bX,hTop+.006,bZ),'#c3c7cc'],                                 // the aluminium nozzle cap
          [new T.CylinderGeometry(tw*.8,tw*.8,bH-.012,6).translate(bX,bY+.004,bZ),'#efece4'],                                 // the dip tube, down to the bottom
          [new T.CylinderGeometry(pR,pR,pL,14).translate(pX,pY,pZ),'#2b2c30'],[new T.CylinderGeometry(pR*1.05,pR*1.05,pL*.32,14).translate(pX,pY+pL*.6,pZ),'#e3e0d9'], // the air pump: motor and pump head
          tube([pX,pY+pL*.76,pZ],[pX,hY+hH*.5,pZ],.0034,'#f2f0ea'),tube([pX,hY+hH*.5,pZ],[hx,hY+hH*.5,bZ],.0034,'#f2f0ea'),     // the air hose into the head
          tube([bX,hTop+.012,bZ],[bX,nzY-.012,bZ],tw,'#f2f0ea')].concat(nzX?[tube([bX,nzY-.012,bZ],[nzX,nzY-.012,nzZ],tw,'#f2f0ea')]:[]); // the mist line up to the outlet
        if(PL)parts.push([new T.BoxGeometry(.03,.02,.02).translate(bw*.32,-bh*.42,.02),'#141416'],tube([bw*.32,-bh*.42,.03],[pX,pY-pL/2,pZ],.002,'#1a1a1c')); // mains adapter socket, its lead to the pump
        else parts.push([new T.CylinderGeometry(.0093,.0093,.065,12).translate(bw*.06,-bh*.2,.02),'#2a5fb0'],[new T.CylinderGeometry(.0094,.0094,.006,12).translate(bw*.06,-bh*.2+.035,.02),'#c3c7cc'],[new T.BoxGeometry(.012,.006,.008).translate(bw*.06,-bh*.48+.003,.03),'#111']); // the Li-ion cell, the USB-C port below
        const inner=new T.Mesh(mergeColored(parts),M.vc2);
        const bottle=oilBottle(bR,bH);bottle.position.set(bX,bY,bZ);oilLevel(bottle,.35+Math.random()*.4);
        g.add(inner,bottle);
        room.add(g);
        // no visible cables: the wiring runs hidden in the wall / door frame
        const plume=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffe2a8,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending}));const o=PL?[p[0]+d[0]*.09,p[1]+bh/2+.04,p[2]+d[2]*.09]:[p[0]+d[0]*.1-(d[2]?d[2]*bw*.3:0),p[1]+bh*.38,p[2]+d[2]*.1+(d[0]?d[0]*bw*.3:0)];plume.position.set(o[0]+d[0]*.25,o[1]+.3,o[2]+d[2]*.25);plume.scale.set(.5,.7,1);room.add(plume);
        // the visible puff: a short stream of soft mist leaving the nozzle while the unit is spraying (materials made here, nothing compiled later)
        const jet=[];for(let k=0;k<6;k++){const jm=new T.SpriteMaterial({map:spr,color:0xf6f1e7,transparent:true,opacity:0,depthWrite:false});jm.userData.own=true;const js=new T.Sprite(jm);js.visible=false;js.renderOrder=6;room.add(js);jet.push(js);}
        const Rr=Math.sqrt(A/U.length/Math.PI);const wm=new T.MeshBasicMaterial({color:0xd4af63,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});wm.userData.own=true;const wave=new T.Mesh(new T.RingGeometry(.94,1,48),wm);wave.rotation.x=-Math.PI/2;wave.position.set(p[0]+d[0]*Math.min(Rr,2.2),.02,p[2]+d[2]*Math.min(Rr,2.2));room.add(wave);
        const light={intensity:0};
        const pin=document.createElement('button');pin.type='button';pin.className='pin';pin.innerHTML='<b>'+(i+1)+'</b><i>Дифузер '+(i+1)+'</i>';pin.setAttribute('aria-label','Дифузер '+(i+1)+' ('+(u.title||'')+'): '+u.zone);
        pin.addEventListener('click',e=>{e.stopPropagation();pick(i);focusUnit(i);});ovl.appendChild(pin);
        overlay.push({el:pin,v:new T.Vector3(p[0]+d[0]*.1,p[1]+bh/2+.1,p[2]+d[2]*.1),kind:'pin'});
        S.units.push({jet,p,d,o,info:u,led,light,plume,wave,R:Rr,ph:i/U.length,pin,PL,grp:g,bw,bh,bd,cover,bottle});pin.classList.toggle('pl',PL);
      });
      flush();
      S.ceil=room.children.filter(o=>o.material===M.vcC||o.material===M.ledC||o.material===M.grille||o===S.ceilPlane);
      if(strips.length){const sm_=new T.Mesh(mergeGeos(strips),M.rail);room.add(sm_);}
      if(aoAcc.length){const am=new T.Mesh(mergeGeos(aoAcc),M.ao);am.renderOrder=1;room.add(am);}
      if(aoVAcc.length){const av=new T.Mesh(mergeGeos(aoVAcc),M.aoV);av.renderOrder=1;room.add(av);} // one mesh for all shelf shades
      if(glassAcc.length){const gm=new T.Mesh(mergeGeos(glassAcc),M.glassC);room.add(gm);}
      headAcc.forEach((h,i)=>{if(h.length)room.add(new T.Mesh(mergeGeos(h),[M.headCoke,M.headBeer,M.headBurg][i]));});
      // navigation grid from the registered props; entry/exit on the door apron, queue slots beside the till
      nav=navBuild(W,D,doorX,doorW);const nf=(x,z)=>{const q=nav.free(nav.G35,...nav.toCell(x,z))?nav.toCell(x,z):null;const cc=q||(()=>{for(let r=1;r<8;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){const [i,j]=nav.toCell(x,z);if(nav.free(nav.G35,i+di,j+dj))return [i+di,j+dj];}return nav.toCell(x,z);})();return nav.toWorld(cc[0],cc[1]);};
      nav.entry=nf(doorX+.2,hd+1.2);nav.exit=nf(doorX-.2,hd+1.2);
      // queue places: the first beside the till, the rest 0.8 m apart behind it; where a shelf cuts that line off, the place moves a little further
      // back or bends out into the aisle, and a place that would land on top of another is simply not made (fewer people wait, nobody stacks)
      // the queue: the head in front of the till, the line running back into the hall along the floor arrows (people come from the shelves,
      // pay, and leave by the entrance); every place is free floor, never on top of another and never more than a step from the one ahead
      {const gap=PARAMS.queueGap,dx=.55,dz=-.83,Q=[];let x=ckX+ckW/2-.25,z=ckZ-.72;
        for(let k=0;k<5;k++){let p=null;const cand=[[x,z],[x+.25,z],[x-.25,z],[x,z-.25],[x+.25,z+.2]];
          for(const c of cand){const q=nf(c[0],c[1]),pr=Q[Q.length-1];if(q[1]<ckZ-.45&&Q.every(s_=>Math.hypot(s_[0]-q[0],s_[1]-q[1])>=.62)&&(!pr||Math.hypot(pr[0]-q[0],pr[1]-q[1])<=1.3)){p=q;break;}}
          if(!p)break;Q.push(p);x+=dx*gap;z+=dz*gap;}
        nav.queue.push(...Q);}
      qOcc.length=0;nav.queue.forEach(()=>qOcc.push(null));
      nav.stack=nf(doorX-doorW/2-.35,hd-1.1);
      if(A>=60){nav.G35X=nav.G35.slice();nav.queue.forEach(q=>{const [i,j]=nav.toCell(q[0],q[1]);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows)nav.G35X[jj*nav.cols+ii]=1;}});}
      {const E_=ckX+ckW/2,cb=new T.Mesh(mergeColored([[new T.CylinderGeometry(.15,.12,.2,8,1,true),'#d0212b'],[new T.CircleGeometry(.12,8).rotateX(Math.PI/2).translate(0,-.1,0),'#d0212b'],[new T.TorusGeometry(.14,.008,4,10,Math.PI).translate(0,.1,0),'#3a1a14']]),M.vc2);cb.position.set(E_-.52,1.14,ckZ-.14);cb.visible=false;room.add(cb);S.counterBasket=cb;
        const bp=new T.Mesh(new T.BoxGeometry(.03,.03,.03),M.led);bp.position.set(E_-.25,1.07,ckZ+.08);bp.visible=false;room.add(bp);S.beep=bp;
        // till points: where the basket stands, where unscanned items wait, the scanner, the open bag, the hand-over point, the cash drawer
        S.tl={E:E_,basket:[E_-.52,1.14,ckZ-.14],a:[[E_-.18,ckZ-.06],[E_-.26,ckZ-.03],[E_-.12,ckZ-.09]],scan:[E_-.25,1.16,ckZ+.08],bag:[E_-.18,1.04+.165,ckZ+.17],bagStore:[E_-.15,.86,ckZ+.34],H:[E_-.4,1.42,ckZ-.06],drawer:[E_-.3,1.0,ckZ+.26]}; // cashier faces the customer: she scans and bags with her right hand on her right; the customer unloads with the left and pays with the right
        const ob=mkOpenBag();ob.position.set(S.tl.bag[0],S.tl.bag[1],S.tl.bag[2]);ob.visible=false;room.add(ob);S.counterBag=ob;
        const nt=new T.Mesh(new T.BoxGeometry(.14,.003,.07),new T.MeshStandardMaterial({color:0x7fae86,roughness:.8}));nt.visible=false;room.add(nt);S.tillNote=nt;
        // the customer's items: each has its own place in the basket, its spot on the counter while it waits for the scanner
        const cols=['#c8382e','#2f6fb5','#e0b23a','#3c7a3e','#5b2d8e','#e8e2d0','#f28c28','#1b1917'];S.counterItems=[];
        for(let j=0;j<8;j++){const bottle=j%3===0,geo=bottle?new T.CylinderGeometry(.035,.035,.24,8):new T.BoxGeometry(.09,.13,.06),m=new T.Mesh(mergeColored([[geo,cols[j]]]),M.vc);m.castShadow=true;const hy=bottle?.12:.065;
          const sp=S.tl.a[j%3],an=j*2.4;m.userData.hy=hy;m.userData.a=[sp[0],1.04+hy,sp[1]];m.userData.bo=[Math.cos(an)*.075*(j%2?1:.55),Math.sin(an)*.075*(j%2?1:.55)];m.visible=false;room.add(m);S.counterItems.push(m);}}
      S.mainX=aR;S.zTop=zTop;flowDirty=true;
      {const c=nav.browse.filter(x=>x.tag==='coffee'||x.tag==='sweets');S.restock=c.length?c[(Math.random()*c.length)|0]:null;if(S.restock){const [i,j]=nav.toCell(S.restock.p[0],S.restock.p[1]);[nav.G0,nav.G25,nav.G35,nav.G55,nav.G35X].forEach(g=>{for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows&&(g!==nav.G0||(di===0&&dj===0)))g[jj*nav.cols+ii]=1;}});nav.browse=nav.browse.filter(x=>x!==S.restock);}}
      flowLine=new T.Mesh(new T.BufferGeometry(),M.flow);flowLine.renderOrder=2;flowLine.frustumCulled=false;flowLine.visible=$('#lyFlow').checked;room.add(flowLine);
      if($('#lyCover').checked)makeHeat();
      // light rig
      key.position.set(-W*.25,Hh*4.2,D*.4);key.target.position.set(0,0,0);const sc=key.shadow.camera,R=Math.max(W,D)*.85;sc.left=-R;sc.right=R;sc.top=R;sc.bottom=-R;sc.near=.5;sc.far=Hh*10+Math.max(W,D)*4;sc.updateProjectionMatrix();
      recolor();labelsVis();if(!M.badge.map){M.badge.map=badgeTex();M.badge.needsUpdate=true;} /* drawn once, not a new texture for every store */
      // sharper textures at grazing angles (floor, signs, labels, the POS screen) with anisotropic filtering; it is a sampling-quality setting, not extra geometry or pixels, so it costs almost nothing
      {const AX=Math.min(TIER>=2?8:4,(renderer.capabilities.getMaxAnisotropy&&renderer.capabilities.getMaxAnisotropy())||4),seen=new Set();scene.traverse(o=>{const ms=o.material&&(Array.isArray(o.material)?o.material:[o.material]);if(ms)ms.forEach(m=>['map','normalMap','roughnessMap','emissiveMap','metalnessMap'].forEach(k=>{const t=m[k];if(t&&!seen.has(t)){seen.add(t);if((t.anisotropy||1)<AX){t.anisotropy=AX;t.needsUpdate=true;}}}));});}
      pown.fill(-1);pAl.fill(0);emitAcc=0;
      go(view.name==='free'?'persp':view.name,true);renderer.shadowMap.needsUpdate=true;warm();
      if(window.__perf)window.__perf.build0=performance.now()-t0;
      LD.base=Math.max(LD.base||0,30);ldSet(30);
      // progressive fill: products over the next frames, then the particle warm-up, then people
      later(()=>{if(FAM.bottle.length)instanced(GEO.bottle,FAM.bottle,false,SPIRIT,M.bottle);if(FAM.can.length)instanced(GEO.can,FAM.can,false,CANS,M.can);
        later(()=>{if(FAM.carton.length)instanced(GEO.box,FAM.carton,false,BISC,M.carton);if(FAM.pack.length)instanced(GEO.box,FAM.pack,false,SWEET,M.pack);if(FAM.bag.length)instanced(GEO.box,FAM.bag,false,CHIPS,M.bag);
          later(()=>{const on=sysOn(state.t);for(let i=0;i<30*22;i++)stepP(1/30,on,true);pg.attributes.position.needsUpdate=true;pg.attributes.alpha.needsUpdate=true;pg.attributes.psize.needsUpdate=true;
            later(()=>{castPeople(A,phone);if(!heat&&S.W)makeHeat();});});});});
    }
    // coverage heat is built only when the layer is switched on
    function makeHeat(){const W=S.W,D=S.D;
      const cols=Math.max(2,Math.ceil(W)),rows=Math.max(2,Math.ceil(D)),data=new Uint8Array(cols*rows*4),hacc=new Float32Array(cols*rows);
      const tex=new T.DataTexture(data,cols,rows,T.RGBAFormat);tex.magFilter=tex.minFilter=T.LinearFilter;tex.generateMipmaps=false;tex.encoding=T.sRGBEncoding;tex.needsUpdate=true;
      const hmm=new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});hmm.userData.own=true;const hm_=new T.Mesh(new T.PlaneGeometry(W,D),hmm);hm_.rotation.x=-Math.PI/2;hm_.position.y=.012;hm_.renderOrder=2;hm_.visible=$('#lyCover').checked;room.add(hm_);
      heat={cols,rows,data,acc:hacc,tex,mesh:hm_,timer:0};}
    function castPeople(A,phone){
      const nP=Math.max(4,Math.round((phone?(A<90?4:(A<150?6:7)):(A<60?5:(A<90?7:(A<150?10:(A<220?13:15)))))*(TIER===2?.85:TIER===1?.65:.45)));
      const spec=[
        {mk:()=>makePerson(0,{h:1.68,fem:true,hairStyle:'bob',hair:0x3b2a1a,coat:0x1b1917,collar:0x3a3a3a,top:0x3a3a3a,bot:0x2c3a5a,scarf:0x7a2f2f,skin:0xf3d9c4,handbag:0x2a1f16,shoe:0xe8e2d6,iris:'#4a6a3a'}),p:{fem:true,h:1.68},u:.05,lane:0,sp:.55},
        {mk:()=>makePerson(1,{h:1.84,skin:0x6b4028,hairStyle:'receding',hair:0x1a1410,beard:true,stubble:true,jacket:0x2d3a4f,hood:true,collar:0x3a3a3a,top:0x3a3a3a,bot:0x1e232b,belly:.25,cap:0x1b1917,shoe:0x14110e,iris:'#2b2b2b'}),p:{fem:false,h:1.84},u:.3,lane:-.2,sp:.5},
        {mk:()=>makeElder(),p:{elder:true,h:1.66},u:.55,lane:.22,sp:.3},
        {mk:()=>makePerson(3,{h:1.66,fem:true,hairStyle:'pony',hair:0xd9c3a0,jacket:0x3a3a3a,top:0x7a2f2f,bot:0x2c3a5a,skin:0xf3d9c4,shoe:0xe8e2d6,iris:'#2a4a6a'}),p:{fem:true,h:1.66},u:.78,lane:0,sp:.45,stroller:true},
        {mk:()=>makeChild(),p:{isChild:true,h:1.18},u:.3,lane:-.5,sp:.5,follow:1},
        {mk:()=>makePerson(5,{h:1.76,hairStyle:'side',hair:0x3b2a1a,skin:0xe8c4a4,jacket:0x1b1917,hood:true,top:0x6b6b6b,tshirt:true,bot:0x2c3a5a,cap:0x1b1917,capBack:true,backpack:0x2f3a4a,shoe:0xe8e2d6}),p:{fem:false,h:1.76},u:.18,lane:.18,sp:.48},
        {mk:()=>makePerson(6,{h:1.62,fem:true,hairStyle:'bun',skin:0xe8c4a4,hair:0x3b2a1a,jacket:0x6b6b6b,top:0x8a8a8a,bot:0x5a5a5a,shoe:0xe8e2d6,iris:'#2b2b2b'}),p:{fem:true,h:1.62},u:.66,lane:-.18,sp:.52},
        {mk:()=>makePerson(7,{h:1.6,fem:true,elder:true,hairStyle:'curls',curly:true,hair:0xd8d3cc,coat:0x2d2a2a,collar:0xd8b4c8,top:0xd8b4c8,skirt:true,bot:0x3a3a3a,tights:0x2a2622,glasses:true,skin:0xe8c4a4,handbag:0x5a1f1f,iris:'#5a3a1a'}),p:{fem:true,h:1.6,elder:true},u:.92,lane:.1,sp:.36,follow:2,gap:.7}
      ].slice(0,nP);
      while(spec.length<nP){const sp=randomSpec();spec.push({mk:()=>mkRandom(sp),fem:sp.fem});}
      const one=s=>{const g=(s.p&&gltfPerson(s.p))||s.mk();if(s.p){g.userData.fem=!!s.p.fem;}else if(s.fem!=null)g.userData.fem=!!s.fem;if(s.follow!=null&&s.follow<nP&&people[s.follow])people[s.follow].userData.partner=people.length;g.userData.ph=Math.random()*6.28;g.userData.sp=(g.userData.elder?rr(PARAMS.speed.elder):rr(PARAMS.speed.adult))*PARAMS.speedScale;g.userData.phone=Math.random()<PARAMS.phoneP;if(s.follow!=null&&s.follow<nP){g.userData.follow=s.follow;g.userData.gap=s.gap||.9;}
        if(s.stroller){const st=makeStroller();g.userData.stroller=st;room.add(st);g.userData.basket.visible=false;g.userData.pushing=true;}
        room.add(g);people.push(g);};
      // no stock clerk standing among the shelves: a still man in dark clothes reads as a security guard, and the chain has none (only the seller at the till)
      if(false&&S.restock&&!phone){const st=gltfPerson({h:1.76,fem:false})||mkRandom({h:1.76,hairStyle:'crop',hair:0x3b2a1a,vest:0x1e7a3c,top:0x8a8a8a,tshirt:true,bot:0x1f3a2a,skin:0xd9ae8a,shoe:0x14110e});const p=S.restock.p;st.position.set(p[0],floorY(p[0],p[1]),p[1]);st.rotation.y=Math.atan2(-S.restock.f[0],-S.restock.f[1]);st.userData.state='restock';st.userData.restocker=true;st.userData.blend=0;st.userData.basket.visible=false;
        const bx=new T.Mesh(mergeColored([[new T.BoxGeometry(.36,.24,.28),'#b08a5a']]),M.vc2);if(st.userData.torso){bx.position.set(0,.02,.34);st.userData.torso.add(bx);}else{bx.position.set(0,.55,.35);st.add(bx);}room.add(st);extras.push(st);}
      // cashier first (always visible at the till), then the customers three per frame
      const [cx,cz]=S.cashier;const cs=gltfPerson({staff:true,h:1.72})||makePerson(8,{h:1.74,hairStyle:'crop',hair:0x1a1410,vest:0xc41f2b,top:0x8a8a8a,tshirt:true,bot:0x1f3a2a,skin:0xe8c4a4,shoe:0x14110e,iris:'#3a2a1a'});if(cs.userData.gltfP)dressCashier(cs);cs.position.set(cx,0,cz);cs.rotation.y=Math.PI;cs.userData.ang=Math.PI;cs.userData.faceAng=Math.PI;cs.userData.state='queue';cs.userData.blend=0;cs.userData.ph=Math.random()*6.28;cs.userData.basket.visible=false;cs.userData.cashier=true;room.add(cs);extras.push(cs);
      const step=i=>{spec.slice(i,i+3).forEach(one);if(i+3<spec.length)later(()=>step(i+3));else{LD.base=45;ldTick();if(window.__perf&&!window.__perf.done)window.__perf.done=performance.now();}};
      step(0);
    }

    let emitAcc=0,cursor=0;
    function emit(i,u){const e=S.units[u],o=e.o,d=e.d,j=i*3;
      pPos[j]=o[0];pPos[j+1]=o[1];pPos[j+2]=o[2];
      const sp=(e.PL?1.6:1.25)*(.9+Math.random()*1.3),l=(Math.random()-.5)*1.8;
      pv[j]=d[0]*sp*.8+(d[2]?l:l*.25);pv[j+1]=.35+Math.random()*.45;pv[j+2]=d[2]*sp*.8+(d[0]?l:l*.25);
      page[i]=0;plife[i]=18+Math.random()*10;pown[i]=u;}
    function stepP(dt,on,warm){
      const hw=S.hw-.06,hd=S.hd-.06,Hh=S.H,n=S.units.length;if(!n)return;
      if(on){const act=warm?S.units.map((_,j)=>j):S.units.map((u,j)=>u.act?j:-1).filter(j=>j>=0);
        if(act.length){emitAcc+=PN/23*dt*(warm?1:PUFF_T/PUFF_ON*act.length/n);let k=Math.floor(emitAcc);emitAcc-=k;let tries=0,r=0;while(k>0&&tries<PN){cursor=(cursor+1)%PN;tries++;if(pown[cursor]<0){emit(cursor,act[r++%act.length]);k--;}}}} // only the units that are puffing right now
      const drag=Math.exp(-.55*dt),nz=4*Math.sqrt(dt);
      for(let i=0;i<PN;i++){
        if(pown[i]<0){pAl[i]=0;continue;}
        page[i]+=dt*(on?1:2.4);if(page[i]>=plife[i]){pown[i]=-1;pAl[i]=0;continue;}
        const j=i*3,e=S.units[pown[i]];if(!e){pown[i]=-1;pAl[i]=0;continue;}
        let vx=pv[j]*drag+(Math.random()-.5)*nz+e.d[0]*.3*dt,vy=pv[j+1]*drag+(Math.random()-.5)*nz*.5,vz=pv[j+2]*drag+(Math.random()-.5)*nz+e.d[2]*.3*dt;
        let x=pPos[j]+vx*dt,y=pPos[j+1]+vy*dt,z=pPos[j+2]+vz*dt;
        if(x<-hw){x=-hw;vx=Math.abs(vx)*.3;}else if(x>hw){x=hw;vx=-Math.abs(vx)*.3;}
        if(z<-hd){z=-hd;vz=Math.abs(vz)*.3;}else if(z>hd){z=hd;vz=-Math.abs(vz)*.3;}
        if(y<.2){y=.2;vy=Math.abs(vy)*.3;}else if(y>Hh-.12){y=Hh-.12;vy=-Math.abs(vy)*.3;}
        pPos[j]=x;pPos[j+1]=y;pPos[j+2]=z;pv[j]=vx;pv[j+1]=vy;pv[j+2]=vz;
        const k2=page[i]/plife[i];if(i%MIST===0){pSz[i]=1.2+4*Math.sqrt(k2);pAl[i]=.22*Math.min(1,page[i]/1.5)*(1-k2);}else{pSz[i]=1;pAl[i]=Math.min(1,page[i]/.8)*(1-k2)*(1-k2);}
      }
      if(!warm){pg.attributes.position.needsUpdate=true;pg.attributes.alpha.needsUpdate=true;pg.attributes.psize.needsUpdate=true;}
    }
    function stepHeat(dt){
      if(!heat||!heat.mesh.visible)return;heat.timer+=dt;if(heat.timer<.25)return;heat.timer=0;
      const {cols,rows,data,acc}=heat,cnt=new Float32Array(cols*rows);let alive=0;
      for(let i=0;i<PN;i++){if(pown[i]<0)continue;alive++;const j=i*3;const c=Math.min(cols-1,Math.max(0,Math.floor((pPos[j]+S.hw)/S.W*cols))),r=Math.min(rows-1,Math.max(0,Math.floor((S.hd-pPos[j+2])/S.D*rows)));cnt[r*cols+c]+=pAl[i];}
      const ref=Math.max(.5,alive/(cols*rows)*.55),g=gold;
      for(let k=0;k<cols*rows;k++){acc[k]=acc[k]*.75+cnt[k]*.25;const a=clamp(acc[k]/ref,0,1);data[k*4]=g[0];data[k*4+1]=g[1];data[k*4+2]=g[2];data[k*4+3]=Math.round(a*150);}
      heat.tex.needsUpdate=true;
    }

    let gold=[212,175,99];
    function recolor(){
      const dark=isDark(),c=n=>cssVar(n);
      edgeMat.color=lin(c('--gold-soft'));edgeMat.opacity=dark?.4:.7;gridMat.color=lin('#8a7348');gridMat.opacity=.2;flowMat.color=lin('#E6C27A'); /* the floor is black in every theme */
      const gh=(c('--gold')||'#D4AF63').replace('#','');gold=[parseInt(gh.slice(0,2),16),parseInt(gh.slice(2,4),16),parseInt(gh.slice(4,6),16)];
      pm.uniforms.uColor.value=new T.Color(dark?'#efe7d6':'#8c806a');pm.blending=T.NormalBlending;pm.uniforms.uOp.value=(dark?.17:.14)*(small()?1.5:1);pm.uniforms.uSize.value=small()?.44:.3; /* small screens: a little larger and stronger so the dust still reads */pm.needsUpdate=true;
      hemi.intensity=dark?.42:.5;key.intensity=dark?.5:.42;amb.intensity=(dark?.14:.22)+(S.ambAdd||0);const fc=lin(c('--stage-b')||'#090705');scene.fog=new T.Fog(fc,Math.max(S.W||10,S.D||10)*1.3,Math.max(S.W||10,S.D||10)*4.2);S.units&&S.units.forEach(u=>{u.plume.material.blending=dark?T.AdditiveBlending:T.NormalBlending;u.plume.material.color.copy(dark?new T.Color(c('--gold')).lerp(new T.Color('#ffffff'),.55):new T.Color(c('--gold-soft')));u.wave.material.color.set(c('--gold'));u.plume.material.needsUpdate=true;});
    }
    themeSubs.push(()=>{recolor();kick();});

    // camera
    const view={name:'tour',theta:.62,phi:.98,r:20,tx:0,ty:1,tz:0};let tween=null,idle=0,drag=null,walkSnap=false;
    function presets(name){const {W,D}=S,Hh=S.H,m=Math.max(W,D);
      if(name==='plan')return {theta:0,phi:.07,r:m*1.55+5,tx:0,ty:0,tz:0};
      if(name==='walk'||name==='ddd'){return null;}
      if(name==='door'){const c=[S.door.x-.95,1.9,S.hd+1.9],t=[S.door.x*.35-W*.08,1.0,-S.hd*.35];const dx=c[0]-t[0],dy=c[1]-t[1],dz=c[2]-t[2],r=Math.hypot(dx,dy,dz);return {theta:Math.atan2(dx,dz),phi:Math.acos(dy/r),r,tx:t[0],ty:t[1],tz:t[2]};}
      // whole store in frame: distance from the room's bounding sphere and the narrower of the two fields of view
      const vf=camera.fov*Math.PI/180,f=Math.min(vf,2*Math.atan(Math.tan(vf/2)*camera.aspect)),R=.5*Math.hypot(W,D,Hh);
      return {theta:.62,phi:.9,r:Math.max(7,R/Math.sin(f/2)*.74),tx:0,ty:.2,tz:.25};}
    // guided tour: the whole store (a slow sweep over the open side), then each diffuser in turn with the scent leaving it
    // presentation tour (starts as soon as the set is built): in front of the store on the street → up to the entrance, a pause →
    // through the automatic door → each diffuser in turn → the whole store from above → again. Keys are camera + target points.
    const tour={k:-1,t:0,first:false};
    const V3=(x,y,z)=>new T.Vector3(x,y,z);
    function inRoom(x,z,m){return Math.abs(x)<S.hw-m&&Math.abs(z)<S.hd-m;}
    // the static things a shelf view can hide the diffuser behind (walls, gondolas, coolers) — built once per store, reused for every line-of-sight test
    function losMeshes(){if(S._losTok===buildTok)return S._los; /* fixed fixtures only: people, whatever they carry (the specialist's ladder, case, bag; baskets, bags, phones) and the goods moving over the till never count as walls */
      const skip=new Set(people.concat(extras));if(VZ.g){skip.add(VZ.g);const dz=VZ.g.userData.dz;if(dz)Object.values(dz).forEach(v=>{if(v&&v.isObject3D)skip.add(v);});}[S.counterBag,S.counterBasket,S.tillNote,S.beep].concat(S.counterItems||[]).forEach(o=>{if(o)skip.add(o);});
      const L=[],walk=o=>{if(skip.has(o))return;if(o.isMesh&&!o.isSkinnedMesh&&!o.isInstancedMesh&&o.geometry&&o.visible&&!(o.material&&o.material.depthWrite===false)&&!(o.parent&&o.parent.userData&&o.parent.userData.gltf))L.push(o);o.children.forEach(walk);};room.children.forEach(walk);S._los=L;S._losTok=buildTok;return L;}
    const _rcU=new T.Raycaster(),_cv=new T.Vector3(),_dv=new T.Vector3();
    function clearLOS(cx,cy,cz,o){_cv.set(cx,cy,cz);_dv.set(o[0]-cx,o[1]-cy,o[2]-cz);const dist=_dv.length();_dv.normalize();_rcU.set(_cv,_dv);_rcU.near=.05;_rcU.far=dist-.35;const h=_rcU.intersectObjects(losMeshes(),false);return h.length===0;} // nothing stands between the camera and the diffuser
    function unitKey(i){const u=S.units[i],d=u.d,o=u.o;
      if(u._camTok!==buildTok){ // find (once per store) a spot in front of the diffuser with a clear view of it; cached so the per-frame tour stays cheap
        let best=null;const cy=Math.min(S.H-.45,1.95),base=Math.atan2(d[0],d[2]);
        for(const sp of [0,.3,.55,.85,1.15])for(const sg of [1,-1]){if(sp===0&&sg<0)continue;const a=base+sg*sp;
          for(let r=4.8;r>=2;r-=.3){const x=o[0]+Math.sin(a)*r,z=o[2]+Math.cos(a)*r;if(!inRoom(x,z,.45))continue;
            const clear=clearLOS(x,cy,z,o),sc=(clear?100:0)+r-sp*1.5;if(!best||sc>best.sc)best={sc,x,z,clear};if(clear)break;}}
        u._cam=V3(best.x,cy,best.z);u._camTok=buildTok;u._clear=best.clear;}
      const tgt=V3(o[0],Math.max(1.1,o[1]-.12),o[2]); // aim at the diffuser itself, not the air in front of it
      const inf=u.info||{},words=((inf.title||'')+' '+(inf.zone||'')+' '+(inf.why||'')).split(/\s+/).length;
      return {cam:u._cam,tgt,u:i,dur:clamp(1.8+words/3.2,S.units.length>2?4.2:5.5,8),tw:2.4,drift:.02};} // long enough to read the note under the diffuser
    function tourKeys(){const dx=S.door.x,hd=S.hd,H=S.H,dist=Math.max(7,Math.min(11,S.W*.55)),K=[];
      {const vf=camera.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*camera.aspect),half=S.W/2+.8,far=clamp(half/Math.tan(hf/2),Math.max(8,dist),34); // the whole front fits, sign included, on any screen
        K.push({cam:V3(0,2.1+far*.05,hd+far),tgt:V3(0,1.6,hd),dur:3,tw:2.4,street:1});}                 // on the street: the АВАНТИ front, a little way back
      K.push({cam:V3(dx,1.7,hd+2.5),tgt:V3(dx,1.45,hd-2.5),dur:1.6,tw:2.6});                            // at the entrance, a moment to see where we are
      K.push({cam:V3(dx,1.72,hd-1.4),tgt:V3(dx*.4,1.45,hd-6),dur:1.2,tw:2.2});                         // through the door, inside
      S.units.forEach((u,i)=>K.push(unitKey(i)));                                                        // the diffusers
      if(S.cashier&&nav&&nav.queue&&nav.queue[0]){const c=S.cashier,q=nav.queue[0],dx=c[0]-q[0],dz=c[1]-q[1],L=Math.hypot(dx,dz)||1,ux=dx/L,uz=dz/L; // at the till, over the cashier's shoulder: the customer's face, the items, the card
        K.push({cam:V3(q[0]-ux*.95+uz*.7,1.72,q[1]-uz*.95-ux*.7),tgt:V3(c[0],1.3,c[1]),dur:5.5,tw:2.4,till:1});} /* from beside the customer: the cashier's smiling face, the counter, the items */
      const p=presets('persp');K.push({view:{...p,theta:.35,phi:.62,r:p.r*1.5,tz:p.tz+S.hd*.18},dur:7,tw:3,drift:.1});    // the whole store from above (a real top view: coverage and labels switch on here)
      return K;}
    const _tc=new T.Vector3(),_tt=new T.Vector3();
    function viewFrom(cam,tgt){const dx=cam.x-tgt.x,dy=cam.y-tgt.y,dz=cam.z-tgt.z,r=Math.max(.01,Math.hypot(dx,dy,dz));return {theta:Math.atan2(dx,dz),phi:Math.acos(clamp(dy/r,-1,1)),r,tx:tgt.x,ty:tgt.y,tz:tgt.z};}
    function camOf(v,outC,outT){const s=Math.sin(v.phi);outT.set(v.tx,v.ty,v.tz);outC.set(v.tx+v.r*s*Math.sin(v.theta),v.ty+v.r*Math.cos(v.phi),v.tz+v.r*s*Math.cos(v.theta));}
    // straight flight of camera and target (never swings through walls the way an orbit would); a slight lift between two indoor keys
    function flyTo(key,dur){const c0=new T.Vector3(),t0=new T.Vector3();camOf(view,c0,t0);let c1,t1;if(key.view){c1=new T.Vector3();t1=new T.Vector3();camOf(key.view,c1,t1);}else{c1=key.cam.clone();t1=key.tgt.clone();}
      const lift=(!key.view&&inRoom(c0.x,c0.z,0)&&inRoom(c1.x,c1.z,0))?Math.max(0,Math.min(S.H-.3,2.55)-Math.max(c0.y,c1.y)):0;
      tween={ct:true,c0,t0,c1,t1,lift,t:0,dur};kick();}
    function tweenTo(p,dur){const from={theta:view.theta,phi:view.phi,r:view.r,tx:view.tx,ty:view.ty,tz:view.tz};let dth=p.theta-from.theta;dth=((dth+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;tween={from,to:{...p,theta:from.theta+dth},t:0,dur};kick();}
    // overhead view (the presentation's last shot, or „План“): coverage and labels switch on by themselves and off again when the view moves on;
    // a switch the visitor set by hand is left alone
    function autoLayers(onTop){['lyCover','lyLabels'].forEach(id=>{const el=$('#'+id);if(!el)return;if(onTop){if(!el.checked){el.checked=true;el.dataset.auto='1';el.dispatchEvent(new Event('change'));}}else if(el.dataset.auto){el.checked=false;delete el.dataset.auto;el.dispatchEvent(new Event('change'));}});}
    ['lyCover','lyLabels'].forEach(id=>{const el=$('#'+id);if(el)el.addEventListener('change',e=>{if(e.isTrusted)delete el.dataset.auto;});});
    function tourStep(dt){if(!S.units||!S.units.length)return;const K=tourKeys();
      if(tour.k<0||tour.t>=K[tour.k%K.length].dur){tour.k=(tour.k+1)%K.length;tour.t=0;const key=K[tour.k];
        tour.top=!!key.view;autoLayers(tour.top);
        if(tour.first||tour.k===0&&tour.cold){tour.first=false;tour.cold=false;Object.assign(view,viewFrom(key.cam,key.tgt));apply();}else flyTo(key,key.tw||2.2);
        if(key.u!=null)pick(key.u);return;}
      if(!(HELP.on&&tour.k===2&&tour.t>.4))tour.t+=dt;const key=K[tour.k];if(key.drift){view.theta+=dt*key.drift;apply();}} // the tour waits inside the door while the help is up, so the help and a diffuser note are never on screen together
    window.__tourK=()=>view.name==='tour'?tour.k:-1;
    window.__diffAudit=()=>S.units.map((u,i)=>{const k=unitKey(i),cam=k.cam.clone(),o=new T.Vector3(u.o[0],u.o[1],u.o[2]);
      const dir=o.clone().sub(cam),dist=dir.length();dir.normalize();
      const rc=new T.Raycaster(cam,dir,.05,dist+.6);const L=[];room.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh&&o.geometry&&o.visible&&!(o.material&&o.material.depthWrite===false))L.push(o);});const hits=rc.intersectObjects(L,false);
      const first=hits.length?hits[0].distance:1e9;const fwd=k.tgt.clone().sub(cam).normalize(),toO=o.clone().sub(cam).normalize();
      const ang=Math.acos(Math.max(-1,Math.min(1,fwd.dot(toO))))*180/Math.PI;
      return {i,at:u.info&&u.info.at,dist:+dist.toFixed(2),firstHit:first>1e8?-1:+first.toFixed(2),occluded:first<dist-.4,offAxis:+ang.toFixed(1)};});
    focusUnit=i=>{if(!S.units||!S.units[i])return;view.name='focus';TIP.fu=i;idle=0;$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));flyTo(unitKey(i),1.8);};
    function apply(){const s=Math.sin(view.phi);camera.position.set(view.tx+view.r*s*Math.sin(view.theta),view.ty+view.r*Math.cos(view.phi),view.tz+view.r*s*Math.cos(view.theta));camera.lookAt(view.tx,view.ty,view.tz);}
    function go(name,instant){
      view.name=name;idle=0;if(name==='walk'||name==='ddd')walkSnap=true;if(name!=='tour')autoLayers(name==='plan');$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
      fpHint(name==='fp');if(name==='fp'){tween=null;spin.vx=spin.vy=0;fpEnter();kick();return;}
      if(name==='tour'){tour.k=-1;tour.t=0;tour.first=!!instant;kick();return;}
      const p=presets(name);if(!p){tween=null;kick();return;}if(instant||reduce){Object.assign(view,p);tween=null;apply();kick();return;}
      const from={theta:view.theta,phi:view.phi,r:view.r,tx:view.tx,ty:view.ty,tz:view.tz};let dth=p.theta-from.theta;dth=((dth+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
      tween={from,to:{...p,theta:from.theta+dth},t:0,dur:go.dur||1.35};go.dur=0;kick();
    }
    // „Разходка“: you walk the shop yourself, at eye height, anywhere a person can stand. Drag to look round (all the way round, up and down),
    // tap or click a spot to walk there (round the shelves, the way a person would), W A S D or the arrows or the wheel to step, the stick on a
    // phone. Never through a shelf, a fridge, a person or the specialist's ladder: you go round them, and the shoppers step round you too
    const FPV={x:0,z:0,yaw:Math.PI,pitch:-.06,v:0,dx:0,dz:0,keys:{},path:null,bob:0,joy:null,step:0,ring:null,ringT:0,hintT:0,blk:0};
    const _fpr=new T.Raycaster(),_fpn=new T.Vector2(),_fpd=new T.Vector3(),_fpPl=new T.Plane(new T.Vector3(0,1,0),0);
    // where a person can stand: inside, clear of the fixtures (a hand's breadth from a shelf), through the door opening and out onto the
    // pavement in front; close past people and the specialist's ladder, never into them. Hemmed in for any reason, any step that opens
    // more room is allowed: you can never be stuck
    const fpClr=(x,z)=>{let m=9;for(const q of OBS){const cx=Math.max(q[0],Math.min(x,q[1])),cz=Math.max(q[2],Math.min(z,q[3]));m=Math.min(m,Math.hypot(x-cx,z-cz));}
      const hd=S.hd,hw=S.hw,dj=S.door.w/2-Math.abs(x-S.door.x);
      if(z<=hd-.3)m=Math.min(m,hw-Math.abs(x),z+hd,hd-z);else if(z>=hd+.3)m=Math.min(m,hd+1.6-z,hw+.4-Math.abs(x));else m=Math.min(m,dj);return m;};
    function fpFree(x,z,ox,oz){const c=fpClr(x,z);if(c<.26&&c<=fpClr(ox,oz)+1e-4)return false;
      if(inFP(x,z,.08)&&!(inFP(ox,oz,.08)&&!inFP(x,z,0)))return false;
      for(const p of people.concat(extras)){if(!p.visible)continue;const d=Math.hypot(p.position.x-x,p.position.z-z);if(d<.34&&d<Math.hypot(p.position.x-ox,p.position.z-oz))return false;}return true;}
    function fpEnter(){const cp=camera.position;let x=S.door.x,z=S.hd-1.2,yaw=Math.PI;
      if(Math.abs(cp.x)<S.hw-.4&&Math.abs(cp.z)<S.hd-.4&&cp.y<2.6&&fpFree(cp.x,cp.z,cp.x,cp.z)){x=cp.x;z=cp.z;camera.getWorldDirection(_fpd);yaw=Math.atan2(_fpd.x,_fpd.z);}
      else{let ok=fpFree(x,z,x,z);for(let r=.2;r<2.5&&!ok;r+=.2)for(let a=0;a<6.28&&!ok;a+=.5){const tx=x+Math.sin(a)*r,tz=z+Math.cos(a)*r;if(fpFree(tx,tz,tx,tz)){x=tx;z=tz;ok=true;}}}
      Object.assign(FPV,{x,z,yaw,pitch:-.06,v:0,path:null,step:0,keys:{},joy:null});}
    function fpRing(p){if(!FPV.ring){const m=new T.MeshBasicMaterial({color:0xd4af63,transparent:true,opacity:0,depthWrite:false});m.userData.own=true;FPV.ring=new T.Mesh(new T.RingGeometry(.15,.2,32),m);FPV.ring.rotation.x=-Math.PI/2;FPV.ring.renderOrder=5;}
      if(FPV.ring.parent!==room)room.add(FPV.ring);FPV.ring.position.set(p[0],floorY(p[0],p[1])+.012,p[1]);FPV.ringT=1.8;}
    function fpGo(t,look){if(!nav)return;const r=nav.route(nav.G35X||nav.G35,[FPV.x,FPV.z],t);FPV.path=r&&r.length>1?r.slice(1):[[t[0],t[1]]];FPV.step=0;FPV.blk=0;FPV.look=look||null;FPV.lookT=2.5;FPV.autoT=performance.now()-(FPV.lookAt||0)>1500?1.2:0;fpRing(FPV.path[FPV.path.length-1]);}
    function fpPick(cx,cy){const b=stage.getBoundingClientRect();_fpn.set((cx-b.left)/b.width*2-1,-((cy-b.top)/b.height)*2+1);_fpr.setFromCamera(_fpn,camera);
      const hit=_fpr.intersectObjects(losMeshes(),false)[0];let p=null,look=null;
      if(_fpr.ray.intersectPlane(_fpPl,_fpd)&&(!hit||_fpd.distanceTo(camera.position)<=hit.distance+.08))p=[_fpd.x,_fpd.z];
      else if(hit){const q=hit.point,dx=q.x-camera.position.x,dz=q.z-camera.position.z,L=Math.hypot(dx,dz)||1;p=[q.x-dx/L*.75,q.z-dz/L*.75];look=[q.x,q.z,q.y];} // a shelf, a fridge: walk up to it and look at it
      if(!p)return;p[0]=clamp(p[0],-S.hw+.3,S.hw-.3);p[1]=clamp(p[1],-S.hd+.3,S.hd-.3);fpGo(p,look);}
    function fpStep(dt){const K=FPV.keys,run=K.ShiftLeft||K.ShiftRight;let f=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0),s=(K.KeyD?1:0)-(K.KeyA?1:0),sp=run?2.1:1.3;
      {const tr=(K.ArrowRight||K.KeyE?1:0)-(K.ArrowLeft||K.KeyQ?1:0);if(tr){FPV.yaw-=tr*dt*1.8;FPV.lookAt=performance.now();FPV.autoT=0;FPV.look=null;}}
      if(FPV.joy){f-=FPV.joy.y;s+=FPV.joy.x;}
      if(FPV.step){const d=Math.min(Math.abs(FPV.step),sp*dt);f+=Math.sign(FPV.step);FPV.step-=Math.sign(FPV.step)*d;if(Math.abs(FPV.step)<.01)FPV.step=0;}
      const fx=Math.sin(FPV.yaw),fz=Math.cos(FPV.yaw);let mx=0,mz=0;
      if(f||s){FPV.path=null;const L=Math.max(1,Math.hypot(f,s));f/=L;s/=L;mx=fx*f-fz*s;mz=fz*f+fx*s;sp*=Math.hypot(f,s);}
      else if(FPV.path){const n=FPV.path[0],dx=n[0]-FPV.x,dz=n[1]-FPV.z,L=Math.hypot(dx,dz);
        if(L<.12){FPV.path.shift();if(!FPV.path.length)FPV.path=null;}
        else{mx=dx/L;mz=dz/L;if(FPV.autoT>0&&performance.now()-(FPV.lookAt||0)>1500){FPV.autoT-=dt;FPV.yaw=angStep(FPV.yaw,Math.atan2(dx,dz),3,dt,1.6);}if(FPV.path.length===1&&L<.6)sp*=Math.max(.35,L/.6);}} // the body turns to where it goes, slows into the spot
      if(FPV.look&&(FPV.lookT-=dt)<=0||performance.now()-(FPV.lookAt||0)<1500)FPV.look=null;
      if(!FPV.path&&FPV.look&&!(f||s)){const L_=FPV.look,a=Math.atan2(L_[0]-FPV.x,L_[1]-FPV.z),pt=clamp(Math.atan2(L_[2]-1.6,Math.hypot(L_[0]-FPV.x,L_[1]-FPV.z)),-.9,.6);FPV.yaw=angStep(FPV.yaw,a,5,dt,2.4);FPV.pitch+=(pt-FPV.pitch)*Math.min(1,dt*3);let d_=a-FPV.yaw;d_=((d_+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d_)<.02&&Math.abs(pt-FPV.pitch)<.02)FPV.look=null;}
      else if(f||s)FPV.look=null;
      const tv=(mx||mz)?sp:0;FPV.v+=(tv-FPV.v)*Math.min(1,dt*(tv>FPV.v?4:7));if(mx||mz){const L=Math.hypot(mx,mz);FPV.dx=mx/L;FPV.dz=mz/L;}
      if(FPV.v>.01){const d=FPV.v*dt,ox=FPV.x,oz=FPV.z,nx=ox+FPV.dx*d,nz=oz+FPV.dz*d;let moved=true;
        if(fpFree(nx,nz,ox,oz)){FPV.x=nx;FPV.z=nz;}else if(fpFree(nx,oz,ox,oz))FPV.x=nx;else if(fpFree(ox,nz,ox,oz))FPV.z=nz;else{moved=false;FPV.v*=.5;} // along a shelf: slide, as a hand on it would
        if(moved){FPV.blk=0;FPV.bob+=d*Math.PI/.72;}else if(FPV.path&&(FPV.blk+=dt)>1.2)fpGo(FPV.path[FPV.path.length-1]);} // someone in the way: a moment, then a way round
      const k=Math.min(1,FPV.v/1.3),y=1.6+(FPV.z<S.hd?floorY(FPV.x,FPV.z):0)+(Math.abs(Math.sin(FPV.bob))-.6)*.022*k,cp=Math.cos(FPV.pitch); // a step ~0.72 m, the head dips a little at each
      camera.position.set(FPV.x,y,FPV.z);camera.lookAt(FPV.x+Math.sin(FPV.yaw)*cp,y+Math.sin(FPV.pitch),FPV.z+Math.cos(FPV.yaw)*cp);
      if(FPV.ring){FPV.ringT-=dt;FPV.ring.visible=FPV.ringT>0;FPV.ring.material.opacity=clamp(FPV.ringT,0,1)*.8;}
      if(fpUI&&FPV.hintT>0){FPV.hintT-=dt;fpUI.classList.toggle('hint',FPV.hintT>0);}}
    let fpUI=null;
    function fpHint(on){if(!fpUI){fpUI=document.createElement('div');fpUI.className='fp-ui'+(touchUI?' touch':'');fpUI.innerHTML='<p class="fp-hint"></p><div class="fp-joy" aria-hidden="true"><i></i></div>';stage.appendChild(fpUI);
        const J=fpUI.querySelector('.fp-joy'),N=J.firstChild;let id=null;
        const mv=e=>{const b=J.getBoundingClientRect(),R=b.width/2;let dx=(e.clientX-b.left-R)/R,dy=(e.clientY-b.top-R)/R;const L=Math.hypot(dx,dy);if(L>1){dx/=L;dy/=L;}FPV.joy={x:dx,y:dy};N.style.transform='translate('+(dx*R*.6).toFixed(1)+'px,'+(dy*R*.6).toFixed(1)+'px)';};
        J.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;try{J.setPointerCapture(id);}catch(_){}mv(e);});J.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e);});
        const up=e=>{if(e.pointerId!==id)return;id=null;FPV.joy=null;N.style.transform='';};J.addEventListener('pointerup',up);J.addEventListener('pointercancel',up);
        ['touchstart','touchmove','touchend'].forEach(t=>J.addEventListener(t,e=>{e.stopPropagation();if(t!=='touchend')e.preventDefault();},{passive:false}));}
      fpUI.classList.toggle('on',!!on);if(!on){FPV.joy=null;FPV.keys={};if(FPV.ring)FPV.ring.visible=false;return;}
      fpUI.querySelector('.fp-hint').textContent=touchUI?'Плъзни, за да се огледаш. Докосни пода, за да отидеш там. С джойстика вървиш.':'Влачи, за да се огледаш. Кликни на пода, за да отидеш там. W A S D или стрелките: ходене, Shift: по-бързо.';FPV.hintT=7;fpUI.classList.add('hint');}
    const FPK=new Set(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight']);
    const fpOnScreen=()=>{const b=stage.getBoundingClientRect();return b.bottom>80&&b.top<innerHeight-80;};
    addEventListener('keydown',e=>{if(view.name!=='fp'||!fpOnScreen()||!FPK.has(e.code)||(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]')))return;FPV.keys[e.code]=true;if(e.code.startsWith('Arrow'))e.preventDefault();kick();});
    addEventListener('keyup',e=>{if(FPK.has(e.code))FPV.keys[e.code]=false;});addEventListener('blur',()=>{FPV.keys={};});document.addEventListener('visibilitychange',()=>{FPV.keys={};FPV.joy=null;});
    $$('.views [data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
    $$('.views [data-zoom]').forEach(b=>b.addEventListener('click',()=>{const m=Math.max(S.W,S.D);view.r=clamp(view.r*(+b.dataset.zoom>0?1.18:.85),m*.35,m*3.2+10);tween=null;apply();idle=0;kick();}));
    // fingers (touch events, reliable on iOS): one finger sideways = orbit around the store (and tilt once it has started), one finger up/down first = the page
    // scrolls as usual; two fingers = pinch to zoom, move together up/down to tilt, sideways to orbit; a flick keeps turning and slows down; double tap = presentation
    const TCH={n:0,x0:0,y0:0,x:0,y:0,lock:null,d0:0,r0:0,mx:0,my:0,vx:0,vy:0,t:0,tap:0};let spin={vx:0,vy:0};
    const freeView=()=>{idle=0;tween=null;autoLayers(false);if(view.name!=='free'){if(view.name==='walk'||view.name==='ddd')apply();view.name='free';$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}};
    const zoomR=r=>{const m=Math.max(S.W,S.D);return clamp(r,m*.35,m*3.2+10);};
    const tpts=e=>[...e.touches].map(t=>[t.clientX,t.clientY]);
    const twoInit=P=>{TCH.lock='two';TCH.d0=Math.hypot(P[0][0]-P[1][0],P[0][1]-P[1][1])||1;TCH.r0=view.r;TCH.mx=(P[0][0]+P[1][0])/2;TCH.my=(P[0][1]+P[1][1])/2;TCH.a=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);freeView();};
    ['gesturestart','gesturechange'].forEach(t=>stage.addEventListener(t,e=>e.preventDefault(),{passive:false})); // Safari: no page zoom while the fingers work the set
    const onUI=e=>e.target.closest&&e.target.closest('button,label,input,select,a,.hud-card');
    stage.addEventListener('touchstart',e=>{if(onUI(e))return;const P=tpts(e);TCH.n=P.length;spin.vx=spin.vy=0;TCH.t=performance.now();
      if(view.name==='fp'){if(P.length===1){e.preventDefault();TCH.x0=TCH.x=P[0][0];TCH.y0=TCH.y=P[0][1];TCH.lock=null;}else if(P.length===2){e.preventDefault();TCH.lock='fp2';TCH.d0=Math.hypot(P[0][0]-P[1][0],P[0][1]-P[1][1])||1;TCH.a=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);}return;}
      if(P.length===1){TCH.x0=TCH.x=P[0][0];TCH.y0=TCH.y=P[0][1];TCH.lock=null;TCH.vx=TCH.vy=0;}
      else if(P.length===2){e.preventDefault();twoInit(P);}},{passive:false});
    stage.addEventListener('touchmove',e=>{if(onUI(e)||!TCH.n)return;const P=tpts(e),now_=performance.now(),dtm=Math.max(1,now_-TCH.t);TCH.t=now_;
      if(view.name==='fp'){idle=0;if(P.length>=2){e.preventDefault();const d=Math.hypot(P[0][0]-P[1][0],P[0][1]-P[1][1])||1,a=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);if(TCH.lock!=='fp2'){TCH.lock='fp2';TCH.d0=d;TCH.a=a;return;}let da=a-TCH.a;da=((da+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;TCH.a=a;FPV.yaw+=da;FPV.lookAt=performance.now();FPV.autoT=0;FPV.look=null;FPV.step=clamp(FPV.step+(d-TCH.d0)*.01,-1.5,1.5);FPV.path=null;TCH.d0=d;kick();return;}
        if(TCH.lock==='page'||TCH.lock==='fp2')return;const x=P[0][0],y=P[0][1];if(!TCH.lock){const ax=Math.abs(x-TCH.x0),ay=Math.abs(y-TCH.y0);if(ax<6&&ay<6)return;TCH.lock='look';TCH.x=x;TCH.y=y;}
        e.preventDefault();FPV.look=null;FPV.lookAt=performance.now();FPV.autoT=0;FPV.yaw+=(x-TCH.x)*.0058;FPV.pitch=clamp(FPV.pitch+(y-TCH.y)*.0045,-1.15,1.05);TCH.x=x;TCH.y=y;kick();return;}
      if(P.length>=2){e.preventDefault();if(TCH.lock!=='two'){twoInit(P);return;}
        // two fingers, all at once: pinch = zoom, twist = turn the store a full 360°, move together = slide the view across the floor
        const d=Math.hypot(P[0][0]-P[1][0],P[0][1]-P[1][1])||1,mx=(P[0][0]+P[1][0])/2,my=(P[0][1]+P[1][1])/2,a=Math.atan2(P[1][1]-P[0][1],P[1][0]-P[0][0]);
        let da=a-TCH.a;da=((da+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;TCH.a=a;view.theta-=da;
        view.r=zoomR(TCH.r0*TCH.d0/d);
        const k=view.r*.0017,dx=mx-TCH.mx,dy=my-TCH.my,ct=Math.cos(view.theta),st=Math.sin(view.theta);
        view.tx=clamp(view.tx-dx*k*ct-dy*k*st,-S.hw-3,S.hw+3);view.tz=clamp(view.tz+dx*k*st-dy*k*ct,-S.hd-3,S.hd+8);
        TCH.mx=mx;TCH.my=my;apply();kick();return;}
      if(TCH.lock==='two'||TCH.lock==='page')return;const x=P[0][0],y=P[0][1];
      if(!TCH.lock){const ax=Math.abs(x-TCH.x0),ay=Math.abs(y-TCH.y0);if(ax<7&&ay<7)return;if(ay>ax*1.15){TCH.lock='page';return;}TCH.lock='orbit';TCH.x=x;TCH.y=y;freeView();}
      e.preventDefault();const dx=x-TCH.x,dy=y-TCH.y;TCH.x=x;TCH.y=y;view.theta-=dx*.0072;view.phi=clamp(view.phi-dy*.005,.07,1.5);
      TCH.vx=TCH.vx*.6+(dx/dtm)*.4;TCH.vy=TCH.vy*.6+(dy/dtm)*.4;apply();kick();},{passive:false});
    const touchEnd=e=>{const n=e.touches.length;
      if(view.name==='fp'){if(n===0){if(TCH.lock===null&&TCH.n===1&&!onUI(e))fpPick(TCH.x0,TCH.y0);TCH.n=0;TCH.lock=null;}else if(n===1&&TCH.lock==='fp2'){const P=tpts(e);TCH.lock='look';TCH.x=P[0][0];TCH.y=P[0][1];TCH.n=1;}return;}
      if(n===0){if(TCH.lock==='orbit'&&performance.now()-TCH.t<90){spin.vx=TCH.vx;spin.vy=TCH.vy;kick();}
        if(TCH.lock===null&&TCH.n===1&&!onUI(e)){const now_=performance.now();if(now_-TCH.tap<320){TCH.tap=0;go('tour');}else TCH.tap=now_;}
        TCH.n=0;TCH.lock=null;}
      else if(n===1&&TCH.lock==='two'){const P=tpts(e);TCH.lock='orbit';TCH.x=P[0][0];TCH.y=P[0][1];TCH.vx=TCH.vy=0;TCH.n=1;}};
    stage.addEventListener('touchend',touchEnd);stage.addEventListener('touchcancel',touchEnd);
    stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.target.closest('button,label,input,select,.hud-card'))return;
      spin.vx=spin.vy=0;drag={x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,id:e.pointerId,on:true};stage.classList.add('drag');try{stage.setPointerCapture(e.pointerId);}catch(_){}});
    stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id||e.pointerType==='touch')return;
      if(view.name==='fp'){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;FPV.look=null;FPV.lookAt=performance.now();FPV.autoT=0;FPV.yaw+=dx*.0042;FPV.pitch=clamp(FPV.pitch+dy*.0034,-1.15,1.05);idle=0;kick();return;}
      if(view.name==='walk'||view.name==='ddd'){view.name='free';apply();}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
      view.theta-=dx*.0065;view.phi=clamp(view.phi-dy*.005,.07,1.5);tween=null;idle=0;if(view.name!=='free'){autoLayers(false);view.name='free';$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}apply();kick();});
    const end=e=>{if(view.name==='fp'&&drag&&e&&e.type==='pointerup'&&Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)<6)fpPick(e.clientX,e.clientY);drag=null;stage.classList.remove('drag');};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
    stage.addEventListener('wheel',e=>{e.preventDefault();idle=0;if(view.name==='fp'){FPV.step=clamp(FPV.step-e.deltaY*.004,-1.5,1.5);FPV.path=null;kick();return;}if(view.name==='tour'){autoLayers(false);view.name='free';$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}const m=Math.max(S.W,S.D);view.r=clamp(view.r*Math.exp(e.deltaY*.0025),m*.35,m*3.2+10);tween=null;apply();kick();},{passive:false});

    // layers
    $('#lyCover').addEventListener('change',e=>{if(!heat&&e.target.checked&&S.W)makeHeat();if(heat)heat.mesh.visible=e.target.checked;kick();});
    $('#lyFlow').addEventListener('change',e=>{if(flowLine)flowLine.visible=e.target.checked;kick();});
    function labelsVis(){const on=$('#lyLabels').checked;stage.classList.toggle('show-labels',on);overlay.forEach(o=>{if(o.kind==='lbl')o.el.hidden=!on;});}
    $('#lyLabels').addEventListener('change',()=>{labelsVis();kick();});

    // size
    let w0=0,h0=0;
    function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===w0&&h===h0))return;w0=w;h0=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();pm.uniforms.uScale.value=h*renderer.getPixelRatio()/2/Math.tan(camera.fov*Math.PI/360)*.5;kick();}
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);else addEventListener('resize',resize);

    // loop
    // ---------- ?diag=1: what the machine is doing, live, plus a log of every event that can cost a frame ----------
    const DG={el:null,log:[],ft:[],last:0,t0:performance.now(),prog:0,regen:0,reused:0,gpu:''};
    function dlog(m){const t=(performance.now()-DG.t0)/1000,mm=String(Math.floor(t/60)).padStart(2,'0'),ss=String(Math.floor(t%60)).padStart(2,'0');DG.log.unshift('['+mm+':'+ss+'] '+m);if(DG.log.length>40)DG.log.length=40;}
    if(DIAG){const e=document.createElement('div');e.id='klDiag';e.style.cssText='position:fixed;left:8px;bottom:8px;z-index:200;max-width:min(430px,94vw);max-height:62vh;overflow:auto;background:rgba(0,0,0,.84);color:#e8e2d0;font:11px/1.4 ui-monospace,Consolas,monospace;padding:8px 10px;border:1px solid #d4af63;white-space:pre-wrap;pointer-events:auto';
      const b=document.createElement('button');b.type='button';b.textContent='Копирай';b.style.cssText='float:right;margin:0 0 4px 8px;font:11px sans-serif;background:#d4af63;color:#111;border:0;padding:3px 8px;cursor:pointer';
      b.onclick=()=>{const txt=DG.el.lastChild.textContent;(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>{b.textContent='Копирано';},()=>{const r=document.createRange();r.selectNodeContents(DG.el.lastChild);const sl=getSelection();sl.removeAllRanges();sl.addRange(r);b.textContent='Ctrl+C';});};
      const body=document.createElement('div');e.append(b,body);document.body.appendChild(e);DG.el=e;
      try{const gl=renderer.getContext(),x=gl.getExtension('WEBGL_debug_renderer_info');DG.gpu=x?String(gl.getParameter(x.UNMASKED_RENDERER_WEBGL)):String(gl.getParameter(gl.RENDERER));}catch(err){}
      document.addEventListener('visibilitychange',()=>dlog(document.hidden?'разделът е скрит':'разделът е видим'));dlog('старт · ниво '+TIER);}
    function diagTick(now,f){DG.ft.push(f*1000);if(DG.ft.length>240)DG.ft.shift();
      if(f>.08){const g_=DG.seg||[0,0,0,0,0,0,0],r=x=>Math.round(x);dlog('дълъг кадър '+r(f*1000)+' ms · изглед '+view.name+(view.name==='tour'?' '+tour.k:'')+(LD.done?'':' · зареждане')+
        ' · код '+r(g_[6])+' ms (камера '+r(g_[0])+', сцена '+r(g_[1])+', анимации/лица '+r(g_[2])+', хора и аромат '+r(g_[3])+', надписи/DOM '+r(g_[4])+', рисуване '+r(g_[5])+')'+(g_[6]<f*1000*.4?' → извън кода: браузър / боклук / видеокарта':''));}
      const np=renderer.info.programs.length;if(DG.prog&&np>DG.prog)dlog('нов шейдър (общо '+np+')');DG.prog=np;
      const rg=window.__regenN||0,ru=(window.KL_GLTF&&KL_GLTF.reused)||0;if(rg>DG.regen)dlog('нов клиент · '+(ru>DG.reused?'от пула':'клониран'));DG.regen=rg;DG.reused=ru;
      // people: a shopper standing still while walking (stuck), a head that snaps round in one frame, someone outside the walls
      if(!DG.pp||f>1)DG.pp=new WeakMap(); /* after a pause (hidden tab) start watching afresh: no false 'stuck' alarms */const _q1=DG.q1||(DG.q1=new T.Quaternion()),_q2=DG.q2||(DG.q2=new T.Quaternion());
      people.forEach(g=>{const ud=g.userData;if(!g.visible)return;let r=DG.pp.get(g);if(!r){r={x:g.position.x,z:g.position.z,t:now,snap:0};DG.pp.set(g,r);}
        if(ud.state==='walk'){if(Math.hypot(g.position.x-r.x,g.position.z-r.z)>.08){r.x=g.position.x;r.z=g.position.z;r.t=now;r.warn=0;}else if(now-r.t>9000&&!r.warn){r.warn=1;dlog('клиент стои на място 9 s, докато върви (заседнал?) · '+g.position.x.toFixed(1)+', '+g.position.z.toFixed(1));}}else{r.x=g.position.x;r.z=g.position.z;r.t=now;}
        if(ud.gltfP&&ud.headB&&!ud.culled){ud.headB.getWorldQuaternion(_q1);g.getWorldQuaternion(_q2);_q2.invert().multiply(_q1);if(r.hq){const ang=r.hq.angleTo(_q2);if(ang>.45&&now-r.snap>3000){r.snap=now;dlog('рязко обръщане на глава '+Math.round(ang*57)+'° за един кадър · '+(ud.state||'')+' '+(ud.clip||''));}}else r.hq=new T.Quaternion();r.hq.copy(_q2);}
        if(Math.abs(g.position.x)>S.hw+.3&&!(Math.abs(g.position.x-S.door.x)<S.door.w&&g.position.z>S.hd-.5)&&g.position.z<S.hd+2&&!r.out){r.out=1;dlog('човек извън стените · '+g.position.x.toFixed(1)+', '+g.position.z.toFixed(1));}});
      if(now-DG.last<500)return;DG.last=now;const a=DG.ft.slice().sort((x,y)=>x-y),n=a.length||1,avg=a.reduce((x,y)=>x+y,0)/n;
      const mem=performance.memory?Math.round(performance.memory.usedJSHeapSize/1e6)+' MB':'—',ri=renderer.info;
      DG.el.lastChild.textContent='KAYA LUX · диагностика (?diag=1)\n'+
        'кадри: '+(1000/avg).toFixed(1)+' fps · средно '+avg.toFixed(1)+' ms · 95% '+a[Math.floor(n*.95)|0].toFixed(0)+' ms · макс '+a[n-1].toFixed(0)+' ms\n'+
        'засечки: '+Math.round((pf.jank||0)*100)+'% · ниво '+TIER+' · резолюция '+dpr.toFixed(2)+' · '+(pf.half?'30 fps':'пълна скорост')+(pf.probing?' (проба)':'')+' · стъпка '+(pf.q||0)+' · сенки '+(renderer.shadowMap.enabled?'да':'не')+'\n'+
        'рисувания '+ri.render.calls+' · триъгълници '+ri.render.triangles+' · шейдъри '+np+' · геометрии '+ri.memory.geometries+' · текстури '+ri.memory.textures+'\n'+
        (()=>{const c={};people.forEach(g=>{if(g.visible){const k=g.userData.pay?'каса':g.userData.state||'?';c[k]=(c[k]||0)+1;}});const pa=people.find(g=>g.userData.pay);let al=0;for(let i=0;i<PN;i++)if(pAl[i]>.02)al++;
          return 'хора: '+Object.entries(c).map(([k,v])=>k+' '+v).join(', ')+' · опашка '+qOcc.map(q=>q?'●':'○').join('')+(pa?' · каса: '+(pa.userData.phase||'')+' '+(pa.userData.pay.n)+' ст.':'')+'\nаромат: пръскат '+S.units.filter(u=>u.act).length+'/'+S.units.length+' дифузера · частици '+al+'/'+PN+'\n';})()+
        'хора '+people.length+' · пул '+((window.KL_GLTF&&KL_GLTF.poolN)||0)+' · памет '+mem+' · време '+Math.round((now-DG.t0)/1000)+' s\n'+
        'видеокарта: '+DG.gpu+'\n'+navigator.userAgent.replace(/^Mozilla\/5.0 /,'')+'\n\n'+DG.log.join('\n');}
    // the note under a diffuser: appears once the camera has arrived (tour or a click on its number), stays for the reading time, fades out on the move
    const TIP={el:null,u:-1,on:false,w:0,h:0};
    // „you can steer it yourself“: shown while the presentation plays by itself, gone the moment the visitor takes over, back when it resumes
    const HELP={el:$('#stageHelp'),on:false,h:0,last:-1e9};
    ['pointerdown','touchstart','wheel'].forEach(t=>stage.addEventListener(t,()=>{HELP.last=performance.now();},{passive:true,capture:true}));
    function helpFrame(){if(!HELP.el)return;const nw=performance.now();if(HELP.at==null&&view.name==='tour'&&tour.k>=0&&tour.k<=1&&LD.done)HELP.at=nw; /* once: ~5 s just after the camera has come inside, then only the 3D chip stays */
      const on=HELP.at!=null&&nw-HELP.at<5200&&view.name==='tour'&&nw-HELP.last>1500;if(on!==HELP.on){HELP.on=on;HELP.el.classList.toggle('on',on);if(on&&!HELP.h)HELP.h=HELP.el.offsetHeight;}}
    {const e=document.createElement('div');e.className='unit-tip';e.setAttribute('aria-live','polite');e.innerHTML='<b></b><span></span><p></p>';ovl.appendChild(e);TIP.el=e;}
    function tipFrame(w,h){let u=-1;
      if(!tween&&!drag&&!TCH.n&&S.units&&S.units.length){if(view.name==='tour'&&tour.k>=3&&tour.k-3<S.units.length&&tour.t>.15)u=tour.k-3;else if(view.name==='focus'&&TIP.fu!=null)u=TIP.fu;}
      if(HELP.on)u=-1; // never both: one thing to read at a time
      const un=u>=0?S.units[u]:null;
      if(un){if(TIP.u!==u||TIP.tok!==buildTok){TIP.tok=buildTok;const i=un.info||{};TIP.el.children[0].textContent=(u+1)+' · '+(i.title||'Дифузер');TIP.el.children[1].textContent=i.zone||'';TIP.el.children[2].textContent=i.why||'';TIP.u=u;TIP.w=0;}
        v3.set(un.p[0]+un.d[0]*.14,un.p[1]-(un.PL?.24:.17),un.p[2]+un.d[2]*.14).project(camera);
        if(v3.z<1&&Math.abs(v3.x)<1.2&&Math.abs(v3.y)<1.2){if(!TIP.w){TIP.w=TIP.el.offsetWidth;TIP.h=TIP.el.offsetHeight;}
          const x=clamp((v3.x+1)/2*w,TIP.w/2+8,w-TIP.w/2-8),y=clamp((1-v3.y)/2*h+12,8,h-TIP.h-(HELP.on?HELP.h+24:8)),tf='translate('+(x-TIP.w/2).toFixed(0)+'px,'+y.toFixed(0)+'px)',ax=clamp((v3.x+1)/2*w-(x-TIP.w/2),16,TIP.w-16).toFixed(0)+'px';
          if(TIP.tf!==tf){TIP.tf=tf;TIP.el.style.transform=tf;}if(TIP.ax!==ax){TIP.ax=ax;TIP.el.style.setProperty('--ax',ax);} /* the arrow points at the diffuser even when the note is pushed off-centre */if(!TIP.on){TIP.on=true;TIP.el.classList.add('on');}return;}}
      if(TIP.on){TIP.on=false;TIP.el.classList.remove('on');}if(!un)TIP.u=-1;}
    const hudIn=!!(hud&&stage.contains(hud)); // the info card sits under the set now: no per-frame measuring against it
    const _fr=new T.Frustum(),_fm=new T.Matrix4(),_sp=new T.Sphere(new T.Vector3(),1.15);let onScr=()=>true,vis=false,raf=0,last=0,lightK=1,hover=false,fno=0,lastR=0;window.__q=()=>({TIER,dpr,shadows:renderer.shadowMap.enabled,avg:pf.avg,half:!!pf.half,q:pf.q||0,probing:!!pf.probing,jank:pf.jank});const v3=new T.Vector3();
    const touchUI=matchMedia('(hover: none)').matches;stage.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;kick();}});stage.addEventListener('pointerleave',()=>{hover=false;});
    // the advert screen: each slide 7 s, then a 0.8 s cross-fade to the next
    function adsTick(now){const a=S.ads,AT=S.adSlides||M.adTex;if(!a||!AT)return;const n=AT.length,t=now/1000/7.8,k=Math.floor(t)+a.i,f=t%1,fd=clamp((f*7.8-7)/.8,0,1);a.A.material.map=AT[k%n];a.B.material.map=AT[(k+1)%n];a.B.material.opacity=fd;a.B.visible=fd>0;}
    function frame(now){adsTick(now);
      raf=0;if((!vis&&LD.done&&!onScr())||document.hidden)return; // while it is still getting ready it keeps working off-screen, so it is ready when the visitor scrolls to it
      if(window.__klBusy){if(!raf)raf=requestAnimationFrame(frame);return;} // някой подписва: пауза на рендера
      if(pf.half&&(fno++&1)){if(!raf)raf=requestAnimationFrame(frame);return;} // weak machines: every other display frame, a steady 30 fps instead of an uneven 40-50
      {const f=Math.min(.25,(now-(lastR||now))/1000);lastR=now;if(f>0&&f<.2){pf.t+=f;pf.n++;if(f>(pf.half?.05:.03))pf.j=(pf.j||0)+1;}if(DIAG&&f>0)diagTick(now,f);
        if(pf.t>(LD.done?2:1.1)){const jank=(pf.j||0)/pf.n,avg0=pf.t/pf.n,avg=jank>.15?Math.max(avg0,1):avg0;pf.t=0;pf.n=0;pf.j=0;pf.avg=avg0;pf.jank=+jank.toFixed(2); // uneven frames count as slow even when the average looks fine (a hot laptop, a busy browser)
          // adaptive smoothness, decided on two slow windows in a row (a single busy moment changes nothing):
          // 1) a steady 30 fps – free to switch and REVERSIBLE: every 20–120 s the full frame rate is tried again and kept if the machine copes;
          // 2) only if even 30 fps is not held: resolution one step down, then no shadows, then resolution once more (these never go back,
          //    because each one re-allocates the canvas or recompiles, and that itself would be a stutter)
          if(LD.done||LD.settle){const nowS=performance.now();let changed=false;
            if(pf.probing){pf.probing=false;changed=true;if(avg<=.021){pf.half=false;pf.back=45000;}else{pf.half=true;fno=0;pf.back=Math.min(300000,(pf.back||45000)*2);pf.probeAt=nowS+pf.back;}}
            else if(!pf.half){if(avg>.024){if(++pf.slowN>=3){pf.half=true;fno=0;pf.slowN=0;changed=true;pf.back=pf.back||45000;pf.probeAt=nowS+pf.back;}}else pf.slowN=0;}
            else if(avg>.045){if(++pf.slowN>=2&&(pf.q||0)<3){pf.slowN=0;changed=true;pf.q=(pf.q||0)+1;const floor=Math.min(dprMax,TIER===0?.62:.72);
                if((pf.q!==2||LD.done)&&dpr>floor){dpr=Math.max(floor,dpr*(pf.q===1?.75:.85));renderer.setPixelRatio(dpr);pm.uniforms.uScale.value=stage.clientHeight*dpr/2/Math.tan(camera.fov*Math.PI/360)*.5;}
                else if(renderer.shadowMap.enabled&&!LD.done){renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);}});warm();root.classList.add('lowfx');}}}
            else{pf.slowN=0;if(TIER>0&&LD.done&&pf.probeAt&&nowS>pf.probeAt){pf.probing=true;pf.half=false;changed=true;}}
            if(DIAG&&changed)dlog('качество: '+(pf.half?'30 fps':'пълна скорост')+(pf.probing?' (проба)':'')+' · стъпка '+(pf.q||0)+' · резолюция '+dpr.toFixed(2)+' · средно '+(avg0*1000).toFixed(0)+' ms, засечки '+Math.round(jank*100)+'%');
            if(!changed&&(pf.slowN===0||(pf.q||0)>=3))pf.ok=1;}}}
      const pT0=performance.now();const dt=Math.min(.05,(now-(last||now))/1000);last=now;
      if(state.playing){state.t+=dt*34;if(state.t>=1380){state.t=1380;state.playing=false;}paintClock();}
      if(tween){tween.t+=dt/tween.dur;const k=tween.t>=1?1:(tween.t<.5?4*tween.t**3:1-Math.pow(-2*tween.t+2,3)/2);
        if(tween.ct){_tc.lerpVectors(tween.c0,tween.c1,k);_tc.y+=tween.lift*Math.sin(Math.PI*k);_tt.lerpVectors(tween.t0,tween.t1,k);Object.assign(view,viewFrom(_tc,_tt));camera.position.copy(_tc);camera.lookAt(_tt);}
        else{['theta','phi','r','tx','ty','tz'].forEach(p=>view[p]=tween.from[p]+(tween.to[p]-tween.from[p])*k);apply();}if(tween.t>=1)tween=null;}
      else if(spin.vx||spin.vy){view.theta-=spin.vx*dt*1000*.0072;view.phi=clamp(view.phi-spin.vy*dt*1000*.005,.07,1.5);const k=Math.exp(-dt*4.2);spin.vx*=k;spin.vy*=k;if(Math.abs(spin.vx)+Math.abs(spin.vy)<.004)spin.vx=spin.vy=0;idle=0;apply();}
      else if(!drag&&view.name==='tour'&&LD.done)tourStep(dt);
      else if(!drag&&!TCH.n&&view.name!=='walk'&&view.name!=='ddd'&&!hover){if(view.name==='fp'&&(FPV.path||Object.values(FPV.keys||{}).some(Boolean)))idle=0;idle+=dt;if(idle>(view.name==='fp'?25:touchUI?8:14))go('tour');}
      if(view.name==='fp')fpStep(dt);
      {const tf=view.name==='fp'?(camera.aspect<1?72:60):38;if(Math.abs(camera.fov-tf)>.05){camera.fov=Math.abs(camera.fov-tf)<.3?tf:camera.fov+(tf-camera.fov)*Math.min(1,dt*5);camera.updateProjectionMatrix();pm.uniforms.uScale.value=stage.clientHeight*renderer.getPixelRatio()/2/Math.tan(camera.fov*Math.PI/360)*.5;}} // on foot the eye sees as wide as a person does; the overviews keep their narrower lens
      if(view.name==='walk'&&people.length){let p=(camSub&&camSub.parent&&camSub.visible&&camSub.userData.state==='walk')?camSub:null;const inside=g=>g.visible&&g.parent&&g.position.z<S.hd-1.2&&Math.abs(g.position.x)<S.hw-.2;const browsing=g=>{const u=g.userData,l=u.visit&&u.visit[u.legI];return !!l&&l.kind==='browse';};if(p&&(!inside(p)||!browsing(p)))p=null;if(!p){const w=people.filter(g=>inside(g)&&browsing(g)&&g.userData.follow==null&&g.userData.state==='walk'&&!g.userData.turning&&Math.cos(g.rotation.y)<.3);if(w.length){w.sort((a,b)=>a.position.distanceToSquared(camera.position)-b.position.distanceToSquared(camera.position));p=w[0];}}if(p)camSub=p;p=camSub&&camSub.parent&&inside(camSub)?camSub:(people.find(g=>inside(g)&&g.userData.follow==null)||people.find(inside)||people[0]);const ud=p.userData;if(ud.state==='walk'&&!ud.turning&&inside(p))ud.camAng=p.rotation.y;else ud.camAng=Math.atan2((S.mainX||0)*.3-p.position.x,-S.hd*.3-p.position.z);const fw=new T.Vector3(0,0,1).applyAxisAngle(new T.Vector3(0,1,0),ud.camAng),side=new T.Vector3(fw.z,0,-fw.x);
        let want=null;for(let d=3.2;d>=1.2;d-=.2){const x=p.position.x-fw.x*d+side.x*.5*(d/3.2),z=p.position.z-fw.z*d+side.z*.5*(d/3.2);const cc=nav?nav.toCell(x,z):null;if(z<S.hd-.35&&Math.abs(x)<S.hw-.3&&(!nav||nav.free(nav.G0,cc[0],cc[1]))){want=new T.Vector3(x,1.55,z);break;}}
        if(!want)want=new T.Vector3(p.position.x,1.55,p.position.z);camera.position.lerp(want,walkSnap?1:Math.min(1,dt*2));walkSnap=false;const tgt=new T.Vector3(p.position.x+fw.x*3.0,1.42,p.position.z+fw.z*3.0);camGuard(new T.Vector3(p.position.x,1.45,p.position.z));camera.lookAt(tgt);}
      // „Последвай Венци“: behind him while he walks; while he works, a spot that sees him and the diffuser; the entrance while he is out
      if(view.name==='ddd'){const g=VZ.g,cell=(x,z)=>{if(!nav)return true;const c=nav.toCell(x,z);return z<S.hd-.35&&Math.abs(x)<S.hw-.3&&nav.free(nav.G0,c[0],c[1]);};let want=null,tg=null;
        if(g&&g.visible){const ud=g.userData,a=ud.ang||0,fx=Math.sin(a),fz=Math.cos(a),px=g.position.x,pz=g.position.z,dz=ud.dz;
          if(ud.state==='ddd'){const wk=vzWork(g);if(wk){const r_=vzWorkCam(wk,cell,dt);want=r_[0];tg=r_[1];}}
          if(!want){/* walking: the camera circles round to his back at a limited turn rate (never cuts in front of him when he turns) */VZ.camYaw=(walkSnap||VZ.camYaw==null)?a:angStep(VZ.camYaw,a,4,dt,3.2);const bx=Math.sin(VZ.camYaw),bz=Math.cos(VZ.camYaw);let dA=Math.abs(((a-VZ.camYaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI);const lift_=.7*clamp((dA-.9)/1.4,0,1); /* mid-turn: from higher up, over him */for(let d=2.8;d>=1.1&&!want;d-=.2){const x=px-bx*d-bz*.4,z=pz-bz*d+bx*.4;if(cell(x,z))want=new T.Vector3(x,1.7+lift_,z);}if(!want)want=new T.Vector3(px-bx*1.1,2.1,pz-bz*1.1);tg=new T.Vector3(px+bx*1.6,1.05,pz+bz*1.6);}else VZ.camYaw=Math.atan2(px-camera.position.x,pz-camera.position.z);}
        else{want=new T.Vector3(S.door.x-.9,1.9,S.hd+1.9);tg=new T.Vector3(S.door.x,1.0,S.hd-2.2);}
        VZ.camT=VZ.camT||tg.clone();camera.position.lerp(want,walkSnap?1:Math.min(1,dt*2.2));VZ.camT.lerp(tg,walkSnap?1:Math.min(1,dt*3));walkSnap=false;if(!isFinite(camera.position.x+camera.position.y+camera.position.z))camera.position.copy(isFinite(want.x+want.y+want.z)?want:new T.Vector3(S.door.x-.9,1.9,S.hd+1.9));if(!isFinite(VZ.camT.x+VZ.camT.y+VZ.camT.z))VZ.camT.copy(tg);if(VZ.g&&VZ.g.visible){const hb_=VZ.g.userData.headB;if(hb_){hb_.getWorldPosition(_zS);camGuard(_zS.clone());}}camera.lookAt(VZ.camT);}
      const _t1=DIAG?performance.now():0;
      if(!LD.done)ldTick();
      const on=sysOn(state.t),open=isOpen(state.t);
      // automatic door: opens when someone comes within ~1.4 m, closes behind them
      if(S.doorLeaves){let near=Math.abs(camera.position.x-S.door.x)<S.door.w/2+.8&&Math.abs(camera.position.z-S.hd)<3.2&&camera.position.y<2.4;if(!near)for(const p of people){if(p.visible&&Math.abs(p.position.x-S.door.x)<S.door.w/2+.8&&Math.abs(p.position.z-S.hd)<1.4){near=true;break;}}
        S.doorK+=((near?1:0)-S.doorK)*Math.min(1,dt*(near?5:2.2));const dk=S.doorK*S.doorK*(3-2*S.doorK);S.doorLeaves.forEach(l=>{l.position.x=l.userData.x0+l.userData.s*dk*S.door.w/2*.9;});}
      // the back and left walls fade out when the camera is behind them
      {const fade=(m,out)=>{const tg=out?.1:1;m.opacity+=(tg-m.opacity)*Math.min(1,dt*5);const tr=m.opacity<.985;if(m.transparent!==tr){m.transparent=tr;m.depthWrite=!tr;m.needsUpdate=true;}};fade(M.wallB,camera.position.z<-S.hd);fade(M.wallL,camera.position.x<-S.hw);
        const high=camera.position.y>S.H*.95;[M.vcF,M.wallF].forEach(m=>fade(m,high&&camera.position.z>S.hd));{const m=M.facade,tg=high&&camera.position.z>S.hd?.72:1;m.opacity+=(tg-m.opacity)*Math.min(1,dt*5);const tr=m.opacity<.985;if(m.transparent!==tr){m.transparent=tr;m.needsUpdate=true;}}
        if(S.ceil){const hide=camera.position.y>S.H-.3;S.ceil.forEach(o=>o.visible=!hide);}}
      lightK+=((open?1:.45)-lightK)*Math.min(1,dt*3);M.cool.emissiveIntensity=.5*lightK;
      S.units.forEach(u=>{u.led.visible=on;u.pin.classList.toggle('off',!on);});
      M.led.color.setScalar(.3+.7*clamp((lightK-.45)/.55,0,1));if(S.lights)S.lights.forEach(l=>{l.intensity=.22*lightK;});if(S.coolLight)S.coolLight.intensity=.3*(.4+.6*lightK);
      if(S.sign){const sm=open?M.signOpen:M.signClosed;if(S.sign.material!==sm){S.sign.material=sm;S.sign2.material=sm;}}
      extras.forEach(e=>{if(!e.userData.restocker)e.visible=open;if(e.visible&&!window.__frz)poseAny(e,now/1000,dt,e.userData.walkV||0);});const _t2=DIAG?performance.now():0;if(GL()&&!window.__frz){window.KL_GLTF.update(dt);gltfHeads(dt);vzProps(dt);}if(!window.__frz)tillPlace();const _t3=DIAG?performance.now():0;
      const tt=now/1000;S.units.forEach(u=>{const cyc=(tt/PUFF_T+u.ph)%1;let pk=on&&cyc<PUFF_ON/PUFF_T?Math.sin(Math.PI*cyc*PUFF_T/PUFF_ON):0;if(u.vzBusy&&u.vzBusy>performance.now()/1000)pk=0; /* never into the face of the man refilling it */if(u.vzPuff&&u.vzPuff>tt)pk=Math.max(pk,Math.sin(Math.PI*clamp(1-(u.vzPuff-tt)/2.6,0,1))); /* the test puff after a refill */u.act=pk>0; // puff … rest … puff
        if(u.jet){const vis=pk>.02,o=u.o,up=u.PL?1:0,dx=u.d[0]*(1-.55*up),dz=u.d[2]*(1-.55*up);u.jet.forEach((js,k)=>{js.visible=vis;if(!vis)return;const ph=(tt*.85+k/6)%1;
          js.position.set(o[0]+dx*(.04+.7*ph),o[1]+.02+(.08+.5*up)*ph+.18*ph*ph,o[2]+dz*(.04+.7*ph));const sc=.06+.46*ph;js.scale.set(sc,sc,1);js.material.opacity=pk*.8*Math.sin(Math.PI*Math.min(1,ph*1.4))*(1-.45*ph);});} // mist streaming out while it sprays
        u.plume.visible=pk>.02;if(u.plume.visible){const q=cyc*PUFF_T/PUFF_ON,up=u.PL?1:0,out=.06+.3*q,o=u.o;u.plume.position.set(o[0]+u.d[0]*out,o[1]+.04+(.12+.1*up)*q,o[2]+u.d[2]*out);const sc=.16+.34*q;u.plume.scale.set(sc*(1.1+.3*up),sc*1.35,1);u.plume.material.opacity=.55*pk*(1-.35*q);}
        const k=(tt*.32+u.ph)%1,r=.3+k*u.R*1.1;u.wave.scale.set(r,r,r);u.wave.material.opacity=on?(1-k)*.1:0;});
      if(flowLine&&flowLine.visible)M.flow.map.offset.x-=dt*1.1;
      stepP(dt,on,false);stepHeat(dt);
      if(nav&&!window.__frz)stepPeople(dt,now/1000,open);const _t4=DIAG?performance.now():0;
      const _cav=camAvoid(dt);camera.updateMatrixWorld();_fm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);_fr.setFromProjectionMatrix(_fm);
      people.concat(extras).forEach(p=>{if(!p.visible)return;const d=Math.hypot(p.position.x-camera.position.x,p.position.z-camera.position.z);_sp.center.set(p.position.x,p.position.y+.9,p.position.z);const inV=_fr.intersectsSphere(_sp);p.userData.culled=!inV;_sp.radius=2.6;p.userData.culledFar=!_fr.intersectsSphere(_sp);_sp.radius=1.15; /* arms and hands keep being posed a little beyond the frame edge, so nobody walks into view mid-snap */if(p.userData.gltfP){if(p.children[0])p.children[0].visible=d>.38&&inV;}else if(p.userData.skin){const m=p.userData.skin.material,o=Math.max(0,Math.min(1,(d-.35)/.5));if(o<1||m.transparent){m.transparent=o<1;m.opacity=o;m.depthWrite=o>=.5;}}});
      const w=w0||stage.clientWidth,h=h0||stage.clientHeight;
      const kept=[],LBL=stage.classList.contains('show-labels');overlay.forEach(o=>{if(o.kind==='lbl'&&!LBL){o.off=true;return;}v3.copy(o.v).project(camera);o.sx=(v3.x+1)/2*w;o.sy=(1-v3.y)/2*h;o.sz=v3.z;o.off=v3.z>1||v3.x<-1.1||v3.x>1.1||v3.y<-1.1||v3.y>1.1;});
      let HR=null;if(hud&&hudIn&&hud.offsetParent){const a=hud.getBoundingClientRect(),b=stage.getBoundingClientRect();HR=[a.left-b.left,a.top-b.top,a.right-b.left,a.bottom-b.top];}
      overlay.filter(o=>o.kind==='lbl'&&!o.off).sort((a,b)=>a.sz-b.sz).forEach(o=>{if(!o.w){o.w=o.el.offsetWidth||80;o.h=o.el.offsetHeight||18;}if(HR&&o.sx+o.w/2>HR[0]&&o.sx-o.w/2<HR[2]&&o.sy+o.h/2>HR[1]&&o.sy-o.h/2<HR[3]){o.off=true;return;}if(kept.some(k=>Math.abs(k.sx-o.sx)<(k.w+o.w)/2+4&&Math.abs(k.sy-o.sy)<(k.h+o.h)/2+2))o.off=true;else kept.push(o);});
      {const cp=camera.position,inFoot=Math.abs(cp.x)<S.hw&&Math.abs(cp.z)<S.hd,topv=view.name==='plan'||(view.name==='tour'&&!!tour.top)||cp.y>S.H+2.2;if(!inFoot&&!topv)overlay.forEach(o=>{if(o.kind==='pin')o.off=true;});} // numbers appear only once the camera is inside the store (any view: tour, free-rotate, focus); still shown from above (top view / high angle)
      {const top=view.name==='plan'||(view.name==='tour'&&!!tour.top);if(!top)autoLayers(false);} // leaving the top view by any path (a diffuser number, a store switch…) switches them off
      helpFrame();tipFrame(w,h);
      overlay.forEach(o=>{if(o.kind==='pin'&&HR&&!o.off&&o.sx>HR[0]-20&&o.sx<HR[2]+20&&o.sy>HR[1]-20&&o.sy<HR[3]+20)o.off=true;});
      {const FOL=view.name==='ddd';overlay.forEach(o=>{if(FOL?(o.kind==='pin'||o.kind==='lbl'):o.kind==='vz')o.off=true;});} // one voice at a time: following him shows only his name and subtitles, any other view only the numbers and labels of the store
      overlay.forEach(o=>{if(o.vis!==!o.off){o.vis=!o.off;o.el.style.visibility=o.off?'hidden':'visible';}if(!o.off){const tf='translate('+o.sx.toFixed(1)+'px,'+o.sy.toFixed(1)+'px)'+(o.kind==='lbl'?' translate(-50%,-50%)':' translate(-50%,-100%)');if(o.tf!==tf){o.tf=tf;o.el.style.transform=tf;}}}); // DOM written only when something changed
      const pT1=performance.now();if(window.__camLock){const c_=window.__camLock;camera.position.set(c_.p[0],c_.p[1],c_.p[2]);camera.lookAt(c_.t[0],c_.t[1],c_.t[2]);}renderer.render(scene,camera);if(_cav)camera.position.sub(_cav);if(DIAG){const e=performance.now();DG.seg=[_t1-pT0,_t2-_t1,_t3-_t2,_t4-_t3,pT1-_t4,e-pT1,e-pT0];}if(window.__prof){const P=window.__prof;P.js+=pT1-pT0;if(pT1-pT0>(P.max||0))P.max=pT1-pT0;(P.h=P.h||[]).push(+(pT1-pT0).toFixed(1));P.gl+=performance.now()-pT1;P.n++;}if(window.__perf){window.__perf.frames=(window.__perf.frames||0)+1;if(!window.__perf.first)window.__perf.first=performance.now();}
      if(!raf)raf=requestAnimationFrame(frame); // exactly one loop: a kick() during this frame (a tour key, a click) has already scheduled the next one
    }
    onScr=()=>{const r_=stage.getBoundingClientRect(),v_=r_.height>0&&r_.bottom>0&&r_.top<innerHeight;if(v_&&!vis){vis=true;root.classList.add('klive');}return v_;};
    kick=()=>{if(!raf&&(vis||!LD.done||onScr())){last=0;raf=requestAnimationFrame(frame);}};
    window.__renderNow=()=>{renderer.render(scene,camera);};window.__gl=()=>({renderer,scene,camera,M});window.__view=()=>({...view,spin:spin.vx});
    window.__cam=(x,y,z,tx,ty,tz)=>{view.name='free';tween=null;camera.position.set(x,y,z);camera.lookAt(tx,ty,tz);$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));kick();};
    window.__tri=()=>{renderer.render(scene,camera);return {tri:renderer.info.render.triangles,calls:renderer.info.render.calls,geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures};};
    window.__people=()=>people.map(p=>({x:p.position.x,y:p.position.y,z:p.position.z,ry:p.rotation.y,st:p.userData.state,leg:p.userData.legI,vis:p.visible,yl:!!p.userData.yielding,tn:!!p.userData.turning,vn:+(p.userData.vNow||0).toFixed(2),wa:+(p.userData.waitAcc||0).toFixed(1),pi:p.userData.pi,pl:p.userData.path?p.userData.path.length:0,sq:!!p.userData.squeeze,basket:!!p.userData.hasBasket,buyer:!!p.userData.buyer,items:p.userData.items,pay:!!p.userData.pay,cash:p.userData.pay?!!p.userData.pay.cash:null,phase:p.userData.phase||null,slot:p.userData.slot}));window.__qslots=()=>nav.queue.slice();window.__params=PARAMS;window.__units=()=>S.units.map(u=>({p:u.p,d:u.d,o:u.o,PL:u.PL}));window.__kinds=()=>{const o={gltf:0,proc:0,regen:window.__regenN||0,upg:window.__upgN||0};people.concat(extras).forEach(p=>{if(p.userData.gltfP)o.gltf++;else o.proc++;});o.memG=renderer.info.memory.geometries;o.memT=renderer.info.memory.textures;o.prog=renderer.info.programs.length;return o;};
    window.__strollers=()=>people.filter(p=>p.userData.stroller&&p.visible).map(p=>{const st=p.userData.stroller,fx=st.position.x-p.position.x,fz=st.position.z-p.position.z;let d=Math.atan2(fx,fz)-p.rotation.y;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;let r=st.rotation.y-Math.atan2(fx,fz);r=((r+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return {st:p.userData.state,off:+d.toFixed(2),face:+r.toFixed(2),dist:+Math.hypot(fx,fz).toFixed(2)};});window.__queue=()=>qOcc.map(q=>q?1:0).join('');
    const navViol=()=>{const out=[];people.forEach((p,i)=>{if(!p.visible)return;const x=p.position.x,z=p.position.z;const inRoom=x>-S.hw&&x<S.hw&&z>-S.hd&&z<S.hd,inApron=Math.abs(x-S.door.x)<S.door.w/2&&z>=S.hd&&z<=S.hd+1.6;const [ci,cj]=nav.toCell(x,z);const occ=nav.G0[cj*nav.cols+ci]===1;if(!(inRoom||inApron)||occ)out.push([i,+x.toFixed(2),+z.toFixed(2),p.userData.state,occ?'occ':'out']);});return out;};
    window.__bodies=()=>people.concat(extras).filter(p=>p.visible&&!p.userData.gltfP).map(p=>{const v=new T.Vector3(),f=new T.Vector3();p.userData.head.getWorldPosition(v);p.userData.legs[0].userData.ft.getWorldPosition(f);const sm=p.userData.skin;return {head:+(v.y-p.position.y).toFixed(2),foot:+(f.y-p.position.y).toFixed(2),dxz:+Math.hypot(v.x-p.position.x,v.z-p.position.z).toFixed(2),op:sm?+sm.material.opacity.toFixed(2):null,bound:!!(sm&&sm.skeleton),st:p.userData.state};});
    window.__inView=maxD=>{camera.updateMatrixWorld();const v=new T.Vector3();let n=0;people.concat(extras).forEach(p=>{if(!p.visible)return;const d=p.position.distanceTo(camera.position);if(d<1||d>(maxD||14))return;const ok=[0.05,1.6*(p.userData.k||1)*(p.scale.x||1)].every(h=>{v.set(p.position.x,p.position.y+h,p.position.z).project(camera);return v.z<1&&Math.abs(v.x)<.95&&Math.abs(v.y)<.95;});if(ok)n++;});return n;};
    window.__nav=()=>nav;window.__obsAt=(x,z)=>OBS.filter(r=>x>=r[0]-.01&&x<=r[1]+.01&&z>=r[2]-.01&&z<=r[3]+.01);
    window.__navStress=(steps,dt)=>{dt=dt||.05;let viol=0,samples=0;const ex=[];if(window.__simT==null)window.__simT=performance.now()/1000;for(let s=0;s<steps;s++){window.__simT+=dt;stepPeople(dt,window.__simT,true);extras.forEach(e=>{if(e.visible)poseAny(e,window.__simT,dt,e.userData.walkV||0);});if(GL())window.KL_GLTF.update(dt);const v=navViol();samples+=people.length;if(v.length){viol+=v.length;if(ex.length<5)ex.push(v[0]);}}return {steps,samples,viol,ex,failed:nav.failed(),people:people.length};};
    window.__navCheck=sec=>new Promise(res=>{let viol=0,samples=0,frames=0;const ex=[];const t0=performance.now();const tick=()=>{frames++;const v=navViol();samples+=people.length;if(v.length){viol+=v.length;if(ex.length<5)ex.push(v[0]);}if(performance.now()-t0<sec*1000)requestAnimationFrame(tick);else res({frames,samples,viol,ex});};requestAnimationFrame(tick);});
    window.__freeze=b=>{window.__frz=!!b;};
    window.__heads=dt=>{gltfHeads(dt||1/30);renderer.render(scene,camera);}; // debug: only the after-mixer layer (hands, props, heads)
    // debug: an unnatural-motion audit. Freezes the loop, runs the people for `secs` in fixed steps (no drawing) and measures, every frame,
    // for everyone visible: jumps (teleports), snapping turns, feet sliding (moving without walking) / walking on the spot, hand and head
    // tremor (direction reversals of fast small moves), people inside each other or inside fixtures, feet off / into the floor, props that jump.
    window.__motion=(secs,dt)=>{dt=dt||1/30;const N=Math.round(secs/dt),was=!!window.__frz;window.__frz=true;if(window.__simT==null)window.__simT=performance.now()/1000;
      const R={teleport:[],spin:[],slide:[],moon:[],handTrem:[],headTrem:[],overlap:[],inFixture:[],feet:[],propJump:[],stuck2s:[],tillIdle:[],pinch:[],loiter:[],nan:0},tI={t:0};const seen=new Map(),props=new Map();const t0s=Object.assign({},window.__tillStats||{});
      const lbl=g=>{const u=g.userData;return (u.cashier?'cashier':u.restocker?'restocker':u.isChild?'child':u.elder?'elder':'adult')+'#'+(people.indexOf(g)>=0?people.indexOf(g):'x'+extras.indexOf(g))+' st='+u.state+' clip='+u.clip+(u.phase?' ph='+u.phase:'')+(u.pushing?' cart':'')+(u.follow!=null?' follow':'');};
      const B=(g,n)=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n),wp=o=>{const v=new T.Vector3();o.getWorldPosition(v);return v;};
      const push=(k,o)=>{if(R[k].length<400)R[k].push(o);};
      for(let s=0;s<N;s++){window.__simT+=dt;const T_=window.__simT;stepPeople(dt,T_,true);extras.forEach(e=>{if(e.visible)poseAny(e,T_,dt,e.userData.walkV||0);});if(GL()){window.KL_GLTF.update(dt);gltfHeads(dt);vzProps(dt);}tillPlace();
        const all=people.concat(extras).filter(g=>g.visible);
        all.forEach(g=>{const u=g.userData,p=g.position;if(!isFinite(p.x)||!isFinite(p.z)){R.nan++;return;}if(u.culledFar){seen.delete(g);return;}
          let h=seen.get(g);if(!h){h={p:p.clone(),ry:g.rotation.y,hand:null,hv:null,hr:0,head:null,dv:null,drv:0,mv:0};seen.set(g,h);return;}
          const sp=Math.hypot(p.x-h.p.x,p.z-h.p.z)/dt;h.spd=(h.spd==null?sp:h.spd*.85+sp*.15);const dy=Math.atan2(Math.sin(g.rotation.y-h.ry),Math.cos(g.rotation.y-h.ry))/dt;
          if(sp>3.2)push('teleport',{t:+T_.toFixed(2),who:lbl(g),v:+sp.toFixed(1),at:[+p.x.toFixed(2),+p.z.toFixed(2)]});
          if(Math.abs(dy)>7)push('spin',{t:+T_.toFixed(2),who:lbl(g),w:+dy.toFixed(1)});
          const walking=/walk/.test(u.clip||'');
          h.sl=(u.gltfP&&!walking&&sp>.2&&!u.pushing)?(h.sl||0)+1:0;if(h.sl===3)push('slide',{t:+T_.toFixed(2),who:lbl(g),v:+sp.toFixed(2),vNow:+(u.vNow||0).toFixed(2),bl:+(u.blend||0).toFixed(2)});
          if(u.gltfP&&walking){h.mv=h.spd<.08&&!u.turning?h.mv+dt:0;if(h.mv>.8&&h.mv<.8+dt*1.5)push('moon',{t:+T_.toFixed(2),who:lbl(g),vNow:+(u.vNow||0).toFixed(2),st:u.state,dockV:u.dockV||0,room:!!u.room});}
          if(u.gltfP){const a=armBones(g)[1],hb=a&&a[2],hd=u.headB||B(g,'Head');
            [[hb,'hand','hv','hr','handTrem'],[hd,'head','dv','drv','headTrem']].forEach(([bone,k,vk,rk,rep])=>{if(!bone)return;const w=wp(bone);
              // motion relative to the body (walking itself is not tremor)
              w.x-=p.x;w.z-=p.z;if(h[k]){const v=w.clone().sub(h[k]);if(k==='hand'){(h.hh=h.hh||[]).push([+(v.x*1000).toFixed(1),+(v.y*1000).toFixed(1),+(v.z*1000).toFixed(1),u.clip]);if(h.hh.length>12)h.hh.shift();}if(h[vk]&&v.length()>.0025&&h[vk].length()>.0025&&v.dot(h[vk])<-.6*v.length()*h[vk].length())h[rk]+=1;else h[rk]=Math.max(0,h[rk]-.15);
                if(h[rk]>=5){push(rep,{t:+T_.toFixed(2),who:lbl(g),legs:u.legsOn,vA:+(u.vAct||0).toFixed(2),vN:+(u.vNow||0).toFixed(2),bl:+(u.blend||0).toFixed(2),arm:u.armS?u.armS.map(a=>+a.w.toFixed(2)):null,ik:!!u.ikReq,rch:u.rch?+u.rch.p.toFixed(2):null,dry:+((g.rotation.y-h.ry)/dt).toFixed(2),tn:!!u.turning,yl:!!u.yielding,room:!!u.room,look:!!u.lookAtP,lean:+(u.leanS||0).toFixed(3),str:!!u.stroller,sp:+(h.spd||0).toFixed(2),hist:(h.hh||[]).slice(-8)});h[rk]=0;}h[vk]=v;}h[k]=w;});
            if(!u.isChild&&u.state!=='enter'){const fl=B(g,'L_Foot'),fr=B(g,'R_Foot');if(fl&&fr){const y=Math.min(wp(fl).y,wp(fr).y)-floorY(p.x,p.z);if(y>.16||y<-.06)push('feet',{t:+T_.toFixed(2),who:lbl(g),kind:u.kind,mdl:(g.children.find(c=>c.name)||{}).name,k:+(u.k||1).toFixed(2),y:+y.toFixed(3),py:+p.y.toFixed(3),fy:+floorY(p.x,p.z).toFixed(3),at:[+p.x.toFixed(2),+p.z.toFixed(2)],hd:+S.hd.toFixed(2)});}}
            if(!u.cashier&&u.state!=='enter'&&u.follow==null){const ob=OBS.filter(r=>!r[4]&&p.x>r[0]+.06&&p.x<r[1]-.06&&p.z>r[2]+.06&&p.z<r[3]-.06);if(ob.length)push('inFixture',{t:+T_.toFixed(2),who:lbl(g),at:[+p.x.toFixed(2),+p.z.toFixed(2)]});}}
          {if(u.turning)h.tn=T_;const free=u.state==='walk'&&!u.pay&&!u.turning&&!u.yielding&&u.follow==null&&!(h.tn>T_-2);const rb=free?(h.rb||(h.rb=[])):(h.rb=[]);rb.push([T_,p.x,p.z]);while(rb.length&&T_-rb[0][0]>2)rb.shift();if(free&&T_-rb[0][0]>=1.95&&Math.hypot(p.x-rb[0][1],p.z-rb[0][2])<.05){if(!h.stk){h.stk=1;push('stuck2s',{t:+T_.toFixed(2),who:lbl(g),at:[+p.x.toFixed(2),+p.z.toFixed(2)],vNow:+(u.vNow||0).toFixed(2),wait:+(u.waitAcc||0).toFixed(1),sq:!!u.squeeze,stT:u.stuckT||0,nud:u.nudged||0,pi:u.pi,np:u.path&&u.path.length,toEnd:u.path?+Math.hypot(u.path[u.path.length-1][0]-p.x,u.path[u.path.length-1][1]-p.z).toFixed(2):null,next:u.path&&u.path[u.pi]?[+u.path[u.pi][0].toFixed(2),+u.path[u.pi][1].toFixed(2)]:null,leg:u.visit&&u.visit[u.legI]&&u.visit[u.legI].kind,blend:+(u.blend||0).toFixed(2),blkT:+(u.blkT||0).toFixed(1),blkRe:!!u.blkRe,path:u.path&&u.path.map(q=>q.map(v=>+v.toFixed(2))),ang:+(u.ang||0).toFixed(2),fv:[+(u.fvx||0).toFixed(2),+(u.fvz||0).toFixed(2)],vx:[+(u.vx||0).toFixed(2),+(u.vz||0).toFixed(2)],sp:+(u.sp||0).toFixed(2),obs:window.__obsAt?__obsAt(p.x,p.z).length:null});}}else if(!free||Math.hypot(p.x-rb[0][1],p.z-rb[0][2])>.2)h.stk=0;}
          h.p.copy(p);h.ry=g.rotation.y;});
        for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const a=all[i],b=all[j];if(a.userData.follow!=null||b.userData.follow!=null)continue;const d=Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z),ra=(a.userData.isChild?.13:.19),rb=(b.userData.isChild?.13:.19);if(d<(ra+rb)*.8)push('overlap',{t:+T_.toFixed(2),a:lbl(a),b:lbl(b),d:+d.toFixed(2),at:[+a.position.x.toFixed(2),+a.position.z.toFixed(2)],door:nav.entry&&+Math.hypot(a.position.x-nav.entry[0],a.position.z-nav.entry[1]).toFixed(2)});}
        // loitering by the till: anyone but the one being served, standing within 2.5 m of the till for more than 5 s
        if(S.tl)all.forEach(g=>{const u=g.userData;if(u.cashier||u.pay||u.follow!=null)return;const h=seen.get(g);if(!h)return;const near=Math.hypot(g.position.x-S.tl.E,g.position.z-(S.tl.H[2]+.24))<2.5,still=(h.spd||0)<.05;h.lo=near&&still?(h.lo||0)+dt:0;
          if(h.lo>5&&h.lo<=5+dt*1.5){const k=u.slot,ah=k>0?qOcc[k-1]:null;push('loiter',{t:+T_.toFixed(2),who:lbl(g),at:[+g.position.x.toFixed(2),+g.position.z.toFixed(2)],leg:u.visit&&u.visit[u.legI]&&u.visit[u.legI].kind,slot:k,q:qOcc.map(o=>o?(o===g?'ME':lbl(o).split(' ').slice(0,2).join(' ')+(o.visible?'':' HIDDEN')):'-'),ahead:ah?{st:ah.userData.state,vis:ah.visible,pay:!!ah.userData.pay,d:+Math.hypot(ah.position.x-g.position.x,ah.position.z-g.position.z).toFixed(2)}:null,qpos:nav.queue.map(q=>q.map(v=>+v.toFixed(2)))});}});
        // pinched: someone walking (walk clip) with two or more bodies within 0.6 m and hardly moving, for more than a second
        all.forEach(g=>{const u=g.userData;if(u.follow!=null||u.cashier)return;const h=seen.get(g);if(!h)return;const nb=all.filter(o=>o!==g&&o.userData.follow==null&&o.userData.follow!==people.indexOf(g)&&u.follow!==people.indexOf(o)&&Math.hypot(o.position.x-g.position.x,o.position.z-g.position.z)<.6);
          const pin=nb.length>=2&&/walk/.test(u.clip||'')&&h.spd<.12&&!u.pay;h.pin=pin?(h.pin||0)+dt:0;if(h.pin>1&&h.pin<=1+dt*1.5)push('pinch',{t:+T_.toFixed(2),who:lbl(g),at:[+g.position.x.toFixed(2),+g.position.z.toFixed(2)],nb:nb.map(o=>lbl(o)+' d'+Math.hypot(o.position.x-g.position.x,o.position.z-g.position.z).toFixed(2)),leg:u.visit&&u.visit[u.legI]&&u.visit[u.legI].kind,yl:!!u.yielding,sq:!!u.squeeze,wait:+(u.waitAcc||0).toFixed(1)});});
        {const cu=people.find(x=>x.userData.pay);const pl=cu&&cu.userData.pay;if(pl&&pl.dock.s===5&&!(pl.bt.s===5)){const busy=pl.E.some(x=>x.s>=1&&x.s<=4);if(busy)tI.t=0;else{tI.t+=dt;if(tI.t>1.2&&!tI.flag){tI.flag=1;push('tillIdle',{t:+T_.toFixed(2),waiting:pl.E.filter(x=>x.s===0).slice(0,3).map(x=>x.k+(x.j!=null?x.j:'')+' a='+x.a.toFixed(2)+' deps='+x.dep.map(([d,l])=>(d.k||'?')+(d.j!=null?d.j:'')+':'+d.s+'/'+l).join('|')).join(' ; ')});}}if(busy)tI.flag=0;}else{tI.t=0;tI.flag=0;}}
        // props: everything a person or the till holds
        const P=[];(S.counterItems||[]).forEach((m,i)=>P.push(['item'+i,m]));[['bag',S.counterBag],['basket',S.counterBasket],['note',S.tillNote]].forEach(x=>x[1]&&P.push(x));
        all.forEach(g=>{const u=g.userData;if(u.culledFar)return;[['itemM',u.itemM],['phone',u.phoneM],['basketH',u.basket],['bagH',u.bag],['card',u.cardM]].forEach(([k,o])=>{if(o)P.push([k+'@'+lbl(g).split(' ')[0],o,g]);});});
        P.forEach(([k,o,own])=>{const v=o.visible&&o.parent&&(o.parent.visible!==false);const w=wp(o);if(own){w.x-=own.position.x;w.z-=own.position.z;}const q=props.get(o);if(q&&q.v&&v){const j=w.distanceTo(q.w)/dt;if(j>3.5){const td=(S.tillD||[]).find(d=>d.o===o),cu=people.find(x=>x.userData.pay),pl=cu&&cu.userData.pay;push('propJump',{t:+T_.toFixed(2),k,v:+j.toFixed(1),m:td?td.m:null,who:td&&td.who?(td.who.userData.cashier?'cashier':'customer'):null,e:pl?+(T_-pl.t0).toFixed(2):null,ev:pl?pl.E.filter(x=>x.s>=1&&x.s<=4).map(x=>x.k+(x.j!=null?x.j:'')+':'+x.s+':'+x.a.toFixed(2)).join(','):null,own:own?lbl(own)+' tn'+(+!!own.userData.turning)+' rch'+(own.userData.rch?own.userData.rch.p.toFixed(2)+'/'+own.userData.rch.sd:'-')+' bL'+(+!!own.userData.basketL)+' fr'+(+!!own.userData.culledFar):null});}}props.set(o,{w,v});});}
      window.__frz=was;renderer.render(scene,camera);
      const ts_=window.__tillStats||{};R.graspNoContact=(ts_.grasp||0)-(t0s.grasp||0)+(ts_.place||0)-(t0s.place||0);R.reachBoost=(ts_.boost||0)-(t0s.boost||0);
      const sum={};Object.keys(R).forEach(k=>sum[k]=Array.isArray(R[k])?R[k].length:R[k]);return {sum,R};};

    // debug: with the loop frozen, advance the people n fixed steps (a slow machine can still record every moment of a scene)
    window.__step=(n,dt)=>{dt=dt||1/30;if(window.__simT==null)window.__simT=performance.now()/1000;for(let i=0;i<n;i++){window.__simT+=dt;stepPeople(dt,window.__simT,true);extras.forEach(e=>{if(e.visible)poseAny(e,window.__simT,dt,e.userData.walkV||0);});if(GL()){window.KL_GLTF.update(dt);gltfHeads(dt);vzProps(dt);}tillPlace();}renderer.render(scene,camera);return window.__simT;};
    window.__tillD=()=>S.tillD&&S.tillD.map(d=>({m:d.m,v:d.o.visible,p:d.o.position.toArray().map(x=>+x.toFixed(3)),palm:d.who?palmOf(d.who,d.side):null,fk:d.fk,tk:d.tk,from:d.from,to:d.to,plan:d.plan}));window.__till=()=>({cashier:S.cashier,q0:nav&&nav.queue&&nav.queue[0],basket:S.counterBasket&&S.counterBasket.position.toArray(),beep:S.beep&&S.beep.position.toArray(),a:S.counterItems&&S.counterItems.map(m=>m.userData.a),b:S.counterItems&&S.counterItems.map(m=>m.userData.b),arms:extras.concat(people).filter(g=>g.userData.gltfP).slice(0,3).map(g=>{const B=n=>g.getObjectByName('Bip01_'+n)||g.getObjectByName('Bip02_'+n);const s0=new T.Vector3(),e0=new T.Vector3(),w0=new T.Vector3();const u=B('R_UpperArm'),f=B('R_Forearm'),h=B('R_Hand');if(!u||!f||!h)return null;u.getWorldPosition(s0);f.getWorldPosition(e0);h.getWorldPosition(w0);return {l1:+s0.distanceTo(e0).toFixed(3),l2:+e0.distanceTo(w0).toFixed(3),sh:+s0.y.toFixed(2),cashier:!!g.userData.cashier,h:+(g.userData.k||1).toFixed(2)};})})
    window.__zf=()=>{const F=[],add=(id,a,s,p,r,src)=>F.push({id,a,s,p,r,src});
      ZB.forEach(b=>{for(let a=0;a<3;a++){const o=[0,1,2].filter(k=>k!==a),r=[b.mn[o[0]],b.mx[o[0]],b.mn[o[1]],b.mx[o[1]]];add(b.id,a,-1,b.mn[a],r,b.s);add(b.id,a,1,b.mx[a],r,b.s);}});
      room.updateMatrixWorld(true);const inv=new T.Matrix4().copy(room.matrixWorld).invert();
      room.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||!o.visible)return;const g=o.geometry,t=g.type;if((t!=='BoxGeometry'&&t!=='PlaneGeometry')||!g.parameters)return;
        const m=new T.Matrix4().multiplyMatrices(inv,o.matrixWorld),bb=new T.Box3().setFromBufferAttribute(g.attributes.position).applyMatrix4(m),mn=bb.min.toArray(),mx=bb.max.toArray();
        const ok=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)].every(v=>{v.transformDirection(m);return Math.max(Math.abs(v.x),Math.abs(v.y),Math.abs(v.z))>.9999;});if(!ok)return;
        const tag='mesh '+t+' '+(o.material.type||'')+' '+(o.material.name||'')+' @'+mn.map(v=>v.toFixed(2)).join(',');
        if(t==='PlaneGeometry'){const n=new T.Vector3(0,0,1).transformDirection(m),aa=[Math.abs(n.x),Math.abs(n.y),Math.abs(n.z)],ax=aa.indexOf(Math.max(...aa)),o2=[0,1,2].filter(k=>k!==ax);
          add('P'+o.material.uuid,ax,Math.sign(n.getComponent(ax)),(mn[ax]+mx[ax])/2,[mn[o2[0]],mx[o2[0]],mn[o2[1]],mx[o2[1]]],tag);if(o.material.side===T.DoubleSide)add('P'+o.material.uuid,ax,-Math.sign(n.getComponent(ax)),(mn[ax]+mx[ax])/2,[mn[o2[0]],mx[o2[0]],mn[o2[1]],mx[o2[1]]],tag);}
        else for(let a=0;a<3;a++){const o2=[0,1,2].filter(k=>k!==a),r=[mn[o2[0]],mx[o2[0]],mn[o2[1]],mx[o2[1]]];add('B'+o.material.uuid,a,-1,mn[a],r,tag);add('B'+o.material.uuid,a,1,mx[a],r,tag);}});
      const Bk={};F.forEach((f,i)=>{const k=f.a+'|'+f.s+'|'+Math.round(f.p*500);(Bk[k]=Bk[k]||[]).push(i);});
      const out=[],seen=new Set();
      Object.keys(Bk).forEach(k=>{const [a,s,q]=k.split('|');for(const dq of [0,1]){const L2=Bk[a+'|'+s+'|'+(+q+dq)];if(!L2)continue;for(const i of Bk[k])for(const j of L2){if(dq===0&&j<=i)continue;const f=F[i],g=F[j];
        if(f.id===g.id||Math.abs(f.p-g.p)>.0012)continue;if(+a===1&&+s===-1&&f.p<.01)continue;
        const ox=Math.min(f.r[1],g.r[1])-Math.max(f.r[0],g.r[0]),oy=Math.min(f.r[3],g.r[3])-Math.max(f.r[2],g.r[2]);if(ox<=.004||oy<=.004)continue;
        const key=[f.src,g.src].sort().join(' || ')+a+s;if(seen.has(key))continue;seen.add(key);out.push({area:+(ox*oy).toFixed(4),ax:'xyz'[a]+(+s>0?'+':'-'),p:+f.p.toFixed(3),A:f.id.slice(0,14),B:g.id.slice(0,14),sa:f.src,sb:g.src});}}});
      return out.sort((x,y)=>y.area-x.area);};

    window.__scan=()=>{const o=[];room.traverse(m=>{if(m.isMesh){const g=m.geometry;o.push([m.isInstancedMesh?'I'+m.count:(m.isSkinnedMesh?'S':'M'),Math.round((g.index?g.index.count:g.attributes.position.count)/3*(m.isInstancedMesh?m.count:1)),m.material.type+(m.material.map?'+map':'')+(m.material.vertexColors?'+vc':'')]);}});return o.sort((a,b)=>b[1]-a[1]).slice(0,22);};
    window.__triList=i=>{const out=[];(people.concat(extras))[i||0].traverse(o=>{if(o.isMesh){const g=o.geometry;out.push([g.type,Math.round((g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1)),o.parent.type]);}});return out.sort((a,b)=>b[1]-a[1]);};
    window.__triPeople=()=>{let n=0;people.concat(extras).forEach(p=>p.traverse(o=>{if(o.isMesh){const g=o.geometry;n+=(g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}}));return n;};
    window.__place=(i,x,z,ry,st)=>{const p=people[i];if(!p)return;p.position.set(x,0,z);p.rotation.y=ry;p.visible=true;if(st){p.userData.state=st;p.userData.blend=st==='walk'?1:0;}posePerson(p,performance.now()/1000,.016,st==='walk'?.5:0);if(p.userData.stroller)p.userData.stroller.visible=false;};
    window.__dbg=()=>{const p=people[0];if(!p)return {people:people.length};const out={people:people.length,pos:[p.position.x,p.position.y,p.position.z],children:[]};p.traverse(o=>{if(o.isMesh){const b=new T.Box3().setFromObject(o);out.children.push([o.geometry.type,o.material.color?'#'+o.material.color.getHexString():'-',+(b.max.y-b.min.y).toFixed(2),+(b.min.y).toFixed(2),+(b.max.y).toFixed(2)]);}});return out;};
    let flown=false;
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;root.classList.toggle('klive',vis);if(vis&&!flown){flown=true;if(view.name==='tour'){tour.k=-1;tour.t=0;tour.first=true;}}kick();},{threshold:.15}).observe(stage);else vis=true;
    document.addEventListener('visibilitychange',kick);
    three={build};
    resize();build();paintCard();kick();
  }

  // start 3D when the set comes near the viewport
  let started=false;
  const boot=()=>{if(started)return;started=true;window.__perf={boot:performance.now()};init3D();};
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){boot();io.disconnect();}},{rootMargin:'600px'});io.observe(stage);}else boot();
  // …and in any case quietly right after the page has loaded, so scrolling down never meets an empty set
  addEventListener('load',()=>setTimeout(()=>{if(window.requestIdleCallback)requestIdleCallback(boot,{timeout:2500});else boot();},400));
  if(location.hash==='#prostranstvo')boot();
  paintCard();paintClock();
  return {show};
})();

paintMode();modeSubs.forEach(f=>f());
})();

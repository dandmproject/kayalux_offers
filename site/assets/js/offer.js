
(function(){
'use strict';
const root=document.documentElement;
root.classList.add('js');
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const NB=' ';
const fmt=v=>{const [i,d]=Math.abs(v).toFixed(2).split('.');return (v<0?'−':'')+i.replace(/\B(?=(\d{3})+(?!\d))/g,NB)+','+d;};
const eur=v=>fmt(v)+NB+'€';
const num=s=>parseFloat(String(s).replace(/\s/g,'').replace(',','.'));
const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(Math.round(m%60)).padStart(2,'0');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const store={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
const cssVar=n=>getComputedStyle(root).getPropertyValue(n).trim();

/* ---------- data ---------- */
const ROWS=[{n:1,nm:"Хайдушка поляна",a:"ж.к. Лагера, ул. Баба Илийца 37А",ar:"36,22",s:"16,25",f:"19,25",c:"София"},{n:2,nm:"Несторов",a:"ул. Ами Буе 55",ar:"96,10",s:"25,25",f:"30,25",c:"София"},{n:3,nm:"НДК",a:"ул. Фритьоф Нансен 37А",ar:"164,00",s:"35,25",f:"42,25",c:"София"},{n:4,nm:"Борово",a:"ул. Тодор Каблешков 39",ar:"90,00",s:"24,25",f:"29,25",c:"София"},{n:5,nm:"Мотописта",a:"ул. Луи Айер, бл. 260А",ar:"86,00",s:"23,75",f:"28,75",c:"София"},{n:6,nm:"Баучер",a:"ул. Света гора 42",ar:"30,27",s:"15,25",f:"18,25",c:"София"},{n:7,nm:"Цариградско шосе",a:"бул. Цариградско шосе 60",ar:"197,17",s:"40,25",f:"47,25",c:"София"},{n:8,nm:"Красна поляна",a:"ул. Алеко Туранджа 49",ar:"99,04",s:"25,75",f:"30,75",c:"София"},{n:9,nm:"Хаджи Димитър",a:"ул. Скайлер 60",ar:"104,47",s:"26,25",f:"31,25",c:"София"},{n:10,nm:"Кирков",a:"ул. Братя Миладинови 29",ar:"60,76",s:"19,75",f:"22,75",c:"София"},{n:11,nm:"Павлово",a:"ул. Вихрен / Ген. Суворов",ar:"88,70",s:"24,25",f:"29,25",c:"София"},{n:12,nm:"Люлин",a:"ул. Луи Пастьор 9",ar:"80,00",s:"22,75",f:"27,75",c:"София"},{n:13,nm:"Варна, Бенковски",a:"ул. Г. Бенковски 53, Варна",ar:"120,00",s:"28,75",f:"31,75",c:"Варна"},{n:14,nm:"Варна, Дубровник",a:"ул. Дубровник 54, Варна",ar:"192,30",s:"39,75",f:"44,75",c:"Варна"},{n:15,nm:"Бели брези",a:"ул. Нишава 58",ar:"135,60",s:"31,25",f:"36,25",c:"София"},{n:16,nm:"Пирогов",a:"ул. Виктор Григорович 1",ar:"140,38",s:"31,75",f:"36,75",c:"София"},{n:17,nm:"Бургас, В. Търново",a:"ул. Велико Търново 12, Бургас",ar:"99,00",s:"25,75",f:"30,75",c:"Бургас"},{n:18,nm:"Бургас, Гладстон",a:"ул. Уилям Гладстон 94, Бургас",ar:"93,48",s:"24,75",f:"29,75",c:"Бургас"},{n:19,nm:"Галакси",a:"бул. Шипченски проход 18",ar:"211,53",s:"42,25",f:"49,25",c:"София"},{n:20,nm:"Люлин 2",a:"ул. ген. Асен Николов 19",ar:"162,49",s:"35,25",f:"42,25",c:"София"},{n:21,nm:"Опълченска",a:"ул. Опълченска 117-123",ar:"140,00",s:"31,75",f:"36,75",c:"София"},{n:22,nm:"Красно село",a:"ул. Дебър 3",ar:"104,00",s:"26,25",f:"31,25",c:"София"},{n:23,nm:"Монтевидео",a:"бул. Президент Линкълн / Монтевидео",ar:"105,00",s:"26,75",f:"31,75",c:"София"},{n:24,nm:"Иван Вазов",a:"ул. Стефан Сарафов, бл. 1, маг. 4",ar:"72,91",s:"21,75",f:"24,75",c:"София"},{n:25,nm:"Стрелбище",a:"ул. Нишава 167-171",ar:"346,99",s:"62,75",f:"69,75",c:"София"},{n:26,nm:"Лозенец",a:"бул. Христо Смирненски 46",ar:"82,41",s:"23,25",f:"28,25",c:"София"},{n:27,nm:"Стамболийски",a:"бул. Ал. Стамболийски 81",ar:"100,00",s:"25,75",f:"30,75",c:"София"},{n:28,nm:"Костенски водопад",a:"ул. Костенски водопад 41-47",ar:"144,39",s:"32,25",f:"37,25",c:"София"},{n:29,nm:"Димитър Петков",a:"бул. Тодор Александров 132",ar:"95,00",s:"24,75",f:"29,75",c:"София"},{n:30,nm:"Дойран",a:"ул. Ген. Стефан Тошев 1",ar:"210,60",s:"42,25",f:"49,25",c:"София"},{n:31,nm:"Горубляне",a:"ул. Самоковско шосе 57",ar:"150,00",s:"33,25",f:"38,25",c:"София"},{n:32,nm:"Надежда II",a:"ул. Република / Добри Чинтолов",ar:"24,00",s:"14,25",f:"17,25",c:"София"},{n:33,nm:"Обеля",a:"ж.к. Обеля 2, ул. 104/106",ar:"154,00",s:"33,75",f:"40,75",c:"София"},{n:34,nm:"Мусагеница",a:"ж.к. Мусагеница, бл. 110",ar:"117,00",s:"28,25",f:"33,25",c:"София"},{n:35,nm:"М. Ливади",a:"ж.к. М. Ливади, ул. Пирин 81",ar:"145,42",s:"32,75",f:"37,75",c:"София"},{n:36,nm:"Иван Асен II",a:"ул. Иван Асен II 25",ar:"96,00",s:"25,25",f:"30,25",c:"София"},{n:37,nm:"Славянска",a:"ул. Славянска 22",ar:"80,00",s:"22,75",f:"27,75",c:"София"},{n:38,nm:"Младост",a:"ж.к. Младост 3, бл. 301",ar:"127,00",s:"29,75",f:"34,75",c:"София"},{n:39,nm:"Оборище",a:"ул. Оборище 72",ar:"94,32",s:"24,75",f:"29,75",c:"София"},{n:40,nm:"Васил Левски",a:"бул. Васил Левски 60",ar:"75,00",s:"21,75",f:"24,75",c:"София"},{n:41,nm:"Велико Търново",a:"ул. Мармалийска 10, В. Търново",ar:"179,00",s:"37,75",f:"42,75",c:"Велико Търново"},{n:42,nm:"Златен рог",a:"ул. Златен рог 22",ar:"165,76",s:"35,75",f:"42,75",c:"София"},{n:43,nm:"Дианабад",a:"ж.к. Дианабад, бл. 53, маг. 3",ar:"232,48",s:"45,75",f:"52,75",c:"София"},{n:44,nm:"Слатина",a:"ул. Слатинска 92А",ar:"176,00",s:"37,25",f:"44,25",c:"София"},{n:45,nm:"Варна 3",a:"ул. Брегалница 32, Варна",ar:"159,50",s:"34,75",f:"41,75",c:"Варна"},{n:46,nm:"Търново 2",a:"ул. Вихрен 2, магазин 1, В. Търново",ar:"185,24",s:"38,75",f:"45,75",c:"Велико Търново"},{n:47,nm:"Бургас 3",a:"ж.к. Зорница, бл. 75, вх. 3, Бургас",ar:"198,78",s:"40,75",f:"47,75",c:"Бургас"},{n:48,nm:"Дондуков",a:"бул. Княз Александър Дондуков 32",ar:"152,00",s:"33,75",f:"40,75",c:"София"}].map(r=>({n:r.n,name:r.nm,addr:r.a,area:num(r.ar),std:num(r.s),full:num(r.f),city:r.c}));
const TOT={std:1447,full:1701};
const MODES={std:{name:'Стандартен режим'},full:{name:'Пълно работно време'}};
const stdFormula=a=>Math.round((10+0.15*a)*2)/2+0.75;

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
(function(){const until=new Date(2026,9,13,23,59,59),el=$('#validLeft');const d=Math.ceil((until-Date.now())/864e5);
  if(d>=1){el.textContent=d===1?'остава 1 ден':'остават '+d+' дни';}else{el.textContent='валидността изтече на 13.10.2026 г.';el.classList.add('gone');}})();

/* ---------- nav: scrolled, progress, current chapter ---------- */
const nav=$('#nav'),prog=$('.progress',nav);
function onScroll(){const y=scrollY;nav.classList.toggle('scrolled',y>8);const h=root.scrollHeight-innerHeight;prog.style.setProperty('--p',h>0?Math.min(1,y/h):0);}
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
  const nm=$('#navMono');if(nm)nm.src=tint(cssVar('--gold-soft')||'#B9975B',[300,62,186,248]).toDataURL('image/png');
  const nw=$('#navWord');if(nw)nw.src=tint(cssVar('--ink')||'#EFE8DC',[70,312,640,132]).toDataURL('image/png');
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
  function size(){const d=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=Math.round(W*d);cv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);}
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
    P=P.filter(p=>p.life<p.max&&p.y>-400);if(P.length>320)P.splice(0,P.length-320);
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
  let heroVis=true;function loop(t){raf=0;if(document.hidden||!heroVis||window.__klBusy)return;const dt=Math.min(.05,(t-(last||t))/1000);last=t;draw(step(dt));raf=requestAnimationFrame(loop);}
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

/* ---------- cinematic reveal + chapter watermarks + counters ---------- */
(function(){
  $$('.head').forEach(h=>{const b=$('.no b',h);if(b)h.setAttribute('data-no',b.textContent);});
  if(reduce||!('IntersectionObserver' in window))return;
  const sel='.head,.parties,.letter-grid > *,.timeline li,.accord,.why3 > div,.seasons > *,.sched-top,.chartbox,.hours3,.cols2 > *,.live,.set,.clock,.flat,.map-grid > *,.formula,.modes > *,.regional,.summary,.controls,.tablebox,.incl section,.energy > *,.status-strip,.decide > *,.deadlines li,.paper';
  const els=$$(sel).filter(e=>!e.closest('.hero'));
  const vh=innerHeight;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const sib=[...el.parentNode.children].filter(x=>x.classList.contains('rv'));const i=Math.max(0,sib.indexOf(el));el.style.transitionDelay=(Math.min(i,5)*.09)+'s';el.classList.remove('pre');io.unobserve(el);}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{el.classList.add('rv');if(el.getBoundingClientRect().top>vh*.95){el.classList.add('pre');io.observe(el);}});
  // counters in the letter figures
  const figs=$$('.fig b');
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,m=el.textContent.match(/^(\D*)(\d+)(.*)$/s);if(!m)return;const end=+m[2],t0=performance.now();
    (function tick(t){const k=Math.min(1,(t-t0)/1500),v=Math.round(end*(1-Math.pow(1-k,3)));el.textContent=m[1]+v+m[3];if(k<1)requestAnimationFrame(tick);})(t0);}),{threshold:.6});
  figs.forEach(f=>{if(/^\d/.test(f.textContent)&&f.getBoundingClientRect().top>vh)cio.observe(f);});
})();

/* ---------- II: season ring ---------- */
(function(){
  const svg=$('#ring'),NS='http://www.w3.org/2000/svg',txt=$('#seasonText');
  const S=[
    {k:'Есен',c1:'Tobacco Vanille',c2:'ЕСЕН · СЕГА',t:'Tobacco Vanille е топъл аромат и е подходящ за есенно-зимния сезон. Затова той е първият сезонен аромат на веригата. Ако някой аромат стане любим на клиентите и екипите, той може да се връща всяка година в същия сезон и да стане разпознаваем символ на АВАНТИ.'},
    {k:'Зима',c1:'Toffee',c2:'ЗИМА · ОТ ДЕКЕМВРИ',t:'За тримесечието от декември 2026 г. служителите избраха Toffee: мляко, карамел и коледно настроение. Топъл гурме аромат, който подхожда на празничния сезон. Ще бъде зареден едновременно във всички 48 обекта в началото на декември.'},
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
const weekHours=n=>{const h=hoursFor(n);return ((h.wd.full[1]-h.wd.full[0])*6+(h.sun.full[1]-h.sun.full[0]))/60;};
/* ---------- III: weekly schedule chart ---------- */
(function(){
  const svg=$('#chart'),tip=$('#tip'),box=$('#chartbox'),NS='http://www.w3.org/2000/svg';
  const DAYS=['Понеделник','Вторник','Сряда','Четвъртък','Петък','Събота','Неделя'],SH=['Пон','Вт','Ср','Чет','Пет','Съб','Нед'];
  const X0=78,X1=688,H0=6*60,H1=23*60,x=m=>X0+(m-H0)/(H1-H0)*(X1-X0),top=44,rh=38;
  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  let cur=7;const selS=$('#schedStore');
  ['София','Варна','Бургас','Велико Търново'].forEach(c=>{const og=document.createElement('optgroup');const L=ROWS.filter(r=>r.city===c);og.label=c+' ('+L.length+')';L.forEach(r=>{const o=document.createElement('option');o.value=r.n;const wk=weekHours(r.n);o.textContent='№ '+r.n+' · '+r.name+' · '+(wk%1?wk.toFixed(1).replace('.',','):wk)+' ч/седм.';og.appendChild(o);});selS.appendChild(og);});
  selS.value=cur;
  function draw(){
    [...svg.childNodes].forEach(n=>{if(n.nodeName!=='title')svg.removeChild(n);});
    const defs=el('defs',{}),pat=el('pattern',{id:'hatch',width:'5',height:'5',patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'});
    pat.appendChild(el('rect',{width:'5',height:'5',fill:'transparent'}));pat.appendChild(el('line',{x1:'0',y1:'0',x2:'0',y2:'5',stroke:'var(--ink-faint)','stroke-width':'1.3','stroke-opacity':'.55'}));
    defs.appendChild(pat);svg.appendChild(defs);
    const narrow=box.clientWidth<600;for(let h=6;h<=23;h++){const xx=x(h*60);if((narrow?(h%3===0):(h%2===0))||h===23){svg.appendChild(el('line',{x1:xx,x2:xx,y1:top-8,y2:top+rh*7,class:'grid'}));const t=el('text',{x:xx,y:top-16,'text-anchor':'middle',class:'ax'});t.textContent=String(h).padStart(2,'0')+':00';svg.appendChild(t);}}
    let total=0;
    for(let d=0;d<7;d++){
      const H=hoursFor(cur)[d===6?'sun':'wd'],y=top+d*rh,[s,e]=H.full,o=H.open,c=H.close,hrs=(e-s)/60;total+=hrs;
      const dl=el('text',{x:X0-14,y:y+rh/2+4,'text-anchor':'end',class:'day'});dl.textContent=SH[d];svg.appendChild(dl);
      svg.appendChild(el('rect',{x:x(480),y:y+7,width:x(1200)-x(480),height:rh-14,class:'band'}));
      svg.appendChild(el('line',{x1:x(o),x2:x(c),y1:y+rh-5,y2:y+rh-5,class:'openl'}));
      svg.appendChild(el('rect',{x:x(s),y:y+12,width:x(e)-x(s),height:rh-24,rx:'4',class:'bar'}));
      const ht=el('text',{x:X1+14,y:y+rh/2+4,class:'hrs'});ht.textContent=(hrs%1?hrs.toFixed(1).replace('.',','):hrs)+' ч';svg.appendChild(ht);
      const hit=el('rect',{x:X0-60,y:y,width:X1-X0+110,height:rh,class:'hit'});
      hit.addEventListener('pointermove',ev=>show(ev,d,s,e,o,c,hrs));hit.addEventListener('pointerleave',()=>tip.hidden=true);
      svg.appendChild(hit);
    }
    const sum=el('text',{x:X1+14,y:top+rh*7+20,class:'hrs'});sum.textContent='= '+(total%1?total.toFixed(1).replace('.',','):total)+' ч';svg.appendChild(sum);
    const r=ROWS.find(r=>r.n===cur),h=hoursFor(cur),pct=Math.round((total/84-1)*100);
    $('#hStore').innerHTML=(total%1?total.toFixed(1).replace('.',','):total)+' ч<sup>'+(pct>=0?'+':'')+pct+'%</sup>';$('#hStoreT').textContent='№ '+r.n+' · '+r.name+': пон.–съб. '+hm(h.wd.full[0])+'–'+hm(h.wd.full[1])+', нед. '+hm(h.sun.full[0])+'–'+hm(h.sun.full[1]);
    const base=el('text',{x:X0,y:top+rh*7+20,class:'ax'});base.textContent='Първоначална калкулация: 12 ч × 7 дни = 84 ч седмично';svg.appendChild(base);
  }
  function show(ev,d,s,e,o,c,hrs){
    const r=box.getBoundingClientRect();
    tip.innerHTML='<b>'+DAYS[d]+'</b><br>Ароматизация: '+hm(s)+'–'+hm(e)+' · '+hrs+' ч<br>Обектът работи: '+hm(o)+'–'+hm(c)+'<br>Първоначална калкулация: 08:00–20:00 · 12 ч';
    tip.hidden=false;tip.style.left=clamp(ev.clientX-r.left+box.scrollLeft,110,box.scrollWidth-110)+'px';tip.style.top=(ev.clientY-r.top)+'px';
  }
  selS.addEventListener('change',()=>{cur=+selS.value;draw();});
  draw();
  // chain-wide figures for the tiles
  {const all=ROWS.map(r=>weekHours(r.n)),n96=all.filter(v=>Math.abs(v-96)<.01).length,mx=Math.max(...all),mn=Math.min(...all),avg=all.reduce((a,b)=>a+b,0)/all.length;
   $('#hChain').innerHTML=avg.toFixed(1).replace('.',',')+' ч<sup>+'+Math.round((avg/84-1)*100)+'%</sup>';$('#hChainT').textContent='средно за 48-те обекта · от '+mn+' до '+mx+' ч · '+n96+' обекта са с 96 ч';}
})();

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

/* ---------- VI: formula calculator ---------- */
(function(){
  const r=$('#areaRange'),oa=$('#calcArea'),os=$('#calcStd'),ow=$('#calcWork');
  function upd(){const a=+r.value,raw=10.75+0.15*a,p=stdFormula(a);oa.textContent=a+' м²';os.textContent=eur(p);ow.textContent='10,75 € + 0,15 € × '+a+' м² = '+eur(raw)+(Math.abs(raw-p)>.001?' → '+eur(p):'');}
  r.addEventListener('input',upd);upd();
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
    tb.innerHTML=shown.map((r,ri)=>{
      const isOpen=open===r.n;
      let h='<tr class="row'+(isOpen?' open':'')+(ri%2?' alt':'')+'" data-n="'+r.n+'" tabindex="0" aria-expanded="'+isOpen+'">'+
        '<td class="m">'+r.n+'</td><td><b style="font-weight:600">'+r.name+'</b></td>'+
        '<td class="m">'+r.addr+'</td><td class="r">'+fmt(r.area)+'</td><td class="r cs">'+fmt(r.std)+'</td><td class="r cf">'+fmt(r.full)+'</td></tr>';
      if(isOpen){
        const raw=10.75+0.15*r.area,d=r.full-r.std;
        h+='<tr class="detail"><td colspan="6"><div class="det num">'+
          '<div><small>Стандартен режим</small>10,75 € + 0,15 € × '+fmt(r.area)+' м² = '+eur(raw)+' → <b>'+eur(r.std)+'</b></div>'+
          '<div><small>Пълно работно време</small><b>'+eur(r.full)+'</b> · +'+eur(d)+' на месец, около '+eur(d/30)+' на ден</div>'+
          '<div><small>Включено</small>транспорт, монтаж, сервиз и ароматно масло за целия месец</div>'+
          '<div><button type="button" class="btn small" data-3d="'+r.n+'">Покажи в 3D</button></div>'+
        '</div></td></tr>';
      }
      return h;
    }).join('')||'<tr><td colspan="6" class="m">Няма обект с това име, адрес или номер. Опитайте с част от името.</td></tr>';
    const n=L.length;
    $('#tLabel').textContent=(!city&&!q.trim()?'Общо на месец, 48 обекта, без ДДС':'Общо на месец, '+n+' '+(n===1?'обект':'обекта')+(city?' · '+city:'')+', без ДДС');
    $('#tStd').textContent=eur(s);$('#tFull').textContent=eur(f);
    if(more){more.hidden=!(limited&&L.length>PREVIEW);more.textContent='Покажи всички '+L.length+' обекта';}
    $$('#objTable thead th').forEach(th=>{const on=th.dataset.k===sk;th.setAttribute('aria-sort',on?(sd>0?'ascending':'descending'):'none');const b=$('button',th);b.querySelectorAll('.arr').forEach(x=>x.remove());if(on&&!(sk==='n'&&sd===1)){const a=document.createElement('span');a.className='arr';a.textContent=sd>0?'↑':'↓';b.appendChild(a);}});
  }
  function toggle(n){open=open===n?0:n;render();}
  tb.addEventListener('click',e=>{const b=e.target.closest('[data-3d]');if(b){e.stopPropagation();space.show(+b.dataset['3d']);return;}const tr=e.target.closest('tr.row');if(tr)toggle(+tr.dataset.n);});
  tb.addEventListener('keydown',e=>{const tr=e.target.closest('tr.row');if(tr&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggle(+tr.dataset.n);const t=tb.querySelector('tr.row[data-n="'+tr.dataset.n+'"]');if(t)t.focus();}});
  $$('#ceni .controls .chip').forEach(b=>b.addEventListener('click',()=>setCity(b.dataset.city)));
  function setCity(c){city=c;open=0;$$('#ceni .controls .chip').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.city===c)));render();}
  $('#q').addEventListener('input',e=>{q=e.target.value;open=0;render();});
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
    return ['До: KAYA LUX („Унищожители“ ЕООД)','Относно: Оферта № 2026-148-А (актуализирана) от 28.09.2026 г.','',
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

/* ---------- PDF: freeze the 3D set to an image, expand everything, print ---------- */
(function(){
  const btn=$('#pdfBtn');if(!btn)return;
  btn.addEventListener('click',()=>{
    // 1. snapshot the 3D stage
    const cv=$('#stage canvas');let snap=$('#stage .snap');
    if(cv){if(!snap){snap=document.createElement('img');snap.className='snap';snap.alt='3D схема на обекта';$('#stage').appendChild(snap);}try{if(window.__renderNow)window.__renderNow();snap.src=cv.toDataURL('image/png');}catch(e){}}
    // 2. show all rows, all sections
    $$('.rv.pre').forEach(e=>e.classList.remove('pre'));const more=$('#more');if(more&&!more.hidden)more.click();
    // 3. print (the artifact viewer blocks it; on the hosted page it opens the Save-as-PDF dialog)
    let done=false;const note=document.createElement('div');note.className='pdf-note';note.textContent='Отваря се прозорецът за печат. Изберете „Запази като PDF“. Ако не се отвори, натиснете Ctrl+P (на Mac ⌘+P).';document.body.appendChild(note);setTimeout(()=>note.remove(),7000);
    setTimeout(()=>{try{window.print();}catch(e){}},250);
  });
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
  function mailLink(d){const t=['До: KAYA LUX („Унищожители“ ЕООД)','Относно: Оферта № 2026-148-А (актуализирана) от 28.09.2026 г.','',
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
  const state={n:7,ceil:3.0,t:660,day:'wd',unit:0,playing:false};
  // store picker
  ['София','Варна','Бургас','Велико Търново'].forEach(c=>{const og=document.createElement('optgroup');const L=ROWS.filter(r=>r.city===c);og.label=c+' ('+L.length+')';
    L.forEach(r=>{const o=document.createElement('option');o.value=r.n;o.textContent='№ '+r.n+' · '+r.name+' · '+fmt(r.area)+' м²';og.appendChild(o);});sel.appendChild(og);});
  sel.value=state.n;
  const row=()=>ROWS.find(r=>r.n===state.n);
  function syncHours(){HRS=hoursFor(state.n);}
  const PLAN=(()=>{const m={};ROWS.forEach(r=>{const a=r.area,c=r.city;let mdl='PG',n;
    if(c==='Варна'||c==='Велико Търново'){mdl='PL';n=1;}
    else if(c==='Бургас'){if(a>150){mdl='PL';n=1;}else n=a<=90?1:2;}
    else if(r.n===25||r.n===43)n=3;else n=a<=90?1:(a<=150?2:3);
    // dark interior (wood/black shelving) -> black unit; light interior -> white unit: seeded per store so it is stable
    const col=((r.n*7919)%10)<8?'b':'w';m[r.n]={mdl,n,col};});return m;})();
  const plan=()=>PLAN[state.n];
  const count=()=>plan().n;
  $('#cntPG').firstChild.nodeValue=Object.values(PLAN).filter(p=>p.mdl==='PG').reduce((s,p)=>s+p.n,0)+' ';
  $('#cntPL').firstChild.nodeValue=Object.values(PLAN).filter(p=>p.mdl==='PL').reduce((s,p)=>s+p.n,0)+' ';
  const H=()=>state.ceil;

  function unitsFor(A){
    const P=plan(),n=P.n,hi=state.ceil>=3.3,pl=P.mdl==='PL',colN=P.col==='w'?'бял корпус':'черен корпус';
    const model=(pl?'Prime Lux':'Plug’n Go')+', '+colN+(hi?'. При висок таван системата е настроена на по-висока интензивност, за да е ароматът еднакво силен навсякъде.':'.');
    const base={model};
    if(pl)return [{...base,title:'Prime Lux',zone:'Търговска зала',why:'Една по-мощна система с голямо покритие вместо няколко по-малки. Поставена високо на стената, тя разпределя аромата равномерно в цялото помещение, а в залата има по-малко оборудване.',at:'L',f:-.05}];
    if(n===1)return [{...base,title:'Plug’n Go при входа',zone:'Над входната врата',why:'В обект до 90 м² една система над входа е достатъчна: ароматът посреща клиента още при влизането и стига до цялата зала.',at:'D',f:0}];
    if(n===2)return [
      {...base,title:'Plug’n Go при входа',zone:'Над входната врата',why:'Входът и касата са зоните с най-голям поток клиенти. Ароматът ги посреща още при влизането.',at:'D',f:0},
      {...base,title:'Plug’n Go във вътрешната част',zone:'Вътрешна част на обекта',why:'Покрива далечната половина на залата, включително хладилните витрини, за да е ароматът еднакво силен навсякъде.',at:'B',f:-.12}];
    return [
      {...base,title:'Plug’n Go при входа',zone:'Над входната врата',why:'Входът и касата са зоните с най-голям поток клиенти. Ароматът ги посреща още при влизането.',at:'D',f:0},
      {...base,title:'Plug’n Go в залата',zone:'Странична стена, средата на залата',why:'При голяма площ ароматът се подава от няколко точки, за да е еднакво силен в цялата зала.',at:'L',f:-.18},
      {...base,title:'Plug’n Go в задната част',zone:'Задна част, към склада',why:'Покрива задната част на залата и зоната към склада, до които ароматът от входа не стига със същата сила.',at:'P',f:0}];
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
    hud.innerHTML='<b>№ '+r.n+' · '+r.name+'</b><span class="num">'+(S.shape==='L'?'Г-образен план · ':S.shape==='sq'?'квадратен план · ':'правоъгълен план · ')+fmt(r.area)+' м² · таван '+state.ceil.toFixed(1).replace('.',',')+' м · обем ≈ '+Math.round(r.area*H())+' м³ · '+n+' '+(n===1?'система':'системи')+'</span><em class="tag">'+(mdl==='PL'?'Prime Lux':'Plug\u2019n Go')+' · '+(col==='w'?'бял корпус':'черен корпус')+' · план: типичен</em>';
    $$('.pin',ovl).forEach((p,j)=>p.classList.toggle('on',j===i));
  }
  $('#sysList').addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(b)pick(+b.dataset.u);});
  function pick(i){state.unit=i;paintCard();}

  // clock
  const range=$('#clockRange'),tEl=$('#clockTime'),st=$('#clockStatus'),lane=$('#lane'),playB=$('#play');
  const PLAY='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',PAUSE='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>';
  const winOf=()=>HRS[state.day][mode];
  function sysOn(t){const w=winOf();return t>=w[0]&&t<w[1];}
  function isOpen(t){const h=HRS[state.day];return t>=h.open&&t<h.close;}
  function paintClock(){
    const t=state.t,h=HRS[state.day],w=winOf(),on=sysOn(t),op=isOpen(t),full=HRS[state.day].full;
    tEl.textContent=hm(t);range.value=t;
    const L=m=>((m-360)/(1380-360)*100).toFixed(2)+'%';
    const o=$('.o',lane),s=$('.s',lane);o.style.left=L(h.open);o.style.width='calc('+L(h.close)+' - '+L(h.open)+')';s.style.left=L(w[0]);s.style.width='calc('+L(w[1])+' - '+L(w[0])+')';
    let cls='',a='',b='';
    if(op&&on){cls='on';a=hm(t)+' · Обектът е отворен и ароматът работи.';b=mode==='full'?'Пълно работно време: от 10 минути преди отварянето до 10 минути преди затварянето.':'Стандартен режим: системата работи до 12 часа на ден.';}
    else if(op&&!on){cls='warn';a=hm(t)+' · Обектът е отворен, но системата е изключена.';
      b=(mode==='std'&&t>=full[0]&&t<full[1])?'В стандартен режим системата работи '+hm(w[0])+'–'+hm(w[1])+'. В режим „Пълно работно време“ клиентите щяха да усещат аромата и сега.':'Системата се изключва 10 минути преди затварянето на обекта ('+hm(h.close)+').';}
    else if(!op&&on){cls='on';a=hm(t)+' · Системата вече работи, обектът отваря в '+hm(h.open)+'.';b='Така ароматът е наличен още при влизането на първите клиенти.';}
    else{a=hm(t)+' · Обектът е затворен, системата е изключена.';b='Работно време на обекта: '+hm(h.open)+'–'+hm(h.close)+(state.day==='sun'?' в неделя.':' от понеделник до събота.')+' (по списъка на веригата)';}
    st.className='status '+cls;st.querySelector('div').innerHTML=a+'<small>'+b+'</small>';
    const sr=430,ss=1150,sm=(e0,e1,x)=>{const k=clamp((x-e0)/(e1-e0),0,1);return k*k*(3-2*k);};
    stage.style.setProperty('--night',(clamp(1-sm(sr-30,sr+40,t)+sm(ss-30,ss+50,t),0,1)*.9).toFixed(2));
    if(playB.dataset.s!==String(state.playing)){playB.dataset.s=String(state.playing);playB.innerHTML=state.playing?PAUSE:PLAY;playB.setAttribute('aria-label',state.playing?'Спри':'Пусни един работен ден');}
  }
  range.addEventListener('input',()=>{state.t=+range.value;state.playing=false;paintClock();});
  $$('#daySeg button').forEach(b=>b.addEventListener('click',()=>{state.day=b.dataset.d;$$('#daySeg button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));paintClock();}));
  playB.addEventListener('click',()=>{state.playing=!state.playing;if(state.playing&&state.t>=1375)state.t=360;paintClock();kick();});
  (function(){const r=$('#ceilRange'),o=$('#ceilOut');let tm=0;r.addEventListener('input',()=>{state.ceil=+r.value;o.textContent=r.value.replace('.',',')+' м';clearTimeout(tm);tm=setTimeout(rebuild,180);});})();
  sel.addEventListener('change',()=>{state.n=+sel.value;state.unit=0;rebuild();});
  modeSubs.push(()=>{paintClock();paintCard();});

  let S={units:[]},three=null,kick=()=>{};
  function rebuild(){syncHours();state.unit=0;if(three)three.build();else{S={units:[]};}paintCard();paintClock();}

  function show(n){state.n=n;sel.value=n;syncHours();state.unit=0;rebuild();$('#prostranstvo').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}

  function fallback(){$('#stageFallback').hidden=false;stage.style.cursor='default';}

  function init3D(){
    const T=window.THREE;if(!T){fallback();return;}
    let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch(e){fallback();return;}
    if(!renderer.getContext()){fallback();return;}
    const small=()=>stage.clientWidth<640;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,(small()||stage.clientWidth*(devicePixelRatio||1)>1800)?1.25:1.5));
    renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
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
    // floor: dark grey 60 cm porcelain tiles (2x2 per 1.2 m), thin grout, a soft sheen from the roughness map
    M.floor=new T.MeshStandardMaterial({roughness:1,metalness:.06,envMapIntensity:.8});
    M.floor.map=tex2(512,512,(g,w,h)=>{g.fillStyle='#232426';g.fillRect(0,0,w,h);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const v=86+Math.random()*9;g.fillStyle='rgb('+v+','+(v+2)+','+(v+4)+')';g.fillRect(i*256+2,j*256+2,252,252);
        g.strokeStyle='rgba(255,255,255,.045)';for(let n=0;n<5;n++){g.lineWidth=1+Math.random()*2;g.beginPath();const x0=i*256+Math.random()*256,y0=j*256+Math.random()*256;g.moveTo(x0,y0);g.bezierCurveTo(x0+Math.random()*120-60,y0+Math.random()*120-60,x0+Math.random()*160-80,y0+Math.random()*160-80,x0+Math.random()*220-110,y0+Math.random()*220-110);g.stroke();}}
      speck(g,w,h,3000,.09);speck(g,w,h,1200,.07,'255,255,255');},true);
    M.floor.roughnessMap=tex2(512,512,(g,w,h)=>{g.fillStyle='#ffffff';g.fillRect(0,0,w,h);g.fillStyle='#6a6a6a';for(let i=0;i<2;i++)for(let j=0;j<2;j++)g.fillRect(i*256+2,j*256+2,252,252);speck(g,w,h,1200,.3,'255,255,255',2);},true);
    M.floor.roughnessMap.encoding=T.LinearEncoding;
    // walls: burgundy with a fine plaster speckle
    M.wall=new T.MeshStandardMaterial({roughness:.92,envMapIntensity:.15,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#7a1f2b';g.fillRect(0,0,w,h);speck(g,w,h,6000,.07,'0,0,0',2);speck(g,w,h,2000,.06,'255,255,255',2);},true)});
    // light oak / beech shelving with a faint grain
    M.oak=new T.MeshStandardMaterial({roughness:.68,envMapIntensity:.35,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#d9b98a';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.fillStyle='rgba(120,80,40,'+(Math.random()*.09).toFixed(3)+')';const x=Math.random()*w;g.fillRect(x,0,1+Math.random()*3,h);}speck(g,w,h,1500,.05,'255,255,255',2);},true)});
    // ceiling: white suspended tiles, 60 cm grid (2x2 per 1.2 m repeat)
    M.ceil=new T.MeshBasicMaterial({map:tex2(256,256,(g,w,h)=>{g.fillStyle='#e4e1da';g.fillRect(0,0,w,h);speck(g,w,h,2500,.06,'0,0,0',2);g.fillStyle='#bdb8ae';g.fillRect(0,0,w,2);g.fillRect(0,128,w,2);g.fillRect(0,0,2,h);g.fillRect(128,0,2,h);},true)});
    M.led=new T.MeshBasicMaterial({color:0xdcd9d2});
    M.ao=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.42,depthWrite:false,map:tex2(64,8,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);})});
    M.blob=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5,depthWrite:false,map:tex2(64,64,(g,w,h)=>{const gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.5,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);})});
    M.grille=new T.MeshStandardMaterial({roughness:.7,map:tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8d90';g.fillRect(0,0,w,h);g.fillStyle='#3a3c3e';for(let i=0;i<8;i++)g.fillRect(4,4+i*7.5,56,3);})});
    M.glass=new T.MeshStandardMaterial({color:0xa9c0d0,transparent:true,opacity:.1,roughness:.08,metalness:.1,depthWrite:false,envMapIntensity:1});
    M.glassC=new T.MeshStandardMaterial({color:0xd6e6f2,transparent:true,opacity:.18,roughness:.04,metalness:.05,depthWrite:false,envMapIntensity:1.4,side:T.DoubleSide});
    M.cool=new T.MeshStandardMaterial({color:0xdfe7ee,emissive:0xcfe2f4,emissiveIntensity:.5,roughness:.4});
    M.unit=new T.MeshStandardMaterial({color:0x17130f,roughness:.3,metalness:.55});M.unitW=new T.MeshStandardMaterial({color:0xf4f1ea,roughness:.42,metalness:.05});
    M.grB=new T.MeshStandardMaterial({color:0x0a0908,roughness:.9});M.grW=new T.MeshStandardMaterial({color:0xdad6cd,roughness:.9});
    M.ledDot=new T.MeshBasicMaterial({vertexColors:true});
    M.badge=new T.MeshBasicMaterial({transparent:true,opacity:.9,depthWrite:false});
    // vertex-coloured props: every small coloured object in the store shares these two materials (one draw call each)
    M.vc=new T.MeshStandardMaterial({vertexColors:true,roughness:.62,envMapIntensity:.35});
    M.vcm=new T.MeshStandardMaterial({vertexColors:true,roughness:.28,metalness:.75,envMapIntensity:1});
    M.vc2=new T.MeshStandardMaterial({vertexColors:true,roughness:.7,side:T.DoubleSide,envMapIntensity:.3});
    M.screen=new T.MeshStandardMaterial({color:0x0b1a2a,emissive:0x9fc7ff,emissiveIntensity:.6,roughness:.2,map:tex2(128,96,(g,w,h)=>{g.fillStyle='#0e2740';g.fillRect(0,0,w,h);g.fillStyle='#1f5a8a';g.fillRect(0,0,w,16);g.fillStyle='#fff';g.font='bold 9px Arial';g.fillText('АВАНТИ · КАСА 1',6,11);g.fillStyle='#d8e8f8';g.font='8px Arial';['Вино 0,75 л         8,99','Чипс 140 г          2,49','Кафе 250 г          6,99','Вода 1,5 л          0,95'].forEach((s,i)=>g.fillText(s,6,30+i*12));g.fillStyle='#ffd27a';g.font='bold 11px Arial';g.fillText('ОБЩО   19,42 лв',6,88);})});
    M.screen.emissiveMap=M.screen.map;M.screen.emissive.set(0xffffff);M.screen.emissiveIntensity=.9;
    M.screen2=new T.MeshStandardMaterial({color:0x111,emissive:0x8fd0a0,emissiveIntensity:.8});M.keys=new T.MeshStandardMaterial({color:0x2a2a2a,roughness:.6,map:tex2(64,64,(g,w,h)=>{g.fillStyle='#2a2a2a';g.fillRect(0,0,w,h);g.fillStyle='#d8d8d8';for(let i=0;i<3;i++)for(let j=0;j<4;j++)g.fillRect(4+i*20,4+j*15,14,10);g.fillStyle='#3c9a3e';g.fillRect(44,49,14,10);g.fillStyle='#c8382e';g.fillRect(4,49,14,10);})});
    const script=(g,w,h,bg,txt,fg,size)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='italic bold '+size+'px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2);};
    M.headCoke=new T.MeshBasicMaterial({map:tex2(256,80,(g,w,h)=>{script(g,w,h,'#d3232a','Coca-Cola','#fff',44);g.fillStyle='#fff';g.fillRect(0,0,w,3);g.fillRect(0,h-3,w,3);})});
    M.headBeer=new T.MeshBasicMaterial({map:tex2(256,80,(g,w,h)=>{g.fillStyle='#f28c28';g.fillRect(0,0,w,h);g.fillStyle='#2a1a10';g.font='bold 30px Inter, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('БИРОТЕРАПИЯ',w/2+16,h/2);g.fillStyle='#fff';g.beginPath();g.arc(30,40,22,0,6.283);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.arc(30,40,14,0,6.283);g.fill();})});
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
    M.rail=new T.MeshStandardMaterial({roughness:.5,map:tex2(1024,64,(g,w,h)=>{g.fillStyle='#f2f1ee';g.fillRect(0,0,w,h);g.fillStyle='#d9d7d2';g.fillRect(0,0,w,5);g.fillRect(0,h-5,w,5);for(let i=0;i<8;i++){const x=i*128+8,promo=i%3===2;g.fillStyle=promo?'#d3232a':'#fbfaf6';g.fillRect(x,10,110,44);g.strokeStyle='#cfcbc3';g.lineWidth=1;g.strokeRect(x,10,110,44);g.fillStyle=promo?'#fff':'#141210';g.font='bold 26px Inter, Arial';g.textAlign='left';g.fillText((1+Math.random()*19).toFixed(2).replace('.',','),x+8,46);g.font='11px Inter, Arial';g.fillText(promo?'ПРОМО':'лв',x+82,46);g.fillStyle=promo?'#fff':'#777';g.font='9px Arial';g.fillText('ПРОДУКТ 0,7 л',x+8,22);}},true)});
    M.mat=new T.MeshStandardMaterial({roughness:1,map:tex2(256,256,(g,w,h)=>{g.fillStyle='#2e2a26';g.fillRect(0,0,w,h);speck(g,w,h,6000,.25,'120,100,70',2);speck(g,w,h,3000,.3,'0,0,0',2);g.strokeStyle='#8a7a5a';g.lineWidth=10;g.strokeRect(14,14,w-28,h-28);g.fillStyle='#c9b58a';g.font='bold 40px Inter, Arial';g.textAlign='center';g.fillText('ДОБРЕ',128,110);g.fillText('ДОШЛИ',128,160);})});
    // labelled products: the instance colour tints the package, a band of the texture (v0..v1) stays as printed
    const lblMat=(tex,v0,v1,rough)=>{const m=new T.MeshStandardMaterial({map:tex,roughness:rough||.5,envMapIntensity:.5});m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#if defined( USE_COLOR )\n diffuseColor.rgb *= mix( vColor, vec3(1.0), step('+v0.toFixed(3)+', vUv.y) * step( vUv.y, '+v1.toFixed(3)+') );\n#endif');};m.customProgramCacheKey=()=>'lbl'+v0+v1;return m;};
    const printLbl=(g,x,y,w,h,col)=>{g.fillStyle='#fbf8f0';g.fillRect(x,y,w,h);g.fillStyle=col;g.fillRect(x,y,w,h*.3);g.fillStyle='#222';for(let i=0;i<3;i++)g.fillRect(x+w*.15,y+h*(.45+i*.16),w*(.7-i*.2),h*.07);g.fillStyle=col;g.beginPath();g.arc(x+w*.5,y+h*.15,h*.11,0,6.283);g.fill();};
    M.bottle=lblMat(tex2(64,128,(g,w,h)=>{g.fillStyle='#9a9a9a';g.fillRect(0,0,w,h);g.fillStyle='#e8d9a8';g.fillRect(0,0,w,14);g.fillStyle='#3a3a3a';g.fillRect(0,14,w,3);printLbl(g,0,h*(1-.5),w,h*.26,'#8c3b2e');speck(g,w,h,300,.08,'255,255,255');}),.24,.5,.32);
    M.carton=lblMat(tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);printLbl(g,0,h*.3,w,h*.42,'#274a7a');g.fillStyle='#2a2a2a';g.fillRect(4,8,24,3);g.fillRect(4,54,40,3);}),.28,.72,.55);
    M.can=lblMat(tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);g.fillStyle='#d8d8d8';g.fillRect(0,0,w,8);g.fillRect(0,56,w,8);g.fillStyle='#fbf8f0';g.fillRect(0,26,w,12);g.fillStyle='#222';g.fillRect(8,30,30,4);}),.41,.59,.3);
    M.pack=lblMat(tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);g.fillStyle='#fbf8f0';g.fillRect(0,28,w,36);g.fillStyle='#222';g.fillRect(8,36,44,4);g.fillRect(8,46,30,3);g.fillStyle='#999';g.fillRect(6,52,52,8);}),.0,.56,.5);
    M.bag=lblMat(tex2(64,64,(g,w,h)=>{g.fillStyle='#8a8a8a';g.fillRect(0,0,w,h);g.fillStyle='#b8b8b8';g.fillRect(0,0,w,6);g.fillRect(0,58,w,6);g.fillStyle='#e8e8e8';g.beginPath();g.ellipse(32,36,16,12,0,0,6.283);g.fill();g.fillStyle='#fbf8f0';g.fillRect(10,12,44,8);}),.0,.0,.55);
    const box5=(()=>{const mk=(rx,ry,tx,ty,tz)=>{const p=new T.PlaneGeometry(1,1);if(rx)p.rotateX(rx);if(ry)p.rotateY(ry);p.translate(tx,ty,tz);return p;};return mergeGeos([mk(-Math.PI/2,0,0,.5,0),mk(0,0,0,0,.5),mk(0,Math.PI,0,0,-.5),mk(0,Math.PI/2,.5,0,0),mk(0,-Math.PI/2,-.5,0,0)]);})();
    const GEO={bottle:new T.LatheGeometry([new T.Vector2(.5,0),new T.Vector2(.5,.66),new T.Vector2(.15,1)],5),can:new T.CylinderGeometry(.5,.5,1,5,1,true),box:box5};
    GEO.bottle.translate(0,-.5,0);const GEOSET=new Set([GEO.bottle,GEO.can,GEO.box]);
    // procedural environment cube: white ceiling with strips, burgundy/grey walls, dark floor — gives glossy surfaces something to reflect
    const envCube=(()=>{const mk=fn=>{const c=document.createElement('canvas');c.width=c.height=64;fn(c.getContext('2d'));return c;};
      const side=()=>mk(g=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#d8d4cc');gr.addColorStop(.42,'#6a2a32');gr.addColorStop(.5,'#5a1f28');gr.addColorStop(1,'#2a2a2c');g.fillStyle=gr;g.fillRect(0,0,64,64);g.fillStyle='#c9a86a';g.fillRect(0,30,64,3);});
      const t=new T.CubeTexture([side(),side(),mk(g=>{g.fillStyle='#d8d4cc';g.fillRect(0,0,64,64);g.fillStyle='#ffffff';for(let i=0;i<3;i++)g.fillRect(8+i*20,0,4,64);}),mk(g=>{g.fillStyle='#2a2b2d';g.fillRect(0,0,64,64);}),side(),side()]);t.encoding=T.sRGBEncoding;t.needsUpdate=true;return t;})();
    scene.environment=envCube;
    ['glass','glassC','cool','unit','unitW','grB','grW','screen2','keys'].forEach(k=>M[k].color.convertSRGBToLinear());
    M.avanti=(()=>{const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle='#f3efe6';g.fillRect(0,0,256,96);g.fillStyle='#d3232a';g.font='bold 58px Inter, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('АВАНТИ',128,50);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return new T.MeshBasicMaterial({map:t});})();
    // one InstancedMesh per product family for the whole store; each item = [x,y,z,sx,sy,sz,colour]
    function instanced(geo,list,shadow,pal,mat){const im=new T.InstancedMesh(geo,mat,list.length),m4=new T.Matrix4(),q=new T.Quaternion(),v=new T.Vector3(),sc=new T.Vector3(),c=new T.Color();
      list.forEach((p,i)=>{v.set(p[0],p[1]+p[4]/2,p[2]);sc.set(p[3],p[4],p[5]);m4.compose(v,q,sc);im.setMatrixAt(i,m4);c.set(p[6]||pal[(Math.random()*pal.length)|0]).convertSRGBToLinear();im.setColorAt(i,c);});
      im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=shadow;im.receiveShadow=true;room.add(im);return im;}
    // merge [geometry, colourHex] pairs into one vertex-coloured geometry
    function mergeColored(list){const geos=[],cols=[];list.forEach(([g,c])=>{const n=g.index?g.toNonIndexed():g;if(n!==g)g.dispose();geos.push(n);const col=new T.Color(c).convertSRGBToLinear();cols.push([col,n.attributes.position.count]);});
      const out=mergeGeos(geos);const cnt=out.attributes.position.count,arr=new Float32Array(cnt*3);let k=0;cols.forEach(([c,n])=>{for(let i=0;i<n;i++){arr[k++]=c.r;arr[k++]=c.g;arr[k++]=c.b;}});out.setAttribute('color',new T.BufferAttribute(arr,3));return out;}
    const edgeMat=new T.LineBasicMaterial({transparent:true,opacity:.45}),gridMat=new T.LineBasicMaterial({transparent:true,opacity:.22}),flowMat=new T.LineDashedMaterial({dashSize:.42,gapSize:.3,transparent:true,opacity:.95});

    // scent particles: custom shader so every particle can fade on its own
    const PN=small()?400:900;
    const pPos=new Float32Array(PN*3),pAl=new Float32Array(PN),pv=new Float32Array(PN*3),page=new Float32Array(PN),plife=new Float32Array(PN),pown=new Int8Array(PN).fill(-1);
    const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pPos,3));pg.setAttribute('alpha',new T.BufferAttribute(pAl,1));
    const spr=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new T.CanvasTexture(c);})();
    const pm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
      uniforms:{uTex:{value:spr},uColor:{value:new T.Color(0xd4af63)},uSize:{value:.3},uScale:{value:400},uOp:{value:.5}},
      vertexShader:'attribute float alpha;varying float vA;uniform float uSize;uniform float uScale;void main(){vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=uSize*uScale/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}',
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
      const sm=new T.SkinnedMesh(merged,mat);sm.castShadow=true;sm.frustumCulled=false;g.add(sm);sm.bind(new T.Skeleton(bones));
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
      const bag=new T.Group();{const bm=new T.Mesh(mergeColored([[new T.BoxGeometry(.22*k,.3*k,.12*k),'#f3efe6'],[TG(.06*k,.006,4,10,Math.PI).translate(0,.15*k,0),'#b03030']]),M.vc2);bm.castShadow=true;bag.add(bm);const lbl=new T.Mesh(new T.PlaneGeometry(.17*k,.06*k),M.avanti);lbl.position.set(0,.02*k,.061*k);bag.add(lbl);}
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
      const mesh=new T.Mesh(mergeColored(L),M.vc2);mesh.castShadow=true;g.add(mesh);return g;
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
        else if(ud.pushing){rx=-.78;fx=-.06;rz=sg*.06;}
        else if(i===1&&carryR){rx=.06+.05*b*sn;fx=-.22;rz=sg*.14;}
        else if(i===0&&ud.cane){rx=-.22+.16*b*sn;fx=-.3;rz=-.08;}
        else{const amp=(eld?.16:child?.5:.36)*b;rx=amp*sn+ib*.05;fx=-(.25+.45*b*Math.max(0,-sn));
          if(i===0&&st==='browse'){rx=rx*(1-reach)-1.35*reach;fx=fx*(1-reach)-.35*reach;rz=-.1+.15*reach;ry=.2*reach;if(tob){rx=rx*(1-tob)+.25*tob;fx=fx*(1-tob)-.9*tob;ry=ry*(1-tob)-.7*tob;rz=rz*(1-tob)+.35*tob;}}
          if(st==='queue'&&i===0){rx=.05;fx=-.55-.1*Math.sin(t*.7+ud.ph);ry=.4;rz=-.08;}}
        a.rotation.set(rx,ry,rz);fo.rotation.x=fx;fo.rotation.y=0;});
      // head: keeps level against the lean, small bob, looks around / at the shelf / down the queue
      const hd=ud.head;if(hd){let ly=0,lx=-lean*.6+.02*b*Math.cos(2*ph);
        if(st==='browse'){ly=.1*Math.sin(t*.8+ud.ph);lx-=.12+.1*reach-.25*tob;}
        else if(st==='queue'){ly=Math.sin(t*.5+ud.ph)*.35;}
        else ly=Math.sin(t*.6+ud.ph)*.2;
        if(ud.lookAtP){let a=Math.atan2(ud.lookAtP[0]-g.position.x,ud.lookAtP[1]-g.position.z)-g.rotation.y;a=((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;ly=Math.max(-.9,Math.min(.9,a));lx=-lean*.6+(ud.isChild?-.25:.02);}
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
    let nav=null;const OBS=[],FACES=[];
    const blk=(x,z,w,d,thin)=>OBS.push([x-w/2,x+w/2,z-d/2,z+d/2,thin?1:0]);
    const face=(x,z,dx,dz,tag)=>FACES.push([x,z,dx,dz,tag||'']);
    function navBuild(W,D,doorX,doorW){
      const c=.25,hw=W/2,hd=D/2,cols=Math.ceil(W/c),rows=Math.ceil((D+1.6)/c),x0=-hw,z0=-hd,N=cols*rows;
      const G0=new Uint8Array(N),G35=new Uint8Array(N),G55=new Uint8Array(N);
      const mark=(g,r,inf)=>{const i0=Math.max(0,Math.ceil((r[0]-inf-x0)/c-.5)),i1=Math.min(cols-1,Math.floor((r[1]+inf-x0)/c-.5)),j0=Math.max(0,Math.ceil((r[2]-inf-z0)/c-.5)),j1=Math.min(rows-1,Math.floor((r[3]+inf-z0)/c-.5));for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)g[j*cols+i]=1;};
      // outer walls; the front wall is open at the door, with a 1.6 m apron outside it
      const walls=[[-hw-2,-hw,-hd-2,hd+4],[hw,hw+2,-hd-2,hd+4],[-hw-2,hw+2,-hd-2,-hd],[-hw-2,doorX-doorW/2,hd-.02,hd+4],[doorX+doorW/2,hw+2,hd-.02,hd+4]];
      walls.forEach(r=>{mark(G0,r,0);mark(G35,r,.32);mark(G55,r,.32);});
      OBS.forEach(r=>{mark(G0,r,0);mark(G35,r,.35);mark(G55,r,r[4]?.35:.55);});
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
      function route(g,from,to){let s=nearFree(g,from[0],from[1]),t=nearFree(g,to[0],to[1]);let cells=s&&t?astar(g,s,t):null;if(!cells&&g!==G0){s=nearFree(G0,from[0],from[1]);t=nearFree(G0,to[0],to[1]);cells=s&&t?astar(G0,s,t):null;if(cells)g=G0;} // retry without body inflation (tight small stores)
        if(!cells){if(!failed++)console.warn('nav: no path in store №'+state.n+' from',from,'to',to);return null;}
        const pts=cells.map(q=>toWorld(q[0],q[1]));pts[0]=[from[0],from[1]];pts[pts.length-1]=[to[0],to[1]];const sp=simplify(g,pts);return sp.length>1?sp:[pts[0],pts[pts.length-1]];}
      // browse cells: first free cell in front of each registered shelf face
      const browse=[];FACES.forEach(([fx,fz,dx,dz,tag])=>{for(let s=.3;s<=1.6;s+=.125){const x=fx+dx*s,z=fz+dz*s,[i,j]=toCell(x,z);if(free(G35,i,j)){browse.push({p:toWorld(i,j),f:[dx,dz],ok55:free(G55,i,j),tag});break;}}});
      return {c,cols,rows,x0,z0,G0,G35,G55,free,toCell,toWorld,route,browse,queue:[],entry:null,exit:null,hw,hd,doorX,doorW,failed:()=>failed};
    }
    // ---- people on the grid: crowd simulation driven by the researched shopper spec (research/shopper-behaviour-spec.md) ----
    const PARAMS={
      lambda:{7:18,8:28,9:20,10:14,11:18,12:30,13:26,14:14,15:14,16:22,17:36,18:42,19:34,20:22,21:10}, // §1 customers/hour, weekday, ~350 customers/day
      dayMul:{wd:1,sun:.6},areaRef:350,                                                                    // §1 Sunday morning ×0.6; λ scales with area (350 m² = 1.0)
      densityMult:30,timeScale:.28,speedScale:.42,                                                         // scene-time: visible density and shortened durations, ratios kept
      age:{elder:.2,teen:.05},speed:{adult:[1.2,1.4],browse:[.6,.9],elder:[.9,1.1]},                         // §2
      group:{couple:.12,child:.10},items:[[.45,1,1],[.35,2,3],[.15,4,6],[.05,7,12]],basketMin:4,basketP:.15,basketPickup:[2,4],phoneP:.35, // §2
      dwellMedian:180,impulseP:.65,grab:[3,8],browse:[15,60],browseP:{adult:.3,elder:.45,lunch:.2},standOff:[.4,.7],reach:[1,2], // §3
      decompress:[1.5,3],rightTurnP:.6,loopP:.5,boomerangP:.6,fixtureGap:.5,                                 // §4
      queueGap:.8,balkAt:5,balkP:.15,renegeAfter:240,renegeP:.2,impulseTillP:.15,                           // §5
      greet:[1,2],scanPerItem:3.7,cashP:.6,cash:[15,35],card:[6,12],bagging:[0,15],goodbye:[2,4],elderPayMul:1.5, // §6
      returnBasketP:.95,returnBasket:[2,3],pauseOutsideP:.05,                                                // §7
      restockOn:[600,1200],restockEvery:[3600,7200],buyP:.85                                                // §8 (+ share of visitors who actually buy)
    };
    const rnd=(a,b)=>a+Math.random()*(b-a),rr=r=>rnd(r[0],r[1]);
    const qOcc=[];let flowDirty=true,flowT=0,camSub=null;
    const angTo=(a,b,k)=>{let d=b-a;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return a+d*k;};
    const floorY=(x,z)=>{if(!S.wine)return 0;const zW=S.zW;if(z>zW+.55)return 0;if(z<zW-.55)return S.yF;return S.yF*(zW+.55-z)/1.1;};
    const gridOf=g=>g.userData.stroller?nav.G55:(g.userData.buyer?nav.G35:(nav.G35X||nav.G35));
    // §1: arrival rate now → time a slot stays "away" before the next visitor uses it
    function lambdaNow(){const h=Math.floor(state.t/60);const l=PARAMS.lambda[h]||6;return l*(PARAMS.dayMul[state.day]||1)*Math.max(.3,S.A/PARAMS.areaRef);}
    function awayDur(){return Math.max(3,Math.min(30,3600/(lambdaNow()*PARAMS.densityMult)))*rnd(.6,1.5);}
    function nItems(){const r=Math.random();let a=0;for(const [p,lo,hi] of PARAMS.items){a+=p;if(r<a)return Math.round(rnd(lo,hi));}return 1;}
    // §4: nearest-neighbour ordering from the entrance with a right-turn tendency (right = +x side of the door)
    function orderTargets(list){const out=[];let cur=[S.door.x,S.hd];const pool=list.slice();if(pool.length&&Math.random()<PARAMS.rightTurnP){pool.sort((a,b)=>(b.p[0]-a.p[0]));const first=pool.shift();out.push(first);cur=first.p;}
      while(pool.length){let bi=0,bd=1e9;pool.forEach((b,i)=>{const d=Math.hypot(b.p[0]-cur[0],b.p[1]-cur[1]);if(d<bd){bd=d;bi=i;}});const b=pool.splice(bi,1)[0];out.push(b);cur=b.p;}return out;}
    function pickBrowse(g,n){const pool=nav.browse.filter(b=>!g.userData.stroller||b.ok55);const out=[];for(let k=0;k<n&&pool.length;k++){const j=(Math.random()*pool.length)|0;out.push(pool.splice(j,1)[0]);}return orderTargets(out);}
    function fallbackPath(from){const s=S;return [[from[0],from[1]],[s.door.x,s.hd-.9],[s.mainX,s.hd-.9],[s.mainX,s.zTop-.6],[s.mainX,s.hd-.9],[s.door.x-.25,s.hd+1.3]];}
    function setPath(g,path,T_){const ud=g.userData;if(!path){path=fallbackPath([g.position.x,g.position.z]);ud.fallback=true;}ud.path=path;ud.pi=0;ud.state='walk';ud.blend=ud.blend||0;flowDirty=true;}
    // §2/§3/§9: a visit = ENTER(decompression, basket pickup) → stops (grab | browse) → [QUEUE → PAY → RETURN_BASKET] → EXIT
    function planVisit(g,inside){const ud=g.userData,ts=PARAMS.timeScale,eld=!!ud.elder;ud.items=nItems();ud.buyer=Math.random()<PARAMS.buyP;
      ud.hasBasket=!ud.pushing&&!ud.isChild&&(ud.items>=PARAMS.basketMin||Math.random()<PARAMS.basketP);
      const stops=Math.max(1,Math.min(4,(inside?Math.max(1,ud.items-1):ud.items)+(Math.random()<PARAMS.impulseP?1:0)));
      const bp=state.t>=690&&state.t<=810?PARAMS.browseP.lunch:(eld?PARAMS.browseP.elder:PARAMS.browseP.adult);
      ud.visit=pickBrowse(g,stops).map(b=>({kind:'browse',b,dur:(Math.random()<bp?rr(PARAMS.browse)*ts*1.25:rr(PARAMS.grab))}));
      if(ud.buyer){ud.visit.push({kind:'queue'});if(ud.hasBasket&&Math.random()<PARAMS.returnBasketP)ud.visit.push({kind:'returnBasket'});}
      ud.visit.push({kind:'exit'});ud.legI=0;}
    function navEnter(g,T_){const ud=g.userData;planVisit(g,false);g.position.set(nav.entry[0],0,nav.entry[1]);ud.ang=Math.PI;g.rotation.y=ud.ang;g.visible=true;ud.trail=[[nav.entry[0],nav.entry[1]]];if(ud.stroller){ud.stroller.visible=true;ud.stroller.position.set(nav.entry[0],0,nav.entry[1]-.4);}
      ud.state='enter';ud.until=T_+(rr(PARAMS.decompress)/1.3+(ud.hasBasket?rr(PARAMS.basketPickup):0))*PARAMS.timeScale*2;}
    function navStart(g,T_,i){const ud=g.userData;ud.blend=0;ud.ang=0;
      if(i===0||!nav.browse.length){navEnter(g,T_);return;}
      const b=pickBrowse(g,1)[0];if(!b){navEnter(g,T_);return;}g.position.set(b.p[0],floorY(b.p[0],b.p[1]),b.p[1]);ud.trail=[[b.p[0],b.p[1]]];ud.ang=Math.atan2(-b.f[0],-b.f[1]);g.rotation.y=ud.ang;
      planVisit(g,true);if(ud.stroller)ud.stroller.position.set(b.p[0],0,b.p[1]);
      ud.state='browse';ud.until=T_+rnd(2,20);ud.faceAng=ud.ang;}
    function startLeg(g,T_){const ud=g.userData,leg=ud.visit[ud.legI],from=[g.position.x,g.position.z];let to;
      if(leg.kind==='browse')to=leg.b.p;
      else if(leg.kind==='queue'){const inQ=qOcc.filter(q=>q).length;if(inQ>=PARAMS.balkAt&&Math.random()<PARAMS.balkP){ud.legI=ud.visit.length-1;return startLeg(g,T_);} // §5 balking
        let k=qOcc.findIndex(q=>!q);if(k<0)k=qOcc.length-1;qOcc[k]=g;ud.slot=k;to=nav.queue[k];}
      else if(leg.kind==='returnBasket')to=nav.stack||nav.exit;
      else to=nav.exit;
      setPath(g,nav.route(gridOf(g),from,to),T_);}
    function navArrive(g,T_){const ud=g.userData,leg=ud.visit[ud.legI],ts=PARAMS.timeScale;
      if(leg.kind==='browse'){ud.state='browse';ud.until=T_+leg.dur;ud.faceAng=Math.atan2(-leg.b.f[0],-leg.b.f[1]);}
      else if(leg.kind==='queue'){ud.state='queue';ud.faceAng=Math.atan2(-1,0);ud.until=1e12;ud.qT=T_;}
      else if(leg.kind==='returnBasket'){ud.state='browse';ud.until=T_+rr(PARAMS.returnBasket)*ts;ud.faceAng=Math.atan2(-1,0);ud.hasBasket=false;}
      else{ud.state='away';ud.until=T_+awayDur();g.visible=false;if(ud.stroller)ud.stroller.visible=false;ud.fallback=false;}}
    function navNext(g,T_){g.userData.legI++;startLeg(g,T_);}
    // move along the path; turns in place first when the next leg points >50° away; a stroller parent stops 0.7 m early
    function advance(g,d,dt){const ud=g.userData,P=ud.path;let x=g.position.x,z=g.position.z;const stopAt=ud.stroller?.7:0;let dirA=null;
      {let k=ud.pi;while(k<P.length-1&&Math.hypot(P[k+1][0]-x,P[k+1][1]-z)<1e-3)k++;if(k<P.length-1){const a0=Math.atan2(P[k+1][0]-x,P[k+1][1]-z);let dd=a0-ud.ang;dd=((dd+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(dd)>.9)ud.turning=true;if(ud.turning){ud.ang=angTo(ud.ang,a0,Math.min(1,dt*5));g.rotation.y=ud.ang;if(Math.abs(dd)<.25)ud.turning=false;else return false;}}}
      {const fx=Math.sin(ud.ang),fz=Math.cos(ud.ang);const blockedBy=people.find(o=>o!==g&&o.visible&&o.userData.follow!==people.indexOf(g)&&(()=>{const ox=o.position.x-x,oz=o.position.z-z,L=Math.hypot(ox,oz);return L<.7&&L>.05&&(ox*fx+oz*fz)/L>.6&&(o.userData.state!=='walk'||o.userData.turning);})());
        if(blockedBy&&(ud.waitAcc=(ud.waitAcc||0)+dt)<4){ud.yielding=true;return false;}ud.yielding=false;if(!blockedBy)ud.waitAcc=0;}
      while(d>0&&ud.pi<P.length-1){const n=P[ud.pi+1],dx=n[0]-x,dz=n[1]-z,L=Math.hypot(dx,dz);
        if(L<1e-4){ud.pi++;continue;}
        let rem=L;for(let k=ud.pi+1;k<P.length-1;k++)rem+=Math.hypot(P[k+1][0]-P[k][0],P[k+1][1]-P[k][1]);
        if(rem<=stopAt+1e-3)break;
        if(dirA==null)dirA=Math.atan2(dx,dz);const step=Math.min(d,L,rem-stopAt);x+=dx/L*step;z+=dz/L*step;d-=step;if(step>=L-1e-4)ud.pi++;
        if(step<L-1e-4)break;}
      if(dirA!=null)ud.ang=angTo(ud.ang,dirA,Math.min(1,dt*7));
      g.position.set(x,floorY(x,z),z);g.rotation.y=ud.ang;
      const tr=ud.trail;if(tr){const l=tr[tr.length-1];if(Math.hypot(l[0]-x,l[1]-z)>.2){tr.push([x,z]);if(tr.length>40)tr.shift();}}
      let rem=0;for(let k=ud.pi;k<P.length-1;k++){const a=k===ud.pi?[x,z]:P[k];rem+=Math.hypot(P[k+1][0]-a[0],P[k+1][1]-a[1]);}
      return rem<=stopAt+.02;}
    function strollerFollow(g,dt){const ud=g.userData,st=ud.stroller,P=ud.path;let tx,tz;
      if(P&&ud.state==='walk'){let need=.7,x=g.position.x,z=g.position.z,k=ud.pi;while(k<P.length-1){const n=P[k+1],dx=n[0]-x,dz=n[1]-z,L=Math.hypot(dx,dz);if(L>=need){x+=dx/L*need;z+=dz/L*need;need=0;break;}x=n[0];z=n[1];need-=L;k++;}tx=x;tz=z;}
      else{tx=st.position.x;tz=st.position.z;}
      const dx=tx-st.position.x,dz=tz-st.position.z,L=Math.hypot(dx,dz);if(L>1e-3){const s=Math.min(L,2.5*dt);st.position.x+=dx/L*s;st.position.z+=dz/L*s;}
      st.position.y=floorY(st.position.x,st.position.z);const fx=st.position.x-g.position.x,fz=st.position.z-g.position.z;if(Math.hypot(fx,fz)>.05)st.rotation.y=angTo(st.rotation.y,Math.atan2(fx,fz),Math.min(1,dt*6));}
    // §2 companions: child / partner follow the leader's trail 0.6–1.0 m behind
    function followParent(g,dt,T_){const ud=g.userData,lead=people[ud.follow];if(!lead){g.visible=false;return;}const lu=lead.userData;
      if(lu.state==='away'||lu.state==null){g.visible=false;ud.placed=false;return;}g.visible=true;
      if(lu.chat){const dx=lead.position.x-g.position.x,dz=lead.position.z-g.position.z;ud.ang=angTo(ud.ang||0,Math.atan2(dx,dz),Math.min(1,dt*4));g.rotation.y=ud.ang;g.position.y=floorY(g.position.x,g.position.z);ud.state='chat';ud.lookAtP=[lead.position.x,lead.position.z];ud.talking=lu.chat.talker===1;ud.blend=Math.max(0,(ud.blend||0)-dt*3);if(ud.basket){ud.basket.visible=false;ud.bag.visible=false;}poseAny(g,T_,dt,0);return;}else{ud.lookAtP=null;ud.talking=false;}
      const tr=lu.trail||[[lead.position.x,lead.position.z]];let need=ud.gap||.9,tx=lead.position.x,tz=lead.position.z;
      for(let k=tr.length-1;k>=0;k--){const dx=tr[k][0]-tx,dz=tr[k][1]-tz,L=Math.hypot(dx,dz);if(L>=need){tx+=dx/L*need;tz+=dz/L*need;need=0;break;}tx=tr[k][0];tz=tr[k][1];need-=L;}
      let dx=tx-g.position.x,dz=tz-g.position.z,L=Math.hypot(dx,dz);let v=0;
      if(L>2.2||!ud.placed){ud.placed=true;g.position.set(lead.position.x,0,lead.position.z);dx=tx-g.position.x;dz=tz-g.position.z;L=Math.hypot(dx,dz);}
      if(L>.12){v=Math.min(lu.sp*1.25,L*2.5);const s=Math.min(L,v*dt);g.position.x+=dx/L*s;g.position.z+=dz/L*s;ud.ang=angTo(ud.ang||0,Math.atan2(dx,dz),Math.min(1,dt*8));}
      g.position.y=floorY(g.position.x,g.position.z);g.rotation.y=ud.ang||0;ud.state=v>0?'walk':lu.state==='walk'?'queue':lu.state;ud.blend=v>0?Math.min(1,(ud.blend||0)+dt*3):Math.max(0,(ud.blend||0)-dt*3);
      if(ud.basket){ud.basket.visible=false;ud.bag.visible=false;}poseAny(g,T_,dt,v*ud.blend);}
    // §6 checkout at the head of the queue: greeting → scan n items → cash | card → bagging → goodbye; the next customer advances only afterwards
    function checkout(g,T_){const ud=g.userData,ts=PARAMS.timeScale;const P=PARAMS;
      if(!ud.pay){const n=Math.max(1,Math.min(ud.items||1,8)),cash=Math.random()<P.cashP,eld=ud.elder?P.elderPayMul:1;const d={greet:rr(P.greet),scan:n*P.scanPerItem,pay:(cash?rr(P.cash):rr(P.card))*eld,bag:n>1?rr([2,P.bagging[1]*.4]):0,bye:rr(P.goodbye)};let acc=0;const ph=[];for(const k of ['greet','scan','pay','bag','bye']){acc+=d[k]*ts;ph.push([k,acc]);}
        ud.pay={t0:T_,n,cash,ph,total:acc};if(S.counterBasket)S.counterBasket.visible=!!ud.hasBasket;if(ud.basket)ud.basket.visible=false;}
      const e=T_-ud.pay.t0,cs=extras.find(x=>x.userData.cashier);let phase='bye';for(const [k,t] of ud.pay.ph){if(e<t){phase=k;break;}}
      ud.phase=phase==='pay'?(ud.pay.cash?'cash':'tap'):phase;
      if(cs){cs.userData.state=phase==='scan'?'scan':(phase==='greet'||phase==='bye')?'greet':'queue';cs.userData.lookAtP=(phase==='greet'||phase==='bye'||phase==='tap'||phase==='cash')?[g.position.x,g.position.z]:null;cs.userData.talking=phase==='greet';cs.userData.smile=phase!=='scan';}
      ud.lookAtP=(phase==='greet'||phase==='bye'||phase==='bag')?[cs?cs.position.x:g.position.x,cs?cs.position.z:g.position.z]:null;ud.talking=phase==='bye';ud.smile=phase!=='scan';
      if(S.beep)S.beep.visible=phase==='scan'&&((e-ud.pay.ph[0][1])%(PARAMS.scanPerItem*ts))<.25;
      if(phase==='bag'||phase==='bye'){if(S.counterBasket)S.counterBasket.visible=false;}
      if(e>=ud.pay.total){ud.pay=null;ud.phase=null;ud.lookAtP=null;ud.talking=false;ud.smile=false;if(cs){cs.userData.lookAtP=null;cs.userData.talking=false;cs.userData.smile=false;}qOcc[0]=null;navNext(g,T_);}}
    function stepPeople(dt,T_,open){
      people.forEach((g,i)=>{const ud=g.userData;if(!open){g.visible=false;if(ud.stroller)ud.stroller.visible=false;return;}
        if(ud.follow!=null){followParent(g,dt,T_);return;}
        if(ud.state==null)navStart(g,T_,i);
        if(ud.state==='away'){g.visible=false;if(ud.stroller)ud.stroller.visible=false;if(T_>ud.until){if(ud.isChild){restyle(g);navEnter(g,T_);}else navEnter(regen(i),T_);}return;}
        g.visible=true;if(ud.stroller)ud.stroller.visible=true;
        if(ud.state==='enter'){ud.blend=Math.max(0,ud.blend-dt*3);if(T_>ud.until)startLeg(g,T_);}
        else if(ud.state==='walk'){ud.blend=Math.min(1,ud.blend+dt*2);if(advance(g,ud.sp*ud.blend*dt,dt))navArrive(g,T_);}
        else if(ud.state==='browse'){ud.blend=Math.max(0,ud.blend-dt*3);
          // couples / parent+child: stop now and then, face each other and talk 6–15 s (talker swaps every ~3 s)
          const pt=ud.partner!=null?people[ud.partner]:null;
          const pd=pt?Math.hypot(pt.position.x-g.position.x,pt.position.z-g.position.z):0;if(pt&&pt.visible&&!ud.chat&&pd>.5&&pd<1.7&&Math.random()<dt*.08){ud.chat={until:T_+rnd(6,15),sw:T_+3,talker:0};ud.until=Math.max(ud.until,ud.chat.until+1);}
          if(ud.chat){if(!pt||!pt.visible||T_>ud.chat.until){ud.chat=null;ud.lookAtP=null;ud.talking=false;}else{if(T_>ud.chat.sw){ud.chat.sw=T_+rnd(2,4);ud.chat.talker^=1;}ud.faceAng=Math.atan2(pt.position.x-g.position.x,pt.position.z-g.position.z);ud.lookAtP=[pt.position.x,pt.position.z];ud.talking=ud.chat.talker===0;}}
          ud.ang=angTo(ud.ang,ud.faceAng,Math.min(1,dt*4));g.rotation.y=ud.ang;if(T_>ud.until&&!ud.chat)navNext(g,T_);}
        else if(ud.state==='queue'){ud.blend=Math.max(0,ud.blend-dt*3);ud.ang=angTo(ud.ang,ud.faceAng,Math.min(1,dt*4));g.rotation.y=ud.ang;const k=ud.slot;
          if(k>0&&!qOcc[k-1]){qOcc[k]=null;qOcc[k-1]=g;ud.slot=k-1;setPath(g,nav.route(gridOf(g),[g.position.x,g.position.z],nav.queue[k-1]),T_);}
          else if(k>0&&T_-ud.qT>PARAMS.renegeAfter*PARAMS.timeScale&&Math.random()<dt*.05){qOcc[k]=null;ud.legI=ud.visit.length-1;startLeg(g,T_);} // §5 reneging
          else if(k===0)checkout(g,T_);}
        if(ud.stroller)strollerFollow(g,dt);
        const leg=ud.visit[ud.legI],leaving=leg&&(leg.kind==='exit'||leg.kind==='returnBasket'),entering=ud.state==='enter';
        if(ud.basket){ud.basket.visible=!!ud.hasBasket&&!leaving&&!entering&&!ud.pay;ud.bag.visible=!!ud.buyer&&(ud.items||1)>1&&(leaving||ud.phase==='bag'||ud.phase==='bye');}
        if(ud.phoneM)ud.phoneM.visible=!!ud.phone&&ud.state==='queue'&&!ud.pay;
        ud.lookDir=0;poseAny(g,T_,dt,ud.state==='walk'&&!ud.turning&&!ud.yielding?ud.sp*ud.blend:0);});
      // §8 restocking staff: on the shelf 10–20 min every 1–2 h (scene-time scaled)
      const rs=extras.find(x=>x.userData.state==='restock'||x.userData.restocker);if(rs){const u=rs.userData;u.restocker=true;if(u.rsUntil==null){u.rsOn=true;u.rsUntil=T_+rr(PARAMS.restockOn)*PARAMS.timeScale*.15;}if(T_>u.rsUntil){u.rsOn=!u.rsOn;u.rsUntil=T_+(u.rsOn?rr(PARAMS.restockOn):rr(PARAMS.restockEvery)*.25)*PARAMS.timeScale*.15;}rs.visible=open&&u.rsOn;}
      // the flow layer: planned polylines of the shoppers currently inside
      if(flowDirty&&flowLine&&T_-flowT>.4){flowT=T_;flowDirty=false;const pts=[];people.forEach(g=>{const ud=g.userData,P=ud.path;if(!P||ud.state!=='walk'||ud.follow!=null||!g.visible)return;let a=[g.position.x,g.position.z];for(let k=ud.pi+1;k<P.length;k++){pts.push(a[0],.03+floorY(a[0],a[1]),a[1],P[k][0],.03+floorY(P[k][0],P[k][1]),P[k][1]);a=P[k];}});
        flowLine.geometry.dispose();const fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(pts,3));flowLine.geometry=fg;flowLine.computeLineDistances();}
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
    function mkRandom(sp){const g=gltfPerson(sp)||makePerson(9,sp);if(sp.cane){const k=g.userData.k;const cane=new T.Mesh(mergeColored([[new T.CylinderGeometry(.012,.014,.84*k,6).translate(0,-.4*k,.02),'#5a3a1a'],[new T.SphereGeometry(.02,6,5).translate(0,.02,.02),'#c9a24a']]),M.vc2);cane.castShadow=true;g.userData.arms[0].userData.hd.add(cane);g.userData.cane=true;}
      g.userData.phone=!!sp.phone;g.userData.sp=(sp.elder?rr(PARAMS.speed.elder):rr(PARAMS.speed.adult))*PARAMS.speedScale;return g;}
    function regen(i){const old=people[i],ud=old.userData,g=mkRandom(randomSpec()),nu=g.userData;nu.ph=Math.random()*6.28;if(ud.follow!=null)nu.follow=ud.follow;if(ud.partner!=null)nu.partner=ud.partner;if(ud.stroller){nu.stroller=ud.stroller;nu.pushing=true;nu.basket.visible=false;}
      room.remove(old);if(ud.gltfP){window.KL_GLTF.release(old);}else old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}else if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();});
      people[i]=g;room.add(g);if(camSub===old)camSub=null;return g;}

    // ---- real human models (hosted build only): window.KL_GLTF from assets/js/people-gltf.js; procedural figures remain the fallback ----
    const GL=()=>{const g=window.KL_GLTF;return g&&g.ready&&!g.failed?g:null;};
    const usedFiles=()=>people.concat(extras).map(p=>p.userData.file).filter(Boolean);
    function gltfPerson(spec){const G=GL();if(!G)return null;spec=spec||{};let kind=spec.staff?'staff':spec.isChild?'child':spec.elder?'elderly':(spec.fem?'f':'m');if(!G.has(kind)){if(kind==='child')return null;kind=spec.fem?'f':'m';if(!G.has(kind))return null;}
      const g=G.spawn({kind,height:spec.h||(spec.isChild?1.18:1.72),avoid:usedFiles()});if(!g)return null;const ud=g.userData,k=(ud.height||1.72)/1.72;
      ud.gltfP=true;ud.k=k;ud.elder=!!spec.elder||ud.kind==='elderly';ud.isChild=!!spec.isChild||ud.kind==='child';ud.yaw=0;ud.dist=0;ud.blend=0;ud.phone=!!spec.phone;ud.hipY=.9*k;
      ud.rh=g.getObjectByName('Bip01_R_Hand')||g.getObjectByName('Bip02_R_Hand')||null;ud.lh=g.getObjectByName('Bip01_L_Hand')||null;
      const basket=new T.Group();{const L=[[new T.CylinderGeometry(.15,.12,.2,8,1,true),'#d0212b'],[new T.CircleGeometry(.12,8).rotateX(Math.PI/2).translate(0,-.1,0),'#d0212b'],[new T.TorusGeometry(.14,.008,4,10,Math.PI).translate(0,.1,0),'#3a1a14']];for(let q=0;q<5;q++)L.push([new T.CylinderGeometry(.025,.025,.11,6).translate((Math.random()-.5)*.16,.03+Math.random()*.1,(Math.random()-.5)*.16),pick_(['#e8e2d0','#1f3a24','#c9a24a','#7a1f1f','#2f6fb5'])]);basket.add(new T.Mesh(mergeColored(L),M.vc2));}
      basket.visible=false;g.add(basket);
      const bag=new T.Group();{bag.add(new T.Mesh(mergeColored([[new T.BoxGeometry(.22,.3,.12),'#f3efe6'],[new T.TorusGeometry(.06,.006,4,10,Math.PI).translate(0,.15,0),'#b03030']]),M.vc2));const lbl=new T.Mesh(new T.PlaneGeometry(.17,.06),M.avanti);lbl.position.set(0,.02,.061);bag.add(lbl);}bag.visible=false;g.add(bag);
      const ph=new T.Mesh(mergeColored([[new T.BoxGeometry(.07,.14,.01),'#111111']]),M.vc2);ph.visible=false;g.add(ph);
      const bl=new T.Mesh(new T.CircleGeometry(.34*k,12),M.blob);bl.rotation.x=-Math.PI/2;bl.position.y=.012;bl.renderOrder=1;g.add(bl);
      ud.basket=basket;ud.bag=bag;ud.phoneM=ph;ud.arms=[{userData:{hd:ud.lh||g}},{userData:{hd:ud.rh||g}}];ud.legs=[];return g;}
    const _hv=new T.Vector3();
    function gltfPose(g,v){const ud=g.userData,st=ud.state;let clip='idle';
      if(v>.04){clip=ud.elder?'walkslow':'walk';ud.setSpeed(v);}
      else if(st==='queue')clip=(ud.phone&&ud.phoneM&&ud.phoneM.visible)?'phone':'wait';
      else if(st==='browse'||st==='restock'||st==='scan')clip='look';else if(ud.bag&&ud.bag.visible)clip='bag';
      if(v<=.04&&(ud.lookAtP||st==='chat'||st==='greet'))clip=ud.talking?(ud.ph>3?'talk2':'talk'):'listen';
      ud.play(clip,.3);
      if(ud.face){const now=performance.now()/1000,F=ud.fw||(ud.fw={});const ease=(k,tgt,rate)=>{F[k]=(F[k]||0)+(tgt-(F[k]||0))*Math.min(1,rate||.12);ud.face(k,F[k]);};
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
      if(ud.rh){ud.rh.getWorldPosition(_hv);g.worldToLocal(_hv);ud.basket.position.set(_hv.x,_hv.y-.2,_hv.z);ud.bag.position.set(_hv.x,_hv.y-.24,_hv.z);ud.basket.rotation.y=ud.bag.rotation.y=0;}
      if(ud.lh&&ud.phoneM){ud.lh.getWorldPosition(_hv);g.worldToLocal(_hv);ud.phoneM.position.set(_hv.x,_hv.y+.02,_hv.z+.05);ud.phoneM.rotation.x=-.9;}}
    function poseAny(g,t,dt,v){if(g.userData.gltfP)gltfPose(g,v);else posePerson(g,t,dt,v);}
    // after the mixer: head yaw toward whoever the person looks at, pitch for a child looking up / elderly looking down / a nod when handed the bag
    const _q=new T.Quaternion(),_ax=new T.Vector3();
    function gltfHeads(dt){people.concat(extras).forEach(g=>{const ud=g.userData;if(!ud.gltfP||!g.visible)return;if(ud.headB===undefined)ud.headB=g.getObjectByName('Bip01_Head')||g.getObjectByName('Bip02_Head')||null;const hb=ud.headB;if(!hb)return;
      let yaw=0,pitch=0;if(ud.lookAtP){let a=Math.atan2(ud.lookAtP[0]-g.position.x,ud.lookAtP[1]-g.position.z)-g.rotation.y;a=((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;yaw=Math.max(-.9,Math.min(.9,a));if(ud.isChild)pitch=-.35;}
      if(ud.elder&&ud.state==='browse')pitch+=.15;if(ud.phase==='bag'){ud.nodT=(ud.nodT||0)+dt;pitch+=.18*Math.max(0,Math.sin(ud.nodT*6));}else ud.nodT=0;
      ud.hy=(ud.hy||0)+(yaw-(ud.hy||0))*Math.min(1,dt*4);ud.hp=(ud.hp||0)+(pitch-(ud.hp||0))*Math.min(1,dt*4);if(Math.abs(ud.hy)<.01&&Math.abs(ud.hp)<.01)return;
      hb.parent.getWorldQuaternion(_q).invert();_ax.set(0,1,0).applyQuaternion(_q);hb.rotateOnAxis(_ax,ud.hy);_ax.set(Math.cos(g.rotation.y),0,-Math.sin(g.rotation.y)).applyQuaternion(_q);hb.rotateOnAxis(_ax,ud.hp);});}
    // swap a procedural figure for a real model in place (used after the models arrive; re-entries do it automatically)
    function upgrade(i){const old=people[i],ud=old.userData;if(ud.gltfP||!GL())return null;const spec={fem:!!ud.fem,elder:!!ud.elder,isChild:!!ud.isChild,h:ud.isChild?1.18:1.6+Math.random()*.3,phone:!!ud.phone};const g=gltfPerson(spec);if(!g)return null;const nu=g.userData;
      ['state','visit','legI','path','pi','until','faceAng','slot','hasBasket','buyer','items','trail','ang','sp','follow','partner','gap','turning','pay','phase','placed','ph','camAng','stroller','pushing','fallback','qT'].forEach(k=>{if(ud[k]!==undefined)nu[k]=ud[k];});
      g.position.copy(old.position);g.rotation.copy(old.rotation);g.visible=old.visible;room.remove(old);old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}else if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();});
      qOcc.forEach((q,j)=>{if(q===old)qOcc[j]=g;});people[i]=g;room.add(g);if(camSub===old)camSub=g;return g;}
    function upgradeCashier(){const i=extras.findIndex(x=>x.userData.cashier&&!x.userData.gltfP);if(i<0||!GL())return;const old=extras[i];const g=gltfPerson({staff:true,h:1.72});if(!g)return;g.position.copy(old.position);g.rotation.copy(old.rotation);const nu=g.userData;nu.state='queue';nu.blend=0;nu.ph=old.userData.ph;nu.cashier=true;if(nu.basket)nu.basket.visible=false;room.remove(old);old.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}});extras[i]=g;room.add(g);}
    document.addEventListener('kl-gltf-model',e=>{if(!room||!people.length)return;if(e.detail.count>=8||window.KL_GLTF&&KL_GLTF.has('staff')&&e.detail.count>=5){try{people.forEach((p,i)=>{if(!p.userData.gltfP)upgrade(i);});upgradeCashier();kick();}catch(err){console.warn('upgrade',err);}}});
    window.__upgradeAll=()=>{let n=0;const err=[];people.forEach((p,i)=>{try{if(upgrade(i))n++;else err.push([i,'null',!!p.userData.gltfP,p.userData.isChild,p.userData.elder,p.userData.fem]);}catch(e){err.push([i,String(e).slice(0,120)]);}});window.__upErr=err;return n;};
    function clearRoom(){buildTok++;pending.forEach(cancelAnimationFrame);pending=[];camSub=null;
      people.concat(extras).forEach(p=>{if(p.userData.gltfP){room.remove(p);if(window.KL_GLTF)window.KL_GLTF.release(p);}});
      room.traverse(o=>{if(o.geometry&&!GEOSET.has(o.geometry))o.geometry.dispose();if(o.isSkinnedMesh){o.skeleton.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}if(o.isSprite||(o.material&&o.material.userData&&o.material.userData.own))o.material.dispose();});
      room.clear();overlay.forEach(o=>o.el.remove());overlay.length=0;people.length=0;extras.length=0;heat=null;flowLine=null;flowCurve=null;acc={};vacc=[];vaccM=[];}
    let acc={},vacc=[],vaccM=[],buildTok=0,pending=[];
    function later(fn){const tok=buildTok;pending.push(requestAnimationFrame(()=>{if(tok!==buildTok)return;fn();kick();}));}
    function boxG(w,h,d,s){const g=new T.BoxGeometry(w,h,d);if(s){const uv=g.attributes.uv,dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let i=0;i<uv.count;i++){const f=(i/4)|0;uv.setXY(i,uv.getX(i)*dims[f][0]/s,uv.getY(i)*dims[f][1]/s);}}return g;}
    // boxes are collected per material and merged into one mesh each at the end of build()
    function box(w,h,d,m,x,y,z,sh){const g=boxG(w,h,d,m.map?1.5:0);g.translate(x,y,z);const key=m.uuid+(sh!==false?'s':'n');if(!acc[key])acc[key]={m,sh:sh!==false,geos:[]};acc[key].geos.push(g);}
    function geo(g,m,sh){const key=m.uuid+(sh!==false?'s':'n');if(!acc[key])acc[key]={m,sh:sh!==false,geos:[]};acc[key].geos.push(g);}
    // vertex-coloured props: all merged into one M.vc mesh (and one M.vcm mesh for metal)
    function cbox(w,h,d,col,x,y,z,metal,ry){const g=new T.BoxGeometry(w,h,d);if(ry)g.rotateY(ry);g.translate(x,y,z);(metal?vaccM:vacc).push([g,col]);}
    function cgeo(g,col,x,y,z,metal){g.translate(x,y,z);(metal?vaccM:vacc).push([g,col]);}
    function flush(){Object.values(acc).forEach(a=>{const o=new T.Mesh(mergeGeos(a.geos),a.m);o.castShadow=a.sh;o.receiveShadow=true;room.add(o);});acc={};
      if(vacc.length){const o=new T.Mesh(mergeColored(vacc),M.vc);o.castShadow=true;o.receiveShadow=true;room.add(o);}if(vaccM.length){const o=new T.Mesh(mergeColored(vaccM),M.vcm);o.receiveShadow=true;room.add(o);}vacc=[];vaccM=[];}
    const SHORT={'Сладки · снаксове':'Снаксове','Хладилни витрини · напитки':'Витрини','Спиртни напитки':'Алкохол','Кафе · чай':'Кафе','Склад / офис':'Склад'};
    function label(t,x,y,z){const e=document.createElement('div');e.className='ov lbl';e.textContent=(stage.clientWidth<560&&SHORT[t])||t;ovl.appendChild(e);overlay.push({el:e,v:new T.Vector3(x,y,z),kind:'lbl'});}
    const WINE=['#1f3a24','#2a1a10','#5a1a22','#dfe9ee','#e8e2d0','#7a1f1f','#c9a24a','#14301c'],SPIRIT=['#3a2410','#c9862a','#e8e2d0','#1f3a24','#7a1f1f','#dfe9ee','#b8862e','#0d2b45','#e0b23a'],
      SWEET=['#5b2d8e','#6b3fa0','#c8382e','#3a2410','#e0b23a','#e8e2d6','#2f6fb5','#5b2d8e'],BISC=['#c8382e','#e0b23a','#5b2d8e','#f0e2c4','#3c7a3e','#274a7a'],COFFEE=['#3a2410','#c8382e','#1b1917','#e0b23a','#6b3fa0','#0d2b45','#8c3b2e'],
      CHIPS=['#e0b23a','#c8382e','#3c7a3e','#f28c28','#2f6fb5','#5b2d8e','#f0e2c4'],TEA=['#3c7a3e','#c8382e','#e0b23a','#274a7a','#f28c28'],CANS=['#c8382e','#2f6fb5','#e0b23a','#3c7a3e','#e8e2d6','#f28c28','#1b1917'],DRINK=['#2a1a10','#dfe9ee','#f28c28','#3c7a3e','#c9862a','#c8382e','#dfe9ee'];

    function build(){
      clearRoom();const t0=performance.now();OBS.length=0;FACES.length=0;if(window.__perf)window.__perf.done=0;
      const r=row(),A=r.area,Hh=H();const shape=(r.n%5===0&&A>120)?'L':(r.n%3===0?'sq':'rect');let W=Math.sqrt(A*(shape==='sq'?1.05:1.45)),D=A/W;if(D<3.8){D=3.8;W=A/D;}
      const hw=W/2,hd=D/2,t=.12,yM=Math.min(2.55,Hh-.35),phone=small(),dens=phone?3.8:1;
      const store_=A>=120,sw=store_?Math.min(4,W*.26):0,sd=store_?Math.min(3.4,D*.38):0;
      const wine=A>150,yF=wine?-.12:0;
      const zTop=-hd+Math.max(wine?4.9:2.3,store_?sd+.9:0),zBot=hd-4.0,len=zBot-zTop,zW=wine?zTop-2.4:-hd;
      S={A,W,D,H:Hh,hw,hd,sw,sd,hasStore:store_,units:[],shape,yF,zW,wine};
      const B='#7a1f2b',BD='#4a1119',BLK='#161616',STEEL='#c9cdd1',WHT='#ece9e2';
      const FAM={bottle:[],can:[],carton:[],pack:[],bag:[]};const put=(f,x,y,z,sx,sy,sz,c)=>FAM[f].push([x,y,z,sx,sy,sz,c]);
      const strips=[],glassAcc=[],headAcc=[[],[],[]],aoAcc=[];const ao=(x,z,L,dx,dz)=>{const g=new T.PlaneGeometry(.42,L);g.rotateX(-Math.PI/2);g.rotateY(dx>0?0:dx<0?Math.PI:dz>0?-Math.PI/2:Math.PI/2);g.translate(x+dx*.21,.007,z+dz*.21);aoAcc.push(g);};
      const rail=(x,y,z,L,ry)=>{const sg=new T.PlaneGeometry(L,.04);sg.rotateY(ry);sg.translate(x,y,z);const uv=sg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*L/.96);strips.push(sg);};
      // floor (two levels when the wine corner is a step down)
      M.floor.map.repeat.set(W/1.2,D/1.2);M.floor.roughnessMap.repeat.set(W/1.2,D/1.2);
      const addFloor=(z0,z1,y)=>{const g=new T.PlaneGeometry(W,z1-z0);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*(z1-z0)/D);g.rotateX(-Math.PI/2);g.translate(0,y,(z0+z1)/2);const m=new T.Mesh(g,M.floor);m.receiveShadow=true;room.add(m);};
      if(wine){addFloor(zW,hd,0);addFloor(-hd,zW,yF);cbox(W,.12,.05,BD,0,-.06,zW+.025);}else addFloor(-hd,hd,0);
      const gp=[];for(let i=1;i<Math.ceil(W);i++){const x=-hw+i;if(x<hw)gp.push(x,.004,-hd,x,.004,hd);}for(let i=1;i<Math.ceil(D);i++){const z=-hd+i;if(z<hd)gp.push(-hw,.004,z,hw,.004,z);}
      const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(gp,3));room.add(new T.LineSegments(gg,gridMat));
      // ceiling: white tile grid
      M.ceil.map.repeat.set(W/1.2,D/1.2);const cp=new T.Mesh(new T.PlaneGeometry(W,D),M.ceil);cp.rotation.x=Math.PI/2;cp.position.y=Hh-.005;room.add(cp);
      // walls: burgundy, oak skirting; the right wall stays low so the diorama reads as a cut-away
      const wh=Hh-yF,wy=(Hh+yF)/2;
      box(W+2*t,wh,t,M.wall,0,wy,-hd-t/2);box(t,wh,D,M.wall,-hw-t/2,wy,0);box(t,.32,D,M.wall,hw+t/2,.16,0);
      ao(0,-hd+.45,W,0,1);ao(-hw,0,D,1,0);ao(0,hd-.05,W,0,-1);
      box(W,.1,.03,M.oak,0,yF+.05,-hd+.016);box(.03,.1,D-(hd-zW),M.oak,-hw+.016,.05,(zW+hd)/2);if(wine)box(.03,.1,zW+hd,M.oak,-hw+.016,yF+.05,(-hd+zW)/2);box(.03,.1,D,M.oak,hw-.016,.05,0);
      // glass front with dark frames, double glass door, white header above the door (the diffuser sits on it)
      const doorW=Math.min(1.8,Math.max(1.3,W*.2)),doorX=hw-Math.max(1.3,W*.2)-doorW/2,gH=Hh*.78;S.door={x:doorX,w:doorW};
      [[-hw,doorX-doorW/2],[doorX+doorW/2,hw]].forEach(([a,b])=>{const w=b-a;if(w<.05)return;box(w,.34,t,M.wall,(a+b)/2,.17,hd+t/2);box(w,.1,.03,M.oak,(a+b)/2,.05,hd-.016);const g=new T.PlaneGeometry(w,gH-.34);g.translate((a+b)/2,.34+(gH-.34)/2,hd+t/2);glassAcc.push(g);
        for(let x=a+1.2;x<b-.3;x+=1.2)cbox(.06,gH-.34,.08,BLK,x,.34+(gH-.34)/2,hd+t/2);cbox(w,.06,.08,BLK,(a+b)/2,gH,hd+t/2);});
      box(W+2*t,Hh-gH,t,M.wall,0,(Hh+gH)/2,hd+t/2);
      cbox(.08,2.3,.12,BLK,doorX-doorW/2,1.15,hd+t/2);cbox(.08,2.3,.12,BLK,doorX+doorW/2,1.15,hd+t/2);cbox(doorW+.08,.08,.12,BLK,doorX,2.3,hd+t/2);
      cbox(doorW+.16,gH-2.34,.1,WHT,doorX,2.34+(gH-2.34)/2,hd+t/2);
      {for(const s of [-1,1]){const g=new T.PlaneGeometry(doorW/2-.08,2.2);g.translate(doorX+s*doorW/4,1.13,hd+t/2);glassAcc.push(g);cbox(.03,.4,.03,STEEL,doorX+s*.1,1.05,hd+t/2+.07,true);cbox(.03,.4,.03,STEEL,doorX+s*.1,1.05,hd+t/2-.07,true);}
        cbox(.05,2.2,.06,BLK,doorX,1.13,hd+t/2);cbox(doorW-.1,.05,.06,BLK,doorX,.35,hd+t/2);
        const sg=new T.Mesh(new T.PlaneGeometry(.34,.22),M.signOpen);sg.position.set(doorX+doorW/2-.32,1.75,hd+t/2+.03);room.add(sg);S.sign=sg;
        const sg2=new T.Mesh(new T.PlaneGeometry(.34,.22),M.signOpen);sg2.rotation.y=Math.PI;sg2.position.set(doorX+doorW/2-.32,1.75,hd+t/2-.03);room.add(sg2);S.sign2=sg2;
        const cc=new T.Mesh(new T.PlaneGeometry(.26,.36),M.cctv);cc.position.set(doorX+doorW/2-.32,1.32,hd+t/2-.02);room.add(cc);}
      const eg=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(W,Hh,D)),edgeMat);eg.position.y=Hh/2;room.add(eg);
      const mat=new T.Mesh(new T.PlaneGeometry(doorW+.2,1.0),M.mat);mat.rotation.x=-Math.PI/2;mat.position.set(doorX,.006,hd-.6);mat.receiveShadow=true;room.add(mat);
      // light bordered floor inlays in the entry zone
      for(let i=-1;i<=1;i++){const ix=doorX+i*1.3,iz=hd-1.9;if(ix>-hw+.8&&ix<hw-.8){cbox(.62,.004,.62,'#c9c6bf',ix,.002,iz);cbox(.5,.005,.5,'#8d8f92',ix,.003,iz);}}
      // exterior: black fascia with red АВАНТИ + subtitle, poster, canopy with round downlights, pavement, steps, ramp with railing, street backdrop
      {const fz=hd+t+.05;cbox(W+2*t+.3,Hh-gH+.35,.1,'#151515',0,(Hh+gH)/2+.1,fz);const fp=new T.Mesh(new T.PlaneGeometry(Math.min(W,9),Hh-gH+.2),M.facade);fp.position.set(doorX,(Hh+gH)/2+.08,fz+.06);room.add(fp);
        const ps=new T.Mesh(new T.PlaneGeometry(1.4,2.1),M.adPoster);ps.position.set(Math.min(hw-.9,doorX+doorW/2+1.3),1.35,hd+t/2+.03);room.add(ps);
        cbox(doorW+3.2,.14,1.7,'#1c1c1c',doorX+.4,gH+.02,hd+.95);for(let i=-1;i<=1;i+=2){const dl=new T.CylinderGeometry(.13,.13,.02,12);cgeo(dl,'#ffffff',doorX+.4+i*.9,gH-.06,hd+1.0);}
        const av=new T.Mesh(new T.PlaneGeometry(.3,.4),M.avantiRed);av.position.set(doorX+doorW/2-.32,.85,hd+t/2+.02);room.add(av);
        cbox(doorW+3.6,.45,1.75,'#9a9a98',doorX+.4,-.225,hd+.875);cbox(W+2*t,.45,.6,'#8f8f8d',0,-.225,hd+.3);
        for(let i=0;i<3;i++)cbox(doorW+1.0,.15,.32,'#a8a8a6',doorX,-.075-i*.15,hd+1.75+.16+i*.32);
        {const rx=doorX+doorW/2+1.3,a=Math.atan2(.45,2.4);const rg=new T.BoxGeometry(1.2,.06,2.45);rg.rotateX(a);rg.translate(rx,-.24,hd+1.75+1.2);vacc.push([rg,'#a3a3a1']);
          for(const s of [-1,1]){const px=rx+s*.6;[0,1.2,2.4].forEach((d,k)=>cgeo(new T.CylinderGeometry(.02,.02,.9,6),'#8a8f96',px,-d/2.4*.45+.45,hd+1.75+d,true));const bg=new T.CylinderGeometry(.016,.016,2.5,6);bg.rotateX(Math.PI/2-a);cgeo(bg,'#8a8f96',px,.66,hd+1.75+1.2,true);}}
        const gr=new T.Mesh(new T.PlaneGeometry(W+30,16),M.asphalt);gr.rotation.x=-Math.PI/2;gr.position.set(0,-.46,hd+8.5);room.add(gr);
        const bd=new T.Mesh(new T.PlaneGeometry(W+30,5),M.street);bd.rotation.y=Math.PI;bd.position.set(0,2.0,hd+13);room.add(bd);
        // green exit sign above the door (inside), CCTV domes on the ceiling
        const ex=new T.Mesh(new T.PlaneGeometry(.34,.14),M.exit);ex.position.set(doorX+doorW/2-.3,gH-.12,hd-.08);ex.rotation.y=Math.PI;room.add(ex);cbox(.34,.14,.03,'#1f7a3e',doorX+doorW/2-.3,gH-.12,hd-.06);
        [[doorX-2,hd-1.2],[0,0],[-hw*.5,-hd*.5]].forEach(([x,z])=>cgeo(new T.SphereGeometry(.07,8,4,0,Math.PI*2,Math.PI/2,Math.PI/2),'#f2f2f0',x,Hh-.01,z));}
      // entrance: red basket stack (left of the door), chest freezer + Milka fridge + Haribo stand (right of the door)
      {const bx=doorX-doorW/2-.35,bz=hd-.55;blk(bx,bz,.5,.36);for(let i=0;i<5;i++){cbox(.46,.2,.32,'#d0212b',bx,.1+i*.075,bz);cbox(.5,.03,.36,'#a8191f',bx,.21+i*.075,bz);}
        const rx=doorX+doorW/2;if(hw-rx>1.9){const fx=rx+.95,fz=hd-.72;blk(fx,fz,1.35,.72);cbox(1.35,.82,.72,'#1fb5b0',fx,.41,fz);cbox(1.35,.05,.72,'#eef2f2',fx,.85,fz);cbox(1.2,.02,.5,'#bfe6f0',fx,.88,fz);cbox(1.35,.06,.72,'#0e7d79',fx,.03,fz);
          const mx=Math.min(hw-.42,rx+2.0),mz=hd-.6;blk(mx,mz,.72,.7);face(mx-.36,mz,-1,0,'milka');cbox(.72,1.95,.7,'#5b2d8e',mx,.975,mz);const mg=new T.PlaneGeometry(.6,1.5);mg.rotateY(Math.PI);mg.translate(mx,1.05,mz-.352);glassAcc.push(mg);box(.6,1.5,.02,M.cool,mx,1.05,mz-.3,false);
          [.45,.85,1.25,1.65].forEach(y=>{cbox(.6,.02,.5,'#e6e8ea',mx,y,mz);for(let x=mx-.24;x<mx+.24;x+=.09*dens)put('pack',x,y+.01,mz-.2,.07,.12,.16,pick_(['#5b2d8e','#e8e2d6','#3a2410','#2f6fb5']));});
          const ml=new T.Mesh(new T.PlaneGeometry(.66,1.6),M.milka);ml.rotation.y=-Math.PI/2;ml.position.set(mx-.361,1.05,mz);room.add(ml);
          const hx=rx+1.7,hz=hd-1.55;blk(hx,hz,.5,.42);face(hx,hz+.2,0,1,'haribo');cbox(.44,1.35,.36,'#f5c400',hx,.675,hz);cbox(.5,.05,.42,'#f5c400',hx,.03,hz);const hb=new T.Mesh(new T.PlaneGeometry(.44,.17),M.haribo);hb.position.set(hx,1.45,hz+.18);room.add(hb);
          for(let lv=0;lv<4;lv++)for(let i=0;i<3;i++)put('bag',hx-.14+i*.14,.2+lv*.3,hz+.2,.11,.2,.05,pick_(['#f5c400','#c8382e','#3c7a3e','#f28c28','#2f6fb5']));}}
      // checkout: oak counter, black POS, terminal, printer, green-vest cashier; cigarette wall behind
      const ckW=Math.min(A<60?1.5:2.2,W*.25),ckX=Math.max(-hw+ckW/2+.35,doorX-doorW/2-ckW/2-.9),ckZ=hd-1.15;
      blk(ckX,ckZ-.2,ckW,1.2);ao(ckX,ckZ+.4,ckW,0,1);ao(ckX+ckW/2,ckZ,.8,1,0);box(ckW,1,.8,M.oak,ckX,.5,ckZ);cbox(ckW+.04,.04,.84,'#3a2a1e',ckX,1.02,ckZ);cbox(ckW,.06,.02,BLK,ckX,.03,ckZ-.39);
      {const po=new T.Mesh(new T.PlaneGeometry(.6,.5),M.poster);po.position.set(ckX+ckW/2-.5,.55,ckZ+.41);room.add(po);
        const px=ckX+ckW/2-.3;cbox(.3,.02,.2,BLK,px,1.05,ckZ-.05);cbox(.03,.14,.03,BLK,px,1.12,ckZ-.05);
        const mon=new T.Group();mon.position.set(px,1.3,ckZ-.05);mon.rotation.y=-.35;mon.rotation.x=-.15;const bz=new T.Mesh(new T.BoxGeometry(.34,.24,.02),M.unit);const sc=new T.Mesh(new T.PlaneGeometry(.31,.21),M.screen);sc.position.z=.011;mon.add(bz,sc);room.add(mon);S.screen=sc;
        const term=new T.Group();term.position.set(px+.02,1.06,ckZ+.25);term.rotation.y=.5;term.rotation.x=-.3;const tb=new T.Mesh(new T.BoxGeometry(.085,.03,.15),M.unit);const ts=new T.Mesh(new T.PlaneGeometry(.06,.035),M.screen2);ts.rotation.x=-Math.PI/2;ts.position.set(0,.016,-.045);const keys=new T.Mesh(new T.PlaneGeometry(.06,.06),M.keys);keys.rotation.x=-Math.PI/2;keys.position.set(0,.016,.03);term.add(tb,ts,keys);room.add(term);
        cbox(.16,.1,.2,BLK,px-.32,1.09,ckZ-.15);cbox(.1,.02,.02,WHT,px-.32,1.15,ckZ-.06);cbox(.06,.06,.06,BLK,ckX-ckW/2+.3,1.07,ckZ+.15);S.cashier=[px-.55,ckZ-.85];}
      label('Каса',ckX,1.5,ckZ);
      {const tz0=ckZ-.9,tz1=Math.min(ckZ+.6,hd-.25),tl=tz1-tz0;if(tl>.8){blk(-hw+.16,(tz0+tz1)/2,.34,tl);box(.3,2.2,tl,M.oak,-hw+.16,1.1,(tz0+tz1)/2);for(let lv=0;lv<7;lv++)box(.34,.015,tl,M.oak,-hw+.18,.22+lv*.27,(tz0+tz1)/2,false);for(let lv=0;lv<7;lv++)for(let z=tz0+.06;z<tz1-.05;z+=.1*dens)put('pack',-hw+.33,.23+lv*.27,z,.055,.09,.024,pick_(['#c9a24a','#b7b7b7','#274a7a','#8c3b2e','#e6e2d8','#3a3a3a','#2f6fb5']));label('Цигари',-hw+.35,2.45,(tz0+tz1)/2);
        cgeo(new T.CylinderGeometry(.065,.065,.48,8),'#c41e1e',-hw+.16,.65,tz0-.25);cgeo(new T.CylinderGeometry(.03,.05,.08,8),BLK,-hw+.16,.93,tz0-.25);cbox(.06,.05,.16,BLK,-hw+.1,.7,tz0-.25);}}
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
        LV.forEach(y=>{box(wl,.03,.4,M.oak,xm,yF+y,-hd+.2,false);rail(xm,yF+y+.01,-hd+.405,wl,0);for(let x=x0+.1;x<x1-.08;x+=.18*dens){if(Math.random()<.05)continue;put('bottle',x,yF+y+.015,-hd+.2,.085,.3,.085,pick_(WINE));}});
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
          [.28,.66,1.04,1.42,1.78].forEach((y,li)=>{for(let d=0;d<1;d++){const px=xf+side*.16;for(let z=zz-.27;z<zz+.27;z+=(li<2?.16:.15)*dens){if(li<2)put('bottle',px,y+.01,z,.075,.27,.075,pick_(DRINK));else if(li<4)put('can',px,y+.01,z,.064,.12,.064,pick_(CANS));else put('carton',px,y+.01,z,.08,.18,.08,pick_(['#f4f2ec','#2f6fb5','#3c7a3e','#c8382e']));}}});}
        return n;};
      // gondolas: oak, white price rails, products by zone (spirits / sweets / coffee-tea-snacks); burgundy end panels, promo end-caps by the till
      const xs=[];if(len>1.3){for(let x=-hw+2.7;x<=hw-2.6;x+=2.6){if(shape==='L'&&x<-hw+lw+1.4)continue;xs.push(x);}}
      const zc=(zTop+zBot)/2,LV=[.3,.68,1.06,1.44],ZL={spirits:'Спиртни напитки',sweets:'Сладки · снаксове',coffee:'Кафе · чай'},done={};
      const lz0=shape==='L'?-hd+ld+.3:zTop+.15,lz1=zBot-.3,nl=coolers(-1,lz0,lz1);if(nl)label('Хладилни витрини · напитки',-hw+1.6,2.5,lz0+nl*.37);
      xs.forEach((x,gi)=>{const zone=['spirits','sweets','coffee'][gi%3];
        if(gi===0&&nl&&xs.length>2){coolers(1,lz0,lz1,x+.5,[0]);cbox(.06,2.1,nl*.74+.1,B,x+.5,1.05,lz0+nl*.37);box(.98,1.7,.03,M.oak,x,.85,zTop+.02,false);return;}
        blk(x,zc,1.0,len+.1);ao(x-.48,zc,len,-1,0);ao(x+.48,zc,len,1,0);ao(x,zBot+.04,.96,0,1);
        if(zone==='spirits'){blk(x,zTop-.35,.96,.6);cbox(.92,1.6,.5,B,x,.8,zTop-.33);[.5,1.0].forEach(y=>cbox(.92,.03,.32,B,x,y,zTop-.72));[.52,1.02,1.6].forEach(y=>{for(let i=0;i<5;i++)put('bottle',x-.34+i*.17,y,zTop-.74+(y>1.5?.2:0),.085,.3,.085,pick_(SPIRIT));});}
        if(gi===1){cgeo(new T.CylinderGeometry(.065,.065,.48,8),'#c41e1e',x+.6,.24,zBot+.25);cgeo(new T.CylinderGeometry(.03,.05,.08,8),BLK,x+.6,.52,zBot+.25);}for(let z=zTop+.6;z<zBot-.5;z+=1){face(x-.5,z,-1,0,zone);face(x+.5,z,1,0,zone);}
        box(.08,1.7,len,M.oak,x,.85,zc);box(.96,.12,len,M.oak,x,.06,zc);box(.96,.05,len+.04,M.oak,x,1.72,zc,false);const nu=Math.max(1,Math.round(len/1.2));for(let i=0;i<=nu;i++)box(.96,1.7,.03,M.oak,x,.85,zTop+i*len/nu,false);
        cbox(.98,1.74,.04,B,x,.87,zBot+.02);cbox(.98,1.74,.04,B,x,.87,zTop-.02);
        LV.forEach((y,li)=>{box(.92,.03,len,M.oak,x,y,zc,false);
          for(const sd_ of [-1,1]){rail(x+sd_*.47,y+.01,zc,len,sd_>0?Math.PI/2:-Math.PI/2);const px=x+sd_*.3;
            if(zone==='spirits'){if(li===1||li===2){for(let z=zTop+.14;z<zBot-.12;z+=.2*dens)if(Math.random()>.06)put('carton',px,y+.015,z,.12,.22,.1,pick_(['#c8382e','#1b1917','#3a2410','#e0b23a','#5a1a22']));}else{for(let z=zTop+.12;z<zBot-.1;z+=.17*dens)if(Math.random()>.06)put('bottle',px,y+.015,z,.085,.3,.085,pick_(SPIRIT));}}
            else if(zone==='sweets'){if(li<2){for(let z=zTop+.12;z<zBot-.1;z+=.2*dens)if(Math.random()>.06)put('pack',px,y+.015,z,.1,.15,.06,pick_(SWEET));}else{for(let z=zTop+.14;z<zBot-.12;z+=.2*dens)if(Math.random()>.06)put('carton',px,y+.015,z,.12,.18,.09,pick_(BISC));}}
            else{if(li<2){for(let z=zTop+.12;z<zBot-.1;z+=.17*dens)if(Math.random()>.06)put('carton',px,y+.015,z,.09,.2,.07,pick_(COFFEE));}else if(li===2){for(let z=zTop+.14;z<zBot-.12;z+=.16*dens)if(Math.random()>.06)put('bag',px+sd_*.05,y+.015,z,.05,.24,.14,pick_(CHIPS));}else{for(let z=zTop+.12;z<zBot-.1;z+=.18*dens)if(Math.random()>.06)put('pack',px,y+.015,z,.1,.08,.06,pick_(TEA));}}}});
        if(!done[zone]){done[zone]=1;label(ZL[zone],x,1.95,zc+((gi%3)-1)*Math.min(2,len*.3));}});
      // promo end-caps (Coca-Cola, Milka) on the two gondolas nearest the till
      {const order=xs.map((x,i)=>[Math.abs(x-doorX),i]).filter(([,i])=>xs[i]>ckX+ckW/2+1.7).sort((a,b)=>a[0]-b[0]).slice(0,2);order.forEach(([,i],k)=>{const x=xs[i],pz=zBot+.35,red=k===0;blk(x,pz,.92,.52);cbox(.9,1.45,.5,red?'#d3232a':'#5b2d8e',x,.725+.02,pz);
          const hb=new T.Mesh(new T.PlaneGeometry(.9,.28),red?M.headCoke:M.milka);hb.position.set(x,1.62,pz+.26);room.add(hb);cbox(.02,.4,.02,BLK,x,1.5,pz+.24);
          for(let i=0;i<12;i++){const cx=x-.33+(i%4)*.22,cz=pz-.15+((i/4)|0)*.15;if(red)put('bottle',cx,1.47,cz,.085,.3,.085,pick_(['#2a1a10','#dfe9ee','#f28c28']));else put('pack',cx,1.47,cz,.1,.15,.06,pick_(['#5b2d8e','#6b3fa0','#e8e2d6']));}});}
      {const rz0=Math.max(zTop+.15,store_?-hd+sd+.35:-hd+.3),rz1=Math.min(zBot-.3,rz0+4.5);coolers(1,rz0,rz1,null,[1,2]);
        // snack wall (chips) on the left wall between the coolers and the till
        const sz0=lz0+(nl?nl*.74+.3:0),sz1=ckZ-1.3,sl=sz1-sz0;if(sl>1.2&&A>=60){blk(-hw+.24,(sz0+sz1)/2,.5,sl);for(let z=sz0+.5;z<sz1-.4;z+=1)face(-hw+.48,z,1,0,'snack');box(.42,1.8,sl,M.oak,-hw+.22,.9,(sz0+sz1)/2);for(let lv=0;lv<5;lv++){box(.4,.02,sl,M.oak,-hw+.24,.05+lv*.34,(sz0+sz1)/2,false);rail(-hw+.44,.07+lv*.34,(sz0+sz1)/2,sl,Math.PI/2);for(let z=sz0+.1;z<sz1-.1;z+=.19*dens)put('bag',-hw+.46,.07+lv*.34,z,.05,.24,.14,pick_(CHIPS));}
          if(!done.sweets)label('Сладки · снаксове',-hw+.5,2.05,(sz0+sz1)/2);const po=new T.Mesh(new T.PlaneGeometry(.7,1.0),M.poster);po.rotation.y=Math.PI/2;po.position.set(-hw+.02,2.4,(sz0+sz1)/2);room.add(po);}}
      // step down to the wine corner: ramp with a white edge stripe and stainless handrails at each aisle crossing
      const aisles=[];if(xs.length){for(let i=0;i<xs.length-1;i++)aisles.push((xs[i]+xs[i+1])/2);if(xs[0]-1.1>-hw+.3)aisles.unshift(xs[0]-1.15);if(xs[xs.length-1]+1.1<hw-.3)aisles.push(xs[xs.length-1]+1.15);}
      const aR=aisles.length?aisles[aisles.length-1]:-hw*.5,aL=aisles.length?aisles[0]:-hw*.5;
      if(wine){const openL=(shape==='L'?-hw+lw+t:-hw)+.95,openR=(store_?hw-sw-t:hw)-.95,cand=aisles.filter(x=>x>openL&&x<openR),ramps=cand.length?(cand[0]===cand[cand.length-1]?[cand[0]]:[cand[0],cand[cand.length-1]]):[(openL+openR)/2];S.ramps=ramps;const rs=ramps.slice().sort((a,b)=>a-b);let xr=-hw;rs.forEach(rx=>{if(rx-.8>xr)blk((xr+rx-.8)/2,zW,rx-.8-xr,.16,true);xr=rx+.8;});if(hw>xr)blk((xr+hw)/2,zW,hw-xr,.16,true);
        ramps.forEach(rx=>{for(const s of [-1,1])blk(rx+s*.8,zW,.06,1.3,true);const a=Math.atan2(.12,1.05);const rg=new T.BoxGeometry(1.56,.04,1.12);rg.rotateX(-a);rg.translate(rx,-.08,zW-.02);vacc.push([rg,'#4e5052']);cbox(1.56,.006,.08,'#d8d4c8',rx,.004,zW+.55);
          for(const s of [-1,1]){const px=rx+s*.8;cgeo(new T.CylinderGeometry(.018,.018,.95,6),STEEL,px,.475,zW+.62,true);cgeo(new T.CylinderGeometry(.018,.018,.95,6),STEEL,px,yF+.475,zW-.62,true);
            [.32,.6,.9].forEach(h=>{const bg=new T.CylinderGeometry(.014,.014,1.26,6);bg.rotateX(Math.PI/2-Math.atan2(.12,1.24));cgeo(bg,STEEL,px,h-.06,zW,true);});}});}
      label('Вход',doorX,2.75,hd+.1);
      // ceiling: LED strips over each aisle, AC grilles, black track spots, a few real point lights
      {const sl=len+1.6;aisles.forEach(ax=>box(.09,.025,sl,M.led,ax,Hh-.02,zc+.3,false));box(W*.7,.025,.09,M.led,0,Hh-.02,hd-1.3,false);box(W*.6,.025,.09,M.led,0,Hh-.02,zTop-.9,false);
        const gz=[zTop+1.2,zBot-1.2];if(D>10)gz.push(zc);gz.forEach(z=>box(.6,.03,.6,M.grille,W*.1,Hh-.02,z,false));
        const spots=(x,z,L)=>{cbox(.04,.03,L,BLK,x,Hh-.03,z);for(let i=0;i<3;i++){const sg=new T.CylinderGeometry(.045,.04,.13,8);sg.rotateX(.6);cgeo(sg,BLK,x,Hh-.13,z-L/2+.3+i*(L-.6)/2);}};spots(hw*.45,zW+.9,3);spots(doorX-1.4,hd-2.1,2.4);
        const NL=phone?2:(A>150?4:3),nx=Math.max(1,Math.round(Math.sqrt(NL*W/D))),ny=Math.max(1,Math.ceil(NL/nx));S.lights=[];
        for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){if(S.lights.length>=NL)break;const l=new T.PointLight(0xfff4e2,.22,Math.max(W,D)*.7,2);l.position.set(-hw+W*(i+.5)/nx,Hh-.15,-hd+D*(j+.5)/ny);room.add(l);S.lights.push(l);}
        const lt=new T.PointLight(0xd8ecff,.3,Math.max(4,len*.8),1.8);lt.position.set(-hw+1,1.5,zTop+1.8);room.add(lt);S.coolLight=lt;}
      // diffusers
      const U=unitsFor(A);
      U.forEach((u,i)=>{
        let p,d;
        if(u.at==='D'){p=[doorX,Math.min(2.34+.2,Hh-.4),hd-.05];d=[0,0,-1];}
        else if(u.at==='L'){p=[-hw+.09,yM,D*u.f];d=[1,0,0];}
        else if(u.at==='B'){p=[W*u.f,Math.min(yF+2.7,Hh-.35),-hd+.09];d=[0,0,1];}
        else{p=[hw-sw/2,yM,-hd+sd+t/2+.05];d=[0,0,1];}
        const g=new T.Group();g.position.set(p[0],p[1],p[2]);g.rotation.y=Math.atan2(d[0],d[2]);
        const PL=plan().mdl==='PL',white=plan().col==='w',sc=PL?1.5:1,bw=.19*sc,bh=.26*sc,bd=.07*sc;
        const shell=white?M.unitW:M.unit;
        const body=new T.Mesh(mergeGeos([roundedBox(bw,bh,bd,.035*sc).translate(0,0,bd/2),new T.CylinderGeometry(.012*sc,.012*sc,.03,8).rotateX(Math.PI/2).translate(bw*.3,bh*.38,bd+.008)]),shell);body.castShadow=true;
        const grille=new T.Mesh(new T.PlaneGeometry(bw*.62,bh*.3),white?M.grW:M.grB);grille.position.set(0,-bh*.28,bd+.002);
        const badge=new T.Mesh(new T.PlaneGeometry(bw*.34,bw*.34),M.badge);badge.position.set(0,bh*.16,bd+.002);
        const led=new T.Group();led.add(new T.Mesh(mergeColored([[new T.SphereGeometry(.008*sc,6,5).translate(-bw*.34,bh*.22,bd+.006),'#ffc766'],[new T.SphereGeometry(.008*sc,6,5).translate(-bw*.34,bh*.12,bd+.006),'#4fb8d0']]),M.ledDot));
        const oval=new T.Mesh(new T.CircleGeometry(.028*sc,14),M.led);oval.scale.set(1,1.45,1);oval.position.set(0,bh*.05,bd+.003);led.add(oval);
        const glow=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));glow.position.set(0,-bh*.62,bd*.6);glow.scale.set(.22*sc,.12*sc,1);led.add(glow);
        badge.position.set(0,bh*.3,bd+.002);badge.scale.setScalar(.7);
        g.add(body,grille,badge,led);room.add(g);
        // power cable: from the unit down the door frame to a socket (door-mounted unit), or straight down the wall
        if(u.at==='D'){const cx=doorX+doorW/2+.06;cbox(cx-doorX,.012,.012,'#111',(doorX+cx)/2,p[1]-bh/2-.02,hd-.02);cbox(.012,p[1]-bh/2-.02-.3,.012,'#111',cx,(p[1]-bh/2-.02+.3)/2,hd-.02);cbox(.07,.07,.02,WHT,cx,.3,hd-.02);}
        else{cbox(.012,.5,.012,'#111',p[0]+d[0]*.02,p[1]-bh/2-.27,p[2]+d[2]*.02);}
        const plume=new T.Sprite(new T.SpriteMaterial({map:spr,color:0xffe2a8,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending}));plume.position.set(p[0]+d[0]*.17,p[1]+.55,p[2]+d[2]*.17);plume.scale.set(.5,.7,1);room.add(plume);
        const Rr=Math.sqrt(A/U.length/Math.PI);const wm=new T.MeshBasicMaterial({color:0xd4af63,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});wm.userData.own=true;const wave=new T.Mesh(new T.RingGeometry(.94,1,48),wm);wave.rotation.x=-Math.PI/2;wave.position.set(p[0]+d[0]*Math.min(Rr,2.2),.02,p[2]+d[2]*Math.min(Rr,2.2));room.add(wave);
        const light=new T.PointLight(0xffc56a,.35,6,2);light.position.set(p[0]+d[0]*.5,p[1]-.2,p[2]+d[2]*.5);room.add(light);
        const pin=document.createElement('button');pin.type='button';pin.className='pin';pin.innerHTML='<b>'+(i+1)+'</b><span>Дифузер</span><i>'+(u.title||(PL?'Prime Lux':'Plug’n Go'))+'</i>';pin.setAttribute('aria-label','Дифузер '+(i+1)+' ('+(u.title||'')+'): '+u.zone);
        pin.addEventListener('click',e=>{e.stopPropagation();pick(i);});ovl.appendChild(pin);
        overlay.push({el:pin,v:new T.Vector3(p[0]+d[0]*.2,p[1]+.55,p[2]+d[2]*.2),kind:'pin'});
        S.units.push({p,d,info:u,led,light,plume,wave,R:Rr,ph:i/U.length,pin});pin.classList.toggle('pl',PL);
      });
      flush();
      if(strips.length){const sm_=new T.Mesh(mergeGeos(strips),M.rail);room.add(sm_);}
      if(aoAcc.length){const am=new T.Mesh(mergeGeos(aoAcc),M.ao);am.renderOrder=1;room.add(am);}
      if(glassAcc.length){const gm=new T.Mesh(mergeGeos(glassAcc),M.glassC);room.add(gm);}
      headAcc.forEach((h,i)=>{if(h.length)room.add(new T.Mesh(mergeGeos(h),[M.headCoke,M.headBeer,M.headBurg][i]));});
      // navigation grid from the registered props; entry/exit on the door apron, queue slots beside the till
      nav=navBuild(W,D,doorX,doorW);const nf=(x,z)=>{const q=nav.free(nav.G35,...nav.toCell(x,z))?nav.toCell(x,z):null;const cc=q||(()=>{for(let r=1;r<8;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){const [i,j]=nav.toCell(x,z);if(nav.free(nav.G35,i+di,j+dj))return [i+di,j+dj];}return nav.toCell(x,z);})();return nav.toWorld(cc[0],cc[1]);};
      nav.entry=nf(doorX+.2,hd+1.2);nav.exit=nf(doorX-.2,hd+1.2);const seen={};for(let k=0;k<5;k++){const q=nf(ckX+ckW/2+.6,ckZ+.1-k*PARAMS.queueGap),key=q.join();if(!seen[key]){seen[key]=1;nav.queue.push(q);}}qOcc.length=0;nav.queue.forEach(()=>qOcc.push(null));
      nav.stack=nf(doorX-doorW/2-.35,hd-1.1);
      if(A>=60){nav.G35X=nav.G35.slice();nav.queue.forEach(q=>{const [i,j]=nav.toCell(q[0],q[1]);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows)nav.G35X[jj*nav.cols+ii]=1;}});}
      {const cb=new T.Mesh(mergeColored([[new T.CylinderGeometry(.15,.12,.2,8,1,true),'#d0212b'],[new T.CircleGeometry(.12,8).rotateX(Math.PI/2).translate(0,-.1,0),'#d0212b'],[new T.TorusGeometry(.14,.008,4,10,Math.PI).translate(0,.1,0),'#3a1a14']]),M.vc2);cb.position.set(ckX+ckW/2-.05,1.14,ckZ+.15);cb.visible=false;room.add(cb);S.counterBasket=cb;
        const bp=new T.Mesh(new T.BoxGeometry(.03,.03,.03),M.led);bp.position.set(ckX+ckW/2-.2,1.07,ckZ-.16);bp.visible=false;room.add(bp);S.beep=bp;}
      S.mainX=aR;S.zTop=zTop;flowDirty=true;
      {const c=nav.browse.filter(x=>x.tag==='coffee'||x.tag==='sweets');S.restock=c.length?c[(Math.random()*c.length)|0]:null;if(S.restock){const [i,j]=nav.toCell(S.restock.p[0],S.restock.p[1]);[nav.G0,nav.G35,nav.G55,nav.G35X].forEach(g=>{for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<nav.cols&&jj<nav.rows&&(g!==nav.G0||(di===0&&dj===0)))g[jj*nav.cols+ii]=1;}});nav.browse=nav.browse.filter(x=>x!==S.restock);}}
      flowLine=new T.LineSegments(new T.BufferGeometry(),flowMat);flowLine.visible=$('#lyFlow').checked;room.add(flowLine);
      if($('#lyCover').checked)makeHeat();
      // light rig
      key.position.set(-W*.25,Hh*4.2,D*.4);key.target.position.set(0,0,0);const sc=key.shadow.camera,R=Math.max(W,D)*.85;sc.left=-R;sc.right=R;sc.top=R;sc.bottom=-R;sc.near=.5;sc.far=Hh*10+Math.max(W,D)*4;sc.updateProjectionMatrix();
      recolor();labelsVis();M.badge.map=badgeTex();M.badge.needsUpdate=true;
      pown.fill(-1);pAl.fill(0);emitAcc=0;
      go(view.name==='free'?'persp':view.name,true);try{renderer.compile(scene,camera);}catch(e){}
      if(window.__perf)window.__perf.build0=performance.now()-t0;
      // progressive fill: products over the next frames, then the particle warm-up, then people
      later(()=>{if(FAM.bottle.length)instanced(GEO.bottle,FAM.bottle,false,SPIRIT,M.bottle);if(FAM.can.length)instanced(GEO.can,FAM.can,false,CANS,M.can);
        later(()=>{if(FAM.carton.length)instanced(GEO.box,FAM.carton,false,BISC,M.carton);if(FAM.pack.length)instanced(GEO.box,FAM.pack,false,SWEET,M.pack);if(FAM.bag.length)instanced(GEO.box,FAM.bag,false,CHIPS,M.bag);
          later(()=>{const on=sysOn(state.t);for(let i=0;i<30*22;i++)stepP(1/30,on,true);pg.attributes.position.needsUpdate=true;pg.attributes.alpha.needsUpdate=true;
            later(()=>castPeople(A,phone));});});});
    }
    // coverage heat is built only when the layer is switched on
    function makeHeat(){const W=S.W,D=S.D;
      const cols=Math.max(2,Math.ceil(W)),rows=Math.max(2,Math.ceil(D)),data=new Uint8Array(cols*rows*4),hacc=new Float32Array(cols*rows);
      const tex=new T.DataTexture(data,cols,rows,T.RGBAFormat);tex.magFilter=tex.minFilter=T.LinearFilter;tex.generateMipmaps=false;tex.encoding=T.sRGBEncoding;tex.needsUpdate=true;
      const hmm=new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});hmm.userData.own=true;const hm_=new T.Mesh(new T.PlaneGeometry(W,D),hmm);hm_.rotation.x=-Math.PI/2;hm_.position.y=.012;hm_.renderOrder=2;hm_.visible=$('#lyCover').checked;room.add(hm_);
      heat={cols,rows,data,acc:hacc,tex,mesh:hm_,timer:0};}
    function castPeople(A,phone){
      const nP=Math.min(phone?4:8,A<90?4:(A<150?6:(A<220?7:8)));
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
      const one=s=>{const g=(s.p&&gltfPerson(s.p))||s.mk();if(s.p){g.userData.fem=!!s.p.fem;}if(s.follow!=null&&s.follow<nP&&people[s.follow])people[s.follow].userData.partner=people.length;g.userData.ph=Math.random()*6.28;g.userData.sp=(g.userData.elder?rr(PARAMS.speed.elder):rr(PARAMS.speed.adult))*PARAMS.speedScale;g.userData.phone=Math.random()<PARAMS.phoneP;if(s.follow!=null&&s.follow<nP){g.userData.follow=s.follow;g.userData.gap=s.gap||.9;}
        if(s.stroller){const st=makeStroller();g.userData.stroller=st;room.add(st);g.userData.basket.visible=false;g.userData.pushing=true;}
        room.add(g);people.push(g);};
      if(S.restock&&!phone){const st=gltfPerson({staff:true,h:1.76,fem:false})||mkRandom({h:1.76,hairStyle:'crop',hair:0x3b2a1a,vest:0x1e7a3c,top:0x8a8a8a,tshirt:true,bot:0x1f3a2a,skin:0xd9ae8a,shoe:0x14110e});const p=S.restock.p;st.position.set(p[0],floorY(p[0],p[1]),p[1]);st.rotation.y=Math.atan2(-S.restock.f[0],-S.restock.f[1]);st.userData.state='restock';st.userData.restocker=true;st.userData.blend=0;st.userData.basket.visible=false;
        const bx=new T.Mesh(mergeColored([[new T.BoxGeometry(.36,.24,.28),'#b08a5a']]),M.vc2);if(st.userData.torso){bx.position.set(0,.02,.34);st.userData.torso.add(bx);}else{bx.position.set(0,.55,.35);st.add(bx);}room.add(st);extras.push(st);}
      // cashier first (always visible at the till), then the customers three per frame
      const [cx,cz]=S.cashier;const cs=gltfPerson({staff:true,h:1.72})||makePerson(8,{h:1.74,hairStyle:'crop',hair:0x1a1410,vest:0x1e7a3c,top:0x8a8a8a,tshirt:true,bot:0x1f3a2a,cap:0x1b1917,skin:0xe8c4a4,shoe:0x14110e,iris:'#3a2a1a'});cs.position.set(cx,0,cz);cs.rotation.y=Math.PI*.5+.6;cs.userData.state='queue';cs.userData.blend=0;cs.userData.ph=Math.random()*6.28;cs.userData.basket.visible=false;cs.userData.cashier=true;room.add(cs);extras.push(cs);
      const step=i=>{spec.slice(i,i+3).forEach(one);if(i+3<spec.length)later(()=>step(i+3));else if(window.__perf&&!window.__perf.done)window.__perf.done=performance.now();};
      step(0);
    }

    let emitAcc=0,cursor=0;
    function emit(i,u){const e=S.units[u],p=e.p,d=e.d,j=i*3;
      pPos[j]=p[0]+d[0]*.17;pPos[j+1]=p[1]+.33;pPos[j+2]=p[2]+d[2]*.17;
      const sp=.9+Math.random()*1.1,l=(Math.random()-.5)*1.1;
      pv[j]=d[0]*sp*.8+(d[2]?l:l*.25);pv[j+1]=.35+Math.random()*.45;pv[j+2]=d[2]*sp*.8+(d[0]?l:l*.25);
      page[i]=0;plife[i]=18+Math.random()*10;pown[i]=u;}
    function stepP(dt,on,warm){
      const hw=S.hw-.06,hd=S.hd-.06,Hh=S.H,n=S.units.length;if(!n)return;
      if(on){emitAcc+=PN/23*dt;let k=Math.floor(emitAcc);emitAcc-=k;let tries=0;while(k>0&&tries<PN){cursor=(cursor+1)%PN;tries++;if(pown[cursor]<0){emit(cursor,cursor%n);k--;}}}
      const drag=Math.exp(-1.05*dt),nz=4*Math.sqrt(dt);
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
        const k2=page[i]/plife[i];pAl[i]=Math.min(1,page[i]/.8)*(1-k2)*(1-k2);
      }
      if(!warm){pg.attributes.position.needsUpdate=true;pg.attributes.alpha.needsUpdate=true;}
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
      edgeMat.color=lin(c('--gold-soft'));edgeMat.opacity=dark?.4:.7;gridMat.color=lin(dark?c('--gold-soft'):c('--line'));gridMat.opacity=dark?.16:.5;flowMat.color=lin(c('--gold'));
      const gh=(c('--gold')||'#D4AF63').replace('#','');gold=[parseInt(gh.slice(0,2),16),parseInt(gh.slice(2,4),16),parseInt(gh.slice(4,6),16)];
      pm.uniforms.uColor.value=new T.Color(c('--gold'));pm.blending=dark?T.AdditiveBlending:T.NormalBlending;pm.uniforms.uOp.value=dark?.28:.2;pm.needsUpdate=true;
      hemi.intensity=dark?.42:.5;key.intensity=dark?.5:.42;amb.intensity=dark?.14:.22;const fc=lin(c('--stage-b')||'#090705');scene.fog=new T.Fog(fc,Math.max(S.W||10,S.D||10)*1.3,Math.max(S.W||10,S.D||10)*4.2);S.units&&S.units.forEach(u=>{u.plume.material.blending=dark?T.AdditiveBlending:T.NormalBlending;u.plume.material.color.copy(dark?new T.Color(c('--gold')).lerp(new T.Color('#ffffff'),.55):new T.Color(c('--gold-soft')));u.wave.material.color.set(c('--gold'));u.plume.material.needsUpdate=true;});
    }
    themeSubs.push(()=>{recolor();kick();});

    // camera
    const view={name:'persp',theta:.62,phi:.98,r:20,tx:0,ty:1,tz:0};let tween=null,idle=0,drag=null,walkSnap=false;
    function presets(name){const {W,D}=S,Hh=S.H,m=Math.max(W,D);
      if(name==='plan')return {theta:0,phi:.07,r:m*1.55+5,tx:0,ty:0,tz:0};
      if(name==='walk'){return null;}
      if(name==='door'){const c=[S.door.x-.95,1.9,S.hd+1.9],t=[S.door.x*.35-W*.08,1.0,-S.hd*.35];const dx=c[0]-t[0],dy=c[1]-t[1],dz=c[2]-t[2],r=Math.hypot(dx,dy,dz);return {theta:Math.atan2(dx,dz),phi:Math.acos(dy/r),r,tx:t[0],ty:t[1],tz:t[2]};}
      return {theta:.62,phi:.98,r:(m*1.28+4.5)*(stage.clientWidth<560?1.3:1),tx:0,ty:Hh*.25,tz:0};}
    function apply(){const s=Math.sin(view.phi);camera.position.set(view.tx+view.r*s*Math.sin(view.theta),view.ty+view.r*Math.cos(view.phi),view.tz+view.r*s*Math.cos(view.theta));camera.lookAt(view.tx,view.ty,view.tz);}
    function go(name,instant){
      view.name=name;if(name==='walk')walkSnap=true;$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
      const p=presets(name);if(!p){tween=null;kick();return;}if(instant||reduce){Object.assign(view,p);tween=null;apply();kick();return;}
      const from={theta:view.theta,phi:view.phi,r:view.r,tx:view.tx,ty:view.ty,tz:view.tz};let dth=p.theta-from.theta;dth=((dth+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
      tween={from,to:{...p,theta:from.theta+dth},t:0,dur:go.dur||1.35};go.dur=0;kick();
    }
    $$('.views [data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
    $$('.views [data-zoom]').forEach(b=>b.addEventListener('click',()=>{const m=Math.max(S.W,S.D);view.r=clamp(view.r*(+b.dataset.zoom>0?1.18:.85),m*.35,m*3.2+10);tween=null;apply();idle=0;kick();}));
    const touches=new Map();let pinch0=0,r0=0;stage.addEventListener('touchstart',e=>{if(e.touches.length===2)e.preventDefault();},{passive:false});stage.addEventListener('touchmove',e=>{if(e.touches.length===2)e.preventDefault();},{passive:false});
    stage.addEventListener('pointerdown',e=>{if(e.target.closest('button,label,input,select,.hud-card'))return;
      if(e.pointerType==='touch'){touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const [a,b]=[...touches.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);r0=view.r;drag=null;return;}}
      drag={x:e.clientX,y:e.clientY,id:e.pointerId};stage.classList.add('drag');try{stage.setPointerCapture(e.pointerId);}catch(_){}});
    stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&touches.has(e.pointerId)){touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const [a,b]=[...touches.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch0>0){const m=Math.max(S.W,S.D);view.r=clamp(r0*pinch0/d,m*.35,m*3.2+10);tween=null;apply();kick();}return;}}});
    const endT=e=>{if(e.pointerType==='touch'){touches.delete(e.pointerId);if(touches.size<2)pinch0=0;}};stage.addEventListener('pointerup',endT);stage.addEventListener('pointercancel',endT);
    stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(view.name==='walk'){view.name='free';apply();}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
      view.theta-=dx*.0065;if(e.pointerType!=='touch')view.phi=clamp(view.phi-dy*.005,.07,1.5);tween=null;idle=0;if(view.name!=='free'){view.name='free';$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}apply();kick();});
    const end=()=>{drag=null;stage.classList.remove('drag');};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
    stage.addEventListener('wheel',e=>{e.preventDefault();const m=Math.max(S.W,S.D);view.r=clamp(view.r*Math.exp(e.deltaY*.0025),m*.35,m*3.2+10);tween=null;apply();kick();},{passive:false});

    // layers
    $('#lyCover').addEventListener('change',e=>{if(!heat&&e.target.checked&&S.W)makeHeat();if(heat)heat.mesh.visible=e.target.checked;kick();});
    $('#lyFlow').addEventListener('change',e=>{if(flowLine)flowLine.visible=e.target.checked;kick();});
    function labelsVis(){const on=$('#lyLabels').checked;overlay.forEach(o=>{if(o.kind==='lbl')o.el.hidden=!on;});}
    $('#lyLabels').addEventListener('change',()=>{labelsVis();kick();});

    // size
    let w0=0,h0=0;
    function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||(w===w0&&h===h0))return;w0=w;h0=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();pm.uniforms.uScale.value=h*renderer.getPixelRatio()/2/Math.tan(camera.fov*Math.PI/360)*.5;kick();}
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);else addEventListener('resize',resize);

    // loop
    let vis=false,raf=0,last=0,lightK=1,hover=false,fno=0;const v3=new T.Vector3();
    stage.addEventListener('pointerenter',()=>{hover=true;kick();});stage.addEventListener('pointerleave',()=>{hover=false;});
    function frame(now){
      raf=0;if(!vis||document.hidden)return;
      if(window.__klBusy){raf=requestAnimationFrame(frame);return;} // някой подписва: пауза на рендера
      {const quiet=!isOpen(state.t)&&!people.some(p=>p.visible);if(!hover&&!drag&&!tween&&(quiet?((fno++)%4)!==0:((fno++)&1))){raf=requestAnimationFrame(frame);return;}} // idle: 30 fps, closed store: 15 fps
      const dt=Math.min(.05,(now-(last||now))/1000);last=now;
      if(state.playing){state.t+=dt*34;if(state.t>=1380){state.t=1380;state.playing=false;}paintClock();}
      if(tween){tween.t+=dt/tween.dur;const k=tween.t>=1?1:(tween.t<.5?4*tween.t**3:1-Math.pow(-2*tween.t+2,3)/2);['theta','phi','r','tx','ty','tz'].forEach(p=>view[p]=tween.from[p]+(tween.to[p]-tween.from[p])*k);apply();if(tween.t>=1)tween=null;}
      else if(!drag&&!reduce&&view.name==='persp'){idle+=dt;if(idle>3){view.theta+=dt*.045;apply();}}
      if(view.name==='walk'&&people.length){let p=(camSub&&camSub.parent&&camSub.visible&&camSub.userData.state==='walk')?camSub:null;const inside=g=>g.visible&&g.parent&&g.position.z<S.hd-1.2&&Math.abs(g.position.x)<S.hw-.2;const browsing=g=>{const u=g.userData,l=u.visit&&u.visit[u.legI];return !!l&&l.kind==='browse';};if(p&&(!inside(p)||!browsing(p)))p=null;if(!p){const w=people.filter(g=>inside(g)&&browsing(g)&&g.userData.follow==null&&g.userData.state==='walk'&&!g.userData.turning&&Math.cos(g.rotation.y)<.3);if(w.length){w.sort((a,b)=>a.position.distanceToSquared(camera.position)-b.position.distanceToSquared(camera.position));p=w[0];}}if(p)camSub=p;p=camSub&&camSub.parent&&inside(camSub)?camSub:(people.find(g=>inside(g)&&g.userData.follow==null)||people.find(inside)||people[0]);const ud=p.userData;if(ud.state==='walk'&&!ud.turning&&inside(p))ud.camAng=p.rotation.y;else ud.camAng=Math.atan2((S.mainX||0)*.3-p.position.x,-S.hd*.3-p.position.z);const fw=new T.Vector3(0,0,1).applyAxisAngle(new T.Vector3(0,1,0),ud.camAng),side=new T.Vector3(fw.z,0,-fw.x);
        let want=null;for(let d=3.2;d>=1.2;d-=.2){const x=p.position.x-fw.x*d+side.x*.5*(d/3.2),z=p.position.z-fw.z*d+side.z*.5*(d/3.2);const cc=nav?nav.toCell(x,z):null;if(z<S.hd-.35&&Math.abs(x)<S.hw-.3&&(!nav||nav.free(nav.G0,cc[0],cc[1]))){want=new T.Vector3(x,1.55,z);break;}}
        if(!want)want=new T.Vector3(p.position.x,1.55,p.position.z);camera.position.lerp(want,walkSnap?1:Math.min(1,dt*2));walkSnap=false;const tgt=new T.Vector3(p.position.x+fw.x*3.0,1.42,p.position.z+fw.z*3.0);camera.lookAt(tgt);}
      const on=sysOn(state.t),open=isOpen(state.t);
      lightK+=((open?1:.45)-lightK)*Math.min(1,dt*3);M.cool.emissiveIntensity=.5*lightK;
      S.units.forEach(u=>{const tgt=on?1:0;u.light.intensity+=(tgt*.35-u.light.intensity)*Math.min(1,dt*4);u.led.visible=on;u.pin.classList.toggle('off',!on);});
      M.led.color.setScalar(.3+.7*clamp((lightK-.45)/.55,0,1));if(S.lights)S.lights.forEach(l=>{l.intensity=.22*lightK;});if(S.coolLight)S.coolLight.intensity=.3*(.4+.6*lightK);
      if(S.sign){const sm=open?M.signOpen:M.signClosed;if(S.sign.material!==sm){S.sign.material=sm;S.sign2.material=sm;}}
      extras.forEach(e=>{if(!e.userData.restocker)e.visible=open;if(e.visible)poseAny(e,now/1000,dt,0);});if(GL()){window.KL_GLTF.update(dt);gltfHeads(dt);}
      const tt=now/1000;S.units.forEach(u=>{const pu=.85+.15*Math.sin(tt*3+u.ph*6);u.plume.material.opacity+=((on?.55*pu:0)-u.plume.material.opacity)*Math.min(1,dt*4);u.plume.scale.set(.45*pu,.75*pu,1);
        const k=(tt*.32+u.ph)%1,r=.3+k*u.R*1.1;u.wave.scale.set(r,r,r);u.wave.material.opacity=on&&!reduce?(1-k)*.4:0;});
      stepP(dt,on,false);stepHeat(dt);
      if(nav&&!window.__frz)stepPeople(dt,now/1000,open);
      people.concat(extras).forEach(p=>{if(!p.visible)return;const d=Math.hypot(p.position.x-camera.position.x,p.position.z-camera.position.z);if(p.userData.gltfP){if(p.children[0])p.children[0].visible=d>.6;}else if(p.userData.skin){const m=p.userData.skin.material,o=Math.max(0,Math.min(1,(d-.35)/.5));if(o<1||m.transparent){m.transparent=o<1;m.opacity=o;m.depthWrite=o>=.5;}}});
      const w=stage.clientWidth,h=stage.clientHeight;
      const kept=[];overlay.forEach(o=>{v3.copy(o.v).project(camera);o.sx=(v3.x+1)/2*w;o.sy=(1-v3.y)/2*h;o.sz=v3.z;o.off=v3.z>1||v3.x<-1.1||v3.x>1.1||v3.y<-1.1||v3.y>1.1;});
      let HR=null;if(hud&&hud.offsetParent){const a=hud.getBoundingClientRect(),b=stage.getBoundingClientRect();HR=[a.left-b.left,a.top-b.top,a.right-b.left,a.bottom-b.top];}
      overlay.filter(o=>o.kind==='lbl'&&!o.off).sort((a,b)=>a.sz-b.sz).forEach(o=>{if(!o.w){o.w=o.el.offsetWidth||80;o.h=o.el.offsetHeight||18;}if(HR&&o.sx+o.w/2>HR[0]&&o.sx-o.w/2<HR[2]&&o.sy+o.h/2>HR[1]&&o.sy-o.h/2<HR[3]){o.off=true;return;}if(kept.some(k=>Math.abs(k.sx-o.sx)<(k.w+o.w)/2+4&&Math.abs(k.sy-o.sy)<(k.h+o.h)/2+2))o.off=true;else kept.push(o);});
      overlay.forEach(o=>{if(o.kind==='pin'&&HR&&!o.off&&o.sx>HR[0]-20&&o.sx<HR[2]+20&&o.sy>HR[1]-20&&o.sy<HR[3]+20)o.off=true;});
      overlay.forEach(o=>{o.el.style.visibility=o.off?'hidden':'visible';if(!o.off)o.el.style.transform='translate('+o.sx.toFixed(1)+'px,'+o.sy.toFixed(1)+'px)'+(o.kind==='lbl'?' translate(-50%,-50%)':'');});
      renderer.render(scene,camera);if(window.__perf){window.__perf.frames=(window.__perf.frames||0)+1;if(!window.__perf.first)window.__perf.first=performance.now();}
      raf=requestAnimationFrame(frame);
    }
    kick=()=>{if(!raf&&vis){last=0;raf=requestAnimationFrame(frame);}};
    window.__renderNow=()=>{renderer.render(scene,camera);};
    window.__cam=(x,y,z,tx,ty,tz)=>{view.name='free';tween=null;camera.position.set(x,y,z);camera.lookAt(tx,ty,tz);$$('.views [data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));kick();};
    window.__tri=()=>{renderer.render(scene,camera);return {tri:renderer.info.render.triangles,calls:renderer.info.render.calls,geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures};};
    window.__people=()=>people.map(p=>({x:p.position.x,y:p.position.y,z:p.position.z,ry:p.rotation.y,st:p.userData.state,leg:p.userData.legI,vis:p.visible,basket:!!p.userData.hasBasket,buyer:!!p.userData.buyer,items:p.userData.items,pay:!!p.userData.pay,cash:p.userData.pay?!!p.userData.pay.cash:null,phase:p.userData.phase||null,slot:p.userData.slot}));window.__params=PARAMS;
    const navViol=()=>{const out=[];people.forEach((p,i)=>{if(!p.visible)return;const x=p.position.x,z=p.position.z;const inRoom=x>-S.hw&&x<S.hw&&z>-S.hd&&z<S.hd,inApron=Math.abs(x-S.door.x)<S.door.w/2&&z>=S.hd&&z<=S.hd+1.6;const [ci,cj]=nav.toCell(x,z);const occ=nav.G0[cj*nav.cols+ci]===1;if(!(inRoom||inApron)||occ)out.push([i,+x.toFixed(2),+z.toFixed(2),p.userData.state,occ?'occ':'out']);});return out;};
    window.__bodies=()=>people.concat(extras).filter(p=>p.visible&&!p.userData.gltfP).map(p=>{const v=new T.Vector3(),f=new T.Vector3();p.userData.head.getWorldPosition(v);p.userData.legs[0].userData.ft.getWorldPosition(f);const sm=p.userData.skin;return {head:+(v.y-p.position.y).toFixed(2),foot:+(f.y-p.position.y).toFixed(2),dxz:+Math.hypot(v.x-p.position.x,v.z-p.position.z).toFixed(2),op:sm?+sm.material.opacity.toFixed(2):null,bound:!!(sm&&sm.skeleton),st:p.userData.state};});
    window.__inView=maxD=>{camera.updateMatrixWorld();const v=new T.Vector3();let n=0;people.concat(extras).forEach(p=>{if(!p.visible)return;const d=p.position.distanceTo(camera.position);if(d<1||d>(maxD||14))return;const ok=[0.05,1.6*(p.userData.k||1)*(p.scale.x||1)].every(h=>{v.set(p.position.x,p.position.y+h,p.position.z).project(camera);return v.z<1&&Math.abs(v.x)<.95&&Math.abs(v.y)<.95;});if(ok)n++;});return n;};
    window.__nav=()=>nav;window.__obsAt=(x,z)=>OBS.filter(r=>x>=r[0]-.01&&x<=r[1]+.01&&z>=r[2]-.01&&z<=r[3]+.01);
    window.__navStress=(steps,dt)=>{dt=dt||.05;let viol=0,samples=0;const ex=[];if(window.__simT==null)window.__simT=performance.now()/1000;for(let s=0;s<steps;s++){window.__simT+=dt;stepPeople(dt,window.__simT,true);extras.forEach(e=>{if(e.visible)poseAny(e,window.__simT,dt,0);});if(GL())window.KL_GLTF.update(dt);const v=navViol();samples+=people.length;if(v.length){viol+=v.length;if(ex.length<5)ex.push(v[0]);}}return {steps,samples,viol,ex,failed:nav.failed(),people:people.length};};
    window.__navCheck=sec=>new Promise(res=>{let viol=0,samples=0,frames=0;const ex=[];const t0=performance.now();const tick=()=>{frames++;const v=navViol();samples+=people.length;if(v.length){viol+=v.length;if(ex.length<5)ex.push(v[0]);}if(performance.now()-t0<sec*1000)requestAnimationFrame(tick);else res({frames,samples,viol,ex});};requestAnimationFrame(tick);});
    window.__freeze=b=>{window.__frz=!!b;};
    window.__scan=()=>{const o=[];room.traverse(m=>{if(m.isMesh){const g=m.geometry;o.push([m.isInstancedMesh?'I'+m.count:(m.isSkinnedMesh?'S':'M'),Math.round((g.index?g.index.count:g.attributes.position.count)/3*(m.isInstancedMesh?m.count:1)),m.material.type+(m.material.map?'+map':'')+(m.material.vertexColors?'+vc':'')]);}});return o.sort((a,b)=>b[1]-a[1]).slice(0,22);};
    window.__triList=i=>{const out=[];(people.concat(extras))[i||0].traverse(o=>{if(o.isMesh){const g=o.geometry;out.push([g.type,Math.round((g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1)),o.parent.type]);}});return out.sort((a,b)=>b[1]-a[1]);};
    window.__triPeople=()=>{let n=0;people.concat(extras).forEach(p=>p.traverse(o=>{if(o.isMesh){const g=o.geometry;n+=(g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}}));return n;};
    window.__place=(i,x,z,ry,st)=>{const p=people[i];if(!p)return;p.position.set(x,0,z);p.rotation.y=ry;p.visible=true;if(st){p.userData.state=st;p.userData.blend=st==='walk'?1:0;}posePerson(p,performance.now()/1000,.016,st==='walk'?.5:0);if(p.userData.stroller)p.userData.stroller.visible=false;};
    window.__dbg=()=>{const p=people[0];if(!p)return {people:people.length};const out={people:people.length,pos:[p.position.x,p.position.y,p.position.z],children:[]};p.traverse(o=>{if(o.isMesh){const b=new T.Box3().setFromObject(o);out.children.push([o.geometry.type,o.material.color?'#'+o.material.color.getHexString():'-',+(b.max.y-b.min.y).toFixed(2),+(b.min.y).toFixed(2),+(b.max.y).toFixed(2)]);}});return out;};
    let flown=false;
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!flown&&!reduce){flown=true;Object.assign(view,{theta:view.theta-1.25,phi:.32,r:view.r*2.6,ty:0});apply();go.dur=3.2;go('persp');}kick();},{threshold:.25}).observe(stage);else vis=true;
    document.addEventListener('visibilitychange',kick);
    three={build};
    resize();build();paintCard();kick();
  }

  // start 3D when the set comes near the viewport
  let started=false;
  const boot=()=>{if(started)return;started=true;window.__perf={boot:performance.now()};init3D();};
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){boot();io.disconnect();}},{rootMargin:'600px'});io.observe(stage);}else boot();
  if(location.hash==='#prostranstvo')boot();
  paintCard();paintClock();
  return {show};
})();

paintMode();modeSubs.forEach(f=>f());
})();

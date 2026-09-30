/* KAYA LUX · реални човешки модели (glTF/GLB) за 3D схемата.
   Модели: Microsoft Rocketbox Avatar Library (MIT), конвертирани в GLB с текстури 1024 px.
   Анимации: assets/models/rb-anims.glb (Rocketbox, Bip01 скелет), клипове walk/walkslow/idle/wait/look/phone/bag/turnl/turnr, по пол (_m/_f), in-place.
   Чете assets/models/manifest.json → [{file, height, tags:['m'|'f','child','elderly','staff']}].
   Зарежда прогресивно (2 файла едновременно); spawn() връща null докато няма зареден подходящ модел → схемата ползва процедурна фигура. */
(function(){
  if(!window.THREE) return;
  var BASE=(document.currentScript&&document.currentScript.src)?document.currentScript.src.replace(/assets\/js\/[^/]*$/,''):'';
  var G=window.KL_GLTF={ready:false,models:[],pending:[],anims:null,instances:[],failed:false,loading:0};
  var CLIPS=['walk','walkslow','idle','wait','look','phone','bag','talk','talk2','listen','phonetalk'];
  function fitHeight(o,h){o.updateMatrixWorld(true);var b=new THREE.Box3().setFromObject(o);var cur=b.max.y-b.min.y;if(!(cur>0))return 1;var s=h/cur;o.scale.setScalar(s);o.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(o);var c=b.getCenter(new THREE.Vector3());o.position.set(-c.x,-b.min.y,-c.z);return s;}
  G.has=function(kind){return G.models.some(function(m){return !kind||m.tags.indexOf(kind)>=0;});};
  /* profile {kind:'m'|'f'|'child'|'elderly'|'staff', height, avoid:[files]} → Group с userData {mixer, play(name,fade), setSpeed, kind, file} */
  G.spawn=function(profile){profile=profile||{};if(!G.models.length||!G.anims)return null;
    var ok=function(m){var t=m.tags;if(!profile.kind)return t.indexOf('child')<0&&t.indexOf('staff')<0;if(profile.kind==='m'||profile.kind==='f')return t.indexOf(profile.kind)>=0&&t.indexOf('child')<0&&t.indexOf('staff')<0;return t.indexOf(profile.kind)>=0;};
    var pool=G.models.filter(function(m){return ok(m)&&(!profile.avoid||profile.avoid.indexOf(m.file)<0);});
    if(!pool.length)pool=G.models.filter(ok);if(!pool.length)return null;
    /* най-рядко използваният първи */
    pool.sort(function(a,b){return a.used-b.used;});var src=pool[Math.floor(Math.random()*Math.min(3,pool.length))];src.used++;
    var root=THREE.SkeletonUtils.clone(src.scene);
    var g=new THREE.Group();g.add(root);root.traverse(function(x){if(x.isMesh){x.frustumCulled=false;x.castShadow=!!profile.shadow;x.receiveShadow=false;}});
    var scale=fitHeight(root,profile.height||src.height);
    var sex=src.tags.indexOf('f')>=0?'f':'m';
    var mixer=new THREE.AnimationMixer(root),acts={};
    if(!src.clips){src.clips={};var pel=null,prefix='Bip01';src.scene.traverse(function(o){if(!pel&&/^Bip\d+_Pelvis$/.test(o.name)){pel=o;prefix=o.name.replace('_Pelvis','');}});var ratio=(pel&&G.pelvisY>0)?pel.position.length()/G.pelvisY:1;
      CLIPS.forEach(function(n){var c=G.anims[n+'_'+sex]||G.anims[n+'_m'];if(!c)return;var k=c.clone();k.tracks=k.tracks.filter(function(t){return !/^Bip01\./.test(t.name)&&!/Footsteps/.test(t.name);});
        k.tracks.forEach(function(t){if(/Bip01_Pelvis\.position$/.test(t.name)){for(var i=0;i<t.values.length;i++)t.values[i]*=ratio;}if(prefix!=='Bip01')t.name=t.name.replace(/^Bip01_/,prefix+'_');});src.clips[n]=k;});}
    CLIPS.forEach(function(n){if(src.clips[n])acts[n]=mixer.clipAction(src.clips[n]);});
    var cur=null;
    g.userData.gltf=true;g.userData.mixer=mixer;g.userData.kind=src.tags[0];g.userData.file=src.file;g.userData.sex=sex;g.userData.scale=scale;g.userData.height=profile.height||src.height;
    g.userData.play=function(n,fade){var a=acts[n]||acts.idle;if(!a||a===cur)return;a.reset().setEffectiveWeight(1).play();if(cur)cur.crossFadeTo(a,fade||0.3,false);cur=a;g.userData.clip=n;};
    g.userData.setSpeed=function(mps){/* ходене: клипът е ~1.3 m/s при timeScale 1 */var a=acts.walk;if(a)a.setEffectiveTimeScale(Math.max(.4,Math.min(1.8,mps/1.3)));var b=acts.walkslow;if(b)b.setEffectiveTimeScale(Math.max(.4,Math.min(1.8,mps/0.8)));};
    /* лицеви форми (ако моделът е с blendshapes): face('smile'|'blink'|'aa'|'oh'|'ee'|'jaw'|'brows', 0..1) */
    var morphs=[];root.traverse(function(x){if(x.isMesh&&x.morphTargetDictionary&&x.morphTargetInfluences)morphs.push(x);});
    if(morphs.length){g.userData.face=function(name,w){for(var i=0;i<morphs.length;i++){var k=morphs[i].morphTargetDictionary[name];if(k!=null)morphs[i].morphTargetInfluences[k]=w;}};g.userData.faces=Object.keys(morphs[0].morphTargetDictionary);}
    g.userData.play('idle');G.instances.push(g);return g;};
  G.update=function(dt){for(var i=0;i<G.instances.length;i++){var g=G.instances[i];if(g.visible&&g.parent&&!g.userData.culled)g.userData.mixer.update(dt);}}; /* off-screen people are not animated */
  /* a person leaves the scene: free what was made only for them (their skeleton's bone texture, the animation mixer's cache);
     models, geometry and materials are shared and stay */
  G.release=function(g){var i=G.instances.indexOf(g);if(i>=0)G.instances.splice(i,1);var seen=[];
    g.traverse(function(x){if(x.isSkinnedMesh&&x.skeleton&&seen.indexOf(x.skeleton)<0){seen.push(x.skeleton);x.skeleton.dispose();}});
    var mx=g.userData.mixer;if(mx){mx.stopAllAction();mx.uncacheRoot(mx.getRoot());}};
  if(!THREE.GLTFLoader||!THREE.SkeletonUtils){G.failed=true;return;}
  var L=new THREE.GLTFLoader();if(window.MeshoptDecoder)L.setMeshoptDecoder(window.MeshoptDecoder); /* моделите са свити с gltfpack -cc (EXT_meshopt_compression) */
  function load(url){return new Promise(function(res,rej){L.load(url,res,undefined,rej);});}
  function next(){if(G.loading>=2||!G.pending.length)return;var m=G.pending.shift();G.loading++;
    load(BASE+'assets/models/'+m.file).then(function(gl){gl.scene.traverse(function(x){if(x.isMesh&&x.material){x.material.side=x.material.transparent||x.material.alphaTest?THREE.DoubleSide:THREE.FrontSide;}});
      G.models.push({scene:gl.scene,file:m.file,height:m.height||1.72,tags:m.tags||['m'],used:0});G.ready=true;
      if(G.renderer)gl.scene.traverse(function(x){if(x.isMesh&&x.material){['map','normalMap','alphaMap'].forEach(function(k){if(x.material[k])G.renderer.initTexture(x.material[k]);});}}); /* textures go to the GPU now, during the loading bar, not when the person first walks into view */
      document.dispatchEvent(new CustomEvent('kl-gltf-model',{detail:{file:m.file,count:G.models.length}}));
    }).catch(function(e){console.warn('KL_GLTF',m.file,e);}).then(function(){G.loading--;if(!G.pending.length&&!G.loading)document.dispatchEvent(new CustomEvent('kl-gltf-ready',{detail:G}));next();});}
  var started=false;
  /* зареждането започва едва когато 3D схемата наближи (offer.js вика KL_GLTF.start()); първите 12 модела веднага, останалите в свободно време */
  G.start=function(){if(started)return G.promise;started=true;
  G.promise=fetch(BASE+'assets/models/manifest.json',{cache:'default'}).then(function(r){return r.ok?r.json():[];}).then(function(list){
    if(!Array.isArray(list)||!list.length)return;
    return load(BASE+'assets/models/rb-anims.glb').then(function(a){G.anims={};a.animations.forEach(function(c){G.anims[c.name]=c;});var p0=a.scene.getObjectByName('Bip01_Pelvis');G.pelvisY=p0?p0.position.length():0;
      /* първо по един от всяка група, после останалите – за да има разнообразие още при първите хора */
      var groups={};list.forEach(function(m){var k=(m.tags||['m']).join(',');(groups[k]=groups[k]||[]).push(m);});
      var order=[],more=true;while(more){more=false;for(var k in groups){if(groups[k].length){order.push(groups[k].shift());more=true;}}}
      var first=order.slice(0,12),rest=order.slice(12);G.pending=first;next();next();
      var more=function(){G.pending=G.pending.concat(rest);next();next();};if(window.requestIdleCallback)requestIdleCallback(more,{timeout:2500});else setTimeout(more,1500);});
  }).catch(function(e){G.failed=true;console.warn('KL_GLTF',e);});return G.promise;};
  /* ако никой не извика start() до 8 s след зареждане, започваме сами (за всеки случай) */
  setTimeout(function(){if(!started&&document.getElementById('stage'))G.start();},8000);
})();

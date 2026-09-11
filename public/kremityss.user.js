// ==UserScript==
// @name         Kremityss — Single Player Training Overlay
// @namespace    kremityss.local
// @version      1.0.0
// @description  Mobile-first Three.js training overlay for the owned single-player browser game.
// @match        https://vibeslops.luckeysystems.com/*
// @match        http://127.0.0.1:8000/*
// @match        http://localhost:8000/*
// @match        https://kremcheats.github.io/Claude-of-Duty/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(() => {
  'use strict';
  if (window.__KREMITYSS_LOADED__) return;
  window.__KREMITYSS_LOADED__ = true;

  const showCompatibilityNotice = () => {
    if (document.getElementById('kr-compatibility-notice')) return;
    const n = document.createElement('div');
    n.id = 'kr-compatibility-notice';
    n.textContent = 'Kremityss: game hook unavailable on this page. Use the patched build for ESP/aim.';
    Object.assign(n.style, {position:'fixed',left:'10px',right:'10px',bottom:'max(10px, env(safe-area-inset-bottom))',zIndex:'2147483647',padding:'12px 14px',border:'1px solid #a970ff',borderRadius:'12px',background:'rgba(20,8,38,.95)',color:'#f5ecff',font:'13px system-ui',textAlign:'center',pointerEvents:'none'});
    (document.body || document.documentElement).appendChild(n);
  };
  const waitForGame = (fn) => {
    let tries = 0;
    const timer = setInterval(() => {
      if (window.__vibeGame?.THREE && window.__vibeGame?.camera) {
        clearInterval(timer); fn(window.__vibeGame);
      } else if (++tries > 150) { clearInterval(timer); startScreenFallback(); }
    }, 100);
  };


  const startScreenFallback = () => {
    if (document.getElementById('kr-fallback-status')) return;
    const status = document.createElement('div');
    status.id = 'kr-fallback-status';
    status.textContent = 'Kremityss: screen mode — boxes/aim are approximate';
    Object.assign(status.style, {position:'fixed', left:'10px', bottom:'max(52px, env(safe-area-inset-bottom))', zIndex:'2147483647', padding:'7px 10px', border:'1px solid #a970ff', borderRadius:'10px', background:'rgba(20,8,38,.9)', color:'#e8d5ff', font:'11px system-ui', pointerEvents:'none'});
    (document.body || document.documentElement).appendChild(status);
    const gameCanvas = document.querySelector('canvas');
    if (!gameCanvas) return;
    const hud = document.createElement('canvas');
    hud.id = 'kr-screen-hud';
    Object.assign(hud.style, {position:'fixed', inset:'0', width:'100%', height:'100%', zIndex:'2147483000', pointerEvents:'none'});
    document.body.appendChild(hud);
    const ctx = hud.getContext('2d');
    const sample = document.createElement('canvas');
    const sx = sample.getContext('2d', {willReadFrequently:true});
    const st = {esp:true, aim:false, aimHeld:false, fov:180, rgbFov:true, rgbBoxes:true};
    const panel = document.createElement('aside');
    panel.id = 'kr-fallback-ui';
    panel.innerHTML = '<button id="kr-fx">×</button><b>K R E M I T Y S S</b><small>SCREEN MODE</small><label>ESP <input id="fx-esp" type="checkbox" checked></label><label>Aim assist <input id="fx-aim" type="checkbox"></label><label>FOV <input id="fx-fov" type="range" min="40" max="500" value="180"></label><button id="fx-touch">TOGGLE AIM</button><footer>Private - Made By @Kremityss</footer>';
    const style = document.createElement('style');
    style.textContent = '#kr-fallback-ui{position:fixed;right:10px;top:10px;z-index:2147483001;width:190px;padding:12px;border:1px solid #a970ff;border-radius:16px;background:rgba(15,7,30,.94);color:#f5ecff;font:13px system-ui;pointer-events:auto;box-shadow:0 0 25px #6b36a855;display:grid;gap:7px}#kr-fallback-ui small{color:#c59bf4}#kr-fallback-ui label{display:flex;justify-content:space-between;align-items:center}#kr-fallback-ui input{accent-color:#a970ff;width:90px}#kr-fallback-ui button{background:#56258a;color:#fff;border:1px solid #b77eff;border-radius:8px;padding:6px}#kr-fallback-ui footer{font-size:9px;color:#bca5d1;text-align:center;padding-top:6px}#kr-fallback-launcher{position:fixed;left:16px;top:120px;z-index:2147483002;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle,#c995ff,#431574);border:1px solid #e1caff;color:#fff;font-weight:800;font-size:20px;box-shadow:0 0 18px #a970ff;touch-action:none}';
    document.documentElement.appendChild(style); document.body.appendChild(panel);
    const launcher = document.createElement('button'); launcher.id = 'kr-fallback-launcher'; launcher.textContent = 'K'; document.body.appendChild(launcher);
    launcher.onclick = () => panel.style.display = panel.style.display === 'none' ? 'grid' : 'none'; panel.querySelector('#kr-fx').onclick = () => panel.style.display = 'none';
    panel.querySelector('#fx-esp').onchange = e => st.esp = e.target.checked; panel.querySelector('#fx-aim').onchange = e => st.aim = e.target.checked; panel.querySelector('#fx-fov').oninput = e => st.fov = +e.target.value; panel.querySelector('#fx-touch').onclick = () => st.aimHeld = !st.aimHeld;
    addEventListener('keydown', e => {if (e.code === 'KeyF') st.aimHeld = true; if (e.code === 'KeyX') st.esp = !st.esp;}); addEventListener('keyup', e => {if (e.code === 'KeyF') st.aimHeld = false;});
    const resize = () => {const d = devicePixelRatio || 1; hud.width = innerWidth*d; hud.height = innerHeight*d; ctx.setTransform(d,0,0,d,0,0);}; addEventListener('resize', resize); resize();
    const hue = () => `hsl(${(performance.now()/8)%360} 100% 68%)`;
    const candidates = () => {const w=gameCanvas.width,h=gameCanvas.height;if(!w||!h)return [];const scale=Math.min(1,640/w);sample.width=Math.max(1,w*scale);sample.height=Math.max(1,h*scale);try{sx.drawImage(gameCanvas,0,0,sample.width,sample.height);const d=sx.getImageData(0,0,sample.width,sample.height).data;const out=[];for(let gy=1;gy<7;gy++)for(let gx=0;gx<8;gx++){let r=0,g=0,b=0,n=0;const x0=gx*sample.width/8,y0=gy*sample.height/8,x1=(gx+1)*sample.width/8,y1=(gy+1)*sample.height/8;for(let y=y0;y<y1;y+=4)for(let x=x0;x<x1;x+=4){const i=(y*sample.width+x)*4;r+=d[i];g+=d[i+1];b+=d[i+2];n++;}r/=n;g/=n;b/=n;const contrast=Math.max(r,g,b)-Math.min(r,g,b);if(contrast>35&&r+g+b<520){out.push({x:(x0+x1)/2/scale,y:(y0+y1)/2/scale,w:Math.max(18,innerWidth*.045),h:Math.max(36,innerHeight*.13)});}}return out.slice(0,12);}catch{return [];}};
    const loop = () => {ctx.clearRect(0,0,innerWidth,innerHeight);const cx=innerWidth/2,cy=innerHeight/2;ctx.beginPath();ctx.arc(cx,cy,st.fov,0,Math.PI*2);ctx.strokeStyle=st.rgbFov?hue():'#cfa7ff';ctx.stroke();if(st.esp){for(const q of candidates()){const score=Math.hypot(q.x-cx,q.y-cy);ctx.strokeStyle=st.rgbBoxes?hue():'#ff5964';ctx.strokeRect(q.x-q.w/2,q.y-q.h/2,q.w,q.h);ctx.fillStyle='#fff';ctx.font='11px monospace';ctx.fillText('Enemy · approx',q.x-q.w/2,q.y-q.h/2-4);ctx.fillStyle='#56ff9a';ctx.fillRect(q.x-q.w/2-6,q.y-q.h/2,3,q.h*.7);if(st.aim&&st.aimHeld&&score<=st.fov){ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(q.x,q.y,8,0,7);ctx.stroke();}}}requestAnimationFrame(loop);}; loop();
  };

  const boot = (G) => {
    const V = G.THREE;
    const state = {
      esp: true, aim: false, aimHeld: false, fov: 180, strength: 55,
      maxDistance: 2500, boxes: true, health: true, distance: true,
      names: true, rgbFov: true, rgbBoxes: true, panel: true, dragging: false,
      hue: 0, buttonX: 18, buttonY: 120
    };
    const css = document.createElement('style');
    css.textContent = `
      :root { --kr-purple:#a970ff; --kr-pink:#ff5bd6; --kr-cyan:#78e7ff; --kr-bg:rgba(13,7,28,.92); }
      html,body { touch-action:none; overscroll-behavior:none; -webkit-text-size-adjust:100%; }
      #kr-hud { position:fixed; inset:0; width:100%; height:100%; z-index:2147483000; pointer-events:none; }
      #kr-ui, #kr-launcher { font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif; }
      #kr-launcher { position:fixed; z-index:2147483003; width:54px; height:54px; border-radius:50%; border:1px solid #d7b6ff; color:white; font-weight:800; letter-spacing:.08em; background:radial-gradient(circle at 30% 25%,#d5a8ff,#7135a8 45%,#170b36 100%); box-shadow:0 0 12px #ad62ff, inset 0 0 14px #f2d7ff; display:grid; place-items:center; user-select:none; -webkit-user-select:none; touch-action:none; }
      #kr-ui { position:fixed; z-index:2147483002; right:10px; top:calc(env(safe-area-inset-top) + 10px); width:min(330px,calc(100vw - 20px)); max-height:calc(100dvh - 20px); overflow:auto; color:#f5ecff; border:1px solid #9d63e8; border-radius:18px; background:radial-gradient(circle at 90% 0%,rgba(132,61,192,.45),transparent 42%),radial-gradient(circle at 0% 100%,rgba(46,92,175,.2),transparent 38%),rgba(10,5,24,.94); box-shadow:0 0 28px rgba(153,77,255,.45), inset 0 0 35px rgba(112,52,168,.16); backdrop-filter:blur(15px); -webkit-backdrop-filter:blur(15px); padding:14px; font-size:13px; pointer-events:auto; -webkit-overflow-scrolling:touch; }
      #kr-ui.kr-hidden { display:none; }
      #kr-ui h1 { font-size:18px; margin:0; letter-spacing:.16em; color:#dcbcff; text-shadow:0 0 12px #9c4fff; }
      #kr-ui .kr-sub { color:#bda8d4; font-size:10px; letter-spacing:.12em; margin:3px 0 12px; }
      #kr-ui .kr-section { border-top:1px solid rgba(202,157,255,.25); padding-top:10px; margin-top:10px; }
      #kr-ui .kr-section-title { color:#cfa7ff; letter-spacing:.12em; font-size:11px; margin-bottom:7px; }
      #kr-ui label { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:30px; }
      #kr-ui input[type=checkbox] { accent-color:#a65cff; width:18px; height:18px; }
      #kr-ui input[type=range] { width:145px; accent-color:#a65cff; }
      #kr-ui output { color:#e7ceff; min-width:36px; text-align:right; }
      #kr-ui button { border:1px solid #a970ff; border-radius:10px; background:rgba(126,66,183,.26); color:white; padding:8px 10px; font-weight:700; }
      #kr-ui .kr-row { display:flex; gap:7px; flex-wrap:wrap; }
      #kr-ui .kr-footer { color:#a995bb; font-size:10px; text-align:center; padding-top:13px; letter-spacing:.08em; }
      #kr-ui .kr-close { float:right; border:0; background:none; font-size:20px; padding:0 3px; color:#e4caff; }
      @media (max-width:600px) { #kr-ui { width:calc(100vw - 20px); max-height:70dvh; font-size:14px; } #kr-launcher { width:50px; height:50px; } }
    `;
    document.documentElement.appendChild(css);

    const viewport = document.querySelector('meta[name="viewport"]') || document.head.appendChild(Object.assign(document.createElement('meta'), {name:'viewport'}));
    viewport.content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
    const blockZoom = (e) => { if (e.touches?.length > 1) e.preventDefault(); };
    document.addEventListener('gesturestart', e => e.preventDefault(), {passive:false});
    document.addEventListener('gesturechange', e => e.preventDefault(), {passive:false});
    document.addEventListener('touchmove', blockZoom, {passive:false});
    const setViewportHeight = () => document.documentElement.style.setProperty('--kr-vh', `${(visualViewport?.height || innerHeight)}px`);
    addEventListener('resize', setViewportHeight); visualViewport?.addEventListener('resize', setViewportHeight); setViewportHeight();

    const launcher = document.createElement('div'); launcher.id='kr-launcher'; launcher.textContent='K'; launcher.setAttribute('aria-label','Open Kremityss menu');
    const panel = document.createElement('aside'); panel.id='kr-ui';
    panel.innerHTML = `
      <button class="kr-close" id="kr-close">×</button>
      <h1>K R E M I T Y S S</h1><div class="kr-sub">SINGLE PLAYER TRAINING // MOBILE</div>
      <div class="kr-section"><div class="kr-section-title">VISUALS</div>
        <label>ESP overlay <input id="kr-esp" type="checkbox" checked></label>
        <label>Boxes <input id="kr-boxes" type="checkbox" checked></label>
        <label>Enemy name <input id="kr-names" type="checkbox" checked></label>
        <label>Health bar <input id="kr-health" type="checkbox" checked></label>
        <label>Distance <input id="kr-distance" type="checkbox" checked></label>
      </div>
      <div class="kr-section"><div class="kr-section-title">AIM LOGIC</div>
        <label>Aim assist <input id="kr-aim" type="checkbox"></label>
        <label>Hold to aim <input id="kr-hold" type="checkbox" checked></label>
        <label>FOV size <input id="kr-fov" type="range" min="40" max="500" value="180"><output id="kr-fov-out">180</output></label>
        <label>Aim strength <input id="kr-strength" type="range" min="1" max="100" value="55"><output id="kr-strength-out">55%</output></label>
        <label>Max distance <input id="kr-maxdist" type="range" min="250" max="5000" value="2500"><output id="kr-maxdist-out">2500</output></label>
        <div class="kr-row"><button id="kr-aim-touch">TOGGLE AIM</button><button id="kr-center">CENTER UI</button></div>
      </div>
      <div class="kr-section"><div class="kr-section-title">COLORS</div>
        <label>RGB FOV <input id="kr-rgb-fov" type="checkbox" checked></label>
        <label>RGB boxes <input id="kr-rgb-boxes" type="checkbox" checked></label>
      </div>
      <div class="kr-footer">Private - Made By @Kremityss</div>`;
    document.body.append(launcher,panel);

    const $ = id => panel.querySelector('#'+id);
    const bind = (id, key) => $(id).addEventListener('change', e => state[key] = e.target.checked);
    bind('kr-esp','esp'); bind('kr-boxes','boxes'); bind('kr-names','names'); bind('kr-health','health'); bind('kr-distance','distance'); bind('kr-aim','aim'); bind('kr-rgb-fov','rgbFov'); bind('kr-rgb-boxes','rgbBoxes');
    $('kr-fov').addEventListener('input', e => { state.fov=+e.target.value; $('kr-fov-out').value=state.fov; $('kr-fov-out').textContent=state.fov; });
    $('kr-strength').addEventListener('input', e => { state.strength=+e.target.value; $('kr-strength-out').value=state.strength+'%'; $('kr-strength-out').textContent=state.strength+'%'; });
    $('kr-maxdist').addEventListener('input', e => { state.maxDistance=+e.target.value; $('kr-maxdist-out').value=state.maxDistance; $('kr-maxdist-out').textContent=state.maxDistance; });
    $('kr-hold').addEventListener('change', e => state.hold=e.target.checked);
    $('kr-close').onclick = () => { state.panel=false; panel.classList.add('kr-hidden'); };
    launcher.onclick = () => { state.panel=!state.panel; panel.classList.toggle('kr-hidden',!state.panel); };
    $('kr-aim-touch').onclick = () => { state.aimHeld=!state.aimHeld; $('kr-aim-touch').textContent=state.aimHeld?'AIM ACTIVE':'TOGGLE AIM'; };
    $('kr-center').onclick = () => { launcher.style.left='18px'; launcher.style.top='120px'; launcher.style.right='auto'; };

    let dragStart=null;
    const moveStart = e => { const p=e.touches?.[0]||e; dragStart={x:p.clientX,y:p.clientY,left:launcher.offsetLeft,top:launcher.offsetTop}; launcher.setPointerCapture?.(e.pointerId); };
    const move = e => { if(!dragStart)return; const p=e.touches?.[0]||e; launcher.style.left=Math.max(4,Math.min(innerWidth-58,dragStart.left+p.clientX-dragStart.x))+'px'; launcher.style.top=Math.max(4,Math.min(innerHeight-58,dragStart.top+p.clientY-dragStart.y))+'px'; launcher.style.right='auto'; e.preventDefault(); };
    const moveEnd=()=>{dragStart=null};
    launcher.addEventListener('pointerdown',moveStart); launcher.addEventListener('pointermove',move); launcher.addEventListener('pointerup',moveEnd); launcher.addEventListener('pointercancel',moveEnd);
    addEventListener('keydown', e => { if(e.code==='KeyF')state.aimHeld=true; if(e.code==='KeyX')state.esp=!state.esp; });
    addEventListener('keyup', e => { if(e.code==='KeyF')state.aimHeld=false; });
    const hud=document.createElement('canvas'); hud.id='kr-hud'; document.body.appendChild(hud); const ctx=hud.getContext('2d');
    const box=new V.Box3(); const corners=Array.from({length:8},()=>new V.Vector3()); const center=new V.Vector3();
    const resize=()=>{const d=devicePixelRatio||1; hud.width=innerWidth*d; hud.height=innerHeight*d; ctx.setTransform(d,0,0,d,0,0)}; addEventListener('resize',resize); resize();
    const project=p=>{const q=p.clone().project(G.camera); return {x:(q.x*.5+.5)*innerWidth,y:(-q.y*.5+.5)*innerHeight,z:q.z};};
    const rgb=()=>`hsl(${state.hue++%360} 100% 68%)`;
    const targetPoint=e=>{box.setFromObject(e.root || e.group); return box.getCenter(new V.Vector3()).setY(box.max.y-(box.max.y-box.min.y)*.38)};
    const drawEnemy=e=>{ box.setFromObject(e.root || e.group); if(box.isEmpty()||!isFinite(box.min.x))return null; corners[0].set(box.min.x,box.min.y,box.min.z);corners[1].set(box.min.x,box.min.y,box.max.z);corners[2].set(box.min.x,box.max.y,box.min.z);corners[3].set(box.min.x,box.max.y,box.max.z);corners[4].set(box.max.x,box.min.y,box.max.z);corners[5].set(box.max.x,box.min.y,box.min.z);corners[6].set(box.max.x,box.max.y,box.max.z);corners[7].set(box.max.x,box.max.y,box.min.z); const ps=corners.map(project), vis=ps.filter(p=>p.z>=-1&&p.z<=1);if(!vis.length)return null;const xs=vis.map(p=>p.x),ys=vis.map(p=>p.y),x=Math.max(0,Math.min(...xs)),y=Math.max(0,Math.min(...ys)),r=Math.min(innerWidth,Math.max(...xs)),b=Math.min(innerHeight,Math.max(...ys));if(r-x<2||b-y<2)return null; const color=state.rgbBoxes?rgb():'#ff5964'; if(state.boxes){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(x,y,r-x,b-y);} const health=Math.max(0,Math.min(1,(e.health??e.maxHealth??100)/(e.maxHealth||100))); if(state.health){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-7,y,4,b-y);ctx.fillStyle=health>.5?'#57ff9a':health>.25?'#ffd35a':'#ff536f';ctx.fillRect(x-7,b-(b-y)*health,4,(b-y)*health);}ctx.fillStyle=color;ctx.font='11px monospace';let text=state.names?'Enemy':'';if(state.distance)text+=(text?' · ':'')+Math.round(G.camera.position.distanceTo(targetPoint(e)))+'m';if(text)ctx.fillText(text,x+3,Math.max(12,y-4));return{x:x+(r-x)/2,y:y+(b-y)*.38,point:project(targetPoint(e)),dist:G.camera.position.distanceTo(targetPoint(e))};};
    const aimAt=t=>{const dx=t.point.x-innerWidth/2,dy=t.point.y-innerHeight/2,gain=(state.strength/100)*.055;G.yawPitch.y-=dx/innerWidth*Math.PI*gain;G.yawPitch.x-=dy/innerHeight*Math.PI*gain;G.yawPitch.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,G.yawPitch.x));G.camera.quaternion.setFromEuler(G.yawPitch)};
    const loop=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);const cx=innerWidth/2,cy=innerHeight/2;ctx.beginPath();ctx.arc(cx,cy,state.fov,0,Math.PI*2);ctx.strokeStyle=state.rgbFov?rgb():'rgba(207,167,255,.8)';ctx.lineWidth=1.5;ctx.stroke();let best=null;if(state.esp)for(const e of(G.enemies?.enemies||G.enemies?.agents||[])){if(e.dead || e.alive === false)continue;const h=drawEnemy(e);if(!h||h.dist>state.maxDistance)continue;const score=Math.hypot(h.x-cx,h.y-cy)+h.dist*.002;if(Math.hypot(h.x-cx,h.y-cy)<=state.fov&&(!best||score<best.score))best={...h,score};}if(state.aim&&((state.hold!==false&&state.aimHeld)||state.hold===false)&&best)aimAt(best);requestAnimationFrame(loop)}; loop();
  };
  waitForGame(boot);
})();
// ==/UserScript==

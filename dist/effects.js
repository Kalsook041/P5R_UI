import { researchModel } from './research-model.js';

const text = (key, label, value, max = 48) => ({key, label, value, type: 'text', max});
const range = (key, label, value, min, max, step = 1, unit = '') => ({key, label, value, type: 'range', min, max, step, unit});
export const effects = [
  {id:'title', name:'标题菜单', en:'TITLE MENU', category:'导航', icon:'↗', source:'V3 曲线复用', kind:'research', description:'双层异形底片，独立摆动。选中文字放大、旋转，切换带短促过冲。', hint:'悬停 / 点击菜单 · Tab + 方向键切换', controls:[text('items','菜单文字 · 每行一项','NEW GAME\nLOAD GAME\nMY PALACE\nCONFIG',120),range('fontSize','文字字号',32,18,52,1,'px'),range('tilt','选中倾角',-6,-14,14,1,'°'),range('amplitude','底片摆幅',1,0,3,.1,'×'),range('scale','选中缩放',1.3,1,1.6,.05,'×')]},
  {id:'pause',name:'暂停菜单',en:'PAUSE MENU',category:'导航',icon:'≡',source:'暂停菜单研究转译',kind:'research',description:'文字与高亮纸片分层运动，错位色片和倾斜字形带来鲜明的选择反馈。',hint:'悬停 / 点击选项 · 方向键切换',controls:[text('items','菜单文字 · 每行一项','SKILL\nITEM\nEQUIP\nPERSONA\nCONFIDANT',120),range('fontSize','文字字号',38,20,54,1,'px'),range('tilt','选中倾角',-7,-14,8,1,'°'),range('scale','选中缩放',1.14,1,1.4,.02,'×')]},
  {id:'place',name:'地点选择',en:'LOCATION SELECT',category:'导航',icon:'⌁',source:'75 ms 纸片曲线复用',kind:'research',description:'纸片沿根部独立伸展，先冲出再回收。文字位移与纸片伸缩保持分离。',hint:'点击地点 · 快速连续切换试试',controls:[text('items','地点文字 · 每行一项','秀尽学园\n涩谷\n四轩茶屋\n新宿\n秋叶原',120),range('fontSize','文字字号',29,18,42,1,'px'),range('extension','纸片伸展',1.12,1,1.5,.02,'×'),range('shift','文字位移',24,0,48,1,'px')]},
  {id:'dialogue',name:'怪盗对话框',en:'DIALOGUE BOX',category:'信息',icon:'❞',source:'原创风格扩展',kind:'study',description:'不规则气泡、错位名牌和逐字出现的对白，把普通提示变成一段剧情。',hint:'点击对话框可立即显示全文',controls:[text('title','角色名','MORGANA',24),text('body','对白内容','好戏现在才要开始。\n准备好，夺走他们的心！',180),range('fontSize','文字字号',25,16,38,1,'px'),range('typing','逐字间隔',45,10,150,5,'ms'),range('tilt','名牌倾角',-7,-15,10,1,'°')]},
  {id:'card',name:'怪盗预告信',en:'CALLING CARD',category:'信息',icon:'✉',source:'原创风格扩展',kind:'study',description:'拼贴式标题、锯齿边缘和黑白套色，制作一封属于你的预告信。',hint:'调整文字 · 点击重播入场',controls:[text('title','主标题','TAKE YOUR HEART',60),text('subtitle','收件人','致 每一个不甘平凡的你',60),text('body','信件正文','虚伪的面具，就由我们揭下。\n你的心，我们收下了。',160),range('fontSize','标题字号',48,24,66,1,'px'),range('tilt','信件倾角',-5,-12,12,1,'°')]},
  {id:'cutin',name:'撕裂式切入',en:'RIP & REVEAL',category:'动效',icon:'ϟ',source:'原创风格扩展',kind:'study',description:'锐角裂片划开画面，超大标题撞入视野。用于开场、章节或关键反馈。',hint:'点击重播 · 试试 0.5× 慢放',controls:[text('title','切入标题','SHOWTIME!',32),text('subtitle','副标题','LET THE REBELLION BEGIN',64),range('fontSize','标题字号',78,32,110,1,'px'),range('tilt','切入倾角',-8,-18,10,1,'°'),range('spread','裂片间距',18,4,42,1,'px')]},
  {id:'transition',name:'星芒转场',en:'STAR WIPE',category:'动效',icon:'✦',source:'原创风格扩展',kind:'study',description:'黑色星芒从中心骤然展开，再露出新的画面。可复制到页面切换或状态反馈。',hint:'点击画面 / 重播按钮触发转场',controls:[text('title','转场文字','MISSION START',48),text('subtitle','画面说明','THE NEXT CHAPTER IS YOURS.',64),range('fontSize','文字字号',58,26,84,1,'px'),range('rays','星芒数量',9,5,16,1),range('tilt','文字倾角',-6,-15,10,1,'°')]},
  {id:'stats',name:'能力数值条',en:'STATUS BARS',category:'信息',icon:'▥',source:'原创风格扩展',kind:'study',description:'斜切标签搭配分段数值条，带错峰填充。把能力、进度和数据一起展示。',hint:'拖动数值滑块 · 动态更新能力值',controls:[text('title','面板标题','PHANTOM STATUS',40),text('items','能力名称 · 每行一项','KNOWLEDGE\nGUTS\nPROFICIENCY\nKINDNESS\nCHARM',100),range('value1','知识 / KNOWLEDGE',80,0,100,1,'%'),range('value2','勇气 / GUTS',65,0,100,1,'%'),range('value3','灵巧 / PROFICIENCY',92,0,100,1,'%'),range('value4','体贴 / KINDNESS',48,0,100,1,'%'),range('value5','魅力 / CHARM',72,0,100,1,'%'),range('fontSize','文字字号',19,13,28,1,'px')]}
];

export function defaults(effect) {
  return Object.fromEntries([['accent','#ed123b'],['speed',1],...effect.controls.map(c=>[c.key,c.value])]);
}
export const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lettering=value=>Array.from(String(value)).map((c,i)=>c===' '?'<span class="letter-gap"> </span>':`<span class="cut-letter cut-${i%4}">${escapeHTML(c)}</span>`).join('');
export function normalize(effect, input = {}) {
  if (!input || typeof input !== 'object') input = {};
  const config = defaults(effect);
  for (const c of effect.controls) {
    if (c.type === 'select') {const option=c.options.find(o=>String(o.value)===String(input[c.key]));if(option)config[c.key]=option.value;}
    if (c.type === 'text' && typeof input[c.key] === 'string') config[c.key] = input[c.key].slice(0,c.max);
    if (c.type === 'range' && Number.isFinite(Number(input[c.key]))) config[c.key] = Math.min(c.max,Math.max(c.min,Number(input[c.key])));
  }
  if (/^#[0-9a-f]{6}$/i.test(input.accent)) config.accent=input.accent;
  if (Number.isFinite(Number(input.speed))) config.speed=Math.min(2,Math.max(.25,Number(input.speed)));
  return config;
}

export const sceneCSS = `
*{box-sizing:border-box}html,body{margin:0;min-height:100%;width:100%}body{background:#1a191b;color:#f6f2e8;font-family:'Microsoft YaHei','PingFang SC',sans-serif}button{font:inherit;color:inherit;cursor:pointer}button:focus-visible{outline:3px solid #fff;outline-offset:6px}#scene{min-height:100svh;position:relative;display:grid;place-items:center;overflow:hidden;padding:45px 32px;background:radial-gradient(circle at 1px 1px,#ffffff0c 1px,transparent 1.5px) 0 0/9px 9px}#scene.light{background-color:#dedbd2;color:#171719}.scene-mark{position:absolute;top:25px;left:25px;font:10px monospace;letter-spacing:2px;opacity:.4}.scene-index{position:absolute;bottom:-45px;right:8px;font:italic 200px Impact,'Arial Narrow',sans-serif;color:currentColor;opacity:.025;pointer-events:none}.display{font-family:Impact,'Arial Narrow','Microsoft YaHei',sans-serif;font-weight:900;letter-spacing:-.02em;line-height:1}.fx{width:min(100%,650px);position:relative;isolation:isolate;--paper:polygon(2% 17%,91% 0,100% 84%,7% 100%);--white:#f6f2e8}.fx button{border:0;background:none}.fx-title{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}.title-item{position:relative;min-width:110px;flex:1;padding:32px 5px;isolation:isolate}.title-item .plane{position:absolute;inset:17px -5px;z-index:-1;background:#2663df;clip-path:var(--paper);opacity:0}.title-item .plane.cyan{background:#36ebe4}.title-item .word{display:block;position:relative;font-size:var(--font);color:#eee;white-space:pre-line;overflow-wrap:anywhere;transform:rotate(-5deg);text-shadow:3px 3px #0c0c0d,-2px -2px #0c0c0d,2px -2px #0c0c0d,-2px 2px #0c0c0d;will-change:transform}.title-item[aria-pressed=true] .plane{opacity:1}.title-item[aria-pressed=true] .word{color:#fff}.title-item[aria-pressed=true]:after{content:'✦';position:absolute;color:white;font-size:50px;right:-5px;top:-10px;text-shadow:4px 3px #101012;transform:rotate(12deg)}.fx-title:before{content:'SELECT YOUR NEXT MOVE';position:absolute;font:10px monospace;letter-spacing:3px;top:-48px;left:50%;transform:translateX(-50%);white-space:nowrap;color:#949397}.fx-pause{max-width:340px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;transform:rotate(-4deg)}.pause-item{position:relative;padding:5px 34px!important;min-height:48px;z-index:0}.pause-item .word{display:block;font-size:var(--font);font-style:italic;text-shadow:3px 3px #111,-2px -2px #111;position:relative;transform-origin:left center}.pause-item .plane{position:absolute;inset:1px -24px 0 -10px;background:#33eee4;clip-path:polygon(0 15%,94% 0,100% 75%,5% 100%);z-index:-1;opacity:0;transform:rotate(-3deg)}.pause-item[aria-pressed=true] .plane{opacity:1}.pause-item[aria-pressed=true] .word{color:var(--accent)}.pause-item[aria-pressed=true]:before{content:'';position:absolute;inset:-8px -37px -10px -16px;background:var(--accent);clip-path:polygon(0 55%,13% 44%,5% 10%,28% 21%,82% 0,79% 25%,100% 51%,88% 60%,97% 100%,58% 78%,18% 100%);z-index:-2}.fx-place{display:flex;flex-direction:column;max-width:390px;gap:8px}.place-item{text-align:left;position:relative;min-height:48px;padding:9px 30px!important;isolation:isolate}.place-item .plane{position:absolute;inset:0;background:#efeee8;clip-path:polygon(7% 0,98% 8%,88% 90%,0 100%);z-index:-1;transform-origin:90% 50%}.place-item .word{display:block;font-size:var(--font);font-weight:900;color:#171719;position:relative;transform:rotate(-3deg);overflow-wrap:anywhere}.place-item[aria-pressed=true] .plane{background:var(--accent)}.place-item[aria-pressed=true] .word{color:#fff}.place-item[aria-pressed=true]:after{content:'➤';position:absolute;right:25px;top:14px;color:#fff}.fx-dialogue{padding:50px 26px 30px 36px;margin-top:20px;color:#161617;max-width:570px}.fx-dialogue:before{content:'';position:absolute;inset:-14px -10px -18px -14px;background:#fff;clip-path:polygon(0 14%,91% 0,100% 78%,72% 91%,67% 100%,62% 92%,4% 97%);z-index:-2}.fx-dialogue:after{content:'';position:absolute;inset:-7px -1px -8px -5px;background:#151517;clip-path:polygon(0 14%,91% 0,100% 78%,72% 91%,67% 100%,62% 92%,4% 97%);z-index:-1}.dialogue-name{position:absolute;top:-27px;left:-14px;background:var(--accent);padding:9px 20px;transform:rotate(var(--tilt));font-size:26px;max-width:95%;overflow-wrap:anywhere;color:#fff;box-shadow:5px 5px #fff}.dialogue-text{font-size:var(--font);font-weight:bold;line-height:1.8;min-height:100px;white-space:pre-line;color:#fff;overflow-wrap:anywhere}.dialogue-next{display:block;text-align:right;color:var(--accent);font-size:19px;animation:blink 1s steps(2) infinite}.fx-card{max-width:470px;padding:35px 40px;background:#f4eddf;color:#131315;transform:rotate(var(--tilt));border:8px solid #131315;outline:3px solid #f4eddf;box-shadow:17px 17px var(--accent);text-align:center}.card-seal{display:block;font-size:40px;color:var(--accent);margin-bottom:6px}.card-to{font-size:12px;letter-spacing:3px;border-bottom:2px solid;padding-bottom:12px;overflow-wrap:anywhere}.card-title{font-size:var(--font);line-height:1.05;margin:15px -10px;overflow-wrap:anywhere}.card-title span{background:#111;color:#fff;padding:0 5px;box-decoration-break:clone;-webkit-box-decoration-break:clone}.card-body{font-size:15px;line-height:1.9;white-space:pre-line;overflow-wrap:anywhere}.card-signature{font:italic 15px Impact,sans-serif;letter-spacing:3px;margin-top:20px;color:var(--accent)}.fx-cutin{text-align:center;max-width:650px;transform:rotate(var(--tilt));padding:45px 12px}.fx-cutin:before,.fx-cutin:after{content:'';position:absolute;inset:-12px -60px;background:var(--accent);z-index:-2;clip-path:polygon(0 42%,28% 21%,11% 0,64% 16%,87% 0,80% 26%,100% 58%,74% 64%,91% 100%,41% 80%,8% 98%,20% 65%)}.fx-cutin:after{inset:var(--spread) -35px;background:#f6f2e8;clip-path:polygon(0 28%,93% 0,100% 85%,6% 100%);z-index:-1}.cutin-title{font-size:var(--font);color:#111;font-style:italic;text-shadow:4px 4px var(--accent);overflow-wrap:anywhere}.cutin-subtitle{display:inline-block;background:#111;padding:7px 14px;margin-top:20px;font:12px monospace;letter-spacing:3px;overflow-wrap:anywhere;max-width:100%;color:#fff}.fx-transition{text-align:center;min-height:230px;display:flex;flex-direction:column;justify-content:center;align-items:center}.wipe-title{font-size:var(--font);position:relative;transform:rotate(var(--tilt));z-index:2;text-shadow:5px 5px var(--accent);overflow-wrap:anywhere;max-width:100%}.wipe-subtitle{position:relative;z-index:2;font:11px monospace;letter-spacing:3px;margin-top:20px;overflow-wrap:anywhere;max-width:100%}.wipe-star{position:absolute;width:140vmax;height:140vmax;background:var(--accent);z-index:0;transform:scale(0);pointer-events:none}.fx-stats{max-width:450px}.stats-title{font-size:28px;transform:rotate(-4deg);margin-bottom:28px;background:var(--accent);padding:8px 16px;display:inline-block;overflow-wrap:anywhere;max-width:100%}.stat-row{display:grid;grid-template-columns:135px 1fr 32px;gap:12px;margin:13px 0;align-items:center;transform:skew(-8deg)}.stat-label{font-size:var(--font);overflow-wrap:anywhere}.stat-track{height:21px;background:#3c3a3e;border:2px solid #f4f0e8;padding:2px}.stat-fill{height:100%;width:var(--value);background:repeating-linear-gradient(90deg,var(--accent) 0,var(--accent) 15px,transparent 15px,transparent 18px);transform-origin:left}.stat-number{font:18px Impact,sans-serif;color:var(--accent)}@keyframes blink{to{opacity:.25}}@media(max-width:500px){#scene{padding:52px 25px}.fx-title{gap:0 15px}.title-item{flex:0 0 42%;min-width:0;padding:28px 2px}.title-item .word{font-size:min(var(--font),9vw)}.fx-title:before{top:-25px;font-size:8px}.fx-card{padding:25px 18px}.card-title{font-size:min(var(--font),11vw)}.cutin-title{font-size:min(var(--font),14vw)}.stat-row{grid-template-columns:100px 1fr 26px;gap:8px}.stat-label{font-size:min(var(--font),4vw)}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
`;

export function markup(id, c) {
  const esc=escapeHTML, lines=String(c.items||'').split('\n').filter(x=>x.trim()).slice(0,5);
  if(['title','pause','place'].includes(id)) return `<nav class="fx fx-${id}" aria-label="${id} menu">${lines.map((s,i)=>`<button class="${id}-item" aria-label="${esc(s)}" aria-pressed="${i===0}" data-index="${i}">${id==='title'?'<i class="plane blue"></i><i class="plane cyan"></i>':'<i class="plane"></i>'}<span class="word display">${id==='place'?esc(s):lettering(s)}</span></button>`).join('')}</nav>`;
  if(id==='dialogue')return `<div class="fx fx-dialogue" role="button" tabindex="0" aria-label="显示完整对白"><strong class="dialogue-name display">${esc(c.title)}</strong><div class="dialogue-text"></div><span class="dialogue-next" aria-hidden="true">▼</span></div>`;
  if(id==='card')return `<article class="fx fx-card"><span class="card-seal" aria-hidden="true">✦</span><div class="card-to">${esc(c.subtitle)}</div><h1 class="card-title display"><span>${esc(c.title)}</span></h1><p class="card-body">${esc(c.body)}</p><div class="card-signature">— THE PHANTOM THIEVES —</div></article>`;
  if(id==='cutin')return `<div class="fx fx-cutin"><div class="cutin-title display">${esc(c.title)}</div><div class="cutin-subtitle">${esc(c.subtitle)}</div></div>`;
  if(id==='transition')return `<button class="fx fx-transition" aria-label="重播星芒转场"><i class="wipe-star"></i><span class="wipe-title display">${esc(c.title)}</span><span class="wipe-subtitle">${esc(c.subtitle)}</span></button>`;
  return `<section class="fx fx-stats"><div class="stats-title display">${esc(c.title)}</div>${lines.map((s,i)=>`<div class="stat-row"><span class="stat-label display">${esc(s)}</span><div class="stat-track" role="meter" aria-label="${esc(s)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c['value'+(i+1)]}"><div class="stat-fill" style="--value:${c['value'+(i+1)]}%"></div></div><span class="stat-number">${c['value'+(i+1)]}</span></div>`).join('')}</section>`;
}

// Serialized into every export. Keep this function independent of module scope.
export function boot(config, model) {
  const root=document.querySelector('#scene'), fx=root.querySelector('.fx');
  const fit=root.querySelector('.fit');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let clock=0, last=performance.now(), selected=0, paused=false, speed=config.speed, alive=true, raf;
  const animations=[];
  let suspended=[];
  function fitScene(){
    const angle=Math.abs(config.tilt||0)*Math.PI/180,w=fx.offsetWidth,h=fx.offsetHeight;
    const width=w*Math.cos(angle)+h*Math.sin(angle),height=h*Math.cos(angle)+w*Math.sin(angle);
    fit.style.transform=`scale(${Math.min(1,Math.max(.1,(root.clientWidth-64)/(width+28)),Math.max(.1,(root.clientHeight-92)/(height+20)))})`;
  }
  const observer=new ResizeObserver(fitScene);observer.observe(fx);observer.observe(root);
  const buttons=[...root.querySelectorAll('[data-index]')];
  const enter=[[0,0],[.008,.30],[.025,1.075],[.045,1.025],[.075,1]];
  const exit=[[0,1],[.012,.55],[.033,.10],[.055,0]];
  let transitions=buttons.map((_,i)=>({from:i===0?1:0,to:i===0?1:0,start:0}));
  const sample=(track,t)=>{if(t<=track[0][0])return track[0].slice(1);for(let i=1;i<track.length;i++){const a=track[i-1],b=track[i];if(t<=b[0])return a.slice(1).map((v,j)=>v+(b[j+1]-v)*(t-a[0])/(b[0]-a[0]));}return track.at(-1).slice(1);};
  const amount=(tr,t)=>tr.from===tr.to?tr.to:tr.to?tr.from+(1-tr.from)*sample(enter,t-tr.start)[0]:tr.from*sample(exit,t-tr.start)[0];
  const pose=(i,t)=>{const tr=transitions[i];if(config.id==='place')return amount(tr,t);if(tr.from===tr.to)return tr.to;const age=t-tr.start, curve=tr.to?model.curves.enter[i%4]:model.curves.exit[i%4];const value=sample(curve,age)[0];const normalized=(value-model.baseline)/(model.selected-model.baseline);return tr.to?tr.from+(1-tr.from)*normalized:tr.from*normalized;};
  const anglePose=(i,t)=>{
    const tr=transitions[i];if(tr.from===tr.to)return tr.to;
    const curve=tr.to?model.curves.enter[i%4]:model.curves.exit[i%4];
    const denominator=tr.to?curve.at(-1)[2]:curve[0][2],ratio=denominator?sample(curve,t-tr.start)[1]/denominator:tr.to;
    const from=tr.angleFrom??tr.from;return tr.to?from+(1-from)*ratio:from*ratio;
  };
  function choose(index){
    if(index===selected)return;
    const current=transitions.map((_,i)=>pose(i,clock));
    const angles=config.id==='place'?current:transitions.map((_,i)=>anglePose(i,clock));selected=index;
    transitions=current.map((v,i)=>({from:reduced.matches||paused?(i===index?1:0):v,angleFrom:angles[i],to:i===index?1:0,start:clock}));
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));draw();
  }
  buttons.forEach((b,i)=>{b.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover)').matches)choose(i);});b.addEventListener('click',()=>choose(i));b.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%buttons.length;if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i-1+buttons.length)%buttons.length;if(e.key==='Home')next=0;if(e.key==='End')next=buttons.length-1;if(next!==undefined){e.preventDefault();choose(next);buttons[next].focus();}});});
  function addAnimation(el,frames,options){if(!el||reduced.matches)return;const a=el.animate(frames,{fill:'both',...options});a.playbackRate=speed;if(paused)a.pause();animations.push(a);}
  function replay(){
    animations.splice(0).forEach(a=>a.cancel());suspended=suspended.filter(a=>a.playState==='paused');clock=0;last=performance.now();
    if(config.id==='transition'){
      const star=root.querySelector('.wipe-star'), n=config.rays;
      const points=Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n,r=i%2?19:50;return `${50+Math.cos(a)*r}% ${50+Math.sin(a)*r}%`;});star.style.clipPath=`polygon(${points.join(',')})`;
      addAnimation(star,[{transform:'rotate(-35deg) scale(0)',offset:0},{transform:'rotate(0deg) scale(1)',offset:.42},{transform:'rotate(15deg) scale(1)',offset:.6},{transform:'rotate(32deg) scale(0)',offset:1}],{duration:1100,easing:'cubic-bezier(.76,0,.24,1)'});
      addAnimation(root.querySelector('.wipe-title'),[{opacity:0,translate:'-60px 0'},{opacity:1,translate:'0 0'}],{duration:300,delay:500});
    }else if(config.id==='stats')root.querySelectorAll('.stat-fill').forEach((el,i)=>addAnimation(el,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:600,delay:i*70,easing:'cubic-bezier(.2,.9,.3,1.2)'}));
    else if(!buttons.length)addAnimation(fx,[{opacity:0,translate:'70px 15px',scale:'.8'},{opacity:1,translate:'-8px -2px',scale:'1.035',offset:.65},{opacity:1,translate:'0 0',scale:'1'}],{duration:450,easing:'ease-out'});
    if(buttons.length){selected=-1;choose(0);}
    draw();fitScene();
  }
  function draw(){
    buttons.forEach((b,i)=>{
      const p=pose(i,clock),word=b.querySelector('.word');
      if(config.id==='title'){
        word.style.transform=`rotate(${-5+(config.tilt+5)*anglePose(i,clock)}deg) scale(${1+(config.scale-1)*p})`;
        b.querySelectorAll('.plane').forEach((plane,j)=>{
          const co=model.idle.planes[j?'cyan':'blue']||model.idle.planes.blue;
          const phase=clock/model.idle.period*Math.PI*2;
          const points=co[0].map((point,k)=>point.map((v,d)=>{for(let h=1;h<=model.idle.harmonics;h++)v+=config.amplitude*(co[2*h-1][k][d]*Math.cos(h*phase)+co[2*h][k][d]*Math.sin(h*phase));return v;}));
          plane.style.clipPath=`polygon(${points.map(([x,y])=>`${50+x/3.5}% ${50+y/1.6}%`).join(',')})`;
          plane.style.transform=`scale(${.8+.2*p})`;plane.style.opacity=String(Math.max(0,Math.min(1,p)));
        });
      }else if(config.id==='pause')word.style.transform=`rotate(${config.tilt*anglePose(i,clock)}deg) scale(${1+(config.scale-1)*p})`;
      else {b.querySelector('.plane').style.transform=`scaleX(${1+(config.extension-1)*p}) rotate(${-2*p}deg)`;word.style.transform=`translateX(${-config.shift*p}px) rotate(-3deg)`;}
    });
    if(config.id==='dialogue')root.querySelector('.dialogue-text').textContent=reduced.matches?config.body:Array.from(config.body).slice(0,Math.floor(clock*1000/config.typing)).join('');
  }
  if(config.id==='dialogue'){
    const reveal=()=>{clock=Math.max(clock,Array.from(config.body).length*config.typing/1000);draw();};
    fx.addEventListener('click',reveal);fx.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal();}});
  }
  if(config.id==='transition')fx.addEventListener('click',replay);
  addEventListener('message',e=>{if(e.source!==parent||e.data?.channel!=='phantom-ui')return;const d=e.data;
    if(d.action==='pause'){
      const next=Boolean(d.value);
      if(next&&!paused){suspended=document.getAnimations().filter(a=>a.playState==='running'||a.playState==='pending');suspended.forEach(a=>a.pause());}
      if(!next&&paused){const resume=new Set([...suspended,...animations.filter(a=>a.playState==='paused')]);resume.forEach(a=>{if(a.playState==='paused')a.play();});suspended=[];}
      paused=next;
    }
    if(d.action==='speed'&&Number.isFinite(d.value)&&d.value>=.25&&d.value<=2){speed=d.value;animations.forEach(a=>a.playbackRate=speed);}
    if(d.action==='replay')replay();
    if(d.action==='background')root.classList.toggle('light',d.value==='light');
  });
  const reduce=()=>{animations.splice(0).forEach(a=>a.cancel());transitions=buttons.map((_,i)=>({from:i===selected?1:0,to:i===selected?1:0,start:clock}));draw();};reduced.addEventListener('change',reduce);
  function tick(now){if(!alive)return;const delta=Math.min(.1,Math.max(0,(now-last)/1000));last=now;if(!paused&&!reduced.matches)clock+=delta*speed;draw();raf=requestAnimationFrame(tick);}
  addEventListener('pagehide',()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect();reduced.removeEventListener('change',reduce);animations.forEach(a=>a.cancel());});
  replay();raf=requestAnimationFrame(tick);
}

export function generate(effect, input) {
  const config={...normalize(effect,input),id:effect.id};
  const style=`:root{--accent:${config.accent};--font:${config.fontSize}px;--tilt:${config.tilt||0}deg;--spread:${config.spread||18}px}\n${sceneCSS}\n#scene{height:100svh;min-height:0;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.fit{width:min(100%,650px);position:relative;display:grid;place-items:center;min-width:0;transform-origin:center}.title-item[aria-pressed=true]:after{color:var(--accent)}.cut-letter{display:inline-block;font-family:Georgia,'Times New Roman','Microsoft YaHei',serif;font-weight:900;letter-spacing:-.08em;line-height:1;text-shadow:3px 3px #000,-2px -2px #000,2px -2px #000,-2px 2px #000;transform:rotate(-4deg)}.cut-1{font-family:Impact,'Arial Narrow','Microsoft YaHei',sans-serif;transform:rotate(5deg) translateY(-.025em);font-size:.88em}.cut-2{transform:rotate(-6deg) translateY(.04em);font-size:1.06em}.cut-3{font-family:Impact,'Arial Narrow','Microsoft YaHei',sans-serif;transform:rotate(3deg);font-size:.93em}.letter-gap{display:inline-block;width:.16em}.title-item .word,.pause-item .word{white-space:nowrap;letter-spacing:-.04em}`;
  const html=`<main id="scene"><span class="scene-mark" aria-hidden="true">PHANTOM UI / ${effect.en}</span><span class="scene-index" aria-hidden="true">P5.</span><div class="fit">${markup(effect.id,config)}</div></main>`;
  // Escape '<' in JSON so custom text can never terminate the script element.
  const serialize=value=>JSON.stringify(value).replace(/</g,'\\u003c');
  const model=['title','pause'].includes(effect.id)?researchModel:null;
  const license=`/* PHANTOM UI · MIT License · Copyright (c) 2026 PHANTOM UI contributors\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE. */`;
  const js=`${license}\n// ${effect.source}\nconst config = ${serialize(config)};\nconst model = ${serialize(model)};\n(${boot.toString()})(config, model);`;
  const full=`<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${escapeHTML(effect.name)} · PHANTOM UI</title>\n<style>\n${style}\n</style>\n</head>\n<body>\n${html}\n<script>\n${js}\n</script>\n</body>\n</html>`;
  return {html,css:style,js,full};
}

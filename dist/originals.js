import {originals} from './original-data.js';
import {normalize} from './effects.js';
const r=(key,label,value,min,max,step,unit='×')=>({key,label,value,min,max,step,unit,type:'range'});
export const originalEffects={
 title:{id:'title',controls:[r('amplitude','双底片摆幅',1,0,2,.1),r('period','底片周期',1.05,.4,2,.05,'s'),r('scale','选中字形缩放',1.3,1.05,1.6,.05),r('angle','倾角倍率',1,0,2,.1)]},
 pause:{id:'pause',controls:[r('amplitude','高亮纸片摆幅',1,0,2,.1),r('emphasis','选中字形倍率',1,.8,1.3,.05),r('angle','选中倾角倍率',1,0,2,.1)]}
};
// Runs only inside exported pages; accepted renderers are included before it.
export async function startOriginal(config,data){
  const stage=document.querySelector('#originalStage'),message=document.querySelector('#originalStatus');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let controller,paused=false,speed=config.speed,clock=0,last=performance.now(),selected=0,previous=0,changed=-5,raf,disposed=false,titleGeneration=0;
  const pending=[];
  function command(d){
    if(!controller){pending.push(d);return;}
    if(d.action==='speed'){speed=d.value;controller?.setSpeed?.(speed);}
    if(d.action==='pause'){paused=Boolean(d.value);controller?.setPaused?.(paused);}
    if(d.action==='replay'){clock=0;changed=-5;selected=0;previous=0;controller?.select?.(0,{animate:false});controller?.destroy?.();if(config.id==='title')mountTitle().catch(fail);updateButtons();}
    if(d.action==='background'){
      const next=d.value==='light',changed=stage.classList.contains('neutral')!==next;stage.classList.toggle('neutral',next);
      if(changed&&config.id==='title'){const index=controller.getState().selectedIndex;controller.destroy();mountTitle(index).catch(fail);}
    }
  }
  addEventListener('message',e=>{if(e.source!==parent||e.data?.channel!=='phantom-ui')return;if(!controller){pending.push(e.data);return;}command(e.data);});
  function fail(e){message.hidden=false;message.textContent='组件加载失败：'+e.message;console.error(e);}
  const model=structuredClone(data.model);
  if(config.id==='title'){
    model.idle.period=config.period;
    for(const planes of Object.values(model.idle.planes))for(let h=1;h<planes.length;h++)for(const point of planes[h]){point[0]*=config.amplitude;point[1]*=config.amplitude;}
    const gain=(config.scale-1)/(model.selected/model.baseline-1);
    const oldSelected=model.selected;model.selected=model.baseline+(oldSelected-model.baseline)*gain;
    model.angles=model.angles.map(a=>a*config.angle);
    for(const group of ['enter','exit'])for(const track of model.curves[group])for(const p of track){p[1]=model.baseline+(p[1]-model.baseline)*gain;p[2]*=config.angle;}
  }else{
    for(const rows of model.idle)for(let k=1;k<rows.length;k++)rows[k]=rows[k].map(v=>v*config.amplitude);
  }
  async function mountTitle(initialIndex=0){
    const generation=++titleGeneration;controller=null;
    const next=await createP5RMenu(stage,{initialIndex,modelUrl:'data:application/json,'+encodeURIComponent(JSON.stringify(model)),assetUrls:data.images,backgroundUrl:stage.classList.contains('neutral')?null:data.background,speed,onChange:({label})=>{message.textContent=label;}});
    if(disposed||generation!==titleGeneration){next.destroy();return;}
    controller=next;controller.setPaused(paused);message.hidden=true;pending.splice(0).forEach(command);
  }
  function updateButtons(){document.querySelectorAll('[data-choice]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));}
  try{
    if(config.id==='title')await mountTitle();
    else{
      const images={};await Promise.all(Object.entries(data.images).map(async([name,url])=>{const image=new Image();image.src=url;await image.decode();images[name]=image;}));
      const menu=new PauseMenu(model,images);controller={};
      const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
      function choose(i){if(selected===i)return;previous=selected;selected=i;changed=paused||reduced.matches?clock-5:clock;updateButtons();}
      const nav=document.querySelector('#originalChoices');
      model.labels.forEach((label,i)=>{const b=document.createElement('button');b.textContent=label;b.dataset.choice=i;b.setAttribute('aria-label',label);b.addEventListener('click',()=>choose(i));nav.append(b);});updateButtons();
      canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect(),i=menu.hit((e.clientX-r.left)/r.width*1920,(e.clientY-r.top)/r.height*1080);if(i>=0)choose(i);});
      canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(),i=menu.hit((e.clientX-r.left)/r.width*1920,(e.clientY-r.top)/r.height*1080);if(i>=0)choose(i);});
      canvas.addEventListener('keydown',e=>{const steps={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1};if(e.key in steps){e.preventDefault();choose((selected+steps[e.key]+10)%10);}if(e.key==='Home'){e.preventDefault();choose(0);}if(e.key==='End'){e.preventDefault();choose(9);}});
      function frame(now){if(disposed)return;const dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;if(!paused&&!reduced.matches)clock+=dt*speed;
        ctx.fillStyle='#111';ctx.fillRect(0,0,1920,1080);if(!stage.classList.contains('neutral'))ctx.drawImage(images['plate.jpg'],0,0,1920,1080);
        const state=menu.freeState(selected,previous,clock-changed,clock,!reduced.matches);
        state.poses[selected][2]*=config.emphasis;state.poses[selected][3]*=config.emphasis;state.poses[selected][4]*=config.angle;
        ctx.drawImage(menu.render(state),0,0);raf=requestAnimationFrame(frame);
      }
      message.hidden=true;raf=requestAnimationFrame(frame);
    }
    pending.splice(0).forEach(command);
  }catch(e){fail(e);}
  addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);controller?.destroy?.();});
}

export function generateOriginal(effect,input){
  const config={...normalize(originalEffects[effect.id],input),id:effect.id};
  const data=originals[effect.id];
  const css=`*{box-sizing:border-box}html,body{margin:0;height:100%;background:#050505;color:white;font-family:'Microsoft YaHei',sans-serif}body{display:flex;flex-direction:column;justify-content:center;overflow:hidden}#originalStage{width:100%;position:relative;flex:none}#originalStage>canvas{display:block;width:100%;aspect-ratio:16/9}#originalStage.neutral{background:#161616}#originalStatus{position:absolute;inset:0;display:grid;place-items:center;background:#111;font-size:12px}#originalStatus[hidden]{display:none}#originalChoices{display:flex;justify-content:center;flex-wrap:wrap;gap:4px;padding:10px;background:#080808}#originalChoices button{font:10px Georgia,serif;background:none;border:1px solid #444;color:#ddd;padding:5px 8px;cursor:pointer}#originalChoices [aria-pressed=true]{color:#111;background:#00ffff;border-color:#00ffff}button:focus-visible,canvas:focus-visible{outline:2px solid cyan;outline-offset:-2px}@media(max-width:500px){#originalChoices{padding:7px;gap:3px}#originalChoices button{font-size:8px;padding:4px 6px}}`;
  const html=`<main id="originalStage">${effect.id==='pause'?'<canvas width="1920" height="1080" tabindex="0" aria-label="原版暂停菜单，方向键选择"></canvas>':''}<div id="originalStatus" role="status">正在加载原版字形与纸片…</div></main>${effect.id==='pause'?'<nav id="originalChoices" aria-label="暂停菜单选项"></nav>':''}`;
  // The source adapter only changes loading to embedded data. Accepted draw routines stay intact.
  const rawSource=data.source;
  const payload={...data,source:undefined};
  const serialize=v=>JSON.stringify(v).replace(/</g,'\\u003c');
  const header='// PHANTOM UI original reconstruction. Code: MIT; embedded game imagery: original rights retained.\n';
  const js=header+rawSource+`\nconst config=${serialize(config)};\nconst originalAssets=${serialize(payload)};\n(${startOriginal.toString()})(config,originalAssets);`;
  const displayJS=header+rawSource+`\nconst config=${JSON.stringify(config,null,2)};\n// 图像和测量数据在此折叠显示；复制/下载将包含全部内嵌数据。\nconst originalAssets = /* embedded data */ {};\n(${startOriginal.toString()})(config,originalAssets);`;
  const wrap=code=>`<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>P5R ${effect.name} · 原版复刻</title><style>${css}</style></head><body>${html}<script>${code.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
  return{html,css,js,full:wrap(js),display:{js:displayJS,full:wrap(displayJS)},original:true};
}

import {resourceData} from './resource-data.js';
import {normalize,escapeHTML} from './effects.js';
const r=(key,label,value,min,max,step=1,unit='')=>({key,label,value,min,max,step,unit,type:'range'});
const t=(key,label,value,max=100)=>({key,label,value,max,type:'text'});
const s=(key,label,value,options)=>({key,label,value,type:'select',options:options.map((label,i)=>({value:i,label}))});
export const resourceEffects=[
 {id:'calendar',name:'日期与天气',en:'DATE / TIME HUD',category:'信息',icon:'◷',kind:'research',resource:true,badge:'原素材重组',source:'CALENDAR 原图层 + 本地录屏',description:'月份和日期由白／黑衬底与原字形组成，星期、时段、天气保留原图。布局参考 5/23 录屏，局部拟合；未恢复原 shader。',hint:'调整日期、星期、时段与天气 · 静态原资源重组',details:'SC.CPK → CALENDAR/P5_FIELD_DAY.SPD、P5_TIME.SPD。月份 1–12、数字 0–9 的三层原资源独立组装。以本地 12.29.37 录屏 4 秒的 5/23 Monday 为静态参照；完整动态形变没有恢复。自动星期使用 2016 年游戏历法，日期自动限制在该月合法天数。',controls:[r('month','月份',5,1,12),r('day','日期',23,1,31),s('weekday','星期',0,['自动 · 2016 年历法','星期一','星期二','星期三','星期四','星期五','星期六','星期日']),s('period','时段',5,['早晨','上午','白天','午休','下午','放学后','夜晚','深夜']),s('weather','天气',0,['晴天','雨天','多云','雪天']),s('warning','天气警报',3,['无','梅雨','台风','花粉预警','局部暴雨','热岛效应','流感预警','热带夜']),r('zoom','展示缩放',1,.65,1.2,.05,'×')]},
 {id:'sharp-dialogue',name:'尖角对白',en:'ANGULAR DIALOGUE',category:'信息',icon:'❞',kind:'research',resource:true,badge:'原网格重绘',source:'FONT/MSW.PLG · 6 个原网格',description:'直接绘制两组尖角对白的三层原三角网格，文字独立排版。入场与逐字速度是网页演示参数。',hint:'点击显示完整对白 · 入场 / 逐字动效为演示',details:'BASE.CPK → FONT/MSW.PLG。6 个网格共 878 个顶点、3915 个索引，分为 ikari01 / ikari02 两组，每组 c / b / a 三层。顶点与三角拓扑原样保留，黑白着色和文字位置是网页重组。没有对应本地对话录屏，入场、逐字与提示光标节奏不是实测游戏常量。',controls:[t('title','角色名','MORGANA',24),t('body','对白内容','好戏现在才要开始。\n准备好，夺走他们的心！',160),s('variant','对白网格',0,['ikari 02 · 尖角','ikari 01 · 宽尖角']),r('fontSize','对白字号',31,20,43,1,'px'),r('typing','逐字间隔 · 演示',40,10,100,5,'ms'),r('duration','入场时长 · 演示',180,0,500,10,'ms'),r('zoom','展示缩放',1,.65,1.15,.05,'×')]},
 {id:'loading',name:'TAKE YOUR TIME',en:'LOADING / TAKE YOUR TIME',category:'动效',icon:'♥',kind:'research',resource:true,badge:'原素材 · 演示循环',source:'NOWLOADING 1 / 2 / 3 原图集',description:'三套原人物状态、原标语和三种爱心图形独立绘制。循环周期可调，目前未取得原版加载时序。',hint:'点击图标暂停 / 继续 · 循环周期为网页演示',details:'SC.CPK → FIELD/PANEL/WIPE/SYMBOL/NOWLOADING.SPD、NOWLOADING2.SPD、NOWLOADING3.SPD。每组 5 个 sprite，包含人物、TAKE YOUR TIME 和大／中／小爱心。本页保留原图像，摆动、爱心轨迹和周期为可调演示，不是恢复的加载状态机。',controls:[s('pose','人物状态',0,['低头','抬头','花环']),r('period','循环周期 · 演示',1.8,.6,4,.1,'s'),r('hearts','爱心数量',3,0,6),r('amplitude','摆动幅度 · 演示',1,0,2,.1,'×'),t('caption','附加说明文字','正在潜入下一幕……',60),r('zoom','展示缩放',1,.65,1.25,.05,'×')]}
];

export function normalizeResource(effect,input){
 const c=normalize(effect,input);
 if(effect.id==='calendar')c.day=Math.min(c.day,new Date(Date.UTC(2016,c.month,0)).getUTCDate());
 return c;
}

// Included as source in every standalone export. No module or network dependency.
export async function bootResource(config,data){
 const canvas=document.querySelector('#resourceCanvas'),ctx=canvas.getContext('2d'),status=document.querySelector('#resourceStatus'),spoken=document.querySelector('#resourceText');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let clock=0,last=performance.now(),paused=false,speed=config.speed,light=false,alive=true,raf;
 const images={},tints=new Map();
 function sprite(key,x,y,w,h,color){
  let image=images[key];if(!image)return;
  if(color){const k=key+':'+color;if(!tints.has(k)){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const q=c.getContext('2d');q.drawImage(image,0,0);q.globalCompositeOperation='source-in';q.fillStyle=color;q.fillRect(0,0,c.width,c.height);tints.set(k,c);}image=tints.get(k);}
  ctx.drawImage(image,x,y,w??image.width,h??image.height);
 }
 const dims=key=>({w:images[key].width,h:images[key].height});
 function rotateSprite(key,cx,cy,scale,angle=0,color){const a=dims(key);ctx.save();ctx.translate(cx,cy);ctx.rotate(angle*Math.PI/180);sprite(key,-a.w*scale/2,-a.h*scale/2,a.w*scale,a.h*scale,color);ctx.restore();}
 function stack(ids,cx,cy,scale,angle=0){
  ids.forEach((id,i)=>rotateSprite('field_'+id,cx,cy,scale,angle,i===1?'#000':'#fff'));
 }
 function drawCalendar(){
  const month=config.month,day=String(config.day).padStart(2,'0');
  const actual=(new Date(Date.UTC(2016,month,config.day)).getUTCDay()+6)%7;
  const weekday=config.weekday?config.weekday-1:actual;
  ctx.save();ctx.translate(450,275);ctx.scale(config.zoom,config.zoom);ctx.translate(-260,-190);
  stack([month,month+12,month+24],98,111,.5);
  for(let i=0;i<2;i++){const digit=Number(day[i]);stack([37+digit,47+digit,57+digit],i?260:180,i?102:122,.5,i?-1:-4);}
  rotateSprite('field_96',365,64,.5,0,'#fff');rotateSprite('field_'+(97+config.weather),365,64,.5,0,'#000');
  rotateSprite('time_'+(9+weekday),275,160,.5,-12);
  // Full authored time glyphs preserve internal black/white channels; do not flatten them to alpha.
  const periodKey='time_'+(config.period+1);
  rotateSprite(periodKey,115,277,.35,-12);
  const warnings=[null,101,102,103,105,106,107,117];
  if(warnings[config.warning])rotateSprite('field_'+warnings[config.warning],350,248,.5);
  ctx.restore();
 }
 function mesh(m,color){ctx.fillStyle=color;ctx.beginPath();for(const tri of m.triangles){ctx.moveTo(...m.vertices[tri[0]]);ctx.lineTo(...m.vertices[tri[1]]);ctx.lineTo(...m.vertices[tri[2]]);ctx.closePath();}ctx.fill();}
 function wrap(text,width){
  const lines=[];for(const paragraph of String(text).split('\n')){let line='';for(const char of Array.from(paragraph)){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}lines.push(line);}return lines;
 }
 function drawDialogue(){
  const group=data.dialogue.slice(config.variant*3,config.variant*3+3),b=group[0].bounds;
  const duration=config.duration/1000,p=reduce.matches||!duration?1:Math.min(1,clock/duration),enter=1-Math.pow(1-p,3);
  ctx.save();ctx.translate(450+(1-enter)*100,300);ctx.scale(.51*config.zoom*(.92+.08*enter),.51*config.zoom);ctx.globalAlpha=enter;ctx.translate(-(b[0]+b[2])/2,-(b[1]+b[3])/2);
  group.forEach((m,i)=>mesh(m,i===1?'#fff':'#080808'));
  ctx.globalAlpha=enter;ctx.fillStyle='#fff';ctx.font=`bold ${config.fontSize*1.7}px 'Microsoft YaHei',sans-serif`;
  const content=reduce.matches?config.body:Array.from(config.body).slice(0,Math.floor(clock*1000/config.typing)).join('');
  wrap(content,920).slice(0,3).forEach((line,i)=>ctx.fillText(line,20,15+i*config.fontSize*2.35));
  ctx.save();ctx.translate(3,b[1]+1);ctx.rotate(-.07);ctx.fillStyle=config.accent;ctx.fillRect(-10,-44,Math.min(600,Math.max(220,ctx.measureText(config.title).width+70)),82);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.strokeRect(-10,-44,Math.min(600,Math.max(220,ctx.measureText(config.title).width+70)),82);ctx.fillStyle='#fff';ctx.font="bold 43px Georgia,'Microsoft YaHei',serif";ctx.fillText(config.title,10,15,560);ctx.restore();
  if(reduce.matches||Math.floor(clock*2)%2===0){ctx.fillStyle=config.accent;ctx.beginPath();ctx.moveTo(990,170);ctx.lineTo(1018,166);ctx.lineTo(1008,190);ctx.closePath();ctx.fill();}
  ctx.restore();
 }
 function drawLoading(){
  const group=config.pose+1,phase=clock/config.period*Math.PI*2;
  ctx.save();ctx.translate(450,270);ctx.scale(config.zoom,config.zoom);
  const bob=reduce.matches?0:Math.sin(phase)*4*config.amplitude;
  rotateSprite(`load${group}_1`,0,-12+bob,.38,reduce.matches?0:Math.sin(phase)*1.3*config.amplitude);
  rotateSprite(`load${group}_2`,0,178,.48);
  for(let i=0;i<config.hearts;i++){
   const p=reduce.matches?i/Math.max(1,config.hearts):(clock/config.period+i/Math.max(1,config.hearts))%1;
   ctx.globalAlpha=.9*Math.sin(p*Math.PI);const x=92+p*93+Math.sin(p*7+i)*18,y=26-p*190;
   rotateSprite(`load${group}_${3+i%3}`,x,y,.45*(1-.35*p),Math.sin(p*4)*17,config.accent);
  }
  ctx.globalAlpha=1;ctx.fillStyle=light?'#111':'#d7d2cc';ctx.font="16px 'Microsoft YaHei',sans-serif";ctx.textAlign='center';ctx.fillText(config.caption,0,225,620);ctx.restore();
 }
 function draw(){
  ctx.clearRect(0,0,900,560);ctx.fillStyle=light?'#ddd9cf':'#111113';ctx.fillRect(0,0,900,560);
  if(config.id==='calendar')drawCalendar();else if(config.id==='sharp-dialogue')drawDialogue();else drawLoading();
 }
 function tick(now){if(!alive)return;const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;if(!paused&&!reduce.matches)clock+=dt*speed;draw();raf=requestAnimationFrame(tick);}
 const reveal=()=>{if(config.id==='sharp-dialogue'){clock=Math.max(clock,Array.from(config.body).length*config.typing/1000);draw();}if(config.id==='loading'){paused=!paused;canvas.setAttribute('aria-pressed',String(paused));}};
 canvas.addEventListener('click',reveal);canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal();}});
 addEventListener('message',e=>{if(e.source!==parent||e.data?.channel!=='phantom-ui')return;const d=e.data;
  if(d.action==='pause'){paused=Boolean(d.value);canvas.setAttribute('aria-pressed',String(paused));}
  if(d.action==='speed'&&Number.isFinite(d.value)&&d.value>=.25&&d.value<=2)speed=d.value;
  if(d.action==='replay'){clock=0;last=performance.now();draw();}
  if(d.action==='background'){light=d.value==='light';draw();}
 });
 try{
  await Promise.all(Object.entries(data.images).map(async([key,url])=>{const im=new Image();im.src=url;await im.decode();images[key]=im;}));
  if(!alive)return;status.hidden=true;draw();raf=requestAnimationFrame(tick);
 }catch(e){status.textContent='素材加载失败：'+e.message;console.error(e);}
 addEventListener('pagehide',()=>{alive=false;cancelAnimationFrame(raf);});
}

export function generateResource(effect,input){
 const config={...normalizeResource(effect,input),id:effect.id};
 const keys=Object.keys(resourceData.images).filter(k=>effect.id==='calendar'?k.startsWith('field_')||k.startsWith('time_'):effect.id==='loading'?k.startsWith('load'):false);
 const data={images:Object.fromEntries(keys.map(k=>[k,resourceData.images[k]])),dialogue:effect.id==='sharp-dialogue'?resourceData.dialogue:undefined};
 const description=effect.id==='calendar'?`${config.month}月${config.day}日 · 时段和天气可调整`:effect.id==='sharp-dialogue'?`${config.title}：${config.body}`:'TAKE YOUR TIME · '+config.caption;
 const css=`*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#111113;color:#fff;font-family:'Microsoft YaHei',sans-serif}main{position:relative;height:100svh;display:flex;align-items:center;justify-content:center;overflow:hidden}canvas{display:block;width:100%;height:100%;object-fit:contain}canvas:focus-visible{outline:2px solid #00ffff;outline-offset:-4px}#resourceStatus{position:absolute;inset:0;display:grid;place-items:center;background:#111;font-size:12px}#resourceStatus[hidden]{display:none}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
 const html=`<main><canvas id="resourceCanvas" width="900" height="560" ${effect.id==='calendar'?'role="img"':'role="button" tabindex="0"'} aria-label="${escapeHTML(description)}"></canvas><p id="resourceText" class="sr-only">${escapeHTML(description)}</p><div id="resourceStatus" role="status">正在加载原资源…</div></main>`;
 const serialize=v=>JSON.stringify(v).replace(/</g,'\\u003c');
 const header='// PHANTOM UI · original sprites/meshes retain original rights; new runtime code MIT.\n';
 const js=header+`const config=${serialize(config)};\nconst resourceAssets=${serialize(data)};\n(${bootResource.toString()})(config,resourceAssets);`;
 const displayJS=header+`const config=${JSON.stringify(config,null,2)};\n// 原图与网格数据折叠显示；复制/下载包含完整数据。\nconst resourceAssets=/* embedded original assets */ {};\n(${bootResource.toString()})(config,resourceAssets);`;
 const full=code=>`<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(effect.name)} · P5R UI</title><style>${css}</style></head><body>${html}<script>${code.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
 return{html,css,js,full:full(js),display:{js:displayJS,full:full(displayJS)},resource:true};
}

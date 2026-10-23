import {effects as baseEffects, defaults, normalize, generate, escapeHTML} from './effects.js';
import {originalEffects,generateOriginal} from './originals.js';
import {resourceEffects,generateResource,normalizeResource} from './resource-ui.js';
const effects=[...baseEffects,...resourceEffects];

const $=id=>document.getElementById(id);
const storageKey='phantom-ui:workbench:v1';
let saved={};
try{const data=JSON.parse(localStorage.getItem(storageKey));if(data&&typeof data==='object')saved=data;}catch{/* Browser storage is optional. */}
const configs=Object.fromEntries(effects.map(e=>[e.id,e.resource?normalizeResource(e,saved[e.id]):normalize(e,saved[e.id])]));
const originalConfigs=Object.fromEntries(Object.entries(originalEffects).map(([id,e])=>[id,normalize(e,saved.__original?.[id])]));
let active=effects.find(e=>e.id===location.hash.slice(1))||effects[0];
let mode='original',filter='全部',tab='full',paused=false,background='dark',bundle,renderTimer,toastTimer;
const isOriginal=()=>mode==='original'&&!!originalEffects[active.id];
const settings=()=>isOriginal()?originalConfigs[active.id]:configs[active.id];
const schema=()=>isOriginal()?originalEffects[active.id]:active;
const makeBundle=()=>active.resource?generateResource(active,settings()):isOriginal()?generateOriginal(active,settings()):generate(active,settings());
document.querySelectorAll('[data-effect-total]').forEach(el=>el.textContent=String(effects.length).padStart(2,'0'));

function persist(){try{localStorage.setItem(storageKey,JSON.stringify({...configs,__original:originalConfigs}));}catch{/* The current session remains usable. */}}
function notify(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}
function post(action,value){$('preview').contentWindow?.postMessage({channel:'phantom-ui',action,value},'*');}
function displayNumber(value){return Number(value).toLocaleString('en-US',{maximumFractionDigits:2});}
function list(){
  const query=$('search').value.trim().toLowerCase();
  const matches=effects.filter(e=>(filter==='全部'||filter===e.category)&&`${e.name} ${e.en} ${e.description} ${e.category}`.toLowerCase().includes(query));
  $('effectList').replaceChildren();
  for(const e of matches){
    const index=effects.indexOf(e),b=document.createElement('button');b.className='effect-item'+(e===active?' active':'');b.dataset.effect=e.id;b.setAttribute('aria-pressed',String(e===active));
    b.innerHTML=`<span class="effect-icon" aria-hidden="true">${e.icon}</span><span><strong>${e.name}</strong><small>${e.en}</small></span><span class="item-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>`;
    b.addEventListener('click',()=>select(e));$('effectList').append(b);
  }
  if(!matches.length){const p=document.createElement('p');p.className='no-results';p.textContent='没有找到对应效果。试试“菜单”“对话”或切换分类。';$('effectList').append(p);}
  $('resultCount').textContent=String(matches.length).padStart(2,'0');
}
function updateColor(){
  const value=settings().accent;$('accent').value=value;$('accentHex').textContent=value.toUpperCase();
  document.querySelectorAll('[data-color]').forEach(b=>{b.classList.toggle('active',b.dataset.color===value);b.setAttribute('aria-pressed',String(b.dataset.color===value));});
}
function showControls(){
  $('controls').replaceChildren();
  document.body.dataset.original=String(isOriginal());
  if(isOriginal()){const note=document.createElement('p');note.className='original-note';note.textContent='原版字形与衬底逐层绘制。需要自定义文字时，切换上方「文字适配」。';$('controls').append(note);}
  for(const c of schema().controls){
    const field=document.createElement('div');field.className='control';
    const label=document.createElement('label');label.htmlFor='param-'+c.key;label.textContent=c.label;field.append(label);
    let input;
    if(c.type==='select'){
      input=document.createElement('select');for(const option of c.options){const item=document.createElement('option');item.value=option.value;item.textContent=option.label;input.append(item);}input.value=settings()[c.key];field.append(input);
      input.addEventListener('change',()=>{settings()[c.key]=input.value;schedule();});
    }else if(c.type==='range'){
      const output=document.createElement('output');output.id='out-'+c.key;output.htmlFor='param-'+c.key;label.append(output);
      input=document.createElement('input');input.type='range';input.min=c.min;input.max=c.max;input.step=c.step;
      const limits=document.createElement('div');limits.className='range-limits';limits.innerHTML=`<span>${c.min}${c.unit}</span><span>${c.max}${c.unit}</span>`;
      field.append(input,limits);
      input.addEventListener('input',()=>{settings()[c.key]=Number(input.value);updateRange(c,input,output);schedule();});
      updateRange(c,input,output);
    }else{
      input=document.createElement(c.key==='items'||c.key==='body'?'textarea':'input');
      if(input.tagName==='INPUT')input.type='text';else input.spellcheck=false;
      input.maxLength=c.max;if(c.key==='body')input.classList.add('body-text');
      input.value=settings()[c.key];field.append(input);
      if(c.key==='items'){const hint=document.createElement('small');hint.className='field-hint';hint.textContent='最多 5 项，每行一项';field.append(hint);}
      input.addEventListener('input',()=>{settings()[c.key]=input.value;schedule();});
    }
    input.id='param-'+c.key;input.name=c.key;$('controls').append(field);
  }
  updateColor();$('speed').value=String(settings().speed);
}
function updateRange(c,input,output){
  const value=settings()[c.key];input.value=value;output.value=displayNumber(value)+c.unit;input.style.setProperty('--percent',`${(value-c.min)/(c.max-c.min)*100}%`);
}
function showCode(){
  const code=bundle.display?.[tab]||bundle[tab];const fragment=document.createDocumentFragment();
  for(const line of code.split('\n')){const s=document.createElement('span');s.className='code-line';s.textContent=line||' ';fragment.append(s);}
  $('code').replaceChildren(fragment);
  $('codeMeta').textContent=isOriginal()||active.resource?'原资源已内嵌 · 数据折叠显示 · 复制/下载为完整文件':tab==='full'?'独立 HTML · 无需安装依赖':{html:'结构片段 · 与 CSS、JS 配合使用',css:'完整样式 · 与 HTML、JS 配合使用',js:'原生 JavaScript · 与 HTML、CSS 配合使用'}[tab];
}
function render(){
  clearTimeout(renderTimer);renderTimer=null;bundle=makeBundle();$('preview').srcdoc=bundle.full;showCode();persist();
}
function schedule(){
  if(active.resource){Object.assign(settings(),normalizeResource(active,settings()));for(const c of active.controls)if(c.type==='range')updateRange(c,$('param-'+c.key),$('out-'+c.key));}
  clearTimeout(renderTimer);renderTimer=setTimeout(render,100);
}
function select(effect,{updateHash=true}={}){
  active=effect;paused=false;$('pauseButton').setAttribute('aria-pressed','false');$('pauseIcon').textContent='Ⅱ';$('pauseLabel').textContent='暂停';
  document.body.dataset.effect=active.id;
  $('modeBar').hidden=!originalEffects[active.id];
  $('modeExplanation').textContent=mode==='original'?'原版字形 / 原版衬底 / 原曲线':'自定义文字 / 网页适配';
  document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});
  $('effectNumber').textContent=`${String(effects.indexOf(active)+1).padStart(2,'0')} / ${String(effects.length).padStart(2,'0')}`;$('effectName').textContent=active.name;$('effectEn').textContent=active.en;
  $('preview').title=active.name+'实时预览';$('previewHint').textContent=active.hint;
  $('sourceLabel').textContent=isOriginal()?'原版素材 · 原曲线':active.badge|| (active.kind==='research'?'文字适配':'原创扩展');$('sourceDescription').textContent=isOriginal()?'直接运行认可留档的渲染代码。原字形、专属衬底与混色层一并保留。':active.description;
  document.title=`${active.name} · PHANTOM UI — 怪盗界面实验室`;
  if(updateHash)history.replaceState(null,'','#'+active.id);
  list();showControls();render();
}
function setTab(value,focus=false){
  tab=value;document.querySelectorAll('[data-tab]').forEach(b=>{const selected=b.dataset.tab===value;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
  $('codePanel').setAttribute('aria-labelledby','tab-'+value);showCode();$('codePanel').scrollTop=0;$('codePanel').scrollLeft=0;
}
function openDialog(html){$('dialogBody').innerHTML=html;if(!$('infoDialog').open)$('infoDialog').showModal();}
function manualCopy(code){
  openDialog('<h2>代码已准备好</h2><p>当前浏览器未允许自动写入剪贴板。下方已选中完整代码，按 Ctrl+C / ⌘C 即可复制。</p><textarea class="manual-copy" aria-label="待复制的代码" readonly></textarea>');
  const area=$('dialogBody').querySelector('textarea');area.value=code;area.focus();area.select();
}
async function copy(type){
  if(renderTimer)render();const code=bundle[type];
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(code);notify(type==='full'?'完整代码已复制。去创造你的界面！':`${type.toUpperCase()} 代码已复制`);}catch{manualCopy(code);}
}
function setBackground(value){background=value;post('background',value);for(const kind of ['dark','light']){$(kind+'Bg').classList.toggle('active',kind===value);$(kind+'Bg').setAttribute('aria-pressed',String(kind===value));}}
$('preview').addEventListener('load',()=>{post('background',background);post('speed',settings().speed);post('pause',paused);});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;select(active,{updateHash:false});}));
$('search').addEventListener('input',list);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});list();}));
document.querySelectorAll('[data-tab]').forEach((b,i,all)=>{b.addEventListener('click',()=>setTab(b.dataset.tab));b.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight')index=(i+1)%all.length;if(e.key==='ArrowLeft')index=(i-1+all.length)%all.length;if(e.key==='Home')index=0;if(e.key==='End')index=all.length-1;if(index!==undefined){e.preventDefault();setTab(all[index].dataset.tab,true);}});});
$('accent').addEventListener('input',()=>{settings().accent=$('accent').value;updateColor();schedule();});
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{settings().accent=b.dataset.color;updateColor();render();}));
$('resetButton').addEventListener('click',()=>{if(isOriginal())originalConfigs[active.id]=defaults(schema());else configs[active.id]=defaults(active);showControls();render();notify('当前效果已恢复默认参数');});
$('pauseButton').addEventListener('click',()=>{paused=!paused;post('pause',paused);$('pauseIcon').textContent=paused?'▷':'Ⅱ';$('pauseLabel').textContent=paused?'播放':'暂停';$('pauseButton').setAttribute('aria-pressed',String(paused));});
$('replayButton').addEventListener('click',()=>post('replay'));
$('speed').addEventListener('change',()=>{settings().speed=Number($('speed').value);bundle=makeBundle();showCode();persist();post('speed',settings().speed);});
$('darkBg').addEventListener('click',()=>setBackground('dark'));$('lightBg').addEventListener('click',()=>setBackground('light'));
$('copyTab').addEventListener('click',()=>copy(tab));$('copyFull').addEventListener('click',()=>copy('full'));
$('downloadButton').addEventListener('click',()=>{
  if(renderTimer)render();const blob=new Blob([bundle.full],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`phantom-ui-${active.id}.html`;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('独立 HTML 已生成');
});
$('guideButton').addEventListener('click',()=>openDialog(`<h2>三步，带走你的新装备。</h2><ol><li><strong>选一个效果。</strong>在目录中浏览 8 个组件，也可以搜索或按导航、信息、动效筛选。</li><li><strong>把它改成你的。</strong>编辑文字、颜色和数值，画面与代码同步更新。设置会保存在当前浏览器。</li><li><strong>复制，开演。</strong>“完整示例”包含全部 HTML、CSS 和 JS。保存为 <code>.html</code> 即可运行；或分别复制各个片段。</li></ol><h3>动效控制</h3><p>暂停冻结当前动效；重播从头开始。慢放适合观察过冲。预览中的菜单支持鼠标、触屏和键盘方向键，Tab 可进入菜单。系统开启“减少动态效果”时会显示静态结果。</p><h3>离线也能使用</h3><p>下载的文件无需安装依赖，无需网络。浏览器限制剪贴板时，可在选中文本框中手动复制。</p>`));
const about=`<h2>从原版结构开始。</h2><p>标题菜单与暂停菜单默认运行已认可留档的原资源复刻：保留原字形、专属衬底、遮罩混色与测量曲线。它们不是原游戏引擎代码。</p><h3>原版复刻 / 文字适配</h3><p>原版字形是固定图像，能调整动效参数；切换「文字适配」才使用可自由编辑的网页文字。地点选择是纸片曲线适配，其余五项是原创风格扩展，不标为原版。</p><h3>代码与素材</h3><p>新增代码采用 <a href="./LICENSE" target="_blank" rel="noopener">MIT License</a>。原版模式和页面使用本地研究包中的游戏字形、图像；这些素材保留原权利，不属于 MIT 开源授权。下载的原版示例将数据内嵌，无需额外文件。</p><p>完整来源见 <a href="./SOURCES.md" target="_blank" rel="noopener">来源与实现说明</a>。本项目为非官方研究与创作。</p>`;
$('sourceButton').addEventListener('click',()=>openDialog(about));
$('effectSource').addEventListener('click',()=>openDialog(`<h2>${active.name}</h2><p><strong>${isOriginal()?'认可留档的原资源复刻':active.source}</strong></p><p>${isOriginal()?'当前运行原字形、衬底与测量参数。标题菜单保留 lighter / multiply 混色；暂停菜单保留原字形三色遮罩与独立四角纸片。嵌入的游戏素材保留原权利，代码和素材不使用同一授权。':active.description}</p><p>${active.id==='title'?'标题原版模式保留完整 V3 渲染顺序与四阶双底片；文字适配使用 DOM，因此不会与原字形逐像素相同。':active.id==='place'?'复用 ENTER / EXIT 时间点。纸片沿右侧根部伸缩，文字独立位移，快速切换继承当前姿态。':active.id==='pause'?'暂停菜单原版模式包含 10 项原字形、各自位置、缩放、倾角、辅助文字与测量纸片。文字适配是另一套网页实现。':'此项是原创风格扩展，没有对应的原游戏逐帧测量。'}</p><h3>接入你的项目</h3><p>复制「完整示例」可直接运行。原版示例已内嵌素材数据，代码窗折叠这部分以便阅读，复制与下载仍包含完整内容。多效果同页建议用 iframe 隔离。</p><p><a href="./SOURCES.md" target="_blank" rel="noopener">阅读全部来源说明 ↗</a></p>`));
$('closeDialog').addEventListener('click',()=>$('infoDialog').close());
$('infoDialog').addEventListener('click',e=>{if(e.target===$('infoDialog')){const r=$('infoDialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('infoDialog').close();}});
addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!$('infoDialog').open){e.preventDefault();$('search').focus();}});
addEventListener('hashchange',()=>{const effect=effects.find(e=>e.id===location.hash.slice(1));if(effect&&effect!==active)select(effect,{updateHash:false});});
select(active,{updateHash:!!location.hash});

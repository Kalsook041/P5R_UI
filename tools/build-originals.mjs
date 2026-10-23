import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url),out=new URL('../dist/',import.meta.url);
const title=new URL('archives/p5r-hover-v3-accepted-2026-10-22/',root);
const pause=new URL('archives/p5r-pause-menu-accepted-2026-10-22/',root);
const json=async url=>JSON.parse(await readFile(url,'utf8'));
const data=async(url,mime)=>`data:${mime};base64,${(await readFile(url)).toString('base64')}`;
let titleSource=await readFile(new URL('src/p5r-menu.js',title),'utf8');
titleSource=titleSource.replace(/^import .*\r?\n/gm,'')
  .replace("new URL('../assets/', import.meta.url)","new URL('https://phantom.invalid/')")
  .replace("new URL('../data/runtime.json', import.meta.url)","null")
  .replace('loadImage(new URL(`sprite_${String(id).padStart(3, \'0\')}.png`, assets))','loadImage(options.assetUrls[id])');
if(!titleSource.includes('loadImage(options.assetUrls[id])'))throw new Error('Title adapter no longer matches source');
let motion=await readFile(new URL('src/motion.js',title),'utf8');
const sourceTitle=(motion+'\n'+titleSource).replace(/^export /gm,'');
const sourcePause=(await readFile(new URL('menu.js',pause),'utf8')).replace(/^export /gm,'');
const titleModel=await json(new URL('data/runtime.json',title));
const titleImages=Object.fromEntries(await Promise.all(titleModel.spriteIds.map(async id=>[id,await data(new URL(`assets/sprite_${String(id).padStart(3,'0')}.png`,title),'image/png')])));
const pauseModel=await json(new URL('assets/model.json',pause));
const names=['plate.jpg','counter.png','counter_red.png',...pauseModel.labels.flatMap((_,i)=>[`label_${i}.png`,`label_${i}_red.png`,`label_${i}_green.png`,`help_${i}.png`])];
const pauseImages=Object.fromEntries(await Promise.all(names.map(async name=>[name,await data(new URL('assets/'+name,pause),name.endsWith('jpg')?'image/jpeg':'image/png')])));
const bundle={title:{source:sourceTitle,model:titleModel,images:titleImages,background:await data(new URL('assets/background.jpg',title),'image/jpeg')},pause:{source:sourcePause,model:pauseModel,images:pauseImages}};
await writeFile(new URL('original-data.js',out),'// Generated from accepted local research. Game imagery retains its original rights.\nexport const originals = '+JSON.stringify(bundle)+';\n','utf8');
await mkdir(new URL('art/',out),{recursive:true});
await copyFile(new URL('assets/plate.jpg',pause),new URL('art/command.jpg',out));
const hashes={};for(const [key,url]of Object.entries({title:new URL('src/p5r-menu.js',title),motion:new URL('src/motion.js',title),pause:new URL('menu.js',pause)}))hashes[key]=createHash('sha256').update(await readFile(url)).digest('hex');
await writeFile(new URL('../evidence/original-source-hashes.json',import.meta.url),JSON.stringify(hashes,null,2));
console.log('Built original title / pause renderers with embedded assets.');

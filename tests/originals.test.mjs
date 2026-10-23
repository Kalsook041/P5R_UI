import test from 'node:test';
import assert from 'node:assert/strict';
import {effects,defaults} from '../dist/effects.js';
import {originals} from '../dist/original-data.js';
import {originalEffects,generateOriginal} from '../dist/originals.js';
test('both original reconstructions export executable self-contained pages',()=>{
 for(const id of ['title','pause']){
  const bundle=generateOriginal(effects.find(e=>e.id===id),defaults(originalEffects[id]));
  assert.doesNotThrow(()=>new Function(bundle.js));
  assert.ok(!bundle.js.includes('import.meta'));assert.ok(!/^export /m.test(bundle.js));
  assert.equal((bundle.full.match(/<\/script>/g)||[]).length,1);
  assert.ok(bundle.js.includes('data:image/png;base64,'));
  assert.ok(bundle.display.full.length<bundle.full.length/2);
  assert.ok(bundle.full.includes('original rights retained'));
 }
});
test('original renderers retain their distinct compositing and measured menu data',()=>{
 assert.ok(originals.title.source.includes("ctx.globalCompositeOperation = 'lighter'"));
 assert.ok(originals.title.source.includes("ctx.globalCompositeOperation = 'multiply'"));
 assert.equal(originals.title.model.labels.length,4);
 assert.equal(originals.pause.model.labels.length,10);
 assert.ok(originals.pause.source.includes("this.images[`label_${selected}_green.png`]"));
 assert.equal(originals.title.model.idle.period,1.05);
 assert.ok(Object.keys(originals.pause.images).length>=40);
});
test('adjusting original controls does not mutate accepted source measurements',()=>{
 const initial=JSON.stringify(originals.title.model);
 const c={...defaults(originalEffects.title),amplitude:2,scale:1.6,period:.5,speed:.25};
 const b=generateOriginal(effects[0],c);
 assert.ok(b.js.includes('"period":0.5'));assert.ok(b.js.includes('"scale":1.6'));
 assert.equal(JSON.stringify(originals.title.model),initial);
});

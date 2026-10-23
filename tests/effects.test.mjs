import test from 'node:test';
import assert from 'node:assert/strict';
import {effects,defaults,normalize,generate,markup} from '../dist/effects.js';
import {researchModel} from '../dist/research-model.js';

test('every effect exports a self-contained page and compilable runtime without network imports',()=>{
  assert.equal(effects.length,8);
  for(const effect of effects){
    const c=defaults(effect),b=generate(effect,c);
    assert.ok(b.full.startsWith('<!doctype html>'));assert.ok(b.full.includes(markup(effect.id,{...c,id:effect.id})));
    assert.equal((b.full.match(/<script>/g)||[]).length,1);assert.equal((b.full.match(/<\/script>/g)||[]).length,1);
    assert.doesNotThrow(()=>new Function(b.js));assert.ok(!b.full.includes('type="module"'));assert.ok(!/\bfetch\(|https?:\/\//.test(b.js));
  }
});
test('arbitrary custom text cannot escape markup or terminate exported script',()=>{
  const hostile='</script><img src=x onerror="alert(1)"><script>"&';
  for(const effect of effects){
    const input=Object.fromEntries(effect.controls.filter(c=>c.type==='text').map(c=>[c.key,hostile]));
    const b=generate(effect,{...defaults(effect),...input});
    assert.equal((b.full.match(/<\/script>/g)||[]).length,1);assert.ok(!b.html.includes('<img'));assert.ok(!b.js.includes('</script>'));
    assert.doesNotThrow(()=>new Function(b.js));
  }
});
test('all exposed parameters survive export; invalid numeric and CSS inputs are bounded',()=>{
  for(const effect of effects){
    const c=defaults(effect);
    for(const field of effect.controls){c[field.key]=field.type==='range'?field.max:'自定义内容';}
    c.accent='#20d9cf';c.speed=.5;
    const b=generate(effect,c);
    const actual=JSON.parse(b.js.match(/const config = (.+);\n/)[1]);
    for(const [key,value]of Object.entries(c))assert.equal(actual[key],value,`${effect.id}.${key}`);
    assert.equal(normalize(effect,{fontSize:9999}).fontSize,effect.controls.find(c=>c.key==='fontSize').max);
    assert.equal(normalize(effect,{accent:'red;display:none',speed:99}).accent,'#ed123b');
    assert.equal(normalize(effect,{speed:99}).speed,2);
  }
});
test('accepted title research preserves continuous periodic geometry and measured scale ratio',()=>{
  assert.equal(researchModel.idle.period,1.05);assert.equal(researchModel.idle.harmonics,4);
  assert.ok(Math.abs(researchModel.selected/researchModel.baseline-1.3)<1e-9);
  for(const plane of Object.values(researchModel.idle.planes)){
    assert.equal(plane.length,9);for(const frame of plane){assert.equal(frame.length,4);assert.ok(frame.flat().every(Number.isFinite));}
  }
});
test('menu line count is bounded and unicode survives exported HTML',()=>{
  const effect=effects.find(e=>e.id==='place');const b=generate(effect,{...defaults(effect),items:'涩谷\n四轩茶屋\n新宿\n秋叶原\n吉祥寺\n六个'});
  assert.equal((b.html.match(/data-index=/g)||[]).length,5);assert.ok(b.html.includes('涩谷'));assert.ok(!b.html.includes('六个'));
});
test('corrupt or partially missing persisted settings fall back to usable defaults',()=>{
  for(const effect of effects)for(const input of [null,undefined,42,'invalid']){
    assert.deepEqual(normalize(effect,input),defaults(effect));
    assert.doesNotThrow(()=>generate(effect,input));
  }
});

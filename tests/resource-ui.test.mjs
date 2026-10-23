import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceEffects,generateResource,normalizeResource} from '../dist/resource-ui.js';
import {resourceData} from '../dist/resource-data.js';
import {defaults} from '../dist/effects.js';
test('three newly researched UIs export self-contained compilable runtimes',()=>{
 assert.equal(resourceEffects.length,3);
 for(const e of resourceEffects){const b=generateResource(e,defaults(e));assert.doesNotThrow(()=>new Function(b.js));assert.equal((b.full.match(/<\/script>/g)||[]).length,1);assert.ok(!/\bimport\s|\bfetch\(/.test(b.js));assert.ok(b.full.length>b.display.full.length);}
});
test('resource text is inert in both accessibility markup and script payloads',()=>{
 for(const id of ['sharp-dialogue','loading']){const e=resourceEffects.find(e=>e.id===id),b=generateResource(e,{...defaults(e),title:'</script><img onerror=alert(1)>',body:'<script>alert(1)</script>',caption:'</script><img onerror=alert(1)>'});assert.ok(!b.html.includes('<img'));assert.equal((b.full.match(/<\/script>/g)||[]).length,1);assert.doesNotThrow(()=>new Function(b.js));}
});
test('calendar follows valid 2016 dates and preserves select values',()=>{
 const e=resourceEffects[0];assert.equal(normalizeResource(e,{month:2,day:31}).day,29);assert.equal(normalizeResource(e,{month:4,day:31}).day,30);
 assert.equal(normalizeResource(e,{weather:'3',weekday:'7'}).weather,3);assert.equal(normalizeResource(e,{weekday:999}).weekday,0);
});
test('packaged original meshes retain full valid topology and provenance',()=>{
 assert.equal(resourceData.dialogue.length,6);
 assert.equal(resourceData.dialogue.reduce((n,m)=>n+m.vertices.length,0),878);
 assert.equal(resourceData.dialogue.reduce((n,m)=>n+m.triangles.length*3,0),3915);
 for(const m of resourceData.dialogue){assert.ok(m.vertices.flat().every(Number.isFinite));for(const t of m.triangles)for(const i of t)assert.ok(Number.isInteger(i)&&i>=0&&i<m.vertices.length);}
 assert.equal(resourceData.provenance.length,Object.keys(resourceData.images).length);
 assert.ok(resourceData.provenance.every(p=>/^[a-f0-9]{64}$/.test(p.source_sha256)&&p.rect.length===4));
});

import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {effects,defaults,generate} from '../dist/effects.js';
import {originalEffects,generateOriginal} from '../dist/originals.js';
const args=process.argv.slice(2);
let effect=effects[0],expected;
if(args[0]==='--original'){args.shift();const id=args.shift();effect=effects.find(e=>e.id===id);assert.ok(originalEffects[id]);expected=generateOriginal(effect,defaults(originalEffects[id])).full;}
else expected=generate(effect,defaults(effect)).full;
for(const path of args){
  assert.equal(await readFile(path,'utf8'),expected,`${path}: must match the exact default title export`);
  console.log(`Exact export verified: ${path}`);
}

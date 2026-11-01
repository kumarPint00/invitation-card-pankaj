import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ids=['ganesh','couple','tilak','haldi','mehndi','matkor','vivah'];
test('each ceremony includes its own inline cartoon character stage',()=>{
 for (const id of ids){
  assert.match(html,new RegExp('cartoon-stage cartoon-'+id+'"'));
  assert.match(html,new RegExp('data-scene="'+id+'"'));
 }
 assert.equal((html.match(/class="cartoon-stage cartoon-/g)||[]).length,7);
});
test('separate character choreography exists for each ritual',()=>{
 for(const animation of ['ganesh-bless','bride-sway','elder-tilak','haldi-apply','mehndi-line','pot-carry','phere-journey']){
  assert.match(css,new RegExp('@keyframes '+animation+'\\{'));
 }
});
test('ceremony-specific dates preserved and reception not added',()=>{
 for(const text of ['२ दिसंबर २०२६','३ दिसंबर २०२६','४ दिसंबर २०२६','५ दिसंबर २०२६'])assert.ok(html.includes(text));
 assert.ok(!html.includes('बहुभोज')&&!html.includes('Reception'));
});
test('playback pauses vector character animation and honors reduced motion',()=>{
 assert.match(css,/film-paused \.cartoon-svg/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(js,/classList\.toggle\('film-paused'/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync(new URL('../index.html', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../light-realism.css', import.meta.url),'utf8');
const motion=fs.readFileSync(new URL('../motion.js', import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('daylight theme is the public default and original Ganesh invocation remains',()=>{
  assert.match(html,/data-theme="daylight"/);
  assert.match(html,/name="theme-color" content="#f9f0e6"/);
  assert.match(html,/श्री गणेशाय नमः/);
  assert.match(html,/light-realism\.css/);
  assert.match(html,/motion\.js/);
  assert.match(css,/color-scheme:light/);
});
test('ceremony-specific choreographed movement is sequenced, not repetitive short waving',()=>{
  for (const motionName of ['ritual-tilak-hand','haldi-gentle-apply','henna-hand','earth-ritual-pot','sacred-circuit','ganesh-gentle','human-blink']) {
    assert.ok(css.includes(`@keyframes ${motionName}`),`Missing ${motionName}`);
  }
  assert.match(css,/\.cartoon-svg \.portrait-blink/);
  assert.match(css,/\.film-paused \.cartoon-svg/);
  assert.match(app,/ambient\.frame\(ts\)/);
});
test('faces are visible underneath veils and characters have connected necks',()=>{
  assert.equal((html.match(/class="portrait-neck"/g)||[]).length,12);
  assert.equal((html.match(/class="portrait-blink"/g)||[]).length,12);
  assert.doesNotMatch(html,/M-61 -113Q-22 -154 28 -132Q48 -112 61 -73L58 14Q11 -2 -21 -4L-61 -20Z/);
});
test('accessibility and pointer animation reduce work when appropriate',()=>{
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(motion,/prefers-reduced-motion: reduce/);
  assert.match(motion,/document\.hidden/);
  assert.match(motion,/pointerleave/);
});

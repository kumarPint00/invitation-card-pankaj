import test from 'node:test';import assert from 'node:assert/strict';import handler from '../api/rsvp.js';import invite from '../api/invite.js';import health from '../api/health.js';
function mock(body={},method='POST'){let status=200;const req={method,headers:{host:'wedding.example',origin:'https://wedding.example'},body,query:{token:'oops'}};const res={headers:{},status(n){status=n;return this},setHeader(k,v){this.headers[k]=v;return this},json(data){return{status,data}}};return {req,res}}
const base={name:'Test Guest',phone:'9876543210',response:'yes',attendees:1,events:['vivah']};
test('reject missing guest name',async()=>{const {req,res}=mock({...base,name:''});assert.equal((await handler(req,res)).status,400)});
test('reject out-of-range attendee counts',async()=>{const {req,res}=mock({...base,attendees:31});assert.equal((await handler(req,res)).status,400)});
test('reject invented wedding events',async()=>{const {req,res}=mock({...base,events:['reception']});assert.equal((await handler(req,res)).status,400)});
test('reject duplicate events',async()=>{const {req,res}=mock({...base,events:['vivah','vivah']});assert.equal((await handler(req,res)).status,400)});
test('reject invalid phone',async()=>{const {req,res}=mock({...base,phone:'123'});assert.equal((await handler(req,res)).status,400)});
test('reject cross-origin RSVP',async()=>{const {req,res}=mock(base);req.headers.origin='https://evil.example';assert.equal((await handler(req,res)).status,403)});
test('reject mismatched attendance',async()=>{const {req,res}=mock({...base,response:'no',attendees:1,events:[]});assert.equal((await handler(req,res)).status,400)});
test('reject invalid invite token',async()=>{const {req,res}=mock({},'GET');assert.equal((await invite(req,res)).status,400)});
test('health shows setup_required without secrets',()=>{const {req,res}=mock({},'GET');assert.equal(health(req,res).status,200)});

import {createHmac,timingSafeEqual} from 'node:crypto';
export const allowedEvents=['tilak','haldi','mehndi','matkor','vivah'];
export function isConfigured(){return Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)}
export function errorResponse(res,status,message){return res.status(status).json({error:message})}
export function safeSameOrigin(req){const origin=req.headers.origin;if(!origin)return true;try{return new URL(origin).host===req.headers.host}catch{return false}}
export function hmac(value){const secret=process.env.RSVP_HASH_SECRET||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!secret)throw new Error('Database not configured');return createHmac('sha256',secret).update(String(value)).digest('hex')}
export function validAdminToken(req){const expected=process.env.ADMIN_DASHBOARD_TOKEN||'';const authorization=req.headers.authorization||'';const supplied=authorization.startsWith('Bearer ')?authorization.slice(7):'';if(expected.length<28||supplied.length!==expected.length)return false;return timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))}
export async function db(path,{method='GET',body,prefer,headers={}}={}){
  if(!isConfigured())throw Object.assign(new Error('RSVP database is not configured yet.'),{status:503});
  const base=process.env.SUPABASE_URL.replace(/\/$/,'');if(!/^https:\/\/[^/]+$/.test(base))throw Object.assign(new Error('Invalid Supabase configuration'),{status:503});
  const response=await fetch(base+'/rest/v1/'+path,{method,headers:{'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json',...(prefer?{'Prefer':prefer}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(10000)});
  let data=null;try{data=await response.json()}catch{data=null}
  if(!response.ok){const msg=response.status===404?'Database migration has not been applied.':'Database request failed.';throw Object.assign(new Error(msg),{status:response.status===404?503:502,detail:data?.code})}return data;
}
export function errorHandler(res,error){console.error('Invitation API:',error.status||500,error.detail||error.name||'unknown');return errorResponse(res,error.status||500,error.status===503?error.message:'Request failed. Please try again later.')}

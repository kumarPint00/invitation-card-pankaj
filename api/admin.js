import {randomBytes} from 'node:crypto';
import {db,validAdminToken,errorResponse,errorHandler,safeSameOrigin} from '../lib/supabase.js';
const clean=s=>String(s||'').trim().replace(/\s+/g,' ').slice(0,120);
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');if(!['GET','POST'].includes(req.method))return errorResponse(res,405,'Method not allowed');if(!validAdminToken(req))return errorResponse(res,401,'Not authorized');if(req.method==='POST'&&!safeSameOrigin(req))return errorResponse(res,403,'Origin not allowed');
  try{
    if(req.method==='GET'){const [guests,rsvps]=await Promise.all([db('wedding_invitation_guests?select=id,planner_guest_id,name,phone,party_size,invitation_token,created_at&order=created_at.desc&limit=5000'),db('wedding_invitation_rsvps?select=id,guest_id,guest_name,phone,response,attendees,events,updated_at&order=updated_at.desc&limit=5000')]);return res.status(200).json({guests,rsvps})}
    const payload=req.body||{};if(payload.action!=='import'||!Array.isArray(payload.guests)||payload.guests.length>400||payload.guests.length===0)return errorResponse(res,400,'Provide an import array of 1–400 guests');
    const parsed=[];const seen=new Set();for(const item of payload.guests){const name=clean(item.name),id=clean(item.planner_guest_id||item.plannerGuestId||item.id),phone=clean(item.phone).replace(/[^+\d]/g,'').slice(0,16),partySize=Number(item.party_size||item.partySize||1);if(!name||!id||name.length>90||id.length>100||seen.has(id)||!Number.isInteger(partySize)||partySize<1||partySize>30)return errorResponse(res,400,'Invalid or duplicate guest ID, name, or party size');seen.add(id);parsed.push({planner_guest_id:id,name,phone:phone||null,party_size:partySize})}
    // Preserve existing invitation tokens across guest re-imports.
    const existing=await db('wedding_invitation_guests?select=planner_guest_id,invitation_token&limit=5000');const old=new Map(existing.map(g=>[g.planner_guest_id,g.invitation_token]));
    const rows=parsed.map(g=>({...g,invitation_token:old.get(g.planner_guest_id)||randomBytes(24).toString('hex')}));
    await db('wedding_invitation_guests?on_conflict=planner_guest_id',{method:'POST',body:rows,prefer:'resolution=merge-duplicates,return=minimal'});
    return res.status(200).json({imported:rows.length,created:rows.filter(x=>!old.has(x.planner_guest_id)).length})
  }catch(error){return errorHandler(res,error)}
}

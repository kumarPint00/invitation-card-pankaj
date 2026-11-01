import {isConfigured} from '../lib/supabase.js';
export default function handler(req,res){res.setHeader('Cache-Control','no-store');if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});return res.status(200).json({status:'ok',rsvp:isConfigured()?'configured':'setup_required',planner:'separate_live_app'});}

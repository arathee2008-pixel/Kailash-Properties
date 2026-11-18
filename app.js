const cfg = window.KAILASH_CONFIG || {};
const ready = cfg.SUPABASE_URL?.startsWith("https://") && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("PASTE_");
const db = ready && window.supabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
const wa = document.getElementById("whatsappLink");
if(cfg.WHATSAPP_NUMBER && !cfg.WHATSAPP_NUMBER.includes("X")) wa.href=`https://wa.me/${cfg.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Kailash Properties, I would like to enquire about a property.")}`;
let listings=[];
async function loadProperties(){
 const grid=document.getElementById("propertyGrid");
 if(!db){grid.innerHTML='<div class="empty-state">Connect Supabase in config.js to load live property listings. Demo listings can be added from the owner dashboard after setup.</div>';return;}
 const {data,error}=await db.from("properties").select("*").eq("is_published",true).order("created_at",{ascending:false});
 if(error){grid.innerHTML='<div class="empty-state">Unable to load listings right now. Please try again later.</div>';console.error(error);return;}
 listings=data||[]; renderListings();
}
function renderListings(){
 const cat=document.getElementById("categoryFilter").value, purpose=document.getElementById("purposeFilter").value;
 const items=listings.filter(p=>(!cat||p.category===cat)&&(!purpose||p.purpose===purpose));
 const grid=document.getElementById("propertyGrid");
 if(!items.length){grid.innerHTML='<div class="empty-state">No matching properties are published yet. Please check again soon.</div>';return;}
 grid.innerHTML=items.map(p=>`<article class="property-card"><img src="${escapeAttr(p.cover_image||'')}" alt="${escapeAttr(p.title)}" loading="lazy"><div class="property-info"><small>${escapeHtml(p.category)} · ${escapeHtml(p.purpose)}</small><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.location||'Gurgaon / Delhi NCR')}</p><div class="property-bottom"><b>${escapeHtml(p.price_text||'Price on request')}</b><a href="${wa.href==='#'?'#':wa.href}" target="_blank" rel="noopener">Enquire ↗</a></div></div></article>`).join("");
}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escapeAttr(s=''){return escapeHtml(s);}
document.getElementById("searchBtn").addEventListener("click",renderListings);
loadProperties();
"use strict";
// Dress Sense - UI, API calls and rendering (uses engine.js)
const $=id=>document.getElementById(id);let F=false,W=null,place="";
const deg=c=>F?Math.round(c*9/5+32)+"°F":Math.round(c)+"°C";
const cleanCity=s=>s.replace(/[^\p{L}\p{N}\s,.'-]/gu,"").trim().slice(0,60);
function say(m,e){const s=$("status");s.textContent=m;s.className=e?"err":""}
async function getJSON(u){const r=await fetch(u);if(!r.ok)throw new Error("Network error "+r.status);return r.json()}
async function byCity(n){const d=await getJSON("https://geocoding-api.open-meteo.com/v1/search?count=1&name="+encodeURIComponent(n));if(!d.results||!d.results.length)throw new Error("City not found. Check the spelling and try again.");const p=d.results[0];return{lat:p.latitude,lon:p.longitude,name:p.name+(p.country?", "+p.country:"")}}
const forecast=(la,lo)=>getJSON("https://api.open-meteo.com/v1/forecast?latitude="+la+"&longitude="+lo+"&timezone=auto&forecast_days=6&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max");
// Small line-icon set for clothing pieces (drawn as plain SVG, no external images/fonts).
const ICONS={
  tshirt:'M8 3 3 6l2 3 2-1v11h10V8l2 1 2-3-5-3-1 2H9L8 3Z',
  shirt:'M8 3 3 6l2 3 2-1v11h10V8l2 1 2-3-5-3-1 1H9L8 3Zm1 4h6',
  sweater:'M7 3 3 6l2 3 2-1v11h10V8l2 1 2-3-4-3v3H9V3Zm-1 6h12',
  jacket:'M8 3 4 6v14h4V9l1 11h6L14 9v11h4V6L14 3l-2 2-2-2ZM10 5v4M14 5v4',
  thermal:'M9 2v4M15 2v4M6 6h12v3l2 2-2 2v9H6v-9l-2-2 2-2V6Zm3 5h6',
  shorts:'M4 4h16l-1 6-1 10h-4l-1-7-1 7H8L7 10 6 4Z',
  jeans:'M5 3h14l1 18h-6l-1-11-1 11H6L5 3ZM5 8h14',
  trousers:'M6 3h12l1 18h-5l-1-13-1 13H7L6 3Z',
  sneakers:'M3 17h17c1 0 2-1 2-2 0 0-2 0-4-2-1-1-3-1-4-1H9L4 15c-1 .3-1 1-1 2Zm4-4V8h3',
  sandals:'M3 16c2-6 4-9 8-9s6 3 8 9c0 1-1 2-2 2H5c-1 0-2-1-2-2ZM7 8v-1M12 7V6',
  boots:'M6 2h6v9l6 4v3c0 1-1 2-2 2H4V15h4l-1-4-1-9Z',
  loafers:'M2 17c0-2 3-3 6-4l6-4c2-1 4-1 6 1 1 1 1 3-1 3l-9 3-8 1Z',
  umbrella:'M12 2C6 2 3 8 3 12h18c0-4-3-10-9-10Zm0 0v18a2 2 0 0 1-4 0',
  raincoat:'M8 2 4 5v16h4v-9l1 9h6l1-9v9h4V5l-4-3-2 2-2-2Z',
  sunglasses:'M3 9h6l1 1h4l1-1h6M3 9l2 7c.3 1 1 2 3 2s3-1 3-2l1-6M21 9l-2 7c-.3 1-1 2-3 2s-3-1-3-2l-1-6',
  cap:'M3 13c0-5 4-8 9-8s9 3 9 8H3Zm0 0c-1 0-2 1-2 2s3 2 5 2M21 13c1 0 2 1 2 2s-2 2-4 2',
  sunscreen:'M8 2h8v3H8V2Zm-1 3h10l1 17H6L7 5Zm1 5h8',
  windbreaker:'M6 4c2-2 10-2 12 0l-2 5 1 12H7l1-12L6 4Zm4 0 2 3 2-3',
  scarf:'M4 6c4 2 8-2 12 0 3 1 4 4 3 7-1-2-3-3-5-2 2 2 2 5 0 7-1-3-4-4-6-3 1-3-1-5-4-6 2-1 2-2 0-3Z',
  beanie:'M4 14c0-5 4-9 8-9s8 4 8 9H4Zm0 0h16v2c0 1-1 2-2 2H6c-1 0-2-1-2-2v-2Z',
  gloves:'M6 22V11c0-1 1-2 2-2s2 1 2 2v3m0-3V6c0-1 1-2 2-2s2 1 2 2v8m0-6c0-1 1-2 2-2s2 1 2 2v6m0-3c0-1 1-2 2-2s2 1 2 2v6c0 3-2 5-5 5H8'
};
const PLAIN_TOP={tshirt:"Cotton t-shirt",shirt:"Full-sleeve shirt",sweater:"Sweater with a warm jacket",jacket:"Jacket over a t-shirt",thermal:"Thermal base with a heavy coat"};
const PLAIN_BOTTOM={shorts:"Shorts or thin trousers",jeans:"Jeans",trousers:"Trousers or chinos"};
const PLAIN_SHOES={sneakers:"Sneakers",sandals:"Sandals or mesh sneakers",boots:"Closed boots",loafers:"Formal shoes or loafers"};
const PLAIN_ACC={umbrella:"Umbrella",raincoat:"Raincoat",sunglasses:"Sunglasses",cap:"Cap or hat",sunscreen:"Sunscreen SPF 30+",windbreaker:"Windbreaker",scarf:"Scarf",beanie:"Beanie",gloves:"Gloves"};

function svgIcon(key){
  const d=ICONS[key];if(!d)return "";
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';
}
// Slang label for a piece key, used only in Gen Z mode.
function pieceLabel(key,plain){ return genZ? (PIECES[key]?PIECES[key].vibe:plain) : plain; }
let genZ=true;

function row(k,v,icon){const d=document.createElement("div");d.className="item";
  const a=document.createElement("span");a.textContent=k;
  const b=document.createElement("span");b.className="ival";
  if(icon){const ic=document.createElement("span");ic.className="icn";ic.innerHTML=svgIcon(icon);b.append(ic)}
  const t=document.createElement("span");t.textContent=v;b.append(t);
  d.append(a,b);return d}
function setSky(){
  const c=W.code;let k="clear";
  if(c>=95)k="storm";else if((c>=71&&c<=77)||c===85||c===86)k="snow";
  else if((c>=51&&c<=67)||(c>=80&&c<=82))k="rain";
  else if(!W.day)k="night";else if(c===3||(c>=45&&c<=48))k="cloudy";
  $("advisor").dataset.sky=k}
function render(){
  if(!W)return;setSky();const[l,i]=wx(W.code);
  $("place").textContent=place;$("temp").textContent=deg(W.temp);$("cond").textContent=i+" "+l+" · feels like "+deg(W.feels);
  const st=$("stats");st.textContent="";
  [["Humidity",W.hum+"%"],["Wind",Math.round(W.wind)+" km/h"],["Rain chance",W.rain+"%"],["UV index",Math.round(W.uv)]].forEach(([k,v])=>{const d=document.createElement("div");d.append(k+": ");const b=document.createElement("b");b.textContent=v;d.append(b);st.append(d)});
  const r=recommend(W,$("act").value,parseInt($("sens").value,10),deg),o=$("outfit");o.textContent="";
  const topTxt=genZ?PIECES[r.top].vibe:PLAIN_TOP[r.top];
  const bottomTxt=genZ?PIECES[r.bottom].vibe:PLAIN_BOTTOM[r.bottom];
  const shoesTxt=genZ?PIECES[r.shoes].vibe:PLAIN_SHOES[r.shoes];
  const accTxt=r.acc.length?r.acc.map(k=>genZ?PIECES[k].vibe:PLAIN_ACC[k]).join(", "):(genZ?"nothing extra, you're set":"Nothing extra needed");
  o.append(row("Top",topTxt,PIECES[r.top].icon),row("Bottom",bottomTxt,PIECES[r.bottom].icon),row("Footwear",shoesTxt,PIECES[r.shoes].icon),row("Carry",accTxt,r.acc[0]?PIECES[r.acc[0]].icon:null));
  const vb=$("vibe");if(vb){vb.textContent=genZ?r.vibe:"";vb.classList.toggle("hide",!genZ)}
  const ul=$("why");ul.textContent="";r.why.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});
  $("bar").style.width=r.score+"%";$("sc").textContent=r.score+"/100";
  const fc=$("fc");fc.textContent="";
  W.days.forEach(d=>{const e=document.createElement("div");e.textContent=new Date(d.date).toLocaleDateString(undefined,{weekday:"short"})+" "+wx(d.code)[1]+" "+deg(d.max)+" / "+deg(d.min)+" · "+d.rain+"% rain";fc.append(e)});
  $("out").classList.remove("hide")
}
async function run(la,lo,name){
  say("Fetching weather…");
  try{const d=await forecast(la,lo),c=d.current,y=d.daily;
    W={temp:c.temperature_2m,feels:c.apparent_temperature,hum:c.relative_humidity_2m,wind:c.wind_speed_10m,code:c.weather_code,day:c.is_day!==0,rain:y.precipitation_probability_max[0]||0,uv:y.uv_index_max[0]||0,
      days:y.time.slice(1).map((t,i)=>({date:t,code:y.weather_code[i+1],max:y.temperature_2m_max[i+1],min:y.temperature_2m_min[i+1],rain:y.precipitation_probability_max[i+1]||0}))};
    place=name;render();say("");try{localStorage.setItem("lastCity",name)}catch(e){}
  }catch(e){say(e.message||"Could not load weather. Check your internet connection.",true)}
}
$("go").onclick=async()=>{const c=cleanCity($("city").value);if(!c){say("Enter a city name first.",true);return}
  try{say("Finding "+c+"…");const p=await byCity(c);await run(p.lat,p.lon,p.name)}catch(e){say(e.message,true)}};
$("city").addEventListener("keydown",e=>{if(e.key==="Enter")$("go").click()});
$("loc").onclick=()=>{if(!navigator.geolocation){say("Location is not supported in this browser.",true);return}
  say("Waiting for location permission…");navigator.geolocation.getCurrentPosition(p=>run(p.coords.latitude,p.coords.longitude,"Your location"),()=>say("Location was blocked. Type a city name instead.",true),{timeout:10000})};
$("unit").onclick=()=>{F=!F;$("unit").textContent=F?"Switch to °C":"Switch to °F";render()};
$("vibeToggle").onclick=()=>{genZ=!genZ;$("vibeToggle").textContent=genZ?"Vibe: Gen Z 😎":"Vibe: Plain 📝";render()};
$("act").onchange=$("sens").onchange=render;
try{const l=localStorage.getItem("lastCity");if(l)$("city").value=cleanCity(l.split(",")[0])}catch(e){}

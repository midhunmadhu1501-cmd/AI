"use strict";
// Dress Sense - UI, API calls and rendering (uses engine.js)
const $=id=>document.getElementById(id);let F=false,W=null,place="";
const deg=c=>F?Math.round(c*9/5+32)+"°F":Math.round(c)+"°C";
const cleanCity=s=>s.replace(/[^\p{L}\p{N}\s,.'-]/gu,"").trim().slice(0,60);
function say(m,e){const s=$("status");s.textContent=m;s.className=e?"err":""}
async function getJSON(u){const r=await fetch(u);if(!r.ok)throw new Error("Network error "+r.status);return r.json()}
async function byCity(n){const d=await getJSON("https://geocoding-api.open-meteo.com/v1/search?count=1&name="+encodeURIComponent(n));if(!d.results||!d.results.length)throw new Error("City not found. Check the spelling and try again.");const p=d.results[0];return{lat:p.latitude,lon:p.longitude,name:p.name+(p.country?", "+p.country:"")}}
const forecast=(la,lo)=>getJSON("https://api.open-meteo.com/v1/forecast?latitude="+la+"&longitude="+lo+"&timezone=auto&forecast_days=6&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max");
function row(k,v){const d=document.createElement("div");d.className="item";const a=document.createElement("span");a.textContent=k;const b=document.createElement("span");b.textContent=v;d.append(a,b);return d}
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
  o.append(row("Top",r.top),row("Bottom",r.bottom),row("Footwear",r.shoes),row("Carry",r.acc.length?r.acc.join(", "):"Nothing extra needed"));
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
$("act").onchange=$("sens").onchange=render;
try{const l=localStorage.getItem("lastCity");if(l)$("city").value=cleanCity(l.split(",")[0])}catch(e){}

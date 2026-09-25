"use strict";
// Dress Sense - weather labels and the rule-based recommendation engine (no DOM access)
function wx(c){if(c===0)return["Clear sky","☀️"];if(c<=2)return["Partly cloudy","⛅"];if(c===3)return["Overcast","☁️"];if(c<=48)return["Fog","🌫️"];if(c<=57)return["Drizzle","🌦️"];if(c<=67)return["Rain","🌧️"];if(c<=77)return["Snow","❄️"];if(c<=82)return["Rain showers","🌧️"];if(c<=86)return["Snow showers","🌨️"];return["Thunderstorm","⛈️"]}

// Icon key + a short slang name for each clothing piece, so the UI can show
// a small icon and (in Gen Z mode) a punchier label without changing the logic.
const PIECES={
  tshirt:{icon:"tshirt",vibe:"oversized graphic tee"}, shirt:{icon:"shirt",vibe:"half-sleeve shirt, sleeves rolled up"},
  sweater:{icon:"sweater",vibe:"chunky knit sweater"}, jacket:{icon:"jacket",vibe:"cropped bomber jacket over the tee"},
  thermal:{icon:"thermal",vibe:"thermal tee layered under a puffer coat"}, shorts:{icon:"shorts",vibe:"baggy cargo shorts"},
  jeans:{icon:"jeans",vibe:"straight-leg denim jeans"}, trousers:{icon:"trousers",vibe:"wide-leg trousers"},
  sneakers:{icon:"sneakers",vibe:"chunky dad sneakers"}, sandals:{icon:"sandals",vibe:"slide sandals"},
  boots:{icon:"boots",vibe:"combat boots"}, loafers:{icon:"loafers",vibe:"penny loafers, no socks"},
  umbrella:{icon:"umbrella",vibe:"compact umbrella"}, raincoat:{icon:"raincoat",vibe:"clear PVC rain jacket"},
  sunglasses:{icon:"sunglasses",vibe:"retro round sunglasses"}, cap:{icon:"cap",vibe:"dad cap, backwards optional"},
  sunscreen:{icon:"sunscreen",vibe:"SPF 50 sunscreen stick"}, windbreaker:{icon:"windbreaker",vibe:"nylon windbreaker shell"},
  scarf:{icon:"scarf",vibe:"chunky knit scarf"}, beanie:{icon:"beanie",vibe:"ribbed beanie"}, gloves:{icon:"gloves",vibe:"touchscreen gloves"}
};

function recommend(w,act,bias,fmt){
  const why=[],acc=[];let f=w.feels+bias;
  if(bias)why.push("Adjusted by "+(bias>0?"+":"")+bias+"° because you feel "+(bias>0?"hot":"cold")+" easily.");
  if(act==="workout"){f+=5;why.push("Exercise raises body heat, so the outfit is lighter than the temperature suggests.")}
  if(act==="travel")why.push("Long trips work best with layers you can add or remove.");

  let top,bottom,shoes,vibe;
  if(f>=32){top="tshirt";bottom="shorts";shoes="sandals";vibe="beat-the-heat drip 🔥 — breezy fits only, main character in the sun";}
  else if(f>=27){top="tshirt";bottom="trousers";shoes="sneakers";vibe="clean girl / clean boy energy ☀️ — light, easy, effortless";}
  else if(f>=20){top="shirt";bottom="jeans";shoes="sneakers";vibe="normcore comfy fit 🍂 — tee plus a light layer, always on";}
  else if(f>=14){top="jacket";bottom="jeans";shoes="sneakers";vibe="soft layer szn 🧥 — jacket over tee, casual but put-together";}
  else if(f>=8){top="sweater";bottom="trousers";shoes="boots";acc.push("scarf");vibe="cozycore fit 🍁 — sweater weather, chunky and warm";}
  else{top="thermal";bottom="trousers";shoes="boots";acc.push("beanie","gloves","scarf");vibe="gorpcore winter armor ❄️ — stack every layer, stay toasty";}
  why.push("Feels-like temperature is "+fmt(w.feels)+", which maps to a "+PIECES[top].vibe+" and "+PIECES[bottom].vibe+".");

  if(act==="office"){top="shirt";bottom="trousers";shoes="loafers";vibe="corporate clean fit 💼 — sharp, minimal, no slang here";why.push("Office setting selects formal pieces in a fabric that suits the weather.")}
  if(act==="workout"){top="tshirt";bottom="shorts";shoes="sneakers";vibe="gym rat fit 💪 — moisture-wicking, built to move";}

  if(w.rain>=60){acc.push("umbrella","raincoat");vibe+=" + rain-proofed";why.push("Rain chance is "+w.rain+"%, so rain protection is added.")}
  else if(w.rain>=30){acc.push("umbrella");why.push("Rain chance is "+w.rain+"%: a compact umbrella is cheap insurance.")}
  if(w.uv>=6){acc.push("sunglasses","cap","sunscreen");why.push("UV index peaks at "+Math.round(w.uv)+" today, so sun protection is added.")}
  if(w.wind>=30){acc.push("windbreaker");why.push("Wind is "+Math.round(w.wind)+" km/h, which makes it feel cooler.")}
  if(w.hum>=75&&f>=27)why.push("High humidity ("+w.hum+"%): choose loose cotton or linen in lighter colours.");
  if(w.code>=95)why.push("Thunderstorm warning: avoid open areas outdoors if you can.");

  let s=100-Math.abs(f-22)*3-(w.rain>=60?15:0)-(w.uv>=8?8:0)-(w.wind>=40?10:0);
  return{top,bottom,shoes,acc:[...new Set(acc)],why,vibe,score:Math.max(5,Math.min(100,Math.round(s)))}
}

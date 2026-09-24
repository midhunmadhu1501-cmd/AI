"use strict";
// Dress Sense - weather labels and the rule-based recommendation engine (no DOM access)
function wx(c){if(c===0)return["Clear sky","☀️"];if(c<=2)return["Partly cloudy","⛅"];if(c===3)return["Overcast","☁️"];if(c<=48)return["Fog","🌫️"];if(c<=57)return["Drizzle","🌦️"];if(c<=67)return["Rain","🌧️"];if(c<=77)return["Snow","❄️"];if(c<=82)return["Rain showers","🌧️"];if(c<=86)return["Snow showers","🌨️"];return["Thunderstorm","⛈️"]}
function recommend(w,act,bias,fmt){
  const why=[],acc=[];let f=w.feels+bias;
  if(bias)why.push("Adjusted by "+(bias>0?"+":"")+bias+"° because you feel "+(bias>0?"hot":"cold")+" easily.");
  if(act==="workout"){f+=5;why.push("Exercise raises body heat, so the outfit is lighter than the temperature suggests.")}
  if(act==="travel")why.push("Long trips work best with layers you can add or remove.");
  let top,bottom,shoes;
  if(f>=32){top="Light cotton or linen t-shirt";bottom="Shorts or thin breathable trousers";shoes="Sandals or mesh sneakers"}
  else if(f>=27){top="Cotton t-shirt";bottom="Light trousers or chinos";shoes="Sneakers or loafers"}
  else if(f>=20){top="T-shirt with a thin overshirt";bottom="Jeans or chinos";shoes="Sneakers"}
  else if(f>=14){top="Full-sleeve top with a light jacket or hoodie";bottom="Jeans";shoes="Closed shoes"}
  else if(f>=8){top="Sweater with a warm jacket";bottom="Jeans or lined trousers";shoes="Closed shoes with socks";acc.push("Scarf")}
  else{top="Thermal base, sweater and heavy coat";bottom="Thermal-lined trousers";shoes="Insulated boots";acc.push("Beanie","Gloves","Scarf")}
  why.push("Feels-like temperature is "+fmt(w.feels)+", which maps to: "+top.toLowerCase()+".");
  if(act==="office"){top=f>=27?"Light full-sleeve cotton shirt":"Shirt with a blazer or knit";bottom="Formal trousers";shoes="Formal shoes or clean loafers";why.push("Office setting selects formal pieces in a fabric that suits the weather.")}
  if(act==="workout"){top="Moisture-wicking t-shirt";bottom="Sports shorts or track pants";shoes="Running or training shoes"}
  if(w.rain>=60){acc.push("Umbrella","Raincoat or water-resistant jacket");shoes+=" (water-resistant if possible)";why.push("Rain chance is "+w.rain+"%, so rain protection is added.")}
  else if(w.rain>=30){acc.push("Compact umbrella");why.push("Rain chance is "+w.rain+"%: a compact umbrella is cheap insurance.")}
  if(w.uv>=6){acc.push("Sunglasses","Cap or hat","Sunscreen SPF 30+");why.push("UV index peaks at "+Math.round(w.uv)+" today, so sun protection is added.")}
  if(w.wind>=30){acc.push("Windbreaker");why.push("Wind is "+Math.round(w.wind)+" km/h, which makes it feel cooler.")}
  if(w.hum>=75&&f>=27)why.push("High humidity ("+w.hum+"%): choose loose cotton or linen in lighter colours.");
  if(w.code>=95)why.push("Thunderstorm warning: avoid open areas outdoors if you can.");
  let s=100-Math.abs(f-22)*3-(w.rain>=60?15:0)-(w.uv>=8?8:0)-(w.wind>=40?10:0);
  return{top,bottom,shoes,acc:[...new Set(acc)],why,score:Math.max(5,Math.min(100,Math.round(s)))}
}

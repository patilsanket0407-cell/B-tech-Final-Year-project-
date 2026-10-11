function clock(){

const d=new Date();

document.getElementById("time").innerHTML=d.toLocaleTimeString();

}

setInterval(clock,1000);

clock();



async function loadData(){

const response=await fetch("/live");

const data=await response.json();

document.getElementById("temp").innerHTML=data.Temperature+" °C";

document.getElementById("humidity").innerHTML=data.Humidity+" %";

document.getElementById("pressure").innerHTML=data.Differential_Pressure+" Pa";

document.getElementById("co2").innerHTML=data.CO2+" ppm";

document.getElementById("pm25").innerHTML=data["PM2.5"];

document.getElementById("pm10").innerHTML=data.PM10;

document.getElementById("score").innerHTML=data.Readiness_Score+"%";

document.getElementById("status").innerHTML=data.OT_Status;

document.getElementById("surgery").innerHTML=data.Surgery_Type;


if(data.OT_Status=="Ready"){

document.getElementById("status").className="status ready";

}

else{

document.getElementById("status").className="status notready";

}



var gauge={

value:data.Readiness_Score,

title:{text:"OT Readiness"},

type:"indicator",

mode:"gauge+number",

gauge:{

axis:{range:[0,100]},

bar:{color:"#00ffff"},

steps:[

{range:[0,40],color:"#7a0000"},

{range:[40,70],color:"#c78500"},

{range:[70,100],color:"#009933"}

]

}

};

Plotly.newPlot("gauge",[gauge],{

paper_bgcolor:"#102637",

font:{color:"white"}

});

}

loadData();

setInterval(loadData,5000);
var physObj = [];

var physTickTimeout = 1000;

var stats = {prevTicks:[1]};

var phys = {gravity:0.01};

function setup(){
  createCanvas(500, 500);
  
  physObj.push(new CircleShape(width/2, height/2, random(-10, 10), 10, 10));
  
  physPreTick();
  
  //window.alert("Finished Setup!")
}

function draw(){
  background(20);
  
  for(let i = 0; i < physObj.length; i++){
    physObj[i].render();
  }
  
  push();
  fill(255)
  text(Math.round(frameRate()) + " Render FPS", 1, 10);
  
  let avgTick = 0;
  for (let i = 0; i < stats.prevTicks.length; i++){
    avgTick += stats.prevTicks[i];
  }
  avgTick *= 10;
  avgTick /= stats.prevTicks.length;
  
  text(Math.round(avgTick) + " Physics Ticks", 1, 22);
  pop();
}

async function physicTick(){
  for (let i = 0; i < physObj.length; i++){
    physObj[i].update();
  }
  
  //window.alert("physicTick");
}

async function physPreTick(){
  let t0 = performance.now();
  await physicTick();
  let t1 = performance.now();
  
  stats.prevTicks.push(t1-t0);
  if (stats.prevTicks.length > 20){
    stats.prevTicks.shift();
  }
  
  //window.alert("physPreTick");
  
  await sleep(physTickTimeout);
  physPreTick()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

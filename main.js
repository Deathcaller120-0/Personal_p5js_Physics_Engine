var physObj = [];

var physTickTimeout = 1000;

var stats = {prevTicks:[1]};

var phys = {gravity:1};

function setup(){
  createCanvas(500, 500);
  
  physObj.push(new CircleShape(width/2, height/2, random(-10, 10), random(-10, 10), 10, 10));
  
  physPreTick();
  
  //window.alert("Finished Setup!")
}

function draw(){
  background(20);
  
  push();
  fill(255)
  text(Math.round(frameRate()) + " Render FPS", 1, 10);
  
  let avgTick = 0;
  for (let i = 0; i < stats.prevTicks.length; i++){
    avgTick += stats.prevTicks[i];
  }
  avgTick *= physTickTimeout;
  avgTick /= stats.prevTicks.length;
  
  text(Math.round(avgTick) + " Physics Ticks", 1, 22);
  pop();
}

function physicTick(){
  for (let i = 0; i < physObj.length; i++){
    physObj[i].update();
  }
  
  //window.alert("physicTick");
}

function physPreTick(){
  let t0 = performance.now();
  physicTick();
  let t1 = performance.now();
  
  stats.prevTicks.push(t1-t0);
  if (stats.prevTicks.length > 20){
    stats.prevTicks.shift();
  }
  
  //window.alert("physPreTick");
  
  setTimeout(physPreTick, physTickTimeout);
}

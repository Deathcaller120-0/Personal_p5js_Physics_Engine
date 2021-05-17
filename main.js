var physObj = [];

var physTickTimeout = 1000/20;

var stats = {prevTicks:[1]};

var phys = {
  gravity:0.1, 
  drag:0.05
};

function setup(){
  createCanvas(500, 500);
  
  physObj.push(new CircleShape(width/2, height/2, random(-10, 10), random(-10, 10), 50));
  
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

function physicTick(){
  for (let i = 0; i < physObj.length; i++){
    physObj[i].update();
  }
  
  //window.alert("physicTick");
}

function physPreTick(){
  let t0 = performance.now();
  try{
    physicTick();
  } catch(error){
    window.alert(error);
  }
  let t1 = performance.now();
  
  stats.prevTicks.push(t1-t0);
  if (stats.prevTicks.length > 20){
    stats.prevTicks.shift();
  }
  
  //await sleep(physTickTimeout);
  setTimeout(physPreTick,physTickTimeout);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
var spawn = {prex:0, prey:0, endx:0, endy:0};
function mousePressed(){
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    spawn.prex = mouseX;
    spawn.prey = mouseY;
  }
}

function mouseDragged(){
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    push()
    stroke(255,255,0,127);
    strokeWeight(3);
    line(spawn.prex, spawn.prey, mouseX, mouseY);
    pop();
    
    spawn.endx = mouseX;
    spawn.endy = mouseY;
  }
}

function mouseReleased(){
   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    physObj.push(new Circle(mouseX, mouseY, random(-20, 20), random(-20, 20), random(10, 50)));
   }
}*/

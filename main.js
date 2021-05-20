//window.alert("loading main");

//try {

physObj = [];

var physTickTimeout = 1000/20;

var stats = {prevTicks:[1]};

phys = {
  gravity:0.1, 
  drag:0.05
};

function setup(){
  //window.alert("setup call");
  try {
  
  createCanvas(500, 500);
  
  physObj.push(new phys_Circle(width / 2, height / 2, random(-20, 20), random(-20, 20), 50));
  physObj.push(new phys_Circle(random(width), random(height), random(-20, 20), random(-20, 20), random(10, 50)));
  physObj[physObj.length-1].setIndex(1);
  
  physPreTick();
  
  } catch (err){
    window.alert("Setup | " + err.name + ": " + err.message)
  }
  //window.alert("Finished Setup")
}

function draw(){
  try {
  background(20);
  
  for(let i = 0; i < physObj.length; i++){
    physObj[i].render();
  }
  
  push();
  fill(255)
  text(nf(frameRate(), 2, 3) + " Render FPS", 1, 10);
  
  let avgTick = 0;
  for (let i = 0; i < stats.prevTicks.length; i++){
    avgTick += stats.prevTicks[i];
  }
  avgTick *= 10;
  avgTick /= stats.prevTicks.length;
  
  text(nf(avgTick, 2, 3) + " Time between Physics Tick", 1, 22);
  pop();
  
  } catch (err){
    window.alert("Draw | " + err.name + ": " + err.message);
    noLoop();
  }
}

function physicTick(){
  try {
  for (let i = 0; i < physObj.length; i++){
    physObj[i].update();
  }
  
  } catch (err){
    window.alert("PhysicTick | " + err.name + ": " + err.message)
  }
  //window.alert("physicTick");
}

function physPreTick(){
  //window.alert("physPreTick Called");
  try {
  
  let t0 = performance.now();

  physicTick();
  
  let t1 = performance.now();
  
  stats.prevTicks.push(t1-t0);
  if (stats.prevTicks.length > 20){
    stats.prevTicks.shift();
  }
  
  //await sleep(physTickTimeout);
  setTimeout(physPreTick,physTickTimeout);
    
  } catch (err){
    window.alert("PhysPreTick | " + err.name + ": " + err.message)
  }
}

//function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

function spawn(){
  let x = document.getElementById("spawnX").value;
  let y = document.getElementById("spawnY").value;
  
  let type = document.getElementById("spawnType").value;
  
  let sizeX = document.getElementById("spawnSizeX").value;
  let sizeY = document.getElementById("spawnSizeY").value;
  
  let vx = document.getElementById("spawnVelX").value;
  let vy = document.getElementById("spawnVelY").value;
  
  if (type == "circle"){
    physObj.push(new phys_Circle(x, y, vx, vy, sizeX));
  }
  physObj[physObj.length - 1].setIndex(physObj.length - 1);
}

/*
document.onload = function(){
  try {
  document.getElementById("gravityControl").onchange = function(){
    phys.gravity = this.value;
  }
  document.getElementById("dragControl").onchange = function(){
    phys.drag = this.value;
  }
  } catch (err){
    window.alert("onload | " + err.name + ": " + err.message);
  }
}
*/

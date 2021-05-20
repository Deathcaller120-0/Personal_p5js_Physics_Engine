//window.alert("loading main");

//try {

physObj = [];

var physTickTimeout = 1000/20;

var stats = {prevTicks:[1]};

phys = {
  gravity:0.1, 
  drag:0.05,
  windX: 0,
  windY: 0
};

function setup(){
  //window.alert("setup call");
  try {
  
  createCanvas(500, 500);
  
  physObj.push(new phys_Circle(width / 2, height / 2, random(-20, 20), random(-20, 20), 50));
  physObj[0].setIndex(0);
  physObj.push(new phys_Circle(random(width), random(height), random(-20, 20), random(-20, 20), random(10, 50)));
  physObj[1].setIndex(1);
  
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
  avgTick /= stats.prevTicks.length;
  
  text(nf(avgTick, 2, 3) + " Physics FPS", 1, 22);
  pop();
    
  push();
  stroke(255);
  line(0, mouseY, width, mouseY);
  line(mouseX, 0, mouseX, height);
  
  noStroke();
  fill(255);
  circle(mouseX, mouseY, 5);
  text(mouseX + ", " + mouseY, mouseX+10, mouseY-12);
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
  
  let time = performance.now();

  physicTick();
  
  stats.prevTicks.push(time);
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
  } else if (type == "rect"){
    physObj.push(new phys_Rect(x, y, vx, vy, sizeX, sizeY));
  }
  physObj[physObj.length - 1].setIndex(physObj.length - 1);
}

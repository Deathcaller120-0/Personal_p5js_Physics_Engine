//window.alert("loading main");

//try {

var physObj = [];

var phys = {
  gravity:0.1, 
  drag:0.05,
  windX: 0,
  windY: 0,
  gravityWellSize: 50,
  timeDiv:20
};

var viewVectors = false;

var physTickTimeout = 1000 / phys.timeDiv;

var stats = {prevTicks:[1]};

function setup(){
  //window.alert("setup call");
  try {
  
  createCanvas(500, 500);
  
  physObj.push(new phys_Circle(width / 2, height / 2, random(-20, 20), random(-20, 20), 50));
  physObj[0].index = 0;
  //physObj.push(new phys_Circle(random(width), random(height), random(-20, 20), random(-20, 20), random(10, 50)));
  //physObj[1].index = 1;
    
  noCursor();
  
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
    if (!viewVectors) {
      physObj[i].render();
    } else {
      physObj[i].vectorRender();
    }
  }
  
  push();
  fill(255)
  text(nf(frameRate(), 2, 3) + " Render FPS", 1, 10);
  
  let avgTick = 0;
  for (let i = 0; i < stats.prevTicks.length; i++){
    avgTick += stats.prevTicks[i];
  }
  avgTick /= performance.now();
  avgTick /= stats.prevTicks.length;
  
  text(nf(avgTick, 2, 3) + " Last Physics Tick Duration", 1, 22);
  pop();
    
  push();
  //stroke(255);
  //line(0, mouseY, width, mouseY);
  //line(mouseX, 0, mouseX, height);
  
  noStroke();
  fill(255);
  circle(mouseX, mouseY, 5);
  text(mouseX + ", " + mouseY, (mouseX > width/2 ? mouseX - 50 : mouseX + 10), (mouseY < height/2 ? mouseY + 20 : mouseY - 12));
  
  // if making a gravity well then render circles in size of well
    
  // doesnt work right now
  //if (mouseIsPressed){
  //  fill(255, 1);
  //  for (let i = 0; i < phys.gravityWellSize + 1; i++){
  //    circle(mouseX, mouseY, i * 10);
  //  }
  //}
  pop();
  
  if (document.getElementById("SpawnView").checked){
    let x = Math.floor(Number(document.getElementById("spawnX").value));
    let y = Math.floor(Number(document.getElementById("spawnY").value));
  
    let type = document.getElementById("spawnType").value;
  
    let sizeX = Math.floor(Number(document.getElementById("spawnSizeX").value));
    let sizeY = Math.floor(Number(document.getElementById("spawnSizeY").value));
  
    let vx = Math.floor(Number(document.getElementById("spawnVelX").value));
    let vy = Math.floor(Number(document.getElementById("spawnVelY").value));
    
    push();
    noStroke();
    text(x + ", " + y, x + sizeX, y - sizeY);
    fill(255,64);
    
    if (type == "circle"){circle(x,y,sizeX)}
    else if (type == "rect"){rect(x-sizeX/2,y-sizeY/2,sizeX,sizeY)}
    
    stroke(255,255,0);
    line(x,y,vx+x,vy+y);
    noStroke();
    fill(255,255,0);
    text(vx + ", " + vy, vx+x, vy+y);
    
    stroke(255);
    line(x, 0, x, height);
    line(0, y, width, y);
    pop();
  }  
  
  } catch (err){
    window.alert("Draw | " + err.name + ": " + err.message);
    noLoop();
  }
}

function physicTick(){
  try {
  for (let main = 0; main < physObj.length; main++){
    physObj[main].update();
    
    // doesnt work how i want it to right now
    //if (mouseIsPressed){
    //  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    //    physObj[main].gravityWell();
    //  }
    //}
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
  let x = Math.floor(Number(document.getElementById("spawnX").value));
  let y = Math.floor(Number(document.getElementById("spawnY").value));
  
  let type = document.getElementById("spawnType").value;
  
  let sizeX = Math.floor(Number(document.getElementById("spawnSizeX").value));
  let sizeY = Math.floor(Number(document.getElementById("spawnSizeY").value));
  
  let vx = Math.floor(Number(document.getElementById("spawnVelX").value));
  let vy = Math.floor(Number(document.getElementById("spawnVelY").value));
  
  if (type == "circle"){
    physObj.push(new phys_Circle(x, y, vx, vy, sizeX));
  } else if (type == "rect"){
    physObj.push(new phys_Rect(x, y, vx, vy, sizeX, sizeY));
  }
}

function mousePressed(){
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    let textarea = document.getElementById("textareaOut");
    textarea.innerHTML = "";
    
    window.alert(textarea);
    
    for (let i = 0; i < physObj.length; i++){      
      let p = physObj[i];
      textarea.innerHTML += indexes[i] + " : {\nX: " + p.pos.x + ", Y: " + p.pos.y + "\nSizeX: " + p.size.x + ", SizeY: " + p.size.y + "\nVelX: " + p.vel.x + ", VelY: " + p.vel.y + "}\n";
    }
  }
}

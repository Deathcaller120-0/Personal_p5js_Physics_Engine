var data = [];
var index0 = 0;
var index1 = 1;
var len = 100;

var cycles = 0;
var compar = 0;
var swaps = 0;
var dir = 1;
var changed = false;

var sorted = false;

function setup() {
  createCanvas(400, 400);
  
  randomSeed(0);
  
  while (data.length < len){
    let r = floor(random(len));
    let f = false;
    for (let i = 0; i < data.length; i++){
      if (data[i] == r){
        f = true;
        break;
      }
    }
    if (!f){
      data.push(r);
    }
  }
  
  noStroke();
}

function draw() {
  background(0, 32);
  
  let w = width / len;  
  for (let i = 0; i < data.length; i++){
    if (index0 == i){
      fill("#00ff00");
    } else if (index1 == i){
      fill("#ff0000");
    } else {
      fill(255, 16);
    }
    let h = round(map(data[i], 0, len, -height, 0));
    rect(i*w, height, w, h);
  }
  
  //insertSort(); // 100 len, comparisons 5050, swaps 2566
  //bubbleSort(); // 100 len, comparisons 8400, swaps 2566
  //gnomeSort(); // 100 len, comparisons ~5200, swaps 2566
  cocktailSort(); // 100 len, comparisons , swaps
  
  push();
  fill(255, 128);
  rect(0,0, 150, 60);
  
  fill(0);
  text(nf(frameRate(), 2, 3) + "\nCycles: " + cycles + "\nComparisons: " + compar + "\nSwaps: " + swaps, 1, 12);
  pop();
}

function insertSort(){
  if (sorted){
    return bubbleSort();
  }
  
  if (data[index0] < data[index1]){
    swap(index0, index1, data);
  }
  
  compar++;
  
  index0++;
  if (index1 == index0){
    index1++;
    index0 = 0;
    cycles++;
  }
  
  if (index1 == len){
    index0 = 0;
    index1 = 1;
    
    //cycles++;
    
    sorted = true;
  }
}

function bubbleSort(){
  if (data[index0] < data[index1]){
    swap(index0, index1, data);
    changed = true;
  }
  
  compar++;
  
  index1++;
  index0 = index1-1;
  if (index0 >= len){
    index1 = 1;
    index0 = 0;
    cycles++;
    
    if (!changed){
      sorted = true;
      noLoop();
    }
    changed = false;
  }
}

function gnomeSort(){
  compar++;
  
  if (index0 == 0 || data[index0-1] >= data[index0]){
    index0++;
    //cycles++;
    index1 = index0;
    
    if (index0 > len) {noLoop();}
  } else {
    let s = swap(index0, index0-1, data);
    index0--;
    
    if (index < 0){
      noLoop();
    }
  }
}

function cocktailSort(){
  if (data[index0] < data[index1] && dir == 1){
    swap(index0, index1, data);
    changed = true;
  } else if (data[index0] > data[index1]){
    swap(index0, index1, data);
    changed = true;
  }
  
  compar++;
  
  index1 += dir;
  index0 = index1 - dir;
  
  if (index0 >= len || index0 == 0){
    cycles++;
    
    dir *= -1;
    
    if (!changed){
      sorted = true;
      noLoop();
    }
    changed = false;
  }
}

function swap(i, j, d){
  if (i < 0 || j < 0 || typeof d !== typeof []) return false;
  
  swaps++;
  
  let a = d[i];
  d[i] = d[j];
  d[j] = a;
  
  return true;
}

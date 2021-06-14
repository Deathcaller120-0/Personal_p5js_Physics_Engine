var data = [];
var index0 = 0;
var index1 = 1;
var len = 200;
var w = 0;

var cycles = 0;
var compar = 0;
var swaps = 0;
var dir = 1;
var changed = false;

var sorted = false;

function setup() {
  createCanvas(400, 400);

  randomSeed(0);

  while (data.length < len) {
    let r = floor(random(len));
    let f = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i] == r) {
        f = true;
        break;
      }
    }
    if (!f) {
      data.push(r);
    }
  }

  noStroke();

  //index0 = floor(data.length/2);
  //index1 = index0 + 1;

  w = width / len;
}

function draw() {
  background(0, 32);

  for (let i = 0; i < data.length; i++) {
    if (index0 == i) fill(0, 255, 0);
    else if (index1 == i) fill(255, 0, 0);
    else fill(255, 16);

    let h = map(data[i], 0, len, -height, 0);
    rect(i * w, height, w, h);
  }

  push();
  stroke(0, 255, 0);
  fill(0, 255, 0);
  let h = map(data[index0], 0, len, 0, height);
  circle(index0 * w + w / 2, h, 10);
  line(0, h, width, h);

  stroke(255, 0, 0);
  fill(255, 0, 0);
  h = map(data[index1], 0, len, 0, height);
  circle(index1 * w + w / 2, h, 10);
  line(0, h, width, h);
  pop();

  //insertSort(); // 100 len, comparisons 5050, swaps 2566
  //bubbleSort(); // 100 len, comparisons 8400, swaps 2566
  //gnomeSort(); // 100 len, comparisons ~5200, swaps 2566
  cocktailSort(); // 100 len, comparisons 5840, swaps 2566

  push();
  fill(255, 128);
  rect(0, 0, 150, 75);

  fill(0);
  text(
    nf(frameRate(), 2, 3) +
      "\nCycles: " +
      cycles +
      "\nComparisons: " +
      compar +
      "\nSwaps: " +
      swaps +
      "\nCompletion: " +
      round(checkSolve(true) * 100) +
      "%",
    1,
    12
  );
  pop();
}

function insertSort() {
  if (sorted) {
    return bubbleSort();
  }

  if (data[index0] < data[index1]) {
    swap(index0, index1, data);
  }

  compar++;

  index0++;
  if (index1 == index0) {
    index1++;
    index0 = 0;
    cycles++;
  }

  if (index1 == len) {
    index0 = 0;
    index1 = 1;

    //cycles++;

    sorted = true;
  }
}

function bubbleSort() {
  if (data[index0] < data[index1]) {
    swap(index0, index1, data);
    changed = true;
  }

  compar++;

  index1++;
  index0 = index1 - 1;
  if (index0 >= len) {
    index1 = 1;
    index0 = 0;
    cycles++;

    if (checkSolve()) {
      sorted = true;
      noLoop();
    }
    changed = false;
  }
}

function gnomeSort() {
  compar++;

  if (index0 == 0 || data[index0 - 1] >= data[index0]) {
    index0++;
    //cycles++;
    index1 = index0;
    if (checkSolve()) {
      noLoop();
    }
  } else {
    let s = swap(index0, index0 - 1, data);
    index0--;

    if (checkSolve()) {
      noLoop();
    }
  }
}

function cocktailSort() {
  if (data[index0] < data[index1]) {
    swap(index0, index1, data);
    changed = true;
  }

  compar++;

  index1 += dir;
  index0 = index1 - 1;

  if (index1 >= len || index1 == 1) {
    cycles++;

    dir *= -1;

    if (checkSolve()) {
      sorted = true;
      noLoop();
    }
    changed = false;
  }
}

function checkSolve(num = false) {
  if (!num) {
    let f = true;
    for (let i = 1; i < data.length; i++) {
      if (data[i] == undefined) {
        return true;
      }
      if (data[i - 1] < data[i]) {
        f = false;
      }
    }
    return f;
  }
  let n = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] < data[i - 1] && data[i] - data[i - 1] < 2) {
      n++;
    }
  }
  return n / data.length;
}

function swap(i, j, d) {
  if (i < 0 || j < 0 || typeof d !== typeof []) return false;

  swaps++;

  let a = d[i];
  d[i] = d[j];
  d[j] = a;

  return true;
}

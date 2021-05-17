//window.alert("loading detection");

function rectRect(x1, y1, w1, h1, x2, y2, w2, h2){
  if (x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
    return true;
  }
  return false;
}
//window.alert("rectRect loaded");

function circleCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
  // get distance between the circle's centers
  // use the Pythagorean Theorem to compute the distance
  let distX = c1x - c2x;
  let distY = c1y - c2y;
  let distance = Math.sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the sum of the circle's
  // radii, the circles are touching!
  if (distance <= c1r+c2r) {
    return true;
  }
  return false;
}
//window.alert("circleCircle loaded");

function circleRect(cx, cy, radius, rx, ry, rw, rh) {

  // temporary variables to set edges for testing
  let testX = cx;
  let testY = cy;

  // which edge is closest?
  if (cx < rx)         testX = rx;      // test left edge
  else if (cx > rx+rw) testX = rx+rw;   // right edge
  if (cy < ry)         testY = ry;      // top edge
  else if (cy > ry+rh) testY = ry+rh;   // bottom edge

  // get distance from closest edges
  let distX = cx-testX;
  let distY = cy-testY;
  let distance = Math.sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}
//window.alert("circleRect loaded");

function pointPoint(x1, y1, x2, y2) {
  // are the two points in the same location?
  if (x1 == x2 && y1 == y2) {
    return true;
  }
  return false;
}
//window.alert("pointPoint loaded");

function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    if(debug){
      let intersectionX = x1 + (uA * (x2-x1));
      let intersectionY = y1 + (uA * (y2-y1));
      fill(255,0,0);
      noStroke();
      ellipse(intersectionX,intersectionY, 20,20);
    }

    return true;
  }
  return false;
}
//window.alert("lineLine loaded");

function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {

  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  let left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
  let right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
  let top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
  let bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    return true;
  }
  return false;
}
//window.alert("lineRect loaded");

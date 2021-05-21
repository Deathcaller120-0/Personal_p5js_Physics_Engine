//window.alert("loading shape")
//try {
  
class phys_Shape {
  constructor(x=50, y=50, vx=0, vy=0, w=10, h=10, shapeType="circle", bounceLoss = 0.5, _color="#FF000080", vectors = []){
    try {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = createVector(w, h);
    this.color = _color;
    
    this.hitPoints = vectors;
    
    this.rot = createVector();
    this.bounce = bounceLoss;
    
    this.type = shapeType;
    
    this.index = physObj.length;
      
    this.mass = this.size.x * this.size.y;
    
    } catch (err){
      window.alert("Shape Setup | " + err.name + ":" + err.message)
    }
    //window.alert("created shape of type:" + this.type);
    //window.alert("pos:" + this.pos.x + ", " + this.pos.y);
  }
  
  wallUpdate(){
    //window.alert("SubUpdate Called");
    try { 
    //window.alert(this.vel.y);
    
    // removed to check performance
    //if(!rectRect(0, 0, width, height, this.pos.x - this.size.x, this.pos.y - this.size.y, this.size.x*2, this.size.y*2)){
      
    //window.alert("Out of bounds, Calculating");
      
      // shape is outside the canvas bounds
      
      //window.alert("Repositioning and vel inversion for Y");
      
      // direct pos editing
      if (this.pos.y + this.vel.y >= height - this.size.y / 2){
        //window.alert("Hit BOttom");
        if (this.vel.y > 0){
          this.invertVel(0);
        }
        
        let diff = height - (this.pos.y + this.size.y / 2);
        this.pos.y += diff;
        
      } else if (this.pos.y + this.vel.y <= this.size.y / 2){
        //window.alert("Hit Top");
        if (this.vel.y < 0){
          this.invertVel(0);
        }
        
        let diff = this.pos.y - this.size.y / 2;
        this.pos.y += -diff;
      }
      
      //window.alert("Repositioning and vel inversion for X");
      
      if (this.pos.x + this.vel.x >= width - this.size.x / 2){
        //window.alert("Hit Right");
        if (this.vel.x > 0){
          this.invertVel(1);
        }
        
        let diff = width - (this.pos.x + this.size.x / 2);
        this.pos.x += diff;
        
      } else if (this.pos.x + this.vel.x <= this.size.x / 2){
        //window.alert("Hit Left");
        if (this.vel.x < 0){
          this.invertVel(1);
        }
        
        let diff = this.pos.x - this.size.x / 2;
        this.pos.x += -diff;
      }
    //}
    this.pos.add(this.vel);
    } catch (err){
      window.alert("SubUpdate | " + err.name + ": " + err.message)
    }
    //window.alert("SubUpdate end");
  }
  
  collsionUpdate(){
    for (let j = 0; j < physObj.length;j++){
      if (this.index == physObj[j].index) {continue;}
      
      let other = physObj[j];
      //window.alert("checking larger collsion");
      if (rectRect(other.pos.x - other.size.x, other.pos.y - other.size.y, other.size.x * 2, other.size.y * 2, this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x * 2, this.size.y * 2)){
        rect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);  
        let mePoints = [];
        let theyPoints = [];
        for (let i = 0; i < this.hitPoints.length){
          mePoints[i] = {x:0, y:0};
          mePoints[i].x = this.hitPoints[i].x + this.pos.x;
          mePoints[i].y = this.hitPoints[i].y + this.pos.y;
        }
        for (let i = 0; i < other.hitPoints.length){
          theyPoints[i] = {x:0, y:0};
          theyPoints[i].x = other.hitPoints[i].x + other.pos.x;
          theyPoints[i].y = other.hitPoints[i].y + other.pos.y;
        }
        if (polyPoly(mePoints, theyPoints)){
            let hits = [];
            for (let i = 0; i < mePoints; i++){
              if (polyPoint(theyPoints, mePoints[i].x, mePoints[i].y)) { 
                hits.push(this.hitPoints[i].label);
                this.hitPoints[i].hit = 1;
                //window.alert("Hit " + this.hitPoints[i].label + " on physObj[" + this.index + "]");
              }
            }
          
            let invY = 0;
            let invX = 0;
            for (let i = 0; i < hits.length; i++){
              if ((hits[i] == "top-left" || hits[i] == "top-mid" || hits[i] == "top-right" || hits[i] == "bottom-left" || hits[i] == "bottom-mid" || hits[i] == "bottom-right") && invY == 0){
                invY = 1;
              }
              if ((hits[i] == "top-left" || hits[i] == "mid-left" || hits[i] == "top-right" || hits[i] == "bottom-left" || hits[i] == "bottom-right" || hits[i] == "mid-right") && invX == 0){
                invX = 1;
              }
              if (invX && invY){break;}
            }
          
            if (invX){
              this.invertVel(1);
            }
            if (invY){
              this.invertVel(0);
            }
            if (invX || invY){
              this.pos.add(this.vel);
            }
          }
      }
    }
  }
  
  update(){
    //window.alert("Update Called")
    
    try{
    for (let i = 0; i < this.hitPoints.length; i++){
      this.hitPoints[i].hit = 0;
    }
    
    this.vel.y += phys.gravity;
    if (this.vel.x > 0){
      this.vel.x += -phys.drag;
    } else {
      this.vel.x += phys.drag;
    }
    
    this.collsionUpdate();
    this.wallUpdate();
    
    if (phys.windX != 0 || phys.windY != 0){
      this.vel.add(phys.windX, phys.windY);
    }
    
    this.pos.x = Math.floor(this.pos.x);
    this.pos.y = Math.floor(this.pos.y);
    
    } catch(err){
      window.alert("Shape Update, " + this.type + ", " + this.index + " | " + err.name + ": " + err.message);
    }
    
    //if (this.pos.y < 100 && this.pos.x < 100){
    //  window.alert("Index: " + this.getIndex());
    //  window.alert("Vel: " + this.vel.x + ", " + this.vel.y);
    //  window.alert("Pos: " + this.pos.x + ", " + this.pos.y);
    //}
    
    //this.pos.add(this.vel);
    
    //window.alert("exiting update");
  }
  
  getShapeType(){
    return this.type;
  }
  
  invertVel(isX){
    //window.alert("inverted vel for: " + (isX ? "x" : "y"));
    try {
    if (isX){
      this.vel.x += (-this.vel.x) * this.bounce;
      this.vel.x *= -1;
    } else {
      this.vel.y += (-this.vel.y) * this.bounce;
      this.vel.y *= -1;
    }
    } catch (err){
      window.alert("InvertVel | " + err.name + ": " + err.message)
    }
  }
  
  getIndex() {
    return this.index;
  }
  
  setIndex(i) {
    this.index = i;
    return this.index;
  }
  
  render(){
    push();
    noStroke();
    fill(this.color);
    beginShape()
    for (let i = 0; i < this.hitPoints.length; i++){
      vertex(this.hitPoints[i].x, this.hitPoints[i].y);
    }
    endShape(CLOSE);
    pop();
  }
}

//window.alert("loading CircleShape");

class phys_Circle extends phys_Shape {
  constructor(x, y, vx, vy, w, _color, bounceLoss = 0.9){
    try {
    super(x, y, vx, vy, w, w, "circle", bounceLoss, _color);
    
    let angles = [];
    for (let i = 7; i >= 0; i--){
      let rad = ((i/8)*360-(90)) * PI/180;
      angles.push(findPointOnCircle(0, 0, this.size.x/2, rad));
    }
    
    for (let i = 0; i < angles.length; i++){
      angles[i].x = Math.floor(angles[i].x);
      angles[i].y = Math.floor(angles[i].y);
    }
    
    this.hitPoints.push({x:angles[0].x, y:angles[0].y, label:"top-left", hit:0});
    this.hitPoints.push({x:angles[1].x, y:angles[1].y, label:"mid-left", hit:0});
    this.hitPoints.push({x:angles[2].x, y:angles[2].y, label:"bottom-left", hit:0});
    this.hitPoints.push({x:angles[3].x, y:angles[3].y, label:"bottom-mid", hit:0});
    this.hitPoints.push({x:angles[4].x, y:angles[4].y, label:"bottom-right", hit:0});
    this.hitPoints.push({x:angles[5].x, y:angles[5].y, label:"mid-right", hit:0});
    this.hitPoints.push({x:angles[6].x, y:angles[6].y, label:"top-right", hit:0});
    this.hitPoints.push({x:angles[7].x, y:angles[7].y, label:"top-mid", hit:0});
    
    } catch (err){
      window.alert("Circle Setup | " + err.name + ": " + err.message)
    }
  }
  
  render = function(){
    try {
      
    //window.alert("render called");
    
    push()
    noStroke();
    
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    fill(255)
    text(this.mass, this.size.x + 20, 0);
    text(this.index, this.size.x + 20, 15);
      
    fill(this.color);
    circle(0, 0, this.size.x);
    
    stroke(0);
    line(0,0,this.size.x/2,0);
    
    stroke(255,255,0)
    line(0,0,this.vel.x,this.vel.y);
      
    noStroke();
    colorMode('hsb', this.hitPoints.length, 1, 1, 1);
    for (let i = 0; i < this.hitPoints.length; i++){
      if (this.hitPoints[i].hit == 1){
        fill(i, 1, 1, 1);
        circle(this.hitPoints[i].x, this.hitPoints[i].y, 3);
        text(this.hitPoints[i].label, -this.size.x*2, -this.size.y*4 + (i * 22));
      }
    }
    pop();
      
    } catch (err){
      window.alert("Render | " + err.name + ": " + err.message)
    }
  }
}

class phys_Rect extends phys_Shape {
  constructor(x, y, vx, vy, w, h, bounceLoss = 0.9, _color = "#00ff0080"){
    super(x, y, vx, vy, w, h, bounceLoss, "rect", _color)
    
    let left = -w/2;
    let top = -h/2;
    let right = w/2;
    let bottom = h/2;
    
    this.hitPoints.push({x:left, y:top, label:"top-left", hit:0});
    this.hitPoints.push({x:left, y:bottom, label:"bottom-left", hit:0});
    this.hitPoints.push({x:right, y:bottom, label:"bottom-right", hit:0});
    this.hitPoints.push({x:right, y:top, label:"top-right", hit:0});
  }
  
  render = function(){
    push();
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    noStroke();
    
    fill(255);
    text(this.mass, this.size.x + 20, 0);
    text(this.index, this.size.x + 20, 15);
    
    fill(this.color);
    rect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    
    stroke(255, 255, 0);
    line(0, 0, this.vel.x, this.vel.y);
    
    stroke(0)
    line(0, 0, this.size.x/2, 0);
    
    noStroke();
    colorMode('hsb', this.hitPoints.length, 1, 1);
    for (let i = 0; i < this.hitPoints.length; i++){
      if (this.hitPoints[i].hit == 1){
        fill(i, 1, 1);
        text(this.hitPoints[i].label, -this.size.x*2, -this.size.y*4 + (i*22));
        circle(this.hitPoints[i].x, this.hitPoints[i].y, 3);
      }
    }
    pop();
  }
}

function findPointOnCircle(originX, originY, radius, angleRadians) {
  var newX = radius * Math.cos(angleRadians) + originX
  var newY = radius * Math.sin(angleRadians) + originY
  return {"x" : newX, "y" : newY}
}

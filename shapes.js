class phys_Shape {
  constructor(x=50, y=50, vx=0, vy=0, w=10, h=10, shapeType="circle", bounceLoss = 0.5, _color="#FFFF0080", vectors = []){
    try {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = createVector(w, h);
    this.color = _color;
    
    this.hitPoints = vectors;
    
    this.rot = createVector();
    this.bounce = bounceLoss;
    
    this.type = shapeType;
      
    this.mass = (this.size.x / 2) * (this.size.y / 2) / 10;
    
    } catch (err){
      window.alert("Shape Setup | " + err.name + ":" + err.message)
    }
    //window.alert("created shape of type:" + this.type);
    //window.alert("pos:" + this.pos.x + ", " + this.pos.y);
  }
  
  wallUpdate(){
    //window.alert("SubUpdate Called");
    try { 
      //window.alert("Repositioning and vel inversion for Y");
      
      // direct pos editing
      if (this.pos.y >= height - this.size.y / 2){
        //window.alert("Hit BOttom");
        if (this.vel.y > 0){
          this.invertVel(0);
        }
        
        this.pos.y = height - (this.size.y / 2);
        
      } else if (this.pos.y <= this.size.y / 2){
        //window.alert("Hit Top");
        if (this.vel.y < 0){
          this.invertVel(0);
        }
        
        this.pos.y = this.size.y / 2;
      }
      
      //window.alert("Repositioning and vel inversion for X");
      
      if (this.pos.x >= width - this.size.x / 2){
        //window.alert("Hit Right");
        if (this.vel.x > 0){
          this.invertVel(1);
        }
        
        this.pos.x = width - (this.size.x / 2);
        
      } else if (this.pos.x <= this.size.x / 2){
        //window.alert("Hit Left");
        if (this.vel.x < 0){
          this.invertVel(1);
        }
        
        this.pos.x = this.size.x / 2;
      }
      
      this.pos.add(this.vel);
      
    } catch (err){
      window.alert("SubUpdate | " + err.name + ": " + err.message)
    }
    //window.alert("SubUpdate end");
  }
  
  collsionUpdate(){
    for (let j = 0; j < physObj.length; j++){
      if (this === physObj[j]) {continue;}
      
      let other = physObj[j];
      //window.alert("checking larger collsion");
      if (rectRect(other.pos.x - other.size.x, 
                   other.pos.y - other.size.y, 
                   other.size.x * 2, 
                   other.size.y * 2, 
                   this.pos.x - this.size.x, 
                   this.pos.y - this.size.y, 
                   this.size.x * 2, 
                   this.size.y * 2)){
        //rect(this.pos.x - this.size.x, this.pos.y - this.size.y, this.size.x * 2, this.size.y * 2);  
        
        let mePoints = getScreenPoints(this.hitPoints, this.pos, this.rot);
        let theyPoints = getScreenPoints(other.hitPoints, other.pos, other.rot);
        if (polyPoly(mePoints, theyPoints)){
          let hits = [];
          for (let i = 0; i < mePoints.length; i++){
            if (polyPoint(theyPoints, mePoints[i].x, mePoints[i].y)) { 
              hits.push(this.hitPoints[i]);
              this.hitPoints[i].hit = true;
            }
          }
          
          let invY = 0;
          let invX = 0;
          for (let i = 0; i < hits.length; i++){
            if ((hits[i].y > this.size.y / 4 || hits[i].y < -this.size.y / 4) && invY == 0){
              invY = 1;
            }
            if ((hits[i].x > this.size.x / 4 || hits[i].x < -this.size.x / 4) && invX == 0){
              invX = 1;
            }
            if (invX && invY){break;}
          }
          
          if (invX){
            this.invertVel(1);
            
            let left = (this.pos.x - this.size.x / 2) - (other.pos.x - other.size.x / 2);
            let right = (this.pos.x + this.size.x) - (other.pos.x + other.size.x);
            if (left > 0 && right < 0){
              this.pos.x += right/10;
            } else {
              this.pos.x += left/10;
            }
          }
          if (invY){
            this.invertVel(0);
            
            let top = (this.pos.y - this.size.y / 2) - (other.pos.y - other.size.y / 2);
            let bottom = (this.pos.y + this.size.y) - (other.pos.y + other.size.y);
            if (top > 0 && bottom < 0){
              this.pos.y += bottom / 10;
            } else {
              this.pos.y += top / 10;
            }
          }
        }
      }
    }
  }
  
  update(){
    //window.alert("Update Called")
    
    try{
    for (let i = 0; i < this.hitPoints.length; i++){
      this.hitPoints[i].hit = false;
    }
    
    this.vel.y += phys.gravity;
    //if (this.vel.y >= this.mass) { this.vel.y = this.mass }
    //else if (this.vel.y < -this.mass) { this.vel.y = -this.mass }
      
    this.vel.x += -this.vel.x * phys.drag;
    this.vel.y += -this.vel.y * phys.drag;
    
    this.collsionUpdate();
    this.wallUpdate();
    
    if (phys.windX != 0 || phys.windY != 0){
      this.vel.add(phys.windX, phys.windY);
    }
    
    //this.pos.x = Math.floor(this.pos.x);
    //this.pos.y = Math.floor(this.pos.y);
    
    } catch(err){
      window.alert("Shape Update, " + this.type + " | " + err.name + ": " + err.message);
    }
    
    //if (this.pos.y < 100 && this.pos.x < 100){
    //  window.alert("Index: " + this.getIndex());
    //  window.alert("Vel: " + this.vel.x + ", " + this.vel.y);
    //  window.alert("Pos: " + this.pos.x + ", " + this.pos.y);
    //}
    
    this.pos.add(this.vel);
    
    //window.alert("exiting update");
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
  
  vectorRender(){
    push();
    
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    noStroke();
    fill(this.color);
    
    beginShape();
    for (let i = 0; i < this.hitPoints.length; i++){
      vertex(this.hitPoints[i].x, this.hitPoints[i].y);
    }
    endShape(CLOSE);
    
    stroke(0);
    line(0,0,this.size.x/2,0);
    
    stroke(255,255,0)
    line(0,0,this.vel.x,this.vel.y);
    
    noStroke();
    
    colorMode('hsb', this.hitPoints.length, 1, 1, 1);
    for (let i = 0; i < this.hitPoints.length; i++){
      fill(i, 1, 1, 1);
      circle(this.hitPoints[i].x, this.hitPoints[i].y, 3);
      text(this.hitPoints[i].x + ", " + this.hitPoints[i].y, -this.size.x * 2, -200 + (i * 13));
    }
    
    pop();
  }
  
  gravityWell() {
    //let dx = mouseX - this.pos.x;
    //let dy = mouseY - this.pos.y;
    
    //dx = dx > 0 ? dx : -dx;
    //dy = dy > 0 ? dy : -dy;
    
    //if (dy < this.size.y + phys.gravityWellSize && dx < this.size.x + phys.gravityWellSize) {
      let g = this.mass*phys.gravityWellSize;
      this.vel.x += g / (mouseX - this.pos.x + phys.gravityWellSize);
      this.vel.y += g / (mouseY - this.pos.y + phys.gravityWellSize);
    //}
  }
}

//window.alert("loading CircleShape");

class phys_Circle extends phys_Shape {
  constructor(x, y, vx, vy, w, _color = "#FF000080", bounceLoss = 0.9){
    try {
    super(x, y, vx, vy, w, w, "circle", bounceLoss, _color);
    
    let angles = [];
    let complexity = Math.floor(this.size.x/3);
    for (let i = 0; i < complexity; i++){
      let rad = (( i / complexity) * 360) * (PI / 180);
      angles.push(findPointOnCircle(0, 0, this.size.x/2, rad));
    }
    
    for (let i = 0; i < angles.length; i++){
      angles[i].x = Math.floor(angles[i].x);
      angles[i].y = Math.floor(angles[i].y);
    }
    
    for (let i = 0; i < angles.length; i++){
      this.hitPoints.push({x:angles[i].x, y:angles[i].y, hit:0});
    }
    
    } catch (err){
      window.alert("Circle Setup | " + err.name + ": " + err.message)
    }
  }
  
  render(){
    try {
      
    //window.alert("render called");
    
    push()
    noStroke();
    
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    //fill(255)
    //text(this.mass, this.size.x + 20, 0);
      
    fill(this.color);
    circle(0, 0, this.size.x);
    
    stroke(0);
    line(0,0,this.size.x/2,0);
    
    stroke(255,255,0)
    line(0,0,this.vel.x,this.vel.y);
    
    noStroke();
    
    //rect(-this.size.x / 2, -this.size.y/2, this.size.x, this.size.y);
    
    colorMode('hsb', this.hitPoints.length, 1, 1, 1);
    for (let i = 0; i < this.hitPoints.length; i++){
      if (this.hitPoints[i].hit == 1){
        fill(i, 1, 1, 1);
        circle(this.hitPoints[i].x, this.hitPoints[i].y, 3);
        //text(this.hitPoints[i].x + ", " + this.hitPoints[i].y, -this.size.x * 2, -100 + (i * 22));
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
    
    this.hitPoints.push({x:left, y:top, hit:0});
    this.hitPoints.push({x:left, y:bottom, hit:0});
    this.hitPoints.push({x:right, y:bottom, hit:0});
    this.hitPoints.push({x:right, y:top, hit:0});
  }
  
  render (){
    push();
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    noStroke();
    
    fill(255);
    text(this.mass, this.size.x + 20, 0);
    
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
        //text(this.hitPoints[i].x + ", " + this.hitPoints[i].y, -this.size.x * 2, -100 + (i * 22));
        circle(this.hitPoints[i].x, this.hitPoints[i].y, 3);
      }
    }
    pop();
  }
}

function findPointOnCircle(originX, originY, radius, angleRadians) {
  let newX = radius * Math.cos(angleRadians) + originX;
  let newY = radius * Math.sin(angleRadians) + originY;
  return {"x" : newX, "y" : newY};
}

function getScreenPoints(points, trans = {x:100, y:100}, rot = {x:0, y:0}){
  let p = [];
  for (let i = 0; i < points.length; i++){
    p.push({x:0,y:0});
    p[i].x = points[i].x + trans.x;
    p[i].y = points[i].y + trans.y;
  }
  return p;
}

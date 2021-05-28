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
              hits.push(this.hitPoints[i].label);
              this.hitPoints[i].hit = true;
            }
          }
          
          let invY = 0;
          let invX = 0;
          for (let i = 0; i < hits.length; i++){
            if ((hits[i] == "top-left" || 
                 hits[i] == "top-mid" || 
                 hits[i] == "top-right" || 
                 hits[i] == "bottom-left" || 
                 hits[i] == "bottom-mid" || 
                 hits[i] == "bottom-right") && invY == 0){
              invY = 1;
            }
            if ((hits[i] == "top-left" || 
                 hits[i] == "mid-left" || 
                 hits[i] == "top-right" || 
                 hits[i] == "bottom-left" || 
                 hits[i] == "bottom-right" || 
                 hits[i] == "mid-right") && invX == 0){
              invX = 1;
            }
            if (invX && invY){break;}
          }
          
          if (invX){
            this.invertVel(1);
            let left = (this.pos.x - this.size.x / 2) - (other.pos.x - other.size.x / 2);
            let right = (this.pos.x + this.size.x) - (other.pos.x + other.size.x);
            if (left > 0 && right < 0){
              this.pos.x += right/2;
            } else {
              this.pos.x += left/2;
            }
          }
          if (invY){
            this.invertVel(0);
            let top = (this.pos.y - this.size.y / 2) - (other.pos.y - other.size.y / 2);
            let bottom = (this.pos.y + this.size.y) - (other.pos.y + other.size.y);
            if (top > 0 && bottom < 0){
              this.pos.y += bottom/2;
            } else {
              this.pos.y += top/2;
            }
          }
        }
        
        /*
        let distanceVect = p5.Vector.sub(other.pos, this.pos);

        // Calculate magnitude of the vector separating the balls
        let distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        let minDistance = this.size.x + other.size.x;

        if (distanceVectMag < minDistance) {
        let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
        let d = distanceVect.copy();
        let correctionVector = d.normalize().mult(distanceCorrection);
        other.pos.add(correctionVector);
        this.pos.sub(correctionVector);

        // get angle of distanceVect
        let theta = distanceVect.heading();
        // precalculate trig values
        let sine = sin(theta);
        let cosine = cos(theta);
  
        // bTemp will hold rotated ball this.positions. You 
        // just need to worry about bTemp[1] this.position
        let bTemp = [new p5.Vector(), new p5.Vector()];

        // this ball's this.position is relative to the other
        // so you can use the vector between them (bVect) as the 
        // reference point in the rotation expressions.
        // bTemp[0].this.position.x and bTemp[0].this.position.y will initialize
        // automatically to 0.0, which is what you want
        // since b[1] will rotate around b[0]
        bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
        bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

        // rotate Temporary velocities
        let vTemp = [new p5.Vector(), new p5.Vector()];

        vTemp[0].x = cosine * this.vel.x + sine * this.vel.y;
        vTemp[0].y = cosine * this.vel.y - sine * this.vel.x;
        vTemp[1].x = cosine * other.vel.x + sine * other.vel.y;
        vTemp[1].y = cosine * other.vel.y - sine * other.vel.x;

        // Now that velocities are rotated, you can use 1D
        // conservation of momentum equations to calculate 
        // the final this.vel along the x-axis. 
        let vFinal = [new p5.Vector(), new p5.Vector()];

        // final rotated this.vel for b[0]
        vFinal[0].x = ((this.mass - other.mass) * vTemp[0].x + 2 * other.mass * vTemp[1].x) / (this.mass + other.mass);
        vFinal[0].y = vTemp[0].y;

        // final rotated this.vel for b[0]
        vFinal[1].x = ((other.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + other.mass);
        vFinal[1].y = vTemp[1].y;

        // hack to avoid clumping
        bTemp[0].x += vFinal[0].x;
        bTemp[1].x += vFinal[1].x;

        // Rotate ball this.positions and velocities back
        // Reverse signs in trig expressions to rotate 
        // in the opposite direction 
        // rotate balls
        let bFinal = [new p5.Vector(), new p5.Vector()];

        bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
        bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
        bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
        bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

        // update balls to screen this.position
        other.pos.x = this.pos.x + bFinal[1].x;
        other.pos.y = this.pos.y + bFinal[1].y;

        this.pos.add(bFinal[0]);

        // update velocities
        this.vel.x = (cosine * vFinal[0].x - sine * vFinal[0].y) * this.bounce;
        this.vel.y = (cosine * vFinal[0].y + sine * vFinal[0].x) * this.bounce;
        other.vel.x = (cosine * vFinal[1].x - sine * vFinal[1].y) * other.bounce;
        other.vel.y = (cosine * vFinal[1].y + sine * vFinal[1].x) * other.bounce;
        }*/
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
  
  render(){
    try {
      
    //window.alert("render called");
    
    push()
    noStroke();
    
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    
    fill(255)
    text(this.mass, this.size.x + 20, 0);
      
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
        text(this.hitPoints[i].label, -this.size.x*2, -100 + (i * 22));
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
        text(this.hitPoints[i].label, -this.size.x*2, -100 + (i*22));
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

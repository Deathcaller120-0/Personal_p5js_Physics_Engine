//window.alert("loading shape")
//try {
  
class phys_Shape {
  constructor(x=50, y=50, vx=0, vy=0, w=10, h=10, _color="#FF000080", shapeType="circle", bounceLoss = 0.5, vectors = []){
    try {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = createVector(w, h);
    this.color = _color || color(255, 0, 0, 255/4);
    
    this.customVectors = vectors;
    
    this.rot = createVector();
    this.bounce = bounceLoss;
    
    this.type = shapeType;
    
    this.index = 0;
    
    } catch (err){
      window.alert("Shape Setup | " + err.name + ":" + err.message)
    }
    //window.alert("created shape of type:" + this.type);
    //window.alert("pos:" + this.pos.x + ", " + this.pos.y);
  }
  
  wallUpdate(){
    //window.alert("SubUpdate Called");
    try { 
    this.vel.y += phys.gravity;
    this.vel.x += (this.vel.x > 0 ? -phys.drag : phys.drag);
    
    //window.alert(this.vel.y);
    
    // removed to check performance
    //if(!rectRect(0, 0, width, height, this.pos.x - this.size.x, this.pos.y - this.size.y, this.size.x*2, this.size.y*2)){
      
    //window.alert("Out of bounds, Calculating");
      
      // shape is outside the canvas bounds
      
      //window.alert("Repositioning and vel inversion for Y");
      
      // direct pos editing
      if (this.pos.y + this.vel.y >= height - this.size.y / 2){
        //window.alert("Hit Top");
        this.invertVel(0);
        
        let diff = height - (this.pos.y + this.size.y/2);
        this.pos.y += diff;
        
      } else if (this.pos.y + this.vel.y <= this.size.y / 2){
        //window.alert("Hit Bottom");
        this.invertVel(0);
        
        let diff = this.pos.y - this.size.y/2;
        this.pos.y -= diff;
      }
      
      //window.alert("Repositioning and vel inversion for X");
      
      if (this.pos.x + this.vel.x >= width - this.size.x / 2){
        //window.alert("Hit Right");
        this.invertVel(1);
        
        let diff = width - (this.pos.x + this.size.x/2);
        this.pos.x += diff;
        
      } else if (this.pos.x + this.vel.x <= this.size.x / 2){
        //window.alert("Hit Left");
        this.invertVel(1);
        
        let diff = this.pos.x - this.size.x/2;
        this.pos.x -= diff;
      }
    //}
    this.pos.add(this.vel);
    //window.alert("Adding Pos");
      
    } catch (err){
      window.alert("SubUpdate | " + err.name + ": " + err.message)
    }
    //window.alert("SubUpdate end");
  }
  
  collsionUpdate(){
    let type0 = this.getShapeType();
    let type1 = other.getShapeType();
    
    //window.alert("checking larger collsion");
    if (rectRect(other.pos.x - other.size.x, other.pos.y - other.size.y, other.size.x * 2, other.size.y * 2, this.pos.x - this.size.x/2, this.pos.y - this.size.y, this.size.x * 2, this.size.y * 2)){
      if (type0 == "circle" || type1 == "circle"){
        if (type0 == type1) {
          if (polyPoly(this.hitPoints, other.hitPoints)){
            let hits = [];
            for (let i = 0; i < this.hitPoints.length; i++){
              if(!polyPoint(other.hitPoints, this.hitPoints[i].x, this.hitPoints[i].y)) { continue; }
              hits.push(this.hitPoints[].label);
            }
            
            let invY = 0;
            let invX = 0;
            for (let i = 0; i < hits.length; i++){
              if (hits[i] == "top-left" || hits[i] == "top-mid" || hits[i] == "top-right" || hits[i] == "bottom-left" || hits[i] == "bottom-mid" || hits[i] == "bottom-right" && invY == 0){
                invY = 1;
              }
              if (hits[i] == "top-left" || hits[i] == "mid-left" || hits[i] == "top-right" || hits[i] == "bottom-left" || hits[i] == "bottom-mid" || hits[i] == "bottom-right" && invY == 0){
                invX = 1;
              }
            }
          }
        }
      }
    }
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
}

//window.alert("loading CircleShape");

class phys_Circle extends phys_Shape {
  constructor(x, y, vx, vy, w, _color, bounceLoss = 0.9){
    try {
    super(x, y, vx, vy, w, w, _color, "circle", bounceLoss);
    //window.alert("circle created");
    } catch (err){
      window.alert("Circle Setup | " + err.name + ": " + err.message)
    }
  }
  
  update(){
    //window.alert("Update Called")
    try {
    for (let i = 0; i < physObj.length; i++){
      //if (typeof physObj[i] != Object) {continue;}
      if (physObj[i].getIndex() == this.getIndex()) {continue;}
      
      //window.alert("Got a shape");
      
      let other = physObj[i];
      let type0 = this.getShapeType();
      let type1 = other.getShapeType();
      
      //window.alert("checking larger collsion");
      if (rectRect(other.pos.x - other.size.x - 10, other.pos.y - other.size.y - 10, other.size.x * 2 + 10, other.size.y * 2 + 10, this.pos.x - this.size.x + 10, this.pos.y - this.size.y + 10, this.size.x * 2 + 10, this.size.y * 2 + 10)){
        if (type0 == "circle" || type1 == "circle"){
          if (type0 == type1) {
            if (circleCircle(this.pos.x - this.size.x, this.pos.y - this.size.y, this.size.x * 2, other.pos.x - other.size.x, other.pos.y - other.size.y, other.size.x * 2)){
              other.vel.x += (-other.vel.x) * other.bounce;
              other.vel.y += (-other.vel.y) * other.bounce;
              other.vel.mult(-1);
              
              this.vel.x += (-this.vel.x) * this.bounce;
              this.vel.y += (-this.vel.y) * this.bounce;
              this.vel.mult(-1);
            }
          }/*
          if (type0 == "rect" || type1 == "rect"){
            if (rectCircle()){
              other.vel.add(-other.vel.mult(other.bounce));
              this.vel.add(-this.vel.mult(this.bounce));
              
              other.vel.mult(-1);
              this.vel.mult(-1);
            }
          }
        }
        if (type0 == "rect" || type1 == "rect"){
          if (type0 == type1){
            return "rectRect";
          }
        }*/
        }
      }
    }
    this.subUpdate();
      
    } catch (err){
      window.alert("Update | " + err.name + ": " + err.message)
    }
    //window.alert("exiting update");
  }
  
  render(){
    try {
      
    //window.alert("render called");
    
    push()
    noStroke();
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    circle(0, 0, this.size.x);
    
    stroke(0);
    line(0,0,this.size.x/2,0);
    
    stroke(255,255,0)
    line(0,0,this.vel.x,this.vel.y);
    pop();
      
    } catch (err){
      window.alert("Render | " + err.name + ": " + err.message)
    }
  }
}
  
//} catch (e){
//  window.alert("Shapes Main | " + e.name + ": " + e.message);
//}

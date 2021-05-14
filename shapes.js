class Shape {
  constructor(x, y, vx, vy, w, h, _color, shapeType, bounceLoss = 0.5, vectors = []){
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = createVector(w, h);
    this.color = _color || color(255, 0, 0, 255/4);
    
    this.customVectors = vectors;
    
    this.rot = createVector();
    this.bounce = bounceLoss;
    
    this.type = shapeType;
    
    window.alert("created shape of type:" + this.type);
  }
  
  update(){
    window.alert("updating shape");
    
    this.vel.y += phys.gravity;
    if(!rectRect(this.pos.x-this.size.x/2, this.pos.y-this.size.y/2, this.size.x/2, this.size.y/2, 0, 0, width, height)){
      // its outside the canvas bounds
      let x = this.vel.x;
      let y = this.vel.y;
      let sx = this.size.x/2; 
      let sy = this.size.y/2;
      
      // if it has enough velocity to escape the bounds, don't let it
      if (y+sy > height || y-sy < 0){
        this.invertVel(0);
      }
      
      if (x+sx > width || x-sx < 0){
        this.invertVel(1);
      }
      
      // set x, y to shapes position
      x = this.pos.x;
      y = this.pos.y;
      
      if (y+sy > height){
        while (y+sy > height){
          this.pos.y += -1e-4;
        }
      } else if (y-sy < 0){
        while (y-sy < 0){
          this.pos.y += 1e-4;
        }
      }
      
      if (x+sx > width){
        while (y+sy > width){
          this.pos.x += -1e-4;
        }
      } else if (x-sx < 0){
        while (x-sx < 0){
          this.pos.x += 1e-4;
        }
      }
    }
    this.pos.add(this.vel);
  }
  
  getShapeType(){
    return this.type;
  }
  
  invertVel(isX){
    if (isX){
      this.vel.x += -this.vel.x * this.bounce;
      this.vel.x *= -1;
    } else {
      this.vel.y += -this.vel.y * this.bounce;
      this.vel.y *= -1;
    }
  }
}

class CircleShape extends Shape {
  constructor(x, y, vx, vy, w, h, _color, bounceLoss = 0.9){
    super(x, y, vx, vy, w, h, _color, "circle", bounceLoss);
    window.alert("circle created");
  }
  
  update(){
    super.update();
  }
  
  render(){
    window.alert("circle rendered");
    push()
    rotate(super.rot.x);
    translate(super.pos.x, super.pos.y);
    fill(super.color);
    circle(0, 0, super.size.x);
    pop()
  }
}

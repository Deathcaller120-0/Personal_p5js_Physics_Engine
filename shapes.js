class Shape {
  constructor(x=50, y=50, vx=0, vy=0, w=10, h=10, _color="#f00", shapeType="rect", bounceLoss = 0.5, vectors = []){
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = createVector(w, h);
    this.color = _color || color(255, 0, 0, 255/4);
    
    this.customVectors = vectors;
    
    this.rot = createVector();
    this.bounce = bounceLoss;
    
    this.type = shapeType;
    
    //window.alert("created shape of type:" + this.type);
    //window.alert("pos:" + this.pos.x + ", " + this.pos.y);
  }
  
  subUpdate(){
    //window.alert("updating shape");
    
    this.vel.y += phys.gravity;
    
    //window.alert(this.vel.y);
    if(!rectRect(this.pos.x-this.size.x/2, this.pos.y-this.size.y/2, this.size.x/2, this.size.y/2, 0, 0, width, height)){
      //window.alert("Out of bounds, Calculating");
      // its outside the canvas bounds
      let x = this.vel.x;
      let y = this.vel.y;
      let sx = this.size.x/2; 
      let sy = this.size.y/2;
      
      //window.alert("vars set");
      
      // if it has enough velocity to escape the bounds, don't let it
      if (y+sy > height || y-sy < 0){
        this.invertVel(0);
      }
      
      if (x+sx > width || x-sx < 0){
        this.invertVel(1);
      }
      
      //window.alert("Setting x,y to pos.x, pos.y");
      
      // set x, y to shapes position
      x = this.pos.x;
      y = this.pos.y;
      
      if (y+sy > height){
        window.alert("bottom collsion");
        while (y+sy > height){
          this.pos.y += -1e-2;
        }
      } else if (y-sy < 0){
        window.alert("top collsion");
        while (y-sy < 0){
          this.pos.y += 1e-2;
        }
      }
      
      if (x+sx > width){
        window.alert("right collsion");
        while (y+sy > width){
          this.pos.x += -1e-2;
        }
      } else if (x-sx < 0){
        window.alert("left collsion")
        while (x-sx < 0){
          this.pos.x += 1e-2;
        }
      }
      //window.alert("Exiting collsion checker");
    }
    this.pos.add(this.vel);
  }
  
  getShapeType(){
    return this.type;
  }
  
  invertVel(isX){
    //window.alert("inverted vel for:" + (isX ? "x" : "y"));
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
    //window.alert("circle created");
  }
  
  update(){
    this.subUpdate();
  }
  
  render(){
    //window.alert("circle rendered");
    push()
    rotate(this.rot.x);
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    circle(0, 0, this.size.x);
    pop()
  }
}

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
      if (y > height - sy || y < 0 + sy){
        this.invertVel(0);
      }
      
      if (x > width - sx || x < 0 + sx){
        this.invertVel(1);
      }
      
      //window.alert("Setting x,y to pos.x, pos.y");
      
      // set x, y to shapes position
      x = this.pos.x;
      y = this.pos.y;
      
      if (y > height - sy){
        window.alert("bottom collsion");
        while (this.pos.y > height - sy){
          this.pos.y -= 1;
        }
      } else if (y < 0 + sy){
        window.alert("top collsion");
        while (this.pos.y < 0 + sy){
          this.pos.y += 1;
        }
      }
      
      if (x > width - sx){
        window.alert("right collsion");
        while (this.pos.x > width - sx){
          this.pos.x -= 1;
        }
      } else if (x < 0 + sx){
        window.alert("left collsion")
        while (this.pos.x < 0 + sx){
          this.pos.x += 1;
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
    window.alert("inverted vel for: " + (isX ? "x" : "y"));
    if (isX){
      this.vel.x += (-this.vel.x) * this.bounce;
      this.vel.x *= -1;
    } else {
      this.vel.y += (-this.vel.y) * this.bounce;
      this.vel.y *= -1;
    }
  }
}

class CircleShape extends Shape {
  constructor(x, y, vx, vy, w, _color, bounceLoss = 0.9){
    super(x, y, vx, vy, w, w, _color, "circle", bounceLoss);
    //window.alert("circle created");
  }
  
  update(){
    this.subUpdate();
  }
  
  render(){
    //window.alert("circle rendered");
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
    pop()
  }
}

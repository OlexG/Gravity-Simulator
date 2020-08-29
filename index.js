
mode = 3;
//0 is selecting shape size
//1 is selecting shape speed
//2 is release and pushing shape
//3 is idle
var prevClickX = 0;
var prevClickY = 0;
var tempSize;
var tempVelX;
var tempVelY;
var bodies = []
var gravityConstant = 5;
function normalize(pos){
  var length = Math.sqrt(pos.x*pos.x+pos.y*pos.y);
  pos.x = pos.x/length; //assigning new value to x (dividing x by length of the vector)
  pos.y= pos.y/length;
  return pos;
}
function distance(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}
var keyPressed = {};
function draw(){
  noFill();
  background(255,255,255);
  //pressing and creating bodies
  //just clicked
  if (mode == 0){
    ellipse(prevClickX,prevClickY,Math.max(Math.abs(mouseX - prevClickX),Math.abs(mouseY - prevClickY)) * 2,Math.max(Math.abs(mouseX - prevClickX),Math.abs(mouseY - prevClickY)) * 2);
    tempSize = Math.max(Math.abs(mouseX - prevClickX),Math.abs(mouseY - prevClickY)) * 2;
    tempSize = max(3, tempSize);
  }
  else if (mode == 1){
    ellipse(prevClickX, prevClickY, tempSize, tempSize);
    line(prevClickX, prevClickY, mouseX, mouseY);
    tempVelX = prevClickX - mouseX;
    tempVelY = prevClickY - mouseY;
  }
  else if (mode == 2){
    bodies.push({"size":tempSize, "pos":{"x":prevClickX, "y":prevClickY}, "vel":{"x":tempVelX/50, "y":tempVelY/50}, "color":{"r":Math.random() * 255, "g":Math.random() * 255, "b":Math.random() * 255}})
    mode++;
  }
  for (let x = 0; x < bodies.length; x++){
    for (let y = 0; y < bodies.length; y++){
      if (y != x){
        var dist = Math.pow((bodies[x].pos.x-bodies[y].pos.x), 2) + Math.pow((bodies[x].pos.y-bodies[y].pos.y), 2);
        var dir = normalize({"x":bodies[y].pos.x - bodies[x].pos.x, "y":bodies[y].pos.y - bodies[x].pos.y});
        var force = {"x":dir.x * gravityConstant * bodies[x].size * bodies[y].size / dist, "y": dir.y * gravityConstant * bodies[x].size * bodies[y].size / dist};
        var accel = {"x":force.x / bodies[x].size, "y":force.y/bodies[x].size};
        bodies[x].vel.x += accel.x;
        bodies[x].vel.y += accel.y;
      }
    }
  }
  for (let x = 0; x < bodies.length; x++){
    fill(bodies[x].color.r, bodies[x].color.g, bodies[x].color.b);
    ellipse(bodies[x].pos.x, bodies[x].pos.y, bodies[x].size, bodies[x].size);
    bodies[x].pos.x += bodies[x].vel.x;
    bodies[x].pos.y += bodies[x].vel.y;
  }
  for (let x = bodies.length - 1; x >= 0; x--){
    for (let y =  bodies.length - 1; y >= 0; y--){
      if (y != x){
        try{
          if (distance(bodies[x].pos.x, bodies[x].pos.y, bodies[y].pos.x, bodies[y].pos.y) < bodies[x].size){
            if (bodies[x].size >= bodies[y].size){
              bodies[x].size += bodies[y].size;
              bodies.splice(y, 1);
            }
          }
        }
        catch(err){

        }
      }
    }
  }
  if (keyPressed["w"]){
    //w
    for (let x = 0; x < bodies.length; x++){
      bodies[x].pos.y += 5;
    }
  }
  if (keyPressed["d"]){
    //d
    for (let x = 0; x < bodies.length; x++){
      bodies[x].pos.x -= 5;
    }
  }
  if (keyPressed["s"]){
    //s
    for (let x = 0; x < bodies.length; x++){
      bodies[x].pos.y -= 5;
    }
  }
  if (keyPressed["a"]){
    //a
    for (let x = 0; x < bodies.length; x++){
      bodies[x].pos.x += 5;
    }
  }
}
document.onkeydown = (e)=>{
    keyPressed[e.key]=true
}

document.onkeyup = (e)=>{
    keyPressed[e.key]=false
}
function mouseClicked(){
  if (mode == 3){
    prevClickX = mouseX;
    prevClickY = mouseY;
  }
  mode = (mode + 1) % 4;
}

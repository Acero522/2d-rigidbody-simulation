var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Mouse = Matter.Mouse,
Events = Matter.Events,
Common = Matter.Common,
Body = Matter.Body;

Matter.use('matter-attractors');

var w = 650, h = 700;
var res = 10, halfRes = res / 2;
let cols = w / res + 1, rows = h / res + 1;
var engine, world;
var balls = [];
var obstacles = [];
var attractor;
var minParticleSize = 10;
var maxParticleSize = 50;
var particleAmt = 50;
var attractorGravity = 0;
var mouse;

function setup() {
    var canvas = createCanvas(w, h);
    canvas.parent("canvas")
    engine = Engine.create();
    world = engine.world;
    obstacles.push(new Box(w/2, 0, w, 15)); //上侧
    obstacles.push(new Box(w/2, h, w, 15));   //下侧
    obstacles.push(new Box(w/2, h+70, w-1000, 150,PI/4));   //三角
    obstacles.push(new Box(0, 0, 15, h*2));   //左侧
    obstacles.push(new Box(w, 0 , 15, h*2));    //右侧
    obstacles.push(new Box(w/2, h/2 - 50, w/2, 100, PI /4 )); //中间
    World.add(world, obstacles);
     
    mouse = Mouse.create(canvas.elt) 
    mouse.pixelRatio = pixelDensity();
   
    attractor = Matter.Bodies.circle(width/2, height/2, 20, {
      plugin: {
        attractors: [function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * attractorGravity,
            y: (bodyA.position.y - bodyB.position.y) * attractorGravity,
          };
        }]
      }
    });
    World.add(world,attractor)

    initParticles();
    setupUi();
  }

  function mousePressed() {
    attractorGravity = 1e-6
    world.gravity.scale = 0;
  }

  function mouseDragged() {
      Body.translate(attractor, {
        x: (mouse.position.x - attractor.position.x) * 0.25,
        y: (mouse.position.y - attractor.position.y) * 0.25
    });
  }

  function mouseReleased() {
    world.gravity.scale = 0.001
    attractorGravity = 0;
  }

function draw() {
  Engine.update(engine);
  background(255)
  for (ball of balls) {
    ball.update();
    ball.show();
  }
  for(obstacle of obstacles){
    obstacle.show();
  }
  noStroke()
}
$("#particle-amount").change(()=>{
  particleAmt = $("#particle-amount").val()
  initParticles()
})

$("#max-size").change(()=>{
  maxParticleSize = parseInt($("#max-size").val())
  initParticles()
})

$("#min-size").change(()=>{
  minParticleSize = parseInt($("#min-size").val())
  initParticles()
})

function initParticles(){
  for (const ball of balls) {
    World.remove(world, ball.body)
  }
  balls = []
  for (let i = 0; i < particleAmt; i++) {
      balls.push(new Ball(random(0,w), random(80,100), random(minParticleSize, maxParticleSize)));
  }
}

function setupUi(){
  $("#max-size").val(maxParticleSize)
  $("#min-size").val(minParticleSize)
  $("#resolution").val(res)
  $("#particle-amount").val(particleAmt)
}
import { res } from "./res.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./Vector2.js";
import { GameLoop } from "./gameLoop.js";
import { Input } from "./input.js";
import { Animations } from "./animation_player.js";
import { FrameIndexPattern } from "./pattern.js";
import { CHARGE_LEFT, CHARGE_RIGHT, COUGHT1, COUGHT2, DASH_LEFT1, DASH_LEFT2, DASH_RIGHT1, DASH_RIGHT2, DUCK1, DUCK2, SAW, STAND_LEFT, STAND_RIGHT, WALK_LEFT, WALK_RIGHT } from "./animation.js";

const d_over_dx = 0.00019245008973;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const input = new Input();
let facing = "LEFT";
let z = false;
let d = 0;
let p = false;
let dmg = false;
let flash = false;
let score2 = 0;
let hiscore2 = window.localStorage.getItem("hiscore2")??0;
document.querySelector("#hiscore2").innerText = `High score: ${hiscore2}`

let timer2 = 99;
const RESOLUTION = new Vector2(1200, 700)
let duck = false;

function saveHiscore(){
  if(score2>hiscore2){
    hiscore2 = score2;
    window.localStorage.setItem("hiscore2", score2)
    document.querySelector("#hiscore2").innerText = `High score: ${hiscore2}`
  }
  if(score2>0){
    alert(`Congratulations\nyou collected ${score2} eggs.\n\ndon't leave me here`)
    window.location.assign("/index.html")
  }
  
}

document.querySelector("#pallete").onclick = () => {
  window.location.assign("https://www.onet.pl/")
}

const back = new Sprite({
  resource: res.images.black,
  frameSize: new Vector2(1800, 1700)
}
)

const r1 = new Sprite({
  resource: res.images.r1,
  frameSize: new Vector2(600, 600)
}
)
const r2 = new Sprite({
  resource: res.images.r2,
  frameSize: new Vector2(600, 600)
}
)
const r3 = new Sprite({
  resource: res.images.r3,
  frameSize: new Vector2(600, 600)
}
)
const r4 = new Sprite({
  resource: res.images.r4,
  frameSize: new Vector2(600, 600)
}
)
const r5 = new Sprite({
  resource: res.images.r5,
  frameSize: new Vector2(600, 600)
}
)
const r6 = new Sprite({
  resource: res.images.r6,
  frameSize: new Vector2(600, 600)
}
)
const r7 = new Sprite({
  resource: res.images.r7,
  frameSize: new Vector2(600, 600)
}
)
const r8 = new Sprite({
  resource: res.images.r8,
  frameSize: new Vector2(600, 600)
}
)

const bun = new Sprite({
  resource: res.images.bun2,
  frameSize: new Vector2(176, 160),
  hFrames: 13,
  vFrames: 2,
  frame: 0,
  width: 160,
  height: 160,
  animations: new Animations({
    idle_l: new FrameIndexPattern(STAND_LEFT),
    idle_r: new FrameIndexPattern(STAND_RIGHT),
    move_l: new FrameIndexPattern(WALK_LEFT),
    move_r: new FrameIndexPattern(WALK_RIGHT),
    charge_l: new FrameIndexPattern(CHARGE_LEFT),
    charge_r: new FrameIndexPattern(CHARGE_RIGHT),
    dash_l1: new FrameIndexPattern(DASH_LEFT1),
    dash_l2: new FrameIndexPattern(DASH_LEFT2),
    dash_r1: new FrameIndexPattern(DASH_RIGHT1),
    dash_r2: new FrameIndexPattern(DASH_RIGHT2),
    flash1: new FrameIndexPattern(COUGHT1),
    flash2: new FrameIndexPattern(COUGHT2),
    duck1: new FrameIndexPattern(DUCK1),
    duck2: new FrameIndexPattern(DUCK2),
  })
})

const eg = new Sprite({
  resource: res.images.eg,
  frameSize: new Vector2(500, 500)
}
)

let bunPos = new Vector2(350, RESOLUTION.y - bun.height);

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyZ") {
    z = true;
  }
})
document.addEventListener("keyup", (e) => {
  if (e.code === "KeyZ") {
    z = false;
  }
})
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    duck = true;
  }
})
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    duck = false;
  }
})

function update(delta) {
  if (!z && !input.heldDirections.length) d = 0;
  for (let i = 0; i < eggs.length; i++) {
    eggs[i].y += eggs[i].speed;
    eggs[i].speed += 0.1;

    if (
      eggs[i].x >= bunPos.x - 60 && eggs[i].y >= bunPos.y - 60 && eggs[i].x <= bunPos.x + 80 && eggs[i].y <= bunPos.y + 100
    ) {
      eggs.splice(i, 1);
      flash = true;
      score2 += 1;
    }
  }
  for (let i = 0; i < saws.length; i++) {
    saws[i].position.y += saws[i].speed;
    saws[i].speed += 0.001;
    saws[i].animations.play("spin");
    saws[i].step(delta);
    if (
      saws[i].position.x >= bunPos.x - 60 && saws[i].position.y >= bunPos.y - 60 && saws[i].position.x <= bunPos.x + 80 && saws[i].position.y <= bunPos.y + 100
    ) {
      saws.splice(i, 1);
      dmg = true;
      saveHiscore();
      score2 -= 3;
    }
    else if (saws[i].position.y > RESOLUTION.y && saws[i].bounced) {
      saws.splice(i, 1);
    }
    else if (saws[i].position.y > RESOLUTION.y && !saws[i].bounced) {
      saws[i].speed = -10;
      saws[i].bounced = true;
      saws[i].position.y = RESOLUTION.y - 1;
    }
  }
  if (!input.direction) {
    if (facing == "LEFT") { bun.animations.play("idle_l") }
    if (facing == "RIGHT") { bun.animations.play("idle_r") }
  }
  if (z == false && d == 0) {
    if (input.direction == "LEFT") {
      bunPos.x -= 5;
      bun.animations.play("move_l");
    }
    if (input.direction == "RIGHT") {
      bunPos.x += 5;
      bun.animations.play("move_r");
    }
  }
  if (z == true) {
    d += 2;
    if (input.direction == "LEFT") {
      bunPos.x -= 0;
      bun.animations.play("charge_l");
    }
    if (input.direction == "RIGHT") {
      bunPos.x += 0;
      bun.animations.play("charge_r");
    }
  }
  if (z == false && d > 0) {
    if (input.direction == "LEFT") {
      bunPos.x -= 1;
      bun.animations.play("dash_l1");
      d -= 1;
    }
    if (input.direction == "RIGHT") {
      bunPos.x += 1;
      bun.animations.play("dash_r1");
      d -= 1;
    }
  }
  if (flash == true) {
    if (!input.direction) {
      if (facing == "LEFT") { bun.animations.play("flash1") }
      if (facing == "RIGHT") { bun.animations.play("flash2") }
    }
    if (input.direction == "LEFT") {
      bunPos.x -= 0;
      bun.animations.play("flash1");
    }
    if (input.direction == "RIGHT") {
      bunPos.x += 0;
      bun.animations.play("flash2");
    }
    setTimeout(() => {
      flash = false;
    }, 130);
  }
  if (dmg == true) {
    if (!input.direction) {
      if (facing == "LEFT") { bun.animations.play("flash1") }
      if (facing == "RIGHT") { bun.animations.play("flash2") }
    }
    if (input.direction == "LEFT") {
      bunPos.x += 1;
      bun.animations.play("flash1");
    }
    if (input.direction == "RIGHT") {
      bunPos.x -= 1;
      bun.animations.play("flash2");
    }
    setTimeout(() => {
      dmg = false;
    }, 400);
  }
  facing = input.direction ?? facing;

  if (duck == true) {
    if (!input.direction) {
      if (facing == "LEFT") { bun.animations.play("duck1") }
      if (facing == "RIGHT") { bun.animations.play("duck2") }
    }
    if (input.direction == "LEFT") {
      bunPos.x += 1;
      bun.animations.play("duck1");
    }
    if (input.direction == "RIGHT") {
      bunPos.x -= 1;
      bun.animations.play("duck2");
    }
  }
  facing = input.direction ?? facing;
  bun.step(delta);
}



//eggs
let eggs = [];

function drawEggs() {
  for (let i = 0; i < eggs.length; i++) {
    eg.drawImage(ctx, eggs[i].x, eggs[i].y);
  }
}

setInterval(() => {
  eggs.push({
    x: Math.random() * (canvas.width - 20) + 10,
    y: 50,
    speed: 0
  });
}, 5000);

//saws
let saws = [];

function drawSaws() {
  for (let i = 0; i < saws.length; i++) {
    saws[i].drawImage(ctx, saws[i].position.x, saws[i].position.y);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  back.drawImage(ctx, 0, 0);
  r1.drawImage(ctx, 3000, bunPos.y + 30);
  r2.drawImage(ctx, 12000, bunPos.y - 150);
  r3.drawImage(ctx, 4000, bunPos.y - 150);
  r4.drawImage(ctx, 6200, bunPos.y - 240);
  r5.drawImage(ctx, 10000, bunPos.y - 120);
  r6.drawImage(ctx, 15000, bunPos.y - 10);
  r7.drawImage(ctx, 16000, bunPos.y - 320);
  r8.drawImage(ctx, 19000, bunPos.y - 250);
  bun.drawImage(ctx, bunPos.x, bunPos.y);
  document.querySelector("#score2").innerText = `Eggs: ${score2}`
  drawEggs();
  drawSaws();
} 

setInterval(() => {
  let chance = (d_over_dx * ((timer2) ** 2))/7
  if (Math.random() > chance) return;
  let new_saw = new Sprite({
    resource: res.images.saw,
    frameSize: new Vector2(75, 500),
    hFrames: 8,
    position: new Vector2(Math.random() * (canvas.width - 20) + 10, 50),
    vFrames: 1,
    frame: 0,
    animations: new Animations({
      spin: new FrameIndexPattern(SAW),
    })
  }
  )
  new_saw.speed = 0;
  new_saw.bounced = (Math.random() > 0.6)
  new_saw.animations.play("spin")
  saws.push(new_saw);
}, 400);

var scrollAmount;


document.addEventListener('keydown', e => {
    if (e.code === "ArrowLeft") {
      window.scrollBy({ left: -9});
    } 
    else if (e.code === "ArrowRight") {
      window.scrollBy({ left: 9});
    }
});

var music = {
  menu: new Howl({
      src: [
          "sfx/death.wav"
      ],
      autoplay: true,
      loop: true
  })
}

// document.addEventListener('keyup', e => {
//  scrollAmount = 0;
// });

// setInterval (function() {
//      window.scrollBy({ left: scrollAmount});
// },10)

setInterval(() => {
  timer2 += 1;
  saveHiscore()
  document.querySelector("#timer2").innerText = `Timer: ${timer2}`
}, 1000)

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

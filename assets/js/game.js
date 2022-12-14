let myGamePiece;
let myObstacles = [];
let myScore;

function startGame() {
  myGamePiece = new component(30, 18, false, 10, 120, 'icon');
  myGamePiece.gravity = 0.05;
  myScore = new component('30px', 'Consolas', 'black', 280, 40, 'text');
  myGameArea.start();
}

let myGameArea = {
  canvas: document.createElement('canvas'),
  wrapper: document.getElementById('wrapper'),
  intro: document.querySelector('.intro'),
  game: document.querySelector('.game'),
  sounds: {
    explosion: document.getElementById('sound-explosion'),
    bg: document.getElementById('sound-bg')
  },
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    this.wrapper.appendChild(this.canvas);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    this.intro.classList.add('none');
    this.game.classList.remove('none');
    this.sounds.bg.play();
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == 'icon') {
      let icon = new Image(this.width, this.height);
      icon.src = './assets/images/helicopter.png';
      ctx.drawImage(icon, this.x, this.y);
    } else if (this.type == 'text') {
      ctx.font = this.width + ' ' + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  }
  this.hitBottom = function () {
    let rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 0;
    }
  }
  this.crashWith = function (otherobj) {
    let myleft = this.x;
    let myright = this.x + (this.width);
    let mytop = this.y;
    let mybottom = this.y + (this.height);
    let otherleft = otherobj.x;
    let otherright = otherobj.x + (otherobj.width);
    let othertop = otherobj.y;
    let otherbottom = otherobj.y + (otherobj.height);
    let crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function exploded() {
  let accelerate = document.querySelector('.accelerate');
  let exploded = document.querySelector('.exploded');
  accelerate.classList.add('none');
  exploded.classList.remove('none');
}

function updateGameArea() {
  let x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      clearInterval(myGameArea.interval);
      myGameArea.sounds.bg.pause();
      myGameArea.sounds.explosion.play();
      exploded();
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(10, height, 'brown', x, 0));
    myObstacles.push(new component(10, x - height - gap, 'brown', x, height + gap));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text = 'SCORE: ' + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
  return false;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

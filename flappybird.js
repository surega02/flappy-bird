// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ration = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes move left speed
let velocityY = 0; //burd jump speed
let gravity = 0.4;
let score = 0;

let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw flappy bird
  //   context.fillStyle = "green";
  //   context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load image
  birdImg = new Image();
  birdImg.src = "flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
  };

  topPipeImg = new Image();
  topPipeImg.src = "toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); //every 1.5 seconds
  document.addEventListener("keydown", moveBird);
  document.addEventListener("touchend", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  //   bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 karena ada 2 pipa
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //remove first element from array
  }

  //scores
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 10, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 38, 320);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  //(0-1) * pipeHeight / 2
  //0 -> -128 (pipeHeight / 4)
  //1 -> -128 -256 (pipeHeight /4 - pipeHeight / 2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
  velocityY = -6;
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  //   return    a.x < b.x + b.width &&
  //             a.x + a.width > b.x &&
  //             a.y < b.y + b.height &&
  //             a.y + a.height > b.y;
}

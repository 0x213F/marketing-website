function Pong(el) {

  var background = new BackgroundCanvas(el);
  var BALL_DIAMETER = 10 * background._scale;
  var PADDLE_LENGTH = 100;
  var VELOCITY = 10; // pixels/ second
  this.state = {
    background: background,
    ball: {
      x: -100,
      y: -100,
      length: BALL_DIAMETER * background._scale,
      xVel: 0,
      yVel: 0,
      startTime: null,
      xStart: -100,
      yStart: -100,
    },
    leftPaddle: {
      y: 0,
      length: PADDLE_LENGTH * background._scale
      hitLine: BALL_DIAMETER * 3
    },
    rightPaddle: {
      y: 0,
      length: PADDLE_LENGTH * background._scale,
      hitLine: background._y - (BALL_DIAMETER * 3)
    },
    perceptrons: []
  };

  var emptyBackground = () => {
    var background = this.state.background;
    var ctx = background.context;
    var x = background.x;
    var y = background.y;

    ctx.beginPath();
    ctx.rect(0, 0, x, y);
    ctx.fillStyle = "1E1E1E";
    ctx.fill();
  }

  var drawBall = () => {
    var state = this.state;
    var ctx = this.state.background.context;

    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_DIAMETER/2, 0, 2*Math.PI);
    ctx.strokeStyle = "#EDEDED";
    ctx.fillStyle = "#EDEDED";
    ctx.fill();
    ctx.stroke();
  }

  var loadGame = () => {
    var state = this.state;
    var ball = state.ball;
    if(!ball.startTime) {
      ball.startTime = Date.now();
      var rad = ((1/4) * Math.PI * Math.random()) + ((1/8) * Math.PI);
      ball.xVel = Math.abs(Math.cos(rad));
      ball.yVel = -Math.abs(Math.sin(rad));
      ball.x = ball.xStart = BALL_DIAMETER * -2;
      ball.y = ball.yStart = BALL_DIAMETER * 2 + state.background._y;
    } else if(Date.now() - ball.startTime > 200) {
      playGame();
      return;
    }
    var dateNow = Date.now();
    var timeDelta = dateNow - ball.startTime;
    ball.x = ball.xStart + timeDelta*ball.xVel;
    ball.y = ball.yStart + timeDelta*ball.yVel;
    drawBall();
    requestAnimationFrame(loadGame);
  }

  var playGame = (obj) => {
    var state = this.state;
    var ball = state.ball;
    var leftPaddle = state.leftPaddle;
    var rightPaddle = state.rightPaddle;
    var background = state.background;
    var zero = BALL_DIAMETER * 3
    var x = background._x - BALL_DIAMETER * 3;
    var y = background._y - BALL_DIAMETER * 3;
    var dateNow = Date.now();
    var timeDelta = dateNow - ball.startTime;
    var pos;
    var resetStartTime = false;
    // correct x
    var xPos = ball.xStart + timeDelta*ball.xVel;
    if(ball.x > x) {
      console.log("x went too far")
      ball.xVel = -ball.xVel;
      ball.x = (BALL_DIAMETER * 3) + ((BALL_DIAMETER * 3) - xPos);
      resetStartTime = true;
    } else if(ball.x < zero) {
      console.log("x went too low")
      ball.xVel = -ball.xVel;
      ball.x = (background._x - (BALL_DIAMETER * 3)) - (xPos - (background._x - (BALL_DIAMETER * 3)));
      resetStartTime = true;
    } else {
      ball.x = xPos;
    }
    // correct y
    var yPos = ball.yStart + timeDelta*ball.yVel;
    if(ball.y > y) {
      console.log("y went too far")
      ball.yVel = -ball.yVel;
      ball.y = (BALL_DIAMETER * 3) + ((BALL_DIAMETER * 3) - yPos);
      resetStartTime = true;
    } else if(ball.y < zero) {
      console.log("y went too low")
      ball.yVel = -ball.yVel;
      ball.y = (background._y - (BALL_DIAMETER * 3)) - (yPos - (background._y - (BALL_DIAMETER * 3)));
      resetStartTime = true;
    } else {
      ball.y = yPos;
    }
    //console.log(ball.yVel, ball.y)
    // reset start time
    if(resetStartTime) {
      ball.startTime = dateNow;
      ball.xStart = ball.x;
      ball.yStart = ball.y;
    }
    drawBall();
    requestAnimationFrame(playGame);
  }

  var onTrainingComplete = () => {
    background.setRenderFunction(loadGame);
    background.runRenderFunction();
  }

  var trainModel = (callback) => {
    callback();
  }

  trainModel(onTrainingComplete);
}

function Pong(el) {

  var background = new BackgroundCanvas(el);
  this.background = background;
  this.deadZones = []
  var BALL_DIAMETER = 10 * background._scale;
  var PADDLE_LENGTH = 100;
  var VELOCITY = 10; // pixels/ second
  var PADDING = BALL_DIAMETER * 3;
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
    paddleLeft: {
      y: 0,
      length: PADDLE_LENGTH * background._scale,
      hitLine: BALL_DIAMETER * 3
    },
    paddleRight: {
      y: 0,
      length: PADDLE_LENGTH * background._scale,
      hitLine: background._y - (BALL_DIAMETER * 3)
    },
    perceptrons: [],
    takeTurn: (training, frames) => {
      var state = this.state;
      var ball = state.ball;
      var paddleLeft = state.paddleLeft;
      var paddleRight = state.paddleRight;
      var background = state.background;
      var x = background._x - PADDING;
      var y = background._y - PADDING;
      var dateNow = Date.now();
      var timeDelta;
      var TRAINING_TIME_STEP = 100;
      if(training) {
        timeDelta = (frames - ball.startTime)*TRAINING_TIME_STEP;
      } else {
        timeDelta = dateNow - ball.startTime;
      }
      var resetStartTime = false;
      try {
        resetStartTime = resetStartTime || calculateX(ball, background, timeDelta, x);
      } catch {
        var inputsLeft = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleLeft.y);
        var inputsRight = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleRight.y);
        this.brainLeft.action(inputsLeft, -1);
        this.brainRight.action(inputsLeft, -1);
        throw "u lose!"
      }

      var rewardLeft = 0;
      var rewardRight = 0;
      if(resetStartTime === "left") {
        if(this.state.paddleLeft.y < ball.y && (this.state.paddleLeft.y + this.state.paddleLeft.length) > ball.y) {
          rewardLeft = 1;
        }
        resetStartTime = true;
      }
      if(resetStartTime === "right") {
        if(this.state.paddleRight.y < ball.y && (this.state.paddleRight.y + this.state.paddleRight.length) > ball.y) {
          rewardRight = 1;
        }
        resetStartTime = true;
      }
      resetStartTime = resetStartTime || calculateY(ball, background, timeDelta, y);
      // reset start time
      if(resetStartTime) {
        if(training) {
          ball.startTime = frames;
        } else {
          ball.startTime = dateNow;
        }
        ball.xStart = ball.x;
        ball.yStart = ball.y;
      }
      var inputsLeft = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleLeft.y);
      var inputsRight = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleRight.y);
      var decisionLeft = this.brainLeft.action(inputsLeft, rewardLeft);
      var decisionRight = this.brainRight.action(inputsRight, rewardRight);
      movePaddle("left", decisionLeft);
      movePaddle("right", decisionRight);
      if(training) {
      } else {
        drawBall();
      }
    }
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

    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(state.background._x - PADDING, state.paddleLeft.y, state.background._x, state.paddleLeft.length * state.background._scale);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0, state.paddleRight.y, PADDING, state.paddleRight.length * state.background._scale);
  }

  var loadGame = (training) => {
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
      this.brainLeft.lastState = null;
      this.brainRight.lastState = null;
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

  var calculateX = (ball, background, timeDelta, x) => {
    var resetStartTime = false;
    var xPos = ball.xStart + timeDelta*ball.xVel;
    if(ball.x > x) {
      // TODO NEXT paddle hit
      // past right paddle
      ball.xVel = -ball.xVel;
      var oldX = ball.x;
      ball.x = (background._x - PADDING) - (xPos - (background._x - PADDING));
      if(this.state.paddleRight.y < ball.y && (this.state.paddleRight.y + this.state.paddleRight.length) > ball.y) {
        //console.log("right!")
      } else {
        throw "loser!";
      }
      return "right"
    } else if(ball.x < PADDING) {
      // TODO NEXT paddle hit
      // past left paddlef
      ball.xVel = -ball.xVel;
      ball.x = PADDING + (PADDING - xPos);
      if(this.state.paddleLeft.y < ball.y && (this.state.paddleLeft.y + this.state.paddleLeft.length) > ball.y) {
        //console.log("left!");
      } else {
        throw "loser!";
      }
      return "left"
    } else {
      ball.x = xPos;
    }
    return resetStartTime;
  }

  var calculateY = (ball, background, timeDelta, y) => {
    var resetStartTime = false;
    var yPos = ball.yStart + timeDelta*ball.yVel;
    if(ball.y > y) {
      // past bottom
      ball.yVel = -ball.yVel;
      ball.y = (background._y - PADDING) - (yPos - (background._y - PADDING));
      resetStartTime = true;
    } else if(ball.y < PADDING) {
      // past top
      ball.yVel = -ball.yVel;
      ball.y = PADDING + (PADDING - yPos);
      resetStartTime = true;
    } else {
      ball.y = yPos;
    }
    return resetStartTime;
  }

  var UP = 0;
  var STAY = 1;
  var DOWN = 2;
  var movePaddle = (direction, decision) => {
    var paddle = direction === "left" ? this.state.paddleLeft : this.state.paddleRight;
    switch (decision) {
      case UP:
        paddle.y -= 5;
        if(paddle.y < 0) {
          paddle.y = 0;
        }
        break;
      case STAY:
        // nothing
        break;
      case DOWN:
        paddle.y += 5;
        if(paddle.y > this.state.background._y - paddle.length) {
          paddle.y = this.state.background._y - paddle.length;
        }
        break;
      default:
        throw "invalid decision";
    }
  }

  var playGame = (training, trials, frames) => {
    try {
      this.state.takeTurn(training, frames);
    } catch(e) {
      if(training) {
        setTimeout(function() {
          if(trials) {
            this.simulate(trials-1);
          } else {
            this.onTrainingComplete();
          }
        }.bind(this), 0);
        return;
      } else {
        return;
      }
    }
    if(!training) {
      requestAnimationFrame(function() { playGame(); });
    } else {
      setTimeout(function() { playGame(training, trials, frames+1); }, 0);
    }

  }

  var getDiscreteInputs = (a, b, c, d, e) => {
    var yLen = this.state.background._y;
    var xLen = this.state.background._x  - 2*PADDING;
    return [
      Math.floor((a-PADDING)/xLen*8+1),
      Math.floor(b/yLen*9),
      Math.floor((c + 10)/20*9),
      Math.floor((d + 10)/20*9),
      Math.floor((e/(yLen - this.state.paddleLeft.length))/10 * 9)
    ];
  }

  this.onTrainingComplete = () => {
    background.setRenderFunction(loadGame);
    background.runRenderFunction();
  }

  var PERCEPTRON_BOARD_WIDTH = (BALL_DIAMETER*3);
  var PERCEPTRON_PADDLE_WIDTH = (BALL_DIAMETER*5);
  var trainModel = (callback) => {
    var numberOfDecisions = 3;
    var leftInputs = [
      10, // ball.x
      10, // ball.y
      10, // ball.xVel
      10, // ball.yVel
      10  // paddle.y
    ];
    var rightInputs = [
      10, // ball.x
      10, // ball.y
      10, // ball.xVel
      10, // ball.yVel
      10  // paddle.y
    ];
    this.brainLeft = new Perceptrons(leftInputs, numberOfDecisions);
    this.brainRight = new Perceptrons(rightInputs, numberOfDecisions);
    this.simulate(10000);
  }

  this.simulate = (trials) => {
    console.log(trials)
    var state = this.state;
    var ball = state.ball;

    ball.startTime = 0;
    var rad = ((1/4) * Math.PI * Math.random()) + ((1/8) * Math.PI);
    ball.xVel = Math.abs(Math.cos(rad));
    ball.yVel = -Math.abs(Math.sin(rad));
    ball.x = ball.xStart = BALL_DIAMETER * 4;
    ball.y = ball.yStart = -(BALL_DIAMETER * 4) + state.background._y;
    if(typeof trials === "undefined") {
      trials = 1;
    }
    if(trials) {
      var TRAINING_MODE = true;
      try {
        playGame(TRAINING_MODE, trials, 0);
      } catch {}
    } else {
      this.onTrainingComplete.bind(this)();
      console.log(JSON.stringify(this.brainLeft.data))
      /* document.write(JSON.stringify(this.brainLeft.data) + `







      ` + JSON.stringify(this.brainRight.data)) */
    }
  }

  trainModel();
}

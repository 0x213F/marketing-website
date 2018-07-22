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
      var padding = BALL_DIAMETER * 3
      var x = background._x - padding;
      var y = background._y - padding;
      var dateNow = Date.now();
      var timeDelta;
      var TRAINING_TIME_STEP = 500;
      if(training) {
        timeDelta = ball.startTime + frames*TRAINING_TIME_STEP;
      } else {
        timeDelta = dateNow - ball.startTime;
      }
      var resetStartTime = false;
      if(training) {
        try {
          resetStartTime = resetStartTime || calculateX(ball, background, padding, timeDelta, x);
        } catch {
          var inputsLeft = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleLeft.y);
          var inputsRight = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleRight.y);
          this.brainLeft.lose(inputsLeft);
          this.brainRight.lose(inputsLeft);
          throw "u lose!"
        }
      } else {
        resetStartTime = resetStartTime || calculateX(ball, background, padding, timeDelta, x);
      }
      resetStartTime = resetStartTime || calculateY(ball, background, padding, timeDelta, y);
      calculatePaddleLeft(ball, background, padding, timeDelta, y);
      calculatePaddleRight(ball, background, padding, timeDelta, y);
      // reset start time
      if(resetStartTime) {
        ball.startTime = dateNow;
        ball.xStart = ball.x;
        ball.yStart = ball.y;
      }
      if(training) {
        var inputsLeft = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleLeft.y);
        var inputsRight = getDiscreteInputs(ball.x, ball.y, ball.xVel, ball.yVel, state.paddleRight.y);
        var decisionLeft = this.brainLeft.action(inputsLeft);
        var decisionRight = this.brainRight.action(inputsRight);
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

  var calculateX = (ball, background, padding, timeDelta, x) => {
    var resetStartTime = false;
    var xPos = ball.xStart + timeDelta*ball.xVel;
    if(ball.x > x) {
      // past right paddle
      ball.xVel = -ball.xVel;
      ball.x = (background._x - padding) - (xPos - (background._x - padding));
      resetStartTime = true;
    } else if(ball.x < padding) {
      // past left paddle
      ball.xVel = -ball.xVel;
      ball.x = padding + (padding - xPos);
      resetStartTime = true;
    } else {
      ball.x = xPos;
    }
    if(resetStartTime) {
      throw "loser!";
    }
    return resetStartTime;
  }

  var calculateY = (ball, background, padding, timeDelta, y) => {
    var resetStartTime = false;
    var yPos = ball.yStart + timeDelta*ball.yVel;
    if(ball.y > y) {
      // past bottom
      ball.yVel = -ball.yVel;
      ball.y = (background._y - padding) - (yPos - (background._y - padding));
      resetStartTime = true;
    } else if(ball.y < padding) {
      // past top
      ball.yVel = -ball.yVel;
      ball.y = padding + (padding - yPos);
      resetStartTime = true;
    } else {
      ball.y = yPos;
    }
    return resetStartTime;
  }

  var calculatePaddleLeft = () => {

  }

  var calculatePaddleRight = () => {

  }

  var playGame = (training, trials, frames) => {
    try {
      this.state.takeTurn(training, frames);
    } catch {
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

  var getDiscreteInputs = () => {

  }

  this.onTrainingComplete = () => {
    console.log("complete")
    background.setRenderFunction(loadGame);
    background.runRenderFunction();
  }

  var trainModel = (callback) => {
    var numberOfDecisions = 3;
    var leftInputs = [
      this.state.background._x / (BALL_DIAMETER*3),
      this.state.background._y / (BALL_DIAMETER*3),
      10, // xVel
      10, // yVel
      (this.state.background._y - this.state.paddleLeft.y) / (BALL_DIAMETER*5)
    ];
    var rightInputs = [
      this.state.background._x / (BALL_DIAMETER*3),
      this.state.background._y / (BALL_DIAMETER*3),
      10, // xVel
      10, // yVel
      (this.state.background._y - this.state.paddleRight.y) / (BALL_DIAMETER*5)
    ];
    this.brainLeft = new Perceptrons(leftInputs, numberOfDecisions);
    this.brainRight = new Perceptrons(rightInputs, numberOfDecisions);
    this.simulate(1000);
  }

  this.simulate = (trials) => {
    var state = this.state;
    var ball = state.ball;

    ball.startTime = Date.now();
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
    }
  }

  trainModel();
}

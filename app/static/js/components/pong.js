function Pong(el) {

  var BALL_DIAMETER = 10;
  var PADDLE_LENGTH = 100;
  var VELOCITY = 10; // pixels/ second

  var background = new BackgroundCanvas(el);
  this.state = {
    background: background,
    ball: {
      x: -100,
      y: -100,
      length: BALL_DIAMETER * background._scale,
      xVel: 0,
      yVel: 0
    },
    leftPaddle: {
      y: 0,
      length: PADDLE_LENGTH * background._scale
    },
    rightPaddle: {
      y: 0,
      length: PADDLE_LENGTH * background._scale
    },
    start_time: null,
    perceptrons: []
  };

  var emptyBackground = () => {
    var ctx = this.state.background.context;

    ctx.beginPath();
    ctx.rect(0, 0, obj._x, obj._y);
    ctx.fillStyle = "1E1E1E";
    ctx.fill();
  }

  var drawBall = () => {
    // TODO
  }

  var loadGame = () => {
    var state = this.state;
    if(!state.start_time) {
      state.start_time = Date.now();
    } else if(Date.now() - start_time) {
      startGame.bind(this)();
      return;
    }
    var rad = 2 * Math.PI * Math.random();
    state.ball.xVel = Math.abs(Math.cos(rad));
    state.ball.yVel = -Math.abs(Math.sin(rad));
    state.ball.x = BALL_DIAMETER * -2;
    state.ball.y = BALL_DIAMETER * 2 + state.background._y;
    drawBall();
    //requestAnimationFrame(drawBall)
  }

  var startGame = (obj) => {
    console.log("game started!");
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

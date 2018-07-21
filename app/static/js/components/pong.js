function Pong(el) {
  var background = new BackgroundCanvas(el);
  var state = {
    ball: {
      x: -1,
      y: -1,
      length: 10 * background._scale,
      xVel: 0,
      yVel: 0
    },
    leftPaddle: {
      y: 0,
      length: 100 * background._scale
    },
    rightPaddle: {
      y: 0,
      length: 100 * background._scale
    },
    start_time: null
  };

  var emptyBackground = (obj) => {
    var ctx = obj.context;

    ctx.beginPath();
    ctx.rect(0, 0, obj._x, obj._y);
    ctx.fillStyle = "1E1E1E";
    ctx.fill();
  }

  var startAnimation = (obj) => {
    console.log("placing ball")
  }

  var onTrainingComplete = () => {
    background.setRenderFunction(startAnimation);
    background.runRenderFunction();
  }

  var trainModel = (callback) => {
    callback();
  }

  trainModel(onTrainingComplete);
}

function Pong(el) {
  var background = new BackgroundCanvas(el);
  var state = {};

  var emptyBackground = (obj) => {
    var ctx = obj.context;

    ctx.beginPath();
    ctx.rect(0, 0, obj._x, obj._y);
    ctx.fillStyle = "1E1E1E";
    ctx.fill();
  }

  var placeBall = (obj) => {
    console.log("placing ball")
  }

  var playGame = (obj) => {
    console.log("playing game")
  }

  var onTrainingComplete = () => {
    background.setRenderFunction(placeBall);
    background.runRenderFunction();
    setTimeout(() => {
      background.setRenderFunction(playGame);
      background.runRenderFunction();
    }, 1000);
  }

  var trainModel = (callback) => {
    callback();
  }

  trainModel(onTrainingComplete);
}

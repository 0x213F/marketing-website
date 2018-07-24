function Perceptrons(dimensions, outputs) {

  function constructMultiLayerPerceptrons(dimensions) {
    var data = [];
    if(dimensions.length > 0) {
      var length = dimensions.shift();
      for(var i=0; i<length; i++) {
        data.push(constructMultiLayerPerceptrons(dimensions.slice(0)));
      }
    } else {
      data.push(0, 0, 0);
    }
    return data;
  }
  this.data = constructMultiLayerPerceptrons(dimensions);
  this.lastState = null;
  this.lastAction = null;

  function getPerceptron(inputs) {
    var arr = this.data;
    while(inputs.length) {
      idx = inputs.shift();
      arr = arr[idx];
    }
    return arr;
  }
  var GAMMA = 0.9;
  var ALPHA = 1.0
  this.action = (inputs, reward) => {
    var perceptron = getPerceptron.bind(this)(inputs);
    var maxVal = -1;
    var maxIdx = -1;
    for(var i=0; i<perceptron.length; i++) {
      var val = perceptron[i];
      if(val > maxVal) {
        maxIdx = i;
        maxVal = val;
      }
    }
    if(this.lastState && this.lastState !== perceptron) {
      this.lastState[this.lastAction] += ALPHA*(reward + GAMMA*maxVal - this.lastState[this.lastAction]);
      if(this.lastState == NaN) {
        console.log("ERROR")
      }
    }
    this.lastState = perceptron;
    this.lastAction = maxIdx;
    return maxIdx;
  }

}

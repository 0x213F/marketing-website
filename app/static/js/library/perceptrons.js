function Perceptrons(dimensions, outputs) {

  function constructMultiLayerPerceptrons(dimensions) {
    var data = [];
    if(dimensions.length > 0) {
      var length = dimensions.shift();
      for(var i=0; i<length; i++) {
        data.push(constructMultiLayerPerceptrons(dimensions))
      }
    } else {
      data.push(0, 0.1, 0);
    }
    return data;
  }
  this.data = constructMultiLayerPerceptrons(dimensions);

  function readPerceptron(inputs) {
    var arr = this.data;
    var i = 0;
    while(typeof arr[0] !== "number") {
      arr = arr.shift();
    }
    return arr;
  }
  this.action = (inputs) => {
    var perceptron = readPerceptron.bind(this)(inputs);
    var maxVal = -1;
    var maxIdx = -1;
    for(var i=0; i<perceptron.length; i++) {
      var decision = perceptron[i];
      if(decision > maxVal) {
        maxIdx = i;
        maxVal = decision;
      }
    }
    return maxIdx;
  }

  this.lose = (inputs) => {
    return;
  }
}

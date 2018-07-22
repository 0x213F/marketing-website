function Perceptrons(dimensions, outputs) {

  function constructMultiLayerPerceptrons(dimensions) {
    var data = [];
    if(dimensions.length > 0) {
      var length = dimensions.shift();
      for(var i=0; i<length; i++) {
        data.push(constructMultiLayerPerceptrons(dimensions))
      }
    } else {
      data.push(0, 0, 0);
    }
    return data;
  }
  this.data = constructMultiLayerPerceptrons(dimensions);

  this.action = (inputs) => {
    return 1;
  }

  this.lose = (inputs) => {
    return;
  }
}

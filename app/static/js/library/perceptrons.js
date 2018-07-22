function Perceptrons(dimensions, outputs) {

  function constructMultiLayerPerceptrons(dimensions) {
    var data = [];
    if(dimensions.length > 0) {
      var length = dimensions.shift();
      for(var i=0; i<length; i++) {
        data.push(buildMultiLayerPerceptrons(dimensions))
      }
    } else {
      data.push(0, 0, 0);
    }
    return data;
  }
  this.data = buildMultiLayerPerceptrons(dimensions);

}

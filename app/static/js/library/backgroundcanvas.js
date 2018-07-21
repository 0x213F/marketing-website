/**
 * @constructor
 * Boilerplate for a full-screen HTML5 Canvas
 *
 * @param {object} el
 *   [Required] <canvas></canvas> target element
 *
 * @param {function} renderFunction
 *   [Optional] initializes and executes rendering function
 */
function BackgroundCanvas(el, renderFunction) {

  /**
   * @public
   */
  this.canvas = el;
  this.context = el.getContext('2d');

  /**
   * @private
   */
  this._animating = false;
  this._x = null;
  this._y = null;
  this._scale = window.devicePixelRatio;

  /**
   * @public @method
   * Defines rendering function
   */
  this.setRenderFunction = (renderFunction) => {
    render = renderFunction;
  };

  /**
   * @public @method
   * Executes rendering function
   */
  this.runRenderFunction = () => {
    render.bind(this)();
  }

  /**
   * @private @method
   * Resize canvas to current window dimesions
   */
  var resize = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    this._x = this.canvas.width = width * this._scale;
    this._y = this.canvas.height = height * this._scale;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.runRenderFunction();
  };

  /**
   * @main
   * Initialize the view
   */
   var render;
   if(typeof renderFunction === "function") {
     render = renderFunction;
   } else {
     render = () => {};
   }
   resize();
   window.addEventListener('resize', resize, false);
}

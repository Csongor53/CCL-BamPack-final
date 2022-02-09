class Levels {
  constructor(context, x, y, CONFIG) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.CONFIG = CONFIG;

    this.velocity;

    this.init();
  }

  init() {}

  update() {}

  render() {
    // draw bounding box rectangle
    if (this.CONFIG.debug) {
      let bb = this.getBoundingBox();
      this.context.translate(bb.x, bb.y);
      this.context.strokeRect(0, 0, bb.w, bb.h);
      this.context.resetTransform();
    }
  }

  getBoundingBox() {
    return {
      x: this.x - this.w / 2,
      y: this.y - this.h / 2,
      w: this.w,
      h: this.h,
    };
  }

  difficultyIncrease(difficulty) {
    this.velocity *= difficulty;
  }
}

export default Levels;

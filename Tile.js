import Levels from './Levels.js';

class Tile extends Levels {
  constructor(context, CONFIG, x, y, velocity, scaledSize, direction) {
    super(context);
    this.CONFIG = CONFIG;

    //for bounding box
    this.x = x + scaledSize / 2;
    this.y = y;
    this.w = scaledSize;
    this.h = scaledSize;

    this.velocity = velocity;
    this.dX = -1;

    this.scaledSize = scaledSize;
    this.sourceSize = 640;

    this.direction = direction;

    this.image = new Image();
    this.image.src = `./assets/tile_map_desert_v1.png`;
  }

  init() {}

  update(timePassedSinceLastRender) {
    this.x += timePassedSinceLastRender * this.dX * this.velocity;
  }

  render() {
    // call render() of GameObject
    super.render();

    // move canvas origin to x
    this.context.translate(this.x, this.y);

    // flip facing direction
    this.context.scale(this.direction, 1);

    this.context.drawImage(
      this.image, // the image
      0,
      0,
      this.sourceSize,
      this.sourceSize,
      -this.scaledSize / 2, // destination x
      -this.scaledSize / 2, // destination y
      this.scaledSize, // destination width
      this.scaledSize // destination height
    );

    this.context.resetTransform();
  }

  // used for collision detection
  getBoundingBox() {
    return super.getBoundingBox();
  }
}

export default Tile;

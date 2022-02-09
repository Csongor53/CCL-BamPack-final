import Levels from './Levels.js';

class Enemy extends Levels {
  constructor(context, x, y, CONFIG, Xvelocity, Yvelocity) {
    super(context, x, y, CONFIG);

    this.w = CONFIG.height / 8;
    this.h = this.w;

    this.dX = Xvelocity;

    this.ogY = y; // original y coordinate the enemy revolvs around
    this.dY = Yvelocity;
    this.state = 'idle';
  }

  init() {
    //#region  define sprite images
    this.sprites = {
      idle: {
        src: './assets/zombie_jet_sprite_v1.png',
        frames: 5,
        fps: 8,
        frameSize: {
          width: 640,
          height: 640,
        },
        image: null,
      },
    };

    // load sprite images
    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });
    //#endregion
  }

  update(timePassedSinceLastRender) {
    // decide when to change directions
    if (this.y > this.ogY + 100) {
      this.dY *= -1;
    } else if (this.y < this.ogY - 100) {
      this.dY *= -1;
    }

    // calculate new position;
    this.y += timePassedSinceLastRender * this.dY;
    this.x += timePassedSinceLastRender * this.dX;
  }

  render() {
    // call render() of GameObject
    super.render();

    // move canvas origin to x
    this.context.translate(this.x, this.y);

    // flip facing direction
    this.context.scale(-1, 1);

    //#region Draw Image for sprites

    let coords = this.getImageSpriteCoordinates(this.sprites[this.state]);

    // draw image
    this.context.drawImage(
      this.sprites[this.state].image, // the image
      coords.sourceX, // source x
      coords.sourceY, // source y
      coords.sourceWidth, // source width
      coords.sourceHeight, // source height
      -this.w / 2, // destination x
      -this.h / 2, // destination y
      this.w, // destination width
      this.h // destination height
    );
    this.context.resetTransform();
  }

  // cut through a sprite
  getImageSpriteCoordinates(sprite) {
    let frameX = Math.floor(
      ((performance.now() / 1000) * sprite.fps) % sprite.frames
    );

    let coords = {
      sourceX: frameX * sprite.frameSize.width,
      sourceY: 0,
      sourceWidth: sprite.frameSize.width,
      sourceHeight: sprite.frameSize.height,
    };
    return coords;
  }

  // used for collision detection
  getBoundingBox() {
    return super.getBoundingBox();
  }
}

export default Enemy;

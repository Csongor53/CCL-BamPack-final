import GameObject from './GameObject.js';

class Player extends GameObject {
  constructor(context, x, y, CONFIG, projectileController) {
    super(context, x, y, CONFIG);

    this.projectileController = projectileController;

    this.keys = {
      right: false,
      left: false,
      up: false,
      shooting: false,
    };

    this.w = CONFIG.height / 9;
    this.h = this.w;

    this.dX = 0; // d for difference (direction)
    this.friction = 0.275;

    this.dY = 0;
    this.gravity = this.CONFIG.height / 16000;
    this.jump = true;

    this.lastDirection = 1;
    this.state = 'walk';
    this.stateCounterStart = 0;
    this.stateCounterStop = 0;
  }

  init() {
    // keydown eventListener
    document.addEventListener('keydown', (event) => {
      // left & right
      if (event.code == 'KeyA') {
        this.keys.left = true;
      }
      if (event.code == 'KeyD') {
        this.keys.right = true;
      }

      // jump
      if (event.code == 'KeyW') {
        this.keys.up = true;
        if (this.jump == true) {
          this.dY = -this.CONFIG.height / 800;
        }
      }

      // shoot
      if (event.code === 'Space') {
        this.shooting = true;
      }
    });

    // keyup eventListener
    document.addEventListener('keyup', (event) => {
      // left & right
      if (event.code == 'KeyA') {
        this.keys.left = false;
      }
      if (event.code == 'KeyD') {
        this.keys.right = false;
      }

      // jump
      if (event.code == 'KeyW') {
        this.keys.up = false;
        if (this.dY < -this.CONFIG.height / 4000) {
          this.dY = -this.CONFIG.height / 2666;
        }
      }

      //shoot
      if (event.code === 'Space') {
        this.shooting = false;
      }
    });

    //#region  define sprite images

    this.sprites = {
      walk: {
        src: './assets/Bam_walk_jet_Sprite_1.png',
        frames: 8,
        fps: 16,
        frameSize: {
          width: 640,
          height: 640,
        },
        image: null,
      },
      idle: {
        src: './assets/Bam_off_jet_sprite_1.png',
        frames: 6,
        fps: 6,
        frameSize: {
          width: 640,
          height: 640,
        },
        image: null,
      },
      start: {
        src: './assets/Bam_idle_jet_start_v1.png',
        frames: 6,
        fps: 6,
        frameSize: {
          width: 640,
          height: 640,
        },
        image: null,
      },
      stop: {
        src: './assets/Bam_idle_jet_stop_sprite_1.png',
        frames: 6,
        fps: 6,
        frameSize: {
          width: 640,
          height: 640,
        },
        image: null,
      },
      full: {
        src: './assets/Bam_idle_jet_stop_sprite_1.png',
        frames: 2,
        fps: 2,
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
    // set the value of dx (along x axis)
    if (this.keys.left === true) this.dX = -1;
    else if (this.keys.right === true) this.dX = 1;
    else this.dX = 0;

    // gravity and jumping
    if (this.jump) this.dY += this.gravity;
    else if (!this.keys.up) this.dY = 0;

    // store last direction the player moved in
    if (this.dX !== 0) this.lastDirection = this.dX;

    // calculate new position
    this.x += timePassedSinceLastRender * this.dX * this.friction;
    this.y += timePassedSinceLastRender * this.dY;

    //#region Borders
    // check for right boundary
    if (this.x + this.w / 2 > this.CONFIG.width)
      this.x = this.CONFIG.width - this.w / 2;
    // check for left boundary
    else if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;

    // check for bottom boundary
    if (this.y + this.h / 2 > this.CONFIG.height)
      this.y = this.CONFIG.height - this.h / 2;
    // check for top boundary
    else if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;
    //#endregion

    // define current state (for sprites)
    if (this.y + this.h / 2 >= this.CONFIG.height) {
      this.state = 'walk';
    } else if (this.stateCounterStart < 6) {
      this.state = 'start';
      this.stateCounterStart++;
      this.stateCounterStop = 0;
    } else {
      this.state = 'full';
    }
    if (0 < this.dY && this.stateCounterStop < 6) {
      this.state = 'stop';
      this.stateCounterStart = 0;
      this.stateCounterStop++;
    } else if (0 < this.dY && !(this.y + this.h / 2 >= this.CONFIG.height)) {
      this.state = 'idle';
    }

    this.shoot(timePassedSinceLastRender);
  }

  render() {
    // call render() of GameObject
    super.render();

    // move canvas origin to x
    this.context.translate(this.x, this.y);

    // flip facing direction
    this.context.scale(this.lastDirection, 1);

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

  // triggered when shooting
  shoot(timePassedSinceLastRender) {
    if (this.shooting) {
      const delay = 20;
      const damage = 1; // for later extension

      let bulletX = this.x + (this.w / 3) * this.lastDirection;
      const bulletY = this.y + this.h / 7;

      let velocity = 5 + timePassedSinceLastRender * this.friction;
      let direction = this.lastDirection;
      this.projectileController.shoot(
        bulletX,
        bulletY,
        velocity,
        damage,
        delay,
        direction
      );
    }
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

export default Player;

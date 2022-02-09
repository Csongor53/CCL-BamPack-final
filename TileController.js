import Levels from './Levels.js';
import Tile from './Tile.js';
import { randomNumberBetween } from './RandomTool.js';
import { scoreUpdate } from './index.js';

class TileController extends Levels {
  constructor(context, CONFIG) {
    super(context);
    this.CONFIG = CONFIG;

    this.scaledSize = CONFIG.height / 8;
    this.direction = 1;

    this.velocity = 0.25;

    this.intervall = (this.scaledSize / this.velocity) * 4;

    this.tiles = [];
    this.columns = [];

    this.newObs = this.resetObsticles();

    this.gap = 0;
  }

  init() {
    this.dispatch();
  }

  update(timePassedSinceLastRender) {
    this.gap++;
    if (this.gap > 1) {
      this.tiles.forEach((tile) => {
        tile.update(timePassedSinceLastRender);
      });

      this.columns.forEach((column) => {
        if (column.x >= this.CONFIG.width / 2) {
          scoreUpdate();
          this.columns.splice(column);
        }
      });
    }
  }

  render() {
    // remove each tile that is off the screen
    if (this.gap > 1) {
      this.tiles.forEach((tile) => {
        if (tile.x + tile.w < 0) {
          this.tiles.splice(this.tiles.indexOf(tile), 1);
        }
        tile.render();
      });
    }
  }

  dispatch() {
    // clear previous timeout
    if (this.timeout) window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      // each itteration dispatches a random set of tiles from newObs (newObstacles) and resets when all have been used to cycle again
      // with the double for loop it is posible to create any 2D shape from the tiles based on the schamatic loaded from the array
      if (this.gap > 1) {
        let index = randomNumberBetween(0, this.newObs.length);

        let type = this.newObs[index];

        for (let i = 0; i < type.top.w; i++) {
          for (let j = 0; j < type.top.h; j++) {
            if (this.direction === 1) this.direction = -1;
            else this.direction = 1;
            this.tiles.push(
              new Tile(
                this.context,
                this.CONFIG - this.scaledSize * 2,
                this.CONFIG.width + this.scaledSize * i,
                this.scaledSize * j + this.scaledSize / 2,
                this.velocity,
                this.scaledSize,
                this.direction
              )
            );
          }
        }

        for (let i = 0; i < type.bottom.w; i++) {
          for (let j = 0; j < type.bottom.h; j++) {
            if (this.direction === 1) this.direction = -1;
            else this.direction = 1;
            this.tiles.push(
              new Tile(
                this.context,
                this.CONFIG,
                this.CONFIG.width - this.scaledSize * i,
                this.CONFIG.height - this.scaledSize * j - this.scaledSize / 2,
                this.velocity,
                this.scaledSize,
                this.direction
              )
            );
          }
        }

        this.columns.push(this.tiles[this.tiles.length - 1]);

        this.newObs.splice(index, 1);

        if (this.newObs.length === 0) {
          this.newObs = this.resetObsticles();
        }
      }
      // do next iteration
      this.dispatch();
      //
    }, this.intervall);
  }

  resetObsticles() {
    return [
      {
        top: {
          w: 1,
          h: 3,
        },
        bottom: {
          w: 1,
          h: 2,
        },
      },
      {
        top: {
          w: 1,
          h: 2,
        },
        bottom: {
          w: 1,
          h: 3,
        },
      },
      {
        top: {
          w: 1,
          h: 4,
        },
        bottom: {
          w: 1,
          h: 1,
        },
      },
      {
        top: {
          w: 1,
          h: 1,
        },
        bottom: {
          w: 1,
          h: 4,
        },
      },
      {
        top: {
          w: 1,
          h: 5,
        },
        bottom: {
          w: 1,
          h: 0,
        },
      },
      {
        top: {
          w: 1,
          h: 0,
        },
        bottom: {
          w: 1,
          h: 5,
        },
      },
    ];
  }
}

export default TileController;

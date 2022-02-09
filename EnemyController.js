import Levels from './Levels.js';
import Enemy from './Enemy.js';
import { randomNumberBetween } from './RandomTool.js';

class EnemyController extends Levels {
  constructor(context, CONFIG) {
    super(context);
    this.CONFIG = CONFIG;

    this.scaledSize = CONFIG.height / 8;
    this.direction = 1;

    this.velocity = -0.3;
    this.Yvelocity = 0.25;

    this.intervall = (this.scaledSize / this.Yvelocity) * 4;

    this.enemies = [];
    this.gap = 0; // needed to skip an itteration for proper start of a new level
  }

  init() {
    this.dispatch();
  }

  update(timePassedSinceLastRender) {
    this.gap++;
    if (this.gap > 1) {
      this.enemies.forEach((enemy) => {
        enemy.update(timePassedSinceLastRender);
      });
    }
  }

  render() {
    // remove enemies when the exit the canvas
    if (this.gap > 1) {
      this.enemies.forEach((enemy) => {
        if (enemy.x + enemy.w < 0) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
        enemy.render();
      });
    }
  }

  dispatch() {
    // clear previous timeout
    if (this.timeout) window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (this.gap > 1) {
        // create a new enemy on a random y coordinate
        this.enemies.push(
          new Enemy(
            this.context,
            this.CONFIG.width + this.scaledSize * 2,
            randomNumberBetween(
              100 + this.scaledSize / 2,
              this.CONFIG.height - 50 - this.scaledSize / 2
            ),
            this.CONFIG,
            this.velocity,
            this.Yvelocity
          )
        );
      }
      // do next iteration
      this.dispatch();
    }, this.intervall);
  }
}

export default EnemyController;

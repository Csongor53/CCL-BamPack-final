import Projectile from './Projectile.js';
import GameObject from './GameObject.js';

class ProjectileController extends GameObject {
  constructor(context, CONFIG) {
    super(context, CONFIG);
    this.CONFIG = CONFIG;

    this.projectiles = [];
    this.cooldown = 0;
  }

  init() {}

  update() {}

  shoot(x, y, velocity, damage, delay, direction) {
    if (this.cooldown <= 0) {
      this.projectiles.push(
        new Projectile(this.context, x, y, velocity, damage, direction)
      );

      this.cooldown = delay;
    }
    this.cooldown -= 1;
  }

  render() {
    //remove projectile when off the screen
    this.projectiles.forEach((projectile) => {
      if (projectile.x < 0 || projectile.x > this.CONFIG.width) {
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
      }
      projectile.render();
    });
  }
}

export default ProjectileController;

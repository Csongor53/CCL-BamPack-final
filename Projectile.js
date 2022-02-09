import GameObject from './GameObject.js';

class Projectile extends GameObject {
  constructor(context, x, y, velocity, damage, direction) {
    super(context, x, y);

    this.velocity = velocity;
    this.damage = damage;
    this.direction = direction;

    this.w = 15;
    this.h = 5;
    this.color = 'darkred';
  }

  init() {}

  update() {}

  render() {
    this.x += this.velocity * this.direction;

    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.w, this.h);
  }
  getBoundingBox() {
    return super.getBoundingBox();
  }
}

export default Projectile;

import GameObject from './GameObject.js';

class PointsDisplay extends GameObject {
  constructor(context, x, y) {
    super(context, x, y);
    this.points = 0;
  }

  render() {
    // Score text
    this.context.font = 'bold 30px monospace';
    this.context.fillStyle = 'white';
    this.context.textAlign = 'center';
    this.context.fillText('Score: ' + this.points, this.x - 60, this.y);
  }

  increase() {
    this.points++;
  }
}

export default PointsDisplay;

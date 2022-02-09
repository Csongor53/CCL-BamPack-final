import TileController from './TileController.js';
import Player from './Player.js';
import ProjectileController from './ProjectileController.js';
import EnemyController from './EnemyController.js';
import PointsDisplay from './PointsDisplay.js';

//#region global variables
let started;

// canvas and tick
let canvas;
let context;
let lastTickTimestamp;

// all objects that will be rendered or controll rendered objects
let tileController;
let projectileController;
let enemyController;
let player;
let pointsDisplay;

// variables needed to handle the difficulty and the stages
let score = 0;
let currentLevel = 0;
let levelCounter = 1;
let difficulty = 1;

// store objects to call their functions (update(), render())
let gameObjects = [];
let levels = [];
//#endregion

//data of the canvas and debuging mode toogle
let CONFIG = {
  debug: false,
  width: undefined,
  height: undefined,
};

const init = () => {
  // instantiate canvas
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  //setting up the canvas to the latest size of the browser window (only on reloads)
  CONFIG.width =
    document.querySelector('body').getBoundingClientRect().width * 0.9;
  CONFIG.height = CONFIG.width * (9 / 16);

  // set properties from CONFIG object
  context.imageSmoothingEnabled = false;
  canvas.setAttribute('width', CONFIG.width);
  canvas.setAttribute('height', CONFIG.height);

  // instantiate Projectile controller
  projectileController = new ProjectileController(context, CONFIG);
  gameObjects.push(projectileController);

  // instantiate Enemy controller
  enemyController = new EnemyController(context, CONFIG);
  levels.push(enemyController);

  // instantiate Tile controller
  tileController = new TileController(context, CONFIG);
  levels.push(tileController);

  // instantiate PointsDisplay
  pointsDisplay = new PointsDisplay(context, CONFIG.width - 30, 30);
  gameObjects.push(pointsDisplay);

  // instantiate Player
  player = new Player(
    context,
    CONFIG.width / 3,
    0,
    CONFIG,
    projectileController
  );
  gameObjects.push(player);

  lastTickTimestamp = performance.now();
  gameLoop();
};

const gameLoop = () => {
  if (started) {
    // time has passed since the last tick
    let timePassedSinceLastRender = performance.now() - lastTickTimestamp;

    update(timePassedSinceLastRender);
    render();

    // set lastTickTimestamp to now
    lastTickTimestamp = performance.now();
    // call next iteration of the game loop
    requestAnimationFrame(gameLoop);
  }
};

const update = (timePassedSinceLastRender) => {
  // update all game objects
  gameObjects.forEach((gameObject) => {
    gameObject.update(timePassedSinceLastRender);
  });

  // change between stages after the score reaches an increment of 10
  if (score > 10 * levelCounter) {
    if (currentLevel === 0) currentLevel = 1;
    else currentLevel = 0;
    resetStages();

    difficulty += 0.1;
    difficultyIncrease(difficulty);

    levelCounter++;
  }

  // only update the active level
  levels[currentLevel].update(timePassedSinceLastRender);

  // check collision for either level
  if (currentLevel === 1) {
    tileController.tiles.forEach((tile) => {
      if (checkCollisionBetween(player, tile)) {
        document.location.reload(true);
        started = false;
      }
    });
  } else if (currentLevel === 0) {
    enemyController.enemies.forEach((enemy) => {
      projectileController.projectiles.forEach((projectile) => {
        if (checkCollisionBetween(enemy, projectile)) {
          enemyController.enemies.splice(
            enemyController.enemies.indexOf(enemy),
            1
          );
          projectileController.projectiles.splice(
            projectileController.projectiles.indexOf(projectile, 1)
          );
          scoreUpdate();
        }
      });
      if (checkCollisionBetween(player, enemy)) {
        document.location.reload(true);
        started = false;
      }
    });
  }
};

const render = () => {
  // clear the canvas
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  // render all game objects
  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });

  // render the active level
  levels[currentLevel].render();
};

let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
  ) {
    // collision happened
    return true;
  } else return false;
};

let scoreUpdate = () => {
  pointsDisplay.increase();
  score++;
};

let resetStages = () => {
  tileController.gap = 0;
  tileController.tiles = [];
  enemyController.gap = 0;
  enemyController.enemies = [];
};

// increase the speed the obbstacles travel at
let difficultyIncrease = (difficulty) => {
  levels.forEach((level) => {
    level.difficultyIncrease(difficulty);
  });
};

// when everything is loaded the game starts by clicking enter or clicking on the start button
window.addEventListener('load', () => {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && !started) {
      started = true;
      document.getElementById('start').hidden = true;
      document.getElementById('canvas').hidden = false;
      init();
    }
  });

  document.getElementById('start').addEventListener('click', () => {
    started = true;
    document.getElementById('start').hidden = true;
    document.getElementById('canvas').hidden = false;
    init();
  });
});

export { scoreUpdate };

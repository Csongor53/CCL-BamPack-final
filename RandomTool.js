
// get a random number (a tool used in multiple other classes)
let randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export { randomNumberBetween };

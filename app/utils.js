module.exports = {
  getRandom: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};

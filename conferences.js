const accessCodes = {
  123: 'conference 1',
  456: 'conference 2'
};

module.exports = function(code) {
  return accessCodes[code];
};

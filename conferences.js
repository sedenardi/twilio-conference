const accessCodes = {
  123: 'conference 1',
  456: 'conference 2'
};

const getConferenceByCode = function(code) {
  return code ? accessCodes[code] : null;
};

module.exports = {
  getConferenceByCode
};

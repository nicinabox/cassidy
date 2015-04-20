var _ = require('lodash');
var settingsStore = require('../stores/settingsStore');
var servicesStore = require('../stores/servicesStore');

module.exports = function () {
  var servicesState = servicesStore.getState();

  if (_.isEmpty(servicesState.activeService)) {
    // global settings
    return settingsStore.getState().settings;
  } else {
    // service settings
    return servicesState.activeService.settings;
  }
};

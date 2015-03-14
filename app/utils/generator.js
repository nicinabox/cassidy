var VaultExtended = require('../utils/VaultExtended');
var _ = require('lodash');

var coerceSettingsValues = function(obj) {
  var newSettings = {};
  var keys = _.keys(obj);

  _.each(keys, function(key) {
    var v = obj[key];

    if (_.isBoolean(v)) {
      v = (v ? 1 : 0);
    }
    newSettings[key] = v;
  });

  return newSettings;
};

var generator = function(service) {
  if (service.service) {
    var vaultSettings = coerceSettingsValues(service.settings);
    var vault = new VaultExtended(vaultSettings);
    return vault.generateWithKey(service.service, service.settings.key);
  }
};

module.exports = generator;

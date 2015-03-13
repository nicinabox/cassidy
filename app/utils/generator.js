var Vault = require('vault');
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
  var vaultSettings = coerceSettingsValues(service.settings);
  var vault = new Vault(vaultSettings);
  return vault.generate(service.service);
};

module.exports = generator;

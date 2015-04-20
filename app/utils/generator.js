var VaultExtended = require('../utils/VaultExtended');
var settingsStore = require('../stores/settingsStore');
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

var generator = function(obj) {
  if (obj.service) {
    var vault, key, vaultSettings = coerceSettingsValues(obj.settings);
    vaultSettings.phrase = settingsStore.getDecryptedPhrase();
    key = obj.settings.key

    if (obj.settings.salt) {
      key += obj.settings.salt;
    }

    vault = new VaultExtended(vaultSettings);
    return vault.generateWithKey(obj.service, key);
  }
};

module.exports = generator;

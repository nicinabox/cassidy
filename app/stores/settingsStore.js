var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
var servicesStore = require('./servicesStore');
var registerActions = require('../utils/registerActions');

var EventEmitter = require('events').EventEmitter;
var CryptoJS = require('crypto-js');
var storage = require('../utils/storage');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var toggleFields = {
  lower: 'Lowercase',
  upper: 'Uppercase',
  number: 'Numbers',
  dash: 'Dashes & underscore',
  symbol: 'Symbols',
  space: 'Spaces',
  require_always: 'Require always'
};

var helpers = {
  newDefaultSettings: function() {
    return {
      length: 20,
      upper: true,
      lower: true,
      number: true,
      symbol: true,
      dash: true,
      space: false,
      key: this.newKey()
    };
  },

  newKey: function() {
    time = new Date().getTime().toString() + Math.floor(Math.random() * 100000)
    return CryptoJS.PBKDF2(time, '', {
      keySize: 128 / 32
    }).toString().substr(0, 5)
  },

  encryptPhrase: function(phrase) {
    var encrypted = CryptoJS.TripleDES.encrypt(phrase, _state.settings.key);
    return encrypted.toString();
  },

  decryptPhrase: function(str) {
    if (str && _state.settings.key) {
      try {
        var decrypted = CryptoJS.TripleDES.decrypt(str, _state.settings.key);
        return decrypted.toString(CryptoJS.enc.Utf8);
      } catch(e) {
        console.warn('Could not decrypt phrase.');
      }
    }
  },

  coerceAttrsToBool: function(settings) {
    var attrs = ['upper', 'lower', 'number', 'symbol', 'dash', 'space'];
    _.each(attrs, function(attr) {
      if (!_.isBoolean(settings[attr])) {
        settings[attr] = !!settings[attr];
      }
    });
    return settings;
  }
};

var _state = {
  defaults: helpers.newDefaultSettings(),
  settings: storage.cache.settings,
  phrase: storage.cache.phrase
};

var setSettings = function(settings) {
  _.merge(_state.settings,
    helpers.coerceAttrsToBool(settings));
};

var setDefaultSettings = function(settings) {
  _state.defaults = helpers.coerceAttrsToBool(settings);
};

var copyDefaultsToSettings = function() {
  _state.settings = _.clone(_state.defaults);
};

var setPhrase = function(phrase) {
  _state.phrase = helpers.encryptPhrase(phrase);
  storage.set('phrase', _state.phrase);
};

var toggle = function(name) {
  _state.settings[name] = !_state.settings[name];
  cacheSettings();
  return _state.settings;
};

var setSetting = function(name, value) {
  _state.settings[name] = value;
  if (_state.settings.key && storage.cache.phrase) {
    _state.phrase = storage.cache.phrase;
  }
  cacheSettings();
  return _state.settings;
};

var cacheSettings = function() {
  storage.set('settings', _state.settings);
};

var settingsStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDefaultSettings: function() {
    return _state.defaults;
  },

  getSettings: function() {
    return _state.settings;
  },

  getDecryptedPhrase: function() {
    if (_state.phrase) {
      return helpers.decryptPhrase(_state.phrase);
    }
  },

  getToggleFields: function() {
    return toggleFields;
  }
});

registerActions(settingsStore, {
  LOAD_SETTINGS: function(action) {
    AppDispatcher.waitFor([authStore.dispatchToken])
    setSettings(action.data);
    setDefaultSettings(action.data);
  },

  SELECT_SERVICE: function(action) {
    AppDispatcher.waitFor([servicesStore.dispatchToken]);
    var service = servicesStore.getSelectedService();
    setSettings(service.settings);
  },

  CLEAR_SELECTED_SERVICE: function(action) {
    copyDefaultsToSettings();
  },

  CHANGE_PHRASE: function(action) {
    setPhrase(action.data);
  },

  TOGGLE_SETTING: function(action) {
    toggle(action.data);
  },

  CHANGE_SETTING: function(action) {
    setSetting(action.data.name, action.data.value);
  }
});

if (!_state.settings) {
  copyDefaultsToSettings();
}

cacheSettings();
module.exports = settingsStore;

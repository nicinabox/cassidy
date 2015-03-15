var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
var servicesStore = require('./servicesStore');

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
      var decrypted = CryptoJS.TripleDES.decrypt(str, _state.settings.key);
      return decrypted.toString(CryptoJS.enc.Utf8);
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
  settings: {},
  phrase: storage.cache.phrase
};

var setSettings = function(settings) {
  _.merge(_state.settings,
    helpers.coerceAttrsToBool(settings));
};

var setDefaultSettings = function(settings) {
  _state.defaults = helpers.coerceAttrsToBool(settings);
};

var resetSettings = function() {
  _state.settings = _.clone(_state.defaults);
};

var setPhrase = function(phrase) {
  _state.phrase = helpers.encryptPhrase(phrase);
  storage.set('phrase', _state.phrase);
};

var toggle = function(name) {
  _state.settings[name] = !_state.settings[name];
  return _state.settings;
}

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
    return helpers.decryptPhrase(_state.phrase);
  },

  getToggleFields: function() {
    return toggleFields;
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.LOAD_SETTINGS:
      AppDispatcher.waitFor([authStore.dispatchToken])
      setSettings(action.data);
      setDefaultSettings(action.data);
      settingsStore.emitChange();
      break;

    case appConstants.SELECT_SERVICE:
      AppDispatcher.waitFor([servicesStore.dispatchToken]);
      var service = servicesStore.getSelectedService();
      setSettings(service.settings);
      settingsStore.emitChange();
      break;

    case appConstants.CLEAR_SELECTED_SERVICE:
      resetSettings();
      settingsStore.emitChange();
      break;

    case appConstants.CHANGE_PHRASE:
      setPhrase(action.data);
      settingsStore.emitChange();
      break;

    case appConstants.TOGGLE_SETTING:
      toggle(action.data);
      settingsStore.emitChange();
      break;

    default:
      return true;
  }
});

module.exports = settingsStore;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
var EventEmitter = require('events').EventEmitter;
var CryptoJS = require('crypto-js');
var storage = require('../utils/storage');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var helpers = {
  defaultSettings: function() {
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
  }
};

var _state = {
  defaults: helpers.defaultSettings(),
  settings: {},
  phrase: storage.cache.phrase
};

var setSettings = function(settings) {
  _state.settings = settings;
};

var setPhrase = function(phrase) {
  _state.phrase = helpers.encryptPhrase(phrase);
  storage.set('phrase', _state.phrase);
};

var settingsStore = _.assign({}, EventEmitter.prototype, {
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
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.LOAD_SETTINGS:
      AppDispatcher.waitFor([authStore.dispatchToken])
      setSettings(action.data);
      settingsStore.emit(CHANGE_EVENT);
      break;

    case appConstants.CHANGE_PHRASE:
      setPhrase(action.data);
      settingsStore.emit(CHANGE_EVENT);
      break;

    default:
      return true;
  }
});

module.exports = settingsStore;

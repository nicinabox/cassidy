'use strict';
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var registerActions = require('../utils/registerActions');
var storage = require('../utils/storage');
var settingsUtils = require('../utils/settingsUtils');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _serviceIsActive = false;

var _state = {
  settings: {},
  phrase: ''
};

var _updateCache = function () {
  storage.set('settings', _state.settings);
};

var initialize = function () {
  var savedSettings = storage.get('settings');
  var savedPhrase   = storage.get('phrase');

  _state.settings = savedSettings || settingsUtils.createDefaultSettings();
  _state.phrase = savedPhrase;

  _updateCache();
};

var update = function (data) {
  _state.settings[data.name] = data.value;
  if (!_serviceIsActive) {
    _updateCache();
  }
};

var applySettings = function (data) {
  _state.settings = data.settings;
};

var savePhrase = function (phrase) {
  var phrase = settingsUtils.encryptPhrase(phrase, _state.settings.key);
  if (phrase) {
    _state.phrase = phrase;
    storage.set('phrase', _state.phrase);
  }
};

var decryptPhrase = function () {
  return settingsUtils.decryptPhrase(_state.phrase, _state.settings.key);
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

  getState: function () {
    return _state;
  },

  getDecryptedPhrase: function () {
    return decryptPhrase();
  },
});

registerActions(settingsStore, {
  INITIALIZE_SETTINGS: function () {
    initialize();
  },

  CHANGE_SETTING: function (action) {
    update(action.data)
  },

  SET_ACTIVE_SERVICE: function (action) {
    _serviceIsActive = true;
    applySettings(action.data);
  },

  CLEAR_ACTIVE_SERVICE: function () {
    _serviceIsActive = false;
    initialize();
  },

  CHANGE_PHRASE: function (action) {
    savePhrase(action.data);
  }
});

initialize();
module.exports = settingsStore;

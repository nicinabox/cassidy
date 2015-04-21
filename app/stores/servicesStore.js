'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var authStore = require('./authStore');
var storage = require('../utils/storage');
var settingsStore = require('./settingsStore');
var registerActions = require('../utils/registerActions');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _state = {
  focusResult: false,
  activeService: {},
  services: []
};

var _updateCache = function() {
  storage.set('services', _state.services);
};

var initialize = function () {
  var savedServices = storage.get('services');
  if (savedServices) _state.services = savedServices;
};

var saveService = function(service) {
  var existing = _.find(_state.services, { service: service.service });
  if (existing) {
    existing.usage = existing.usage || 0;
    existing.usage += 1
  } else {
    service.usage = 1
    _state.services.push(service);
  }

  _updateCache();
};

var removeService = function(service) {
  _.remove(_state.services, service);
  _updateCache();
};

var setServices = function(services) {
  _state.services = services;
  storage.set('services', _state.services);
};

var setActiveService = function(service) {
  _state.activeService = service;
};

var clearActiveService = function() {
  _state.activeService = {};
  _state.focusResult = false;
};

var saveActiveService = function() {
  var service = _.find(_state.services, _state.activeService);
  if (service) {
    service.settings = settingsStore.getScopedState('service').settings;
    _updateCache();
  }
};

var matchSavedService = function (name) {
  var service = _.findWhere(_state.services, { service: name });
  if (service) {
    setActiveService(service);
  } else {
    clearActiveService();
  }
};

var setFilteredServices = function(name) {
  _state.filteredServices = filterServices(name);
};

var filterServices = function (name) {
  if (!name) return;

  var re = new RegExp(name, 'g');
  return _(_state.services).filter((service) => {
    return service.service.match(re);
  }).sortBy((s) => s.service).value();
};

var hasActiveService = function () {
  return !_.isEmpty(_state.activeService);
};

var servicesStore = _.assign({}, EventEmitter.prototype, {
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

  getActiveService: function () {
    return _state.activeService;
  },

  getActiveServiceName: function () {
    var service = _state.activeService;
    if (!_.isEmpty(service)) return service.service;
  },

  getTopServices: function(limit) {
    return _(_state.services)
      .reject((s) => !s.usage)
      .sortBy((s) => s.usage)
      .takeRight(limit)
      .reverse()
      .value();
  },

  getFilteredServices: function(name) {
    return filterServices(name);
  }
});

registerActions(servicesStore, {
  LOAD_SERVICES: function(action) {
    AppDispatcher.waitFor([authStore.dispatchToken]);
    setServices(action.data);
  },

  SET_ACTIVE_SERVICE: function(action) {
    setActiveService(action.data);
  },

  CLEAR_ACTIVE_SERVICE: function(action) {
    clearActiveService();
  },

  SAVE_SERVICE: function(action) {
    saveService(action.data);
    setActiveService(action.data);
  },

  REMOVE_SERVICE: function(action) {
    removeService(action.data);
  },

  MATCH_SAVED_SERVICE: function (action) {
    matchSavedService(action.data);
  },

  CHANGE_SETTING: function () {
    if (hasActiveService()) {
      _state.focusResult = false;
      saveActiveService();
    }
  },

  CHANGE_PHRASE: function () {
    _state.focusResult = false;
  },

  FOCUS_RESULT: function () {
    _state.focusResult = true;
  },

  BLUR_RESULT: function () {
    _state.focusResult = false;
  }
});

initialize();
module.exports = servicesStore;

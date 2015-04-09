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
  if (!existing) {
    _state.services.push(service);
    _updateCache();
  }
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
};

var saveActiveService = function() {
  var service = _.find(_state.services, _state.activeService);
  if (service) {
    service.settings = settingsStore.getState().settings;
    _updateCache();
  }
};

var setFilteredServices = function(name) {
  var re = new RegExp('^' + name, 'g');
  _state.filteredServices = _.filter(_state.services, function(service) {
    return service.service.match(re);
  });
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

  getTopServices: function(limit) {
    return _(_state.services)
      .reject((s) => !s.usage)
      .sortBy((s) => s.usage)
      .last(limit).reverse().value();
  },

  getFilteredServices: function() {
    return _state.filteredServices;
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

  CLEAR_SELECTED_SERVICE: function(action) {
    clearActiveService();
  },

  SAVE_SERVICE: function(action) {
    saveService(action.data);
  },

  REMOVE_SERVICE: function(action) {
    removeService(action.data);
  },
});

initialize();
module.exports = servicesStore;

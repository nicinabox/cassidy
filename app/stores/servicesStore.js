var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
var registerActions = require('../utils/registerActions');

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _state = {
  selectedService: {},
  services: [],
  filteredServices: []
};

var addService = function(service) {
  _state.services.push(service);
};

var removeService = function(id) {
  // TODO: Implement removeService
};

var setServices = function(services) {
  _state.services = services;
};

var setSelectedService = function(service) {
  var newService = _.clone(service);
  newService.settings = JSON.parse(newService.settings);
  _state.selectedService = newService;
};

var clearSelectedService = function() {
  _state.selectedService = {};
};

var setFilteredServices = function(name) {
  var re = new RegExp('^' + name, 'g')
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

  getSelectedService: function() {
    return _state.selectedService;
  },

  getServices: function() {
    return _state.services;
  },

  getTopServices: function(limit) {
    return _(_state.services)
      .reject((s) => !s.usage)
      .sortBy((s) => s.usage)
      .last(limit).reverse().value();
  },

  getFilteredServices: function(name) {
    return _state.filteredServices;
  }
});

registerActions(servicesStore, {
  LOAD_SERVICES: function(action) {
    AppDispatcher.waitFor([authStore.dispatchToken])
    setServices(action.data);
  },

  SELECT_SERVICE: function(action) {
    setSelectedService(action.data);
  },

  CLEAR_SELECTED_SERVICE: function(action) {
    clearSelectedService();
  },

  FILTER_SERVICES: function(action) {
    setFilteredServices(action.data);
  },

  ADD_SERVICE: function(action) {
    addService(action.data);
  },

  REMOVE_SERVICE: function(action) {
    removeService(action.data);
  },

  DROPBOX_SIGN_OUT: function(action) {
    setServices([]);
  }
});

module.exports = servicesStore;

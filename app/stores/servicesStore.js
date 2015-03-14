var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
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

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.LOAD_SERVICES:
      AppDispatcher.waitFor([authStore.dispatchToken])
      setServices(action.data);
      servicesStore.emitChange();
      break;

    case appConstants.SELECT_SERVICE:
      setSelectedService(action.data);
      servicesStore.emitChange();
      break;

    case appConstants.CLEAR_SELECTED_SERVICE:
      clearSelectedService();
      servicesStore.emitChange();
      break;

    case appConstants.FILTER_SERVICES:
      setFilteredServices(action.data);
      servicesStore.emitChange();
      break;

    case appConstants.ADD_SERVICE:
      addService(action.data);
      servicesStore.emitChange();
      break;

    case appConstants.REMOVE_SERVICE:
      removeService(action.data);
      servicesStore.emitChange();
      break;

    case appConstants.DROPBOX_SIGN_OUT:
      setServices([]);
      servicesStore.emitChange();
      break;

    default:
      return true;
  }
});

module.exports = servicesStore;

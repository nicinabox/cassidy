var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var authStore = require('./authStore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _state = {
  services: []
};

var addService = function(service) {
  _state.services.push(service);
};

var removeService = function(id) {

};

var setServices = function(services) {
  _state.services = services;
};

var servicesStore = _.assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getServices: function() {
    return _state.services;
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.LOAD_SERVICES:
      AppDispatcher.waitFor([authStore.dispatchToken])
      setServices(action.data);
      servicesStore.emit(CHANGE_EVENT);
      break;

    case appConstants.ADD_SERVICE:
      addService(action.data);
      servicesStore.emit(CHANGE_EVENT);
      break;

    case appConstants.REMOVE_SERVICE:
      removeService(action.data);
      servicesStore.emit(CHANGE_EVENT);
      break;

    case appConstants.DROPBOX_SIGN_OUT:
      setServices([]);
      servicesStore.emit(CHANGE_EVENT);
      break;

    default:
      return true;
  }
});

module.exports = servicesStore;

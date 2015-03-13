var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _state = {
  auth: undefined
};

var setState = function(data) {
  _state = data;
};

var authStore = _.assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isAuth: function() {
    return _state.auth;
  }
});

authStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case appConstants.DROPBOX_SIGN_IN:
      setState(action.data);
      authStore.emit(CHANGE_EVENT);
      break;

    case appConstants.DROPBOX_SIGN_OUT:
      setState(action.data);
      authStore.emit(CHANGE_EVENT);
      break;

    default:
      return true;
  }
});

module.exports = authStore;

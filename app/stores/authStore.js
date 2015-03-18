var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');
var storage = require('../utils/storage');
var registerActions = require('../utils/registerActions');

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
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

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

registerActions(authStore, {
  DROPBOX_SIGN_IN: function(action) {
    setState(action.data);
  },

  DROPBOX_SIGN_OUT: function(action) {
    setState(action.data);
  }
});

module.exports = authStore;

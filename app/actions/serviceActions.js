var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var serviceActions = {
  setActiveService: function(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_ACTIVE_SERVICE,
      data: service
    });
  },

  clearActiveService: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_ACTIVE_SERVICE
    });
  },

  focusResult: function () {
    AppDispatcher.handleAction({
      actionType: appConstants.FOCUS_RESULT
    });
  },

  blurResult: function () {
    AppDispatcher.handleAction({
      actionType: appConstants.BLUR_RESULT
    });
  },

  filterServices: function(name) {
    AppDispatcher.handleAction({
      actionType: appConstants.FILTER_SERVICES,
      data: name
    });
  },

  matchSavedService: function (name) {
    AppDispatcher.handleAction({
      actionType: appConstants.MATCH_SAVED_SERVICE,
      data: name
    });
  },

  saveService: function(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.SAVE_SERVICE,
      data: service
    });
  },

  removeService: function(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_SERVICE,
      data: service
    });
  }
};

module.exports = serviceActions;

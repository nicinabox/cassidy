var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var serviceActions = {
  loadServices: function() {
    dropbox.loadServices(function(services) {
      AppDispatcher.handleAction({
        actionType: appConstants.LOAD_SERVICES,
        data: services
      });
    });
  },

  selectService: function(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_ACTIVE_SERVICE,
      data: service
    });
  },

  clearSelectedService: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_ACTIVE_SERVICE
    });
  },

  filterServices: function(name) {
    AppDispatcher.handleAction({
      actionType: appConstants.FILTER_SERVICES,
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

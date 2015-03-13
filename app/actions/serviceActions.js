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
      actionType: appConstants.SELECT_SERVICE,
      data: service
    });
  },

  addService: function(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_SERVICE,
      data: service
    });
  },

  removeService: function(id) {
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_SERVICE,
      data: id
    });
  }
};

module.exports = serviceActions;

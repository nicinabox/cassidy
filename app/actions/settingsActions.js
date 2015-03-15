var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var settingsActions = {
  loadSettings: function() {
    dropbox.loadSettings(function(settings) {
      AppDispatcher.handleAction({
        actionType: appConstants.LOAD_SETTINGS,
        data: settings
      });
    });
  },

  changePhrase: function(phrase) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_PHRASE,
      data: phrase
    });
  },

  toggle: function(name) {
    AppDispatcher.handleAction({
      actionType: appConstants.TOGGLE_SETTING,
      data: name
    });
  },

  setSetting: function(name, value) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_SETTING,
      data: {
        name: name,
        value: value
      }
    });
  }
};

module.exports = settingsActions;

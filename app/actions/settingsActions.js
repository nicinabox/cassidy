var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var settingsActions = {
  loadSettings: function() {
    delete storage.cache.settings;
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

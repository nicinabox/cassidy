var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var authActions = {
  tryAuth: function() {
    dropbox.tryAuth(function() {
      AppDispatcher.handleAction({
        actionType: appConstants.DROPBOX_SIGN_IN,
        data: {
          auth: dropbox.isAuth()
        }
      });
    })
  },

  signIn: function() {
    dropbox.signIn(function() {
      AppDispatcher.handleAction({
        actionType: appConstants.DROPBOX_SIGN_IN,
        data: {
          auth: dropbox.isAuth()
        }
      });
    });
  },

  signOut: function() {
    dropbox.signOut(function() {
      AppDispatcher.handleAction({
        actionType: appConstants.DROPBOX_SIGN_OUT,
        data: {
          auth: dropbox.isAuth()
        }
      });
    });
  }
};

module.exports = authActions;

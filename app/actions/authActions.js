var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var dropbox = require('../utils/dropbox');

var authActions = {
  tryAuth: () => {
    dropbox.tryAuth(() => {
      AppDispatcher.handleAction({
        actionType: appConstants.DROPBOX_SIGN_IN,
        data: {
          auth: dropbox.isAuth()
        }
      });
    });
  },

  signIn: () => {
    dropbox.signIn(() => {
      AppDispatcher.handleAction({
        actionType: appConstants.DROPBOX_SIGN_IN,
        data: {
          auth: dropbox.isAuth()
        }
      });
    });
  },

  signOut: () => {
    dropbox.signOut(() => {
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

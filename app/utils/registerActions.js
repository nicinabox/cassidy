var AppDispatcher = require('../dispatcher/AppDispatcher');

var registeredActions = {}, store;

var initializeActions = () => {
  return AppDispatcher.register(function(payload) {
    var action = payload.action;

    if (registeredActions[action.actionType]) {
      registeredActions[action.actionType].call(this, action);
      store.emitChange();
    }
  });
};

var registerActions = (store, actions) => {
  registeredActions = actions;
  return initializeActions(store);
};

module.exports = registerActions;

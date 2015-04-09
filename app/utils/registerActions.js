var AppDispatcher = require('../dispatcher/AppDispatcher');

var initializeActions = (store, actions) => {
  return AppDispatcher.register(function(payload) {
    var action = payload.action;

    if (actions[action.actionType]) {
      actions[action.actionType].call(this, action);
      store.emitChange();
    }
  });
};

var registerActions = (store, actions) => {
  store.dispatchToken = initializeActions(store, actions);
  return store;
};

module.exports = registerActions;

import AppDispatcher from '../dispatcher/AppDispatcher'
import appConstants from '../constants/appConstants'
import dropbox from '../utils/dropbox'

module.exports = {
  loadSettings() {
    delete storage.cache.settings
    dropbox.loadSettings((settings) => {
      AppDispatcher.handleAction({
        actionType: appConstants.LOAD_SETTINGS,
        data: settings
      })
    })
  },

  changePhrase(phrase) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_PHRASE,
      data: phrase
    })
  },

  clearPhrase() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_PHRASE
    })
  },

  setSetting(name, value) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_SETTING,
      data: {
        name: name,
        value: value
      }
    })
  },

  resetSettings() {
    AppDispatcher.handleAction({
      actionType: appConstants.RESET_SETTINGS
    })
  },

  clearLocalData() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_LOCAL_DATA
    })
  },

  clearRemoteData() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_REMOTE_DATA
    })
  },
}

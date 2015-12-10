import AppDispatcher from '../dispatcher/AppDispatcher'
import appConstants from '../constants/appConstants'
import dropbox from '../utils/dropbox'

module.exports = {
  setActiveService(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_ACTIVE_SERVICE,
      data: service
    })
  },

  clearActiveService() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_ACTIVE_SERVICE
    })
  },

  focusResult() {
    AppDispatcher.handleAction({
      actionType: appConstants.FOCUS_RESULT
    })
  },

  blurResult() {
    AppDispatcher.handleAction({
      actionType: appConstants.BLUR_RESULT
    })
  },

  filterServices(name) {
    AppDispatcher.handleAction({
      actionType: appConstants.FILTER_SERVICES,
      data: name
    })
  },

  matchSavedService(name) {
    AppDispatcher.handleAction({
      actionType: appConstants.MATCH_SAVED_SERVICE,
      data: name
    })
  },

  saveService(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.SAVE_SERVICE,
      data: service
    })
  },

  removeService(service) {
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_SERVICE,
      data: service
    })
  }
}

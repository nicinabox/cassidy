import _ from 'lodash'
import AppDispatcher from '../dispatcher/AppDispatcher'
import authStore from './authStore'
import storage from '../utils/storage'
import settingsStore from './settingsStore'
import registerActions from '../utils/registerActions'
import { EventEmitter } from 'events'

var CHANGE_EVENT = 'change'

var _state = {
  focusResult: false,
  activeService: {},
  services: []
}

var _updateCache = function() {
  storage.set('services', _state.services)
}

var initialize = function() {
  var savedServices = storage.get('services')
  if (savedServices) _state.services = savedServices
}

var saveService = function(service) {
  var existing = _.find(_state.services, { service: service.service })
  if (existing) {
    existing.usage = existing.usage || 0
    existing.usage += 1
  } else {
    service.usage = 1
    _state.services.push(service)
  }

  _updateCache()
}

var removeService = function(service) {
  _.remove(_state.services, service)
  _updateCache()
}

var setServices = function(services) {
  _state.services = services
  storage.set('services', _state.services)
}

var setActiveService = function(service) {
  _state.activeService = service
}

var clearActiveService = function() {
  _state.activeService = {}
  _state.focusResult = false
}

var saveActiveService = function() {
  var service = _.find(_state.services, _state.activeService)
  if (service) {
    service.settings = settingsStore.getScopedState('service').settings
    _updateCache()
  }
}

var matchSavedService = function(name) {
  var service = _.findWhere(_state.services, { service: name })
  if (service) {
    setActiveService(service)
  } else {
    clearActiveService()
  }
}

var setFilteredServices = function(name) {
  _state.filteredServices = filterServices(name)
}

var filterServices = function(name) {
  if (!name) return

  var re = new RegExp(name, 'g')
  return _(_state.services).filter((service) => {
    return service.service.match(re)
  }).sortBy((s) => s.service).value()
}

var hasActiveService = function() {
  return !_.isEmpty(_state.activeService)
}

var servicesStore = _.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  getState() {
    return _state
  },

  getActiveService() {
    return _state.activeService
  },

  getActiveServiceName() {
    var service = _state.activeService
    if (!_.isEmpty(service)) return service.service
  },

  getTopServices(limit) {
    return _(_state.services)
      .reject((s) => !s.usage)
      .sortBy((s) => s.usage)
      .takeRight(limit)
      .reverse()
      .value()
  },

  getFilteredServices(name) {
    return filterServices(name)
  }
})

registerActions(servicesStore, {
  LOAD_SERVICES(action) {
    AppDispatcher.waitFor([authStore.dispatchToken])
    setServices(action.data)
  },

  SET_ACTIVE_SERVICE(action) {
    setActiveService(action.data)
  },

  CLEAR_ACTIVE_SERVICE(action) {
    clearActiveService()
  },

  SAVE_SERVICE(action) {
    saveService(action.data)
    setActiveService(action.data)
  },

  REMOVE_SERVICE(action) {
    removeService(action.data)
  },

  MATCH_SAVED_SERVICE(action) {
    matchSavedService(action.data)
  },

  CHANGE_SETTING() {
    if (hasActiveService()) {
      _state.focusResult = false
      saveActiveService()
    }
  },

  CHANGE_PHRASE() {
    _state.focusResult = false
  },

  FOCUS_RESULT() {
    _state.focusResult = true
  },

  BLUR_RESULT() {
    _state.focusResult = false
  },

  CLEAR_LOCAL_DATA() {
    setServices([])
  }
})

initialize()
module.exports = servicesStore

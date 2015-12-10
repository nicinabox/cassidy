import _ from 'lodash'
import { EventEmitter } from 'events'
import AppDispatcher from '../dispatcher/AppDispatcher'
import registerActions from '../utils/registerActions'
import settingsUtils from '../utils/settingsUtils'
import storage from '../utils/storage'

var CHANGE_EVENT = 'change'

var _serviceIsActive = false

var _state = {
  settings: {},
  phrase: ''
}

var _updateCache = function () {
  storage.set('settings', _state.settings)
}

var hydrate = function () {
  var savedSettings = storage.get('settings')
  var savedPhrase   = storage.get('phrase')

  _state.settings = savedSettings || settingsUtils.createDefaultSettings()
  _state.phrase = savedPhrase

  _updateCache()
}

var update = function (data) {
  _state.settings[data.name] = data.value
  if (!_serviceIsActive && !_.contains(settingsUtils.global, data.name)) {
    _updateCache()
  }
}

var resetSettings = function () {
  var newSettings = settingsUtils.createDefaultSettings()
  var key = _state.settings.key
  _state.settings = newSettings
  _state.settings.key = key
  _updateCache()
}

var clearLocalSettings = function () {
  storage.remove('settings')
  storage.remove('phrase')
  _state = {
    settings: settingsUtils.createDefaultSettings(),
    phrase: ''
  }
}

var applySettings = function (data) {
  _state.settings = data.settings
}

var serviceState = function () {
  var state = _.clone(_state)
  state.settings = _.omit(_state.settings, settingsUtils.global)
  return state
}

var savePhrase = function (phrase) {
  var phrase = settingsUtils.encryptPhrase(phrase, _state.settings.key)
  if (phrase) {
    _state.phrase = phrase
    storage.set('phrase', _state.phrase)
  }
}

var clearPhrase = function () {
  storage.remove('phrase')
  _state.phrase = ''
}

var decryptPhrase = function () {
  return settingsUtils.decryptPhrase(_state.phrase, _state.settings.key)
}

var settingsStore = _.assign({}, EventEmitter.prototype, {
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

  getScopedState(scope) {
    if (scope === 'global') return _state
    if (scope === 'service') return serviceState()
  },

  getDecryptedPhrase() {
    return decryptPhrase()
  },
})

registerActions(settingsStore, {
  HYDRATE_SETTINGS() {
    hydrate()
  },

  CHANGE_SETTING(action) {
    update(action.data)
  },

  SET_ACTIVE_SERVICE(action) {
    _serviceIsActive = true
    applySettings(action.data)
  },

  CLEAR_ACTIVE_SERVICE() {
    _serviceIsActive = false
    hydrate()
  },

  CHANGE_PHRASE(action) {
    savePhrase(action.data)
  },

  CLEAR_PHRASE() {
    clearPhrase()
  },

  RESET_SETTINGS() {
    resetSettings()
  },

  CLEAR_LOCAL_DATA() {
    clearLocalSettings()
  },
})

hydrate()
module.exports = settingsStore

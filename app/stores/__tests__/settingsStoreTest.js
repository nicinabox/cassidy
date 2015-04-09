jest.dontMock('../../constants/appConstants');
jest.dontMock('../../utils/registerActions');
jest.dontMock('../../utils/storage');
jest.dontMock('../settingsStore');

describe('settingsStore', function () {
  var appConstants = require('../../constants/appConstants');
  var storage = require('../../utils/storage');
  var AppDispatcher;
  var settingsStore;
  var callback;

  var payloads = {
    INITIALIZE_SETTINGS: {
      action: {
        actionType: appConstants.INITIALIZE_SETTINGS
      }
    },

    CHANGE_SETTING: {
      action: {
        actionType: appConstants.CHANGE_SETTING,
        data: {
          name: 'upper',
          value: false
        }
      }
    },

    SET_ACTIVE_SERVICE: {
      action: {
        actionType: appConstants.SET_ACTIVE_SERVICE,
        data: {
          service: 'cassidy',
          settings: {
            length: 16,
            upper: true,
            lower: false,
            number: false,
            symbol: false,
            dash: false,
            space: false,
            key: 'abc123'
          }
        }
      }
    },

    CLEAR_ACTIVE_SERVICE: {
      action: {
        actionType: appConstants.CLEAR_ACTIVE_SERVICE
      }
    },

    CHANGE_PHRASE: {
      action: {
        actionType: appConstants.CHANGE_PHRASE,
        data: 'juice'
      }
    }
  };

  beforeEach(function(e) {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    settingsStore = require('../settingsStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  afterEach(function () {
    storage.remove('settings');
  })

  describe('initial load without cached settings', function () {
    it('generates new settings', function () {
      var state = settingsStore.getState();
      var cachedSettings = storage.get('settings');
      var settings = {
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: 'abc123'
      };

      expect(state.settings).toEqual(settings);
      expect(cachedSettings).toEqual(settings);
    });
  });

  describe('initial load with cached settings', function () {
    beforeEach(function () {
      storage.set('settings', {
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: '56789'
      });
    });

    it('loads existing settings', function () {
      callback(payloads.INITIALIZE_SETTINGS);

      var state = settingsStore.getState();
      expect(state.settings).toEqual({
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: '56789'
      })
    });
  });

  describe('when no active service', function () {
    it('saves to global settings on change', function () {
      callback(payloads.CHANGE_SETTING)
      var cachedSettings = storage.get('settings');
      var state = settingsStore.getState();

      expect(state.settings.upper).toBe(false);
      expect(cachedSettings.upper).toBe(false);
    });
  });

  describe('when active service', function () {
    it('loads service settings', function () {
      callback(payloads.SET_ACTIVE_SERVICE);
      var cachedSettings = storage.get('settings');
      var state = settingsStore.getState();
      var appliedSettings = {
        length: 16,
        upper: true,
        lower: false,
        number: false,
        symbol: false,
        dash: false,
        space: false,
        key: 'abc123'
      };

      expect(state.settings).toEqual(appliedSettings);
      expect(cachedSettings).toEqual({
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: 'abc123'
      });
    });

    it('saves settings to service on change', function () {
      callback(payloads.SET_ACTIVE_SERVICE);
      callback(payloads.CHANGE_SETTING);
      var cachedSettings = storage.get('settings');
      var state = settingsStore.getState();
      var appliedSettings = {
        length: 16,
        upper: false,
        lower: false,
        number: false,
        symbol: false,
        dash: false,
        space: false,
        key: 'abc123'
      };

      expect(state.settings).toEqual(appliedSettings);
      expect(cachedSettings).toEqual({
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: 'abc123'
      });

      // TODO: expect(cachedService.settings).toEqual(appliedSettings);
    });
  });

  describe('when active service is cleared', function () {
    it('restores active settings', function () {
      callback(payloads.SET_ACTIVE_SERVICE);
      callback(payloads.CLEAR_ACTIVE_SERVICE);

      var state = settingsStore.getState();
      expect(state.settings).toEqual({
        length: 20,
        upper: true,
        lower: true,
        number: true,
        symbol: true,
        dash: true,
        space: false,
        key: 'abc123'
      })
    });
  });

  describe('phrase', function () {
    it('should be encrypted', function () {
      callback(payloads.CHANGE_PHRASE);
      var state = settingsStore.getState();
      expect(state.phrase).toEqual('lolencrypted')
    });

    it('should stored in localStorage', function () {
      callback(payloads.CHANGE_PHRASE);
      var phrase = storage.get('phrase')
      expect(phrase).toEqual('lolencrypted')
    });

    it('should not be decrypted on initialize', function () {
      storage.set('phrase', 'lolencrypted');
      callback(payloads.INITIALIZE_SETTINGS);
      var state = settingsStore.getState();
      expect(state.phrase).toEqual('lolencrypted');
    });

    it('should be decrypted on demand', function () {
      storage.set('phrase', 'lolencrypted');
      callback(payloads.INITIALIZE_SETTINGS);
      var phrase = settingsStore.getDecryptedPhrase();
      expect(phrase).toEqual('juice');
    });
  });
});

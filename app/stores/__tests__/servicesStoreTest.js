jest.dontMock('../../constants/appConstants');
jest.dontMock('../../utils/registerActions');
jest.dontMock('../../utils/storage');
jest.dontMock('../servicesStore');

describe('servicesStore', function () {
  var appConstants = require('../../constants/appConstants');
  var storage = require('../../utils/storage');
  var AppDispatcher;
  var servicesStore;
  var callback;

  var payloads = {
    SAVE_SERVICE: {
      action: {
        actionType: appConstants.SAVE_SERVICE,
        data: {
          service: 'new service'
        }
      }
    },
    REMOVE_SERVICE: {
      action: {
        actionType: appConstants.REMOVE_SERVICE,
        data: {
          service: 'test1'
        }
      }
    },
    SET_ACTIVE_SERVICE: {
      action: {
        actionType: appConstants.SET_ACTIVE_SERVICE,
        data: {
          service: 'test1'
        }
      }
    },
    CLEAR_ACTIVE_SERVICE: {
      action: {
        actionType: appConstants.CLEAR_ACTIVE_SERVICE
      }
    },
  };

  beforeEach(function(e) {
    storage.set('services', [
      { service: 'test1' },
      { service: 'test2' },
      { service: 'test3' },
    ]);

    AppDispatcher = require('../../dispatcher/AppDispatcher');
    servicesStore = require('../servicesStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('loads services from cache', function () {
    var state = servicesStore.getState();
    expect(state.services.length).toBe(3);
  });

  it('saves new service', function () {
    callback(payloads.SAVE_SERVICE);
    var state = servicesStore.getState();
    var cache = storage.get('services');

    expect(state.services.length).toBe(4);
    expect(cache.length).toBe(4);
  });

  it('removes service', function () {
    callback(payloads.REMOVE_SERVICE);
    var state = servicesStore.getState();
    var cache = storage.get('services');

    expect(state.services.length).toBe(2);
    expect(cache.length).toBe(2);
  });

  it('sets active service', function () {
    callback(payloads.SET_ACTIVE_SERVICE);
    var state = servicesStore.getState();
    expect(state.activeService).toEqual({ service: 'test1' });
  });

  it('clears active service', function () {
    callback(payloads.CLEAR_ACTIVE_SERVICE);
    var state = servicesStore.getState();
    expect(state.activeService).toEqual({});
  });
});

jest.dontMock('../../constants/appConstants');
jest.dontMock('../../utils/registerActions');
jest.dontMock('../../utils/storage');
jest.dontMock('../servicesStore');
var _ = require('lodash');

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
    SAVE_EXISTING_SERVICE: {
      action: {
        actionType: appConstants.SAVE_SERVICE,
        data: {
          service: 'test1'
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

  it('does not save service if matching service', function () {
    callback(payloads.SAVE_EXISTING_SERVICE);
    var state = servicesStore.getState();
    var cache = storage.get('services');
    expect(state.services.length).toBe(3);
    expect(cache.length).toBe(3);
  });

  it('increments usage when service saved', function () {
    callback(payloads.SAVE_SERVICE);
    var state = servicesStore.getState();
    var last = _.last(state.services)

    var cache = storage.get('services');
    expect(last.usage).toBe(1);
    expect(_.last(cache).usage).toBe(1);

    callback(payloads.SAVE_SERVICE);
    cache = storage.get('services');
    expect(last.usage).toBe(2);
    expect(_.last(cache).usage).toBe(2);
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

  it('returns active service', function () {
    callback(payloads.SET_ACTIVE_SERVICE);
    expect(servicesStore.getActiveServiceName()).toEqual('test1');
  });

  it('returns undefined if no active service', function () {
    expect(servicesStore.getActiveServiceName()).toEqual(undefined);
  });

  it('clears active service', function () {
    callback(payloads.CLEAR_ACTIVE_SERVICE);
    var state = servicesStore.getState();
    expect(state.activeService).toEqual({});
  });
});

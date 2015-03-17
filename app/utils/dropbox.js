var _ = require('lodash');
var storage = require('./storage');

var DROPBOX_APP_KEY = 'vxgu5nbh2ci3sfe';

var client = new Dropbox.Client({
  key: DROPBOX_APP_KEY
});


var DropboxClient = {
  client: client,

  isAuth() {
    return client.isAuthenticated();
  },

  signIn(callback) {
    client.authenticate({}, function() {
      callback && callback();
    });
  },

  tryAuth(callback) {
    client.authenticate({
      interactive: false
    }, function(error, e) {
      if (error) {
        console.log(error);
      } else {
        callback && callback()
      }
    })
  },

  signOut(callback) {
    client.signOut(null, function() {
      callback && callback()
    });
  },

  openDefaultDatastore(callback) {
    if (this.isAuth()) {
      var datastoreManager = client.getDatastoreManager();
      datastoreManager.openDefaultDatastore(callback);
    }
  },

  loadServices(callback) {
    callback = callback || _.noop;

    if (storage.cache.services && storage.cache.services.length) {
      callback(storage.cache.services);
    } else {
      this.openDefaultDatastore((err, datastore) => {
        var table   = datastore.getTable('services');
        var results = table.query();
        storage.set('services', results.map((item, index) =>
          item.getFields()
        ));

        callback(storage.cache.services);
      });
    }
  },

  loadSettings(callback) {
    if (storage.cache.settings) {
      callback(storage.cache.settings);
    } else {
      this.openDefaultDatastore((err, datastore) => {
        var table   = datastore.getTable('default-settings');
        var results = table.query();
        var result  = results[0]

        storage.set('settings', result.getFields());
        callback(storage.cache.settings);
      });
    }
  }
}

module.exports = DropboxClient;

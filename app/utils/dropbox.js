var _ = require('lodash');
var DROPBOX_APP_KEY = 'vxgu5nbh2ci3sfe';

var client = new Dropbox.Client({
  key: DROPBOX_APP_KEY
});

var cache = {};

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

    if (cache.services) {
      callback(cache.services);
    } else {
      this.openDefaultDatastore((err, datastore) => {
        var servicesTable = datastore.getTable('services');
        var results       = servicesTable.query();
        cache.services    = results.map((item, index) =>
          item.getFields()
        )

        callback(cache.services);
      });
    }
  }
}

module.exports = DropboxClient;

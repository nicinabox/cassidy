var DROPBOX_APP_KEY = 'vxgu5nbh2ci3sfe';

client = new Dropbox.Client({
  key: DROPBOX_APP_KEY
});

var DropboxClient = {
  client: client,

  authenticate() {
    client.authenticate({
      interactive: false
    }, (error) =>
      error ? (
        console.log(error)
      ) : false
    )
  },

  openDefaultDatastore(callback) {
    var datastore = client.getDatastoreManager();
    datastore.openDefaultDatastore(callback);
  }
}

DropboxClient.authenticate()
module.exports = DropboxClient

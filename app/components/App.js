var React     = require('react');
var dropbox   = require('../utils/dropbox');
var Sidebar   = require('./Sidebar');
var Generator = require('./Generator');

var App = React.createClass({
  getInitialState() {
    return {
      services: [],
      dropboxIsAuthenticated: dropbox.client.isAuthenticated()
    }
  },

  componentWillMount() {
    dropbox.openDefaultDatastore((error, datastore) => {
      var servicesTable = datastore.getTable('services');
      var results       = servicesTable.query();

      this.setState({
        services: results.map((item, index) =>
          item.getFields()
        )
      })
    });
  },

  connectDropbox() {
    dropbox.client.authenticate();
  },

  disconnectDropbox() {
    dropbox.client.signOut(null, () =>
      this.setState({
        dropboxIsAuthenticated: false
      })
    );
  },

  render() {
    return (
      <div className="container application">
        <div className="row">
          {this.state.dropboxIsAuthenticated ? (
            <button onClick={this.disconnectDropbox}>
              Disconnect Dropbox
            </button>
          ) : (
            <button onClick={this.connectDropbox}>
              Connect Dropbox
            </button>
          )}

          <Generator services={this.state.services} />
          <Sidebar services={this.state.services} />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app'));

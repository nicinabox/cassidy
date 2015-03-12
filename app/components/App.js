var React   = require('react');
var dropbox = require('../utils/dropbox');
var Sidebar = require('./Sidebar');

var App = React.createClass({
  getInitialState() {
    return {
      dropboxIsAuthenticated: dropbox.client.isAuthenticated()
    }
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

          <Sidebar />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app'));

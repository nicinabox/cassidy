var React     = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var authStore = require('../stores/authStore');
var authActions = require('../actions/authActions');
var dropbox = require('../utils/dropbox');
var Sidebar   = require('./Sidebar');
var Generator = require('./Generator');

var App = React.createClass({
  _onChange() {
    this.setState({
      dropboxIsAuth: authStore.isAuth()
    });
  },

  getInitialState() {
    return {
      dropboxIsAuth: authStore.isAuth()
    }
  },

  componentWillMount() {
    authStore.addChangeListener(this._onChange);
    authActions.tryAuth();
  },

  componentWillUnmount() {
    authStore.removeChangeListener(this._onChange);
  },

  connectDropbox() {
    authActions.signIn();
  },

  disconnectDropbox() {
    authActions.signOut();
  },

  render() {
    var dropboxButton = this.state.dropboxIsAuth ? (
      <button className="btn" onClick={this.disconnectDropbox}>
        Disconnect Dropbox
      </button>
    ) : (
      <button className="btn btn-primary" onClick={this.connectDropbox}>
        Connect Dropbox
      </button>
    )

    return (
      <div className="container application">
        {dropboxButton}

        <div className="row">
          <Generator />
          <Sidebar />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app'));

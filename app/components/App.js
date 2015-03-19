var React     = require('react');
var authStore = require('../stores/authStore');
var authActions = require('../actions/authActions');
var Sidebar   = require('./Sidebar');
var Generator = require('./Generator');
var Footer = require('./Footer');

var App = React.createClass({
  _onChange() {
    this.setState({
      dropboxIsAuth: authStore.isAuth()
    });
  },

  getInitialState() {
    return {
      dropboxIsAuth: authStore.isAuth()
    };
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
    return (
      <div className="container application">
        <div className="row">
          <Generator />
          <Sidebar />

          <Footer
            connectDropbox={this.connectDropbox}
            disconnectDropbox={this.disconnectDropbox}
            dropboxIsAuth={this.state.dropboxIsAuth} />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app'));

'use strict';
var React     = require('react');
var authStore = require('../stores/authStore');
var authActions = require('../actions/authActions');
var serviceActions = require('../actions/serviceActions');
var Sidebar   = require('./Sidebar');
var Generator = require('./Generator');
var Footer = require('./Footer');

var App = React.createClass({
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

  _connectDropbox() {
    authActions.signIn();
  },

  _disconnectDropbox() {
    authActions.signOut();
  },

  _onChange() {
    this.setState({
      dropboxIsAuth: authStore.isAuth()
    });
  },

  render() {
    return (
      <div className="container-fluid application">
        <div className="row">
          <Generator />
          <Sidebar />

          <Footer
            connectDropbox={this._connectDropbox}
            disconnectDropbox={this._disconnectDropbox}
            dropboxIsAuth={this.state.dropboxIsAuth} />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app'));

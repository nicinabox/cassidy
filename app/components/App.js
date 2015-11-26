'use strict';
var React     = require('react');
var authStore = require('../stores/authStore');
var authActions = require('../actions/authActions');
var serviceActions = require('../actions/serviceActions');
var Sidebar   = require('./Sidebar');
var Generator = require('./Generator');
var HeaderActions = require('./HeaderActions');
var Footer = require('./Footer');
var device = require('../utils/device');

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

  _onChange() {
  },

  render() {
    return (
      <div className="container-fluid application">
        <div className="row">

          <div className="col-sm-8 col-sm-push-4 col-lg-9 col-lg-push-3">
            <div className="row">
              <div className="col-sm-12">
                <HeaderActions />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-11 col-lg-8 col-sm-push-1">
                <Generator />
              </div>
            </div>

            <div className="row">
              <Footer />
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    );
  }
});

module.exports = App;

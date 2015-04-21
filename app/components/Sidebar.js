var React = require('react');
var Services = require('./Services');
var Settings = require('./Settings');

require('bootstrap-sass/assets/javascripts/bootstrap/tab');

var Sidebar = React.createClass({
  render() {
    return (
      <div id="sidebar" className="col-sm-4 col-sm-pull-8 col-lg-3 col-lg-pull-6">
        <ul className="nav nav-pills">
          <li className="active">
            <a href="#services" data-toggle="pill"
              className="btn-sm">
              Services
            </a>
          </li>
          <li>
            <a href="#settings" data-toggle="pill"
              className="btn-sm">
              Settings
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <Settings />
          <Services />
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;

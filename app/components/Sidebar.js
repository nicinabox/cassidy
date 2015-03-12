var React = require('react');
var Services = require('./Services');
var Settings = require('./Settings');

var Sidebar = React.createClass({
  propTypes: {
    services: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div id="sidebar" className="col-sm-4 col-md-3 col-md-pull-6 col-sm-pull-7">
        <ul className="nav nav-pills">
          <li className="active">
            <a href="#services" data-toggle="pill">Services</a>
          </li>
          <li>
            <a href="#settings" data-toggle="pill">Settings</a>
          </li>
        </ul>

        <div className="tab-content">
          <Services services={this.props.services} />
          <Settings />
        </div>
      </div>
    );
  }

});

module.exports = Sidebar;

var React = require('react');
var Services = require('./Services');
var Settings = require('./Settings');

var device = require('../utils/device');

var Sidebar = React.createClass({
  getInitialState: function() {
    return {
      windowHeight: !device.isMobile && window.innerHeight
    };
  },

  handleResize: function() {
    if (!device.isMobile) {
      this.setState({
        windowHeight: window.innerHeight
      });
    }
  },

  componentWillMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  render() {
    return (
      <div id="sidebar"
        className="col-sm-4 col-sm-pull-8 col-lg-3 col-lg-pull-6"
        style={styles.windowHeight(this.state.windowHeight)}>
        <ul className="nav nav-buttons">
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

var styles = {
  windowHeight: (height = 'auto') => {
    return {
      overflow: 'auto',
      maxHeight: height,
    }
  }
}

module.exports = Sidebar;

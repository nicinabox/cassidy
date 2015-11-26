var React = require('react');
var Services = require('./Services');
var Settings = require('./Settings');

var device = require('../utils/device');

var Sidebar = React.createClass({
  getInitialState: function() {
    return {
      activeTab: 'services',
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

  _toggleActiveTab(id, e) {
    e.preventDefault()

    this.setState({
      activeTab: id
    })
  },

  _activeIf(statement) {
    return statement && 'active'
  },

  render() {
    return (
      <div id="sidebar" style={styles.windowHeight(this.state.windowHeight)}>
        <ul className="nav">
          <li className={this._activeIf(this.state.activeTab === 'services')}>
            <a href="#services" data-toggle="pill" onClick={this._toggleActiveTab.bind(null, 'services')}>
              Services
              <span></span>
            </a>
          </li>
          <li className={this._activeIf(this.state.activeTab === 'settings')}>
            <a href="#settings" data-toggle="pill" onClick={this._toggleActiveTab.bind(null, 'settings')}>
              Attributes
              <span></span>
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
      minHeight: height,
    }
  }
}

module.exports = Sidebar;

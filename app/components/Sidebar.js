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

  _isTabActive(id) {
    return this.state.activeTab === id
  },

  render() {
    return (
      <div id="sidebar" className="col-sm-4 col-sm-pull-8 col-lg-3 col-lg-pull-9" style={styles.windowHeight(this.state.windowHeight)}>
        <ul className="nav">
          <li className={this._activeIf(this._isTabActive('services'))}>
            <a href="#services" data-toggle="pill" onClick={this._toggleActiveTab.bind(null, 'services')}>
              Services
              <span></span>
            </a>
          </li>
          <li className={this._activeIf(this._isTabActive('settings'))}>
            <a href="#settings" data-toggle="pill" onClick={this._toggleActiveTab.bind(null, 'settings')}>
              Attributes
              <span></span>
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <Settings active={this._isTabActive('settings')} />
          <Services active={this._isTabActive('services')} />
        </div>
      </div>
    );
  }

});

var styles = {
  windowHeight: (height = 'auto') => {
    return {
      overflow: 'auto',
      minHeight: height - 4,
    }
  }
}

module.exports = Sidebar;

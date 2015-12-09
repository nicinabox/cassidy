import React from 'react'
import Services from './Services'
import Settings from './Settings'
import Account from './Account'

import device from '../utils/device'

var Sidebar = React.createClass({
  getInitialState: function() {
    return {
      activeTab: 'services',
      windowHeight: !device.isMobile && window.innerHeight
    }
  },

  handleResize: function() {
    if (!device.isMobile) {
      this.setState({
        windowHeight: window.innerHeight
      })
    }
  },

  componentWillMount: function() {
    window.addEventListener('resize', this.handleResize)
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize)
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
          <li className={this._activeIf(this._isTabActive('account'))}>
            <a href="#account" data-toggle="pill" onClick={this._toggleActiveTab.bind(null, 'account')}>
              Key & Phrase
              <span></span>
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <Settings active={this._isTabActive('settings')} />
          <Services active={this._isTabActive('services')} />
          <Account active={this._isTabActive('account')} />
        </div>
      </div>
    )
  }

})

var styles = {
  windowHeight: (height = 'auto') => {
    return {
      overflow: 'auto',
      minHeight: height - 4,
    }
  }
}

module.exports = Sidebar

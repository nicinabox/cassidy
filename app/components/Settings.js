import _ from 'lodash'
import React from 'react'
import classNames from 'classnames'
import settingsActions from '../actions/settingsActions'
import serviceActions from '../actions/serviceActions'
import settingsStore from '../stores/settingsStore'
import servicesStore from '../stores/servicesStore'
import settingsUtils from '../utils/settingsUtils'
import activeSettings from '../utils/activeSettings'
import authStore from '../stores/authStore'
import Toggle from './Toggle'

var toggleFields = settingsUtils.toggleFields

var Settings = React.createClass({
  _onChange() {
    this.setState({
      isDropboxAuth: authStore.isAuth(),
      settings: activeSettings()
    })
  },

  getInitialState() {
    return {
      isDropboxAuth: authStore.isAuth(),
      settings: activeSettings(),
    }
  },

  componentWillMount() {
    servicesStore.addChangeListener(this._onChange)
    settingsStore.addChangeListener(this._onChange)
  },

  componentWillUnmount() {
    servicessStore.removeChangeListener(this._onChange)
    settingsStore.removeChangeListener(this._onChange)
  },

  handleToggleChange(name, e) {
    settingsActions.setSetting(name, !this.state.settings[name])
  },

  handleInputChange(e) {
    serviceActions.blurResult()
    settingsActions.setSetting(e.target.name, e.target.value)
  },

  handlePresetLength(number, e) {
    e.preventDefault()
    settingsActions.setSetting('length', number)
  },

  handleSaltGeneration(e) {
    e.preventDefault()
    settingsActions.setSetting('salt', settingsUtils.generateSalt())
  },

  handleSaltReset(e) {
    e.preventDefault()
    settingsActions.setSetting('salt', '')
  },

  renderPresetLengths() {
    return _.map([16, 20, 26, 34].reverse(), (n, i) => {
      return (
        <a href="#" key={`length-${i}`}
          className="settings-button pull-right"
          onClick={this.handlePresetLength.bind(null, n)}>
          {n}
        </a>
      )
    })
  },

  renderToggles() {
    return _(toggleFields).omit('require_always').map((v, k) =>
      <Toggle key={k} name={k}
        handleToggleChange={this.handleToggleChange.bind(null, k)}
        settings={this.state.settings} />
    ).value()
  },

  render() {
    var classes = classNames('tab-pane', this.props.active ? 'active' : '')

    return (
      <div id="settings" className={classes}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="">Attributes</label>
            {this.renderToggles()}
          </div>

          <div className="form-group">
            <label htmlFor="length">Length</label>
            <div className="pull-right" title="Length presets for easy access">
              {this.renderPresetLengths()}
            </div>
            <input type="number"
              name="length"
              id="length"
              pattern="[0-9]*"
              className="form-control"
              value={this.state.settings.length}
              onChange={this.handleInputChange}
              />
          </div>

          <div className="form-group">
            <label htmlFor="length">Variation</label>
            <a href="#"
              onClick={this.handleSaltGeneration}
              className="settings-button pull-right">
              Generate
            </a>
            {this.state.settings.salt ? (
              <a href="#"
                onClick={this.handleSaltReset}
                className="settings-button settings-button-secondary pull-right">
                Reset
              </a>
            ): ''}

            <span className="pull-right variation-string" title={this.state.settings.salt}>
              {_.trunc(this.state.settings.salt, 9)}
            </span>

            <small className="help-block">
              Generating a variation will create a new password. Useful when you need to change your password for this service.
            </small>
          </div>
        </form>
      </div>
    )
  }

})

module.exports = Settings

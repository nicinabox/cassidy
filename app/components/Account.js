import _ from 'lodash'
import React from 'react'
import classNames from 'classnames'
import settingsActions from '../actions/settingsActions'
import serviceActions from '../actions/serviceActions'
import settingsStore from '../stores/settingsStore'
import servicesStore from '../stores/servicesStore'
import activeSettings from '../utils/activeSettings'
import settingsUtils from '../utils/settingsUtils'

import Toggle from './Toggle'

var toggleFields = settingsUtils.toggleFields

var Account = React.createClass({
  _onChange() {
    this.setState({
      settings: activeSettings(),
      phrase: settingsStore.getDecryptedPhrase(),
    })
  },

  getInitialState() {
    return {
      settings: activeSettings(),
      phrase: settingsStore.getDecryptedPhrase(),
      phraseIsVisible: false
    }
  },

  componentWillMount() {
    servicesStore.addChangeListener(this._onChange)
    settingsStore.addChangeListener(this._onChange)
  },

  componentDidMount() {
    this.promptForPhrase()
  },

  componentWillUnmount() {
    servicessStore.removeChangeListener(this._onChange)
    settingsStore.removeChangeListener(this._onChange)
  },

  handlePhraseChange(e) {
    var { value } = e.currentTarget
    settingsActions.changePhrase(value)
  },

  togglePhraseVisibility(e) {
    e.preventDefault()
    this.setState({
      phraseIsVisible: !this.state.phraseIsVisible
    })
  },

  handleInputChange(e) {
    serviceActions.blurResult()
    settingsActions.setSetting(e.target.name, e.target.value)
  },

  handleToggleChange(name, e) {
    settingsActions.setSetting(name, !this.state.settings[name])
  },

  promptForPhrase() {
    if (this.state.settings.require_always) {
      storage.remove('phrase')
      settingsActions.clearPhrase()

      setTimeout(function() {
        var answer = prompt('Please enter your phrase')
        settingsActions.changePhrase(answer)
      }, 0)
    }
  },

  handleClearData(e) {
    e.preventDefault()

    if (!confirm('All your services and settings will be GONE FOREVER. Your key and saved variations will be UNRECOVERABLE.')) {
      return
    }

    if (this.state.isDropboxAuth) {
      settingsActions.clearDropboxData()
    } else {
      settingsActions.clearLocalData()
    }
  },

  render() {
    var classes = classNames('tab-pane', this.props.active ? 'active' : '')

    return (
      <div id="account" className={classes}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="key">Key</label>
            <input type="text" name="key" id="key"
              className="form-control"
              value={this.state.settings.key}
              onChange={this.handleInputChange}
              autoComplete="off"
              autoCorrect="off" />

            <small className="help-block">
              This key was made for you. Keep it safe&mdash;you'll need it generate the same passwords.
            </small>
          </div>
        </form>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="phrase">Phrase</label>
            {!this.state.settings.require_always && (
              <span>
                <a href="#"
                  onClick={this.togglePhraseVisibility}
                  className="settings-button pull-right">
                  {this.state.phraseIsVisible ? 'Hide' : 'Show'}
                </a>

                <input type={this.state.phraseIsVisible ? 'text' : 'password'}
                  name="phrase"
                  id="phrase"
                  ref="phrase"
                  onChange={this.handlePhraseChange}
                  className="form-control" value={this.state.phrase} />
              </span>
            )}

            <Toggle name="require_always"
              handleToggleChange={this.handleToggleChange.bind(null, 'require_always')}
              settings={this.state.settings} />
          </div>
        </form>

        <div className="danger-zone">
          <label>Danger Zone</label>
          <br />

          <a href="#"
            className="btn btn-link btn-link-danger"
            ref="clearData"
            onClick={this.handleClearData}>
            {this.state.isDropboxAuth ? (
              'Clear Dropbox data'
            ) : (
              'Clear local data'
            )}
          </a>
        </div>
      </div>
    )
  }

})

module.exports = Account

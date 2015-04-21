'use strict';

var React = require('react/addons');
var settingsActions = require('../actions/settingsActions');
var serviceActions = require('../actions/serviceActions');
var settingsStore = require('../stores/settingsStore');
var servicesStore = require('../stores/servicesStore');
var settingsUtils = require('../utils/settingsUtils');
var activeSettings = require('../utils/activeSettings');
var authStore = require('../stores/authStore');
var _ = require('lodash');

var Toggle = require('./Toggle');
var toggleFields = settingsUtils.toggleFields;

var Settings = React.createClass({
  _onChange() {
    this.setState({
      isDropboxAuth: authStore.isAuth(),
      settings: activeSettings(),
      phrase: settingsStore.getDecryptedPhrase()
    });
  },

  getInitialState() {
    return {
      isDropboxAuth: authStore.isAuth(),
      settings: activeSettings(),
      phrase: settingsStore.getDecryptedPhrase(),
      phraseIsVisible: false
    };
  },

  componentWillMount() {
    servicesStore.addChangeListener(this._onChange);
    settingsStore.addChangeListener(this._onChange);
  },

  componentDidMount() {
    this.promptForPhrase();
  },

  promptForPhrase() {
    if (this.state.settings.require_always) {
      storage.remove('phrase');
      settingsActions.clearPhrase();

      setTimeout(function() {
        var answer = prompt('Please enter your phrase');
        settingsActions.changePhrase(answer);
      }, 0);
    }
  },

  componentWillUnmount() {
    servicessStore.removeChangeListener(this._onChange);
    settingsStore.removeChangeListener(this._onChange);
  },

  handleToggleChange(name, e) {
    settingsActions.setSetting(name, !this.state.settings[name]);
  },

  handleInputChange(e) {
    serviceActions.blurResult();
    settingsActions.setSetting(e.target.name, e.target.value);
  },

  handlePresetLength(number, e) {
    e.preventDefault();
    settingsActions.setSetting('length', number);
  },

  handlePhraseChange() {
    var value = this.refs.phrase.getDOMNode().value;
    settingsActions.changePhrase(value);
  },

  togglePhraseVisibility(e) {
    e.preventDefault();
    this.setState({
      phraseIsVisible: !this.state.phraseIsVisible
    });
  },

  handleResetSettings(e) {
    e.preventDefault();
    settingsActions.resetSettings();
  },

  handleClearData(e) {
    e.preventDefault();

    if (!confirm('All your services and settings will be GONE FOREVER. Your key and saved variations will be UNRECOVERABLE.')) {
      return;
    }

    if (this.state.isDropboxAuth) {
      settingsActions.clearDropboxData();
    } else {
      settingsActions.clearLocalData();
    }
  },

  handleSaltGeneration(e) {
    e.preventDefault();
    settingsActions.setSetting('salt', settingsUtils.generateSalt());
  },

  handleSaltReset(e) {
    e.preventDefault();
    settingsActions.setSetting('salt', '');
  },

  render() {
    var presetLengths = _.map([16, 20, 26, 34].reverse(), (n, i) => {
      var key = "length-" + i;
      return (
        <a href="#" key={key}
          className="settings-button pull-right"
          onClick={this.handlePresetLength.bind(null, n)}>
          {n}
        </a>
      );
    });

    var toggles = _(toggleFields).omit('require_always').map((v, k) =>
      <Toggle key={k} name={k}
        handleToggleChange={this.handleToggleChange.bind(null, k)}
        settings={this.state.settings} />
    ).value();

    return (
      <div id="settings" className="tab-pane">
        <form id="settingsForm">
          <div className="form-group">
            <label htmlFor="">Attributes</label>
            {toggles}
          </div>

          <div className="form-group">
            <label htmlFor="length">Length</label>
            <div className="pull-right" title="Length presets for easy access">
              {presetLengths}
            </div>
            <input type="number" name="length" id="length"
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
              {_.trunc(this.state.settings.salt, 8)}
            </span>

            <small className="help-block">
              Generating a variation will create a new password. Useful when you need to change your password for this service.
            </small>
          </div>

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

        <form id="phraseForm">
          <div className="form-group">
            <label htmlFor="phrase">Phrase</label>
            {!this.state.settings.require_always && (
              <span>
                <a href="#"
                  onClick={this.togglePhraseVisibility}
                  className="settings-button pull-right">
                  {this.state.phraseIsVisible ? 'Hide' : 'Show'}
                </a>

                <input type={this.state.phraseIsVisible ? 'text' : 'password'} name="phrase" id="phrase"
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
            className="btn btn-link"
            ref="resetSettings"
            onClick={this.handleResetSettings}
            title="Reset all settings except for key and phrase">
            Reset settings
          </a>
          <br />

          <a href="#"
            className="btn btn-link btn-link-danger"
            ref="clearData"
            onClick={this.handleClearData}>
            {this.state.isDropboxAuth ? (
              "Clear Dropbox data"
            ) : (
              "Clear local data"
            )}
          </a>
        </div>
      </div>
    );
  }

});

module.exports = Settings;

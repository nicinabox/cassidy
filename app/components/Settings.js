var React = require('react/addons');
var settingsStore = require('../stores/settingsStore');
var settingsActions = require('../actions/settingsActions');
var authStore = require('../stores/authStore');

var toggleFields = {
  lower: 'Lowercase',
  upper: 'Uppercase',
  number: 'Numbers',
  dash: 'Dashes & underscore',
  symbol: 'Symbols',
  require_always: 'Require always'
};

var Settings = React.createClass({
  _onChange() {
    this.setState({
      isDropboxAuth: authStore.isAuth(),
      settings: settingsStore.getSettings(),
      phrase: settingsStore.getDecryptedPhrase()
    });
  },

  clearDropboxData() {

  },

  clearLocalData() {

  },

  getInitialState() {
    return {
      isDropboxAuth: authStore.isAuth(),
      settings: settingsStore.getSettings(),
      phrase: settingsStore.getDecryptedPhrase()
    };
  },

  toggleSetting(name, e) {
    console.log(name);
  },

  handleLengthChange() {

  },

  handleKeyChange() {

  },

  handlePhraseChange() {
    var value = this.refs.phrase.getDOMNode().value;
    settingsActions.changePhrase(value);
  },

  componentWillMount() {
    settingsStore.addChangeListener(this._onChange);
    settingsActions.loadSettings();
  },

  componentWillUnmount() {
    settingsStore.removeChangeListener(this._onChange);
  },

  render() {
    var toggles = _(toggleFields).omit('require_always').map((v, k) =>
      <Toggle key={k} name={k}
        toggleSetting={this.toggleSetting.bind(null, k)}
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
            <div className="presets length-presets" title="Length presets for easy access">
              <a href="#">16</a>{' '}
              <a href="#">20</a>{' '}
              <a href="#">26</a>{' '}
              <a href="#">34</a>
            </div>
            <input type="number" name="length" id="length"
              className="form-control"
              value={this.state.settings.length}
              onChange={this.handleLengthChange}
              />
          </div>

          <div className="form-group">
            <label htmlFor="key">Key</label>
            <input type="text" name="key" id="key"
              className="form-control"
              value={this.state.settings.key}
              onChange={this.handleKeyChange}
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
            <a href="#" className="small-settings-button pull-right toggle-visibility">Show</a>

            <input type="password" name="phrase" id="phrase"
              ref="phrase"
              onChange={this.handlePhraseChange}
              className="form-control" value={this.state.phrase} />

            <Toggle name="require_always"
              toggleSetting={this.toggleSetting.bind(null, 'require_always')}
              settings={this.state.settings} />
          </div>
        </form>

        <div className="danger-zone">
          <a href="#" className="btn btn-link"
            onClick={this.resetSettings}
            title="Reset all settings except for key and phrase">
            Reset settings
          </a>
          <br />

          {this.state.isDropboxAuth ? (
            <a href="#" className="btn btn-link btn-link-danger"
              onClick={this.clearDropboxData}>
              Clear Dropbox data
            </a>
          ) : (
            <a href="#" className="btn btn-link btn-link-danger clear-data"
              onClick={this.clearLocalData}>
              Clear local data
            </a>
          )}
        </div>
      </div>
    );
  }

});

var Toggle = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    toggleSetting: React.PropTypes.func.isRequired,
    settings: React.PropTypes.object.isRequired
  },

  getToggleClass() {
    var value = this.getValue()
    if (value) {
      return 'fa-toggle-on';
    } else {
      return 'fa-toggle-off';
    }
  },

  getValue() {
    return this.props.settings[this.props.name];
  },

  getLabel() {
    return toggleFields[this.props.name];
  },

  render() {
    var cx = React.addons.classSet;
    var iconClasses = cx("fa fa-lg pull-right", this.getToggleClass());

    return (
      <div className="toggle">
        <input
          type="checkbox"
          name={this.props.name}
          id={this.props.name}
          value={this.getValue()}
          onChange={this.props.toggleSetting}
          checked={!!this.getValue()} />

        <label htmlFor={this.props.name}>
          {this.getLabel()}
          <i className={iconClasses}></i>
        </label>
      </div>
    );
  }
})

module.exports = Settings;

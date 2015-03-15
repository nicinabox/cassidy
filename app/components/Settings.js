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
  space: 'Space',
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

  getInitialState() {
    return {
      isDropboxAuth: authStore.isAuth(),
      settings: settingsStore.getSettings(),
      phrase: settingsStore.getDecryptedPhrase(),
      phraseIsVisible: false
    };
  },

  componentWillMount() {
    settingsStore.addChangeListener(this._onChange);
    settingsActions.loadSettings();
  },

  componentWillUnmount() {
    settingsStore.removeChangeListener(this._onChange);
  },

  handleToggleChange(name, e) {
    settingsActions.toggle(name);
  },

  handleInputChange(e) {
    var settings = _.clone(this.state.settings);
    settings[e.target.name] = e.target.value;

    this.setState({
      settings: settings
    });
  },

  handlePresetLength(number, e) {
    e.preventDefault();
    var settings = _.clone(this.state.settings);
    settings.length = number;
    this.setState({
      settings: settings
    });
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

  clearDropboxData(e) {
    e.preventDefault();
  },

  clearLocalData(e) {
    e.preventDefault();
  },

  render() {
    var presetLengths = _.map([16, 20, 26, 34], (n, i) => {
      var key = "length-" + i;
      return (
        <a href="#" key={key}
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
            <div className="presets length-presets" title="Length presets for easy access">
              {presetLengths}
            </div>
            <input type="number" name="length" id="length"
              className="form-control"
              value={this.state.settings.length}
              onChange={this.handleInputChange}
              />
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
            <a href="#"
              onClick={this.togglePhraseVisibility}
              className="small-settings-button pull-right">
              {this.state.phraseIsVisible ? 'Hide' : 'Show'}
            </a>

            <input type={this.state.phraseIsVisible ? 'text' : 'password'} name="phrase" id="phrase"
              ref="phrase"
              onChange={this.handlePhraseChange}
              className="form-control" value={this.state.phrase} />

            <Toggle name="require_always"
              handleToggleChange={this.handleToggleChange.bind(null, 'require_always')}
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
    handleToggleChange: React.PropTypes.func.isRequired,
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
          onChange={this.props.handleToggleChange}
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

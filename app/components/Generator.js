'use strict';
var React = require('react');
var _ = require('lodash');

var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var settingsStore = require('../stores/settingsStore');
var settingsActions = require('../actions/settingsActions');
var generator = require('../utils/generator');
var activeSettings = require('../utils/activeSettings');
var device = require('../utils/device');

var TypeaheadResults = require('./TypeaheadResults');

var Generator = React.createClass({
  _onChange() {
    var servicesState = servicesStore.getState();

    var state = {
      settings: activeSettings(),
      activeService: {}
    };

    if (servicesState.activeService) {
      state.activeService = servicesState.activeService;
      state.service = servicesState.activeService.service;
    }

    this.setState(state, () => {
      if (servicesState.focusResult) {
        this.selectResult();
      }
    });
  },

  getInitialState() {
    return {
      activeService: {},
      service: servicesStore.getActiveServiceName(),
      settings: activeSettings(),
      serviceAutoFocus: !device.isMobile,
      showTypeahead: false,
      result: ''
    };
  },

  componentDidMount() {
    servicesStore.addChangeListener(this._onChange);
    settingsStore.addChangeListener(this._onChange);

    this.setState({
      interestingDomain: this.generateInterestingDomain() || 'google.com'
    });
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
    settingsStore.removeChangeListener(this._onChange);
  },

  handleServiceChange(e) {
    var value = e.target.value;

    serviceActions.matchSavedService(value);
    this.setState({
      service: value,
      showTypeahead: true
    });
  },

  handleSubmit(e) {
    e.preventDefault();
  },

  clearService(e) {
    e.preventDefault();
    serviceActions.clearActiveService();
    serviceActions.filterServices();
    this.setState({
      service: ''
    }, () => {
      React.findDOMNode(this.refs.service).focus();
    });
  },

  selectResult: function() {
    var node = React.findDOMNode(this.refs.result);
    node.selectionStart = 0;
    node.selectionEnd = node.value.length;

    this.setState({
      showTypeahead: false
    });
  },

  handleSelectResult(e) {
    _.defer(() => this.selectResult());
  },

  generateInterestingDomain() {
    var service = _(servicesStore.getTopServices(10)).sample();
    if (service) {
      return service.service;
    }
  },

  saveService() {
    var service = {
      service: this.state.service,
      settings: this.state.settings
    };
    serviceActions.saveService(service);
  },

  showTypeahead() {
    return this.state.showTypeahead;
  },

  render() {
    var placeholder = 'Eg, ' + this.state.interestingDomain;
    var result = generator(this.state);

    return (
      <div id="generator">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              ref="service"
              className="form-control input-lg"
              value={this.state.service}
              onChange={this.handleServiceChange}
              placeholder={placeholder}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus={this.state.serviceAutoFocus} />

            {this.showTypeahead() ? (
              <TypeaheadResults query={this.state.service} />
            ) : ''}

            {this.state.service && (
              <a href="#" className="clear" tabIndex="-1"
                onClick={this.clearService}>
                &times;
              </a>
            )}
          </div>

          {result && (
            <div className="form-group">
              <input type="text"
                id="result"
                ref="result"
                value={result}
                onFocus={this.handleSelectResult}
                onClick={this.handleSelectResult}
                onCopy={this.saveService}
                onChange={(e) => {
                  e.preventDefault();
                }}
                />

              {device.isMobile && (
                <div className="text-muted text-center" style={styles.copyHint}>
                  <span className="pull-left">&uarr;</span>
                  Tap on a blue dot to copy
                  <span className="pull-right">&uarr;</span>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    );
  }

});

var styles = {
  copyHint: {
    paddingLeft: 10,
    paddingRight: 10,
  }
};

module.exports = Generator;

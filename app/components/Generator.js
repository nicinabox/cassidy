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

var Suggestions = require('./Suggestions');
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
      service: value
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    React.findDOMNode(this.refs.service).focus();
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

  selectResult() {
    var node = React.findDOMNode(this.refs.result);
    if (node) { node.select(); }
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

  render() {
    var placeholder = 'Eg, ' + this.state.interestingDomain;
    var result = generator(this.state);

    return (
      <div className="col-sm-8 col-sm-push-4 col-lg-6 col-lg-push-3">
        <div id="generator">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-lg"
                value={this.state.service}
                onChange={this.handleServiceChange}
                placeholder={placeholder}
                ref="service"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus={this.state.serviceAutoFocus} />

              {!this.state.activeService.service ? (
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
                <input type="text" id="result"
                  className="result"
                  ref="result"
                  value={result}
                  onFocus={this.selectResult}
                  onClick={this.selectResult}
                  onCopy={this.saveService}
                  readOnly />
              </div>
            )}
          </form>

          <Suggestions
            populate={this.props.populate}
            services={this.props.services} />
        </div>
      </div>
    );
  }

});

module.exports = Generator;

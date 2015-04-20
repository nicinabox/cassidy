'use strict';
var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var settingsStore = require('../stores/settingsStore');
var settingsActions = require('../actions/settingsActions');
var generator = require('../utils/generator');
var Suggestions = require('./Suggestions');
var _ = require('lodash');

var Generator = React.createClass({
  _onChange() {
    var servicesState = servicesStore.getState();

    var state = {
      settings: settingsStore.getState().settings
    };

    if (servicesState.activeService) {
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
      service: servicesStore.getActiveServiceName(),
      settings: settingsStore.getState().settings,
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
      <div id="generator" className="col-sm-7 col-md-6 col-md-push-4 col-sm-push-5">
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
              autoFocus={true} />

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
    );
  }

});

module.exports = Generator;

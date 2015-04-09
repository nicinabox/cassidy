'use strict';
var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var settingsStore = require('../stores/settingsStore');
var settingsActions = require('../actions/settingsActions');
var generator = require('../utils/generator');
var Suggestions = require('./Suggestions');

var Generator = React.createClass({
  _onChange() {
    var selectedService = servicesStore.getSelectedService().service;
    var state = {
      settings: settingsStore.getState().settings
    };

    if (selectedService) {
      state.service = selectedService;
    }

    this.setState(state, () => {
      if (selectedService) {
        this.selectResult();
      }
    });
  },

  getInitialState() {
    return {
      service: servicesStore.getSelectedService().service,
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

    serviceActions.filterServices(value);
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
    serviceActions.clearSelectedService();
    serviceActions.filterServices();
    this.setState({
      service: ''
    }, () => {
      React.findDOMNode(this.refs.service).focus();
    });
  },

  selectResult() {
    var node = React.findDOMNode(this.refs.result);
    node.setSelectionRange(0, node.value.length);

    if (!servicesStore.getSelectedService().service) {
      this.saveService();
    }
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
    serviceActions.addService(service);
  },

  render() {
    var placeholder = "Eg, " + this.state.interestingDomain;
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

            {this.state.service ? (
              <a href="#" className="clear" tabIndex="-1"
                onClick={this.clearService}>
                &times;
              </a>
            ) : ''}

            <div className="errors"></div>
          </div>

          {result ? (
            <div className="form-group">
              <input type="text" id="result"
                ref="result"
                value={result}
                onFocus={this.selectResult}
                onClick={this.selectResult}
                readOnly />
            </div>
          ) : ''}
        </form>

        <Suggestions
          populate={this.props.populate}
          services={this.props.services} />
      </div>
    );
  }

});

module.exports = Generator;

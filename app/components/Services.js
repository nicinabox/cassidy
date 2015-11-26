var _ = require('lodash');
var React   = require('react');
var classNames = require('classnames');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');

var NoResults = require('./NoResults');
var Suggestions = require('./Suggestions');

var Services = React.createClass({
  _onChange() {
    this.setState(servicesStore.getState());
  },

  getInitialState() {
    return servicesStore.getState();
  },

  componentWillMount() {
    servicesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
  },

  populateGenerator(service, e) {
    e.preventDefault();
    if (e.target.className === 'remove') return;
    serviceActions.setActiveService(service);
    serviceActions.focusResult();
  },

  removeService(service, e) {
    if (confirm(`Are you sure you want to remove ${service.service}?`)) {
      serviceActions.removeService(service);
    }
  },

  getServices() {
    var filtered = this.state.filteredServices;
    var services = this.state.services;
    if (!_.isEmpty(filtered)) {
      services = filtered;
    }
    return _.sortBy(services, 'service');
  },

  render() {
    var services = this.getServices().map((item, index) =>
      <a href="#"
        onClick={this.populateGenerator.bind(null, item)}
        key={index}>
        <span className="name">{item.service}</span>
        <span className="remove"
          onClick={this.removeService.bind(null, item)}>
          &times;
        </span>
      </a>
    );

    var classes = classNames('tab-pane', this.props.active ? 'active' : '')

    return (
      <nav id="services" className={classes}>
        <div className="sidebar-section">
          <span className="section-label">Most Used</span>
            <Suggestions
              populate={this.props.populate}
              services={this.props.services} />
        </div>

        <div className="sidebar-section">
          <span className="section-label">All Services</span>
          {services.length ? (
            services
          ) : (
            <NoResults message="When you copy a generated password, the service will appear here." />
          )}
        </div>
      </nav>
    );
  }

});

module.exports = Services;

var React   = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var _ = require('lodash');

var Services = React.createClass({
  _onChange() {
    this.setState({
      services: servicesStore.getServices()
    });
  },

  getInitialState() {
    return {
      services: servicesStore.getServices()
    };
  },

  componentWillMount() {
    servicesStore.addChangeListener(this._onChange);
    serviceActions.loadServices();
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
  },

  populateGenerator(service, e) {
  },

  render() {
    var services = _.sortBy(this.state.services, 'service');
    services = services.map((item, index) =>
      <a href="#"
        onClick={this.populateGenerator.bind(null, item)}
        key={index}>
        <span className="name">{item.service}</span>
        <span className="remove">&times;</span>
      </a>
    );

    return (
      <nav id="services" className="tab-pane active">
        {services}
      </nav>
    );
  }

});

module.exports = Services;

var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var _     = require('lodash');

var top = function(services, limit) {
  return _(services)
    .reject((s) => !s.usage)
    .sortBy((s) => s.usage)
    .last(limit).reverse().value();
};

var Suggestions = React.createClass({
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
    e.preventDefault();
    serviceActions.selectService(service);
  },

  render: function() {
    var services = top(this.state.services, 6);
    var suggestions = services.map((item, index) =>
      <a href="#"
        key={index}
        onClick={this.populateGenerator.bind(null, item)}>
        {item.service}
      </a>
    );

    return (
      <div id="suggestions">
        <strong>Most used: </strong>
        {suggestions}
      </div>
    );
  }

});

module.exports = Suggestions;

var _     = require('lodash');
var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var NoResults = require('./NoResults');

var Suggestions = React.createClass({
  _onChange() {
    this.setState({
      services: servicesStore.getState().services
    });
  },

  getInitialState() {
    return {
      services: servicesStore.getState().services
    };
  },

  componentDidMount() {
    servicesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
  },

  populateGenerator(service, e) {
    e.preventDefault();
    serviceActions.setActiveService(service);
    serviceActions.focusResult();
  },

  render: function() {
    var services = servicesStore.getTopServices(6);
    var suggestions = services.map((item, index) =>
      <a href="#"
        onClick={this.populateGenerator.bind(null, item)}
        key={index}>
        <span className="name">{item.service}</span>
      </a>
    );

    return (
      <div>
        {services.length ? (
          suggestions
        ) : (
          <NoResults message="Your frequently used services will appear here for quick access." />
        )}
      </div>
    );
  }

});

module.exports = Suggestions;

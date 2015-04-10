var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');
var _     = require('lodash');

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
  },

  render: function() {
    var services = servicesStore.getTopServices(6);
    var suggestions = services.map((item, index) =>
      <a href="#"
        key={index}
        onClick={this.populateGenerator.bind(null, item)}>
        {item.service}
      </a>
    );

    return (
      <div>
        {services.length ? (
          <div id="suggestions">
            <strong>Most used: </strong>
            {suggestions}
          </div>
        ) : ''}
      </div>
    );
  }

});

module.exports = Suggestions;

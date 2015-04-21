var React = require('react');
var servicesStore = require('../stores/servicesStore');
var serviceActions = require('../actions/serviceActions');

var TypeaheadResults = React.createClass({
  getInitialState: function() {
    return {
      services: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var services = _.take(servicesStore.getFilteredServices(nextProps.query || ''), 4);
    this.setState({services});
  },

  populateGenerator(service, e) {
    e.preventDefault();
    serviceActions.setActiveService(service);
    serviceActions.focusResult();
  },

  render: function() {
    var results = (
      <div className="typeahead-results">
        {this.state.services.map((service, i) => {
          return (
            <a href="#"
              key={`service-${i}`}
              onClick={this.populateGenerator.bind(null, service)}>
              {service.service}
            </a>
          );
        })}
      </div>
    );

    return (
      <div className="typeahead-results-container">
        {this.state.services.length ? results : ''}
      </div>
    );
  }

});

module.exports = TypeaheadResults;

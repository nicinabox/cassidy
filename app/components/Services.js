var React = require('react');
var dropbox = require('../utils/dropbox')

var Services = React.createClass({
  getInitialState() {
    return {
      services: []
    }
  },

  componentWillMount() {
    dropbox.openDefaultDatastore((error, datastore) => {
      var servicesTable = datastore.getTable('services');
      var results       = servicesTable.query();

      this.setState({
        services: results.map((item, index) =>
          item.getFields()
        )
      })
    });
  },

  render() {
    var services = this.state.services.map((item, index) =>
      <a href="#" key={index}>
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

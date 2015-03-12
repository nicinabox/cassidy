var React = require('react');
var dropbox = require('../utils/dropbox')

var Services = React.createClass({
  propTypes: {
    services: React.PropTypes.array.isRequired
  },

  render() {
    var services = this.props.services.map((item, index) =>
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

var React = require('react');
var _     = require('lodash');

var top = function(services, limit) {
  return _(services)
    .reject((s) => !s.usage)
    .sortBy((s) => s.usage)
    .last(limit).reverse().value();
};

var Suggestions = React.createClass({
  populateGenerator(service, e) {
    e.preventDefault();
    this.props.populate(service);
  },

  render: function() {
    var services = top(this.props.services, 6);
    var suggestions = services.map((item, index) =>
      <a href=""
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

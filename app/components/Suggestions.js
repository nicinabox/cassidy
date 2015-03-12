var React = require('react');
var _     = require('lodash');

var top = function(services, limit) {
  return _(services)
    .reject((s) => !s.usage)
    .sortBy((s) => s.usage)
    .last(limit).reverse().value();
};

var Suggestions = React.createClass({
  propTypes: {
    services: React.PropTypes.array.isRequired
  },

  render: function() {
    var services = top(this.props.services, 6);
    var suggestions = services.map((item, index) =>
      <a href="" key={index}>
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

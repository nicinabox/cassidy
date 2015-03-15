var React = require('react');

var NoResults = React.createClass({

  render: function() {
    return (
      <h3 className="no-results">
        {this.props.message}
      </h3>
    );
  }

});

module.exports = NoResults;

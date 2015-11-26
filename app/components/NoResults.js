var React = require('react');

var NoResults = React.createClass({

  render: function() {
    return (
      <p className="no-results">
        {this.props.message}
      </p>
    );
  }

});

module.exports = NoResults;

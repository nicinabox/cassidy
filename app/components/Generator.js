var React = require('react');
var Suggestions = require('./Suggestions');

var Generator = React.createClass({
  getInitialState() {
    return {
      service: {}
    }
  },

  handleChange() {
  },

  render() {
    return (
      <div id="generator" className="col-sm-7 col-md-6 col-md-push-4 col-sm-push-5">
        <form>
          <div className="form-group">
            <input
              value={this.state.service}
              onChange={this.handleChange}
              type="text"
              name="service"
              id="service"
              className="form-control input-lg"
              placeholder="Eg, google.com"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              autofocus />
            <a href="#" className="clear" tabIndex="-1">&times;</a>

            <div className="errors"></div>
          </div>

          <div className="form-group">
            <input type="text" id="result" readOnly />
            <small className="hint">
              <span className="super-key"></span>C
            </small>
          </div>
        </form>

        <Suggestions
          populate={this.props.populate}
          services={this.props.services} />
      </div>
    );
  }

});

module.exports = Generator;

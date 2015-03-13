var React = require('react');
var servicesStore = require('../stores/servicesStore');
var generator = require('../utils/generator');
var Suggestions = require('./Suggestions');

var Generator = React.createClass({
  _onChange() {
    this.setState({
      service: servicesStore.getSelectedService()
    }, () => {
      this.handleChange();
    });
  },

  getInitialState() {
    return {
      service: servicesStore.getSelectedService(),
      result: ''
    }
  },

  componentDidMount() {
    servicesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
  },

  handleChange() {
    if (_.isEmpty(this.state.service)) return;

    var service = this.state.service;
    _.extend(service.settings, { phrase: 'juice' });

    var result = generator(service);

    this.setState({
      result: result
    });
  },

  render() {
    return (
      <div id="generator" className="col-sm-7 col-md-6 col-md-push-4 col-sm-push-5">
        <form>
          <div className="form-group">
            <input
              value={this.state.service.service}
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

          {this.state.result ? (
            <div className="form-group">
              <input type="text" id="result"
                value={this.state.result}
                readOnly />
            </div>
          ) : ''}
        </form>

        <Suggestions
          populate={this.props.populate}
          services={this.props.services} />
      </div>
    );
  }

});

module.exports = Generator;

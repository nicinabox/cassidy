var React = require('react');
var classNames = require('classnames');

var Footer = React.createClass({
  render() {
    return (
      <div id="footer" className="col-sm-11 col-lg-8 col-sm-push-1">
        <div className="wrapper">
          <nav>
            <a href="https://github.com/nicinabox/cassidy">Source</a>
            {' '}
            <span className="text-muted">
              Made by <a href="http://twitter.com/nicinabox">@nicinabox</a>
            </span>
          </nav>
        </div>
      </div>
    );
  }

});

module.exports = Footer;

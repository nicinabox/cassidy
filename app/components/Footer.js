var React = require('react/addons');

var Footer = React.createClass({
  propTypes: {
    dropboxIsAuth: React.PropTypes.bool.isRequired
  },

  connectedClassName() {
    return this.props.dropboxIsAuth ? 'connected' : '';
  },

  handleConnectDropbox(e) {
    e.preventDefault();
    this.props.connectDropbox();
  },

  handleDisconnectDropbox(e) {
    e.preventDefault();
    this.props.disconnectDropbox();
  },

  render() {
    var cx = React.addons.classSet;
    var dropboxClasses = cx('btn btn-link connect-dropbox', this.connectedClassName());

    var dropboxButton = this.props.dropboxIsAuth ? (
      <a href="#"
        className={dropboxClasses}
        onClick={this.handleDisconnectDropbox}
        title="Disconnect Dropbox">
        <i className="fa fa-dropbox fa-lg"></i> Disconnect Dropbox
      </a>
    ) : (
      <a href="#"
        className={dropboxClasses}
        onClick={this.handleConnectDropbox}
        title="Connect Dropbox">
        <i className="fa fa-dropbox fa-lg"></i> Connect Dropbox
      </a>
    );

    return (
      <div id="footer" className="col-sm-9 col-md-9 col-md-push-3 col-sm-push-3">
        <div className="wrapper">
          <nav>
            <a href="https://github.com/nicinabox/cassidy">Source</a>
            <span className="text-muted">
              Made by <a href="http://twitter.com/nicinabox">@nicinabox</a>
            </span>
          </nav>

          {dropboxButton}
        </div>
      </div>
    );
  }

});

module.exports = Footer;

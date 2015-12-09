import React from 'react'
import { version } from '../../package.json'

var HeaderActions = React.createClass({

  render: function() {
    return (
      <div id="header-actions">
        <nav className="pull-right">
          <span className="text-muted">v{version}</span>
          <a href="https://github.com/nicinabox/cassidy">Source</a>
          <span className="text-muted">
            Made by <a href="http://twitter.com/nicinabox">@nicinabox</a>
          </span>
        </nav>
      </div>
    )
  }

})

module.exports = HeaderActions

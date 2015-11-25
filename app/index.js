var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App');
var FastClick = require('fastclick');

window.addEventListener('load', () => {
  FastClick.attach(document.body);
}, false);

ReactDOM.render(<App />, document.getElementById('app'));

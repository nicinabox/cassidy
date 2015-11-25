var fs = require('fs');
var postcss = require('postcss');
var css = fs.readFileSync('app/styles/application.css')

postcss([require('autoprefixer'), require('precss')])
  .process(css)
  .then(function(result) {
    fs.writeFileSync('build/application.css', result.css);
    if (result.map) fs.writeFileSync('build/application.css.map', result.map);
  })
  .then(function() {
    console.log('Compiled CSS')
  })

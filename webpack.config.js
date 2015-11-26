var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

module.exports = {
  entry: {
    app: './app'
  },

  output: {
    filename: 'build/[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },

  postcss: function() {
    return [autoprefixer, precss];
  }

};

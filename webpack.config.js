var postcss = require('postcss')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    app: './app'
  },

  output: {
    path: 'build',
    filename: '[name].js'
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
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      'node_modules',
      'node_modules/bootstrap-sass/assets/stylesheets'
    ]
  }
}

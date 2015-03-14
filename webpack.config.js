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
        exclude: ['node_modules', 'bower_components', 'lib'],
        loader: 'jsx-loader?harmony'
      }
    ]
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components'
    ]
  }

};

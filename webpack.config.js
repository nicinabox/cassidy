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
        loader: 'babel'
      }
    ]
  },

  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  }

};

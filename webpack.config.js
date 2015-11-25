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
      }
    ]
  },

  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  }

};

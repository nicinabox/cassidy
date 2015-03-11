module.exports = {
  entry: {
    lib: './lib',
    app: './app'
  },

  output: {
    filename: 'build/bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|bower_components|lib/,
        loader: 'babel-loader'
      }
    ]
  }
};

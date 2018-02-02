// const webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(js)/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  output: {
    filename: 'site.js',
  },
  // plugins: [new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })]
};

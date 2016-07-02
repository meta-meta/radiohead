var path = require('path');
var webpack = require('webpack');

module.exports = Object.assign({}, require('./webpack.config.common'), {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })/*,
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })*/
  ]
});

var
  path = require('path'),
  webpack = require('webpack');

module.exports = {
  entry: {
    app: __dirname + '/app/js/main',
    vendor: [
      'bluebird',
      'd3',
      'history',
      'jquery',
      'lodash',
      'moment',
      'numeral',
      'nvd3',
      'react-addons-update',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js'
  },
  watch: true,
  debug: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      _: 'lodash',
      React: 'react'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],
  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components',
      'app/js/actions',
      'app/js/constants',
      'app/js/utils'
    ],
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: require.resolve('react'),
      loader: 'expose?React'
    }]
  }
};

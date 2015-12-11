var
  path = require('path'),
  webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/js/main',
    vendor: [
      'jquery',
      'lodash',
      'react-addons-update',
      'react-router',
      'react-dom',
      'redux',
      'd3',
      'nvd3'
    ]
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js'
  },
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

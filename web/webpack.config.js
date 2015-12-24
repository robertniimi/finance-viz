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
      'materialize-css/dist/js/materialize',
      'moment',
      'numeral',
      'nvd3',
      'react-addons-update',
      'react-dom',
      'react-redux',
      'react-router',
      'react-select',
      'redux',
      'redux-thunk'
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
      jQuery: 'jquery',
      React: 'react'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],
  resolve: {
    modulesDirectories: [
      'app/js/actions',
      'app/js/components/shared',
      'app/js/constants',
      'app/js/utils',
      'bower_components',
      'node_modules',
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

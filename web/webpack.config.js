var
  path = require('path'),
  webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/js/main',
    vendor: [
      'jquery',
      'lodash',
      'react/addons',
      'react-router',
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
      React: 'react/addons'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', './app/js/utils'],
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
      test: require.resolve('react/addons'),
      loader: 'expose?React'
    }]
  }
};

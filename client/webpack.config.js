// @AngularClass

var webpack = require('webpack');
var helpers = require('./helpers');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
var HMR = helpers.hasProcessFlag('hot');

var metadata = {
  title: 'Implementations of Homomorphic Encryption',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: ENV,
  HMR: HMR
};

var API_ADDRESS = process.env.CLIENT_API_ADDRESS || '0.0.0.0:8000';
var BACKEND_ADDRESS = process.env.CLIENT_BACKEND_ADDRESS || '0.0.0.0:9000';
/*
 * Config
 * with default values at webpack.default.conf
 */
module.exports = {
  // static data for index.html
  metadata: metadata,
  devtool: 'cheap-module-eval-source-map',
  // cache: true,
  debug: true,
  // devtool: 'eval' // for faster builds use 'eval'

  // our angular app
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  // Config for our build files
  output: {
    path: helpers.root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    preLoaders: [
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },
      // TODO(gdi2290): `exclude: [ helpers.root('node_modules/rxjs') ]` fixed with rxjs 5 beta.3 release
      { test: /\.js$/, loader: 'source-map-loader', exclude: [ helpers.root('node_modules/rxjs') ] }
    ],
    loaders: [
      // Support for .ts files.
      { test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [ /\.(spec|e2e)\.ts$/ ] },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json-loader' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw-loader' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw-loader', exclude: [ helpers.root('src/index.html') ] },

      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      // { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(jpg|png)$/,       loader: 'url-loader?name=[path][name].[ext]&limit=100000' },
      { test: /\.woff(\?.*)?$/,     loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?.*)?$/,    loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?.*)?$/,      loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?.*)?$/,      loader: "file-loader?prefix=fonts/&name=[path][name].[ext]" },
      { test: /\.svg(\?.*)?$/,      loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml" },
      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }

    ]
  },

  plugins: [
    new ForkCheckerPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor', 'polyfills'], minChunks: Infinity }),
    // static assets
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html', chunksSortMode: 'none' }),
    // replace
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(metadata.ENV),
      'HMR': HMR,
      'API_ADDRESS': JSON.stringify(API_ADDRESS),
      'BACKEND_ADDRESS': JSON.stringify(BACKEND_ADDRESS)
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],

  // Other module loader config

  // our Webpack Development Server config
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src',
  },
  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  node: {
    global: 'window',
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

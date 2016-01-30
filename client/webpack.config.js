// @AngularClass

/*
 * Helper
 * env(), getBanner(), root(), and rootDir()
 * are defined at the bottom
 */
var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);
var NODE_ENV  = process.env.NODE_ENV || 'development';
var API_URL = process.env.CLIENT_API_URL || '0.0.0.0:8000';
var BACKEND_URL = process.env.CLIENT_BACKEND_URL || '0.0.0.0:9000';
var pkg = require('./package.json');

// Polyfill
Object.assign = require('object-assign');

// Node
var path = require('path');

// NPM
var webpack = require('webpack');

// Webpack Plugins
var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin   = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DefinePlugin   = webpack.DefinePlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
    new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'VERSION': JSON.stringify(pkg.version),
    __API_URL__: JSON.stringify(API_URL),
    __BACKEND_URL__: JSON.stringify(BACKEND_URL)
    }),
    new OccurenceOrderPlugin(),
    new CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js',
    minChunks: Infinity
    }),
    new CommonsChunkPlugin({
    name: 'common',
    filename: 'common.js',
    minChunks: 2,
    chunks: ['app', 'vendor']
    }),
    new HtmlWebpackPlugin({
    title: 'Homomorphic Encryption',
    filename: 'index.html',
    template: 'src/public/prod_index.html',
    inject: 'body',
    chunksSortMode: 'none'
    }),
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    )
];

if (NODE_ENV != 'development') {
  plugins.push(new UglifyJsPlugin({minimize: true}));
}

/*
 * Config
 */
module.exports = {
  devtool: 'source-map',
  debug: true,
  displayErrorDetails: true,
  stats: {
    colors: true,
    reasons: true
  },

  // our Development Server config
  devServer: {
    inline: true,
    colors: true,
    historyApiFallback: true,
    contentBase: 'src/public',
    publicPath: '/__build__'
  },

  //
  entry: {
    'vendor': './src/vendor.ts',
    'app': './src/bootstrap'
  },

  // Config for our build files
  output: {
    path: root('__build__'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html'],
    root: [path.join(__dirname, "bower_components")]
  },

  module: {
    preLoaders: [ { test: /\.ts$/, loader: 'tslint-loader' } ],
    loaders: [
      // Support for *.yml files
      { test: /\.yml$/, loader: 'yaml' },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw' },

      // Support for .ts files.
      { 
        test: /\.ts$/,    
        loader: 'ts',
        query: { 'ignoreDiagnostics': [2403, 2300, 2374, 2375 ] },// 2403 -> Subsequent variable declarations
        exclude: [
          /\.spec\.ts$/,
          /\.e2e\.ts$/,
          /node_modules\/(?!(ng2-bootstrap))/ // exclude all node modules except ng2-bootstrap
        ]
      },
      // Loader for fonts (required for Bootstrap)
      { test: /\.woff2?($|\?)/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf($|\?)/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot($|\?)/,    loader: "file" },
      { test: /\.svg($|\?)/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ],
    noParse: [
      // /reflect-metadata/
    ]
  },

  plugins: plugins

  /*
   * When using `templateUrl` and `styleUrls` please use `__filename`
   * rather than `module.id` for `moduleId` in `@View`
   */
  // node: {
    // crypto: false,
    // __filename: true
  // }
};

// Helper functions

function env(configEnv) {
  if (configEnv === undefined) { return configEnv; }
  switch (toString(configEnv[NODE_ENV])) {
    case '[object Object]'    : return Object.assign({}, configEnv.all || {}, configEnv[NODE_ENV]);
    case '[object Array]'     : return [].concat(configEnv.all || [], configEnv[NODE_ENV]);
    case '[object Undefined]' : return configEnv.all;
    default                   : return configEnv[NODE_ENV];
  }
}

function getBanner() {
  return 'Angular2 Webpack Starter v'+ pkg.version +' by @gdi2990 from @AngularClass';
}

function root(args) {
  args = sliceArgs(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = sliceArgs(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}

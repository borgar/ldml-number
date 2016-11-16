// var mod = require('./package.json');
const path = require( 'path' );
const webpack = require( 'webpack' );

const env = process.env.WEBPACK_ENV;
const plugins = [];
let ext = '.js';

if ( env === 'min' ) {
  const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
  plugins.push( new UglifyJsPlugin({ 'minimize': true }) );
  ext = '.min.js';
}

module.exports = {
  'entry': path.resolve( './index.js' ),
  'devtool': 'source-map',
  'output': {
    'path': path.resolve( './lib' ),
    'filename': 'ldmlnum' + ext,
    'library': 'ldmlnum',
    'libraryTarget': 'umd',
    'umdNamedDefine': true
  },
  'plugins': plugins,
  'module': {
    'loaders': [
      {
        'test': /\.js$/,
        'loader': 'babel',
        'exclude': /(node_modules|bower_components)/,
        'query': {
          'presets': ['es2015'],
          'plugins': ['babel-plugin-add-module-exports']
        }
      },
      {
        'test': /\.js$/,
        'loader': 'eslint-loader',
        'exclude': /node_modules/
      }
    ]
  },
  'resolve': {
    'root': path.resolve( './src' ),
    'extensions': [ '', '.js' ]
  }
};

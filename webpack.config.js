const path = require( 'path' );
const webpack = require( 'webpack' );

const plugins = [];
let ext = '';

if ( process.env.WEBPACK_ENV === 'min' ) {
  const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
  plugins.push( new UglifyJsPlugin({ 'minimize': true }) );
  ext = '.min';
}

module.exports = {
  'entry': path.resolve( './index.js' ),
  'devtool': 'source-map',
  'output': {
    'path': path.resolve( './lib' ),
    'filename': 'ldmlnum' + ext + '.js',
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
      }
    ]
  },
  'resolve': {
    'root': path.resolve( './src' ),
    'extensions': [ '', '.js' ]
  }
};

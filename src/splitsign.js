const roundhalfeven = require( './roundhalfeven' );
const padright = require( './padright' );

module.exports = function ( n, min, max, pad ) {
  const inf = ( max === Infinity );
  const d = ( inf ) ? 0 : Math.ceil( n ? Math.log( n < 0 ? -n : n ) / Math.LN10 : 1 );
  const adj = ( inf ) ? Math.abs( n ) : roundhalfeven( Math.abs( n ), Math.floor( max - Math.floor( d ) ) );
  const v = Math.floor( adj );
  const i = String( v );
  const f = String( adj ).split( '.' )[ 1 ] || '';
  const w = adj ? ( v && i.length ) + f.length + ( d < 0 ? d : 0 ) : 1;
  return [ i, f + padright( '', min - w, pad ) ];
};

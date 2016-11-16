const padright = require( './padright' );

module.exports = function ( n, min, max, pad ) {
  if ( !n && !min ) { return ''; }
  const i = String( n );
  if ( i.length > max ) {
    // For example, 1997 is formatted as "97" if the maximum integer digits is set to 2.
    return i.slice( i.length - max );
  }
  return padright( '', min - i.length, pad ) + i;
};

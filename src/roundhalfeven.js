const EPSILON = 1e-12;

module.exports = function roundhalfeven ( value, places ) {
  if ( value < 0 ) {
    return -roundhalfeven( -value, places );
  }
  if ( places ) {
    const p = Math.pow( 10, places || 0 ) || 1;
    return roundhalfeven( value * p, 0 ) / p;
  }
  const ipart = Math.floor( value );
  const dist = ( value - ( ipart + 0.5 ) );
  if ( dist > -EPSILON && dist < EPSILON ) {
    return ( ipart % 2 < EPSILON ) ? ipart : Math.ceil( ipart + 0.5 );
  }
  return Math.round( value );
};

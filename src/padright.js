module.exports = function ( s, l, p = '0' ) {
  while ( s.length < l ) { s += p; }
  return s;
};

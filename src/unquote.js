module.exports = function unquote ( s ) {
  return s && s.replace( /'([^']+)'/g, '$1' ).replace( /''/g, "'" );
};

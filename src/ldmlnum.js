const formatInt = require( './formatint' );
const makelocale = require( './locale' );
const roundhalfeven = require( './roundhalfeven' );
const splitSign = require( './splitsign' );
const unquote = require( './unquote' );
const padright = require( './padright' );

const reSubpatt = /^((?:'[^']*'|[^';]+)*)(?:;(.*))?$/;
const reChunker = /^((?:'[^']*'|[^0-9@#.,])*)([0-9@#.,E+]+)(.*)$/;
const reNumbits = /^([^E.]*)(?:\.([^E]*))?(?:E(\+?)(.*))?$/;

const e5h = makelocale();

function numfmt ( pattern, locale = 'en' ) {
  // resolve default pattern for locale if no pattern was provided
  if ( !pattern ) {
    pattern = '#,##0.###;-#,##0.###';
  }

  // localizable things
  // be liberal accepting - and _
  const [ lang, subLang ] = locale.split( /[_-]/ );
  const l10n = numfmt.locale[ locale ] ||
               numfmt.locale[ `${ lang }-${ subLang }` ] ||
               numfmt.locale[ `${ lang }_${ subLang }` ] ||
               numfmt.locale[ lang ] || {};
  const cGroup = l10n.thousands_separator || e5h.thousands_separator;
  const cDecimal = l10n.decimal_separator || e5h.decimal_separator;
  const cPlus = l10n.positive_sign || e5h.positive_sign;
  const cMinus = l10n.negative_sign || e5h.negative_sign;
  const cExp = l10n.exponent_symbol || e5h.exponent_symbol;
  const cInf = l10n.infinity_symbol || e5h.infinity_symbol;
  const cNaN = l10n.nan_symbol || e5h.nan_symbol;

  const p = function ( n ) {
    const isNeg = ( n < 0 ) * 1;
    let f = '';
    let i = '';
    let v;
    let e;

    n *= p.scale;

    // == normal formatting ==
    if ( !isFinite( n ) ) {
      i = isNaN( n ) ? cNaN : cInf;
    }
    else if ( p.exponent ) {
      v = Math.abs( n );
      e = ( v ) ? Math.floor( Math.log( v ) / Math.LN10 ) : 0;

      if ( p.int_min === p.int_max ) {
        // Minimum number of integer digits
        e -= ( p.int_min - 1 );
      }
      else if ( p.int_max && isFinite( p.int_max ) ) {
        // Exponent grouping
        e = Math.floor( e / p.int_max ) * p.int_max;
      }

      v = ( e < 0 ) ? v * Math.pow( 10, -e ) : v / Math.pow( 10, e );
      [i, f] = splitSign( v, p.frac_min + p.int_min, p.frac_max + p.int_max, p.pad );

      return p.prefix[0] +
            ( isNeg ? cMinus : '' ) +
            ( i + ( f ? cDecimal + f : '' ) ) +
            cExp +
            ( ( e < 0 ) ? cMinus : ( p.exp_plus ) ? cPlus : '' ) +
            formatInt( Math.abs( e ), p.exp_min, Infinity, p.pad ) +
            p.suffix[0];
    }
    else if ( p.significance ) {
      [i, f] = splitSign( n, p.sig_min, p.sig_max, p.pad );
    }
    else {
      if ( p.frac_min === p.frac_max && !p.frac_min ) {
        v = Math.round( Math.abs( n ) );
      }
      else {
        v = Math.floor( Math.abs( n ) );
      }

      if ( p.int_max !== Infinity ) {
        // is is possible to add a max digits to non-sci patterns?
        // we should parse this as infinite and allow user to set int_max
      }
      i = formatInt( v, p.int_min, Infinity, p.pad );

      if ( n % 1 ) {
        // have fraction
        f = padright( String( numfmt.round( n, p.frac_max ) ).split( '.' )[ 1 ] || '', p.frac_min, p.pad );
      }
      else {
        // no fraction -- just add some zeros
        f = padright( f, p.frac_min, '0' );
      }
    }

    if ( isFinite( n ) && p.grouping ) {
      let ret = '';
      let ipos = i.length;
      const gsize = p.group_sec;

      if ( ipos > p.group_pri ) {
        ret = cGroup + i.substr( ipos -= p.group_pri, p.group_pri ) + ret;
      }
      while ( ipos > gsize ) {
        ret = cGroup + i.substr( ipos -= gsize, gsize ) + ret;
      }
      i = ipos ? i.substr( 0, ipos ) + ret : ret;
    }

    return p.prefix[ isNeg ] + i + ( f ? cDecimal + f : '' ) + p.suffix[ isNeg ];
  };

  const s = reSubpatt.exec( pattern );
  const posBits = reChunker.exec( s[1] );
  const number = posBits[2] || '';
  const negBits = s[2] ? reChunker.exec( s[2] ) : null;
  const numBits = reNumbits.exec( number );
  const integer = numBits[1] || '';
  const fraction = numBits[2] || '';

  p.pattern = pattern;

  p.significance = number.indexOf( '@' ) >= 0;
  p.exponent = number.indexOf( 'E' ) >= 0;

  p.grouping = number.indexOf( ',' ) >= 0;

  p.exp_plus = !!numBits[3];  // show exponent positive mark


  if ( /\d(?=.*#)/.test( integer ) ) {
    throw new Error( `Nonsensical number pattern: ${ integer }` );
  }
  if ( /#(?=.*\d)/.test( fraction ) ) {
    throw new Error( `Nonsensical number pattern: ${ fraction }` );
  }
  if ( p.exponent && p.grouping ) {
    // "Exponential patterns may not contain grouping separators"
    throw new Error( 'Exponential patterns must not contain ","' );
  }
  if ( p.significance && number.indexOf( '.' ) >= 0 ) {
    // "If a pattern uses significant digits, it may not contain a decimal separator [...]"
    throw new Error( `Significant digit patterns must not contain ".": ${ pattern }` );
  }
  if ( p.significance && integer.indexOf( '0' ) >= 0 ) {
    // "If a pattern uses significant digits, it may not contain [...] the '0' pattern character."
    throw new Error( `Significant digit patterns must not contain "0": ${ pattern }` );
  }

  // parse min/max digit counts
  p.int_max = ( !p.exponent && !p.significance ) ? Infinity : integer.replace( /[,]/g, '' ).length;
  p.int_min = ( integer.length < 1 ) ? 0 : integer.replace( /[,#]/g, '' ).length || 1;
  p.frac_max = fraction.replace( /[,]/g, '' ).length;
  p.frac_min = fraction.replace( /[,#]/g, '' ).length;

  p.prefix = [
    unquote( posBits[1] ),
    unquote( negBits ? negBits[1] : '-' + posBits[1] )
  ];
  p.suffix = [
    unquote( posBits[3] ),
    unquote( negBits ? negBits[3] : posBits[3] )
  ];

  p.pad = '0';
  const clean = pattern.replace( /'([^']*)'/g, '' );
  p.scale = /%/.test( clean ) ? 100 : 1;

  if ( p.significance ) {
    const sigBits = /(@+)([^.E]*)/.exec( number );
    p.sig_min = sigBits[1].length;
    p.sig_max = p.sig_min + sigBits[2].length;
  }
  else {
    p.sig_min = 1;
    p.sig_max = Infinity;
  }

  if ( p.grouping ) {
    const s = ( integer || '' ).split( ',' );
    const sl = s.length;
    if ( sl === 2 ) {
      p.group_pri = p.group_sec = s[1].length;
    }
    else if ( sl > 2 ) {
      p.group_pri = s[ sl - 1 ].length;
      p.group_sec = s[ sl - 2 ].length;
    }
  }
  else {
    p.group_pri = 0;
    p.group_sec = 0;
  }

  if ( p.exponent ) {
    // The number of digit characters after the exponent character gives the
    // minimum exponent digit count. There is no maximum.
    p.exp_min = numBits[4].length;
    if ( p.significance ) {
      p.int_min = p.int_max = 1;
      p.frac_min = p.sig_min;
      p.frac_max = p.sig_max;
    }
  }

  return p;
}

// export the interface
numfmt.round = roundhalfeven;
numfmt.locale = makelocale;
numfmt.locale.en = makelocale();
numfmt.locale.is = makelocale( '.', ',' );
numfmt.locale.sv = makelocale( '.', ',' );

module.exports = numfmt;

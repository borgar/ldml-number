const tape = require( 'tape' );
const numfmt = require( '../' );


function format ( num, str, locale ) {
  if ( arguments.length === 2 ) {
    locale = str;
    str = '';
  }
  return numfmt( str, locale )( num );
}


tape( 'basic funtionality', t => {
  const f = numfmt();
  t.equal( typeof numfmt, 'function', 'is a function' );
  t.equal( typeof f, 'function', 'returns a function' );

  t.equal( typeof numfmt.round, 'function', 'has a round function' );
  t.equal( numfmt.round( 1.5 ), 2, 'round function works' );

  t.equal( typeof numfmt.locale, 'function', 'has a locale function' );
  const dummyLocale = { thousands_separator: 'a', decimal_separator: 'b',
                        positive_sign: 'c', negative_sign: 'd',
                        exponent_symbol: 'e', infinity_symbol: 'f',
                        nan_symbol: 'g' };
  t.deepEqual( numfmt.locale( 'a', 'b', 'c', 'd', 'e', 'f', 'g' ), dummyLocale, 'locale function works' );
  t.equal( typeof numfmt.locale.en, 'object', 'english defaults are there' );

  t.equal( f( 1 ), '1', 'calling a formatter works' );
  t.end();
});


tape( 'invalid patterns', t => {
  function compile ( patt ) {
    return function () { numfmt( patt ); };
  }
  t.throws( compile( '@@##.#' ), '@@##.#' );
  t.throws( compile( '@@##0' ), '@@##0' );
  t.equal( typeof compile( '@@##5' ), 'function', '@@##5' );
  t.throws( compile( '@@#50' ), '@@#50' );
  t.throws( compile( '@00' ), '@00' );
  t.throws( compile( '@.###' ), '@.###' );
  t.throws( compile( '#,##0E0' ), '@.###' );
  t.throws( compile( '0#' ), '0#' );
  t.throws( compile( '.#0' ), '.#0' );
  t.throws( compile( '.@' ), '.@' );
  t.end();
});

// "escaped ;"
// ';#,##0.##;';(#)

tape( 'l10n', t => {
  numfmt.locale.xx = numfmt.locale( ' ', '.' );
  numfmt.locale.xx_XX = numfmt.locale( '~', '/' );

  t.equal( format( 1234.567, '#,##0.0#;-#,##0.0#', 'xx' ), '1 234.57', 'xx locale' );
  t.equal( format( 1234.567, '#,##0.0#;-#,##0.0#', 'xx_XX' ), '1~234/57', 'xx locale' );
  t.equal( format( 1234.567, '#,##0.0#;-#,##0.0#', 'xx_YY' ), '1 234.57', 'xx locale' );

  t.end();
});


tape( 'more', t => {
  // t.equal( format(1234.567, '#,##0.##', 'en_US'), '1 234,57' );
  // t.equal( format(1234.567, '#,##0.###', 'en_US'), '1 234,567' );
  // t.equal( format(1234.567, '###0.#####', 'en_US'), '1234,567' );
  // t.equal( format(1234.567, '###0.0000#', 'en_US'), '1234,5670' );
  // t.equal( format(1234.567, '00000.0000', 'en_US'), '01234,5670' );
  // t.equal( format(1234.567, '#,##0.00 ¤', 'sv'), '1 234,57 €' ); // EUR
  // t.equal( format(1234.567, '#,##0.00 ¤', 'sv'), '1 234,57 ¥' ); // JPY

  // should yield the same result
  t.equal( format( 1234.567, '#,##0.0#;(#)', 'en_US' ), '1,234.57', '#,##0.0#;(#)' );
  t.equal( format( -1234.567, '#,##0.0#;(#)', 'en_US' ), '(1,234.57)', '#,##0.0#;(#)' );
  t.equal( format( 1234.567, '#,##0.0#;(#,##0.0#)', 'en_US' ), '1,234.57', '#,##0.0#;(#,##0.0#)' );
  t.equal( format( -1234.567, '#,##0.0#;(#,##0.0#)', 'en_US' ), '(1,234.57)', '#,##0.0#;(#,##0.0#)' );

  // padding
  // equal( format(1997, '00', 'en_US'), '97' ,'00' ); // how does "maximum integer digits" work ??
  t.equal( format( 1997, '00000', 'en_US' ), '01997', '00000' );

  // Make sure that 10 chars min get grouped: 12 + "00,000" = 00,012
  // 0.###E0" formats the number 1234 as "1.234E3"
  t.end();
});


tape( 'parsed attributes', t => {
  function examine ( patt, res, title ) {
    const f = numfmt( patt, 'en_US' );
    t.deepEqual( [ f.int_max, f.int_min, f.frac_max, f.frac_min ], res, patt || title );
  }

  examine( '', [ Infinity, 1, 3, 0 ], 'default pattern' );
  examine( '0.00E0', [ 1, 1, 2, 2 ] );
  examine( '#,##0.0#', [ Infinity, 1, 2, 1 ] );
  examine( '#.', [ Infinity, 1, 0, 0 ] );
  examine( '#.#', [ Infinity, 1, 1, 0 ] );
  examine( '#0000000000000,00000.###', [ Infinity, 18, 3, 0 ] );
  examine( '0E0', [ 1, 1, 0, 0 ] );
  examine( '0.###E0', [ 1, 1, 3, 0 ] );
  examine( '.00', [ Infinity, 0, 2, 2 ] );

  // "#,#@#" indicates a minimum of one significant digits, a maximum of two significant digits, and a grouping size of three.
  t.end();
});

tape( 'ported', t => {
  t.equal( format( -1234.56, '0.##;-0.##', 'en_US' ), '-1234.56', '0.##;-0.##' );
  t.equal( format( 1234.56, '0.##;-0.##', 'en_US' ), '1234.56', '0.##;-0.##' );
  t.equal( format( -1234.56, '0.#', 'en_US' ), '-1234.6', '0.#' );
  t.equal( format( 1234.56, '0.#', 'en_US' ), '1234.6', '0.#' );
  t.equal( format( -1234.56, '#,##0.##;-#', 'en_US' ), '-1,234.56', '#,##0.##;-#' );
  t.equal( format( 1234.56, '#,##0.##;-#', 'en_US' ), '1,234.56', '#,##0.##;-#' );
  t.equal( format( 80, '#,##0.###', 'en_US' ), '80', '#,##0.###' );
  t.equal( format( -1234.56, '00,000.000;-00,000.000', 'en_US' ), '-01,234.560', '00,000.000;-00,000.000' );
  t.equal( format( 1234.56, '00,000.000;-00,000.000', 'en_US' ), '01,234.560', '00,000.000;-00,000.000' );

  // var f = numfmt( "##,###,####.", 'en_US' );
  // f.force_decimalpoint = true;  // setDecimalSeparatorAlwaysShown
  // t.equal(f(-1234.56), "-1235.");
  // t.equal(f(1234.56), "1235.");
  // t.equal(f(-1234567.890), "-123,4568.");

  t.equal( format( -1234567.890, '#,###,###', 'en_US' ), '-1,234,568', '#,###,###' );

  t.equal( format( -1234.56, '0', 'en_US' ), '-1235', '0' );
  t.equal( format( 1234.56, '0', 'en_US' ), '1235', '0' );

  t.equal( format( 0, '#', 'en_US' ), '0', '#' );

  t.equal( format( -1234.56, '###0.#;(###0.#)', 'en_US' ), '(1234.6)', '###0.#;(###0.#)' );
  t.equal( format( 1234.56, '###0.#;(###0.#)', 'en_US' ), '1234.6', '###0.#;(###0.#)' );

  t.equal( format( -1234.56, '###0.#;###0.#-', 'en_US' ), '1234.6-', '###0.#;###0.#-' );
  t.equal( format( 1234.56, '###0.#;###0.#-', 'en_US' ), '1234.6', '###0.#;###0.#-' );

  t.equal( format( -1234.56, '#,##0%;-#,##0%', 'en_US' ), '-123,456%', '#,##0%;-#,##0%' );
  t.equal( format( 1234.56, '#,##0%;-#,##0%', 'en_US' ), '123,456%', '#,##0%;-#,##0%' );

  t.equal( format( 0.2, '#.#', 'en_US' ), '0.2', '#.#' );
  t.equal( format( -1234.567, '000000', 'en_US' ), '-001235', '000000' );
  t.equal( format( -1234.567, '##', 'en_US' ), '-1235', '##' );
  t.equal( format( 0, '##', 'en_US' ), '0', '##' );
  t.equal( format( 0, '##00', 'en_US' ), '00', '##00' );
  t.equal( format( -0.567, '.00', 'en_US' ), '-.57', '.00' );
  t.equal( format( -0.567, '#.00', 'en_US' ), '-0.57', '#.00' );
  t.equal( format( -0.567, '0.00', 'en_US' ), '-0.57', '0.00' );
  t.equal( format( -1234.567, '.######', 'en_US' ), '-1234.567', '.######' );
  t.equal( format( -1234.567, '#.000000', 'en_US' ), '-1234.567000', '#.000000' );

  // t.equal( format(10000000.1234d, "#,##0%", 'en_US'), "1,000,000,012%" ,"#,##0%" );

  // t.equal( format(10000, "\u00A4#,##0.00;(\u00A4#,##0.00)", 'en_US'), "$10,000.00" ,"\u00A4#,##0.00;(\u00A4#,##0.00)" );
  t.equal( format( 10000, '$#,##0.00;($#,##0.00)', 'en_US' ), '$10,000.00', '$#,##0.00;($#,##0.00)' );

  t.end();
});

tape( 'quoting', t => {
  t.equal( format( 123, "'#'#", 'en_US' ), '#123', "'#'#" );
  t.equal( format( 3, "# o''clock", 'en_US' ), "3 o'clock", "# o''clock" );
  t.equal( format( 30, "'#'#.#", 'en_US' ), '#30', "'#'#.#" );
  t.equal( format( -1234.567, "'#'#", 'en_US' ), '-#1235', "'#'#" );
  t.equal( format( -1234.567, "'abc'#", 'en_US' ), '-abc1235', "'abc'#" );
  t.equal( format( -1234.567, "'positive'#;'negative' -#", 'en_US' ), 'negative -1235', "'positive'#;'negative' -#" );
  t.equal( format( 1234.567, "'positive'#;'negative' -#", 'en_US' ), 'positive1235', "'positive'#;'negative' -#" );
  t.equal( format( -1234.567, "# 'is positive';-# 'is negative'", 'en_US' ), '-1235 is negative', "# 'is positive';-# 'is negative'" );
  t.equal( format( 1234.567, "# 'is positive';-# 'is negative'", 'en_US' ), '1235 is positive', "# 'is positive';-# 'is negative'" );

  t.end();
});


tape( 'multiple grouping separators', t => {
  // The pattern "#,##,##0", and the number 123456789 is formatted as "12,34,56,789"
  t.equal( format( 123456789, '#,##,##0', 'en_US' ), '12,34,56,789', '#,##,##0' );
  // for multiple grouping separators, use only the interval between the last two
  t.equal( format( 123456789, '#,##,###,###0', 'en_US' ), '12,345,6789', '#,##,###,###0' );
  t.equal( format( 123456789, '###,###,###0', 'en_US' ), '12,345,6789', '###,###,###0' );
  t.equal( format( 123456789, '##,#,###,###0', 'en_US' ), '12,345,6789', '##,#,###,###0' );
  // leading hash
  t.equal( format( 98621786.6711, '#,###.###', 'en' ), '98,621,786.671', '#,###.###' );
  t.end();
});


tape( 'non-finite numbers', t => {
  t.equal( format( NaN, '#,##0.##', 'en_US' ), '☹', '#,##0.##' );
  t.equal( format( Infinity, '#,##0.##', 'en_US' ), '∞', '#,##0.##' );
  t.equal( format( -Infinity, '#,##0.##', 'en_US' ), '-∞', '#,##0.##' );
  t.equal( format( -Infinity, '#,##0.##;(#)', 'en_US' ), '(∞)', '#,##0.##;(#)' );
  t.end();
});


tape( 'patterns', t => {
  t.equal( format( 12345, '##0', 'en_US' ), '12345', '##0' );
  t.equal( format( 6.5, '0.00', 'sv' ), '6,50', '0.00' );
  t.equal( format( Math.pow( 10, 20 ), '#.00', 'en_US' ), '100000000000000000000.00', '#.00' );
  t.end();
});


tape( 'subpatterns', t => {
  t.equal( format( -12345, '#,##0.##;-#', 'en_US' ), '-12,345', '#,##0.##;-#' );
  t.equal( format( -12345, '#,##0.##;(#)', 'en_US' ), '(12,345)', '#,##0.##;(#)' );
  t.end();
});


tape( 'default rounding', t => {
  t.equal( format( 5.5, '0', 'sv' ), '6', '0' );
  t.equal( format( -5.5, '0', 'sv' ), '-6', '0' );
  t.equal( format( 6.5, '0', 'sv' ), '7', '0' );
  t.equal( format( -6.5, '0', 'sv' ), '-7', '0' );
  t.equal( format( 1.2325, 'sv' ), '1,232', '' );
  t.equal( format( -1.2325, 'sv' ), '-1,232', '' );
  t.equal( format( 1.2335, 'sv' ), '1,234', '' );
  t.equal( format( -1.2335, 'sv' ), '-1,234', '' );
  t.end();
});


tape( 'significant digits', t => {
  t.equal( format( 123004, '@@', 'en_US' ), '120000', '@@' );
  t.equal( format( -123004, '@@', 'en_US' ), '-120000', '@@' );
  t.equal( format( 1.12, '@', 'sv' ), '1', '@' );
  t.equal( format( 1.1, '@@', 'sv' ), '1,1', '@@' );
  t.equal( format( 1.1, '@@@@@##', 'sv' ), '1,1000', '@@@@@##' );
  t.equal( format( 0.0001, '@@@', 'sv' ), '0,000100', '@@@' );
  t.equal( format( 0.0001234, '@@@', 'sv' ), '0,000123', '@@@' );
  t.equal( format( 0.0001234, '@@@#', 'sv' ), '0,0001234', '@@@#' );
  t.equal( format( 0.0001234, '@@@#', 'sv' ), '0,0001234', '@@@#' );
  t.equal( format( 0.001234, '@@@#', 'sv' ), '0,001234', '@@@#' );
  t.equal( format( 0.01234, '@@@#', 'sv' ), '0,01234', '@@@#' );
  t.equal( format( 12345, '@@@', 'sv' ), '12300', '@@@' );
  t.equal( format( 0.12345, '@@@', 'sv' ), '0,123', '@@@' );
  t.equal( format( 3.14159, '@@##', 'sv' ), '3,142', '@@##' );
  t.equal( format( 1.23004, '@@##', 'sv' ), '1,23', '@@##' );
  t.equal( format( 1230.04, '@@,@@', 'en_US' ), '12,30', '@@,@@' );
  t.equal( format( 123.41, '@@##', 'en_US' ), '123.4', '@@##' );
  t.equal( format( 1, '@@', 'en_US' ), '1.0', '@@' );
  t.equal( format( 0, '@', 'en_US' ), '0', '@' );
  t.equal( format( 0.1, '@', 'en_US' ), '0.1', '@' );
  t.equal( format( 0.1, '@#', 'en_US' ), '0.1', '@#' );
  t.equal( format( 0.1, '@@', 'en_US' ), '0.10', '@@' );
  t.end();
});


tape( 'scientific notation', t => {
  // from Babel
  t.equal( format( 0.1, '#E0', 'en_US' ), '1E-1', '#E0' );
  t.equal( format( 0.01, '#E0', 'en_US' ), '1E-2', '#E0' );
  t.equal( format( 10, '#E0', 'en_US' ), '1E1', '#E0' );
  t.equal( format( 1234, '0.###E0', 'en_US' ), '1.234E3', '0.###E0' );
  t.equal( format( 1234, '0.#E0', 'en_US' ), '1.2E3', '0.#E0' );
  // Exponent grouping
  t.equal( format( 12345, '##0.####E0', 'en_US' ), '12.345E3', '##0.####E0' );
  // Minimum number of int digits
  t.equal( format( 12345, '00.###E0', 'en_US' ), '12.345E3', '00.###E0' );
  t.equal( format( -12345.6, '00.###E0', 'en_US' ), '-12.346E3', '00.###E0' );
  t.equal( format( -0.01234, '00.###E0', 'en_US' ), '-12.34E-3', '00.###E0' );
  // Custom pattern suffic
  t.equal( format( 123.45, '#.##E0 m/s', 'en_US' ), '1.23E2 m/s', '#.##E0 m/s' );
  // Exponent patterns
  t.equal( format( 123.45, '#.##E00 m/s', 'en_US' ), '1.23E02 m/s', '#.##E00 m/s' );
  t.equal( format( 0.012345, '#.##E00 m/s', 'en_US' ), '1.23E-02 m/s', '#.##E00 m/s' );
  t.equal( format( 12345, '#.##E+00 m/s', 'en_US' ), '1.23E+04 m/s', '#.##E+00 m/s' );
  // 0 (see ticket #99)
  t.equal( format( 0, '#E0', 'en_US' ), '0E0', '#E0' );

  // from Mauve
  t.equal( format( 200000, '0.0000E0', 'en_US' ), '2.0000E5', '0.0000E0' );
  t.equal( format( 200000, '00.00E00', 'en_US' ), '20.00E04', '00.00E00' );
  // t.equal( format(12345, "##0.####E0", 'en_US'), "12.345E3" ,"##0.####E0" );
  t.equal( format( 12345, '##.###E0', 'en_US' ), '1.2345E4', '##.###E0' );
  t.equal( format( 12346, '##.###E0', 'en_US' ), '1.2346E4', '##.###E0' );
  t.equal( format( 12345, '00.###E0', 'en_US' ), '12.345E3', '00.###E0' );
  t.equal( format( 1234, '00.###E0', 'en_US' ), '12.34E2', '00.###E0' );
  t.equal( format( 0.00123, '00.###E0', 'en_US' ), '12.3E-4', '00.###E0' );
  t.equal( format( -1234.567, '0E0', 'en_US' ), '-1E3', '0E0' );
  t.equal( format( -1234.567, '00E00', 'en_US' ), '-12E02', '00E00' );
  t.equal( format( -1234.567, '000E00', 'en_US' ), '-123E01', '000E00' );
  t.equal( format( -1234.567, '0000000000E0', 'en_US' ), '-1234567000E-6', '0000000000E0' );
  t.equal( format( -1234.567, '0.0E0', 'en_US' ), '-1.2E3', '0.0E0' );
  t.equal( format( -1234.567, '00.00E0', 'en_US' ), '-12.35E2', '00.00E0' );
  t.equal( format( -0.1234567, '00.00E0', 'en_US' ), '-12.35E-2', '00.00E0' );

  // this is missing more tests for significance in exponential notation: "@@E0"
  t.equal( format( 12345, '0.0###E0', 'en_US' ), '1.2345E4', '0.0###E0' );
  t.equal( format( 12345, '@@###E0', 'en_US' ), '1.2345E4', '@@###E0' );

  t.end();
});

// FIXME: missing tests for % parameter


// "?" is equivalent to "#" except a space is left instead of blank
// when no number is written. So 123.45 using "##0.???" would output
// the string "123.45 ". This is as used by Microsoft Excel.


// 1000 formatted with "###0 ^^" would output "1 k".
/*
tape( 'SI prefix', t => {

  t.equal( format(999, "###0.## ^^", 'en_US'),  "999", "999" );
  t.equal( format(1000, "###0.## ^^", 'en_US'),  "1000", "1000" );
  t.equal( format(1001, "###0.## ^^", 'en_US'),  "1 k", "1 k" );
  t.equal( format(1234, "###0.## ^^", 'en_US'),  "1.23 k", "1.23 k" );
  t.equal( format(1500, "###0.## ^^", 'en_US'),  "1.5 k", "1.5 k" );
  t.equal( format(1234567, "###0.## ^^", 'en_US'),  "1.23 M", "1.23 M" );
  t.equal( format(1234567000, "###0.## ^^", 'en_US'),  "1.23 G", "1.23 G" );
  t.equal( format(1234567000000, "###0.## ^^", 'en_US'),  "1.23 T", "1.23 T" );
  t.equal( format(10000000000000000000, "###0.## ^^", 'en_US'), "10 E", "10 E" );
  t.equal( format(0.000000001, "###0.## ^^", 'en_US'), "1 n", "1 n" );
  t.equal( format(0.000001, "###0.## ^^", 'en_US'), "1 μ", "1 μ" );
  t.equal( format(0.001, "###0.## ^^", 'en_US'), "1 m", "1 m" );

  t.end();
});
*/

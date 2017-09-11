function locale ( grp = ',', dec = '.', pos = '+', neg = '-', exp = 'E', inf = '∞', nan = '☹' ) {
  return {
    thousands_separator: grp,
    decimal_separator: dec,
    positive_sign: pos,
    negative_sign: neg,
    exponent_symbol: exp,
    infinity_symbol: inf,
    nan_symbol: nan
  };
};

// instanciate all locales that are languages or are territorial dialects
// that differentiate from the language itself ('es-AR' formats are the
// same as 'es' and thus omitted because the formatter will fallback to
// 'es').
[ 'ar-DZ', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-MR', 'ar-TN', 'az', 'bs',
  'ca', 'da', 'de', 'en-150', 'en-AT', 'en-BE', 'en-CH', 'en-DE',
  'en-DK', 'en-NL', 'es', 'eu', 'fo', 'fr-LU', 'fr-MA', 'gl',
  'hr', 'id', 'is', 'it', 'km', 'lo', 'mk', 'ms-BN',
  'nl', 'pt', 'ro', 'sr', 'sw-CD', 'tr', 'vi' ]
  .forEach( d => { locale[d] = locale( '.', ',', '+', '-', 'E' ); });

[ 'el', 'en-SI', 'sl' ]
  .forEach( d => { locale[d] = locale( '.', ',', '+', '-', 'e' ); });

[ 'af', 'be', 'bg', 'cs', 'de-AT', 'en-FI', 'en-ZA', 'es-CR',
  'fi', 'fr', 'fr-CA', 'hu', 'hy', 'ka', 'kk', 'ky',
  'lv', 'no', 'no', 'pl', 'pt-AO', 'pt-CH', 'pt-CV', 'pt-GQ',
  'pt-GW', 'pt-LU', 'pt-MO', 'pt-MZ', 'pt-PT', 'pt-ST', 'pt-TL', 'ru',
  'sq', 'uz' ]
  .forEach( d => { locale[d] = locale( ' ', ',', '+', '-', 'E' ); });

locale.sk = locale( ' ', ',', '+', '-', 'e' );

[ 'en-SE', 'et', 'lt', 'sv' ]
  .forEach( d => { locale[d] = locale( ' ', ',', '+', '-', '×10^' ); });

locale.uk = locale( ' ', ',', '+', '-', 'Е' );

[ 'am', 'ar', 'bn', 'cy', 'en', 'en-CA', 'en-GB', 'en-US',
  'es-419', 'es-BR', 'es-BZ', 'es-CU', 'es-DO', 'es-GT', 'es-HN', 'es-MX',
  'es-NI', 'es-PA', 'es-PE', 'es-PR', 'es-SV', 'es-US', 'fa', 'fil',
  'ga', 'gu', 'he', 'hi', 'ja', 'kn', 'ko', 'ml',
  'mn', 'mr', 'ms', 'my', 'ne', 'pa', 'si', 'sw',
  'ta', 'te', 'th', 'to', 'ur', 'yue', 'zh', 'zu' ]
  .forEach( d => { locale[d] = locale( ',', '.', '+', '-', 'E' ); });

locale['en-AU'] = locale( ',', '.', '+', '-', 'e' );

[ 'de-CH', 'de-LI', 'it-CH' ]
  .forEach( d => { locale[d] = locale( '’', '.', '+', '-', 'E' ); });

module.exports = locale;

# LDML number formatter

This is a number formatter that uses the Unicode [LDML number syntax](http://unicode.org/reports/tr35/tr35-numbers.html#Number_Pattern_Character_Definitions) to specify the output.


## Installing

It's available on [npm](npmjs.org/package/ldml-number):

    npm i --save ldml-number

Alternatively there are web-compatible builds under `lib/` which you can include in your page directly.

## Using

The whole module is a function which returns a reusable number formatting function:

    const ldmlnum = require('ldml-number');
    const format = ldmlnum('###0.#;(###0.#)');

    format(-1234.56) // "(1234.6)"

The web-builds expose the module in the global namespace as `ldmlnum`.

### Localization

You can prefer a locale as a [BCP-47 tag](https://tools.ietf.org/html/bcp47) when a formatter is created:

    const ldmlnum = require('ldml-number');
    const format_en = ldmlnum('#,##0.0#');
    const format_sv = ldmlnum('#,##0.0#', 'sv');

    format_en(-1234.56) // "1,234.56"
    format_sv(-1234.56) // "1.234,56"

This works with subtags if you need variants:

    const format_en = ldmlnum('#,##0.0#', 'de');
    const format_sv = ldmlnum('#,##0.0#', 'de-AT');

When the subtag isn't available but the base language is, the base language is used. So `ldmlnum('#,##0.0#', 'sv-XX)` would return a formatter with `sv` properties assuming `sv-XX` hasn't been set.

The tags are case-sensitive, but formatter is will try to resolve `-` and `_`. You can therefore assign to `en_US` but call it with a `en-US` tag.


#### Defining locales:

You will most likely need or want to specify your locale beforehand.

The module object has a locale collection object attached that you must assign new locales to. You can do it manually:

    ldmlnum.locale.en = {
      thousands_separator: ',',
      decimal_separator: '.',
      positive_sign: '+',
      negative_sign: '-',
      exponent_symbol: 'E',
      infinity_symbol: '∞',
      nan_symbol: '☹'
    };

Partial assignments will default to English (here above) for the missing properties.

Alternatively, you can use a function:

    ldmlnum.locale([ group, decimal, plus, minus, exp, inf, nan ])

All parameters are optional. The usual usage would be:

    const ldmlnum = require('ldml-number');

    # define locales
    ldmlnum.locale.de = ldmlnum.locale('.', ',');
    ldmlnum.locale.de_AT = ldmlnum.locale(' ', ',');

    # format some numbers
    const format = ldmlnum( '#,##0.0#', 'de' );
    format( -1234.56 ) // "1.234,56"

    const format_AT = ldmlnum( '#,##0.0#', 'de-AT' );
    format_AT( -1234.56 ) // "1 234,56"


### Rounding

The [LDML specifies half even rounding](http://unicode.org/reports/tr35/tr35-numbers.html#Rounding).
This function is available from the outside:

    ldmlnum.round(number[, decimal_places ])

This is the same function the formatter uses so you may overwrite it in case you want something else.




module.exports = function locale ( grp = ',', dec = '.', pos = '+', neg = '-', exp = 'E', inf = '∞', nan = '☹' ) {
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

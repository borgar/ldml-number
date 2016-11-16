const tape = require( 'tape' );
const roundhalfeven = require( '../src/roundhalfeven' );

tape( 'rounding tests', t => {
  t.equal( typeof roundhalfeven, 'function', 'is a function' );
  t.equal( typeof roundhalfeven( 1 ), 'number', 'expect a numeric return value' );
  t.end();
});

tape( 'rounding to half even', t => {
  t.equal( roundhalfeven( 23.5 ), 24 );
  t.equal( roundhalfeven( 22.5 ), 22 );
  t.equal( roundhalfeven( -22.5 ), -22 );
  t.equal( roundhalfeven( -23.5 ), -24 );
  t.equal( roundhalfeven( 503.5842, 2 ), 503.58 );
  t.equal( roundhalfeven( 0, 2 ), 0 );
  t.equal( roundhalfeven( 100.455, 2 ), 100.46 );
  t.equal( roundhalfeven( 67.245, 2 ), 67.24 );
  t.equal( roundhalfeven( 67.1263, 2 ), 67.13 );
  t.equal( roundhalfeven( 67.1236, 2 ), 67.12 );
  t.equal( roundhalfeven( 1.535, 2 ), 1.54 );
  t.equal( roundhalfeven( 1.525, 2 ), 1.52 );
  t.equal( roundhalfeven( 1.5 ), 2 );
  t.equal( roundhalfeven( 0.5 ), 0 );
  t.equal( roundhalfeven( 124.34450000, 3 ), 124.344 );
  t.equal( roundhalfeven( 124.34450001, 3 ), 124.345 );
  t.equal( roundhalfeven( 124.34550000, 3 ), 124.346 );
  t.equal( roundhalfeven( 1.01, 3 ), 1.01 );
  t.equal( roundhalfeven( 10.0501, 1 ), 10.1 );
  t.equal( roundhalfeven( 82.25, 1 ), 82.2 );
  t.equal( roundhalfeven( 1.000, 0 ), 1 );
  t.equal( roundhalfeven( 1.01499999, 2 ), 1.01 );
  t.equal( roundhalfeven( 1.0150000000, 2 ), 1.02 );
  t.equal( roundhalfeven( 3.016, 2 ), 3.02 );
  t.equal( roundhalfeven( 3.013, 2 ), 3.01 );
  t.equal( roundhalfeven( 3.015, 2 ), 3.02 );
  t.equal( roundhalfeven( 3.045, 2 ), 3.04 );
  t.equal( roundhalfeven( 3.04501, 2 ), 3.05 );
  t.equal( roundhalfeven( 1 ), 1 );
  t.equal( roundhalfeven( 2, 0 ), 2 );
  t.equal( roundhalfeven( 3.00 ), 3 );
  t.equal( roundhalfeven( 0.44, 4 ), 0.44 );
  t.equal( roundhalfeven( 5.0000, 1 ), 5.0 );
  t.equal( roundhalfeven( 6.0000, 2 ), 6.00 );
  t.equal( roundhalfeven( 7, 2 ), 7.00 );
  t.equal( roundhalfeven( 0.5001 ), 1 );
  t.equal( roundhalfeven( -2.5 ), -2 );
  t.equal( roundhalfeven( 0.05, 1 ), 0 );
  t.equal( roundhalfeven( 0.15, 1 ), 0.2 );
  t.end();
});


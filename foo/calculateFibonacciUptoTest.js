var assert = require('assert');
var bothmath = require('../botmath.js');

describe('botmath', function() {
  describe('calculateFibonacciUpto', function () {
    it('should find all Fibonacci numbers up to a given number', function () {
      assert.equal([1,1], bothmath.calculateFibonacciUpto(0));
	  assert.equal([1,1], bothmath.calculateFibonacciUpto(-1));
	  assert.equal([0, 1, 1, 2, 3, 5, 8, 13, 21, 34], bothmath.calculateFibonacciUpto(34));
    })
	it('should return NaN if the value is not numeric', function () {
		assert.ok(isNaN(bothmath.isPrime('fibonacci')));
	});
  });
});
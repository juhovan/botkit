var assert = require('assert');
var bothmath = require('../botmath.js');

describe('botmath', function() {
  describe('isPrime', function () {
    it('should check if a number is a prime number', function () {
      assert.equal(true, bothmath.isPrime(1));
	  assert.equal(false, bothmath.isPrime(4));
	  assert.equal(false, bothmath.isPrime(-5));
	  assert.equal(false, bothmath.isPrime(147876876876));
    })
	it('should return NaN if the value is not numeric', function () {
		assert.ok(isNaN(bothmath.isPrime('prime')));
	});
  });
});
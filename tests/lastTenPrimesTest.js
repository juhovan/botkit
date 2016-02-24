/**
 * Created by olegba on 24/02/16.
 */
var assert = require('assert');
var bot = require('../bot.js');
var lastTenPrimes = bot.lastTenPrimes;


describe('Is prime', function() {
    it('should return an array of last ten prime numbers when the value is not a prime, or less then ten values', function () {
        assert.deepEqual([19,17,13,11,7,5,3,2], lastTenPrimes(20));
        assert.deepEqual([31,29,23,19,17,13,11,7,5,3], lastTenPrimes(33));
        assert.deepEqual([], lastTenPrimes(1));
    });
});

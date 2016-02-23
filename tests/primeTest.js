/**
 * Created by olegba on 23/02/16.
 */
var assert = require('assert');
var bot = require('../bot.js');


describe('Is prime', function() {
        it('should return false when the value is not a prime number or true if the number is prime', function () {
            assert.equal(false, bot.isPrime(8));
            assert.equal(true, bot.isPrime(7));
            assert.equal(false, bot.isPrime(0));
        });
});

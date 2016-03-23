/**
 * Created by mikko on 23.2.2016.
 */
var assert = require('assert');
var fibonacci = require('../fibonacci.js');

describe('fibonacci', function() {
    describe('calculateFibonacciUpto', function () {
        it('should return array of fibonacci numbers up to a goal', function () {
            assert.deepEqual([1,1,2,3,5,8], fibonacci.calculateFibonacciUpto(8));
            assert.deepEqual([1,1,2,3,5,8,13], fibonacci.calculateFibonacciUpto(13));
            assert.deepEqual([1,1], fibonacci.calculateFibonacciUpto(1));
            assert.deepEqual([1,1,2,3,5,8,13,21,34,55], fibonacci.calculateFibonacciUpto(55));
        })

    });
    describe('calculateNextFiveFibonacci', function () {
        it('should return the next 5 fibonacci numbers', function () {
            //assert.deepEqual('13, 21, 34, 55, 89', fibonacci.calculateNextFiveFibonacci([1,1,2,3,5,8]));
            assert.deepEqual('13, 21, 34, 55, 89', fibonacci.calculateNextFiveFibonacci(fibonacci.calculateFibonacciUpto(8)));
            assert.deepEqual('233, 377, 610, 987, 1597', fibonacci.calculateNextFiveFibonacci(fibonacci.calculateFibonacciUpto(144)));
            assert.deepEqual('2584, 4181, 6765, 10946, 17711', fibonacci.calculateNextFiveFibonacci(fibonacci.calculateFibonacciUpto(1597)));
        })

    })
});

/**
 * Created by mikko on 23.2.2016.
 */
/**
 * Created by mikko on 23.2.2016.
 */

var calculateFibonacciUpto = function (goal) {
    var fibonacci = [1, 1];

    while (fibonacci[fibonacci.length-1] < goal) {
        fibonacci.push(fibonacci[fibonacci.length-2] + fibonacci[fibonacci.length-1]);
    }

    return fibonacci;
};
var calculateNextFiveFibonacci =function (arr) {
    var fib = arr;
    var count = 0;
    while ( count < 5) {
        fib.push(fib[fib.length-2] + fib[fib.length-1]);
        count++;
    }
    fib = fib.slice(fib.length-5,fib.length).join(', ');
    return fib;
};

module.exports.calculateFibonacciUpto = calculateFibonacciUpto;
module.exports.calculateNextFiveFibonacci = calculateNextFiveFibonacci;


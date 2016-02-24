
var isPrime = function (n) {
 if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
 if (n%2==0) return (n==2);
 var m=Math.sqrt(n);
 for (var i=3;i<=m;i+=2) {
  if (n%i==0) return false;
 }
 return true;
}

module.exports.isPrime = isPrime;

var sum = function (num1, num2) {
	return parseFloat(num1) + parseFloat(num2);
}

module.exports.sum = sum;

var calculateFibonacciUpto = function(goal) {
	var fibonacci = [1, 1];
	while (fibonacci[fibonacci.length-1] < goal) {
		fibonacci.push(fibonacci[fibonacci.length-2] + fibonacci[fibonacci.length-1]);
	}
	return fibonacci;
}

module.exports.calculateFibonacciUpto = calculateFibonacciUpto;

var isFibonacci = function (number) {
   var prev = 0;
   var curr = 1;
   while (prev <= number) {
       if (prev == number) {
           return 1;
       }
       curr = prev + curr;
       prev = curr - prev;
   }}
   
module.exports.isFibonacci = isFibonacci;

var findnextFibonacci = function (lowerLimit) {
	for (lowerLimit++; !isFibonacci(lowerLimit); lowerLimit++);
	return lowerLimit;
}

module.exports.findnextFibonacci = findnextFibonacci;
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

var googlefunc = function (searchstring) {
	
	var tosearch = searchstring.replace(/ /g, '+');
	
	var link = 'http://lmgtfy.com/?q='+ tosearch;
	console.log('Link' + link);
	
	return link;
}

module.exports.googlefunc = googlefunc;

var randomanswer = function () {
	var listofresults = [
	'I found a anwser for you. Check this out:',
	'Hmmm, Have you tried this:',	
	'Hey That sound odd could it be this: ',
	'Check the first results here: ',
	'That sounds intrestings! Check this out: ',
	'Maybe you should ask help from here: ',
	'Sorry to hear that you have troubles:( Maybe this would help? '
	];
	var answers = listofresults[Math.floor(Math.random() * listofresults.length)];
	console.log('result ' + answers);
	
	return answers;
}

module.exports.randomanswer = randomanswer;

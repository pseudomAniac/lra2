var retriever = require('../retriever');
console.log("auto data retrieval - PNG");
retriever.getArticles('png',8,0);
// nauru
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('nauru',4,0);
},1000*60*3/*ms*s*m*h*d*/)
// samoa
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('samoa',4,0);
},1000*60*4/*ms*s*m*h*d*/)
// tonga
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('tonga',4,0);
},1000*60*6/*ms*s*m*h*d*/)
// vanuatu
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('vanuatu',4,0);
},1000*60*8/*ms*s*m*h*d*/)
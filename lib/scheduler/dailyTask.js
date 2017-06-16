var retriever = require('../retriever');
console.log("auto data retrieval - PNG");
retriever.getArticles('png',0,8);
// nauru
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('nauru',0,4);
},1000*60*3/*ms*s*m*h*d*/)
// samoa
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('samoa',0,4);
},1000*60*4/*ms*s*m*h*d*/)
// tonga
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('tonga',0,4);
},1000*60*6/*ms*s*m*h*d*/)
// vanuatu
setTimeout(function(){
	console.log("auto data retrieval - NAU");
	retriever.getArticles('vanuatu',0,4);
},1000*60*8/*ms*s*m*h*d*/)
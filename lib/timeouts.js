var retriever = require('./retriever'),
	limit = 5,
	counter = 0,
	country = "png";

exports.activateRetrieval = function(cy,cr,li) {
	setDataRet(cy,cr,li);
}
function deactivateRetrieval() {
}
function setDataRet(cy,cr,li) {
	country=cy;
	counter=cr;
	limit=li;
	var dataRet = setInterval(()=>{
		if (counter>=limit) {
			console.log(counter,"end reached.");
			clearInterval(dataRet);
			setInterval(()=>{
				// call fx to check for recent updates to the story links array
				console.log('getUpdate("png")')
				retriever.getUpdate("png");
			}, (1000*60*15));
			setInterval(()=>{
				// call fx to check for recent updates to the story links array
				console.log('getUpdate("pacific")')
				retriever.getUpdate("pacific");
			}, (1000*60*60*2));
		} else {
			retriever.automateDataRetrieval(country,1,limit);
			console.log(country,counter,limit)
			counter++;
		}
	},(1000*15))
}
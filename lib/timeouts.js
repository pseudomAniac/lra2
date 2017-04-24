var retriever = require('./retriever'),
	limit = 5,
	counter = 0,
	country = "png";

exports.activateRetrieval = (country,start,stop)=>{ setDataRet(country,start,stop) }

function setDataRet(country,start,stop) {
	var dataRet = setInterval(()=>{
		if (stop>=start) {
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
			retriever.automateDataRetrieval(country,start,1);
			console.log(country,counter,stop)
			counter++;
		}
	},(1000*15))
}
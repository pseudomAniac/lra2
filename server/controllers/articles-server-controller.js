var Article = require('../models/article-model'),
		moment	= require('moment'),
		Q 			= require('q');
		
module.exports.listArticles = function (req, res) {
	var country = req.params.country;
	if (country!='all') {
		Article.articlesModel.find({"domain":country}, function (err, result) { 
			res.json(result); 
		});
	}
	else {
		Article.articlesModel.find({}, function (err, result) { res.json(result); });
	}
}
module.exports.top5 = function (req,res) {
	var country = req.params.country, 
			dte 		= moment().startOf('today').format();
			// dte 		= new Date().toISOString();
			// console.log(dte,"\t-\t",new Date());
	Article.articlesModel.find({"pubdate": /February/, "domain":country}, function (err, result) { console.log("top 5",result[0]); res.json(result); }).sort({"views":-1}).limit(5);
}
module.exports.exportArticles = function (req, res) {
	var country 	= req.params.country,
		startDate 	= req.params.startDate;
		// endDate		= req.params.endDate;
	if (typeof(startDate) != undefined) {
			Article.articlesModel.find({"pubdate":startDate, "domain":country},
				function (err, result) { res.render('export', {"result":result}); }
			).sort({"views":"-1"});
		// if (endDate) { // both start date and end date is supplied with the query
		}
	else {
		Article.articlesModel.find({"domain":country},
			function (err, result) { res.render('export', {'result':result}); });
	}
}
module.exports.findOneArticle = function(nodeID) { // #longquery
	// console.log(nodeID);
	Article.findOneByNodeID(nodeID, function(err, result) {
		return result;
	})
}
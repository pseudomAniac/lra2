var Article = require('../models/article-model'),
		moment	= require('moment'),
		Q 			= require('q');
		
exports.listArticles = function (req, res) {
	var country = req.params.country;
	if (country!='all') {
		Article.articlesModel.find({"domain":country}, function (err, result) { res.json(result); });
	}
	else {
		Article.articlesModel.find({}, function (err, result) { res.json(result); });
	}
}
exports.top5 = function (req,res) {
	var country = req.params.country;
	var	today = moment(moment(), "MMMM DD YYYY").unix();
	Article.articlesModel.find({"pubdate": {$gte:today}, "domain":country}, function (err, result) {
		res.json(result);
	}).sort({"views":-1})
		.limit(5);
}
exports.exportArticles = function (req, res) {
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
exports.queryArticles = function(req,res) {
	var country = req.query.country,
			category = req.query.category,
			qdate = req.query.qdate;
	console.log(req.query)
	if (country) {
		// executes if all query params are present
		if (category) {
			// executes if only category are present
			if (qdate) {
				// executes if only country is present
				console.log(country,category,qdate)
				Article.articlesModel.find({"domain":country,"category":category,"pubdate":qdate}, function(err, result) {
					res.json(result)
				})
			}
			else {
				console.log(country,category)
				Article.articlesModel.find({"domain":country,"category":category}, function(err, result) {
					res.json(result)
				})
			}
		}
		else if (qdate) {
			// executes if only country and qdate are present
			console.log(category, qdate)
			Article.articlesModel.find({"domain":country,"pubdate":qdate}, function(err, result) {
				res.json(result)
			})
		}
		else {
			console.log(category)
			Article.articlesModel.find({"domain":country}, function(err, result) {
				res.json(result)
			})
		}
	}
	else {
		Article.articlesModel
		.find({}, function(err, result) {
			res.json(result);
		})
		.limit(25);
	}
}
exports.findOneArticle = function(nodeID) { // #longquery
	// console.log(nodeID);
	Article.findOneByNodeID(nodeID, function(err, result) {
		return result;
	})
}
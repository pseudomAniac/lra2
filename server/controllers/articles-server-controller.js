var Article = require('../models/article-model'),
		moment	= require('moment'),
		Q 			= require('q');
		
exports.listArticles = function (req, res) {
	var country = req.params.country;
	if (country!='all') {
		Article.articlesModel.find({"domain":country}, function (err, result) { res.json(result); }).limit(25);
	}
	else {
		Article.articlesModel.find({}, function (err, result) { res.json(result); }).limit(25);
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
	// console.log("queryArticles - ",req.query);
	var country = req.query.country,
		category = req.query.category,
		sdate = req.query.sdate,
		edate = req.query.edate;
		// console.log("sdate - ",sdate,"\nedate - ",edate);
	qopt_builder(country, category, sdate, edate, function(callback) {
		// console.log(callback);
		Article.articlesModel.find(callback, function(err, result) {
			// console.log(result.length)
			res.json(result);
		})
	})
}
// query options builder
function qopt_builder(country,category,sdate,edate,callback) {
	var opts = {};
	if (country != undefined) opts.domain = country;
	if (category != undefined) opts.category = category;
	if (sdate != undefined) {
		opts.pubdate = {};
		if (edate != undefined) {
			opts.pubdate.$lte = moment(moment(new Date(edate)), "MMMM DD YYYY").unix();
			opts.pubdate.$gte = moment(moment(new Date(sdate)), "MMMM DD YYYY").unix()
		} else {
			opts.pubdate.$gte = moment(moment(new Date(sdate)), "MMMM DD YYYY").unix()
			opts.pubdate.$lt = moment(moment(new Date(sdate)).add(1,"day"), "MMMM DD YYYY").unix()
		}
	};
	callback(opts);
}
exports.findOneArticle = function(nodeID) { // #longquery
	Article.findOneByNodeID(nodeID, function(err, result) {
		return result;
	})
}
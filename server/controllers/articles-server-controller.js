var Article = require('../models/article-model'),
		moment	= require('moment'),
		Q 			= require('q');
module.exports.listArticles = function (req, res) {
	var country = req.params.country;
	Article.articlesModel.find({"domain":country}, function (err, result) { res.json(result); });
	// switch (country) {
	// 	case 'png':
	// 		Article.articlesModel.find({""}, function (err, result) { res.json(result); });
	// 		break;
	// 	case 'nauru':
	// 		Article.articlesModel.find({""}, function (err, result) { res.json(result); });
	// 		break;
	// 	case 'samoa':
	// 		Article.articlesModel.find({""}, function (err, result) { res.json(result); });
	// 		break;
	// 	case 'tonga':
	// 		Article.articlesModel.find({""}, function (err, result) { res.json(result); });
	// 		break;
	// 	case 'vanuatu':
	// 		Article.articlesModel.find({""}, function (err, result) { res.json(result); });
	// 		break;
	// 	}
}
module.exports.top5 = function (req,res) {
	var country = req.params.country, 
			dte 		= moment().startOf('today').format("DDDD MM YYYY") 
	Article.articlesModel.find({"pubdate":dte, "domain":country}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// switch (country) {
	// 	case 'png':
	// 		Article.articlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// 		break;
	// 	case 'nauru':
	// 		Article.articlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// 		break;
	// 	case 'samoa':
	// 		Article.articlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// 		break;
	// 	case 'tonga':
	// 		Article.articlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// 		break;
	// 	case 'vanuatu':
	// 		Article.articlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);
	// 		break;
	// 	}
}
module.exports.exportArticles = function (req, res) {
	var country 	= req.params.country,
		startDate 	= req.params.startDate;
		// endDate		= req.params.endDate;
	// console.log(startDate + " - " + country);
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
	// switch (country) {
	// 	case 'png':
	// 		if (typeof(startDate) != undefined) {
	// 				Article.articlesModel.find({"pubdate":startDate},
	// 					function (err, result) { res.render('export', {"result":result}); }
	// 				).sort({"views":"-1"});
	// 				break;
	// 			// if (endDate) { // both start date and end date is supplied with the query
	// 			}
	// 		else {
	// 			Article.articlesModel.find({},
	// 				function (err, result) { res.render('export', {'result':result}); });
	// 			break;
	// 		}
	// 	case 'nauru':
	// 		if (typeof(startDate) != undefined) {
	// 			Article.articlesModel.find({'pubdate':startDate},
	// 				function (err, result) { res.render('export', {'result':result}); }
	// 				).sort({'views':'-1'});
	// 		}
	// 		Article.articlesModel.find({},
	// 			function (err, result) { res.render('export', {'result':result}); });
	// 		break;
	// 	case 'samoa':
	// 		if (typeof(startDate) != undefined) {
	// 			Article.articlesModel.find({'pubdate':startDate},
	// 				function (err, result) { res.render('export', {'result':result}); }
	// 				).sort({'views':'-1'});
	// 		}
	// 		Article.articlesModel.find({},
	// 			function (err, result) { res.render('export', {'result':result}); });
	// 		break;
	// 	case 'tonga':
	// 		if (typeof(startDate) != undefined) {
	// 			Article.articlesModel.find({'pubdate':startDate},
	// 				function (err, result) { res.render('export', {'result':result}); }
	// 				).sort({'views':'-1'});
	// 		}
	// 		Article.articlesModel.find({},
	// 			function (err, result) { res.render('export', {'result':result}); });
	// 		break;
	// 	case 'vanuatu':
	// 		if (typeof(startDate) != undefined) {
	// 			Article.articlesModel.find({'pubdate':startDate},
	// 				function (err, result) { res.render('export', {'result':result}); }
	// 				).sort({'views':'-1'});
	// 		}
	// 		Article.articlesModel.find({},
	// 			function (err, result) { res.render('export', {'result':result}); });
	// 		break;
	// 	default:
	// 		break;
	// 	}
}
module.exports.findOneArticle = function(nodeID) { // #longquery
	// console.log(nodeID);
	Article.findOneByNodeID(nodeID, function(err, result) {
		return result;
	})
}
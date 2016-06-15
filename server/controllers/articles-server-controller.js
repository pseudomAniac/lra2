var csv 		= require('express-csv');
var Article = require('../models/article-model');

module.exports.listArticles = function (req, res) {
	var country = req.params.country;
	switch (country) 
	{
		case 'png':
			// List PNG Articles from DB using 'PNG Articles Model' defined in 'article-model.js'
			Article.pngArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'nauru':
			// List Nauru Articles from DB using 'Nauru Articles Model' defined in 'article-model.js'
			Article.nauruArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'samoa':
			// List Samoa Articles from DB using 'Samoa Articles Model' defined in 'article-model.js'
			Article.samoaArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'tonga':
			// List Tonga Articles from DB using 'Tonga Articles Model' defined in 'article-model.js'
			Article.tongaArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'vanuatu':
			// List Vanuatu Articles from DB using 'Vanuatu Articles Model' defined in 'article-model.js'
			Article.vanuatuArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		}
}

module.exports.exportArticles = function (req, res) {
	var country 		= req.params.country,
			startDate 	= req.params.startDate,
			endDate			=	req.params.endDate;
	switch (country) 
	{
		case 'png':
			// Export PNG Articles from DB using 'PNG Articles Model' defined in 'article-model.js'
			if (typeof(startDate) != undefined) {
					console.log(startDate + "\n" + req.params);
					Article.pngArticlesModel.find({"pubdate":startDate},
						function (err, result) { res.render('export', {"result":result}); }
					).sort({"views":"-1"});//.limit(20);
					break;
				// if (endDate) { // both start date and end date is supplied with the query
				}
			else {
				Article.pngArticlesModel.find({},
					function (err, result) { res.render('export', {'result':result}); }).limit(20);
				break;
			}
		case 'nauru':
			// Export Nauru Articles from DB using 'Nauru Articles Model' defined in 'article-model.js'
			if (typeof(startDate) != undefined) {
				Article.nauruArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.nauruArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); }).limit(20);
			break;
		case 'samoa':
			// Export Samoa Articles from DB using 'Samoa Articles Model' defined in 'article-model.js'
			if (typeof(startDate) != undefined) {
				Article.samoaArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.samoaArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); }).limit(20);
			break;
		case 'tonga':
			// Export Tonga Articles from DB using 'Tonga Articles Model' defined in 'article-model.js'
			if (typeof(startDate) != undefined) {
				Article.tongaArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.tongaArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); }).limit(20);
			break;
		case 'vanuatu':
			// Export Vanuatu Articles from DB using 'Vanuatu Articles Model' defined in 'article-model.js'
			if (typeof(startDate) != undefined) {
				Article.vanuatuArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.vanuatuArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); }).limit(20);
			break;
		}
}
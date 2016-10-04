var csv 		= require('express-csv');
var Article = require('../models/article-model');
var myConf = require("../../app/my-conf.js");

module.exports.listArticles = function (req, res) {
	var country = req.params.country;
	switch (country) {
		case 'png':
			Article.pngArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'nauru':
			Article.nauruArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'samoa':
			Article.samoaArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'tonga':
			Article.tongaArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		case 'vanuatu':
			Article.vanuatuArticlesModel.find({}, function (err, result) { res.json(result); });//.limit(20);
			break;
		}
};

module.exports.exportArticles = function (req, res) {
	var country 		= req.params.country,
			startDate 	= req.params.startDate,
			endDate			=	req.params.endDate;
	console.log(startDate + " - " + country);
	switch (country) {
		case 'png':
			if (typeof(startDate) != undefined) {
					Article.pngArticlesModel.find({"pubdate":startDate},
						function (err, result) { res.render('export', {"result":result}); }
					).sort({"views":"-1"});//.limit(20);
					break;
				// if (endDate) { // both start date and end date is supplied with the query
				}
			else {
				Article.pngArticlesModel.find({},
					function (err, result) { res.render('export', {'result':result}); });//.limit(20);
				break;
			}
		case 'nauru':
			if (typeof(startDate) != undefined) {
				Article.nauruArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.nauruArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); });//.limit(20);
			break;
		case 'samoa':
			if (typeof(startDate) != undefined) {
				Article.samoaArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.samoaArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); });//.limit(20);
			break;
		case 'tonga':
			if (typeof(startDate) != undefined) {
				Article.tongaArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.tongaArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); });//.limit(20);
			break;
		case 'vanuatu':
			if (typeof(startDate) != undefined) {
				Article.vanuatuArticlesModel.find({'pubdate':startDate},
					function (err, result) { res.render('export', {'result':result}); }
					).sort({'views':'-1'});
			}
			Article.vanuatuArticlesModel.find({},
				function (err, result) { res.render('export', {'result':result}); });//.limit(20);
			break;
		default:
			break;
		}
}

module.exports.top5 = function (req,res) {
	var country = req.params.country, dte = myConf.getToday(); console.log("from 'top5' - "+dte);
	switch (country) {
		case 'png':
			Article.pngArticlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(6);//.limit(20);
			break;
		case 'nauru':
			Article.nauruArticlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);//.limit(20);
			break;
		case 'samoa':
			Article.samoaArticlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);//.limit(20);
			break;
		case 'tonga':
			Article.tongaArticlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);//.limit(20);
			break;
		case 'vanuatu':
			Article.vanuatuArticlesModel.find({"pubdate":dte}, function (err, result) { res.json(result); }).sort({"views":-1}).limit(5);//.limit(20);
			break;
		}
};
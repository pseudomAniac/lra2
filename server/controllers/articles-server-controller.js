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


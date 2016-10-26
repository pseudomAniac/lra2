var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema;
var ArticlesSchema = new Schema({
	title: String,
	author: String,
	views: {type: Number, index: true},
	publisher: String,
	pubdate: String,
	link: String,
	uuid: Number,
	description: String,
	category: String,
	source: String
});
module.exports.articlesSchema = new Schema({
	title: String,
	author: String,
	views: Number,
	publisher: String,
	pubdate: String,
	link: String,
	uuid: Number,
	description: String,
	category: String,
	source: String
});
module.exports.nauruArticlesModel = mongoose.model('NauruArticle', ArticlesSchema,'nauruarticles');
module.exports.pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema,'pngarticles');
module.exports.samoaArticlesModel = mongoose.model('SamoaArticle', ArticlesSchema,'samoaarticles');
module.exports.tongaArticlesModel = mongoose.model('TongaArticle', ArticlesSchema,'tongaarticles');
module.exports.vanuatuArticlesModel = mongoose.model('VanuatuArticle', ArticlesSchema,'vanuatuarticles');
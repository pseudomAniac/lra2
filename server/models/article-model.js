var mongoose 	= require('mongoose'),
		Schema 		= mongoose.Schema;

// Articles Schema
var ArticlesSchema = new Schema({
	title: String,
	author: String,
	views: Number,
	publisher: String,
	pubdate: String
})

// export Articles Schema
module.exports.articlesSchema = new Schema({
	title: String,
	author: String,
	views: Number,
	publisher: String,
	pubdate: String
})

// Nauru Articles Model
module.exports.nauruArticlesModel = mongoose.model('NauruArticle', ArticlesSchema,'nauruarticles');

// PNG Articles Model
module.exports.pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema,'pngarticles');

// Samoa Articles Model
module.exports.samoaArticlesModel = mongoose.model('SamoaArticle', ArticlesSchema,'samoaarticles');

// Tonga Articles Model
module.exports.tongaArticlesModel = mongoose.model('TongaArticle', ArticlesSchema,'tongaarticles');

// Vanuatu Articles Model
module.exports.vanuatuArticlesModel = mongoose.model('VanuatuArticle', ArticlesSchema,'vanuatuarticles');
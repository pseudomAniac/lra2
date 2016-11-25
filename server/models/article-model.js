var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema;
var ArticlesSchema = new Schema({
	title: String,
	author: String,
	views: {type: Number, index: true},
	publisher: {type: String},
	pubdate: String,
	link: String,
	uuid: Number,
	description: String,
	category: {type: Array},
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
// module.exports.articlesModel = mongoose.model('Article', ArticlesSchema);
module.exports.nauruArticlesModel = mongoose.model('NauruArticle', ArticlesSchema);
module.exports.pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema);
module.exports.samoaArticlesModel = mongoose.model('SamoaArticle', ArticlesSchema);
module.exports.tongaArticlesModel = mongoose.model('TongaArticle', ArticlesSchema);
module.exports.vanuatuArticlesModel = mongoose.model('VanuatuArticle', ArticlesSchema);

var pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema);
var articlesModel = mongoose.model('Article', ArticlesSchema);

pngArticlesModel.find({"category": new RegExp('(taxonomy-)','i')}, function(err,docs) {
	if (err) console.log(err);
	if (docs) {
		docs.forEach(function(doc) {
			pngArticlesModel.findByIdAndUpdate(doc._id, function(article) {
				console.log(article.title);
			})
		})
		// console.log(docs.typeOf);
	}
	// return null;
})
var mongoose = require('mongoose'),
		Schema 	 = mongoose.Schema;
var ArticlesSchema = new Schema({
	nodeID: {type: Number, index: true},
	pubdate: {type: Date, index: true},
	title: String,
	link: String,
	author: String,
	category: {type: Array},
	domain: {type: String, index: true},
	publisher: String,
	source: String
});
// module.exports.articlesModel = mongoose.model('Article', ArticlesSchema);
module.exports.articlesModel = mongoose.model('Article',ArticlesSchema);
module.exports.nauruArticlesModel = mongoose.model('NauruArticle', ArticlesSchema);				// depreciated, will be removed in the next major upgrade
module.exports.pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema);						// depreciated, will be removed in the next major upgrade
module.exports.samoaArticlesModel = mongoose.model('SamoaArticle', ArticlesSchema);				// depreciated, will be removed in the next major upgrade
module.exports.tongaArticlesModel = mongoose.model('TongaArticle', ArticlesSchema);				// depreciated, will be removed in the next major upgrade
module.exports.vanuatuArticlesModel = mongoose.model('VanuatuArticle', ArticlesSchema);		// depreciated, will be removed in the next major upgrade

var pngArticlesModel = mongoose.model('PNGArticle', ArticlesSchema);
// var articlesModel = mongoose.model('Article', ArticlesSchema);

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
module.exports.findOneByNodeID = function(nodeID) { // #longquery
	// console.log(nodeID)
	pngArticlesModel.findOne({"nodeID":nodeID}, function(err, doc) {
		// console.log("doc found",doc);
		return doc;
	});
}
var mongoose = require('mongoose'),
		Schema 	 = mongoose.Schema;
var ArticlesSchema = new Schema({
	domain: {type: String, index: true},
	nodeID: {type: Number, index: true},
	pubdate: {type: Number, index: true},
	title: String,
	views: Number,
	link: {type: String, index: true},
	author: String,
	category: {type: Array},
	publisher: String,
	source: String
});
exports.articlesModel = mongoose.model('Article', ArticlesSchema);
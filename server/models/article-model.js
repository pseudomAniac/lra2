var mongoose = require('mongoose'),
		Schema 	 = mongoose.Schema;
var ArticlesSchema = new Schema({
	domain: {type: String, index: false},
	nodeID: {type: Number, index: false},
	pubdate: {type: Number, index: true},
	title: String,
	views: Number,
	gaPageviews: {type: Number, index: true},
	link: {type: String, index: false},
	author: String,
	category: {type: Array},
	publisher: String,
	source: String,
	description: String,
	comments: String,
});
exports.articlesModel = mongoose.model('Article', ArticlesSchema);
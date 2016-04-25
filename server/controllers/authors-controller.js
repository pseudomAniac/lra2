var Author = require('../models/author');

// function to add new author to the database
module.exports.createAuthor = function (req, res) {
	console.log(req);
	var author = new Author(req.body);
	author.save(function (err, result) {
		res.json(result);
	});
}

// function to query the database
module.exports.listAuthors = function (req, res) {
	Author.find({}, function (err, result) {
		res.json(result);
	});
}

// function to delete author from the database
module.exports.deleteAuthor = function (req, res) {
	console.dir("delete call from server controller");
	var author = new Author(req.body);
	author.delete(function (err, result) {
		res.json(result);
	})
}
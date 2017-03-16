// ================================================= //
//               mongoose configurations             //
// ================================================= //
var	mongoose = require('mongoose'),
		Q = require('q'),
		app = require('../app.js'),
// db connectors
		// dbUri = 'mongodb://127.0.0.1:27017/lra2'; // local - dev
		// dbUri = 'mongodb://reader_loopcount_db:readloopcount@ds019980.mlab.com:19980/heroku_gt6n53cm';	// production database - mongolab sandbox
		dbUri = 'mongodb://test_user:default@ds019980.mlab.com:19980/heroku_gt6n53cm';	// production database - mongolab sandbox
		// app.set('mongodb_uri', process.env.MONGODB_URI || dbUri);
// mongoose.connect(app.get(mongodb_uri));
mongoose.connect(dbUri);
var conn 											= mongoose.connection;
var articlescollection				= conn.collection('articles');
exports.articlescollection		= conn.collection('articles');
exports.insertArticle					= Q.nbind(articlescollection.insert.bind(articlescollection));
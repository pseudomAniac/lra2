// ================================================= //
//               mongoose configurations             //
// ================================================= //
var	mongoose = require('mongoose'),
		Q = require('q'),
// db connectors
		// dbUri = 'mongodb://127.0.0.1:27017/lra2'; // local - dev
		// dbUri = 'mongodb://reader_loopcount_db:readloopcount@ds019980.mlab.com:19980/heroku_gt6n53cm';	// production database - mongolab sandbox
		dbUri = 'mongodb://test_user:default@ds019980.mlab.com:19980/heroku_gt6n53cm';	// production database - mongolab sandbox
mongoose.connect(dbUri);
var conn 											= mongoose.connection;
var articlescollection				= conn.collection('articles');
exports.articlescollection		= conn.collection('articles');
exports.insertArticle					= Q.nbind(articlescollection.insert.bind(articlescollection));

// connect to collection
// var naurucollection 					= conn.collection('nauruarticles');				// depreciated, will be removed in the next major upgrade
// var pngcollection 						= conn.collection('pngarticles');					// depreciated, will be removed in the next major upgrade
// var samoacollection 					= conn.collection('samoaarticles');				// depreciated, will be removed in the next major upgrade
// var tongacollection 					= conn.collection('tongaarticles');				// depreciated, will be removed in the next major upgrade
// var vanuatucollection					= conn.collection('vanuatuarticles');			// depreciated, will be removed in the next major upgrade

// exports.naurucollection 			= conn.collection('nauruarticles');				// depreciated, will be removed in the next major upgrade
// exports.pngcollection 				= conn.collection('pngarticles');					// depreciated, will be removed in the next major upgrade
// exports.samoacollection 			= conn.collection('samoaarticles');				// depreciated, will be removed in the next major upgrade
// exports.tongacollection 			= conn.collection('tongaarticles');				// depreciated, will be removed in the next major upgrade
// exports.vanuatucollection			= conn.collection('vanuatuarticles');			// depreciated, will be removed in the next major upgrade

// insert documents to collection
// exports.insertNauruArticle		= Q.nfbind(naurucollection.insert.bind(naurucollection));			// depreciated, will be removed in the next major upgrade
// exports.insertPNGArticle			= Q.nbind(pngcollection.insert.bind(pngcollection));					// depreciated, will be removed in the next major upgrade
// exports.insertSamoaArticle		= Q.nbind(samoacollection.insert.bind(samoacollection));			// depreciated, will be removed in the next major upgrade
// exports.insertTongaArticle		= Q.nbind(tongacollection.insert.bind(tongacollection));			// depreciated, will be removed in the next major upgrade
// exports.insertVanuatuArticle	= Q.nbind(vanuatucollection.insert.bind(vanuatucollection));	// depreciated, will be removed in the next major upgrade


// module.exports.findOneArticlePNG(nodeID) = Q.nfbind(pngcollection.findOne(nodeID), function(err, doc) {
// 	if (!err) {
// 		if (!doc)	return true;
// 		else return false;
// 	}
// 	else return err;
// });

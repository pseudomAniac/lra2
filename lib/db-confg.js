// ================================================= //
//               mongoose configurations             //
// ================================================= //
var	mongoose = require('mongoose'), Q = require('q');
// db connectors
// var dbUri = 'mongodb://127.0.0.1:27017/lra'; // local - dev
// var dbUri = 'mongodb://reader_loopcount_db:readloopcount@ds019980.mlab.com:19980/heroku_gt6n53cm';
var dbUri = 'mongodb://test_user:default@ds019980.mlab.com:19980/heroku_gt6n53cm';
mongoose.connect(dbUri);
var conn = mongoose.connection;
// connect to collection
exports.naurucollection 	= conn.collection('nauruarticles');
var naurucollection 	= conn.collection('nauruarticles');
naurucollection.createIndex({"views": -1});
exports.pngcollection 		= conn.collection('pngarticles');
var pngcollection 		= conn.collection('pngarticles');
pngcollection.createIndex({"views": -1});
exports.samoacollection 	= conn.collection('samoaarticles');
var samoacollection 	= conn.collection('samoaarticles');
samoacollection.createIndex({"views": -1});
exports.tongacollection 	= conn.collection('tongaarticles');
var tongacollection 	= conn.collection('tongaarticles');
tongacollection.createIndex({"views": -1});
exports.vanuatucollection	= conn.collection('vanuatuarticles');
var vanuatucollection	= conn.collection('vanuatuarticles');
vanuatucollection.createIndex({"views": -1});

// insert documents to collection
exports.insertNauruArticle		= Q.nfbind(naurucollection.insert.bind(naurucollection));
exports.insertPNGArticle			= Q.nbind(pngcollection.insert.bind(pngcollection));
exports.insertSamoaArticle		= Q.nbind(samoacollection.insert.bind(samoacollection));
exports.insertTongaArticle		= Q.nbind(tongacollection.insert.bind(tongacollection));
exports.insertVanuatuArticle	= Q.nbind(vanuatucollection.insert.bind(vanuatucollection));

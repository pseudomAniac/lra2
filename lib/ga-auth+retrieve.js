// code used to create the pem file
// var fs = require('fs'),
// P12toPEM = require('google-p12-pem'),
// nPEM = new P12toPEM,
// google apis, auths & tokens
// P12toPEM('./lib/lra2-81167be3844b.p12',(function(err,obj){
// 		if(!err) {
// 			fs.writeFile(__dirname+'/lib/key.pem',obj, (err)=>{
// 				if (!err) console.log("key.pem saved in 'lib' directory");
// 				else console.log(err);
// 			})
// 		}
// 		else console.log(err)
// 	}))
// local variables
var db = require('./db-config'); // to use CRUD operations in the module
var Q = require('q'); // to use promises in this module
var findOneAndUpdate = Q.nbind(db.articlescollection.findOneAndUpdate.bind(db.articlescollection)); // db function
var google = require('googleapis'); // to use gapis
var analytics = google.analytics('v3'); // to use analytics
// var authS2S = require('../node_modules/lra2-1e61de3b4a18.json'); // authentication file location
var jwtClient = new google.auth.JWT( // json web token authentication/verification
		// process.env.JWT_CLIENT_EMAIL || authS2S.client_email, // used in dev('local') env
		process.env.JWT_CLIENT_EMAIL, // used in production env
		'./lib/key.pem',
		null,
		// process.env.JWT_SCOPE || authS2S.scope, // used in dev('local') env
		process.env.JWT_SCOPE, // used in production env
		null
	);
var qdata = []; // array for holding Google Analytics query data objects
	// dbQueryOpts = {}; // object for holding options for making the db query
// JSON Web Tokens (JWT)
jwtClient.authorize(function(err,tokens) { // json web token server-to-server authorization fx call
	if (err) {
		console.log(err)
		return;
	} else {
		jwtClient.setCredentials(tokens);
	}
})
// raw functions
function queryGAData(link,cb) { // fx to get data from GA server // successful retrieval is dependent on successful jwt authentication
  analytics.data.ga.get({
    'auth': jwtClient,
    // 'ids': process.env.JWT_VIEW_ID || authS2S.view_id, // used in dev('local') env
    'ids': process.env.JWT_VIEW_ID, // used in production env
    'metrics': 'ga:pageviews',
    'dimensions': 'ga:pagePath',
    'start-date': '7daysAgo',
    'end-date': 'today',
    'sort': '-ga:pageviews',
    'max-results': 10,
    'filters': 'ga:pagePath=~/'+link,
  }, function (err, response) { // callback fx to handle response from Google Analytics query
    if (err) { // executed when error exists
      console.log('\nERROR\n----------\n',err);
      return cb(err,null);
    } else { // executed when data is returned
      // var jsonresponse = JSON.stringify(response, null, 4);
      // console.log('+++ganal\n',jsonresponse)
      // console.log(response.rows)
      return cb(null,response);
    }
  });  
}
// raw fx
function getGAdata(shiftedData,cb) { // query data from Google Analytics servers
	queryGAData(shiftedData.GAlink,(err,gada)=>{ // fx to handle returned data
		if (gada.rows) {
			var rows = gada.rows[0],
			gaPageviews = Number.parseInt(rows[1]) || 0;
			// loopurl = baseUrl + rows[0];
			// query lra2.articles for article and upsert gaPageviews
			shiftedData.dbUpdateData.gaPageviews = gaPageviews;
			shiftedData.updateInfo = true;
			console.log("+GA Data Present\n",shiftedData);
			return cb(null,shiftedData);
		} else {
			console.log('+GA Data Missing\n',shiftedData.dbQueryOpts.nodeID,"\n+ERROR",err);
			return cb(err,null);
		}
	});
}
// setInterval fx
var qdataCheckup = setInterval(()=>{
	if (qdata.length>0) {
		// qdata's gapageview is update/created thru a function
		getGAdata(qdata.shift(),(err,cbData)=>{
			// then a cb fx is executed to update the DB
			if(!err) {
				findOneAndUpdate(cbData.dbQueryOpts,{$set:cbData.dbUpdateData},(err,doc)=>{
					console.log("updated gaPageviews -", doc.value.nodeID)
				});
			} else {
				console.log(err)
			}
		});
	}
},300) // check every second
// module exporter publicly available fx
exports.updateData = (link,nodeID,domain,views)=>{ // fx made available for outside excess through the module exports library
	var GAlink = link.split('/')[link.split('/').length-1];
	// every request to this fx creates a new data object in the qdata array
	qdata.push({
		links: {
			link:link,
			GAlink:GAlink
		},
		dbQueryOpts: {
			"nodeID":nodeID,
			"domain":domain
		},
		dbUpdateData: {
			views:views,
		}
	});
	qdataCheckup;
}

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
var db = require('./db-config'),
	Q = require('q'),
	findOneAndUpdate = Q.nbind(db.articlescollection.findOneAndUpdate.bind(db.articlescollection));
var google = require('googleapis'),
	analytics = google.analytics('v3');
// var authS2S = require('../node_modules/lra2-1e61de3b4a18.json');
var jwtClient = new google.auth.JWT(
		// process.env.JWT_CLIENT_EMAIL || authS2S.client_email,
		process.env.JWT_CLIENT_EMAIL,
		'./lib/key.pem',
		null,
		// process.env.JWT_SCOPE || authS2S.scope,
		process.env.JWT_SCOPE,
		null
	);
jwtClient.authorize(function(err,tokens) {
	if (err) {
		console.log(err)
		return;
	} else {
		jwtClient.setCredentials(tokens);
	}
})
// raw functions
function queryData(title,cb) {
  analytics.data.ga.get({
    'auth': jwtClient,
    // 'ids': process.env.JWT_VIEW_ID || authS2S.view_id,
    'ids': process.env.JWT_VIEW_ID,
    'metrics': 'ga:pageviews',
    'dimensions': 'ga:pagePath',
    'start-date': '7daysAgo',
    'end-date': 'today',
    'sort': '-ga:pageviews',
    'max-results': 10,
    'filters': 'ga:pagePath=~/'+title,
  }, function (err, response) {
    if (err) {
      console.log('\nERROR\n----------\n',err);
      return;
    } else {
      // var jsonresponse = JSON.stringify(response, null, 4);
      // console.log('+++ganal\n',jsonresponse)
      // console.log(response.rows)
      return cb(response);
    }
  });  
}
var links = [];
exports.setLinks = (link)=>{ links.push(link); getGAdata(); }
function getGAdata() {
	if (links.length>0) {
		while (links.length>0) {
			var link = links.shift(),
			country = link.split('/')[2].split('.')[1].replace('loop',''),
			// baseUrl = 'http://'+link.split('/')[2],
			GAlink = link.split('/')[link.split('/').length-1],
			nodeID = Number.parseInt(GAlink.split('-')[GAlink.split('-').length-1]);
			// query data from GA
			queryData(GAlink,(data)=>{
				if (data.rows) {
					var rows = data.rows[0],
					gaPageviews = Number.parseInt(rows[1]);
					// loopurl = baseUrl + rows[0];
					// console.log("rows -", rows,"\nloopurl -", loopurl,"\ndomain -", country,"\nnodeID -", nodeID);
					// query lra2.articles for article and upsert gaPageviews
					findOneAndUpdate({"nodeID": nodeID, "domain": country},{$set:{"pageviews":gaPageviews}},(err,doc)=>{ console.log("updated gaPageviews -", doc.value.nodeID) });
				} else { console.log('+GA Data Missing -',nodeID); }
			});
		}
	}
}
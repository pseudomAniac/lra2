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
var google = require('googleapis'),
	analytics = google.analytics('v3');
var authS2S = require('../node_modules/lra2-1e61de3b4a18.json');
var jwtClient = new google.auth.JWT(
		process.env.JWT_CLIENT_EMAIL || authS2S.client_email,
		'./lib/key.pem',
		process.env.JWT_PRIVATE_KEY || authS2S.private_key,
		process.env.JWT_SCOPE || authS2S.scope,
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
function queryData(title, cb) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': process.env.JWT_VIEW_ID || authS2S.view_id,
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
    }
    // console.log('\nSUCCESS\n',JSON.stringify(response, null, 4));
    cb(JSON.stringify(response, null, 4));
  });  
}

exports.getPageviews = (link) => {
	link = link.split('/')[link.split('/').length-1]
	queryData(link,(data)=> {
		console.log(data.rows[0][1])
		return data;
	});
}
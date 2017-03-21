var x = require('x-ray')();
var Q = require('q');
var moment = require('moment');
var postmeta_extract = {
		nodeID: 'link[rel=shortlink]@href',
		pubdate: '.by-line .submitted',
		title: 'h1.page-header',
		views: '.statistics_counter',
		link: 'link[rel=canonical]@href',
		author: '.username',
		category: 'body@class',
		domain: '.domain@id',
		publisher: '.field-name-field-author .field-item.even',
		source: '.field-name-field-source-url .field-item.even'
		// description: '.field-name-field-feature-caption .field-item p',
		// comments: '.comment-count',
};
var db_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lra2";
var articlescollection = require('mongoose').connect(db_uri).connection.collection('articles');
var addArticle2DB = Q.nbind(articlescollection.insert.bind(articlescollection));

exports.getArticles = (country,pagesToScan,startScanAt)=>{
	var lurl = 'http://www.loop' + country + '.com/section/all?page=';
	pagesToScan = Number.parseInt(pagesToScan);
	startScanAt = Number.parseInt(startScanAt);
	for (var i = startScanAt; i < (startScanAt+pagesToScan); i++) {
		var nurl = lurl+i;
		x(nurl,x(['.news-title>a@href']))((err,links)=>{ if(!err) scanLinks(err,links); });
	}
}
exports.automateDataRetrieval = (country,pagesToScan,startScanAt)=>{
  var url = "http://www.loop"+country+".com/section/all?page="+startScanAt;
  x(url,x(['.news-title>a@href']))((err,links)=>{ if(!err) scanLinks(err,links) })
  .paginate('li.pager-next>a@href')
  .limit(pagesToScan);
}
exports.getUpdate = (country)=>{
	switch(country) {
		case "png" :
			x("http://www.looppng.com/section/all",x(['.news-title>a@href']))((err,links)=>{scanLinks(err,links);})
			break;
		case "pacific" :
			var countries = ['nauru','samoa','tonga','vanuatu'];
			countries.forEach((region)=>{
				x("http://www.loop"+region+".com/section/all",x(['.news-title>a@href']))((err,links)=>{scanLinks(err,links);})
			})
			break;
		default :
			console.log("You're caught!")
			break;
	}
}
function scanLinks(err, links){ // fx to scanLinks
    if(!err){
    	links.forEach(function (link, index) {
    		var domain = link.replace('loop','').split(".")[1]; // loopcountry
    		articlescollection.findOne({"link":link, "domain":domain}, function(err, doc) {
    			if (!err) {
    				if (!doc) { // executes if doc is not found
    					x(link, postmeta_extract)(function(err, data) {
    						if (!err) {
    							cleaner(data, function(cleanedData) {
		    						console.log("created -", cleanedData.nodeID);
    								addArticle2DB(cleanedData);
    							});
    						}
    						else {
    							console.log("ERROR ENCOUNTERED\n",err);
    						}
    					});
    				}
    				else { /* executes if doc is found */ 
    					articlescollection.findOneAndUpdate({"nodeID": doc.nodeID, "domain": doc.domain},{$set:{"views":doc.views}});
    				}
    			}
    			else console.log("ERROR ENCOUNTERED\n",err);
    		})
    	})
    }
};
function cleaner (doc2update, callback) {
	var tx = doc2update.pubdate.slice(doc2update.pubdate.indexOf(",")-5, doc2update.pubdate.lastIndexOf(",")+6).split(", ");
	doc2update.domain = doc2update.domain.toLowerCase();
	doc2update.nodeID = Number.parseInt(doc2update.nodeID.split("/")[4]);
	doc2update.views = Number.parseInt(doc2update.views.replace(" reads",""));
	doc2update.category = doc2update.category.split("taxonomy-").reverse().shift().replace('-',' ');
	doc2update.pubdate = moment(new Date(tx[2]+", "+tx[1]+", "+tx[0])).subtract(10, "hours").unix();
	return callback(doc2update);
}
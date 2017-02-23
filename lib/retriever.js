var x = require('x-ray')();
var db = require('./db-confg.js');
var moment = require('moment');
var postmeta_extract = {
		nodeID: 'link[rel=canonical]@href',
		pubdate: '.by-line .submitted',
		title: 'h1.page-header',
		views: '.statistics_counter',
		link: 'link[rel=canonical]@href',
		author: '.username',
		category: 'body@class',
		domain: '.domain@id',
		publisher: '.field-name-field-author .field-item.even',
		source: '.field-name-field-source-url .field-item.even'
		// description: '.field-name-field-feature-caption .field-item p', /////// do like what we did with automatically extracting the uuid string
		// comments: '.comment-count',
};
function scanLinks(err, obj){ // fx to scanLinks
	obj.links.forEach(function (links, index) {
		var nid = links.link;
		var tmpDomain = nid.slice(15,nid.search(".com"));
		nid = Number.parseInt(nid.slice(nid.lastIndexOf("-")+1));
		db.articlescollection.findOne({"nodeID":nid, "domain":tmpDomain}, function(err, doc) {
			if (!err) {
				if (!doc) { // executes if doc is not found
					x(links.link, postmeta_extract)(function(err, data) {
						if (!err) {
							cleaner(data, function(data) {
								db.insertArticle(data);
							});
						}
						else {
							console.log("ERROR ENCOUNTERED\n",err);
						}
					});
				}
				else { /* executes if doc is found */ 
					db.articlescollection.findOneAndUpdate({"nodeID": doc.nodeID, "domain": doc.domain},(doc),{upsert: true}, function(err,doc){
						// console.log(doc.value.nodeID," in ",doc.value.domain," updated")
					});
				}
			}
			else console.log("error encountered during query\n",err);
		})
		// if(index === links.length-1) console.log("---scaret end---");
		////// an alternate and much longer way of quering for a document -> check #longquery on "article-model.js" & "articles-server-controller.js"
		// articlesController.findOneArticle(nid, (err, result) =>{
		// 	console.log("result received",result);
		// 	// else console.log(err);
		// });
	})
};
exports.getArticles = (country,pagesToScan,startScanAt)=>{
	var lurl = 'http://www.loop' + country + '.com/section/all?page=';
	pagesToScan = Number.parseInt(pagesToScan);
	startScanAt = Number.parseInt(startScanAt);
	for (var i = startScanAt; i < (startScanAt+pagesToScan); i++) {
		var nurl = lurl+i;
		x(nurl,{
			links: x('.news-title>a', [{ link: '@href' }]) // exttract the links to crawl to
		})(function(err,obj) {scanLinks(err,obj)});
	}
}
exports.getUpdate = function(country) {
	switch(country) {
		case "png" :
			x("http://www.looppng.com/section/all",{
				links: x('.news-title>a', [{ link: '@href' }]) // exttract the links to crawl to
			})((err,obj)=>{scanLinks(err,obj);})
			break;
		case "pacific" :
			var countries = ['nauru','samoa','tonga','vanuatu'];
			countries.forEach((region)=>{
				x("http://www.loop"+region+".com/section/all",{
					links: x('.news-title>a', [{ link: '@href' }]) // exttract the links to crawl to
				})((err,obj)=>{scanLinks(err,obj);})
			})
			break;
		default :
			console.log("You're caught!")
			break;
	}
}

function cleaner (doc2update, callback) {
	var tx = doc2update.pubdate.slice(doc2update.pubdate.indexOf(",")-5, doc2update.pubdate.lastIndexOf(",")+6).split(", ");
	doc2update.domain = doc2update.domain.toLowerCase();
	doc2update.nodeID = Number.parseInt(doc2update.link.slice(doc2update.link.lastIndexOf("-")+1));
	doc2update.views = Number.parseInt(doc2update.views.replace(" reads",""));
	doc2update.category = doc2update.category.split("taxonomy-").reverse().shift().replace('-',' ');
	doc2update.pubdate = moment(new Date(tx[2]+", "+tx[1]+", "+tx[0])).subtract(10, "hours").unix();
	return callback(doc2update);
}
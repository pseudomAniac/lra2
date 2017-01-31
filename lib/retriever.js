var x = require('x-ray')();
var db = require('./db-confg.js');
var moment = require('moment');
var postmeta_extract = {
		nodeID: 'link[rel=canonical]@href',
		pubdate: '.by-line .submitted',
		title: 'h1.page-header',
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
	console.log("scanLinks() executed!");
	obj.links.forEach(function (links) {
		var nid = links.link;
		var tmpDomain = nid.slice(15,nid.search(".com"));
		console.log(tmpDomain);
		nid = Number.parseInt(nid.slice(nid.lastIndexOf("-")+1));
		db.articlescollection.findOne({"nodeID":nid, "domain":tmpDomain}, function(err, doc) {
			if (!err) {
				if (!doc) { // executes if doc is not found
					console.log("document not found, populating data");
					x(links.link, postmeta_extract)(function(err, data) {
						if (!err) {
							// clean before saving: start
							data.domain = data.domain.toLowerCase();
							var tmpLink = data.link;
							data.nodeID = Number.parseInt(tmpLink.slice(tmpLink.lastIndexOf("-")+1));
							data.category = data.category.split("taxonomy-").reverse().shift().replace('-',' ');
							var tmpPubDate = data.pubdate.slice(data.pubdate.indexOf(",")-5, data.pubdate.lastIndexOf(",")+6).split(", ");
							data.pubdate = new Date(tmpPubDate[2]+", "+tmpPubDate[1]+", "+tmpPubDate[0]);
							// var rawViews = data.views.replace("\n", "");
							// data.views = rawViews.split(" ")[6];
							// data.views = Number.parseInt(data.views);
							console.log(data);
							// clean before saving: end
							db.insertArticle(data);
						}
						else {
							console.log("ERROR ENCOUNTERED\n",err);
						}
					});
				}
				else { // executes if doc is found
					console.log("doc found - ",doc.nodeID);
				}
			}
			else console.log("error encountered during query\n",err);
		})
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
	console.log("retriver.getArticles() executed!\n",country,pagesToScan,startScanAt);
	for (var i = startScanAt; i < (startScanAt+pagesToScan); i++) {
		var nurl = lurl+i;
		console.log(nurl);
		x(nurl,{
			links: x('.news-title>a', [{ link: '@href' }]) // exttract the links to crawl to
		})(function(err,obj) {console.log(obj);scanLinks(err,obj)});
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

// exports.
// function scanLinks(err, obj) { // fx to scanLinks
// 	console.log("scanLinks() executed!");
// 	obj.links.forEach(function (links) {
// 		var nid = links.link;
// 		nid = Number.parseInt(nid.slice(nid.lastIndexOf("-")+1));
// 		db.articlescollection.findOne({"nodeID":nid}, function(err, doc) {
// 			if (!err) {
// 				if (!doc) { // executes if doc is not found
// 					console.log("document not found, populating data");
// 					x(links.link, postmeta_extract)(function(err, data) {
// 						if (!err) {
// 							// clean before saving: start
// 							tmpLink = data.link;
// 							data.nodeID = Number.parseInt(tmpLink.slice(tmpLink.lastIndexOf("-")+1));
// 							data.category = data.category.split("taxonomy-").reverse().shift().replace('-',' ');
// 							var tmpPubDate = data.pubdate.slice(data.pubdate.indexOf(",")-5, data.pubdate.lastIndexOf(",")+6).split(", ");
// 							data.pubdate = new Date(tmpPubDate[2]+", "+tmpPubDate[1]+", "+tmpPubDate[0]);
// 							var rawViews = data.views.replace("\n", "");
// 							data.views = rawViews.split(" ")[6];
// 							data.views = Number.parseInt(data.views);
// 							// clean before saving: end
// 							db.insertArticle(data);
// 						}
// 						else {
// 							console.log("ERROR ENCOUNTERED\n",err);
// 						}
// 					});
// 				}
// 				else { // executes if doc is found
// 					console.log("doc found - ",doc.nodeID);
// 				}
// 			}
// 			else console.log("error encountered during query\n",err);
// 		})
// 		////// an alternate and much longer way of quering for a document -> check #longquery on "article-model.js" & "articles-server-controller.js"
// 		// articlesController.findOneArticle(nid, (err, result) =>{
// 		// 	console.log("result received",result);
// 		// 	// else console.log(err);
// 		// });
// 	})
// };
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
							data.domain = data.domain.toLowerCase();
							var tmpLink = data.link;
							data.views = Number.parseInt(data.views.replace(" reads",""));
							data.nodeID = Number.parseInt(tmpLink.slice(tmpLink.lastIndexOf("-")+1));
							data.category = data.category.split("taxonomy-").reverse().shift().replace('-',' ');
							var tmpPubDate = data.pubdate.slice(data.pubdate.indexOf(",")-5, data.pubdate.lastIndexOf(",")+6).split(", ");
							data.pubdate = moment(new Date(tmpPubDate[2]+", "+tmpPubDate[1]+", "+tmpPubDate[0])).unix();
							if (typeof(data.nodeID) === NaN) console.log(data)
							// console.log("country: ",data.domain,"\tdoc: ",data.nodeID);
							db.insertArticle(data);
						}
						else {
							console.log("ERROR ENCOUNTERED\n",err);
						}
					});
				}
				else { /* executes if doc is found */ 
					db.articlescollection.findOneAndUpdate({"nodeID": doc.nodeID, "domain": doc.domain},(doc));
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
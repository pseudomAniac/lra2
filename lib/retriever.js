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
var db = require('./db-config'),
insert = Q.nbind(db.articlescollection.insert.bind(db.articlescollection)),
findOneAndUpdate = Q.nbind(db.articlescollection.findOneAndUpdate.bind(db.articlescollection));
// google analytics api auth + retrieve
var ganal = require('./ga-auth+retrieve.js');

exports.getArticles = (country,start,stop)=>{
	var lurl = 'http://www.loop' + country + '.com/section/all?page=';
	for (var i = start; i < (start+stop); i++) {
		var nurl = lurl+i;
		x(nurl,x(['.news-title>a@href']))((err,links)=>{ if(!err) scanLinks(err,links); });
	}
}
exports.automateDataRetrieval = (country,start,stop)=>{
  var url = "http://www.loop"+country+".com/section/all?page="+start;
  x(url,x(['.news-title>a@href']))((err,links)=>{ if(!err) scanLinks(err,links) })
  .paginate('li.pager-next>a@href')
  .limit(stop);
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
    		db.articlescollection.findOne({"link":link, "domain":domain}, function(err, doc) {
    			if (!err) {
    					x(link, postmeta_extract)(function(err, data) {
    						if (!err) {
    							cleaner(data, function(cleanedData) {
				    				if (!doc) { // executes if doc is not found
			    						console.log("created -", cleanedData.nodeID);
	    								insert(cleanedData);
				    				} else {
			    						ganal.setLinks(cleanedData.link)
				    					findOneAndUpdate({"nodeID": doc.nodeID, "domain": doc.domain},{$set:{"views":cleanedData.views,"pubdate":cleanedData.pubdate}},(err,doc)=>{
				    						console.log("updated -", doc.value.nodeID);
				    					});
				    				}
    							});
    						}
    						else {
    							console.log("ERROR ENCOUNTERED\n",err);
    						}
    					});
    			}
    			else console.log("ERROR ENCOUNTERED\n",err);
    		})
    	})
    }
};
function cleaner (doc2update, callback) {
	var tx = doc2update.pubdate.slice(doc2update.pubdate.indexOf(",")-5, doc2update.pubdate.lastIndexOf(",")+6);
	doc2update.domain = doc2update.domain.toLowerCase();
	doc2update.nodeID = Number.parseInt(doc2update.nodeID.split("/")[4]);
	doc2update.views = Number.parseInt(doc2update.views.replace(" reads",""));
	doc2update.category = doc2update.category.split("taxonomy-").reverse().shift().replace('-',' ');
	doc2update.pubdate = moment(moment(tx,"HH:mm, MMMM DD, YYYY").subtract(10,'hours')).unix();
	// console.log(moment.unix(doc2update.pubdate).format('HH:mm - DD/MM/YY'))
	return callback(doc2update);
}
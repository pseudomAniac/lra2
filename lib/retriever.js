var x = require('x-ray')();
var Q = require('q');
var moment = require('moment');
var postmeta_extract = {
		nodeID: 'link[rel=shortlink]@href', // article ID
		pubdate: '.by-line .submitted',			// article published date & time
		title: 'h1.page-header',						// article title
		views: '.statistics_counter',				// article views on website
		link: 'link[rel=canonical]@href',		// article url
		author: '.username',								// article author
		category: 'body@class',							// article category
		domain: '.domain@id',								// article on which loop
		publisher: '.field-name-field-author .field-item.even', // article publisher
		description: '.field-name-field-feature-caption .field-item p',
		source: '.field-name-field-source-url .field-item.even' // article source if any
		// comments: '.comment-count',
};
var db = require('./db-config'),
insert = Q.nbind(db.articlescollection.insert.bind(db.articlescollection)),
findOneAndUpdate = Q.nbind(db.articlescollection.findOneAndUpdate.bind(db.articlescollection));
// google analytics api auth + retrieve
var ganal = require('./ga-auth+retrieve.js');

exports.getArticles = (country,start,stop)=>{
	var lurl = 'http://www.loop' + country + '.com/section/all?page=';
	for (var i = start; i < stop; i++) {
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
// 1. link to scan
function scanLinks(err, links){ // fx to scanLinks
  if(!err){
// 2. loop links
  	links.forEach(function (link, index) {
// 2.1. scrape website data
			x(link, postmeta_extract)(function(err, data) { // retrieve data from website before deciding to update/create new document
        if (!err) { // data retrived successfully from website
          var domain = link.replace('loop','').split(".")[1]; // loopcountry
// 2.1.1. clean data
          cleaner(data, function(cleanedData) { // call the data cleaner function
// 2.1.2. check article in db
            db.articlescollection.findOne({"link":link, "domain":domain}, function(err, doc) {
              if (!err) {
                if (!doc) { // executes if doc is found in DB
// 2.1.2.1. if no records, then insert doc
                  console.log("created -", cleanedData.nodeID, "-", moment.unix(cleanedData.pubdate).format());
                  insert(cleanedData); // insert doc into DB
                } else { // executes if doc is found in DB
// 2.1.2.2. else update record
                  ganal.updateData(cleanedData.link,doc.nodeID,doc.domain,cleanedData.views); // send data to ganal fx for further processing and updating
                  findOneAndUpdate({"nodeID": doc.nodeID, "domain": doc.domain},{$set:{"views":cleanedData.views,"pubdate":cleanedData.pubdate}},(err,doc)=>{
                   console.log("updated -", doc.value.nodeID);
                  });
                }
              } else console.log("DATABASE QUERY ERROR ENCOUNTERED\n",err);
            })
          })
        } else console.log("WEBSITE SCRAPING ERROR ENCOUNTERED\n",err);
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
	doc2update.pubdate = moment.utc(tx,"HH:mm, MMMM DD, YYYY").subtract(10,'hours').unix();
	// console.log(moment.unix(doc2update.pubdate).format('HH:mm - DD/MM/YY'))
	return callback(doc2update);
}
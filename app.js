var express  = require('express'),
	xray = require('x-ray')(),
	authorsController 	= require('./server/controllers/authors-controller'),
	articlesController 	= require('./server/controllers/articles-server-controller'),
	Article  = require('./server/models/article-model'),
	bodyParser = require('body-parser'),
	// mongoose = require('mongoose'), // moved to ./db-confg.js
	// Q  			= require('q'), // moved to ./db-confg.js
	passport = require('passport'),
	localPass = require('passport-local'),
	serveStatic = require("serve-static"),
	config = require('./app/config.js'),
	myConf = require("./app/my-conf.js"),
	Lockit = require('lockit'),
	db = require('./lib/db-confg.js'),
	cookieSession = require('cookie-session'),
	cookieParser = require('cookie-parser'),
	app = express();
		
var lockit = new Lockit(config);
lockit.on('signup', function(user, res) {
	console.log('a news user has signed up:\t',user.name);
	res.send('welcome!');
})
lockit.on('login', function(user, res, target) {
	if (user) console.log(user);
	if (res) console.log(res);
	console.log('login success!');
	res.redirect(target);
});

var	postmeta_extract = {
		title: 'h1.page-header',
		link: 'link[rel=canonical]@href',
		author: '.field-name-field-author .field-item.even',
		description: '.field-name-field-feature-caption .field-item p',
		category: 'body@class',
		views: '.num-views',
		comments: '.comment-count', 
		publisher: '.username',
		source: '.field-name-field-source-url .field-item.even',
		pubdate: '.by-line .submitted'
	};

var counter	= 0, today = myConf.printDate();

app.get('/write/:country', function (req, res){
  var country = req.params.country;
	retrieve(country,8,0);
    res.redirect('/page/'+country);
});
// api call to get stories
app.get('/articles/:country', articlesController.listArticles);
app.get('/page/:country', function (req, res){
	myConf.printDate();
	res.render(__dirname + '/client/views/'+req.params.country);
});
// uri call to get top 5 stories
app.get('/top/:country', articlesController.top5);
app.get("/top-5/:country", function (req, res) {
	myConf.printDate();
	res.render(__dirname + "/client/views/" + req.params.country + "-top-5");
});
// api call to export stories 
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);
// api call to populate stories
app.get("/populate", function (req, res) {
	res.render(__dirname + "/client/views/populate")
});
app.get("/populate/content/", function (req, res) {
	var country = req.query.country.toLowerCase(), pagesToScan = req.query.pages, startScanAt = req.query.counter;
	retrieve(country, pagesToScan, startScanAt)
	res.redirect("/page/"+country);
});
app.get('/delete/:country', function (req, res){
	var country = req.params.country, pagesToScan = 8, startScanAt = 0;
	switch (country) {
		case 'nauru':
			db.naurucollection.drop();
			retrieve("nauru",pagesToScan,startScanAt);
			break;
		case 'png':
			db.pngcollection.drop();
			retrieve("png",pagesToScan,startScanAt);
			break;
		case 'samoa':
			db.samoacollection.drop();
			retrieve("samoa",pagesToScan,startScanAt);
			break;
		case 'tonga':
			db.tongacollection.drop();
			retrieve("tonga",pagesToScan,startScanAt);
			break;
		case 'vanuatu':
			db.vanuatucollection.drop();
			retrieve("vanuatu",pagesToScan,startScanAt);
			break;
		case 'all':
			db.naurucollection.drop();
			retrieve("nauru",pagesToScan,startScanAt);
			db.pngcollection.drop();
			retrieve("png",pagesToScan,startScanAt);
			db.samoacollection.drop();
			retrieve("samoa",pagesToScan,startScanAt);
			db.tongacollection.drop();
			retrieve("tonga",pagesToScan,startScanAt);
			db.vanuatucollection.drop();
			retrieve("vanuatu",pagesToScan,startScanAt);
			break;
		default:
			break;
	}
	myConf.printDate();
	res.redirect('/');
});
app.get('/', function (req, res){
	res.render(__dirname + '/client/views/png');
	myConf.printDate();
});
app.get('/home', function(req, res) {
	res.render(__dirname + '/client/views/index');
});

// functions - retrieve
function retrieve(country,pagesToScan,startScanAt) {
	var lurl = "";
	pagesToScan = Number.parseInt(pagesToScan);
	startScanAt = Number.parseInt(startScanAt);
	switch (country) {
		case 'nauru':
			db.naurucollection.drop();
		case 'png':
			db.pngcollection.drop();
		case 'samoa':
			db.samoacollection.drop();
		case 'tonga':
			db.tongacollection.drop();
		case 'vanuatu':
			db.vanuatucollection.drop();
		default:
			lurl = 'http://www.loop' + country + '.com/section/all?page=';
			break;
	}
	for (var i = startScanAt; i < (startScanAt+pagesToScan); i++) {
		var nurl = lurl+i;
		// console.log(country,'info collection', i);
		xray(nurl,{
			links: xray('.news-title>a', [{ link: '@href' }]) // exttract the links to crawl to
		})(function (err, obj) { // function catching links passed from previous fx
			if (!err) {
				obj.links.forEach(function (link) {
					xray(link.link, postmeta_extract)(function (err, data) {
					 if (!err) {
						// clean before saving: author
						var tmpAuthor = data.author.split(" ");
						if(tmpAuthor[0] === " ") {
							while (tmpAuthor[0] === " ") {
								tmpAuthor.pop(0);
							}
						}
						if(tmpAuthor[tmpAuthor.length-1] === " ") {
							while (tmpAuthor[tmpAuthor.length-1] === " " ) {
								tmpAuthor.length = tmpAuthor.length-1;
							}
						}
						data.author = tmpAuthor [0] + " " + tmpAuthor[1];								
						// clean before saving: category
						var tmpCat = data.category.split(" ");
						data.category = tmpCat[tmpCat.length - 1].replace("taxonomy-", "");
						// clean before saving: date published
						var tmpPubDate = data.pubdate.slice(data.pubdate.search(",") + 2, 100),
							cleaned = tmpPubDate.slice(0, tmpPubDate.search(",") + 6);
						data.pubdate = cleaned.replace(",", "");
						// clean before saving: views
						var rawViews = data.views.replace("\n", "");
						data.views = rawViews.split(" ")[6];
						data.views = Number.parseInt(data.views);
						switch (country) {
							case 'nauru':
								db.insertNauruArticle(data);
								break;
							case 'png':
								db.insertPNGArticle(data);
								break;
							case 'samoa':
								db.insertSamoaArticle(data);
								break;
							case 'tonga':
								db.insertTongaArticle(data);
								break;
							default:
								db.insertVanuatuArticle(data);
								break;
						}
					 }
					});
				});
			}
		});
	}
}

// app.use & app.set codes
app.set('views',__dirname + '/client/views');
app.set("view engine",'ejs');
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use('/client/js', express.static(__dirname + '/client/js'));
app.use('/server/js', express.static(__dirname + '/server/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({ secret: 'monobelle' }));
app.use(lockit.router);
app.use(serveStatic("/public"));
app.use(serveStatic("/public/img"));


app.set("environment", (process.env.NODE_ENV="development"));
console.log(app.get("environment"))

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
})
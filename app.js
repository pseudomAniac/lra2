var express  = require('express'),
	compression = require("compression"),
	xray = require('x-ray')(),
	authorsController 	= require('./server/controllers/authors-controller'),
	articlesController 	= require('./server/controllers/articles-server-controller'),
	Article  = require('./server/models/article-model'),
	bodyParser = require('body-parser'),
	// passport = require('passport'),
	// FacebookStrategy = require("passport-facebook"),
	// LocalStrategy = require('passport-local').Strategy,
	serveStatic = require("serve-static"),
	myConf = require("./app/my-conf.js"),
	db = require('./lib/db-confg.js'),
	cookieSession = require('cookie-session'),
	cookieParser = require('cookie-parser'),
	app = express();
var	postmeta_extract = {
	pubdate: '.by-line .submitted',
	title: 'h1.page-header',
	link: 'link[rel=canonical]@href',
	uuid: 'link[rel=shortlink]@href',
	description: '.field-name-field-feature-caption .field-item p',
	author: '.username',
	category: 'body@class',
	views: '.num-views'
	// author: '.field-name-field-author .field-item.even',
	// comments: '.comment-count',
	// source: '.field-name-field-source-url .field-item.even',
};
var counter	= 0;
app.post("/", function (req, res) {
	res.redirect("/deeplink-me");
});
app.get('/uuid/:url', function(req, res) {
	var url = 'http://www.looppng.com/content/'+req.params.url;
	url = decodeURI(url);
	xray(url, {uuid: 'link[rel=shortlink]@href'})(function (err, data) {
		var uuid = data.uuid.split("/");
		uuid = (uuid[uuid.length-1]);
		res.json({uuid:Number.parseInt(uuid)});
	});
});
app.get('/write/:country', function (req, res){
  var country = req.params.country;
	retrieve(country,8,0);
	res.redirect('/page/'+country);
});
// api call to get stories
app.get('/articles/:country', articlesController.listArticles);
app.get('/page/:country', function (req, res){
	// myConf.printDate();
	res.render(__dirname + '/client/views/'+req.params.country);
});
// uri call to get top 5 stories
app.get('/top/:country', articlesController.top5);
app.get("/top-5/:country", function (req, res) {
	// myConf.printDate();
	res.render(__dirname + "/client/views/" + req.params.country + "-top-5");
});
// api call to export stories 
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);
// api call to populate stories
app.get("/populate", function (req, res) {
	res.render(__dirname + "/client/views/populate")
});
app.get("/deeplink-me", function(req, res) {
	res.render(__dirname + '/client/views/deeplink-me');
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
			res.redirect('/page/nauru');
			break;
		case 'png':
			db.pngcollection.drop();
			retrieve("png",pagesToScan,startScanAt);
			res.redirect('/page/png');
			break;
		case 'samoa':
			db.samoacollection.drop();
			retrieve("samoa",pagesToScan,startScanAt);
			res.redirect('/page/samoa');
			break;
		case 'tonga':
			db.tongacollection.drop();
			retrieve("tonga",pagesToScan,startScanAt);
			res.redirect('/page/tonga');
			break;
		case 'vanuatu':
			db.vanuatucollection.drop();
			retrieve("vanuatu",pagesToScan,startScanAt);
			res.redirect('/page/vanuatu');
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
	// myConf.printDate();
	res.redirect('/');
});
app.get('/', function (req, res){
	res.render(__dirname + '/client/views/png');
	// myConf.printDate();
});
app.get('/home', function(req, res) {
	res.render(__dirname + '/client/views/index');
});

// functions - retrieve 
function retrieve(country,pagesToScan,startScanAt) {
	var lurl = 'http://www.loop' + country + '.com/section/all?page=';
	pagesToScan = Number.parseInt(pagesToScan);
	startScanAt = Number.parseInt(startScanAt);
	// console.log(country)
	switch (country) {
		case 'nauru':
			db.naurucollection.drop();
			break;
		case 'png':
			db.pngcollection.drop();
			break;
		case 'samoa':
			db.samoacollection.drop();
			break;
		case 'tonga':
			db.tongacollection.drop();
			break;
		case 'vanuatu':
			db.vanuatucollection.drop();
			break;
		default:
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
						// clean before saving: category
						var nodeID = data.uuid.split("/");
						data.uuid = nodeID[nodeID.length-1];
						// clean before saving: category
						data.category = data.category.split(" ");
						data.category = data.category.slice(10);
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
app.use(compression());
app.use(serveStatic("/css/*.*"));
app.use(serveStatic("/js/*.*"));
app.use(serveStatic("/img/*.*"));
app.use(serveStatic("/client/js/*.*"));
app.use(serveStatic("/server/js/*.*"));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log("app started at " + app.get('port')); })
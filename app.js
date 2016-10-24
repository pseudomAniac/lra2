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
app.post("/", function (req, res) {
	res.redirect("/populate");
});
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
	console.log(country)
	switch (country) {
		case 'nauru':
			lurl = 'http://www.loopnauru.com/section/all?page=';
			db.naurucollection.drop();
			break;
		case 'png':
			lurl = 'http://wwwpng.com/section/all?page=';
			db.pngcollection.drop();
			break;
		case 'samoa':
			lurl = 'http://www.loopsamoa.com/section/all?page=';
			db.samoacollection.drop();
			break;
		case 'tonga':
			lurl = 'http://www.looptonga.com/section/all?page=';
			db.tongacollection.drop();
			break;
		case 'vanuatu':
			lurl = 'http://www.loopvanuatu.com/section/all?page=';
			db.vanuatucollection.drop();
			break;
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
						// if (data.author.charAt(0) === " " || data.author.charAt(data.author.length-1) === " ") {
						// 	var tmpAuthor = data.author.split(" ");
						// 	if(tmpAuthor[0] === " ") {
						// 		// while (tmpAuthor[0] === " ") {
						// 			tmpAuthor.shift();
						// 		// }
						// 	}
						// 	if(tmpAuthor[tmpAuthor.length-1] === " ") {
						// 		// while (tmpAuthor[tmpAuthor.length-1] === " " ) {
						// 			tmpAuthor.pop();
						// 		// }
						// 	}
						// 	data.author = tmpAuthor [0] + " " + tmpAuthor[1];															
						// }
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

// // passport config
// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
// 	// Successful authentication, redirect home.
// 	res.redirect('/');
//   });
// app.get("/user", function(req, res) {
// 	res.redirect(__dirname + "/client/views/populate")
// })
// app.get("/login", function(req, res) {
// 	res.render(__dirname + "/client/views/lockit/login");
// });
// app.post("/login", passport.authenticate("local", {
// 		successRedirect: "/populate",
// 		failureRedirect: "/login",
// 		failureFlash: true
// 	}),
// 	function(req, res) {
// 		res.redirect("/user");
// 	}
// )
// passport.use(new LocalStrategy(
//  {
// 	usernameField: 'username',
// 	passwordField: 'password',
// 	passReqToCallback: true,
// 	session: false
// }, 
// function (username, password, done) {
// 	Users.findOne({username: req.username}, function (err, user) {
// 		return done(null, user);
// 	})
// 	/* User.findOne({username: username}, function(err, user) {
// 		if (err) return done(err);
// 		if (!user) return done(null, false);
// 		if (!user.verifyPassword(password)) return done(null, false);
// 		return done(null, user); */
// }
// 	/* clientID: 178270979235562,
// 	clientSecret: "c82b7d570de1d13beb131cd89bc81c4d",
// 	callbackURL: "http://localhost:3000/auth/facebook/callback"
// }), function(accessToken, refreshToken, profile, cb) {
// 	User.findOrCreate({ facebookId: profile.id }, function(err, user) {
// 		return cb(err, user);
// 	}) */
// ));

  
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
app.use(serveStatic("/public"));
app.use(serveStatic("/public/img"));

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
})
var express 						= require('express'),
		xray								= require('x-ray')(),
		authorsController 	= require('./server/controllers/authors-controller'),
		articlesController 	= require('./server/controllers/articles-server-controller'),
		Article 						= require('./server/models/article-model'),
		bodyParser 					= require('body-parser'),
		mongoose						= require('mongoose'),
		Q 									= require('q'),
		passport = require('passport'),
		localPass = require('passport-local'),
//		config 								= require('./app/config.js'),
		myConf								= require("./app/my-conf.js"),
//		Lockit								= require('lockit'),
		cookieSession						= require('cookie-session'),
		cookieParser						= require('cookie-parser'),
		app 								= express();
		
// ================================================= //
//               mongoose configurations             //
// ================================================= //
// var dbUri = 'mongodb://127.0.0.1:27017/lra'; // local - dev
var dbUri = 'mongodb://reader_loopcount_db:readloopcount@ds019980.mlab.com:19980/heroku_gt6n53cm';

mongoose.connect(dbUri);
var conn = mongoose.connection;

// connect to respective collections
var naurucollection 	= conn.collection('nauruarticles'),
		pngcollection 		= conn.collection('pngarticles'),
		samoacollection 	= conn.collection('samoaarticles'),
		tongacollection 	= conn.collection('tongaarticles'),
		vanuatucollection	= conn.collection('vanuatuarticles');
var insertNauruArticle		= Q.nfbind(naurucollection.insert.bind(naurucollection)),
		insertPNGArticle			= Q.nbind(pngcollection.insert.bind(pngcollection)),
		insertSamoaArticle		= Q.nbind(samoacollection.insert.bind(samoacollection)),
		insertTongaArticle		= Q.nbind(tongacollection.insert.bind(tongacollection)),
		insertVanuatuArticle	= Q.nbind(vanuatucollection.insert.bind(vanuatucollection));

var	sampleArticle = {
		title: "Article Title",
		author: "Sample Article Author",
		views: 284,
		publisher: "Sample Article Publisher",
		pubdate: "March 22 2016"
	},
	postmeta_extract = {
		title: 'h1.page-header',
		link: 'link[rel=canonical]@href',
		author: '.field-name-field-author .field-item.even',
		category: 'body@class',
		views: '.num-views',
		comments: '.comment-count', 
		publisher: '.username',
		source: '.field-name-field-source-url .field-item.even',
		pubdate: '.by-line .submitted'
	};

var counter	= 0;

app.get('/write/:country', function (req, res){
    var country = req.params.country, lurl = 'http://www.looppng.com/section/all?page=', nurl = '';
	retrieve(country,lurl,25,0);
    res.redirect('/page/'+country);
});

app.get('/', function (req, res){
	res.render(__dirname + '/client/views/png');
	myConf.printDate();
});

app.get('/home', function(req, res) {
	res.render(__dirname + '/client/views/index');
});

// api call to get stories
app.get('/articles/:country', articlesController.listArticles); 

// api call to export stories 
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);

// uri call to render pages
app.get('/page/:country', function (req, res){
	myConf.printDate();
	res.render(__dirname + '/client/views/'+req.params.country);
});

app.get("/page/:country/top5", function (req, res) {
	myConf.printDate();
	res.render(__dirname + "/client/views/" + req.params.country + "-top-5");
});

app.get("/populate", function (req, res) {
	res.render(__dirname + "/client/views/populate")
});

app.get("/populate/content/", function (req, res) {
	var country = req.query.country.toLowerCase(), pages = req.query.pages, counter = req.query.counter;
	retrieve(country, pages, counter)
	res.redirect("/page/"+country);
});

app.get('/delete/:country', function (req, res){
	var country = req.params.country;
	switch (country) {
		case 'nauru':
			naurucollection.drop();
			retrieve("nauru",25,0);
			break;
		case 'png':
			pngcollection.drop();
			retrieve("png",25,0);
			break;
		case 'samoa':
			samoacollection.drop();
			retrieve("samoa",25,0);
			break;
		case 'tonga':
			tongacollection.drop();
			retrieve("tonga",25,0);
			break;
		case 'vanuatu':
			vanuatucollection.drop();
			retrieve("vanuatu",25,0);
			break;
		case 'all':
			naurucollection.drop();
			retrieve("nauru",25,0);
			pngcollection.drop();
			retrieve("png",25,0);
			samoacollection.drop();
			retrieve("samoa",25,0);
			tongacollection.drop();
			retrieve("tonga",25,0);
			vanuatucollection.drop();
			retrieve("vanuatu",25,0);
		default:
			break;
	}
	myConf.printDate();
	res.redirect('/');
});

// functions

function retrieve(country,pages,counter) {
	var lurl = "";
	switch (country) {
		case 'nauru':
		case 'png':
		case 'samoa':
		case 'tonga':
		case 'vanuatu':
			lurl = 'http://www.loop' + country + '.com/section/all?page=' + counter;
			break;
		default:
			lurl = 'http://www.looppng.com/section/all?page=';
	}
	// generate links to source publication data from
	for (var i=counter; i<counter+pages; i++) {
		var nurl = lurl+i;
		console.log(country,'info collection',i);
		xray(nurl,{
			links: xray('.news-title>a', [{ link: '@href' }]) // get the links to crawl to
		})(function (err, obj) { // function passing links
			if (!err) {
				obj.links.forEach(function (link) {
					xray(link.link, postmeta_extract)(function (err, data) {
						if (!err) {
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
							switch (country) {
								case 'nauru':
									insertNauruArticle(data);
									break;
								case 'png':
									insertPNGArticle(data);
									break;
								case 'samoa':
									insertSamoaArticle(data);
									break;
								case 'tonga':
									insertTongaArticle(data);
									break;
								default:
									insertVanuatuArticle(data);
									break;
							}
						}
					});
				});
			}
		});
	}
	//return callback("done")
}

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

// var lockit = new Lockit(config);
// app.use(lockit.router);
/* 
lockit.on('signup', function(user, res) {
	console.log('a news user has signed up');
	res.send('welcome!');
})
lockit.on('login', function(user, res, target) {
	if (user) console.log(user);
	if (res) console.log(res);
	console.log('login success!');
	res.redirect(target);
});
 */
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
})
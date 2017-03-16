var express  = require('express'),
	x = require('x-ray')(),
	moment = require('moment'),
	q = require('q'),
	articlesController 	= require('./server/controllers/articles-server-controller'),
	retriever = require("./lib/retriever"),
	timeout = require("./lib/timeouts"),
	compression = require("compression"),
	serveStatic = require("serve-static"),
	bodyParser = require('body-parser'),
	cookieSession = require('cookie-session'),
	cookieParser = require('cookie-parser'),
	app = express();

// var dataRet = setInterval(()=>{
// 	if(globalCounter<globalLimit) {
// 		retriever.automateDataRetrieval(globalCountry,1,globalCounter);
// 		globalCounter++;
// 		console.log(globalCountry,globalCounter,globalLimit)
// 	} else { 
// 		console.log(globalCounter,"end reached.");
// 		clearInterval(dataRet);
// 		// setInterval(()=>{
// 		// 	// call fx to check for recent updates to the story links array
// 		// 	console.log('getUpdate("png")')
// 		// 	retriever.getUpdate("png");
// 		// }, (1000*60*15));
// 		// setInterval(()=>{
// 		// 	// call fx to check for recent updates to the story links array
// 		// 	console.log('getUpdate("pacific")')
// 		// 	retriever.getUpdate("pacific");
// 		// }, (1000*60*60*2));
// 	}
// },(1000*15))

app.post("/", function(req, res) {
	res.redirect("/populate");
});
app.get('/', function(req, res) {
	console.log("POP_COUNTER - ",process.env.POP_COUNTER);
	res.render('articles');
});
app.get('/write/:country', function(req, res) {
  var country = req.params.country;
	retriever.getArticles(country,8,0);
	res.redirect('/page/'+country);
});
// api call to get stories
app.get('/articles/:country', articlesController.listArticles);
app.get('/page/:country', function(req, res){res.render(req.params.country)});
// uri call to get top 5 stories
app.get('/top/:country', articlesController.top5);
app.get("/top-5/:country", function(req, res) {res.render(req.params.country + "-top-5")});
// api call to export stories
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);
app.get('/search', (req, res) => {res.render("search")});
app.get('/query/', articlesController.queryArticles);
app.get('/api/query/', (req,res) => {res.render('query')});
// api call to populate stories
app.get("/populate", (req, res) => {res.render('populate')});
app.get("/populate/content/", function(req, res) {
	var country = req.query.country.toLowerCase(), pagesToScan = req.query.pages, startScanAt = req.query.counter;
	retriever.getArticles(country,pagesToScan,startScanAt);
	res.redirect("/page/"+country);
});
app.get("/populate/auto/", (req, res) => {
	console.log(req.query);
	var li = req.query.limit,
	cy = req.query.country,
	cr = Number.parseInt(req.query.counter);
	timeout.activateRetrieval(cy,cr,li);
	res.redirect('/page/'+cy);
});
// app.get('/dashboard', function(req, res) {
// 	res.render('index');
// });
// app.get("/force-update/", function(req,res) {
// 	var country = req.query.country.toLowerCase()
// 	retriever.getUpdate(country);
// 	res.redirect('/');
// 	// res.render(__dirname + "/client/views/articles");
// });

// app.use & app.set codes
app.set('views',__dirname + '/client/views');
app.set("view engine",'ejs');
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/client/js', express.static(__dirname + '/client/js'));
app.use('/server/js', express.static(__dirname + '/server/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(cookieSession({ secret: 'monobelle' }));
app.use(compression());
app.use(serveStatic("/public/*/*"));
app.use(serveStatic("/css/*.*"));
app.use(serveStatic("/js/*.*"));
app.use(serveStatic("/img/*.*"));
app.use(serveStatic("/client/js/*.*"));
app.use(serveStatic("/server/js/*.*"));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log("app started at port " + app.get('port')); });

// module.export = express;
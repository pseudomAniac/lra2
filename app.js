var express  = require('express'),
	x = require('x-ray')(),
	moment = require('moment'),
	q = require('q'),
	articlesController 	= require('./server/controllers/articles-server-controller'),
	retriever = require("./lib/retriever"),
	compression = require("compression"),
	serveStatic = require("serve-static"),
	bodyParser = require('body-parser'),
	cookieSession = require('cookie-session'),
	cookieParser = require('cookie-parser'),
	app = express();
app.post("/", function(req, res) {
	res.redirect("/populate");
});
app.get('/', function(req, res) {
	res.render(__dirname + '/client/views/articles');
});
app.get('/write/:country', function(req, res) {
  var country = req.params.country;
	retriever.getArticles(country,8,0);
	res.redirect('/page/'+country);
});
// api call to get stories
app.get('/articles/:country', articlesController.listArticles);
app.get('/page/:country', function(req, res){
	res.render(__dirname + '/client/views/'+req.params.country);
});
// uri call to get top 5 stories
app.get('/top/:country', articlesController.top5);
app.get("/top-5/:country", function(req, res) {
	res.render(__dirname + "/client/views/" + req.params.country + "-top-5");
});
// api call to export stories
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);
// app.get('/export/', articlesController.exportArticles);
app.get('/query/', articlesController.queryArticles);
// api call to populate stories
app.get("/populate", function(req, res) {
	res.render(__dirname + "/client/views/populate")
});
app.get("/populate/content/", function(req, res) {
	var country = req.query.country.toLowerCase(), pagesToScan = req.query.pages, startScanAt = req.query.counter;
	retriever.getArticles(country,pagesToScan,startScanAt);
	res.redirect("/page/"+country);
});
app.get('/dashboard', function(req, res) {
	res.render(__dirname + '/client/views/index');
});
app.get("/force-update/", function(req,res) {
	var country = req.query.country.toLowerCase()
	retriever.getUpdate(country);
	res.redirect('/');
	// res.render(__dirname + "/client/views/articles");
});
setInterval(function() {
	// call fx to check for recent updates to the story links array
	console.log('getUpdate("png")')
	retriever.getUpdate("png");
}, (1000*60*15));
setInterval(function() {
	// call fx to check for recent updates to the story links array
	console.log('getUpdate("pacific")')
	retriever.getUpdate("pacific");
}, (1000*60*60*1));

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
var express  = require('express'),
	x = require('x-ray')(),
	moment = require('moment'),
	q = require('q'),
	articlesController 	= require('./server/controllers/articles-server-controller'),
	retriever = require('./lib/retriever'),
	timeout = require('./lib/timeouts'),
	compression = require('compression'),
	serveStatic = require('serve-static'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	session = require('express-session'),
	app = express();
// initializations
app.use(morgan('dev'));
app.use(session({
	secret: "monobelle",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
}));
app.set('views',__dirname + '/client/views');
app.set('view engine','ejs');
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/client/js', express.static(__dirname + '/client/js'));
app.use('/server/js', express.static(__dirname + '/server/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.json());
app.use(compression());
app.use(serveStatic('/public/*/*'));
app.use(serveStatic('/css/*.*'));
app.use(serveStatic('/js/*.*'));
app.use(serveStatic('/img/*.*'));
app.use(serveStatic('/client/js/*.*'));
app.use(serveStatic('/server/js/*.*'));
// // routes: google analytics
// var gaRouter = express.Router();
// gaRouter.get('/oauthcallback?:code',(req,res)=>{
// 	var code = req.params.code;
// 	console.log('req.params',req.params);
// 	// queryData(ga);
// 	console.log('authentic');
// 	res.render('png');
// })
// gaRouter.get('/test', (req,res)=>{
// 	console.log('/test route accessed.')
// 	// queryData(ga);
// 	res.render('search')
// })
// app.use('/ga',gaRouter);
// http requests
app.post('/', function(req, res) {
	res.redirect('/populate');
});
app.get('/', function(req, res) {
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
app.get('/top-5/:country', function(req, res) {res.render(req.params.country + '-top-5')});
// api call to export stories
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);
app.get('/search', (req, res) => {res.render('search')});
app.get('/query/', articlesController.queryArticles);
app.get('/api/query/', (req,res) => {res.render('query')});
// api call to populate stories
app.get('/populate', (req, res) => {res.render('populate')});
app.get('/populate/content/', function(req, res) {
	var country = req.query.country.toLowerCase(), start = Number.parseInt(req.query.start), stop = Number.parseInt(req.query.stop);
	retriever.getArticles(country,start,stop);
	res.redirect('/page/'+country);
});
app.get('/populate/auto/', (req, res) => {
	var start = Number.parseInt(req.query.start),
	stop = Number.parseInt(req.query.counter),
	country = req.query.country.toLowerCase();
	timeout.activateRetrieval(country,start,stop);
	res.redirect('/page/'+country);
});
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('app started at port ' + app.get('port')); });

// module.exports = express;
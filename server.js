var express 						= require('express'),
		csv									=	require('express-csv'),
		fs 									= require('fs'),
		// request 						= require('request'),
		// cheers	 						= require('cheers2'),
		// xphantom						= require('x-ray-phantom'),
		xray								= require('x-ray')(),
		authorsController 	= require('./server/controllers/authors-controller'),
		articlesController 	= require('./server/controllers/articles-server-controller'),
		Article 						= require('./server/models/article-model'),
		bodyParser 					= require('body-parser'),
		mongoose						= require('mongoose'),
		mongodb							= require('mongodb'),
		Q 									= require('q'),
		app 								= express();

var dbUri = 'mongodb://127.0.0.1:27017/loopscraper';
// mongoose configurations
mongoose.connect(dbUri);
var conn = mongoose.connection;
// // // connect to respective collections
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

var counter						=0,
		sampleArticle 		=
			{
				title: "Article Title",
				author: "Sample Article Author",
				views: 284,
				publisher: "Sample Article Publisher",
				pubdate: "March 22 2016"
			},
		postmeta_extract 	=
			{
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

// // var findNauruArticle		= Q.nbind(Article.nauruArticlesModel.find, Article.nauruArticlesModel);
// app.get('/pacific', function (req, res)
// {
// 	// xray(link, selector)
// 	xray('http://www.loopnauru.com/section/all?page=0','#views-bootstrap-grid-1 .news-title>a', [{links: '@href'}])
// 	.paginate('.pager-next>a@href')
// 	.limit(3)
// 	(function (err, obj) {
// 		// xray(obj.links)
// 		console.log(obj);
// 		// console.log(obj.links);
// 		if(obj !== null)
// 			insertNauruArticle(obj);
// 		// setTimeout(function() {res.redirect('/page/nauru');}, 10000);
// 		setTimeout(function() {res.send(obj);}, 1000);
// 	})
// });
// app.get('/write/test', function (req,res)
// {
// 	var x = xray().driver(xphantom);

// 	x('http://www.looppng.com', '.')(function(err, str) {
// 	  // if (err) res.send(err);
// 	  console.log(str);
// 	  // res.send(str);
// 	  // done();
// 	})
// });
// // depreciated DB write code
// app.get('/write/nauru/test', function (req, res)
// {
// 	function getInsertedArticle (article) {
// 		return insertNauruArticle(article);
// 	}
// 	var lurl = 'http://www.looptonga.com/section/all?page=0';
// 		xray(lurl, {
// 			links: xray('.news-title>a',[{ link: '@href' }])
// 		})
// 		(function (err, obj)
// 		{ // function passing links
// 			console.log(obj);
// 			obj.links.forEach(function (link)
// 			{
// 				console.log(link.title);
// 				xray(link.link, {
// 					title: 'h1.page-header',
// 					link: 'link[rel=canonical]@href',
// 					author: '.field-name-field-author .field-item.even',
// 					views: '.num-views',
// 					publisher: '.username',
// 					source: '.field-name-field-source-url .field-item.even',
// 					pubdate: '.by-line .submitted'
// 				})(function (err,data)
// 				{
// 					// clean before saving: date published
// 					var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
// 					cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
// 					data.pubdate = cleaned.replace(",","");
// 					// clean before saving: views
// 					var rawViews = data.views.replace("\n","");
// 					data.views = rawViews.split(" ")[6];
// 					getInsertedArticle(data);//.then(function (err, result) {console.log(result); res.send('saved to db');});
// 				})
// 			});
// 		})
// 		// .paginate('.pager-next>a@href')
// 		// .limit(3)
// 		res.redirect('/page/nauru');
// });

app.get('/write/nauru', function (req, res)
{
	var lurl = 'http://www.loopnauru.com/section/all?page=0';
	// generate links to source publication data from
	for (var i=counter; i<counter+12; i++) {
		lurl = 'http://www.loopnauru.com/section/all?page='+i;
		console.log("Collecting Info: Page ",i);
		xray(lurl,
		{
			links: xray('.news-title>a',[{ link: '@href' }]) // get the links to crawl to
		})(function (err, obj)
		{ // function passing links
			if(!err) {
				obj.links.forEach(function (link)
				{
					xray(link.link, postmeta_extract)(function (err,data)
					{
						if(!err)
						{
							// clean before saving: category
							var tmpCat = data.category.split(" ");
							data.category = tmpCat[tmpCat.length-1].replace("taxonomy-","");
							// clean before saving: date published
							var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
							cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
							data.pubdate = cleaned.replace(",","");
							// clean before saving: views
							var rawViews = data.views.replace("\n","");
							data.views = rawViews.split(" ")[6];
							insertNauruArticle(data);
						}
					})
				});
			}
		})
	}
	res.redirect('/page/nauru');
});

app.get('/write/samoa', function (req, res)
{
	var lurl = 'http://www.loopjamaica.com/section/all?page=0';
	// generate links to source publication data from
	for (var i=counter; i<counter+12; i++) {
		lurl = 'http://www.loopsamoa.com/section/all?page='+i;
		console.log("Collecting Info: Page ",i);
		xray(lurl,
		{
			links: xray('.news-title>a',[{ link: '@href' }])
		})(function (err, obj)
		{ // function passing links
			if(!err) {
				obj.links.forEach(function (link)
				{
					xray(link.link, postmeta_extract)(function (err,data)
					{
						if(!err)
						{
							// clean before saving: category
							var tmpCat = data.category.split(" ");
							data.category = tmpCat[tmpCat.length-1].replace("taxonomy-","");
							// clean before saving: date published
							var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
							cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
							data.pubdate = cleaned.replace(",","");
							// clean before saving: views
							var rawViews = data.views.replace("\n","");
							data.views = rawViews.split(" ")[6];
							insertSamoaArticle(data); // inserts data into the database
						}
					})
				});
			}
		})
	}
	res.redirect('/page/samoa');
});

app.get('/write/tonga', function (req, res)
{
	var lurl = 'http://www.loopjamaica.com/section/all?page=0';
	// generate links to source publication data from
	for (var i=counter; i<counter+12; i++) {
		lurl = 'http://www.loopsamoa.com/section/all?page='+i;
		console.log("Collecting Info: Page ",i);
		xray(lurl,
		{
			links: xray('.news-title>a',[{ link: '@href' }])
		})(function (err, obj)
		{ // function passing links
			if(!err) {
				obj.links.forEach(function (link)
				{
					xray(link.link, postmeta_extract)(function (err,data)
					{
						if(!err)
						{
							// clean before saving: category
							var tmpCat = data.category.split(" ");
							data.category = tmpCat[tmpCat.length-1].replace("taxonomy-","");
							// clean before saving: date published
							var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
							cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
							data.pubdate = cleaned.replace(",","");
							// clean before saving: views
							var rawViews = data.views.replace("\n","");
							data.views = rawViews.split(" ")[6];
							insertTongaArticle(data); // inserts data into the database
						}
					})
				});
			}
		})
	}
	res.redirect('/page/tonga');
});

app.get('/write/vanuatu', function (req, res)
{
	var lurl = 'http://www.loopvanuatu.com/section/all?page=0';
	// generate links to source publication data from
	for (var i=counter; i<counter+12; i++) {
		lurl = 'http://www.loopvanuatu.com/section/all?page='+i;
		console.log("Collecting Info: Page ",i);
		xray(lurl,
		{
			links: xray('.news-title>a',[{ link: '@href' }])
		})(function (err, obj)
		{ // function passing links
			if(!err) {
				obj.links.forEach(function (link)
				{
					xray(link.link,postmeta_extract)(function (err,data)
					{
						if(!err)
						{
							// clean before saving: category
							var tmpCat = data.category.split(" ");
							data.category = tmpCat[tmpCat.length-1].replace("taxonomy-","");
							// clean before saving: date published
							var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
							cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
							data.pubdate = cleaned.replace(",","");
							// clean before saving: views
							var rawViews = data.views.replace("\n","");
							data.views = rawViews.split(" ")[6];
							insertVanuatuArticle(data); // inserts data into the database
						}
					})
				});
			}
		})
	}
	res.redirect('/page/vanuatu');
});

app.get('/write/png', function (req, res)
{
	// counter = 36;
	var lurl = 'http://www.looppng.com/section/all?page=0';
	// generate links to source publication data from
	for (var i=counter; i<counter+12; i++) {
		lurl = 'http://www.looppng.com/section/all?page='+i;
		console.log("Collecting Info: Page ",i);
		xray(lurl,
		{
			links: xray('.news-title>a',[{ link: '@href' }])
		})(function (err, obj)
		{ // function passing links
			if(!err) {
				obj.links.forEach(function (link)
				{
					xray(link.link, postmeta_extract)(function (err,data)
					{
						if(!err)
						{
							// clean before saving: category
							var tmpCat = data.category.split(" ");
							data.category = tmpCat[tmpCat.length-1].replace("taxonomy-","");
							// clean before saving: date published
							var tmpPubDate = data.pubdate.slice(data.pubdate.search(",")+2,100),
							cleaned = tmpPubDate.slice(0,tmpPubDate.search(",")+6);
							data.pubdate = cleaned.replace(",","");
							// clean before saving: views
							var rawViews = data.views.replace("\n","");
							data.views = rawViews.split(" ")[6];
							insertPNGArticle(data); // inserts data into the database
						}
					})
				});
			}
		})
	}
	res.redirect('/page/png');
});

app.get('/summary/list', function (req, res) {
	// res.send(list);
})

app.get('/', function (req, res)
{
	// res.render(__dirname + '/page/png');
	res.render(__dirname + '/client/views/index');
	var today = new Date();
	var dateString = today.toDateString();
	console.log(dateString);
});

// api call to get stories
app.get('/articles/:country', articlesController.listArticles);

// api call to export stories
app.get('/export/:country?:startDate&endDate', articlesController.exportArticles);
app.get('/export/:country/:startDate', articlesController.exportArticles);
// app.get('/export/png/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);

// uri call to render pages
app.get('/page/:country', function (req, res){ res.render(__dirname + '/client/views/'+req.params.country); });

app.get('/delete/:country', function (req, res)
{
	mongodb.MongoClient.connect(dbUri, function (err, db)
	{
		if(!err)
		{
			var country = req.params.country;
			if (country !== 'all')
				db.collection(country+'articles').drop();
			else {
				db.collection("pngarticles").drop();
				db.collection("nauruarticles").drop();
				db.collection("samoaarticles").drop();
				db.collection("tongaarticles").drop();
				db.collection("vanuatuarticles").drop();
			}
			res.redirect('/');
		} 
	});
});

app.get('/home', function (req,res) {
	res.render(__dirname + '/client/views/home');
})

app.get('/api/authors/list', authorsController.listAuthors );
app.post('/api/authors/new', authorsController.createAuthor ); // calls createAuthor on the server controller
app.post('/api/add/:author', authorsController.createAuthor ); // calls createAuthor on the server controller
// app.get('/api/authors/json', authorsController.jsonAuthor );
app.post('/api/authors/remove', authorsController.deleteAuthor );

app.set('views',__dirname + '/client/views');
app.set("view engine",'ejs');
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/client/js', express.static(__dirname + '/client/js'));
app.use('/server/js', express.static(__dirname + '/server/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser());

app.listen('3000');
console.log("go to localhost:3000");
exports = module.exports = app;
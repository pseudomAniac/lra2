var express 						= require('express'),
		csv									=	require('express-csv'),
		xray								= require('x-ray')(),
		authorsController 	= require('./server/controllers/authors-controller'),
		articlesController 	= require('./server/controllers/articles-server-controller'),
		Article 						= require('./server/models/article-model'),
		bodyParser 					= require('body-parser'),
		mongoose						= require('mongoose'),
		Q 									= require('q'),
		app 								= express();

// var dbUri = 'mongodb://127.0.0.1:27017/lra'; // local - dev
var dbUri = 'mongodb://reader_loopcount_db:readloopcount@ds019980.mlab.com:19980/heroku_gt6n53cm'; // production

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

app.get('/write/:country', function (req, res)
{
    var country = req.params.country, lurl = 'http://www.looppng.com/section/all?page=', nurl = '';

    switch (country) {
        case 'nauru':
        case 'png':
        case 'samoa':
        case 'tonga':
        case 'vanuatu':
            lurl = 'http://www.loop' + country + '.com/section/all?page=';
            break;
        default:
            lurl = 'http://www.looppng.com/section/all?page=';
    }
	// generate links to source publication data from
	for (var i=counter; i<counter+20; i++) {
		nurl = lurl+i;
		console.log(country,'info collection',i);
		xray(nurl,
		{
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
	res.redirect('/page/'+country);
});

app.get('/summary/list', function (req, res) {
	// res.send(list);
})

app.get('/', function (req, res)
{
	res.render(__dirname + '/client/views/png');
	var today = new Date();
	var dateString = today.toDateString();
	console.log(dateString);
});

// api call to get stories
app.get('/articles/:country', articlesController.listArticles);

// api call to export stories
// app.get('/export/:country?:startDate&endDate', articlesController.exportArticles);
app.get('/export/:country/:startDate', articlesController.exportArticles);
app.get('/export/:country', articlesController.exportArticles);

// uri call to render pages
app.get('/page/:country', function (req, res){ res.render(__dirname + '/client/views/'+req.params.country); });

app.get('/delete/:country', function (req, res)
{
	var country = req.params.country;
	switch (country) {
		case 'nauru':
			naurucollection.drop();
			break;
		case 'png':
			pngcollection.drop();
			break;
		case 'samoa':
			samoacollection.drop();
			break;
		case 'tonga':
			tongacollection.drop();
			break;
		case 'vanuatu':
			vanuatucollection.drop();
			break;
		case 'all':
			naurucollection.drop();
			pngcollection.drop();
			samoacollection.drop();
			tongacollection.drop();
			vanuatucollection.drop();
		default:
			break;
	}
	res.redirect('/');
});

/* api calls
app.get('/api/authors/list', authorsController.listAuthors );
app.post('/api/authors/new', authorsController.createAuthor ); // calls createAuthor on the server controller
app.post('/api/add/:author', authorsController.createAuthor ); // calls createAuthor on the server controller
// app.get('/api/authors/json', authorsController.jsonAuthor );
app.post('/api/authors/remove', authorsController.deleteAuthor );
*/

app.set('views',__dirname + '/client/views');
app.set("view engine",'ejs');
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use('/client/js', express.static(__dirname + '/client/js'));
app.use('/server/js', express.static(__dirname + '/server/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
	console.log("app started at " + paa.get('port'));
}
// exports = module.exports = app; ~ depreciated
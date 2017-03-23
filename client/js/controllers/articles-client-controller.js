ArticleListApp.constant('moment',moment);
NauruArticleListApp.constant('moment',moment);
PNGArticleListApp.constant('moment',moment);
SamoaArticleListApp.constant('moment',moment);
TongaArticleListApp.constant('moment',moment);
VanuatuArticleListApp.constant('moment',moment);

ArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var Article = $resource("/articles/all");
	$scope.pageTitle = "ALL";
	Article.query((result) => {
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	});
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
	$scope.showColumn = function(columnName) {
		$scope.reverse = ($scope.columnName === columnName) ? !$scope.reverse : false;
	}
}])

ArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGTop5 = $resource("/top/all");
	$scope.pageTitle = "ALL";
	PNGTop5.query(function (result) {
		$scope.articles = result;
	});
}])

ArticleListApp.controller('queryArticlesController', ['$scope', '$resource', '$location', 'moment', function ($scope, $resource, $location, moment) {
	var searchParams = $location.search();
	// console.log(searchParams);
	var country = searchParams.country,
		category = searchParams.category,
		sdate = searchParams.sdate,
		edate = searchParams.edate;

	qparams_builder(country.toLowerCase(), category, sdate, edate, function(queryparamerter) {
		console.log("queryparamerter - ",queryparamerter)
		$resource(queryparamerter).query((result) => {
			console.log("result - ",result)
			result.forEach((doc,i)=>{
				result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
			})
			$scope.articles = result;
		})
		$scope.pageTitle = "Results";
		$scope.propertyName = "_id";
		$scope.reverse = true;
		$scope.sortBy = function(propertyName) {
			$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
			$scope.propertyName = propertyName;
		}
		$scope.showColumn = function(columnName) {
			$scope.reverse = ($scope.columnName === columnName) ? !$scope.reverse : false;
		}
	})
}])
function qparams_builder(country, category, sdate, edate, callback) {
	var params = '/query/?';
	if (country != undefined && country != '') params += 'country='+country;
	if (category != undefined && category != '') params += '&category='+category;
	if (sdate != undefined && sdate != '') params += '&sdate='+sdate;
	if (edate != undefined && edate != '') params += '&edate='+edate;
	callback(params)
}

PNGArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var PNGArticle = $resource("/articles/png");
	$scope.pageTitle = "PNG";
	PNGArticle.query((result) => { 
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	});
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
	$scope.showColumn = function(columnName) {
		$scope.reverse = ($scope.columnName === columnName) ? !$scope.reverse : false;
	}
}])

PNGArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGTop5 = $resource("/top/png");
	$scope.pageTitle = "PNG";
	PNGTop5.query(function (result) {
		result.forEach(function(doc) {
		})
		$scope.articles = result;
	});
}])

NauruArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var NauruArticle		= $resource("/articles/nauru");
	$scope.pageTitle = "Nauru";
	NauruArticle.query(function (result) {
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	})
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
}])

NauruArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var NauruTop5 = $resource("/top/nauru");
	$scope.pageTitle = "Nauru";
	NauruTop5.query(function (result) { $scope.articles = result; });
}])

SamoaArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var SamoaArticle		= $resource("/articles/samoa");
	$scope.pageTitle = "Samoa";
	SamoaArticle.query(function (result) {
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	})
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
}])

SamoaArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var SamoaTop5 = $resource("/top/samoa");
	$scope.pageTitle = "Samoa";
	SamoaTop5.query(function (result) { $scope.articles = result; });
}])

TongaArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var TongaArticle		= $resource("/articles/tonga");
	$scope.pageTitle = "Tonga";
	TongaArticle.query(function (result) {
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	})
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
}])

TongaArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var TongaTop5 = $resource("/top/tonga");
	$scope.pageTitle = "Tonga";
	TongaTop5.query(function (result) { $scope.articles = result; });
}])

VanuatuArticleListApp.controller('articlesController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
	var VanuatuArticle		= $resource("/articles/vanuatu");
	$scope.pageTitle = "Vanuatu";
	VanuatuArticle.query(function (result) {
		result.forEach((doc,i)=>{
			result[i].pubdate = moment.unix(doc.pubdate).format("LLLL");
		})
		$scope.articles = result;
	})
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
}])

VanuatuArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var VanuatuTop5 = $resource("/top/vanuatu");
	$scope.pageTitle = "Vanuatu";
	VanuatuTop5.query(function (result) { $scope.articles = result; });
}])
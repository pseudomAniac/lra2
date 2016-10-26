PNGArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGArticle = $resource("/articles/png");
	PNGArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "PNG";
	});
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
}])

PNGArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGTop5 = $resource("/top/png");
	PNGTop5.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "PNG";
	});
}])

NauruArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var NauruArticle		= $resource("/articles/nauru");

	NauruArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Nauru";
	})
}])

NauruArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var NauruTop5 = $resource("/top/nauru");
	NauruTop5.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Nauru";
	});
}])

SamoaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var SamoaArticle		= $resource("/articles/samoa");

	SamoaArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Samoa";
	})
}])

SamoaArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var SamoaTop5 = $resource("/top/samoa");
	SamoaTop5.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Samoa";
	});
}])

TongaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var TongaArticle		= $resource("/articles/tonga");

	TongaArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Tonga";
	})
}])

TongaArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var TongaTop5 = $resource("/top/tonga");
	TongaTop5.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Tonga";
	});
}])

VanuatuArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var VanuatuArticle		= $resource("/articles/vanuatu");

	VanuatuArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Vanuatu";
	})
}])

VanuatuArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var VanuatuTop5 = $resource("/top/vanuatu");
	VanuatuTop5.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Vanuatu";
	});
}])

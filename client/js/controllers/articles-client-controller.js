PNGArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGArticle		= $resource("/articles/png");

	PNGArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "PNG";
	})
}])

NauruArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var NauruArticle		= $resource("/articles/nauru");

	NauruArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Nauru";
	})
}])

SamoaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var SamoaArticle		= $resource("/articles/samoa");

	SamoaArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Samoa";
	})
}])

TongaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var TongaArticle		= $resource("/articles/tonga");

	TongaArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Tonga";
	})
}])

VanuatuArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var VanuatuArticle		= $resource("/articles/vanuatu");

	VanuatuArticle.query(function (result) {
		$scope.articles = result;
		$scope.pageTitle = "Vanuatu";
	})
}])

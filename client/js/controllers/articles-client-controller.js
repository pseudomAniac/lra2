PNGArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGArticle = $resource("/articles/png");
	$scope.pageTitle = "PNG";
	PNGArticle.query((result) => { $scope.articles = result;	});
	$scope.propertyName = "_id";
	$scope.reverse = true;
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	}
	$scope.showColumn = function(columnName) {
		// $scope.reverse = ($scope.columnName === columnName) ? !$scope.reverse : false;
		console.log(columnName);
	}
}])

PNGArticleListApp.controller('topArticlesController', ['$scope', '$resource', function ($scope, $resource) {
	var PNGTop5 = $resource("/top/png");
	$scope.pageTitle = "PNG";
	PNGTop5.query(function (result) {
		result.forEach(function(doc) {
			console.log(doc.pubdate);
		})
		$scope.articles = result;
	});
}])

NauruArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var NauruArticle		= $resource("/articles/nauru");
	$scope.pageTitle = "Nauru";
	NauruArticle.query(function (result) { $scope.articles = result; })
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

SamoaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var SamoaArticle		= $resource("/articles/samoa");
	$scope.pageTitle = "Samoa";
	SamoaArticle.query(function (result) { $scope.articles = result; })
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

TongaArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var TongaArticle		= $resource("/articles/tonga");
	$scope.pageTitle = "Tonga";
	TongaArticle.query(function (result) { $scope.articles = result; })
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

VanuatuArticleListApp.controller('articlesController', ['$scope', '$resource', function ($scope, $resource) {
	var VanuatuArticle		= $resource("/articles/vanuatu");
	$scope.pageTitle = "Vanuatu";
	VanuatuArticle.query(function (result) { $scope.articles = result; })
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

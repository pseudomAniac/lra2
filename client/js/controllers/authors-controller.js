app.controller('authorsController', ['$scope','$resource', function ($scope, $resource)
{
	var newAuthor = $resource("/api/add/:author", {author:'author'});
	var listAuthor = $resource("/api/authors/list");
	var deleteAuthor = $resource('/api/authors/remove/:id');

	$scope.authors = [];
	$scope.createAuthor = function ()
	{
		var author = new newAuthor();
		author.type = $scope.authorType;
		author.fullName = $scope.authorName;
		// console.log(author.fullName, author.type, "\n", $scope.authorName, $scope.authorType);
		author.$save(function (result)
		{
			console.log(result);
			$scope.authors.push(result);
			$scope.authorName = '';
			$scope.authortype = '';
		});
	}

	listAuthor.query(function (results)	{ $scope.authors = results;	});
	$scope.removeAuthor = function () {	console.log("delete call from client controller");	}
}])

// app.controller('reportingApplicationController', ['$scope','$resource', function ($scope, $resource)
// {
// 	var listSummary = $resource('/summary/list');

// 	listSummary.query(function(results) 
// 	{
// 		$scope.summary = results;
// 	});
// }])
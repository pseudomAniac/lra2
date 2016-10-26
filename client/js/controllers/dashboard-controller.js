dashboardApp.controller('dashboardController', ['$scope','$resource', function ($scope, $resource){
	// var uuid = $resource("/uuid/"+$scope.deeplink);
	// console.log(uuid);
	function getURL(url) {
		$scope.deeplinker = 'hello world';
		console.log("url retrieved");
	}
}]);
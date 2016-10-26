dashboardApp.controller('dashboardController', ['$scope','$resource', function ($scope, $resource){
	// console.log(uuid);
	$scope.getURL = function(event) {
		var url = event.clipboardData.items[0];
		url.getAsString(function (data) {
			// console.log(data);
			data = data.split("/")
			var uuid = $resource("/uuid/"+data[data.length-1]);
			uuid.query(function(result) {
				console.log("uuid retrieved successfully " + result);
				$scope.uuid = result;
			})
		})
		console.log("url retrieved");
	}
}]);
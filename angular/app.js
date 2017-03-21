angular.module("app", ["ui.router"])
.controller('mainCtrl', function($http, $scope){
	$scope.title = "title"
	
	index = function(){
		$http.get("http://localhost:1337/")
		.then(function(resp){
			$scope.rows = resp.data
		}, function(err){
			console.error(err)
		})
	}
	$scope.checkStatus = function(id){
		console.log(id)
		var obj ={id: id}
		$http.post('http://localhost:1337/', obj).then(function(response) {
			index();
  		});
  		
	}
	index();
})
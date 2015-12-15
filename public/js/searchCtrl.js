var searchCtrl = angular.module('myApp.searchCtrl', []);
 searchCtrl.controller('SearchCtrl', function($scope, $http, $rootScope, $location, GoogleMapService){
 $scope.getLocationByCity = function() {
            //we post to the api
            $http.post('/api/locations', {
            address: GoogleMapService.getLocationByCity($scope.city)
            }).success(function(response) {
                $scope.successMessage = "Here are your results";
                $scope.showSuccessMessage = true;
                GoogleMapService.refreshLocations();
            });
        }
 	});
  
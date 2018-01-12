app.controller('AdminController', ['$scope', '$http', '$location', 'AdminService', function($scope, $http, $location, AdminService){
  $scope.adminObject = AdminService.adminObject;
  $scope.logout = AdminService.logout;
}]);

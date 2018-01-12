app.controller('UserController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
  var regUser = this;

  regUser.userObject = UserService.userObject;
  regUser.logout = UserService.logout;
}]);

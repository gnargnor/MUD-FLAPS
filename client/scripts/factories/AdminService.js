app.factory('AdminService', ['$http', '$location', function($http, $location){
  console.log('Admin Service Loaded');

  var adminObject = {};


  return {
    adminObject : adminObject,

    getadmin : function(){
      $http.get('/user').then(function(response) {
        if(response.data.isAdmin){
          //admin check
          adminObject.adminName = response.data.username;
          console.log('Admin data: ', adminObject.adminName);
        } else {
          $location.path("/home");
        }
      });
    },

    logout : function() {
        $http.get('/user/logout').then(function(response) {
          console.log('logged out');
          $location.path("/home");
        });
    }
  };
}]);

app.controller('LoginController', ['$timeout', '$http', '$location', 'UserService', function($timeout, $http, $location, UserService) {
  var login = this;

  login.user = {
    username: '',
    password: '',
    isAdmin: false
  };

  login.userObject = UserService.userObject;

  login.message = '';
  login.newUser = false;
  login.newUserMessage = 'user successfully created: ' + login.username;

  login.newUserConfirmation = function(username){
      login.username = username;
      login.newUser = true;
      login.newUserMessage = 'User successfully registered: ' + username;
      console.log(login.newUserMessage);
      console.log(login.newUser);
      $timeout(function(){
        console.log('timeout hit');
        login.newUser = false;
        login.newUserMessage = '';
        $location.path('/home');
        }, 3000);
  };

    login.login = function() {
      if(login.user.username === '' || login.user.password === '') {
        login.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', login.user);
        $http.post('/', login.user).then(function(response) {
          console.log(response.data);
          if(response.data.username) {
            console.log('success: ', response.data);

            if(response.data.isAdmin){
              $location.path('/admin');
            } else if(response.data.username && !response.data.isAdmin){
              // location works with SPA (ng-route)
              $location.path('/user');
            }
          } else {
            console.log('failure: ', response);
            login.message = "Wrong!!";
          }
        });
      }
    };

    login.registerUser = function() {
      if(login.user.username === '' || login.user.password === '') {
        login.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', login.user);
        $http.post('/register', login.user).then(function(response) {
          console.log('registered: ', response);
          if (response.data.newUser) {
            var username = response.data.username;

            console.log('username: ', username);
            login.newUserConfirmation(username);

          } else {
          console.log('error');
          login.message = "Please try again.";
        }
        });
      }
    };
}]);

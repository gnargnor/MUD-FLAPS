angular.module('ng-terminal-example.command.implementations', ['app', 'ng-terminal-example.command.tools'])

.config(['commandBrokerProvider', function (commandBrokerProvider) {

  // test interpretter input
  commandBrokerProvider.appendCommandHandler({
      command: 'hack',
      description: ['returns description'],
      handle: function (session, party) {
          //this defines a as an array with each word
          var b = party;
          var a = ['successful', 'hack', ':', b];

          console.log();

          session.output.push({ output: true, text: [a.join(' ')], breakLine: true });
          // a = testObject.bingbong;
          // b = testObject.dingdong;
          // session.output.push({ output: true, text: [b.join(' ')], breakLine: true });

      }
  });

  var underlineLoc = function(locName){
    var line = '';
    for (i=0; i<locName.length; i++){
      line += '-';
    }
    return line;
  };

  var lookCommandHandler = function () {
    var me = {};
    var _http = null;
    var _scope = null;
    me.command = 'look';
    me.description = ['look <target> returns a description of the target if available'];
    // Inject dependencies
    me.init = ['$http', '$rootScope', function ($http, $rootScope) {
        _http = $http;
        _scope = $rootScope;
    }];
    me.handle = function (session, targetSight) {
      // var whatList = ['What', 'would', 'you', 'like', 'to', 'list?'];
          _http.get('/sight/look/' + targetSight).then(function(response){
              var lookResponse  =  response.data;
              var lookResponseArray = [];
              for(var i = 0; i < response.data.length; i++) {
                lookResponseArray.push(response.data[i].sightDesc);
              }
              console.log(lookResponseArray);
              session.output.push({ output: true, text: lookResponseArray, breakLine: true });
              // Broadcast an apply
              _scope.$broadcast('terminal-apply', {});
            });
  };
    return me;
  };
  commandBrokerProvider.appendCommandHandler(lookCommandHandler());

  var gotoCommandHandler = function () {
    var me = {};
    var _http = null;
    var _scope = null;
    me.command = 'goto';
    me.description = ['goto <target> will bring you to the target location if it exists', 'this is a test'];
    // Inject dependencies
    me.init = ['$http', '$rootScope', function ($http, $rootScope) {
        _http = $http;
        _scope = $rootScope;
    }];
    me.handle = function (session, targetLoc) {
      // var whatList = ['What', 'would', 'you', 'like', 'to', 'list?'];
          _http.get('/location/goto/' + targetLoc).then(function(response){
              var gotoResponseTitle = response.data.locName;
              var gotoResponseDesc = response.data.locDesc;
              console.log('gotoResponse: ', gotoResponseTitle, gotoResponseDesc);
              var gotoResponseArray = [];
              gotoResponseArray.push(gotoResponseTitle);
              gotoResponseArray.push(underlineLoc(gotoResponseTitle));
              gotoResponseArray.push(gotoResponseDesc);
              console.log('goto callback: ', gotoResponseArray);
              session.output.push({ output: true, text: gotoResponseArray, breakLine: true });
              // Broadcast an apply
              _scope.$broadcast('terminal-apply', {});
            });
  };
    return me;
  };
  commandBrokerProvider.appendCommandHandler(gotoCommandHandler());

  var playCommandHandler = function () {
    var me = {};
    var _http = null;
    var _scope = null;
    me.command = 'play';
    me.description = ['(play <target world>) starts a new game.  Use quotes if the title contains more than one word.'];
    // Inject dependencies
    me.init = ['$http', '$rootScope', function ($http, $rootScope) {
        _http = $http;
        _scope = $rootScope;
    }];
    me.handle = function (session, targetWorld) {
      // var whatList = ['What', 'would', 'you', 'like', 'to', 'list?'];
          _http.post('/game/newGame/' + targetWorld).then(function(response){
            console.log('callback for play hit');
              var gameResponse =  response.data;
              var gameResponseArray = [];
              for(var i = 0; i < response.data.length; i++) {
                gameResponseArray.push(response.data[i].sightDesc);
              }
              console.log('play response: ', gameResponseArray);
              session.output.push({ output: true, text: gameResponseArray, breakLine: true });
              // Broadcast an apply
              _scope.$broadcast('terminal-apply', {});
            });
  };
    return me;
  };
  commandBrokerProvider.appendCommandHandler(playCommandHandler());



    commandBrokerProvider.appendCommandHandler({
        command: 'version',
        description: ['Shows this software version.'],
        handle: function (session) {
            session.output.push({ output: true, text: ['Version 0.1 Beta'], breakLine: true });
        }
    });

    commandBrokerProvider.appendCommandHandler({
        command: 'clear',
        description: ['Clears the screen.'],
        handle: function (session) {
            session.commands.push({ command: 'clear' });
        }
    });

    var listCommandHandler = function () {
      var me = {};
      var _http = null;
      var _scope = null;
      me.command = 'list';
      me.description = ['list out the target array values'];
      // Inject dependencies
      me.init = ['$http', '$rootScope', function ($http, $rootScope) {
          _http = $http;
          _scope = $rootScope;
      }];
      me.handle = function (session, target) {
        var whatList = ['What would you like to list?'];
        switch(target){

          case 'worlds':
            _http.get('/world').then(function(response){
                var worlds =  response.data;
                var worldNames = [];
                for(var i = 0; i < response.data.length; i++) {
                  worldNames.push(response.data[i].worldName);
                }
                console.log(worldNames);
                session.output.push({ output: true, text: [worldNames.join(' - ')], breakLine: true });
                // Broadcast an apply
                _scope.$broadcast('terminal-apply', {});
              });
              break;
          case 'locations':
            _http.get('/location').then(function(response){
                var locations =  response.data;
                var locNames = [];
                for(var i = 0; i < response.data.length; i++) {
                  locNames.push(response.data[i].locName);
                }
                console.log();
                session.output.push({ output: true, text: [locNames.join(' - ')], breakLine: true });
                // Broadcast an apply
                _scope.$broadcast('terminal-apply', {});
              });
              break;
          case 'items':
          _http.get('/item').then(function(response){
              var items =  response.data;
              var itemNames = [];
              for(var i = 0; i < response.data.length; i++) {
                itemNames.push(response.data[i].itemName);
              }
              console.log();
              session.output.push({ output: true, text: [itemNames.join(' - ')], breakLine: true });
              // Broadcast an apply
              _scope.$broadcast('terminal-apply', {});
            });
            break;
            case 'sights':
            _http.get('/sight').then(function(response){
              console.log('sight response: ', response.data);
                var sights =  response.data;
                var sightNames = [];
                for(var i = 0; i < response.data.length; i++) {
                  sightNames.push(response.data[i].sightName);
                }
                console.log();
                session.output.push({ output: true, text: [sightNames.join(' - ')], breakLine: true });
                // Broadcast an apply
                _scope.$broadcast('terminal-apply', {});
              });
              break;
          default:
            session.output.push({ output: true, text: [whatList.join(' ')], breakLine: true });
            // Broadcast an apply
            _scope.$broadcast('terminal-apply', {});
      }
    };
      return me;
    };
    commandBrokerProvider.appendCommandHandler(listCommandHandler());

    commandBrokerProvider.appendCommandHandler({
        command: 'echo',
        description: ['Echoes input.'],
        handle: function (session) {
            var a = Array.prototype.slice.call(arguments, 1);
            session.output.push({ output: true, text: [a.join(' ')], breakLine: true });
        }
    });



    commandBrokerProvider.appendCommandHandler({
        command: 'eval',
        description: ['Evaluates input as javascript.','Example: eval alert(1)'],
        handle: function (session, param) {
            var a = Array.prototype.slice.call(arguments, 1);
            var param = eval(a.join(' '));
            param = param ? param.toString() : '';
            session.output.push({ output: true, text: [param], breakLine: true });
        }
    });

    commandBrokerProvider.appendCommandHandler({
        command: 'break',
        description: ['Tests how commands are broken down in segments.',"Example: break 'aaa aaa' aaa aaa"],
        handle: function (session) {
            var a = Array.prototype.slice.call(arguments, 1);
            session.output.push({ output: true, text: a, breakLine: true });
        }
    });

    commandBrokerProvider.appendCommandHandler({
        command: 'websocket',
        description: ['Starts a websocket session.',
                      'Syntax: websocket <url> [protocol]',
                      'Example: websocket wss://echo.websocket.org'],
        handle: function (session, url, protocol) {
            if (!url) {
                throw new Error("The parameter 'url' is required, type 'help websocket' to get help.")
            }

            session.output.push({
                output: true,
                text: ["Openning connection to " + url + (protocol ? " with protocol " + protocol : "") + " ...",
                       "Type 'exit' to exit."],
                breakLine: true
            });
            session.commands.push({ command: 'change-prompt', prompt: { path: 'websocket[' + url+']'} });
            session.contextName = "websocket";
            session.context = function () {
                var me = {};
                var ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
                ws.onopen = function () {
                    session.output.push({ output: true, text: ["Connection established."], breakLine: true });
                    session.$scope.$apply();
                };

                ws.onerror = function () {
                    session.output.push({ output: true, text: ["Connection error."], breakLine: true });
                    session.$scope.$apply();
                    me.execute(session, "exit");
                };

                ws.onmessage = function (msg) {
                    session.output.push({ output: true, text: [msg.data], breakLine: true });
                    session.$scope.$apply();
                };

                me.execute = function (s, c) {
                    if (c == 'exit') {
                        ws.close();
                        s.contextName = "";
                        delete s.context;
                        s.commands.push({ command: 'reset-prompt', prompt: {path:true} });
                        s.output.push({ output: true, text: ["Websocket ended."], breakLine: true });
                        return;
                    }
                    ws.send(c);
                };
                return me;
            }();
        }
    });
    // - LK google analytics related things.  Not worth the headache, not relevant to me.
    // var suCommandHandler = function () {
    //     var me = {};
    //     var ga = null;
    //     me.command= 'su';
    //     me.description = ['Changes the  user identity.', "Syntax: su <userName>", "Example: su vtortola"];
    //     me.init = ['$ga', function ($ga) {
    //         ga = $ga;
    //     }];
    //     me.handle= function (session, login) {
    //         if (!login) {
    //             session.output.push({ output: true, text: ["The <userName> parameter is required.", "Type 'help su' to get a hint."], breakLine: true });
    //             return;
    //         }
    //
    //         ga('set', { userId: login.toString() });
    //         session.login = login;
    //         session.commands.push({ command: 'change-prompt', prompt: { user: login }});
    //         session.output.push({ output: true, text: ["Identity changed."], breakLine: true });
    //     }
    //     return me;
    // };
    // commandBrokerProvider.appendCommandHandler(suCommandHandler());
    //
    // var feedbackCommandHandler = function () {
    //     var me = {};
    //     var _ga = null;
    //     me.command = 'feedback';
    //     me.description = ['Sends a feedback message to the author.', "Example: feedback This application is awesome! Where may I donate?"];
    //     me.init = ['$ga', function ($ga) {
    //         _ga = $ga;
    //     }];
    //     me.handle = function (session, param) {
    //         param = Array.prototype.slice.call(arguments, 1);
    //         param = param.join(' ');
    //         var outText = [];
    //         if (!param) {
    //             outText.push("You need to provide a message, type 'help feedback' to get a hint.");
    //         }
    //         else {
    //             outText.push("Your message have been sent.");
    //             outText.push("Thanks for the feedback!.");
    //             _ga('send', 'event', 'Console', 'Feedback', param);
    //         }
    //         session.output.push({ output: true, text: outText, breakLine: true });
    //     }
    //     return me;
    // };
    // commandBrokerProvider.appendCommandHandler(feedbackCommandHandler());

    // this must be the last
    var helpCommandHandler = function () {
        var me = {};

        me.command = 'help';
        me.description = ['Provides instructions about how to use this terminal'];
        me.handle = function (session, cmd) {
            var list = commandBrokerProvider.describe();
            var outText = [];
            if (cmd) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].command == cmd) {
                        var l = list[i];
                        //LK -- pushes the ['command help for yourCommand', 'help description'] for the output to the terminal upon calling help
                        outText.push("Command help for: " + cmd);
                        for (var j = 0; j < l.description.length; j++) {
                            outText.push(l.description[j]);
                        }
                        break;
                    }
                }
                //LK - default for if there is no help for a given command
                if(!outText.length)
                    outText.push("There is no command help for: " + cmd);
            }
            else {
                //LK - this generates the help list if no command is given as an arguement
                outText.push("Available commands:");
                for (var i = 0; i < list.length; i++) {
                    var str = "  " + list[i].command + "\t\t";
                    for (var j = 0; j < 3 && i + 1 < list.length; j++) {
                        var cmd = list[++i].command;
                        str += cmd + (cmd.length > 6 ? "\t" : "\t\t");
                    }
                    outText.push(str);
                }
                outText.push("");
                outText.push("Enter 'help <command>' to get help for a particular command.");
            }
            session.output.push({ output: true, text: outText, breakLine: true });
        };
        return me;
    };
    commandBrokerProvider.appendCommandHandler(helpCommandHandler());
}])

;

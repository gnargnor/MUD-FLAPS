angular.module('ng-terminal-example', ['app', 'vtortola.ng-terminal', 'ng-terminal-example.command.tools', 'ng-terminal-example.command.implementations'])
//removed 'ng-terminal-example.command.filesystem' from dependency array above
// .provider('$ga', function () {
//
//     window['GoogleAnalyticsObject'] = 'ga';
//     window['ga'] = window['ga'] || function () { (window['ga'].q = window['ga'].q || []).push(arguments) }
//     window['ga'].l = 1 * new Date();
//     var script = document.createElement('script');
//     var prevScript = document.getElementsByTagName('script')[0];
//     script.async = 1;
//     script.src = '//www.google-analytics.com/analytics_debug.js';
//     prevScript.parentNode.insertBefore(script, prevScript);
//
//     var provider = function () {
//         var me = {};
//
//         me.$get = function () {
//             ga('send', 'pageview');
//             return function () {
//                 return window.ga.apply(window, arguments);
//             }
//         };
//
//         me.ga = function () {
//             return window.ga.apply(window, arguments);
//         };
//
//         return me;
//     };
//
//     return provider();
// })
//LK - removed $ga between commandBroker and $rootScope in dependencies before and within function
.controller('console',['CreatorService', '$scope','commandBroker','$rootScope', '$http', function (CreatorService, $scope, commandBroker, $rootScope, $http) {

    // $scope.getWorlds = CreatorService.getWorlds;
    //$scope.getWorlds();
    //$scope.worldsObject = CreatorService.worldsObject;
    //console.log($scope.worldsObject);

    $rootScope.theme = 'vintage';

    // Get the worlds and print them to the session output


    setTimeout(function () {
        //LK - welcome message.  change to output world intro.
        $scope.$broadcast('terminal-output', {
            output: true,
            text: ['Welcome to MEAN MUD',
                   'You are stuck inside of a computer.',
                   '',
                   "Please type 'help' to open a list of commands"],
            breakLine: true
        });
        $scope.$apply();
    }, 100);

    //LK - removed: google analytics and bug testing.  Unnecessary for the project
    // $scope.gitHub = function () {
    //     $ga('send', 'event', 'ng-terminal-emulator', 'click', 'GitHub');
    // };

    // $scope.unitTests = function () {
    //     $ga('send', 'event', 'ng-terminal-emulator', 'click', 'UnitTest');
    // };

    //LK - session is the object format that the parser uses to determine what to do with the input
    $scope.session = {
        commands: [],
        output: [],
        $scope:$scope
    };
    //LK - This section sends code to the terminal display -- clear hits this route and runs a function to clear the screen
    $scope.$watchCollection(function () { return $scope.session.commands; }, function (n) {
        for (var i = 0; i < n.length; i++) {
            // $ga('send', 'event', 'Console', 'Command', JSON.stringify(n[i]));
            console.log('terminal-command ',n[i]);
            $scope.$broadcast('terminal-command', n[i]);
        }
        $scope.session.commands.splice(0, $scope.session.commands.length);
        $scope.$$phase || $scope.$apply();
    });
    //LK - This section directly controls the output displayed on the screen.  characters are individually sent from the 'text' array property
    $scope.$watchCollection(function () { return $scope.session.output; }, function (n) {
        for (var i = 0; i < n.length; i++) {
            // $ga('send', 'event', 'Console', 'Output', JSON.stringify(n[i]));
            console.log('terminal-output ', n[i]);
            $scope.$broadcast('terminal-output', n[i]);
        }
        //clears out session.output
        $scope.session.output.splice(0, $scope.session.output.length);
        $scope.$$phase || $scope.$apply();
    });

    //LK - google analytics stuff
    // $scope.$on('$viewContentLoaded', function (event) {
    //     $ga('send', 'pageview');
    // });

    //LK - this is the command interpretter
    $scope.$on('terminal-input', function (e, consoleInput) {
      //LK - this sets cmd to be an object with a command property
        var cmd = consoleInput[0];
        console.log(cmd);
        // $ga('send', 'event', 'Console', 'Input', cmd.command );
        try {
          console.log('I AM HERE',$scope.session.http);
            if($scope.session.http == 'hello') {
              console.log('HTTP!!!!!!!!!!!!!!!');
            }
            else if ($scope.session.context) {
                $scope.session.context.execute($scope.session, cmd.command);
            }
            //LK - this sends cmd.command to the commandBroker in most cases
            else {
                commandBroker.execute($scope.session, cmd.command);
            }
        } catch (err) {
          //LK - this handles invalid commands
            $scope.session.output.push({ output: true, breakLine: true, text: [err.message] });
        }
    });
}])
//LK - google analytics, unnecessary
// .config(['$gaProvider',function ($gaProvider) {
//     $gaProvider.ga('create', 'UA-53263543-1', 'auto');
// }])

.config(['terminalConfigurationProvider', function (terminalConfigurationProvider) {
    //LK - determines the character output delay in the vintage themed terminal
    terminalConfigurationProvider.config('vintage').outputDelay = 20;
    terminalConfigurationProvider.config('vintage').allowTypingWriteDisplaying = false;
    //LK - sound stuff
    // terminalConfigurationProvider.config('vintage').typeSoundUrl ='example/content/type.wav';
    // terminalConfigurationProvider.config('vintage').startSoundUrl ='example/content/start.wav';
}])

;

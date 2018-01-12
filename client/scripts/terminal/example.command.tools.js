angular.module('ng-terminal-example.command.tools', ['app'])
//this module parses the information entered into the command line so it enters the command broker as expected
.provider('commandLineSplitter', function () {
    var provider = function () {
      //me contains all properties and methods returned after the terminal input has been parsed
        var me = {};
        //LK - .separators : an array with a double quote stored at position 0 and a single quote stored at position 1, both strings
        //LK - .$get : pushes indivudual letters of input words or commands to strings and pushes the completed input words to an array
        var brackets = ['{', '}'];
        brackets.keep = true;
        //LK - catches both types of quotes
        me.separators = [['"'], ["'"], brackets];
        //LK - defines how to determine the opener, provides catches for multiple openers
        var isOpener = function (c) {
            var suitableOpeners = me.separators.filter(function (item) { return item[0] == c; });
            if (suitableOpeners.length > 1)
                throw new Error("Opening tag in multiple pairs: " + c);
            else if (suitableOpeners.length == 0)
                return null;
            else {
                return suitableOpeners[0];
            }
        };

        me.$get = function () {
            return {
                split: function (input) {
                    //LK - parts will be the array returned once the input has been separated into individual strings
                    var parts = [];
                    //LK - variable for individual strings
                    var part = '';
                    //LK - represents the first character for each new word
                    var currentOc = null;
                    for (var i = 0; i < input.length; i++) {
                        var c = input[i];
                        //LK - removes initial space(s) if any OR pushes the current word into the parts array
                        if (c == ' ' && !currentOc) {
                            if (part)
                                parts.push(part);
                            part = '';
                            continue;
                        }
                        //LK - looks like it catches incorrectly entered commands, not sure how yet
                        if (currentOc && currentOc[currentOc.length - 1] == c) {
                            if (i != input.length - 1 && input[i + 1] != ' ')
                                throw new Error("An closing tag can only appear at the end of a sentence or before a space.");

                            if (currentOc.keep)
                                part += c;
                            //pushes the individual part to the parts array after each word in the input has been determined to be complete
                            parts.push(part);
                            part = '';
                            currentOc = null;
                            continue;
                        }

                        var oc = currentOc ? null : isOpener(c);

                        if (oc) {
                            if (i != 0 && input[i - 1] != ' ')
                                throw new Error("An opening tag can only appear at the beggining of a sentence or after a space.");

                            currentOc = oc;
                            if (currentOc.keep)
                                part += c;
                            continue;
                        }

                        part += c;

                    }
                    if (part)
                        parts.push(part);



                    return parts;
                }
            };
        };
        return me;
    }
    //LK - returns the parsed input to the next provider, i believe.
    return provider();
})

.provider('commandBroker', function () {

    // console.log('Creator Service in command Broker: ', CreatorService.worldsObject);
    var provider = function () {
        var me = {};
        me.handlers = [];
        me.redirectors = [];

        //this is where the array of suitableRedirectors is populated to be compared against the terminal input.
        var selectByRedirectors = function (commandParts) {
            var result = [], r=[];
            for (var i = 0; i < commandParts.length; i++) {
              //LK - cp : commandpart
                var cp = commandParts[i];
                var suitableRedirectors = me.redirectors.filter(function (r) { return r.command == cp; });
                if (suitableRedirectors.length) {
                    result.push(r);
                    result.push(cp);
                    r = [];
                }
                else
                    r.push(cp);
            }
            if (r.length)
                result.push(r);

            return result;
        };

        me.$get = ['$injector', 'commandLineSplitter', function ($injector, commandLineSplitter) {
            return {
                execute: function (session, consoleInput) {

                    if (!consoleInput)
                        return;
                    //LK - splits the console input string into an array of strings of individual words
                    var fullCommandParts = commandLineSplitter.split(consoleInput);
                    console.log('fullCommandParts: ', fullCommandParts);

                    //LK - this moves the array of strings of individual words into another array. position 0 is the array of strings, position 1 is an object with command and output properties
                    var stackedParts = selectByRedirectors(fullCommandParts);
                    console.log('stackedParts: ', stackedParts[0][0]);

                    //LK - resets tempSession
                    var tempSession = {
                        commands: [],
                        output: []
                    };

                    var redirector = null;

                    for (var i = 0; i < stackedParts.length; i++) {
                        var p = stackedParts[i];

                        if (redirector) {
                            //LK - if the first word entered is a suitable redirector (command), this inserts the tempSession object in the 0 position of the stacked parts array
                            p.splice(0, 0, tempSession);
                            redirector.handle.apply(redirector, p);
                            console.log('redirector.handler.apply: ', p);
                            redirector = null;
                            continue;
                        }

                        var suitableRedirectors = me.redirectors.filter(function (r) { return r.command == p; });
                        if (suitableRedirectors.length) {

                            var redirector = suitableRedirectors[0];
                            tempSession = {
                                commands: [],
                                output: [],
                                input: tempSession.output
                            };
                        }
                        else {

                            var suitableHandlers = me.handlers.filter(function (item) {
                                return p.length && item.command == p[0].toLowerCase();
                            });

                            if (suitableHandlers.length == 0)
                                throw new Error("There is no suitable handler for that command.");

                            var h = suitableHandlers[0];

                            p[0] = tempSession;
                            h.handle.apply(h, p);
                        }
                    }
                    //LK - angular.extend uses session as a destination for tempsessions current properties
                    angular.extend(session, tempSession);
                },

                init: function () { // inject dependencies on commands
                    // this method should run in '.config()' time, but also does the command addition,
                    // so run it at '.run()' time makes more sense and ensure all commands are already present.
                    var inject = function (handler) {
                        if (handler.init) {
                            $injector.invoke(handler.init);
                        }
                    };
                    for (var i = 0; i < me.handlers.length; i++) {
                        inject(me.handlers[i]);

                    }
                    for (var i = 0; i < me.redirectors.length; i++) {
                        inject(me.redirectors[i]);
                    }
                }
            }
        }];

        me.appendCommandHandler = function (handler) {
            if (!handler || !handler.command || !handler.handle || !handler.description)
                throw new Error("Invalid command handler");

            var suitableHandlers = me.handlers.filter(function (item) {
                return item.command == handler.command;
            });

            if (suitableHandlers.length != 0)
                throw new Error("There is already a handler for that command.");

            me.handlers.push(handler);
        };

        me.appendRedirectorHandler = function (handler) {
            if (!handler || !handler.command || !handler.handle)
                throw new Error("Invalid redirect handler");

            var suitableHandlers = me.redirectors.filter(function (item) {
                return item.command == handler.command;
            });

            if (suitableHandlers.length != 0)
                throw new Error("There is already a handler for that redirection.");

            me.redirectors.push(handler);
        };

        me.describe = function () {
            return me.handlers.map(function (item) { return { command: item.command, description: item.description }; });
        };

        return me;
    };

    return provider();
})

.run(['commandBroker', function (commandBroker) {
    commandBroker.init();
}])

;

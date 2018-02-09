# Application Notes

## Ideas
---

### Game:
* The game class should be an instance of a world containing the state of all of the things that are related to the world being played
* The state tree would pull in the initial state of each object as necessary to override the default characteristics of the object
* When information about an object is requested, the first place the game will look is in the list of objects that have been pushed to the game state according to the class.  For instance, if a location has been visited, it will have been pushed to the location array saved within the game instance.  The game class will check the list first for the unique id that is being requested in case that objects state is already being tracked / is different from the objects initial state
* Any attributes that are overriden will have keys in the game state that are added to the object in the game's state.  The rest of the attributes coud come from the initial state if this makes sense to do.

## Separation of Server/Client
### Goals:
* Start a new project folder that will contain both the server and client app
* Serve a html entry point for future app/apps
* Take note of the patterns used in BBY apps in order to gain a better understanding of this separation
* Design the server API to be the source of instruction for the client rather than the other way around.
    * follow API design standards for routes
    * object properties should be named according to python standards
    * internal (private) members designated with _underscores
### Steps:

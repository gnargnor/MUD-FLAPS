app.factory('CreatorService', ['UserService', '$http', '$location', function(UserService, $http, $location){

  /** message object */
  var messageObject = {
    message: ''
  };
  
  /** angular object vessels */
  var worldsObject = {
    curWorlds : [],
    curWorld : {
      worldName : '',
      worldDesc : '',
      author : '',
      _locations : []
    }
  };

  var locationsObject = {
    curLocs : [],
    curLoc : {
      locName :'',
      locDesc : '',
      locShortDesc : '',
      locNotes : ''
    }
  };

  var itemsObject = {
    curItems : [],
    curItem : {
      itemName : '',
      itemDesc : '',
      itemNotes : ''
    }
  };

  var sightsObject = {
    curSights : [],
    curSight : {
      keyword : '',
      sightDesc : '',
      isImportant : ''
    }
  };

  var exitsObject = {
    curExits : [],
    curExit : {
      exitDir : '',
      exitDesc : '',
      _destLoc : '',
      open : true,
      unlocked : true
    }
  };
  /** end angular object vessels */


  /** world functions */
  var worldGetter = function(){
    $http.get('/world')
      .then(function(response){
        console.log(response.data)
        var worldsReturned = response.data;
        worldsObject.curWorlds = [];
        for (i=0;i<worldsReturned.length;i++){
          worldsObject.curWorlds.push(worldsReturned[i]);
        }
        console.log('worldGetter pushed to curWorlds: ', worldsObject.curWorlds);
      });
  };

  var worldCreator = function(newWorld){
    var postWorld = newWorld;
    newWorld = {};
    $http.post('/world', postWorld)
      .then(function(response){
        console.log('worldCreator request: ', response);
        worldsObject.curWorld = response.data;
        worldGetter();
      });
  };
  
  var worldUpdater = function(curWorld){
    var putWorld = curWorld;
    $http.put('/world', putWorld)
      .then(function(response){
        console.log('worldUpdater response: ', response);
        worldGetter();
      });
  };

  var worldDeleter = function(curWorldId){
    console.log('world to delete', curWorldId);
    $http({
      url : '/world/' + curWorldId,
      method : 'DELETE'})
      .then(function(response){
        worldsObject.curWorld = {};
        console.log('worldDeleter response: ', response);
        worldGetter();
      });
  };

  var worldFiller = function(curWorldId){
    locGetter(curWorldId);
    itemGetter(curWorldId);
  };
  /** end world functions */


  /** location functions */
  var locGetter = function(curWorldId){
    if (worldsObject.curWorld._id === ''){
      console.log('curWorld not defined in locationGetter');
      return;
    }
    console.log('curWorld in locGetter ', worldsObject.curWorld._id);
    $http({
      url: '/location/' + curWorldId,
      method: 'GET',
    }).then(function(response){
      var locationsReturned = response.data;
      locationsObject.curLocs = [];
      for (i=0;i<locationsReturned.length; i++){
        locationsObject.curLocs.push(locationsReturned[i]);
      }
      console.log('locGetter pushed: ', locationsObject.curLocs);
    });
  };

  var locationCreator = function(newLoc){
    newLoc._world = worldsObject.curWorld._id;
    console.log('newLoc._world: ', newLoc);
    $http.post('/location', newLoc)
      .then(function(response){
        console.log('locationCreator request: ', response);
        locGetter(newLoc._world);
        locationsObject.curLoc = response.data;
      });
  };

  var locationUpdater = function(curLoc){
    var putLoc = curLoc;
    curLoc = {};
    $http.put('/location', putLoc)
      .then(function(response){
        console.log('locationUpdater response: ', response);
        locGetter(worldsObject.curWorld._id);
        locationsObject.curLoc = response.data;
      });
  };

  var locationDeleter = function(curLocId){
    console.log('loc to delete', curLocId);
    $http({
      url : '/location/' + curLocId,
      method : 'DELETE'
    }).then(function(response){
        console.log('worldDeleter response: ', response);
        locationsObject.curLoc = {};
        worldFiller(worldsObject.curWorld._id);
      });
  };

  var locationFiller = function(curLocId) {
    sightGetter(curLocId);
    exitGetter(curLocId);
  };
  /** end location */


  /** item functions */
  var itemGetter = function(curWorldId){
    if (worldsObject.curWorld._id === ''){
      console.log('curWorld is not defined in itemGetter');
      return;
    }
    console.log('curWorld in itemGetter: ', worldsObject.curWorld._id);
    $http({
      url : '/item/' + curWorldId,
      method: 'GET',
    }).then(function(response){
      var itemsReturned = response.data;
      itemsObject.curItems = [];

      console.log('itemGetter response.data: ', response.data);
      for (i = 0; i<itemsReturned.length; i++){
        itemsObject.curItems.push(itemsReturned[i]);
      }
    });
  };

  var itemCreator = function(newItem){
    newItem._world = worldsObject.curWorld._id;
    $http.post('/item', newItem)
      .then(function(response){
        console.log('itemCreator request: ', response);
        itemGetter(worldsObject.curWorld._id);
        itemsObject.curItem = response.data;
      });
  };

  var itemUpdater = function(curItem){
    var putItem = curItem;
    curItem = {};
    $http.put('/item', putItem)
      .then(function(response){
        console.log('itemUpdater response: ', response);
        itemGetter(worldsObject.curWorld._id);
        itemsObject.curItem = response.data;
      });
  };

  var itemDeleter = function(curItemId){
    console.log('item to delete', curItemId);
    $http({
      url : '/item/' + curItemId,
      method : 'DELETE'
    }).then(function(response){
        console.log('itemDeleter response: ', response);
        itemsObject.curItem = {};
        worldFiller(worldsObject.curWorld._id);
      });
  };
  /** end item functions */

  /** sight functions */
  var sightGetter = function(curLocId){
    if (curLocId === ''){
      console.log('curLoc is not defined in sightGetter');
      return;
    }
    console.log('curLoc in sightGetter: ', curLocId);
    $http({
      url : '/sight/' + curLocId,
      method: 'GET',
    }).then(function(response){
      var sightsReturned = response.data;
      sightsObject.curSights = [];
      console.log('sightGetter response.data: ', response.data);
      for (i = 0; i<sightsReturned.length; i++){
        sightsObject.curSights.push(sightsReturned[i]);
      }
      console.log('sightsReturned: ', sightsReturned);
    });
  };

  var sightCreator = function(newSight){
    newSight._location = locationsObject.curLoc._id;
    $http.post('/sight', newSight)
      .then(function(response){
        console.log('sightCreator request: ', response);
        sightGetter(locationsObject.curLoc._id);
        sightsObject.curSight = response.data;
      });
  };

  var sightUpdater = function(curSight){
    var putSight = curSight;
    curSight = {};
    $http.put('/sight', putSight)
      .then(function(response){
        console.log('sightUpdater response: ', response);
        sightGetter(locationsObject.curLoc._id);
        sightsObject.curSight = response.data;
      });
  };

  var sightDeleter = function(curSightId){
    console.log('sight to delete', curSightId);
    $http({
      url : '/sight/' + curSightId,
      method : 'DELETE'
    }).then(function(response){
        console.log('sightDeleter response: ', response);
        sightsObject.curSight = {};
        sightGetter(locationsObject.curLoc._id);
      });
  };
  /** end sight functions */

  /** exit functions */
  var exitGetter = function(curLocId){
    if (curLocId === ''){
      console.log('curLoc is not defined in exitGetter');
      return;
    }
    console.log('curLoc in exitGetter: ', curLocId);
    $http({
      url : '/exit/' + curLocId,
      method: 'GET',
    }).then(function(response){
      var exitsReturned = response.data;
      exitsObject.curExits = [];
      console.log('exitGetter response.data: ', response.data);
      for (i = 0; i<exitsReturned.length; i++){
        exitsObject.curExits.push(exitsReturned[i]);
      }
      console.log('exitsReturned: ', exitsReturned);
    });
  };

  var exitCreator = function(newExit){
    newExit._location = locationsObject.curLoc._id;
    $http.post('/exit', newExit)
      .then(function(response){
        console.log('exitCreator response: ', response);
        exitGetter(locationsObject.curLoc._id);
        exitsObject.curExit = response.data;
      });

  };

  var exitUpdater = function(curExit){
    console.log('curExit in exitUpdater: ', curExit._id);
    var putExit = curExit;
    newExit = {};
    $http.put('/exit', putExit)
      .then(function(response){
        console.log('exitCreator response: ', response);
        exitGetter(locationsObject.curLoc._id);
        exitsObject.curExit = response.data;
      });
  };

  var exitDeleter = function(curExitId){
    console.log('exit to delete', curExitId);
    $http({
      url : '/exit/' + curExitId,
      method : 'DELETE'
    }).then(function(response){
        console.log('exitDeleter response: ', response);
        exitsObject.curExit = {};
        exitGetter(locationsObject.curLoc._id);
      });
  };

  var destinationUpdater = function(destLoc, exit){
    $http.put('/location/destination/' + destLoc + '/' + exit)
      .then(function(response){
        console.log('destinationUpdater response: ', response.data);
      });
  };
  /** end exit functions */

  var displayDesc = function(typeOfInput){
    console.log(typeOfInput);
    if (typeOfInput.worldName){
      var world = typeOfInput;
      console.log('current world object:', world);
      worldsObject.curWorld = world;
    } else if (typeOfInput.locName){
      var location = typeOfInput;
      console.log('displayDesc: ', location);
      locationsObject.curLoc = location;
    } else if (typeOfInput.itemName){
      var item = typeOfInput;
      console.log('current item object:', item);
      itemsObject.curItem = item;
    } else if (typeOfInput.sightDesc){
      var sight = typeOfInput;
      console.log('current sight object:', sight);
      sightsObject.curSight = sight;
    } else if (typeOfInput.exitDesc){
      var exit = typeOfInput;
      console.log('current exit object:', exit);
      exitsObject.curExit = exit;
    } else {
      messageObject.message = "display error: bad code";
    }
  };

  return {

  //message object
  messageObject : messageObject,

  //angular vessels
  worldsObject : worldsObject,
  locationsObject : locationsObject,
  itemsObject : itemsObject,
  sightsObject : sightsObject,
  exitsObject : exitsObject,
  //end angular vessels

  //world function returns
  worldGetter : worldGetter,
  worldCreator : worldCreator,
  worldUpdater : worldUpdater,
  worldDeleter : worldDeleter,
  worldFiller : worldFiller,
  //end world function returns

  //location functions
  locGetter : locGetter,
  locationCreator : locationCreator,
  locationUpdater : locationUpdater,
  locationDeleter : locationDeleter,
  locationFiller : locationFiller,
  //end location functions

  //item functions
  itemGetter : itemGetter,
  itemCreator : itemCreator,
  itemUpdater : itemUpdater,
  itemDeleter : itemDeleter,
  //item functions

  //sight functions
  sightGetter : sightGetter,
  sightCreator : sightCreator,
  sightUpdater : sightUpdater,
  sightDeleter : sightDeleter,
  //end sight functions

  //exit functions
  exitGetter : exitGetter,
  exitCreator : exitCreator,
  exitUpdater: exitUpdater,
  exitDeleter : exitDeleter,
  destinationUpdater : destinationUpdater,
  //end exit functions

  displayDesc : displayDesc,

  };
}]);


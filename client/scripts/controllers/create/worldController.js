app.controller('WorldController', ['CreatorService', '$scope', '$http', '$location', 'UserService', function(CreatorService, $scope, $http, $location, UserService){
  // console.log('worldController Hit');
  //
  var world = this;
  world.displayDesc = CreatorService.displayDesc;

  //WORLDS
  world.worldsObject = CreatorService.worldsObject;
  world.worldCreator = CreatorService.worldCreator;
  world.worldUpdater = CreatorService.worldUpdater;
  world.worldDeleter = CreatorService.worldDeleter;
  world.worldGetter = CreatorService.worldGetter;
  world.worldFiller = CreatorService.worldFiller;

  world.addWorldView = false;
  world.editWorldView = false;
  world.displayDescViewWorld = false;

  world.worldGetter();

    world.addWorld = function(){
      if (world.editWorldView || world.displayDescViewWorld) {
        world.editWorldView = false;
        world.displayDescViewWorld = false;
      }
      world.worldsObject.curWorld = {};
      world.addWorldView = true;
    };

    world.displayViewForWorld = function(){
      console.log('display function');
      if (world.editWorldView || world.addWorldView){
        world.editWorldView = false;
        world.addWorldView = false;
      }
      world.displayDescViewWorld = true;
    };

    world.editWorld = function(){
      console.log('edit function');
      if (world.addWorldView || world.displayDescViewWorld) {
        world.addWorldView = false;
        world.displayDescViewWorld = false;
      }
      world.editWorldView = true;
    };

    world.chooseWorld = function(curWorld){
      console.log('choose world');
      world.worldsObject.curWorld = curWorld;
      world.worldFiller(curWorld._id);
      $location.path('/worldHome');
    };



  //END WORLDS

  //LOCATIONS
  world.locationsObject = CreatorService.locationsObject;
  world.locationCreator = CreatorService.locationCreator;
  world.locationUpdater = CreatorService.locationUpdater;
  world.locationDeleter = CreatorService.locationDeleter;
  world.locationGetter = CreatorService.locationGetter;
  world.locationFiller = CreatorService.locationFiller;

  world.addLocationView = false;
  world.editLocationView = false;
  world.displayDescViewLoc = false;

    world.addLocation = function(){
      console.log('addLocation clicked');
      if (world.editLocationView || world.displayDescViewLoc) {
        world.editLocationView = false;
        world.displayDescViewLoc = false;
      }
      world.locationsObject.curLoc = {};
      world.addLocationView = true;
    };

    world.displayViewForLoc = function(){
      if (world.editLocationView || world.addLocationView){
        world.editLocationView = false;
        world.addLocationView = false;
      }
      world.displayDescViewLoc = true;
    };

    world.editLocation = function(loc){
      if (world.addLocationView || world.displayDescViewLoc) {
        world.addLocationView = false;
        world.displayDescViewLoc = false;
      }
      world.editLocationView = true;
    };

    world.chooseLocation = function(loc) {
      console.log('curLoc at chooseLocation: ', world.locationsObject.curLoc);
      world.locationsObject.curLoc = loc;
      world.locationFiller(world.locationsObject.curLoc._id);
      $location.path('/existingLoc');
    };
    //END LOCATIONS

    //ITEMS
    world.itemsObject = CreatorService.itemsObject;
    world.itemCreator = CreatorService.itemCreator;
    world.itemUpdater = CreatorService.itemUpdater;
    world.itemDeleter = CreatorService.itemDeleter;
    world.itemGetter = CreatorService.itemGetter;

    world.addItemView = false;
    world.editItemView = false;
    world.displayDescViewItem = false;

      world.addItem = function(){
        if (world.editItemView || world.displayDescViewItem) {
          world.editItemView = false;
          world.displayDescViewItem = false;
        }
        world.itemsObject.curItem = {};
        world.addItemView = true;
      };

      world.displayViewForItem = function(){
        console.log('displayViewForItem Hit');
          world.editItemView = false;
          world.addItemView = false;
          console.log('display addItemView: ', world.addItemView);
        world.displayDescViewItem = true;
      };

      world.editItem = function(item){
        if (world.addItemView || world.displayDescViewItem) {
          world.addItemView = false;
          world.displayDescViewItem = false;
        }
        world.editItemView = true;
      };

      world.chooseItem = function(item) {
        console.log('curWorld at chooseItem: ', world.worldsObject.curWorld);
        world.itemsObject.curItem = item;
        // locationFiller();
        $location.path('/existingItem');
      };

  // world.editLocation = CreatorService.editLocation;
  // world.itemsObject = CreatorService.itemsObject;
  // world.editItem = CreatorService.editItem;
  //
  // world.displayDesc = CreatorService.displayDesc;
  //
  world.messageObject = CreatorService.messageObject;
  //
  // world.addLocation = function(){
  //   $location.path('/newLoc');
  // };
  //
  // world.addItem = function(){
  //   $location.path('/newItem');
  // };
  // console.log('worldController : ', world.worldsObject.curWorlds);
  // world.getWorlds = CreatorService.getWorlds;

}]);

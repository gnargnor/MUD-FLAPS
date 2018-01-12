app.controller('ItemController', ['CreatorService', '$scope', '$http', '$location', 'UserService', function(CreatorService, $scope, $http, $location, UserService){
  // console.log('ItemController Hit');
  //
  var item = this;
  //
  // item.newItem = CreatorService.newItem;
  item.itemsObject = CreatorService.itemsObject;
  item.itemCreator = CreatorService.itemCreator;
  item.itemUpdater = CreatorService.itemUpdater;
  item.itemDeleter = CreatorService.itemDeleter;
  // item.getItems = CreatorService.getItems;
  // item.editItem = CreatorService.editItem;
  //
  item.messageObject = CreatorService.messageObject;
  // console.log(item.newItem, item.itemCreator);
  //
  // item.getItems();

}]);

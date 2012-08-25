var currentStage = {};

angular.module('shooter', ['backend'])
  .config(function () {
    console.log('onload');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', { controller: ScoringCtrl, templateUrl: 'scoring.html' })
      .when('/history', { controller: HistoryCtrl, templateUrl: 'history.html' })
      .when('/shooter', { controller: ShooterCtrl, templateUrl: 'shooter.html' })
  });

angular.module('backend', ['ngResource'])
  .factory('Stage', function ($resource, $filter) {
    var Stage = $resource('https://api.mongolab.com/api/1/databases' +
      '/shooter/collections/shoots/:id', {
        apiKey: '5031fdb7e4b01966199d1ba2',
      }
    );
    Stage.prototype.shots = [];
    Stage.prototype.getScore = function () {
      var score = 0;
      for(i in this.shots) {
        var shot = this.shots[i];
        if(shot.ignore == false) {
          score += (shot.value == 'X' ? 10 : shot.value);
        }
      }
      return score;
    }
    Stage.prototype.getBulls = function () {
      return $filter('filter')(this.shots, { value: 'X', ignore : false });
    }
    Stage.prototype.getShots = function () {
      return $filter('filter')(this.shots, { ignore : false });
    }
    return Stage;
  })
  .factory('Player',function ($resource,$filter) {
    var Player = $resource('https://api.mongolab.com/api/1/databases' +
      '/shooter/collections/shooters/:id', {
        apiKey: '5031fdb7e4b01966199d1ba2',
    });
    return Player;
  });

var Shot = function (value) {
  this.value = value;
  this.ignore = false;
  this.number = '';
}

Shot.prototype.ignoreToggle = function () {
  this.ignore = this.ignore == false ? true : false;
}

var HistoryCtrl = function ($scope, Stage, Player) {
  $scope.stages = Stage.query();
}
var ScoringCtrl = function ($scope, Stage, Player) {

console.log($scope);
  $scope.values = [0, 5, 6, 7, 8, 9, 10, 'X'];

  $scope.stage = new Stage();
  $scope.stage.shots = [];
  $scope.saveShot = function () {
    $scope.stage.shots.push(new Shot(this.value));
    currentStage = $scope.stage;
  }


}

var ShooterCtrl = function ($scope, Stage, Player) {

  $scope.stage = currentStage;
  $scope.players = Player.query();


  //$scope.stage = new Stage();
  //$scope.stage.shots = [];

  $scope.saveStage = function () {
    if($scope.player){
      console.log('shootername set');
      var player = new Player();
      player.name = $scope.player;
      player.$save();
    }
    $scope.stage.discipline = $scope.discipline;
    $scope.stage.timestamp = new Date();
    $scope.stage.$save(function () {
      $scope.stage = new Stage();
      $scope.stage.shots = [];
      $scope.stage = Stage.query();
    });
  }

}

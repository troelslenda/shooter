var currentStage = {};

angular.module('shooter', ['backend']).config(function () {
  console.log('onload');
}).config(function ($routeProvider) {
  $routeProvider.when('/scoring', {
    controller: ScoringCtrl,
    templateUrl: 'scoring.html'
  }).when('/discipline', {
    controller: DisciplineCtrl,
    templateUrl: 'discipline.html'
  }).when('/', {
    controller: HomeCtrl,
    templateUrl: 'home.html'
  }).when('/history', {
    controller: HistoryCtrl,
    templateUrl: 'history.html'
  }).when('/shooter', {
    controller: ShooterCtrl,
    templateUrl: 'shooter.html'
  })
});

angular.module('backend', ['ngResource']).factory('Stage', function ($resource, $filter) {
  var Stage = $resource('https://api.mongolab.com/api/1/databases' +
    '/shooter2/collections/stages/:id', {
    apiKey: '50392416e4b05405e515d962',
  });
  Stage.prototype.shots = [];
  Stage.prototype.getScore = function () {
    var score = 0;
    for (i in this.shots) {
      var shot = this.shots[i];
      if (shot.ignore == false) {
        score += (shot.value == 'X' ? 10 : shot.value);
      }
    }
    return score;
  }
  Stage.prototype.getBulls = function () {
    return $filter('filter')(this.shots, {
      value: 'X',
      ignore: false
    });
  }
  Stage.prototype.getShots = function () {
    return $filter('filter')(this.shots, {
      ignore: false
    });
  }
  return Stage;
}).factory('Player', function ($resource, $filter) {
  var Player = $resource('https://api.mongolab.com/api/1/databases' +
    '/shooter2/collections/players/:id', {
    apiKey: '50392416e4b05405e515d962',
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

var Player = function (name) {
  this.name = name;
}



var HistoryCtrl = function ($scope, Stage, Player, $location) {
  //$scope.stages = Stage.query();

  $scope.goBack = function () {
    $location.path('/');
  }
}




var HomeCtrl = function ($scope, $location) {
  $scope.newStage = function () {
    $location.path('/shooter');
  }
  $scope.showHistory = function () {
    $location.path('/history');
  }
  $scope.changeSettings = function () {
    $location.path('/settings');
  }
}




var ScoringCtrl = function ($scope, $location, Stage, Player) {

  $scope.stage = currentStage;
  console.log($scope.stage);
  $scope.values = [0, 5, 6, 7, 8, 9, 10, 'X'];


  $scope.saveShot = function () {
    $scope.stage.shots.push(new Shot(this.value));
  }
  $scope.saveStage = function () {
    $scope.stage.timestamp = new Date();
    console.log($scope.stage);
    $scope.stage.$save(function () {
      $scope.stage = new Stage();
      $scope.stage.shots = [];
      $location.path('/');
    });

  }
}

var DisciplineCtrl = function ($scope, $location) {

  $scope.disiplines = [
    'TJ Duel',
    'TJ Tempo',
    '25m 5/150sek',
    '25m 5*1/3sek',
    '25m 5/20sek',
    '25m 5/10sek',
    'IPSC'
  ];

  $scope.selectDiscipline = function () {
    currentStage.disipline = this.disipline;
    $location.path('/scoring');
  }
}


var ShooterCtrl = function ($scope, $location, Stage, Player) {

  //$scope.stage = currentStage;
  $scope.players = Player.query();

  $scope.selectPlayer = function () {
    $scope.player = this.player.name;
  }

  $scope.chooseShooter = function () {
    stage = new Stage();
    stage.shots = [];
    stage.player = $scope.player;

    exist = Player.query();

    var player = new Player();
    player.name = $scope.player;

    console.log(exist);
    //currentStage = stage;
    //$location.path('/discipline');
  }

  //$scope.stage = new Stage();
  //$scope.stage.shots = [];

  /*$scope.saveStage = function () {
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
  }*/

}

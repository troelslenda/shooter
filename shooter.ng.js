angular.module('shooter', ['backend'])
  .config(function () {
    console.log('onload');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', { controller: ShooterCtrl, templateUrl: 'shooter.html' })
  });

angular.module('backend', ['ngResource'])
  .factory('Shoot', function ($resource, $filter) {
    var Shoot = $resource('https://api.mongolab.com/api/1/databases' +
      '/shooter/collections/shoots/:id', {
        apiKey: '5031fdb7e4b01966199d1ba2',
      }, {
        update: { method: 'PUT' }
      }
    );
    Shoot.prototype.shots = [];
    Shoot.prototype.getScore = function () {
      var score = 0;
      for(i in this.shots) {
        var shot = this.shots[i];
        if(shot.ignore == '') {
          score += (shot.value == 'X' ? 10 : shot.value);
        }
      }
      return score;
    }
    Shoot.prototype.getBulls = function () {
      // @todo fix filter to include ignore
      return $filter('filter')(this.shots, { value: 'X', ignore : false });
    }
    Shoot.prototype.getShots = function () {
      // @todo fix filter to include ignore
      return $filter('filter')(this.shots, { ignore : false });
    }
    return Shoot;
  });

var Shot = function (value) {
  this.value = value;
  this.ignore = false;
}

Shot.prototype.ignoreToggle = function () {
  this.ignore = this.ignore == false ? true : false;
}

var ShooterCtrl = function ($scope, Shoot) {
  $scope.shoots = Shoot.query();
  $scope.values = [0, 5, 6, 7, 8, 9, 10, 'X'];

  $scope.shoot = new Shoot();
  $scope.shoot.shots = [];

  $scope.saveShoot = function () {
    $scope.shoot.shooter = $scope.shooter;
    $scope.shoot.discipline = $scope.discipline;
    $scope.shoot.timestamp = new Date();
    $scope.shoot.$save(function () {
      $scope.shoot = new Shoot();
      $scope.shoot.shots = [];
      $scope.shoots = Shoot.query();
    });
  }

  $scope.saveShot = function () {
    $scope.shoot.shots.push(new Shot(this.value));
  }
}

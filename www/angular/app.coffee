@app = angular.module('Table42', [])
  .config(['$routeProvider', ($routeProvider) ->
    $routeProvider
      .when('/', {
        templateUrl: 'angular/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  ])
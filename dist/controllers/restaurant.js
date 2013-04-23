(function() {

  window.RestaurantController = (function() {
    var navigateTo, param, title;

    function RestaurantController() {}

    navigateTo = function(template) {
      return steroids.layers.push(new steroids.views.WebView("/views/restaurant/" + template));
    };

    title = function(text) {
      return steroids.view.navigationBar.show(text);
    };

    param = function(name) {
      return steroids.view.params[name];
    };

    RestaurantController.index = function($scope, $http) {
      $scope.findTable = function() {
        return navigateTo("restaurant-picker.html");
      };
      $scope.open = function(id) {
        return navigateTo("show.html?id=" + id);
      };
      return title("Table42");
    };

    RestaurantController.pick = function($scope, $http) {
      $scope.choose = function(id) {
        return navigateTo("confirm.html?id=" + id);
      };
      $scope.restaurants = [];
      $http.get("../../data/restaurants.json").success(function(data) {
        return $scope.restaurants = data;
      });
      return title("Pick");
    };

    RestaurantController.confirm = function($scope, $http) {
      $scope.confirm = function(id) {
        return navigateTo("booked.html?id=" + id);
      };
      $http.get("../../data/restaurants.json").success(function(data) {
        return $scope.restaurant = data[param("id")];
      });
      return title("Confirm?");
    };

    RestaurantController.booked = function($scope, $http) {
      $http.get("../../data/restaurants.json").success(function(data) {
        return $scope.restaurant = data[param("id")];
      });
      return title("Booked!");
    };

    RestaurantController.show = function($scope, $http) {
      return $http.get("../../data/restaurants.json").success(function(data) {
        $scope.restaurant = data[param("id")];
        return steroids.view.navigationBar.show($scope.restaurant.name);
      });
    };

    return RestaurantController;

  })();

}).call(this);

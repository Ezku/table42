(function() {

  window.RestaurantController = (function() {

    function RestaurantController() {}

    RestaurantController.index = function($scope, $http) {
      $scope.open = function(id) {
        var webView;
        webView = new steroids.views.WebView("/views/restaurant/show.html?id=" + id);
        return steroids.layers.push(webView);
      };
      $http.get("../../data/restaurants.json").success(function(data) {
        console.log(data);
        return $scope.restaurants = data;
      });
      return steroids.view.navigationBar.show("Restaurant index");
    };

    RestaurantController.show = function($scope, $http) {
      return $http.get("../../data/restaurants.json").success(function(data) {
        $scope.restaurant = data[steroids.view.params["id"]];
        steroids.view.navigationBar.show($scope.restaurant.name);
        return alert($scope.restaurant.description);
      });
    };

    return RestaurantController;

  })();

}).call(this);

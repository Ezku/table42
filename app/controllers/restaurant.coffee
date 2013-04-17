class window.RestaurantController

  @index: ($scope, $http)->
    $scope.open = (id)->
      webView = new steroids.views.WebView "/views/restaurant/show.html?id="+id
      steroids.layers.push webView
    
    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurants = data
    
    steroids.view.navigationBar.show("Restaurant index")
    
    
  @show: ($scope, $http)->
    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurant = data[steroids.view.params["id"]]
      steroids.view.navigationBar.show($scope.restaurant.name)

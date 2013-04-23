class window.RestaurantController

  navigateTo = (template) ->
    steroids.layers.push new steroids.views.WebView "/views/restaurant/#{template}"

  title = (text) -> steroids.view.navigationBar.show(text)
  param = (name) -> steroids.view.params[name]

  @index: ($scope, $http) ->
    $scope.findTable = -> navigateTo "restaurant-picker.html"
    $scope.open = (id)-> navigateTo("show.html?id="+id)

    title "Table42"
  
  @pick: ($scope, $http) ->
    $scope.choose = (id) ->
      navigateTo "confirm.html?id="+id

    $scope.restaurants = []
    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurants = data

    title "Pick"

  @confirm: ($scope, $http) ->
    $scope.confirm = (id) ->
      navigateTo "booked.html?id="+id

    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurant = data[param("id")]

    title "Confirm?"

  @booked: ($scope, $http) ->
    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurant = data[param("id")]

    title "Booked!"
    
  @show: ($scope, $http)->
    $http.get("../../data/restaurants.json").success (data) ->
      $scope.restaurant = data[param("id")]
      steroids.view.navigationBar.show($scope.restaurant.name)

class window.RestaurantController

  navigateTo = (template) ->
    steroids.layers.push new steroids.views.WebView "/views/restaurant/#{template}"

  title = (text) -> steroids.view.navigationBar.show(text)
  param = (name) -> steroids.view.params[name]

  @index: ($scope, $http) ->
    $scope.findTable = -> navigateTo "restaurant-picker.html?patronNumber=#{$scope.patronNumber}&playlist_id=#{$scope.playlist}"
    
    $scope.patronNumber = "2"
    
    $scope.playlist = "1" # hardcoded initial selection

    title "Table42"
    
    document.addEventListener "touchmove", (e)->
      e.preventDefault()
  
  @pick: ($scope, $http) ->
    $scope.choose = (id) ->
      navigateTo "confirm.html?id=#{id}&patronNumber=#{param('patronNumber')}&playlist_id=#{param('playlist_id')}"

    $scope.restaurants = []
    $http.get("/data/restaurants#{param('playlist_id')}.json").success (data) ->
      $scope.restaurants = data

    # hardCodedRestaurant = {
    #   "id":2,
    #   "name":"Suola",
    #   "description":"<p>Suola on huippuhyvä ravintola, lorem ipsum</p>"
    # }
    #
    # refreshRestaurants = ()->
    #   $scope.restaurants.push hardCodedRestaurant
    #   console.log($scope.restaurants)
    #   $scope.$apply()

    # rightButton = new steroids.buttons.NavigationBarButton()
    # rightButton.title = "Save"
    # rightButton.onTap = ()->
    #   refreshRestaurants()
    #
    # steroids.view.navigationBar.setButtons { right: [rightButton] }

    title "Select Restaurant"

  @confirm: ($scope, $http) ->
    $scope.confirm = (id) ->
      navigateTo "booked.html?id=#{id}&playlist_id=#{param('playlist_id')}"

    $scope.patronNumber = param("patronNumber")
    $http.get("/data/restaurants#{param('playlist_id')}.json").success (data) ->
      $scope.restaurant = data[param("id")]

    title "Confirm?"
    
    document.addEventListener "touchmove", (e)->
      e.preventDefault()

  @booked: ($scope, $http) ->
    $http.get("/data/restaurants#{param('playlist_id')}.json").success (data) ->
      $scope.restaurant = data[param("id")]

    title "Booked!"
    
    document.addEventListener "touchmove", (e)->
      e.preventDefault()
    
  @show: ($scope, $http)->
    $http.get("/data/restaurants.json").success (data) ->
      $scope.restaurant = data[param("id")]
      steroids.view.navigationBar.show($scope.restaurant.name)

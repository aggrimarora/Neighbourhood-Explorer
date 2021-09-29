let map;
let marker;
let infoPane;
let infoWindow;
let initial = [];
let currentInfoWindow;
let bounds;
let currentMode;
let selectedMode;
let selectedIcon;
let check;
let placeAddress;
let searchedPlace;

    //initialize the map with markers and various services(direction, places, etc)
    function initMap() {
      currentMode = travelMode.driving;
      selectedMode = google.maps.DirectionsTravelMode.DRIVING;
      map = new google.maps.Map(document.getElementById("map"), {
        center: roomCoordinates,
        zoom: 14,
        style: "hide",
        gestureHandling: "greedy",
        zoomControl: "true"
      });
      infoWindow = new google.maps.InfoWindow();
      
      currentInfoWindow = infoWindow;
      var icon = {
        url: "./room.png",
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(doorWidth,doorHeight)
      }
      marker = new google.maps.Marker({position: roomCoordinates, map: map,
      animation: google.maps.Animation.DROP, icon: icon, title: "Room"});
      infoPane = document.getElementById("panel");
      const styles = {
        hide: [
          {
            featureType: "poi.business",
            stylers: [{visibility: "off"}]
          }
        ]
      }

      map.setOptions({styles: styles["hide"]});

      var input = document.getElementsByClassName("input")[0];
      var searchBox = new google.maps.places.SearchBox(input);
      bounds = new google.maps.LatLngBounds();
      bounds.extend(roomCoordinates);
      //Direction Service --------------------------------------
      directionService = new google.maps.DirectionsService();
      directionRenderer = new google.maps.DirectionsRenderer();
      directionRenderer.setMap(map);
      distanceService = new google.maps.DistanceMatrixService();
      //--------------------------------------------------------

      //listen for the search box query
      searchBox.addListener("places_changed", function() {
        var places = searchBox.getPlaces();
        if(places.length == 0 || places.length > 1) {
          return;
        }
        initial.forEach(function(marker) {
          marker.setMap(null);
        });
        initial = [];
        selectedIcon = "default";
        createMarker(places[0]);
        calcRoute(places[0]);
      });
    }

    let infowindow_route;
    //calculates route from placee to search result
    function calcRoute(place) {
      searchedPlace = place;
      if(currentInfoWindow != null) currentInfoWindow.close();
      var end = place.geometry.location;
      var routeRequest = {
          travelMode: selectedMode,
          origin: roomCoordinates,
          destination: end
      }
      directionService.route(routeRequest, function(response, status) {
        if (status == 'OK') {
          if(infowindow_route != null) infowindow_route.close();
          directionRenderer.setDirections(response);
          infowindow_route = new google.maps.InfoWindow();
          var step = Math.floor(response.routes[0].legs[0].steps.length/2);
          infowindow_route.setPosition(response.routes[0].legs[0].steps[step].end_location);
          infowindow_route.setContent(
            response.routes[0].legs[0].distance.text + "<br>" + response.routes[0].legs[0].duration.text + " "
          );
          currentInfoWindow = infowindow_route;
          infowindow_route.open(map);
        }
      });
      var results = document.getElementById("right-panel").classList;
      if(!results.contains("hidden")) results.add("hidden");
    }

    let service;
    //searches nearbh results for a particular category
    function findNearby(place) {
      var heading = document.getElementsByClassName("search-heading")[0];
      heading.innerHTML  = "Top Results for <i>\"" + category[place.value] + "\"</i>";
      bounds.extend(roomCoordinates);
      selectedIcon = place.value;
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: roomCoordinates,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: place.value
      }, callback);
      document.getElementById("right-panel").classList.remove("hidden");
      document.getElementById("places").innerHTML = ""
    }

    function callback(results, status) {
      check = 0;
      clearInitial();

      searchedPlace = null;
      if(infowindow_route != null) infowindow_route.close();
      if(status === google.maps.places.PlacesServiceStatus.OK) {
        for(var i = 0; i < results.length; i++) {
          if(results[i].rating > 3) {
            if(i >= 3 ) {
              if(distanceTwoPoints(results[i].geometry.location) < 4)
                createMarker(results[i]);
            }
            else {
              createMarker(results[i]);
            }
          }
        }
      }
    }

    //get distance between room and place you searched for
    function distanceTwoPoints(point){
      var origin = new google.maps.LatLng(roomCoordinates.lat, roomCoordinates.lng);
      return (google.maps.geometry.spherical.computeDistanceBetween(origin, point) / 1000); //dividing by 1000 to get Kilometers
    }

    //clear initial markers for next search results
    function clearInitial() {
        for(var i = 0; i < initial.length;i++) {
          initial[i].setMap(null);
        }
        initial = [];
        bounds = new google.maps.LatLngBounds();
        bounds.extend(roomCoordinates);
        map.setCenter(roomCoordinates);
        if(check == 1) {
          document.getElementById("right-panel").classList.add("hidden");
        }
        directionRenderer.set('directions', null);
    }

    //creating markers on the map
    function createMarker(place) {
      var list = document.getElementById("places");

      var placeLocation = place.geometry.location;
      var icon = {
        url: neighbourhood[selectedIcon],
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(iconWidth,iconHeight)
      }
      var marker = new google.maps.Marker({
        map: map,
        position: placeLocation,
        animation: google.maps.Animation.DROP,
        title: place.name,
        icon: icon,
      });
      createListItem(place, list, marker);

      marker.addListener('mouseover', () => {
        var icon = {
          url: neighbourhood[selectedIcon],
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(20,40),
          scaledSize: new google.maps.Size(scaledWidth, scaledHeight),
          strokeColor: "black"
        }
        marker.setIcon(icon)
      })

      marker.addListener('mouseout', () => {
        var icon = {
          url: neighbourhood[selectedIcon],
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(17,34),
          scaledSize: new google.maps.Size(iconWidth,iconHeight)
        }
        marker.setIcon(icon);
      })

      google.maps.event.addListener(marker, 'click', function() {
        let request = {
          placeId: place.place_id,
          fields
        };

        service.getDetails(request, (placeResult, status) => {
          showDetails(placeResult, marker, status);
          var routeRequest = {
              travelMode: selectedMode,
              origin: roomCoordinates,
              destination: marker.position
          }
          directionService.route(routeRequest, function(response, status) {
            if (status == 'OK') {
              console.log(response);
              updateInfoWindow(response);
              directionRenderer.setDirections(response);
              map.setZoom(14);
            }
          });
        });

      });

      initial.push(marker);
      bounds.extend(place.geometry.location);
      map.setZoom(14);
      map.fitBounds(bounds);
    }

    function updateInfoWindow(response) {
      var content = currentInfoWindow.content + response.routes[0].legs[0].distance.text + "<br>" + response.routes[0].legs[0].duration.text + " ";
      console.log(currentInfoWindow);
      setContent(content);
    }

    function setContent(content) {
      currentInfoWindow.setContent(content);
      currentInfoWindow.open(map);
    }

    function createListItem(place, list, marker) {
      var li = document.createElement("li");
      var width = 75 * (place.rating/5);
      content = "<div class=\"list-item\"><p>" + place.name + "<br>" + "<span class=\"address\">" + place.vicinity + "</span>" + "<span class=\"stars\"> <span style=\"width:" + width + "px;\"> </span></span>";
      li.onclick = function(li) {
        initial.forEach(function(marker) {
          if(marker.get('title') == place.name) {
            var routeRequest = {
                travelMode: selectedMode,
                origin: roomCoordinates,
                destination: marker.position
            }
            directionService.route(routeRequest, function(response, status) {
              if (status == 'OK') {
                if(currentInfoWindow != null) currentInfoWindow.close();
                directionRenderer.setDirections(response);
                infowindow_route = new google.maps.InfoWindow();
                var step = Math.floor(response.routes[0].legs[0].steps.length/2);
                infowindow_route.setPosition(response.routes[0].legs[0].steps[step].end_location);
                infowindow_route.setContent(
                  response.routes[0].legs[0].distance.text + "<br>" + response.routes[0].legs[0].duration.text + " "
                );
                infowindow_route.open(map);
                currentInfoWindow = infowindow_route;
              }
            });
          }
        });
      };
      updateDistance(li, place, content, marker);
    }

     function updateDistance(li, place, content, marker) {
      var list = document.getElementById("places");
      var d = distanceTwoPoints(place.geometry.location);
      content = content + "<span class=\"address\">" + d.toFixed(2) + "<span class=\"unit\"> km</span>" + "</span></p></div>";
      li.innerHTML = content;
      addChildToList(list, li);
      var div = document.createElement("div");
      div.classList.add("space");
      addChildToList(list, div);
    }

    function addChildToList(list, li) {
      list.appendChild(li);
    }

    //set content of infowindows for markers
    function showDetails(placeResult, marker, status) {
      let info;
      if (currentInfoWindow != null) {
        info = "";
      }
      if (status === google.maps.places.PlacesServiceStatus.OK){
        let placeInfoWindow = new google.maps.InfoWindow();
        let rating = "None";
        if(placeResult.rating) rating = placeResult.rating
        if(placeResult.formatted_address) placeAddress = placeResult.formatted_address;
        if(placeResult.vicinity) placeAddress = placeResult.vicinity;
        info = info + '<div class=\"infowindow\"><p class=\"details\"><strong>' + placeResult.name + '<br>' + 'Rating:' + rating + '<span class=\"star\">\u272e</span></strong></p>';
        updateContent(placeInfoWindow, info, marker)
      }
    }

    function updateContent(infowindow, content, marker) {
      infowindow.setContent(content);
      infowindow.open(marker.map, marker);
      currentInfoWindow.close();
      currentInfoWindow = infowindow;
    }

    function travelModeChanged(mode) {
        document.getElementById(currentMode).style.backgroundColor = "#eeeeee";
        document.getElementById(mode.id).style.backgroundColor = "#abaaaa";
        currentMode = mode.id;
        if(mode.id == travelMode.driving) {
          selectedMode = google.maps.DirectionsTravelMode.DRIVING;
        }
        else if(mode.id == travelMode.walking) {
          selectedMode = google.maps.DirectionsTravelMode.WALKING;
        }
        else if(mode.id == travelMode.transit) {
          selectedMode = google.maps.DirectionsTravelMode.TRANSIT;
        }
        if(searchedPlace != null) {
          calcRoute(searchedPlace);
        }
    }

    function showOptions() {
      document.getElementById("explore").classList.add("hidden");
      document.getElementById("categories").classList.remove("hidden");
    }

    function hideOptions() {
      check = 1;
      clearInitial();
      document.getElementById("explore").classList.remove("hidden");
      document.getElementById("categories").classList.add("hidden");
    }

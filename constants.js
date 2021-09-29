var neighbourhood = {
    "restaurant": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Restaurant_Map.png/:/rs=w:1440,h:1440",
    "cafe": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Cafe_Map.png/:/rs=w:1440,h:1440",
    "grocery": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Grocery_Map.png/:/rs=w:1440,h:1440",
    "hospital": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Hospital_Map.png/:/rs=w:1440,h:1440",
    "pharmacy": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Pharma_Map.png/:/rs=w:1440,h:1440",
    "night club": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Club_Map.png/:/rs=w:1440,h:1440",
    "cineplex": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Cinema_Map.png/:/rs=w:1440,h:1440",
    "gym": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Fitness_Map.png/:/rs=w:1440,h:1440",
    "default": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/default.png/:/rs=w:1440,h:1440",
    "TTC": "https://img1.wsimg.com/isteam/ip/68ccf4ad-ee8d-48fa-8ae2-a2ef5fb22f8a/Transit_Map.png/:/rs=w:1440,h:1440"
  };

  var category = {
    "restaurant": "Restaurant",
    "cafe": "Cafe",
    "grocery": "Grocery",
    "hospital": "Hospital",
    "pharmacy": "Pharmacy",
    "night club": "Club",
    "cineplex": "Cineplex",
    "gym": "Fitness",
    "TTC": "Transit"
  }

var travelMode = {
    driving: "driving",
    walking: "walking",
    transit: "transit"
};

var doorWidth;
var doorHeight;
var iconWidth;
var iconHeight;
var scaledWidth;
var scaledHeight;

if(window.innerWidth <= 768) {
    doorHeight = 45;
        doorWidth = 35;
        iconHeight = 25;
        iconWidth = 25;
        scaledHeight = 30;
        scaledWidth = 30;
} else {
    doorHeight = 60;
    doorWidth = 50;
    iconHeight = 35;
    iconWidth = 35;
    scaledHeight = 45;
    scaledWidth = 45;
}

var roomCoordinates = {lat: 43.64324457780123, lng: -79.39164290227217};
var room = roomCoordinates;

var fields = ['name', 'formatted_address', 'geometry', 'rating', 'website', 'photos'];

// direction services 
var directionService;
var directionRenderer;
var distanceService;
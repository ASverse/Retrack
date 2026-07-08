// send request from client to the server
const socket = io();

// check if the device support geolocation
// navigator inside window object
if (navigator.geolocation) {
  // use watch position to track the users location continously
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // emit the latitude and longitude via socket with "send-location", log errors
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      // high accuracy, no cache, 5sec
      enableHighAccuracy: true,
      timeout: 5000, // check every 5 sec
      maximumAge: 0, // no cache
    },
  );
}

// leaflet
// intialize map centered at coordinates (0,0) with zoom 15, add tiles
const map = L.map("map").setView([0, 0], 16)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Retrack"
}).addTo(map)

// create an empty object markers
const markers = {}

socket.on("receive-location", (data) => {
  // when recieving location via socket, extract id, lat, lon and center map with new coordinates
  const { id, latitude, longitude } = data;
  
  // if marker id exist update position, else create new marker given coordinate and add it to map. 
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 16);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// recieve existing users 
socket.on("existing-users", (users) => {
  Object.values(users).forEach(user => {
    if (!markers[user.id]) {
      markers[user.id] = L.marker([user.latitude, user.longitude]).addTo(map);
    }
  })
})

// When user disconnects delete it from map and markers
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id])
    delete markers[id]
  }
});
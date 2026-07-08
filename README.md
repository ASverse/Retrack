# Retrack - Real Time Location Tracking App

Retrack is a real-time location tracking web application that allows multiple users to share their live GPS location and view each other's movements on an interactive map.

The application uses **Socket.IO** for real-time communication, **Leaflet.js** for map visualization, and the browser's **Geolocation API** to continuously track user positions.

## Features

- Real-time location tracking
- Multiple users can share their live locations
- Live marker updates on the map
- Automatic removal of disconnected users
- Interactive map using Leaflet.js
- High accuracy GPS tracking
- Real-time communication using WebSockets

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Leaflet.js
- Socket.IO Client
- Browser Geolocation API

### Backend
- Node.js
- Express.js
- Socket.IO
- EJS Template Engine

## How It Works

### 1. User Opens the Website

When a user visits the application:

```
Browser
   |
   ↓
Express Server
   |
   ↓
index.ejs is rendered
```

The user receives:

- The webpage
- Leaflet map
- Socket.IO connection

The browser creates a socket connection:

```javascript
const socket = io();
```

This creates a persistent connection between the client and server.



### 2. Getting User Location

The application checks if the browser supports geolocation:

```javascript
navigator.geolocation
```

If supported, it uses:

```javascript
watchPosition()
```

instead of `getCurrentPosition()`.

### Difference:

`getCurrentPosition()`

- Gets location once

`watchPosition()`

- Continuously tracks movement
- Sends updates whenever location changes


Example:

```
User moves
    |
    ↓
GPS detects new coordinates
    |
    ↓
Browser receives latitude and longitude
```

The location data looks like:

```javascript
{
 latitude: 19.0760,
 longitude: 72.8777
}
```



### 3. Sending Location to Server

The client emits an event:

```javascript
socket.emit("send-location", {
 latitude,
 longitude
});
```

The event name is:

```
send-location
```

The data travels:

```
Browser
   |
   | send-location
   ↓
Socket.IO Server
```


### 4. Server Receives Location

The server listens:

```javascript
socket.on("send-location", function(data){

});
```

When a location is received, the server adds the user's socket ID:

```javascript
{
 id: socket.id,
 latitude: 19.0760,
 longitude: 72.8777
}
```

Every connected user receives the update:

```javascript
io.emit("receive-location", data)
```

Flow:

```
             Server

              |
     
     |          |          |
   User 1     User 2     User 3

```

All connected users get the latest location.



### 5. Displaying Markers on the Map

The frontend listens:

```javascript
socket.on("receive-location", data => {

})
```

When a location arrives:

```javascript
const {id, latitude, longitude} = data;
```

The app checks:

```javascript
if(markers[id])
```

#### If marker already exists:

The user moved.

The existing marker is updated:

```javascript
markers[id].setLatLng([
 latitude,
 longitude
]);
```

Example:

```
Old position

    📍


New position

          📍
```



#### If marker does not exist:

A new user joined.

A new marker is created:

```javascript
markers[id] =
L.marker([latitude, longitude])
.addTo(map);
```

The marker is stored:

```
markers = {

  user123 : Marker Object,

  user456 : Marker Object

}
```

This helps update the correct user later.



### 6. User Disconnect Handling

When a user closes the browser:

```
Browser closes
       |
       ↓
Socket disconnects
       |
       ↓
Server detects disconnect
```

The server emits:

```javascript
io.emit(
"user-disconnected",
socket.id
)
```

The frontend receives:

```javascript
socket.on(
"user-disconnected",
(id)=>{}
)
```

Then it removes the marker:

```javascript
map.removeLayer(markers[id])
```

The disconnected user disappears from the map.



## Application Architecture

```
                 Browser

        
        |                      |
        |  Geolocation API     |
        |          |           |
        |          ↓           |
        |   Socket.IO Client   |
        
                    |
                    |
              WebSocket
                    |
                    ↓

              Node.js Server

        
        | Express             |
        | Socket.IO           |
        | EJS Rendering       |
        

                    |
                    ↓

             All Connected Users

```



## Project Flow Summary

```
1. User opens website

2. Browser creates Socket.IO connection

3. Browser gets GPS coordinates

4. Coordinates are sent to server

5. Server broadcasts location

6. Other users receive location

7. Leaflet creates/updates markers

8. Disconnecting users are removed
```



## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
node app.js
```

Open:

```
http://localhost:3000
```

## Future Improvements

- Store user locations in a database
- Authentication system
- Show usernames instead of socket IDs
- Marker customization
- Location history tracking
- Private location sharing
- Mobile responsive design
- Route tracking


> Author
> [Abheeshta-P](https://github.com/Abheeshta-P): Built as a real-time location tracking project using Node.js, Socket.IO, and Leaflet.js.

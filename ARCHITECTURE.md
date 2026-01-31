# Architecture of Collaborative Drawing Canvas

This document explains how the project works internally in a simple way.

I am explaining this based on how I built and understood the project.



## Basic Idea

This project allows multiple users to draw on the same canvas.

When one user draws something:
The drawing is sent to the server
The server sends it to other connected users
Everyone sees the same drawing

The server controls the final drawing state so that all users stay in sync.



## Client Side (Browser)

The client runs in the browser and is written using plain JavaScript.

### canvas.js
Handles everything related to drawing
Listens to mouse events (mousedown, mousemove, mouseup)
Draws lines using HTML Canvas
Stores strokes locally for redraw
-sends completed strokes to the server
redraws the canvas when server sends updated history (undo)

### websocket.js
Connects the client to the server using Socket.IO
Sends drawing strokes to the server
Receives strokes from other users
Receives updated canvas data after undo
Updates the canvas based on server data

### main.js
Entry point of the application
Initializes the app
Used mainly for setup and logging


## Server Side (Node.js)

The server is responsible for managing the shared drawing state.

### server.js
Uses Express to serve frontend files
Uses Socket.IO for real-time communication
Receives drawing strokes from clients
Sends strokes to other connected clients
Handles global undo requests
Sends updated canvas history to all clients

### state-manager.js
Stores all drawing strokes on the server
Acts as the single source of truth
Adds new strokes when users draw
Removes last stroke when undo is requested
Sends updated stroke list to clients



## How Drawing Works

1. User draws on the canvas
2. Stroke is completed when mouse is released
3. Client sends the stroke to the server
4. Server saves the stroke
5. Server sends the stroke to other users
6. Other users draw the same stroke on their canvas



## How Undo Works

1. User clicks the Undo button
2. Client sends undo request to server
3. Server removes the last stroke
4. Server sends full updated stroke list
5. All clients redraw the canvas

Undo works globally for all users.



## Important Design Decisions

The server controls the drawing history
Clients do not modify shared state directly
Undo is global to avoid conflicts
Clear canvas sync is intentionally not implemented



## Conclusion

This project helped me understand:
How HTML Canvas works
How WebSockets enable real-time apps
How to sync state between multiple users
How client and server communicate in real-time

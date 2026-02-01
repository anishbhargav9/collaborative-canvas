# Collaborative Drawing Canvas

This is a simple real-time collaborative drawing application.

Here in this  collaborative drawing canvas multiple users can open the app in their browser and draw on a shared canvas.  
When one user draws, other connected users can see the drawing instantly.

The main goal of this project is to learn and understand:
the use of HTML Canvas
real-time communication using socket.io //Web sockets
lient–server state synchronization

---

## The features of this project are:

we can draw freely using mouse
we can choose brush color
we can change brush width
achieved real-time drawing sync between multiple users
it also  has the Global undo where the last stroke is removed from all the clients who are connected 



## The tech Stack used to build this project is 

Frontend: HTML, CSS, JavaScript 
Drawing: HTML5 Canvas
Backend: Node.js with Express
Real-time Communication: Socket.IO
Version Control: GitHub

---

## How the Application Works

Each user draws on a canvas in the browser
When a stroke is completed, it is sent to the server
The server stores all strokes as the main source of truth
The server broadcasts strokes to other connected users
All clients render the same strokes and stay in sync
Undo removes the most recent stroke globally for everyone

---

## How to Run the Project Locally

1. Clone the repository:
```bash
git clone https://github.com/anishbhargav9/collaborative-canvas.git


2. command to run in the powershell is npm start.

##Live Deployed Application link where we can see the demo of the application(Deployed in Render)
https://collaborative-canvas-90a3.onrender.com/


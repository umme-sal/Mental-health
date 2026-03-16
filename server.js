const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Store connected users and their anonymous IDs
const users = new Map();

// Generate random anonymous ID
function generateAnonymousId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

io.on('connection', (socket) => {
  console.log('New user connected');
  
  // Assign anonymous ID to user
  const anonymousId = generateAnonymousId();
  users.set(socket.id, { id: anonymousId, mood: '' });
  
  // Send welcome message and anonymous ID to user
  socket.emit('welcome', { 
    message: 'Welcome to our anonymous mental health support chat. You are anonymous here.', 
    yourId: anonymousId 
  });
  
  // Notify others about new user (without revealing ID)
  socket.broadcast.emit('user connected', { 
    message: 'A new user has joined the chat' 
  });
  
  // Handle mood updates
  socket.on('update mood', (mood) => {
    const user = users.get(socket.id);
    if (user) {
      user.mood = mood;
      socket.broadcast.emit('mood updated', {
        message: `A user is feeling ${mood}`
      });
    }
  });
  
  // Handle chat messages
  socket.on('chat message', (msg) => {
    const user = users.get(socket.id);
    io.emit('chat message', {
      id: user.id,
      message: msg,
      mood: user.mood
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    users.delete(socket.id);
    io.emit('user disconnected', {
      message: 'A user has left the chat'
    });
  });
});

// Resources route
app.get('/resources', (req, res) => {
  const resources = [
    { name: "National Suicide Prevention Lifeline", url: "https://suicidepreventionlifeline.org" },
    { name: "Crisis Text Line", url: "https://www.crisistextline.org" },
    { name: "NAMI Helpline", url: "https://www.nami.org/help" },
    { name: "7 Cups (Free Therapy)", url: "https://www.7cups.com" }
  ];
  res.json(resources);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

document.addEventListener('DOMContentLoaded', function() {
    // Connect to Socket.io
    const socket = io();
    
    // DOM elements
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
    const userIdElement = document.getElementById('user-id');
    const moodSelector = document.getElementById('mood');
    const resourcesList = document.getElementById('resources-list');
    
    // Load mental health resources
    fetch('/resources')
      .then(response => response.json())
      .then(resources => {
        resourcesList.innerHTML = '';
        resources.forEach(resource => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = resource.url;
          a.textContent = resource.name;
          a.target = '_blank';
          li.appendChild(a);
          resourcesList.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error loading resources:', error);
        resourcesList.innerHTML = '<li>Unable to load resources at this time.</li>';
      });
    
    // Handle welcome message
    socket.on('welcome', function(data) {
      userIdElement.textContent = data.yourId;
      
      const welcomeMsg = document.createElement('div');
      welcomeMsg.className = 'message system';
      welcomeMsg.innerHTML = `<p>${data.message}</p>`;
      messagesContainer.appendChild(welcomeMsg);
    });
    
    // Handle user connection notifications
    socket.on('user connected', function(data) {
      const msg = document.createElement('div');
      msg.className = 'message system';
      msg.innerHTML = `<p>${data.message}</p>`;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    
    // Handle user disconnection notifications
    socket.on('user disconnected', function(data) {
      const msg = document.createElement('div');
      msg.className = 'message system';
      msg.innerHTML = `<p>${data.message}</p>`;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    
    // Handle mood updates
    socket.on('mood updated', function(data) {
      const msg = document.createElement('div');
      msg.className = 'message system';
      msg.innerHTML = `<p>${data.message}</p>`;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    
    // Handle chat messages
    socket.on('chat message', function(data) {
      const isYou = data.id === userIdElement.textContent;
      
      const msg = document.createElement('div');
      msg.className = isYou ? 'message you' : 'message other';
      
      const messageInfo = document.createElement('div');
      messageInfo.className = 'message-info';
      messageInfo.textContent = isYou ? 'You' : `Anonymous ${data.id}`;
      if (data.mood) {
        messageInfo.textContent += ` is feeling ${data.mood}`;
      }
      
      const messageText = document.createElement('p');
      messageText.textContent = data.message;
      
      msg.appendChild(messageInfo);
      msg.appendChild(messageText);
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    
    // Send message
    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('chat message', message);
        messageInput.value = '';
      }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Update mood
    moodSelector.addEventListener('change', function() {
      if (this.value) {
        socket.emit('update mood', this.value);
      }
    });
  });
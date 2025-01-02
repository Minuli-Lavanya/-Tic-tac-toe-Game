const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 
const routes = require('./routes');
const db = require('./db/db');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('move', (data) => {
    io.emit('updateGame', data); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));

// Create web server
// -----------------

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Create object to store posts and comments
// -----------------------------------------
const posts = {};

// Handle POST requests to /posts
// ------------------------------
app.post('/posts', async (req, res) => {
  // Get title from request body
  const { title } = req.body;

  // Create new post object
  const post = { id: Math.random().toString(36).substr(2, 9), title, comments: [] };

  // Add post to posts object
  posts[post.id] = post;

  // Emit post created event to Event Bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: post,
  });

  // Send response
  res.status(201).send(post);
});

// Handle GET requests to /posts
// -----------------------------
app.get('/posts', (req, res) => {
  // Send posts object
  res.send(posts);
});

// Handle POST requests to /events
// -------------------------------
app.post('/events', (req, res) => {
  // Log event type
  console.log('Received Event:', req.body.type);

  // Send response
  res.send({});
});

// Listen on port 4000
// ------------------
app.listen(4000, () => {
  console.log('Listening on 4000');
});
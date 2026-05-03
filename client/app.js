const express = require('express');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware for parsing JSON bodies (fetch sends this format)
app.use(express.json());

// Database setup (shared by hw9 and hw10)
const db = require('./db/hw9-db');

// Mount hw9 routes
const hw9Router = require('./routes/hw9-routes')(db);
app.use('/api/hw9', hw9Router);

// Mount hw10 API routes
const hw10Router = require('./routes/hw10-routes')(db);
app.use('/api/hw10', hw10Router);

// Define a route for the root URL
app.get('/', (req,res) => {
    res.send('Greetings, Earth!');
    console.log('Root route accessed');
});

//Start the server
app.listen(3000, () => {
    console.log('Chat we\'re live at http://localhost:3000');
});
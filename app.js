require('dotenv').config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { engine } = require('express-handlebars'); // Correctly import express-handlebars

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // To parse URL-encoded payloads
app.use(bodyParser.json()); // To parse JSON payloads

// Serve static files from the 'public' directory
app.use(express.static('public')); // Ensure this directory exists

// Set up Handlebars as the view engine with .hbs extension
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Sample route to render a view

// // MySQL connection (uncomment and configure as needed)
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", // Change as needed
    database: process.env.DB_DATABASE || "management" // Change as needed
});


    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) throw err; 
            console.log("Error getting connection from pool:", err);
        console.log('Connected as ID ' + connection.threadId);
    });

const routes = require('./server/controllers/routes/user')
app.use('/', routes)
// Start the server
app.listen(4000, () => {
    console.log("Server is successfully running on port 4000");
});

// Helper function to wrap MySQL queries in a Promise
// function queryPromise(sql, values) {
//     return new Promise((resolve, reject) => {
//         db.query(sql, values, (error, results) => {
//             if (error) {
//                 return reject(error);
//             }
//             resolve(results);
//         });
//     });
// }

// Sample POST route (uncomment and adjust as needed)
// app.post('/comments', async (req, res) => {
//     const newComment = req.body; // Access the new comment from the request body
//     // Logic to save the new comment to the database
//     try {
//         const result = await queryPromise('INSERT INTO comments SET ?', newComment);
//         res.status(201).send("Comment added");
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         res.status(500).send("Error adding comment");
//     }
// });
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let db;
let trackingCollection;

// MongoDB Connection
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(process.env.DATABASE); // Select the database
        trackingCollection = db.collection(process.env.COLLECTION); // Select the collection
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Tracking pixel endpoint
app.get('/photos', async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const id = req.query.id || 'unknown';
    const time = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    try {
        const logData = { id, ip, device: userAgent, time };
        await trackingCollection.insertOne(logData); // Insert data into MongoDB collection
        console.log('Tracking data inserted:', logData);
    } catch (err) {
        console.error('Failed to log tracking:', err);
    }

    const imgPath = path.join(__dirname, 'pixel.png');
    res.sendFile(imgPath);
});

// Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
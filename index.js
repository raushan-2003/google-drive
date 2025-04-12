const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.get('/track', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const id = req.query.id || 'unknown';
    const time = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});

    const log = `${time} | ID: ${id} | IP: ${ip} | Device: ${userAgent}\n`;
    fs.appendFileSync('tracking_logs.txt', log);

    const imgPath = path.join(__dirname, 'pixel.png');
    res.sendFile(imgPath);
});

app.listen(port, () => {
    console.log(`Tracking server running at http://localhost:${port}`);
});
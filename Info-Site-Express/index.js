const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.all('{*splat}', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url + '.html'), (err, content) => {
        if (!err) {
            res.send(content.toString())
        } else {
            fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                if (!err) {
                    res.send(content.toString())
                } else {
                    res.status(500).send('Internal server error, file not found.');
                }
            })
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})
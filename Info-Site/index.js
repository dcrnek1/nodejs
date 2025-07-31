const http = require('http');
const path = require('path');
const fs = require('fs');

let PORT = 5000;

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            })
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    })
})


server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}/`)
})
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const serveStaticFile = (res, filePath, contentType, responseCode = 200) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error: Could not read file');
            return;
        }
        res.writeHead(responseCode, { 'Content-Type': contentType });
        res.end(data);
    });
};

const calculate = (num1, num2, operation) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (isNaN(num1) || isNaN(num2)) {
        return 'Invalid input';
    }

    switch (operation) {
        case 'add':
            return (num1 + num2).toString();
        case 'subtract':
            return (num1 - num2).toString();
        case 'multiply':
            return (num1 * num2).toString();
        case 'divide':
            if (num2 === 0) return 'Error: Div by zero';
            return (num1 / num2).toString();
        default:
            return 'Invalid operation';
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (req.method === 'GET') {
        if (pathname === '/') {
            serveStaticFile(res, path.join(__dirname, 'index.html'), 'text/html');
        } else if (pathname === '/styles.css') {
            serveStaticFile(res, path.join(__dirname, 'styles.css'), 'text/css');
        } else if (pathname === '/script.js') {
            serveStaticFile(res, path.join(__dirname, 'script.js'), 'text/javascript');
        } else if (pathname === '/calculate') {
            const { num1, num2, operation } = query;
            const result = calculate(num1, num2, operation);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result }));

        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('To stop the server, press CTRL+C');
});
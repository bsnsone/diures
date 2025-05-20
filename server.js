const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://peoplepulse.diu.edu.bd:8189';

const server = http.createServer((req, res) => {
    // Handle API proxy requests
    if (req.url.startsWith('/api/proxy')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const apiPath = url.searchParams.get('path');
        
        if (!apiPath) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing "path" query parameter.' }));
            return;
        }

        // Get all query parameters except 'path'
        const queryParams = new URLSearchParams();
        url.searchParams.forEach((value, key) => {
            if (key !== 'path') {
                queryParams.append(key, value);
            }
        });

        const apiUrl = `${API_BASE_URL}/${apiPath}?${queryParams.toString()}`;
        console.log('Making API request to:', apiUrl);
        
        http.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                const contentType = apiRes.headers['content-type'];
                
                res.writeHead(apiRes.statusCode, {
                    'Content-Type': contentType || 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
                res.end(data);
            });
        }).on('error', (err) => {
            console.error('API request failed:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch data from API' }));
        });
        
        return;
    }

    // Handle static file requests
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}); 
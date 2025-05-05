const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { path } = req.query;
    const apiUrl = `http://peoplepulse.diu.edu.bd:8189${path}`;
    try {
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : null
        });
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch API', details: error.message });
    }
};
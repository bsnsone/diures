export default async function handler(req, res) {
    const { path, ...query } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Missing "path" query parameter.' });
    }

    const baseUrl = 'http://peoplepulse.diu.edu.bd:8189/';
    const url = baseUrl + path + '?' + new URLSearchParams(query).toString();

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            const text = await response.text();
            res.status(200).send(text);
        }
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Failed to fetch data from DIU API.' });
    }
}

export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth || !h1Auth.includes(':')) {
        return res.status(500).json({ error: "Ustaw w Vercel H1_TOKEN na: royaal:TWÓJ_TOKEN" });
    }

    try {
        const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

        // fetch jest wbudowany w Node 20, nie potrzebuje instalacji
        const response = await fetch('https://api.hackerone.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth || !h1Auth.includes(':')) {
        return res.status(500).json({ error: "Błąd formatu w Vercel! Ma być login:token" });
    }

    const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne odrzucił ten token", 
                status: response.status,
                h1_response: data 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Crash: " + error.message });
    }
}

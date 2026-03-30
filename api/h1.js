export default async function handler(req, res) {
    const h1Username = process.env.H1_USERNAME;
    const h1Token = process.env.H1_TOKEN;

    if (!h1Username || !h1Token) {
        return res.status(500).json({ 
            error: "Brak zmiennych H1_USERNAME lub H1_TOKEN w Vercelu!" 
        });
    }

    try {
        const credentials = btoa(`${h1Username}:${h1Token}`);
        
        const response = await fetch('https://api.hackerone.com/v1/hackers/me/reports', {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

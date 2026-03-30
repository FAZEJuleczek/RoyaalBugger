export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth || !h1Auth.includes(':')) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN w Vercel (format: login:token)" });
    }

    try {
        const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

        // Używamy endpointu dla hakerów, żeby zobaczyć Twoje zgłoszenia
        const response = await fetch('https://api.hackerone.com/v1/hackers/reports', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "H1 odrzuca klucz", 
                h1_msg: data 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

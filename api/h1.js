export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth || !h1Auth.includes(':')) {
        return res.status(500).json({ 
            error: "Błąd konfiguracji Vercel",
            msg: "Upewnij się, że H1_TOKEN to royaal:klucz"
        });
    }

    try {
        // Kodujemy 'royaal:klucz' do Base64
        const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

        // Używamy wbudowanego fetch (Node 20+)
        const response = await fetch('https://api.hackerone.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne mówi: Nie", 
                status: response.status,
                h1_response: data 
            });
        }

        // Zwracamy raporty
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

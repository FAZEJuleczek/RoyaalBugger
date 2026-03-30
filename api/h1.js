export default async function handler(req, res) {
    // Pobieramy TYLKO token. Upewnij się, że w Vercelu nazywa się H1_TOKEN
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ 
            error: "Błąd konfiguracji Vercel", 
            details: "Nie znaleziono zmiennej H1_TOKEN w Settings -> Environment Variables" 
        });
    }

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // Czyścimy token i dodajemy Bearer
                'Authorization': `Bearer ${h1Auth.trim()}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne odrzucił dostęp", 
                status: response.status,
                details: data 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

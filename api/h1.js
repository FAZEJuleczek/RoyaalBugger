export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN; // Tu ma być Twój Base64 z Vercela

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak tokena H1_TOKEN w Vercelu!" });
    }

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // Dokładnie tak, jak napisałeś: Basic + spacja + zakodowany ciąg
                'Authorization': `Basic ${h1Auth.trim()}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne nie przyjął Basic Auth", 
                details: data 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

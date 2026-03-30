// api/h1.js
export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN!" });
    }

    try {
        // Czyścimy token z ewentualnych śmieci i dodajemy Basic
        const cleanToken = h1Auth.trim().replace('Basic ', '');
        
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${cleanToken}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        
        // Jeśli H1 zwróci błąd, przekaż go do przeglądarki, żebyśmy wiedzieli co jest nie tak
        if (!response.ok) {
            return res.status(response.status).json({ h1_error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Crash serwera: " + error.message });
    }
}

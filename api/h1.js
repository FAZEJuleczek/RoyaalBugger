export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak tokena w Vercelu!" });
    }

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // Używamy Basic, bo Twój ciąg to nick:klucz w Base64
                'Authorization': `Basic ${h1Auth.trim()}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "H1 odrzucił klucz", data });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

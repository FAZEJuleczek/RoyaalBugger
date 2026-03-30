export default async function handler(req, res) {
    // W Vercelu w H1_TOKEN zostaw sam ten długi klucz: zZ30Bpt...
    const apiToken = process.env.H1_TOKEN; 

    if (!apiToken) return res.status(500).json({ error: "Brak tokena w Vercel!" });

    try {
        const response = await fetch('https://api.hackerone.com/v1/me', {
            method: 'GET',
            headers: {
                // Próbujemy autoryzacji tokenem bezpośrednim
                'Authorization': `Token token="${apiToken.trim()}"`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        return res.status(response.status).json({
            status: response.status,
            metoda: "Token Auth",
            data: data
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

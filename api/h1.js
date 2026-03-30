export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth || !h1Auth.includes(':')) {
        return res.status(500).json({ 
            error: "Błąd konfiguracji Vercel",
            msg: "Wpisz w Environment Variables H1_TOKEN jako: royaal:TWÓJ_TOKEN"
        });
    }

    try {
        // Kodujemy Twoje dane do Base64
        const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

        // TESTUJEMY ENDPOINT /v1/me (sprawdzenie tożsamości)
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
                error: "HackerOne nadal Cię nie rozpoznaje", 
                status: response.status,
                h1_response: data,
                uzyty_login: h1Auth.split(':')[0]
            });
        }

        // Jeśli sukces, zobaczysz swoje dane profilowe z H1
        return res.status(200).json({
            message: "AUTORYZACJA DZIAŁA!",
            profile_data: data
        });

    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

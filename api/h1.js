export default async function handler(req, res) {
    const allKeys = Object.keys(process.env);
    const tokenValue = process.env.H1_TOKEN;

    // Jeśli token nie istnieje, wypiszemy wszystkie dostępne nazwy zmiennych
    if (!tokenValue) {
        return res.status(500).json({ 
            error: "Vercel nadal nie widzi H1_TOKEN", 
            widoczne_zmienne: allKeys.filter(k => !k.includes('AUTH') && !k.includes('KEY')) // filtr bezpieczeństwa
        });
    }

    // Jeśli istnieje, sprawdzamy czy ma dwukropek
    if (!tokenValue.includes(':')) {
        return res.status(500).json({ 
            error: "Zmienna istnieje, ale brakuje w niej dwukropka!",
            poczatek_zmiennej: tokenValue.substring(0, 5) + "..."
        });
    }

    // Jeśli wszystko ok, spróbujmy się połączyć
    try {
        const base64Auth = Buffer.from(tokenValue.trim()).toString('base64');
        const response = await fetch('https://api.hackerone.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

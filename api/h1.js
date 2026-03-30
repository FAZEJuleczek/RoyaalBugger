export default async function handler(req, res) {
    // === KONFIGURACJA NA SZTYWNO ===
    const user = "royaal"; 
    const token = "xYp9zubOuiuHSFiuLy4NWAhTg1WCgHeh5QqwFBXYppg="; // <-- TUTAJ WKLEJASZ TOKEN
    // ===============================

    try {
        // Sklejamy i kodujemy do Base64 ręcznie w kodzie
        const auth = Buffer.from(`${user}:${token.trim()}`).toString('base64');

        // Walimy prosto w endpoint dla hakerów
        const response = await fetch('https://api.hackerone.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        // Jeśli mimo to jest 401, to HackerOne ma problem z Twoim kontem
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "H1 nadal odrzuca klucz (NAWET NA SZTYWNO)", 
                status: response.status,
                h1_raw_msg: data,
                uzyty_login: user
            });
        }

        // Sukces - zwracamy dane
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Crash: " + err.message });
    }
}

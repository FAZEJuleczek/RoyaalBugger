export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN; 

    // Diagnostyka: Jeśli zapomniałeś dodać tokena w Vercelu, serwer o tym powie
    if (!h1Auth) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN w ustawieniach Vercel!" });
    }

    try {
        const url = 'https://api.hackerone.com/v1/reports';
        // UWAGA: Na serwerze (Backend) nie potrzebujesz cors-anywhere! 
        // Serwer może gadać z H1 bezpośrednio.
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${h1Auth.trim()}`
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

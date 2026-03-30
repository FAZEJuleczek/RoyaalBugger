export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    // Sprawdzenie czy zmienna w ogóle istnieje w Vercelu
    if (!h1Auth) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN w ustawieniach Vercel!" });
    }

    try {
        const url = 'https://api.hackerone.com/v1/reports';
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Bearer z Twoim tokenem i obowiązkowy przecinek na końcu linii!
                'Authorization': `Bearer ${h1Auth.trim()}`,
                'Accept': 'application/json'
            }
        });

        // Pobieramy dane z HackerOne
        const data = await response.json();

        // Jeśli H1 odpowie błędem (np. 401), przekaż to do dashboardu
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne odmówił dostępu",
                details: data 
            });
        }

        // Jeśli wszystko ok, wyślij raporty
        return res.status(200).json(data);

    } catch (error) {
        // Jeśli serwer Vercela padnie (np. błąd składni)
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak tokena w Vercelu!" });
    }

    // Czyścimy wszystko - usuwamy "Basic " jeśli tam jest i białe znaki
    const cleanToken = h1Auth.replace('Basic ', '').trim();

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // To musi być DOKŁADNIE tak: Słowo Basic, spacja i Twój czysty Base64
                'Authorization': `Basic ${cleanToken}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Jeśli tu dostaniesz 401, to znaczy, że TOKEN WYGASŁ na HackerOne
            return res.status(response.status).json({ 
                error: "HackerOne odrzucił poświadczenia",
                status: response.status,
                received_token_start: cleanToken.substring(0, 10) + "..." 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Błąd krytyczny: " + error.message });
    }
}

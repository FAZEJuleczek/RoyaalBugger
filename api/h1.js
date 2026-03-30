export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN w Vercelu!" });
    }

    // Czyścimy token tylko z ewentualnych spacji i słowa "Basic "
    const finalToken = h1Auth.trim().replace('Basic ', '');

    try {
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // Wysyłamy surowe Base64, które masz w Vercelu
                'Authorization': `Basic ${finalToken}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne nadal mówi NIE", 
                h1_status: response.status,
                h1_response: data 
            });
        }

        // Jeśli tu wejdzie, to znaczy że KLUCZ JEST DOBRY
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Server Crash: " + error.message });
    }
}

export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Brak zmiennej H1_TOKEN w Vercelu!" });
    }

    try {
        let finalToken = h1Auth.trim();
        
        // Jeśli token zawiera dwukropek, znaczy że to 'nick:klucz' i trzeba zakodować
        if (finalToken.includes(':')) {
            finalToken = Buffer.from(finalToken).toString('base64');
        } else {
            // Jeśli to już Base64, usuwamy tylko 'Basic ' jeśli tam jest
            finalToken = finalToken.replace('Basic ', '');
        }

        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${finalToken}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "H1 odrzucił dostęp", 
                h1_status: response.status,
                debug_token_start: finalToken.substring(0, 5),
                h1_response: data 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Server Crash: " + error.message });
    }
}

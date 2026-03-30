export default async function handler(req, res) {
    // Pobieramy to, co masz w Vercel Settings (H1_TOKEN)
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ 
            error: "Brak zmiennej H1_TOKEN!",
            tip: "Wejdź w Vercel -> Settings -> Envs i dodaj H1_TOKEN" 
        });
    }

    try {
        // CZYŚCIMY I KODUJEMY:
        // Jeśli wkleiłeś tam tekst "royaal:klucz", to Buffer zamieni go na poprawne Base64.
        // Jeśli wkleiłeś już Base64, to usunie śmieci i wyśle czysty token.
        let finalToken = h1Auth.trim();
        
        // Sprawdzamy czy to już jest Base64 (czy ma : w środku). 
        // Jeśli ma dwukropek, to znaczy że to tekst jawny i musimy go zakodować.
        if (finalToken.includes(':')) {
            finalToken = Buffer.from(finalToken).toString('base64');
        } else {
            // Jeśli to już Base64, usuwamy tylko słowo "Basic " jeśli tam było
            finalToken = finalToken.replace('Basic ', '');
        }

        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                // To jest ten pancerny nagłówek, o który walczymy
                'Authorization': `Basic ${finalToken}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        // Jeśli H1 nadal odrzuca, wypluwamy info dla nas do debugu
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne odrzucił dostęp",
                status: response.status,
                sent_token_preview: finalToken.substring(0, 10) + "...",
                h1_msg: data 
            });
        }

        // SUKCES - wysyłamy raporty do Twojego dashboardu
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Błąd serwera: " + error.message });
    }
}

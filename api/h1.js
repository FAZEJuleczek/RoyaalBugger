export default async function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    // 1. Sprawdzamy czy zmienna w ogóle jest
    if (!h1Auth) {
        return res.status(500).json({ error: "Brak H1_TOKEN w Vercel Settings!" });
    }

    // 2. Sprawdzamy czy format jest poprawny (royaal:klucz)
    if (!h1Auth.includes(':')) {
        return res.status(500).json({ 
            error: "Zly format tokena!", 
            widziany_tekst: h1Auth.substring(0, 5) + "...",
            tip: "Wpisz w Vercelu surowe royaal:klucz (bez Base64)" 
        });
    }

    try {
        // 3. Kodujemy do Base64
        const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

        // 4. Wysyłamy do HackerOne
        const response = await fetch('https://api.hackerone.com/v1/reports', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        // 5. Obsługa błędów autoryzacji (401)
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "HackerOne nadal mówi NIE", 
                status: response.status,
                debug: {
                    login_uzyty: h1Auth.split(':')[0],
                    dlugosc_tokena: h1Auth.split(':')[1]?.length,
                    h1_msg: data 
                }
            });
        }

        // 6. SUKCES! Zwracamy raporty
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Server Crash: " + error.message });
    }
}

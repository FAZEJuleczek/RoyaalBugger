export default async function handler(req, res) {
    // Ten plik wyśle dane z bazy bez pokazywania klucza w przeglądarce
    const supaUrl = 'https://fvxodipuudkhzykpleul.supabase.co/rest/v1/logs?select=*';
    const supaKey = process.env.SUPABASE_KEY; 

    try {
        const response = await fetch(supaUrl, {
            headers: {
                'apikey': supaKey,
                'Authorization': `Bearer ${supaKey}`
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "Błąd bazy" });
    }
}

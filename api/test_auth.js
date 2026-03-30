export default function handler(req, res) {
    const h1Auth = process.env.H1_TOKEN;

    if (!h1Auth) {
        return res.status(500).json({ error: "Vercel nie widzi H1_TOKEN!" });
    }

    const base64Auth = Buffer.from(h1Auth.trim()).toString('base64');

    return res.status(200).json({
        twoja_zmienna_surowa: h1Auth,
        wygenerowany_naglowek: `Basic ${base64Auth}`,
        czy_zawiera_dwukropek: h1Auth.includes(':'),
        dlugosc_stringa: h1Auth.length
    });
}

async function loadH1() {
    const out = document.getElementById('h1-stream');
    try {
        // Pytasz swój własny serwer, a on ma klucze ukryte!
        const response = await fetch('/api/h1'); 
        const res = await response.json();
        
        if (res.data) {
            out.innerHTML = res.data.map(r => `
                <div class="item h1-item">
                    <b>#${r.id}</b>: ${r.attributes.title}
                </div>`).join('');
        }
    } catch (e) {
        out.innerHTML = "Agent nie odpowiada...";
    }
}

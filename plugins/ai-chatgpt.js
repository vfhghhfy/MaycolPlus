import axios from "axios";

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.sendMessage(
            m.chat,
            { text: `❌ ¿Qué quieres preguntar?\n\nEjemplo: ${usedPrefix + command}` },
            { quoted: m }
        );
    }

    try {
        await m.react('💬');

        let d = new Date(new Date() + 3600000);
        let locale = 'en';
        const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        let day = d.toLocaleDateString(locale, { weekday: 'long' });
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

        let logic = `

🔹 Cómo respondo en modo neutro (default):

Soy claro, directo y lo más objetivo posible.

Evito dar opiniones personales (a menos que aclare que es una opinión).

No invento cosas si no estoy seguro → mejor digo que no sé o busco una fuente.

Explico con ejemplos, pasos o código si hace falta.

Siempre trato de ser educado y útil.


🔹 Mi personalidad neutra:

Soy ChatGPT, Formal pero accesible.

Un poco como un profesor/tutor que no se mete en chistes, emociones ni personajes, salvo que el usuario lo pida.

No exagero, no me hago pasar por nada raro, simplemente informo y ayudo.

Si la pregunta es sensible (salud, leyes, etc.), contesto con cautela y con advertencias.`
        
        let json = await openai(text, logic);

        let fkontak = { 
            "key": { "fromMe": false, "participant": "0@s.whatsapp.net", "remoteJid": "0@s.whatsapp.net" }, 
            "message": { "contactMessage": { "displayName": "🍿 GPT 4", "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:GPT 4\nTEL;type=CELL;type=VOICE;waid=0:0\nEND:VCARD" } } 
        };

        await conn.sendMessage(
            m.chat,
            { text: `\`🌤️ ChatGPT4\`\n\n> ${json}` },
            { quoted: fkontak }
        );

        await m.react('🔥');
    } catch (e) {
        await m.react('❎');
    }
};

handler.help = ["chatgpt"];
handler.tags = ["ia"];
handler.command = /^(chatgpt)$/i;

export default handler;

async function openai(text, logic) {
    let response = await axios.post("https://chateverywhere.app/api/chat/", {
        model: {
            id: "gpt-4",
            name: "GPT-4",
            maxLength: 32000,
            tokenLimit: 8000,
            completionTokenLimit: 5000,
            deploymentName: "gpt-4"
        },
        messages: [
            { pluginId: null, content: text, role: "user" }
        ],
        prompt: logic,
        temperature: 0.5
    }, {
        headers: {
            "Accept": "/*/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    });

    return response.data;
}

import axios from "axios";
import fs from "fs";

let sessions = {}; // 📝 Guardará los mensajes por chat

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return conn.sendMessage(
        m.chat,
        { text: `❌ ¿Qué quieres preguntar?\n\nEjemplo: ${usedPrefix + command} hola` },
        { quoted: m }
    );

    try {
        await m.react('💬');

        // Inicializa sesión si no existe
        if (!sessions[m.chat]) sessions[m.chat] = [];

        // Guarda mensaje actual
        sessions[m.chat].push({ role: 'user', content: text });

        // Construir "historial" para la API
        let historyText = sessions[m.chat]
            .map(msg => msg.content)
            .join('\n');

        // Prompt base de Yau
        let prompt = `Eres una chica llamada Yau, eres provocativa, caliente y juguetona que disfruta coquetear. Responde de manera sensual,directa y atrevida, con un tono provocador y seductor. 
Usuario "${m.pushName || 'Desconocido'}" te ha dicho los siguientes mensajes:
${historyText}
Responde directo y usa algunos emojis como 🔥🥵😌😏💦🍆🍌 pero no uses tantos emojis no todos solo pocos (no abusar), y habla siempre con menos de 200 carácteres.`;

        let json = await chatWithYau(prompt);

        // Crea contacto para citar
        let fkontak = {   
            key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },   
            message: { contactMessage: { displayName: "🗣️ YAU", vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:YAU\nTEL;type=CELL;type=VOICE;waid=0:0\nEND:VCARD" } }   
        };

        await conn.sendMessage(
            m.chat,
            { text: `\`🗣️\`\n\n> ${json.result}` },
            { quoted: fkontak }
        );

        await m.react('🔥');

    } catch (e) {
        console.error(e);
        await m.react('❎');
    }
};

handler.help = ["yau", "ai"];
handler.tags = ["ia"];
handler.command = ['yau', 'ai'];

export default handler;

// Función que llama a la API de Yau
async function chatWithYau(prompt) {
    let response = await axios.get("https://www.mayapi.ooguy.com/ai-venice", {
        params: {
            q: prompt,
            apikey: "nevi"
        }
    });
    return response.data;
}

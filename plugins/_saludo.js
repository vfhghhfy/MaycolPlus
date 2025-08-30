import fetch from "node-fetch";

const handler = async (m, { conn }) => {
    const msgText = (
        m?.text ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        ""
    ).toLowerCase().trim();

    // Diccionario: palabra -> URL de audio
    const audioMap = {
        "hola": "https://files.catbox.moe/3y7q23.mp3",
        "hila": "https://files.catbox.moe/3y7q23.mp3",
        "holi": "https://files.catbox.moe/3y7q23.mp3",
        "ola": "https://files.catbox.moe/3y7q23.mp3",
        "oa": "https://files.catbox.moe/3y7q23.mp3",
        "hi": "https://files.catbox.moe/3y7q23.mp3",
        "hl": "https://files.catbox.moe/3y7q23.mp3",
        "hh": "https://files.catbox.moe/3y7q23.mp3",

        "gracias": "https://files.catbox.moe/nin6cv.mp3",
        "grasias": "https://files.catbox.moe/nin6cv.mp3",
        "muchas gracias": "https://files.catbox.moe/nin6cv.mp3",

        // 🚀 Nuevas palabras
        "pito": "https://files.catbox.moe/62yrix.mp3",
        "gemidos": "https://files.catbox.moe/cemz2z.mp3",
        "bartolito": "https://files.catbox.moe/mbkoo8.mp3",
        "gallo": "https://files.catbox.moe/mbkoo8.mp3",
        "bendicion": "https://files.catbox.moe/l7upzc.mp3"
    };

    let foundKey = null;

    // Buscar palabra exacta usando regex con límites (\b)
    for (let key of Object.keys(audioMap)) {
        const regex = new RegExp(`\\b${key}\\b`, "i"); 
        if (regex.test(msgText)) {
            foundKey = key;
            break;
        }
    }

    if (foundKey) {
        try {
            // Reacción random
            const sEmojis = ["👋", "😺", "🙌", "🎁", "🥰", "😇", "😊", "😙"];
            const emoji = sEmojis[Math.floor(Math.random() * sEmojis.length)];

            await conn.sendMessage(m.chat, {
                react: {
                    text: emoji,
                    key: m.key
                }
            });

            await conn.sendPresenceUpdate("recording", m.chat);
            await new Promise(r => setTimeout(r, 2100));

            // Descargar y enviar el audio
            let res = await fetch(audioMap[foundKey]);
            if (!res.ok) throw new Error("No se pudo descargar el audio");

            let buffer = await res.arrayBuffer();
            let audioBuffer = Buffer.from(buffer);

            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                ptt: true,
                mimetype: "audio/mpeg",
                fileName: foundKey + ".mp3"
            }, { quoted: m });

            await conn.sendPresenceUpdate("paused", m.chat);

        } catch (e) {
            console.error(e);
            await m.reply("❌ No se pudo enviar el audio.");
        }
    }
};

// Regex: despierta el handler solo si hay palabra exacta
handler.customPrefix = /\b(hola|hila|holi|ola|oa|hi|hl|hh|gracias|grasias|muchas gracias|pito|gemidos|bartolito|gallo|bendicion)\b/i;
handler.command = new RegExp();

export default handler;

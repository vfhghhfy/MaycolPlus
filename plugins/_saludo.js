import fetch from "node-fetch";

const handler = async (m, { conn }) => {
      const msgText = (
        m?.text || 
        m.message?.conversation || 
        m.message?.extendedTextMessage?.text || 
        m.message?.imageMessage?.caption || 
        ""
    ).toLowerCase().trim();

    const saludos = ["hola", "hila", "holi", "ola", "oa", "hi", "hl", "hh"];
    const gracias = ["gracias", "grasias", "muchas gracias"];

    const isHola = saludos.includes(msgText);
    const isGracias = gracias.includes(msgText);

    if (isHola || isGracias) {
        
        const sEmojis = isHola 
            ? ["👋", "😺", "🙌", "🎁"] 
            : ["🥰", "😇", "😊", "😙"];
        
        const emoji = sEmojis[Math.floor(Math.random() * sEmojis.length)];

        
        await conn.sendMessage(m.chat, {
            react: {
                text: emoji,
                key: m.key
            }
        });

        try {
        
            await conn.sendPresenceUpdate("recording", m.chat);
        } catch {}

        
        await new Promise(r => setTimeout(r, 2100));

        try {
            
            let url = "https://myapiadonix.vercel.app/api/adonixvoz?q=" + encodeURIComponent(msgText);
            let res = await fetch(url);

            if (!res.ok) {
                throw new Error("Error al obtener audio: " + res.status);
            }

            let buffer = await res.buffer();

            
            await conn.sendMessage(m.chat, {
                audio: buffer,
                ptt: true, 
                mimetype: "audio/mpeg",
                fileName: msgText + ".mp3"
            }, { quoted: m });

        } catch (e) {
            console.error(e);
            await m.reply("❌ No se pudo generar el audio.");
        }

        try {
            await conn.sendPresenceUpdate("paused", m.chat);
        } catch {}
    }
};


handler.customPrefix = /^(hila|holi|ola|oa|hi|hl|gracias|grasias|hh|muchas gracias)$/i;
handler.command = new RegExp();

export default handler;

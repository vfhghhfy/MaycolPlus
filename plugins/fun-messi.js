import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let res = (await axios.get(`https://raw.githubusercontent.com/davidprospero123/api-anime/main/BOT-JSON/Messi.json`)).data;
    let url = res[Math.floor(Math.random() * res.length)];

    const buttons = [
        {
            buttonId: `.messi`,
            buttonText: { displayText: "⚜️ Otro" },
            type: 1
        }
    ];

    await conn.sendMessage(
        m.chat,
        {
            image: { url },
            caption: "Aquí tienes.",
            buttons: buttons,
            viewOnce: true
        },
        { quoted: m }
    );
};

handler.help = ['messi'];
handler.tags = ['fun'];
handler.command = /^(messi)$/i;

export default handler;
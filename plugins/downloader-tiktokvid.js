import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
  conn.tiktok = conn.tiktok || {};

  let query;
  let fromButton = false;

  if (text) {
    query = text;
  } else if (m.sender in conn.tiktok) {
    query = conn.tiktok[m.sender].query;
    fromButton = true;
  }

  if (!query) {
    return m.reply(`✐ Ingresa una búsqueda para TikTok\n> *Ejemplo:* ${usedPrefix + command} haikyuu edit`);
  }

  try {
    let tiktokData = conn.tiktok[m.sender];

    if (!fromButton || !tiktokData || tiktokData.index >= tiktokData.videos.length) {
      const res = await axios.get(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(query)}`);
      const json = res.data;

      if (!json.status || !json.data || !json.data.length) {
        return m.reply('❌ No se encontró ningún video para esa búsqueda.');
      }

      conn.tiktok[m.sender] = {
        query: query,
        index: 0,
        videos: json.data,
        time: setTimeout(() => delete conn.tiktok[m.sender], 60000),
      };
      tiktokData = conn.tiktok[m.sender];
    }
    
    let currentIndex = tiktokData.index;
    let vid = tiktokData.videos[currentIndex];
    tiktokData.index++;

    let caption = `💜 \`${vid.title}\`\n\n` +
                  `> ✦ *Autor:* » ${vid.author}\n` +
                  `> ✰ *Vistas:* » ${vid.views.toLocaleString()}\n` +
                  `> 🜸 *Link:* » ${vid.url}`;

    const buttons = [
      {
        buttonId: `${usedPrefix}${command}`,
        buttonText: { displayText: 'Más' },
        type: 1,
      },
    ];

    await conn.sendMessage(m.chat, {
      video: { url: vid.url },
      caption: caption,
      buttons: buttons,
      headerType: 4,
    }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.');
    if (m.sender in conn.tiktok) {
      delete conn.tiktok[m.sender];
    }
  }
};

handler.help = ['tiktokvid'];
handler.tags = ['downloader'];
handler.command = ['tiktokvid', 'playtiktok'];
handler.register = false;
export default handler;


import axios from 'axios';
import fs from 'fs';
import path from 'path';

// ┏━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃   ♛ MaycolPlus ♛    ┃
// ┃ Creado por SoyMaycol ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━┛

// Forzar Node a usar ./tmp para archivos temporales
process.env.TMPDIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true });
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat, 
        `💜 ┏━━━━━━━━━━┓\n┃  Uso ${usedPrefix + command} ┃\n┗━━━━━━━━━━┛\n✨ Ejemplo: ${usedPrefix + command} Mini Dog`, 
        m
      );
    }

    // Reacción mientras procesa
    m.react('⏳');

    let old = new Date();

    // Buscar videos en TikTok
    let res = await ttks(text);
    let videos = res.data;

    if (!videos.length) {
      return conn.reply(m.chat, "⚠️ ❌ No se encontraron videos con esa búsqueda.", m);
    }

    // Caption decorativo estilo Hanako-kun
    let cap = `💮 ◈ 𝗧𝗶𝗸𝗧𝗼𝗸 ◈ 💮\n\n` +
              `🎴 ✦ 𝗧𝗶́𝘁𝘂𝗹𝗼  : ${videos[0].title}\n` +
              `🌸 ✦ 𝗕𝘂́𝘀𝗾𝘂𝗲𝗱𝗮 : ${text}\n\n` +
              `👻 𝗕𝗼𝘁: MaycolPlus | Creado por SoyMaycol`;

    // Preparar los medios a enviar
    let medias = videos.map((video, index) => ({
      type: "video",
      data: { url: video.no_wm },
      caption: index === 0
        ? cap
        : `🎴 ✦ Título : ${video.title}\n⏱️ Tiempo de proceso : ${((new Date() - old) * 1)} ms\n👻 MaycolPlus`
    }));

    // Enviar videos
    await conn.sendSylphy(m.chat, medias, { quoted: m });
    m.react('✅');

  } catch (e) {
    return conn.reply(
      m.chat, 
      `💀 Ocurrió un error al obtener los videos:\n\n` + e, 
      m
    );
  }
};

handler.command = ["ttsesearch", "tiktoks", "ttrndm", "ttks", "tiktoksearch"];
handler.help = ["tiktoksearch"];
handler.tags = ["search"];
export default handler;

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ Función para buscar TikToks sin watermark ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
async function ttks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 20,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (!videos.length) throw new Error("⚠️ ❌ No se encontraron videos para esa búsqueda.");

    // Mezclar resultados y limitar a 5
    const shuffled = videos.sort(() => 0.5 - Math.random()).slice(0, 5);
    return {
      status: true,
      creator: "SoyMaycol",
      data: shuffled.map(video => ({
        title: video.title,
        no_wm: video.play,
        watermark: video.wmplay,
        music: video.music
      }))
    };
  } catch (error) {
    throw error;
  }
}

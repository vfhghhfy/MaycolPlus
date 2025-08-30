import yts from "yt-search";
import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ El hechizo necesita un encantamiento  
│  
> Ingresa el nombre de un video o una URL de YouTube.  
├─ Consulta los conjuros disponibles con:  
│   ⇝ .help  
╰─✦`);

  await m.react("🕛");

  try {
    const res = await yts(text);
    if (!res || !res.videos || res.videos.length === 0) {
      return m.reply("❌ No se encontraron resultados para tu búsqueda.");
    }

    const video = res.videos[0];
    const title = video.title || "Sin título";
    const authorName = video.author?.name || "Desconocido";
    const durationTimestamp = video.timestamp || "Desconocida";
    const views = video.views || "Desconocidas";
    const url = video.url || "";
    const thumbnail = video.thumbnail || "";

    const isDirectDownload = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4"].includes(command);

    // Barra de progreso inicial
    let progress = 0;
    const msg = await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ ⏳ Procesando: [${"░".repeat(0)}${"█".repeat(0)}] 0%  
╰─✦`,
      headerType: 4
    }, { quoted: m });

    // Animar barra de progreso mientras llega la respuesta de la API
    const interval = setInterval(async () => {
      if (progress < 90) progress += 5;
      try {
        await conn.editMessageCaption(m.chat, msg.key, {
          caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ ⏳ Procesando: [${"█".repeat(progress/10)}${"░".repeat(10-progress/10)}] ${progress}%  
╰─✦`
        });
      } catch {}
    }, 500);

    // Llamada a la API de Vreden según comando
    let apiUrl;
    if (["play", "playaudio", "ytmp3"].includes(command)) {
      apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
    } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
      apiUrl = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    clearInterval(interval); // Detener barra de progreso
    progress = 100; // Llevar al 100%
    try {
      await conn.editMessageCaption(m.chat, msg.key, {
        caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ ✅ Listo! [${"█".repeat(10)}] 100%  
╰─✦`
      });
    } catch {}

    // Enviar audio o video
    if (data?.result?.download?.url) {
      const downloadUrl = data.result.download.url;
      const cleanTitle = cleanName(title) + (["play", "playaudio", "ytmp3"].includes(command) ? ".mp3" : ".mp4");
      const messagePayload = ["play", "playaudio", "ytmp3"].includes(command) ? {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: cleanTitle
      } : {
        video: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: cleanTitle
      };
      await conn.sendMessage(m.chat, messagePayload, { quoted: m });
      await m.react("✅");
    } else {
      await m.reply("❌ Error: no se pudo obtener la descarga de la API.");
      await m.react("❌");
    }

  } catch (error) {
    console.error("❌ Error general:", error);
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ El hechizo falló  
├─ Error: ${error.message}  
╰─✦`);
    await m.react("❌");
  }
};

function cleanName(name) {
  return name.replace(/[^\w\s-_.]/gi, "").substring(0, 50);
}

handler.command = handler.help = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4", "yt"];
handler.tags = ["descargas"];

export default handler;

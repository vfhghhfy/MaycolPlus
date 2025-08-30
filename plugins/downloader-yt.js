import yts from "yt-search";
import fetch from "node-fetch";

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
    // Buscar con yt-search
    const res = await yts(text);
    if (!res || !res.videos || res.videos.length === 0)
      return m.reply("❌ No se encontraron resultados para tu búsqueda.");

    const video = res.videos[0];
    const title = video.title || "Sin título";
    const authorName = video.author?.name || "Desconocido";
    const durationTimestamp = video.timestamp || "Desconocida";
    const views = video.views || "Desconocidas";
    const url = video.url || "";
    const thumbnail = video.thumbnail || "";

    // Mensaje inicial con info + progreso
    let progress = 0;
    const processingMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
│  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso: [${"#".repeat(progress)}${" ".repeat(10 - progress)}] ${progress * 10}%  
╰─✦`;

    // Enviar mensaje inicial con thumbnail
    let msg;
    if (thumbnail) {
      msg = await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: processingMessage,
        headerType: 4
      }, { quoted: m });
    } else {
      msg = await conn.sendMessage(m.chat, {
        text: processingMessage
      }, { quoted: m });
    }

    // Simular progreso cada 0.5s hasta que llegue a 90%
    while (progress < 9) {
      await new Promise(r => setTimeout(r, 500));
      progress++;
      const newCaption = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
│  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso: [${"#".repeat(progress)}${" ".repeat(10 - progress)}] ${progress * 10}%  
╰─✦`;

      // Editar mensaje solo si hay cambio real
      if (msg?.key?.id) {
        await conn.editMessageCaption(msg.key, newCaption);
      }
    }

    // Llamar a la API según tipo de descarga
    const apiUrl = command.includes("mp3") || command.includes("audio") 
      ? `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`
      : `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`;

    const apiRes = await fetch(apiUrl).then(res => res.json());

    if (!apiRes?.result?.download?.url)
      throw new Error("No se pudo obtener la URL de descarga.");

    // Subir al 100% antes de enviar
    progress = 10;
    const finalCaption = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
│  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso: [${"#".repeat(progress)}] 100%  
╰─✦`;

    await conn.editMessageCaption(msg.key, finalCaption);

    // Enviar archivo
    if (command.includes("mp3") || command.includes("audio")) {
      await conn.sendMessage(m.chat, {
        audio: { url: apiRes.result.download.url },
        mimetype: "audio/mpeg",
        fileName: apiRes.result.download.filename
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: apiRes.result.download.url },
        mimetype: "video/mp4",
        fileName: apiRes.result.download.filename
      }, { quoted: m });
    }

    await m.react("✅");

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

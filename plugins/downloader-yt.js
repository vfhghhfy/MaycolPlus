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
    // 1️⃣ Buscar video
    const res = await yts(text);
    if (!res?.videos?.length) return m.reply("❌ No se encontraron resultados.");

    const video = res.videos[0];
    const title = video.title || "Sin título";
    const authorName = video.author?.name || "Desconocido";
    const durationTimestamp = video.timestamp || "Desconocida";
    const views = video.views || "Desconocidas";
    const url = video.url || "";
    const thumbnail = video.thumbnail || "";

    // 2️⃣ Preparar mensaje con info y barra de progreso
    let progress = 0;
    const getProgressBar = (p) => {
      const total = 20;
      const filled = Math.floor((p / 100) * total);
      return "█".repeat(filled) + "░".repeat(total - filled) + ` ${p}%`;
    };

    const infoMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso de descarga:  
${getProgressBar(progress)}  
╰─✦`;

    let sentMsg = await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
    }, { quoted: m });

    // 3️⃣ Animar barra en loop cada 0.5s hasta recibir respuesta de API
    const interval = setInterval(async () => {
      if (progress < 89) {
        progress += 1;
        await conn.editMessageCaption(m.chat, sentMsg.key, {
          caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso de descarga:  
${getProgressBar(progress)}  
╰─✦`,
        });
      }
    }, 500);

    // 4️⃣ Llamar a API de descarga según comando
    let apiUrl;
    if (["play", "playaudio", "ytmp3"].includes(command)) {
      apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
    } else {
      apiUrl = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`;
    }

    const resApi = await fetch(apiUrl).then(r => r.json());
    if (!resApi.result?.download?.url) throw new Error("No se pudo obtener el archivo");

    // 5️⃣ Actualizar barra al 90%
    progress = 90;
    await conn.editMessageCaption(m.chat, sentMsg.key, {
      caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso de descarga:  
${getProgressBar(progress)}  
╰─✦`,
    });

    clearInterval(interval); // Detener animación

    // 6️⃣ Enviar archivo
    const fileUrl = resApi.result.download.url;
    const fileName = resApi.result.download.filename;

    if (["play", "playaudio", "ytmp3"].includes(command)) {
      await conn.sendMessage(m.chat, {
        audio: { url: fileUrl },
        mimetype: "audio/mpeg",
        fileName: fileName,
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: fileUrl },
        mimetype: "video/mp4",
        fileName: fileName,
      }, { quoted: m });
    }

    // 7️⃣ Barra al 100%
    progress = 100;
    await conn.editMessageCaption(m.chat, sentMsg.key, {
      caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」  
│  
├─ 「❀」${title}  
├─ ✧ Canal: ${authorName}  
├─ ✧ Duración: ${durationTimestamp}  
├─ ✧ Vistas: ${views}  
│  
├─ Progreso de descarga:  
${getProgressBar(progress)}  
╰─✦`,
    });

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

handler.command = handler.help = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4", "yt"];
handler.tags = ["descargas"];
export default handler;

import yts from "yt-search";

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
        // Buscar con yt-search
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

        if (isDirectDownload) {
            // Crear mensaje inicial con información del video
            const initialMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${authorName}
├─ ✧ Duración: ${durationTimestamp}
├─ ✧ Vistas: ${views}
│
├─ ⏳ Procesando descarga...
├─ ▓░░░░░░░░░ 10%
╰─✦`;

            // Enviar mensaje inicial
            let sentMessage;
            if (thumbnail) {
                sentMessage = await conn.sendMessage(m.chat, {
                    image: { url: thumbnail },
                    caption: initialMessage,
                }, { quoted: m });
            } else {
                sentMessage = await conn.sendMessage(m.chat, {
                    text: initialMessage,
                }, { quoted: m });
            }

            // Iniciar descarga basada en el comando
            if (["play", "playaudio", "ytmp3"].includes(command)) {
                await downloadAudio(conn, m, url, title, sentMessage, thumbnail);
            } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
                await downloadVideo(conn, m, url, title, sentMessage, thumbnail);
            }
        } else {
            // Mostrar botones para selección manual
            const buttons = [
                { buttonId: `.ytmp3 ${url}`, buttonText: { displayText: "♪ Descargar Audio ♪" }, type: 1 },
                { buttonId: `.ytmp4 ${url}`, buttonText: { displayText: "♣ Descargar Video ♣" }, type: 1 },
            ];

            const processingMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${authorName}
├─ ✧ Duración: ${durationTimestamp}
├─ ✧ Vistas: ${views}
│
├─ Selecciona el formato de descarga:
╰─✦`;

            try {
                if (thumbnail) {
                    await conn.sendMessage(m.chat, {
                        image: { url: thumbnail },
                        caption: processingMessage,
                        buttons,
                        headerType: 4,
                    }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, {
                        text: processingMessage,
                        buttons,
                        headerType: 1,
                    }, { quoted: m });
                }
            } catch {
                await m.reply(processingMessage + "\n\nResponde:\n• 1 para audio\n• 2 para video");
            }
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

const downloadAudio = async (conn, m, url, title, sentMessage, thumbnail) => {
    let progress = 10;
    let progressInterval;
    let lastProgressText = "";

    try {
        const cleanTitle = cleanName(title) + ".mp3";
        
        // Iniciar animación de progreso
        progressInterval = setInterval(async () => {
            if (progress < 80) {
                progress += Math.floor(Math.random() * 5) + 2; // Incremento aleatorio entre 2-6
                if (progress > 80) progress = 80;
                
                const progressBar = createProgressBar(progress);
                const newMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${title.split(' - ')[0] || "Desconocido"}
├─ ✧ Procesando audio...
│
├─ ⏳ Descargando...
├─ ${progressBar} ${progress}%
╰─✦`;

                if (newMessage !== lastProgressText) {
                    lastProgressText = newMessage;
                    await updateMessage(conn, m.chat, sentMessage, newMessage, thumbnail);
                }
            }
        }, 500);

        // Realizar descarga
        const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.status !== 200 || !data.result.download.url) {
            throw new Error("No se pudo obtener el enlace de descarga");
        }

        // Actualizar a 90% cuando se recibe la respuesta
        progress = 90;
        const progressBar90 = createProgressBar(progress);
        const message90 = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${data.result.metadata.author.name}
├─ ✧ Enviando audio...
│
├─ ⏳ Finalizando...
├─ ${progressBar90} ${progress}%
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, message90, thumbnail);
        clearInterval(progressInterval);

        // Enviar archivo de audio
        await conn.sendMessage(m.chat, {
            audio: { url: data.result.download.url },
            mimetype: "audio/mpeg",
            fileName: cleanTitle,
        }, { quoted: m });

        // Actualizar a 100% y finalizar
        const progressBar100 = createProgressBar(100);
        const finalMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${data.result.metadata.author.name}
├─ ✧ ¡Descarga completada!
│
├─ ✅ Audio enviado
├─ ${progressBar100} 100%
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, finalMessage, thumbnail);
        await m.react("✅");

    } catch (error) {
        clearInterval(progressInterval);
        console.error("❌ Error descargando audio:", error);
        
        const errorMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ❌ Error en la descarga
├─ ${error.message}
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, errorMessage, thumbnail);
        await m.react("❌");
    }
};

const downloadVideo = async (conn, m, url, title, sentMessage, thumbnail) => {
    let progress = 10;
    let progressInterval;
    let lastProgressText = "";

    try {
        const cleanTitle = cleanName(title) + ".mp4";
        
        // Iniciar animación de progreso
        progressInterval = setInterval(async () => {
            if (progress < 80) {
                progress += Math.floor(Math.random() * 5) + 2; // Incremento aleatorio entre 2-6
                if (progress > 80) progress = 80;
                
                const progressBar = createProgressBar(progress);
                const newMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${title.split(' - ')[0] || "Desconocido"}
├─ ✧ Procesando video...
│
├─ ⏳ Descargando...
├─ ${progressBar} ${progress}%
╰─✦`;

                if (newMessage !== lastProgressText) {
                    lastProgressText = newMessage;
                    await updateMessage(conn, m.chat, sentMessage, newMessage, thumbnail);
                }
            }
        }, 500);

        // Realizar descarga
        const apiUrl = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.status !== 200 || !data.result.download.url) {
            throw new Error("No se pudo obtener el enlace de descarga");
        }

        // Actualizar a 90% cuando se recibe la respuesta
        progress = 90;
        const progressBar90 = createProgressBar(progress);
        const message90 = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${data.result.metadata.author.name}
├─ ✧ Enviando video...
│
├─ ⏳ Finalizando...
├─ ${progressBar90} ${progress}%
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, message90, thumbnail);
        clearInterval(progressInterval);

        // Enviar archivo de video
        await conn.sendMessage(m.chat, {
            video: { url: data.result.download.url },
            mimetype: "video/mp4",
            fileName: cleanTitle,
        }, { quoted: m });

        // Actualizar a 100% y finalizar
        const progressBar100 = createProgressBar(100);
        const finalMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ✧ Canal: ${data.result.metadata.author.name}
├─ ✧ ¡Descarga completada!
│
├─ ✅ Video enviado
├─ ${progressBar100} 100%
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, finalMessage, thumbnail);
        await m.react("✅");

    } catch (error) {
        clearInterval(progressInterval);
        console.error("❌ Error descargando video:", error);
        
        const errorMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 「❀」${title}
│
├─ ❌ Error en la descarga
├─ ${error.message}
╰─✦`;

        await updateMessage(conn, m.chat, sentMessage, errorMessage, thumbnail);
        await m.react("❌");
    }
};

const updateMessage = async (conn, chatId, sentMessage, newText, thumbnail) => {
    try {
        const messageKey = sentMessage.key;
        
        // Intentar diferentes métodos de edición
        if (thumbnail) {
            // Si hay thumbnail, intentar editar el caption
            try {
                await conn.relayMessage(chatId, {
                    protocolMessage: {
                        key: messageKey,
                        type: 14,
                        editedMessage: {
                            imageMessage: {
                                url: thumbnail,
                                caption: newText
                            }
                        }
                    }
                }, {});
            } catch {
                // Método alternativo para WhatsApp Web
                try {
                    await conn.sendMessage(chatId, {
                        edit: messageKey,
                        text: newText
                    });
                } catch {
                    // Si todo falla, no hacer nada para evitar spam
                    console.log("No se pudo editar el mensaje");
                }
            }
        } else {
            // Si es solo texto, editar directamente
            try {
                await conn.sendMessage(chatId, {
                    edit: messageKey,
                    text: newText
                });
            } catch {
                try {
                    await conn.relayMessage(chatId, {
                        protocolMessage: {
                            key: messageKey,
                            type: 14,
                            editedMessage: {
                                conversation: newText
                            }
                        }
                    }, {});
                } catch {
                    console.log("No se pudo editar el mensaje de texto");
                }
            }
        }
    } catch (error) {
        console.error("Error actualizando mensaje:", error.message);
    }
};

const createProgressBar = (percentage) => {
    const totalBars = 10;
    const filledBars = Math.floor((percentage / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    
    const filled = "▓".repeat(filledBars);
    const empty = "░".repeat(emptyBars);
    
    return filled + empty;
};

function cleanName(name) {
    return name.replace(/[^\w\s-_.]/gi, "").substring(0, 50);
}

handler.command = handler.help = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4", "yt"];
handler.tags = ["descargas"];

export default handler;

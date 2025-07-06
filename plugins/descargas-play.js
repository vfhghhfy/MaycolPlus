import yts from "yt-search"
import { ytv, yta } from "@soymaycol/maytube"

const limit = 100

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ El hechizo necesita un encantamiento
│
> Ingresa el nombre de un video o una URL de YouTube.
├─ Consulta los conjuros disponibles con:
│   ⇝ *.help*
╰─✦`)

  await m.react("🕛")

  console.log("🔍 Buscando en YouTube...")

  try {
    let video
    const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text)

    if (isUrl) {
      // Procesar URL directamente
      video = { url: text }
      const videoId = getYouTubeID(text)
      
      if (!videoId) {
        return m.reply("❌ No se pudo extraer el ID del video del enlace proporcionado.")
      }

      // Búsqueda rápida por ID
      const searchResult = await yts(videoId)
      
      if (searchResult && (searchResult.title || searchResult.videoId)) {
        video.title = searchResult.title || "Sin título"
        video.author = { name: searchResult.author?.name || "Desconocido" }
        video.views = searchResult.views || "Desconocidas"
        video.duration = {
          seconds: searchResult.seconds || 0,
          timestamp: searchResult.timestamp || "Desconocida"
        }
        video.thumbnail = searchResult.thumbnail
      } else {
        // Fallback básico
        video.title = "Video de YouTube"
        video.author = { name: "Desconocido" }
        video.views = "Desconocidas"
        video.duration = { seconds: 0, timestamp: "Desconocida" }
        video.thumbnail = null
      }
    } else {
      // Búsqueda por texto
      const res = await yts(text)
      if (!res || !res.all || !Array.isArray(res.all) || res.all.length === 0) {
        return m.reply("❌ No se encontraron resultados para tu búsqueda.")
      }
      video = res.all[0]
    }

    const title = video.title || "Sin título"
    const authorName = video.author?.name || "Desconocido"
    const durationTimestamp = video.duration?.timestamp || "Desconocida"
    const views = video.views || "Desconocidas"
    const url = video.url || ""
    const thumbnail = video.thumbnail || ""

    // Verificar tipo de comando
    const isDirectDownload = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4"].includes(command)

    if (isDirectDownload) {
      // Descarga directa - mensaje simple
      await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ *「❀」${title}*
│
├─ ⏳ Procesando... 
╰─✦`)

      // Ejecutar descarga según comando
      if (["play", "playaudio", "ytmp3"].includes(command)) {
        await downloadAudio(conn, m, video, title)
      } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
        await downloadVideo(conn, m, video, title)
      }

    } else {
      // Mostrar botones para elegir formato (.yt comando)
      const buttons = [
        {
          buttonId: `.ytmp3 ${url}`,
          buttonText: { displayText: "♪ Descargar Audio ♪" },
          type: 1
        },
        {
          buttonId: `.ytmp4 ${url}`,
          buttonText: { displayText: "♣ Descargar Video ♣" },
          type: 1
        },
        {
          buttonId: `.valoracion ¡Hola!, tuve un error con el .yt, lo puede arreglar por favor? este fue el link ${url}`,
          buttonText: { displayText: "♦ Reportar error ♦" },
          type: 1
        }
      ]

      const processingMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ *「❀」${title}*
│
├─ *✧ Canal:* ${authorName}
├─ *✧ Duración:* ${durationTimestamp}
├─ *✧ Vistas:* ${views}
│
├─ Selecciona el formato de descarga:
╰─✦`

      try {
        if (thumbnail) {
          await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: processingMessage,
            buttons: buttons,
            headerType: 4
          }, { quoted: m })
        } else {
          await conn.sendMessage(m.chat, {
            text: processingMessage,
            buttons: buttons,
            headerType: 1
          }, { quoted: m })
        }
      } catch (buttonError) {
        console.log("⚠️ Error con botones, enviando mensaje simple:", buttonError.message)
        await m.reply(processingMessage + "\n\n*Responde:*\n• `1` para audio\n• `2` para video")
      }
    }

  } catch (error) {
    console.error("❌ Error general:", error)
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ El hechizo falló
│
├─ Error: ${error.message}
╰─✦`)
    await m.react("❌")
  }
}

const downloadAudio = async (conn, m, video, title) => {
  try {
    console.log("🎧 Descargando audio...")

    const api = await yta(video.url)

    if (!api || !api.status || !api.result || !api.result.download) {
      throw new Error("No se pudo obtener el enlace de descarga del audio")
    }

    const downloadUrl = api.result.download
    const audioTitle = api.result.title || title
    const cleanTitle = audioTitle.replace(/[^\w\s]/gi, '').substring(0, 50)

    console.log("🎶 Enviando audio como documento...")
    
    // Enviar como documento MP3 para evitar corrupción
    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${cleanTitle}.mp3`,
      caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${audioTitle}*
│
├─ *✧ Calidad:* ${api.result.quality || '128kbps'}
├─ *✧ Tamaño:* ${api.result.size || 'Desconocido'}
├─ *✧ Formato:* MP3
│
├─ Audio listo ✨
╰─✦`
    }, { quoted: m })

    await m.react("✅")
    console.log("✅ Audio enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    
    // Intentar método alternativo
    try {
      console.log("🔄 Intentando método alternativo...")
      
      const api = await yta(video.url)
      if (api && api.status && api.result && api.result.download) {
        await conn.sendFile(
          m.chat,
          api.result.download,
          `${(api.result.title || title).replace(/[^\w\s]/gi, '')}.mp3`,
          `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 Audio alternativo
│
├─ *${api.result.title || title}*
╰─✦`,
          m,
          null,
          { asDocument: true, mimetype: 'audio/mpeg' }
        )
        await m.react("✅")
      } else {
        throw new Error("Método alternativo también falló")
      }
    } catch (altError) {
      console.error("❌ Error en método alternativo:", altError)
      await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ El hechizo de audio falló
│
├─ Error: ${error.message}
╰─✦`)
      await m.react("❌")
    }
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("📹 Descargando video...")

    const api = await ytv(video.url)

    let downloadUrl, videoTitle, videoSize, videoQuality
    
    if (api.status && api.result) {
      downloadUrl = api.result.download
      videoTitle = api.result.title
      videoSize = api.result.size
      videoQuality = api.result.quality
    } else if (api.url) {
      downloadUrl = api.url
      videoTitle = api.title || title
      videoSize = 'Desconocido'
      videoQuality = 'Desconocida'
    } else {
      throw new Error("No se pudo obtener el enlace de descarga del video")
    }

    // Verificar tamaño rápidamente
    let sizemb = 0
    try {
      const res = await fetch(downloadUrl, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      if (cont) {
        sizemb = parseInt(cont, 10) / (1024 * 1024)
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo verificar tamaño")
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 Archivo muy pesado: ${sizemb.toFixed(2)} MB
├─ 📏 Límite: ${limit} MB
╰─✦`)
    }

    console.log("🎥 Enviando video...")
    
    const doc = sizemb > 50 // Enviar como documento si es mayor a 50MB
    const cleanTitle = (videoTitle || title).replace(/[^\w\s]/gi, '').substring(0, 50)
    
    await conn.sendFile(
      m.chat,
      downloadUrl,
      `${cleanTitle}.mp4`,
      `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 📹 *${videoTitle || title}*
│
├─ *✧ Calidad:* ${videoQuality}
├─ *✧ Tamaño:* ${videoSize || (sizemb > 0 ? `${sizemb.toFixed(2)} MB` : 'Desconocido')}
├─ *✧ Formato:* MP4
│
├─ Video listo ✨
╰─✦`,
      m,
      null,
      {
        asDocument: doc,
        mimetype: "video/mp4"
      }
    )

    await m.react("✅")
    console.log("✅ Video enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando video:", error)
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ El hechizo de video falló
│
├─ Error: ${error.message}
╰─✦`)
    await m.react("❌")
  }
}

const getYouTubeID = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  return null
}

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'playvid', 'ytv', 'ytmp4', 'yt']
handler.tags = ['descargas']

export default handler

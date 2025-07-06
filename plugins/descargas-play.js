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
├─ *✧ Canal:* ${authorName}
├─ *✧ Duración:* ${durationTimestamp}
├─ *✧ Vistas:* ${views}
│
├─ ⏳ Procesando descarga...
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
    console.log("📊 Respuesta API Audio:", api) // Debug

    if (!api || !api.status || !api.result) {
      throw new Error("API no devolvió datos válidos")
    }

    // Verificar múltiples formatos de respuesta
    const downloadUrl = api.result.download || api.result.url || api.result.link
    const audioTitle = api.result.title || title
    const audioQuality = api.result.quality || '128kbps'
    const audioSize = api.result.size || 'Desconocido'
    
    if (!downloadUrl) {
      throw new Error("No se pudo obtener el enlace de descarga del audio")
    }

    // Verificar tamaño del archivo
    let sizemb = 0
    try {
      const res = await fetch(downloadUrl, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      if (cont) {
        sizemb = parseInt(cont, 10) / (1024 * 1024)
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo verificar tamaño:", sizeError.message)
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 Archivo muy pesado: ${sizemb.toFixed(2)} MB
├─ 📏 Límite: ${limit} MB
╰─✦`)
    }

    const cleanTitle = audioTitle.replace(/[^\w\s\-\_]/gi, '').substring(0, 50)
    
    console.log("🎶 Enviando audio...")
    
    // Intentar enviar audio con múltiples métodos
    try {
      // Método 1: Audio directo (mejor calidad)
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${cleanTitle}.mp3`,
        ptt: false
      }, { quoted: m })
      
      // Enviar información adicional
      await conn.sendMessage(m.chat, {
        text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${audioTitle}*
│
├─ *✧ Calidad:* ${audioQuality}
├─ *✧ Tamaño:* ${audioSize}
├─ *✧ Formato:* MP3
│
├─ ✅ Audio enviado exitosamente
╰─✦`
      }, { quoted: m })
      
    } catch (audioError) {
      console.log("⚠️ Error enviando como audio, probando como documento:", audioError.message)
      
      // Método 2: Documento (más compatible)
      await conn.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${cleanTitle}.mp3`,
        caption: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${audioTitle}*
│
├─ *✧ Calidad:* ${audioQuality}
├─ *✧ Tamaño:* ${audioSize}
├─ *✧ Formato:* MP3
│
├─ ✅ Audio como documento
╰─✦`
      }, { quoted: m })
    }

    await m.react("✅")
    console.log("✅ Audio enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    
    // Método de respaldo usando sendFile
    try {
      console.log("🔄 Intentando método de respaldo...")
      
      const api = await yta(video.url)
      if (api && api.status && api.result && (api.result.download || api.result.url)) {
        const downloadUrl = api.result.download || api.result.url
        const audioTitle = api.result.title || title
        
        await conn.sendFile(
          m.chat,
          downloadUrl,
          `${audioTitle.replace(/[^\w\s\-\_]/gi, '').substring(0, 50)}.mp3`,
          `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${audioTitle}*
│
├─ ✅ Audio (método alternativo)
╰─✦`,
          m,
          null,
          { asDocument: true, mimetype: 'audio/mpeg' }
        )
        await m.react("✅")
      } else {
        throw new Error("Método de respaldo también falló")
      }
    } catch (altError) {
      console.error("❌ Error en método de respaldo:", altError)
      await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ El hechizo de audio falló
│
├─ Error: ${error.message}
├─ Alternativo: ${altError.message}
╰─✦`)
      await m.react("❌")
    }
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("📹 Descargando video...")

    const api = await ytv(video.url)
    console.log("📊 Respuesta API Video:", api) // Debug

    let downloadUrl, videoTitle, videoSize, videoQuality
    
    // Verificar múltiples formatos de respuesta
    if (api && api.status && api.result) {
      downloadUrl = api.result.download || api.result.url || api.result.link
      videoTitle = api.result.title || title
      videoSize = api.result.size || 'Desconocido'
      videoQuality = api.result.quality || 'Desconocida'
    } else if (api && api.url) {
      downloadUrl = api.url
      videoTitle = api.title || title
      videoSize = api.size || 'Desconocido'
      videoQuality = api.quality || 'Desconocida'
    } else {
      throw new Error("No se pudo obtener el enlace de descarga del video")
    }

    if (!downloadUrl) {
      throw new Error("URL de descarga no válida")
    }

    // Verificar tamaño del archivo
    let sizemb = 0
    try {
      const res = await fetch(downloadUrl, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      if (cont) {
        sizemb = parseInt(cont, 10) / (1024 * 1024)
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo verificar tamaño:", sizeError.message)
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 Archivo muy pesado: ${sizemb.toFixed(2)} MB
├─ 📏 Límite: ${limit} MB
╰─✦`)
    }

    console.log("🎥 Enviando video...")
    
    const cleanTitle = (videoTitle || title).replace(/[^\w\s\-\_]/gi, '').substring(0, 50)
    const asDocument = sizemb > 50 // Enviar como documento si es mayor a 50MB
    
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
├─ ✅ Video enviado exitosamente
╰─✦`,
      m,
      null,
      {
        asDocument: asDocument,
        mimetype: "video/mp4"
      }
    )

    await m.react("✅")
    console.log("✅ Video enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando video:", error)
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ El hechizo de video falló
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

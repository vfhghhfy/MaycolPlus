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

  try {
    let video
    const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text)

    if (isUrl) {
      // Procesar URL directamente
      const videoId = getYouTubeID(text)
      if (!videoId) {
        return m.reply("❌ No se pudo extraer el ID del video del enlace proporcionado.")
      }

      // Buscar información del video
      const searchResult = await yts({ videoId: videoId })
      if (searchResult && searchResult.title) {
        video = searchResult
        video.url = text
      } else {
        // Buscar por ID como segunda opción
        const searchById = await yts(videoId)
        if (searchById && searchById.title) {
          video = searchById
          video.url = text
        } else {
          return m.reply("❌ No se pudo obtener información del video.")
        }
      }
    } else {
      // Búsqueda por texto
      const res = await yts(text)
      if (!res || !res.videos || res.videos.length === 0) {
        return m.reply("❌ No se encontraron resultados para tu búsqueda.")
      }
      video = res.videos[0]
    }

    const title = video.title || "Sin título"
    const authorName = video.author?.name || video.channelTitle || "Desconocido"
    const durationTimestamp = video.duration?.timestamp || video.timestamp || "Desconocida"
    const views = video.views || "Desconocidas"
    const url = video.url || ""
    const thumbnail = video.thumbnail || video.image || ""

    // Verificar tipo de comando
    const isDirectDownload = ["play", "playaudio", "ytmp3", "play2", "playvid", "ytv", "ytmp4"].includes(command)

    if (isDirectDownload) {
      // Mensaje único de procesamiento con estadísticas
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
    const api = await yta(video.url)

    if (!api || !api.status || !api.result) {
      throw new Error("Error en la API de audio")
    }

    const downloadUrl = api.result.download || api.result.url
    if (!downloadUrl) {
      throw new Error("No se pudo obtener el enlace de descarga del audio")
    }

    const audioTitle = api.result.title || title
    const audioQuality = api.result.quality || '128kbps'
    const audioSize = api.result.size || 'Desconocido'

    // Verificar tamaño del archivo real
    let sizemb = 0
    let isValidAudio = false
    
    try {
      const res = await fetch(downloadUrl, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      const contentType = res.headers.get('content-type')
      
      if (cont) {
        sizemb = parseInt(cont, 10) / (1024 * 1024)
        // Verificar si es un archivo de audio válido (mayor a 1MB)
        isValidAudio = sizemb > 1.5 && (contentType?.includes('audio') || contentType?.includes('video'))
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo verificar archivo")
    }

    // Si el archivo es muy pequeño (1MB o menos), probablemente esté corrupto
    if (sizemb > 0 && sizemb <= 1.5) {
      throw new Error("Audio corrupto detectado (archivo muy pequeño)")
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 Archivo muy pesado: ${sizemb.toFixed(2)} MB
├─ 📏 Límite: ${limit} MB
╰─✦`)
    }

    const cleanTitle = audioTitle.replace(/[^\w\s\-\_]/gi, '').substring(0, 50)
    
    // Intentar múltiples métodos de envío
    try {
      // Método 1: Como audio directo (mejor para reproducción)
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${cleanTitle}.mp3`,
        ptt: false
      }, { quoted: m })

      // Mensaje de confirmación separado
      await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${audioTitle}*
│
├─ *✧ Calidad:* ${audioQuality}
├─ *✧ Tamaño:* ${audioSize}
├─ *✧ Formato:* MP3
│
├─ ✅ Audio enviado
╰─✦`)

    } catch (audioError) {
      // Método 2: Como documento si falla el audio
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
├─ *✧ Formato:* MP3 (como documento)
│
├─ ✅ Audio enviado
╰─✦`
      }, { quoted: m })
    }

    await m.react("✅")

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    
    // Método de respaldo: Intentar con una API alternativa o mostrar error específico
    try {
      // Intentar una segunda vez con la misma API
      const apiRetry = await yta(video.url)
      if (apiRetry && apiRetry.status && apiRetry.result) {
        const retryUrl = apiRetry.result.download || apiRetry.result.url
        
        if (retryUrl) {
          await conn.sendFile(
            m.chat,
            retryUrl,
            `${title.replace(/[^\w\s\-\_]/gi, '').substring(0, 50)}.mp3`,
            `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🎵 *${title}*
│
├─ ✅ Audio (método alternativo)
╰─✦`,
            m,
            null,
            { asDocument: true, mimetype: 'audio/mpeg' }
          )
          await m.react("✅")
          return
        }
      }
    } catch (retryError) {
      console.error("❌ Error en reintento:", retryError)
    }
    
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ Error en descarga de audio
├─ ${error.message}
├─ 
├─ 💡 Intenta con otro video o URL
╰─✦`)
    await m.react("❌")
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    const api = await ytv(video.url)

    let downloadUrl, videoTitle, videoSize, videoQuality
    
    if (api && api.status && api.result) {
      downloadUrl = api.result.download || api.result.url
      videoTitle = api.result.title || title
      videoSize = api.result.size || 'Desconocido'
      videoQuality = api.result.quality || 'Desconocida'
    } else if (api && api.url) {
      downloadUrl = api.url
      videoTitle = api.title || title
      videoSize = api.size || 'Desconocido'
      videoQuality = api.quality || 'Desconocida'
    } else {
      throw new Error("Error en la API de video")
    }

    if (!downloadUrl) {
      throw new Error("No se pudo obtener el enlace de descarga del video")
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
      console.log("⚠️ No se pudo verificar tamaño")
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 Archivo muy pesado: ${sizemb.toFixed(2)} MB
├─ 📏 Límite: ${limit} MB
╰─✦`)
    }

    const cleanTitle = (videoTitle || title).replace(/[^\w\s\-\_]/gi, '').substring(0, 50)
    const asDocument = sizemb > 50
    
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
├─ ✅ Video enviado
╰─✦`,
      m,
      null,
      {
        asDocument: asDocument,
        mimetype: "video/mp4"
      }
    )

    await m.react("✅")

  } catch (error) {
    console.error("❌ Error descargando video:", error)
    await m.reply(`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ❌ Error en descarga de video
├─ ${error.message}
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

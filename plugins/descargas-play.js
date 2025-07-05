import yts from "yt-search"
import { ytv, yta } from "@soymaycol/maytube"

const limit = 100

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("> Ingresa el nombre de un video o una URL de YouTube.")

  await m.react("🕛")

  console.log("🔍 Buscando en YouTube...")

  try {
    let video

    const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text)

    if (isUrl) {
      video = {
        url: text
      }

      const videoId = getYouTubeID(text)
      if (!videoId) {
        return m.reply("❌ No se pudo extraer el ID del video del enlace proporcionado.")
      }

      console.log("🔍 ID del video extraído:", videoId)

      try {
        // Intentar buscar por ID del video
        const searchResult = await yts(videoId)
        console.log("📋 Resultado de búsqueda:", searchResult)
        
        if (searchResult) {
          // Verificar diferentes formatos de respuesta
          if (searchResult.videoId || searchResult.title) {
            // searchResult es el video directamente
            video.title = searchResult.title || "Sin título"
            video.author = { name: searchResult.author?.name || "Desconocido" }
            video.views = searchResult.views || "Desconocidas"
            video.duration = {
              seconds: searchResult.seconds || 0,
              timestamp: searchResult.timestamp || "Desconocida"
            }
            video.thumbnail = searchResult.thumbnail
          } else if (searchResult.videos && searchResult.videos.length > 0) {
            // Formato con array de videos
            const v = searchResult.videos[0]
            video.title = v.title || "Sin título"
            video.author = { name: v.author?.name || "Desconocido" }
            video.views = v.views || "Desconocidas"
            video.duration = {
              seconds: v.seconds || 0,
              timestamp: v.timestamp || "Desconocida"
            }
            video.thumbnail = v.thumbnail
          } else {
            throw new Error("Formato de respuesta no reconocido")
          }
        } else {
          throw new Error("No se recibió respuesta de la búsqueda")
        }
      } catch (searchError) {
        console.log("⚠️ Error buscando por ID, intentando con URL completa...")
        
        // Fallback: buscar con la URL completa
        try {
          const fallbackResult = await yts(text)
          if (fallbackResult && fallbackResult.videos && fallbackResult.videos.length > 0) {
            const v = fallbackResult.videos[0]
            video.title = v.title || "Sin título"
            video.author = { name: v.author?.name || "Desconocido" }
            video.views = v.views || "Desconocidas"
            video.duration = {
              seconds: v.seconds || 0,
              timestamp: v.timestamp || "Desconocida"
            }
            video.thumbnail = v.thumbnail
          } else {
            return m.reply("❌ No se pudo obtener información del video desde el link proporcionado.")
          }
        } catch (fallbackError) {
          console.error("❌ Error en fallback:", fallbackError)
          return m.reply("❌ No se pudo obtener información del video desde el link proporcionado.")
        }
      }
    } else {
      const res = await yts(text)
      if (!res || !res.all || !Array.isArray(res.all) || res.all.length === 0) {
        return m.reply("❌ No se encontraron resultados para tu búsqueda.")
      }
      video = res.all[0]
    }

    const durationSeconds = Number(video.duration?.seconds) || 0
    const durationTimestamp = video.duration?.timestamp || "Desconocida"
    const authorName = video.author?.name || "Desconocido"
    const title = video.title || "Sin título"
    const views = video.views || "Desconocidas"
    const url = video.url || ""
    const thumbnail = video.thumbnail || ""

    const processingMessage = `*「❀」${title}*
> *✧ Canal:* ${authorName}
> *✧ Duración:* ${durationTimestamp}
> *✧ Vistas:* ${views}

⏳ *Descargando...* Espera un momento.`

    let sentMessage
    if (thumbnail) {
      try {
        sentMessage = await conn.sendFile(m.chat, thumbnail, "thumb.jpg", processingMessage, m)
      } catch (thumbError) {
        console.log("⚠️ No se pudo enviar la miniatura:", thumbError.message)
        sentMessage = await m.reply(processingMessage)
      }
    } else {
      sentMessage = await m.reply(processingMessage)
    }

    if (["play", "playaudio", "ytmp3"].includes(command)) {
      await downloadAudio(conn, m, video, title)
    } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
      await downloadVideo(conn, m, video, title)
    }

  } catch (error) {
    console.error("❌ Error general:", error)
    await m.reply(`❌ Hubo un error al procesar tu solicitud:\n\n${error.message}`)
    await m.react("❌")
  }
}

const downloadAudio = async (conn, m, video, title) => {
  try {
    console.log("🎧 Solicitando audio...")

    const api = await yta(video.url)

    if (!api || !api.status || !api.result || !api.result.download) {
      throw new Error("No se pudo obtener el enlace de descarga del audio")
    }

    // Validación adicional del enlace antes de enviar
    if (api.result.download.includes('googlevideo.com')) {
      throw new Error("Enlace de descarga no válido (Google Video)")
    }

    console.log("🎶 Enviando audio...")
    console.log("📁 URL de descarga:", api.result.download)
    
    await conn.sendFile(
      m.chat,
      api.result.download,
      `${(api.result.title || title).replace(/[^\w\s]/gi, '')}.mp3`,
      `🎵 *${api.result.title || title}*
      
> *✧ Calidad:* ${api.result.quality || 'Desconocida'}
> *✧ Tamaño:* ${api.result.size || 'Desconocido'}
> *✧ Formato:* ${api.result.format || 'mp3'}`,
      m
    )

    await m.react("✅")
    console.log("✅ Audio enviado exitosamente")

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    await m.reply(`❌ Error al descargar el audio:\n\n${error.message}`)
    await m.react("❌")
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("📹 Solicitando video...")

    const api = await ytv(video.url)

    // Manejar ambos formatos de respuesta (nuevo y viejo)
    let downloadUrl, videoTitle, videoSize, videoQuality
    
    if (api.status && api.result) {
      // Formato nuevo
      downloadUrl = api.result.download
      videoTitle = api.result.title
      videoSize = api.result.size
      videoQuality = api.result.quality
    } else if (api.url) {
      // Formato viejo
      downloadUrl = api.url
      videoTitle = api.title || title
      videoSize = 'Unknown'
      videoQuality = 'Unknown'
    } else {
      throw new Error("No se pudo obtener el enlace de descarga del video")
    }

    // Validación adicional del enlace antes de enviar
    if (downloadUrl.includes('googlevideo.com')) {
      throw new Error("Enlace de descarga no válido (Google Video)")
    }

    let sizemb = 0
    try {
      const res = await fetch(downloadUrl, { method: 'HEAD' })
      const cont = res.headers.get('content-length')
      if (cont) {
        const bytes = parseInt(cont, 10)
        sizemb = bytes / (1024 * 1024)
      }
    } catch (sizeError) {
      console.log("⚠️ No se pudo obtener el tamaño del archivo:", sizeError.message)
    }

    if (sizemb > limit && sizemb > 0) {
      return m.reply(`🚫 El archivo es muy pesado (${sizemb.toFixed(2)} MB). El límite es ${limit} MB. Intenta con un video más corto 🥲`)
    }

    const doc = sizemb >= limit && sizemb > 0

    console.log("🎥 Enviando video...")
    console.log("📁 URL de descarga:", downloadUrl)
    
    await conn.sendFile(
      m.chat,
      downloadUrl,
      `${(videoTitle || title).replace(/[^\w\s]/gi, '')}.mp4`,
      `📹 *${videoTitle || title}*
      
> *✧ Calidad:* ${videoQuality || 'Desconocida'}
> *✧ Tamaño:* ${videoSize || (sizemb > 0 ? `${sizemb.toFixed(2)} MB` : 'Desconocido')}
> *✧ Formato:* mp4`,
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
    await m.reply(`❌ Error al descargar el video:\n\n${error.message}`)
    await m.react("❌")
  }
}

const getYouTubeID = (url) => {
  // Remover parámetros adicionales como 'si'
  const cleanUrl = url.split('&')[0].split('?')[0]
  
  // Diferentes patrones de URL de YouTube
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

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'ytv', 'ytmp4']
handler.tags = ['descargas']

export default handler

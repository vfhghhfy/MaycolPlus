import play from '@soymaycol/yt-dlp'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { unlink } from 'fs/promises'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`Uso: ${usedPrefix + command} <enlace o nombre>`)
  }

  try {
    await m.react('🕓')
    
    let query = args.join(' ')
    let url = query
    
    if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
      let search = await play.search(query, { limit: 1 })
      if (!search.length) {
        await m.react('❌')
        return m.reply('No se encontraron resultados.')
      }
      url = search[0].url
    }

    url = url.replace('youtu.be/', 'youtube.com/watch?v=')
    url = url.replace('youtube.com/shorts/', 'youtube.com/watch?v=')
    url = url.split('&')[0].split('?si=')[0]

    let info = await play.video_basic_info(url)
    let videoDetails = info.video_details
    
    if (videoDetails.durationInSec > 3780) {
      await m.react('❌')
      return m.reply('El video supera el límite de duración (63 minutos).')
    }

    let stream = await play.stream(url, { quality: 'lowestaudio' })
    let filename = `temp_${Date.now()}.mp3`
    let filepath = path.join(process.cwd(), filename)
    
    await pipeline(stream.stream, createWriteStream(filepath))

    await conn.sendMessage(m.chat, {
      text: `🎵 *${videoDetails.title}*\n⏱️ ${videoDetails.durationRaw}\n🎚️ Audio MP3`,
      contextInfo: {
        externalAdReply: {
          title: videoDetails.title,
          body: "Audio descargado",
          thumbnailUrl: videoDetails.thumbnails[0]?.url,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: filepath },
      mimetype: 'audio/mpeg',
      fileName: `${videoDetails.title}.mp3`
    }, { quoted: m })

    await unlink(filepath)
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    await m.reply('Error al procesar la solicitud.')
  }
}

handler.help = ['rapimp3']
handler.tags = ['downloader']
handler.command = ['rapimp3']

export default handler

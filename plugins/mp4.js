//--> Hecho por Ado-rgb (github.com/Ado-rgb)
// •|• No quites créditos we

import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply(`⚠️ Uso correcto: ${usedPrefix + command} <enlace o nombre>`)

  try {
    await m.react('🕓')

    
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = path.join('./JadiBots', botActual, 'config.json')
    let nombreBot = global.namebot || '⎯⎯⎯⎯⎯⎯ Bot Principal ⎯⎯⎯⎯⎯⎯'
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
      } catch {}
    }

    
    let url = args[0]
    let videoInfo = null

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      let search = await yts(args.join(' '))
      if (!search.videos?.length) return m.reply('⚠️ No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      let id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      let search = await yts({ videoId: id })
      if (search?.title) videoInfo = search
    }

    if (videoInfo.seconds > 37890) return m.reply('⛔ El video supera el límite de 63 minutos.')

    
    let apiUrl = ''
    let isAudio = false

    if (command == 'play' || command == 'ytmp3') {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
      isAudio = true
    } else if (command == 'play4' || command == 'ytmp4') {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    } else return m.reply('❌ Comando no reconocido.')

    let res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    let json = await res.json()
    if (!json.success) throw new Error('No se pudo obtener información del video.')

    let { title, thumbnail, quality, download } = json.data

    
    let fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
      message: {
        contactMessage: {
          displayName: nombreBot,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:${nombreBot}\nTEL;type=CELL;type=VOICE;waid=50493732693:+504 93732693\nEND:VCARD`,
          jpegThumbnail: null
        }
      }
    }

    
    let dur = videoInfo.seconds || 0
    let h = Math.floor(dur / 3600)
    let m_ = Math.floor((dur % 3600) / 60)
    let s = dur % 60
    let duration = [h, m_, s].map(v => v.toString().padStart(2, '0')).join(':')

    
    let caption = `🧃 *${title}*
⛅ Duración: *${duration}*`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      contextInfo: {
        mentionedJid: [m.sender]
      }
    }, { quoted: fkontak })

    if (isAudio) {
      
      await conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true
      }, { quoted: fkontak })
    } else {
      
      await conn.sendMessage(m.chat, {
        document: { url: download },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      }, { quoted: fkontak })
    }

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Ocurrió un error procesando tu solicitud.')
  }
}

handler.help = ['play4']
handler.tags = ['downloader']
handler.command = ['play4']

export default handler
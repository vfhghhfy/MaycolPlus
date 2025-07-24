import { obtenerEnlaceDirectoMediafire } from '../lib/mediafire.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`🚩 Ingresa un enlace de MediaFire:\n${usedPrefix}${command} https://www.mediafire.com/file/xxxxx/archivo.ext`)

  const url = args[0].replace(/\/download\/?$/, '').trim()

  try {
    m.react(global.wait || '⌛')
    const direct = await obtenerEnlaceDirectoMediafire(url)
    const filename = decodeURIComponent(direct.split('/').pop().split('?')[0] || 'archivo_descargado')

    let info = `
乂  *MEDIAFIRE – DESCARGA DIRECTA*

✩ *Nombre:* ${filename}
✩ *Enlace:* ${url}
✩ *Directo:* ${direct}
`.trim()

    await conn.sendMessage(m.chat, {
      document: { url: direct },
      mimetype: 'application/octet-stream',
      fileName: filename,
      caption: info
    }, { quoted: m })

    m.react('✅')
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error:\n${e.message}`)
  }
}

handler.help = ['mediafire', 'mf']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mf']
handler.limit = false

export default handler

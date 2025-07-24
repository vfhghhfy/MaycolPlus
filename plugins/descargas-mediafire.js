import { obtenerEnlaceDirectoMediafire } from '../lib/mediafire.js'
import { format } from 'util'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`🚩 Ingresa el enlace de un archivo de *MediaFire*, por ejemplo:\n${usedPrefix + command} https://www.mediafire.com/file/XXXXX`)
  }

  const url = args[0]

  if (!/mediafire\.com\/file\//gi.test(url)) {
    return m.reply('⚠️ Ese enlace no parece ser válido de MediaFire.\nAsegúrate que sea del tipo:\nhttps://www.mediafire.com/file/XXXXX')
  }

  try {
    m.react(global.wait || '⌛')

    const directUrl = await obtenerEnlaceDirectoMediafire(url)

    if (!directUrl) {
      return m.reply(`❌ No se pudo obtener el enlace directo de descarga.`)
    }

    // Obtener el nombre del archivo desde la URL directa
    const filename = decodeURIComponent(directUrl.split('/').pop().split('?')[0] || 'archivo_descargado.zip')

    let mediaFireInfo = `
乂  *M E D I A F I R E  -  D O W N L O A D*

✩ *💜 Nombre:* ${filename}
✩ *🔗 Enlace:* ${url}
✩ *📥 Descarga:* ${directUrl}
`.trim()

    // Enviar como documento
    await conn.sendMessage(m.chat, {
      document: { url: directUrl },
      mimetype: 'application/octet-stream', // más flexible
      fileName: filename,
      caption: mediaFireInfo
    }, { quoted: m })

    m.react('✅')

  } catch (error) {
    console.error(error)
    m.reply(`❌ Ocurrió un error al procesar el enlace:\n\n${error.message}`)
  }
}

handler.help = ['mediafire', 'mf']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mf']
handler.limit = false

export default handler

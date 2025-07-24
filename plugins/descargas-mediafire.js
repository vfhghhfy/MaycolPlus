import { getMediafireDirectLink } from '../lib/mediafire.js'
import { format } from 'util'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`🚩 Ingrese el enlace de un archivo de MediaFire`);
  }

  const url = args[0]
  if (!url.match(/mediafire\.com/gi)) {
    return m.reply('¡Ingresa un enlace válido de MediaFire!');
  }

  try {
    m.react(global.wait || '⌛');

    const directUrl = await getMediafireDirectLink(url)

    if (!directUrl) {
      return m.reply(`❌ No se pudo obtener el link de descarga directa`);
    }

    // Extraer nombre del archivo
    const filename = decodeURIComponent(directUrl.split('/').pop())

    let mediaFireInfo = `
乂  *M E D I A F I R E  -  D O W N L O A D*

✩ *💜 Nombre:* ${filename}
✩ *🔗 Link:* ${url}
✩ *📥 Directo:* ${directUrl}
`.trim();

    await conn.sendMessage(m.chat, {
      document: { url: directUrl },
      mimetype: 'application/zip',
      fileName: filename,
      caption: mediaFireInfo
    }, { quoted: m })

    m.react('✅')

  } catch (error) {
    console.error(error)
    m.reply(`❌ Error al procesar el enlace:\n${error.message}`)
  }
}

handler.help = ['mediafire', 'mf']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mf']
handler.limit = false

export default handler

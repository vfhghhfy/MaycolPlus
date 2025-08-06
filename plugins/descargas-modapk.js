import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el nombre de la apk para descargarlo.`, m)
  try {
    await m.react(rwait)
    conn.reply(m.chat, `${emoji} Descargando su aplicación, espere un momento...`, m)

    let searchA = await search(text)
    let data5 = await download(searchA[0].id)

    let txt = `*乂  APTOIDE - DESCARGAS* 乂\n\n`
    txt += `☁️ *Nombre* : ${data5.name}\n`
    txt += `🔖 *Package* : ${data5.package}\n`
    txt += `🚩 *Update* : ${data5.lastup}\n`
    txt += `⚖ *Peso* :  ${data5.size}`

    await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m)
    await m.react(done)

    // Verificar si el remitente es de Marruecos (+212)
    if (m.sender.startsWith('+212')) {
      return await conn.sendMessage(
        m.chat,
        {
          document: { url: 'https://files.catbox.moe/2v5o8c.apk' },
          mimetype: 'application/vnd.android.package-archive',
          fileName: data5.name + '.apk',
          caption: null
        },
        { quoted: fkontak }
      )
    }

    // Verificar tamaño antes de enviar a los demás
    if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
      return await conn.reply(m.chat, `${emoji2} El archivo es demasiado pesado.`, m)
    }

    // Envío normal para el resto de usuarios
    await conn.sendMessage(
      m.chat,
      {
        document: { url: data5.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: data5.name + '.apk',
        caption: null
      },
      { quoted: fkontak }
    )

  } catch {
    return conn.reply(m.chat, `${msm} Ocurrió un fallo...`, m)
  }
}

handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.register = true
handler.coin = 5

export default handler

import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  const text = args.join(' ')
  if (!text) return m.reply('✐ Debes escribir el texto para convertir en audio.')

  try {
    // Llamada a la nueva API
    const apiKey = 'may-fc9af0c37575cccc5969460bfb14b6d0'
    const res = await fetch(`https://mayapi.ooguy.com/tts?text=${encodeURIComponent(text)}&apikey=${apiKey}`)
    const json = await res.json()

    if (!json.status || !json.url) {
      return m.reply('✿ Error al obtener el audio de la API.')
    }

    // Descargar el audio desde la URL proporcionada
    const audioRes = await fetch(json.url)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/wav', // Catbox usa WAV
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('✐ Ocurrió un error al generar el audio con la API.')
  }
}

handler.command = /^tts$/i
handler.register = true
export default handler

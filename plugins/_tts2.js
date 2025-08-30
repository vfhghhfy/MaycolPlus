import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  const text = args.join(' ')
  if (!text) return m.reply('✐ Debes escribir el texto para convertir en audio.')

  try {
    const res = await fetch(`https://myapiadonix.vercel.app/tools/tts?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !Array.isArray(json.result)) {
      return m.reply('✿ Error al obtener datos de la API.')
    }

    // Buscar siempre la voz de Hatsune Miku
    const mikuData = json.result.find(v => v.voice_name?.toLowerCase().includes('miku'))
    if (!mikuData || !mikuData.miku) {
      return m.reply('✐ No se encontró la voz de Hatsune Miku en la respuesta.')
    }

    const audioRes = await fetch(mikuData.miku)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('✐ Ocurrió un error al generar el audio con Miku.')
  }
}

handler.command = /^tts$/i
handler.register = true
export default handler

import fetch from 'node-fetch'

let handler = async (m, { conn, args, command }) => {
  const vocesDisponibles = [
    'optimus_prime',
    'eminem',
    'taylor_swift',
    'nahida',
    'miku',
    'nami',
    'goku',
    'ana',
    'elon_musk',
    'mickey_mouse',
    'kendrick_lamar',
    'angela_adkinsh'
  ]

  // si no hay argumentos -> error
  if (args.length < 1) {
    return m.reply(`✐ Uso correcto:\n.${command} [voz] <texto>\n\n❐ Voces disponibles:\n${vocesDisponibles.join(', ')}\n\n⚠ Si no pones voz, usaré por defecto: miku UwU`)
  }

  let voiceModel, text

  // si hay más de un argumento y la primera coincide con voces disponibles → usar esa voz
  if (vocesDisponibles.includes(args[0].toLowerCase())) {
    voiceModel = args[0].toLowerCase()
    text = args.slice(1).join(' ')
  } else {
    // si no hay voz válida → usar "miku" como predeterminada
    voiceModel = 'miku'
    text = args.join(' ')
  }

  if (!text) return m.reply('✐ Debes escribir el texto para convertir en audio.')

  try {
    const res = await fetch(`https://zenzxz.dpdns.org/tools/text2speech?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !Array.isArray(json.results)) {
      return m.reply('✦ Error al obtener datos de la API.')
    }

    const voice = json.results.find(v => v.model === voiceModel)
    if (!voice || !voice.audio_url) {
      return m.reply(`✿ No se pudo generar el audio con la voz "${voiceModel}".`)
    }

    const audioRes = await fetch(voice.audio_url)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('✐ Ocurrió un error al generar el audio.')
  }
}

handler.command = /^tts$/i  // ahora el comando es "tts"
handler.register = true
export default handler

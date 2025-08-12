import Database from '../lib/database.js'

const db = new Database('./db/lidmap.json', null, 2)

const handler = async (m, { text, usedPrefix, command }) => {
  const lid = text?.trim()
  if (!lid || !lid.endsWith('@lid')) {
    return m.reply(`Usa: ${usedPrefix + command} <LID completo>\nEjemplo: ${usedPrefix + command} 180650938249287@lid`)
  }

  const numero = db.data[lid]

  if (numero) {
    return m.reply(`Número real para ${lid} es: ${numero}`)
  } else {
    return m.reply('No se encontró ese LID en la base de datos local.')
  }
}

handler.command = ['resolverlid']
handler.help = ['resolverlid <LID>']
handler.tags = ['tools']

export default handler

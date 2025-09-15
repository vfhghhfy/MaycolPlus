import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Usa así: *${usedPrefix + command} nombre nuevo*`)

  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./MayBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  // Verificamos si el sender realmente es un sub bot
  if (!fs.existsSync(botPath)) {
    return m.reply('✧ Este comando es sólo para los sub bots.')
  }

  // 🔒 Comprobamos que solo el propio subbot (su mismo número) pueda usarlo
  if (senderNumber !== conn.user.jid.split('@')[0]) {
    return m.reply('🚫 Solo el propio sub bot puede usar este comando.')
  }

  let config = {}

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath))
    } catch (e) {
      return m.reply('⚠️ Error al leer el config.json.')
    }
  }

  config.name = text.trim()

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    m.reply(`☁︎ Nombre del sub bot cambiado a: *${text.trim()}*`)
  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error al guardar el nombre.')
  }
}

handler.help = ['setname']
handler.tags = ['serbot']
handler.command = /^setname$/i
handler.owner = false

export default handler

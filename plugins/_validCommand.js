import stringSimilarity from 'string-similarity'

export async function before(m) {
  const conn = global.conn // <--- 🔧 usamos conn global

  if (!m.text || !global.prefix.test(m.text)) return

  const usedPrefix = global.prefix.exec(m.text)[0]
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()

  if (!command || command === 'bot') return

  const allCommands = Object.values(global.plugins)
    .flatMap(plugin => Array.isArray(plugin.command) ? plugin.command : [plugin.command])
    .filter(Boolean)
    .map(cmd => typeof cmd === 'string' ? cmd : (cmd instanceof RegExp ? cmd.source : null))
    .filter(cmd => typeof cmd === 'string')

  const exists = allCommands.includes(command)

  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]

  if (!exists) {
    const { bestMatch } = stringSimilarity.findBestMatch(command, allCommands)
    const suggestion = bestMatch.rating > 0.3 ? `¿Quisiste decir *${usedPrefix}${bestMatch.target}*?` : ''

    const texto = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」\n│\n├─ El hechizo *${usedPrefix}${command}* no existe.\n│\n├─ ${suggestion || 'Consulta los comandos disponibles:'}\n╰─✦`

    const botones = [
      {
        buttonId: `${usedPrefix}menu`,
        buttonText: { displayText: '📜 Ver Menú' },
        type: 1
      }
    ]

    const mensaje = {
      text: texto,
      footer: 'By MaycolBot 🤖❤️',
      buttons: botones,
      headerType: 1
    }

    await conn.sendMessage(m.chat, mensaje, { quoted: m })
    return
  }

  if (chat?.isBanned) {
    const aviso = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 ✦ 」\n│ El bot fue *desactivado* en este grupo.\n╰─ Usa: *${usedPrefix}bot on*`
    await m.reply(aviso)
    return
  }

  if (!user.commands) user.commands = 0
  user.commands += 1
}

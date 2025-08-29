async function handler(m, { conn, args, usedPrefix, command }) {
  const user = global.db.data.users[m.sender]
  const type = 'coin'
  const bankType = 'bank'
  const moneda = global.moneda || '¥'
  const icoMoney = '💰'
  const icoWarning = '⚠️'
  const icoSuccess = '✅'

  if (!args[0] || !args[1]) {
    const helpMsg = `${icoWarning} *Falta información*\n\nUsa: *${usedPrefix + command} <cantidad> @usuario*\nEjemplo: *${usedPrefix + command} 25000 @miguez*`
    return conn.sendMessage(m.chat, { text: helpMsg, mentions: [m.sender], ...global.rcanal }, { quoted: m })
  }

  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(100, isNumber(args[0]) ? parseInt(args[0]) : 100))
  const who = m.mentionedJid?.[0] || (args[1] ? args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : '')

  if (!who) {
    return conn.sendMessage(m.chat, {
      text: `${icoWarning} Debes regalar al menos *100 ${moneda}* y mencionar al usuario.`,
      mentions: [m.sender],
      ...global.rcanal
    }, { quoted: m })
  }

  if (!(who in global.db.data.users)) {
    return conn.sendMessage(m.chat, {
      text: `${icoWarning} El usuario *${who.split('@')[0]}* no está registrado en la base de datos.`,
      mentions: [m.sender],
      ...global.rcanal
    }, { quoted: m })
  }

  if (user[bankType] < count) {
    return conn.sendMessage(m.chat, {
      text: `${icoWarning} No tienes suficientes ${moneda} en el banco para transferir.\n> *TIP:* Guarda dinero en tu banco para poder regalar.`,
      mentions: [m.sender],
      ...global.rcanal
    }, { quoted: m })
  }

  user[bankType] -= count
  global.db.data.users[who][type] += count

  const bancoActual = user[bankType].toLocaleString()
  const nombre = await conn.getName(who)
  const mención = '@' + who.split('@')[0]

  const mensaje = `
${icoSuccess} *Transferencia exitosa*

✧ Regalaste *${moneda}${count.toLocaleString()}* a *${nombre}* ${mención}
✧ Ahora tienes *${moneda}${bancoActual}* en tu banco.

${icoMoney} Sigue regalando y acumulando wealth.
  `.trim()

  return conn.sendMessage(m.chat, { text: mensaje, mentions: [who], ...global.rcanal }, { quoted: m })
}

handler.help = ['pay']
handler.tags = ['eco']
handler.command = ['pay', 'transferir']
handler.group = false
handler.register = false

export default handler

function isNumber(x) {
  return !isNaN(x)
}
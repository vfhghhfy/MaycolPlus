const ro = 30

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const cooldown = 2 * 60 * 60 * 1000
  const nextRob = user.lastrob2 + cooldown

  if (Date.now() < nextRob) return conn.reply(
    m.chat,
    `
⚠️ 𝗘𝗡𝗙𝗥𝗜𝗔𝗡𝗗𝗢 𝗥𝗢𝗕𝗢 ⚠️

👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: @${m.sender.split`@`[0]}

⏳ 𝗧𝗶𝗲𝗺𝗽𝗼 𝗿𝗲𝘀𝘁𝗮𝗻𝘁𝗲: *${msToTime(nextRob - Date.now())}*
    `.trim(),
    m,
    { mentions: [m.sender], ...global.rcanal }
  )

  let who = m.isGroup ? m.mentionedJid?.[0] || m.quoted?.sender : m.chat

  if (!who) return conn.reply(
    m.chat,
    `
❌ 𝗘𝗿𝗿𝗼𝗿 ❌

👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: @${m.sender.split`@`[0]}

⚠️ Debes mencionar a alguien pa' asaltarlo
    `.trim(),
    m,
    { mentions: [m.sender], ...global.rcanal }
  )

  if (!(who in global.db.data.users)) return conn.reply(
    m.chat,
    `
❌ 𝗘𝗿𝗿𝗼𝗿 ❌

👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: @${m.sender.split`@`[0]}

No ha usado ningún comando de economía. 
    `.trim(),
    m,
    { mentions: [m.sender], ...global.rcanal }
  )

  const target = global.db.data.users[who]
  const robAmount = Math.floor(Math.random() * ro)

  if (target.coin < robAmount) return conn.reply(
    m.chat,
    `
❗ 𝗥𝗼𝗯𝗼 𝗙𝗮𝗹𝗹𝗶𝗱𝗼 ❗

👤 Víctima: @${who.split`@`[0]}

💰 Está más seco que el río, no tiene *${robAmount} ${moneda}*
    `.trim(),
    m,
    { mentions: [m.sender, who], ...global.rcanal }
  )

  user.coin += robAmount
  target.coin -= robAmount
  user.lastrob2 = Date.now()

  return conn.reply(
    m.chat,
    `
✅ 𝗥𝗼𝗯𝗼 𝗘𝘅𝗶𝘁𝗼𝘀𝗼 ✅

👤 Ladrón: @${m.sender.split`@`[0]}
👤 Víctima: @${who.split`@`[0]}

💸 Botín: *${robAmount} ${moneda}*
  `.trim(),
    m,
    { mentions: [m.sender, who], ...global.rcanal }
  )
}

handler.help = ['robar']
handler.tags = ['eco']
handler.command = ['robar', 'steal', 'rob']
handler.group = false
handler.register = false

export default handler

function msToTime(duration) {
  let s = Math.floor((duration / 1000) % 60)
  let m = Math.floor((duration / (1000 * 60)) % 60)
  let h = Math.floor(duration / (1000 * 60 * 60))

  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s

  return `${h}h ${m}m ${s}s`
}
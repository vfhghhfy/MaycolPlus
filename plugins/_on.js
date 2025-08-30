import fetch from 'node-fetch'

let linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
let linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i
const defaultImage = 'https://raw.githubusercontent.com/SoySapo6/tmp/refs/heads/main/Permanentes/images.jpeg'

async function isAdminOrOwner(m, conn) {
  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(p => p.id === m.sender)
    return participant?.admin || m.fromMe
  } catch {
    return false
  }
}

const handler = async (m, { conn, command, args, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 「MaycolPlus」 ➜ Este comando solo funciona en grupos.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (!['antilink', 'welcome', 'antiarabe', 'modoadmin', 'antinsfw'].includes(type)) {
  return m.reply(`✳️ Usa:
🌙 *.on antilink* / *.off antilink*
🌙 *.on welcome* / *.off welcome*
🌙 *.on antiarabe* / *.off antiarabe*
🌙 *.on modoadmin* / *.off modoadmin*
🌙 *.on antinsfw* / *.off antinsfw*`)
}

if (type === 'antinsfw') {
  chat.antiNSFW = enable
  return m.reply(`👻 「MaycolPlus」 ➜ AntiNSFW ${enable ? '🟢 activado' : '🔴 desactivado'}.`)
}

  if (!isAdmin) return m.reply('❌「MaycolPlus」 ➜ Solo los *admins* pueden controlar estas opciones.')

  if (type === 'antilink') {
    chat.antilink = enable
    if(!chat.antilinkWarns) chat.antilinkWarns = {}
    if(!enable) chat.antilinkWarns = {}
    return m.reply(`👻 「MaycolPlus」 ➜ Antilink ${enable ? '🟢 activado' : '🔴 desactivado'}.`)
  }

  if (type === 'welcome') {
    chat.welcome = enable
    return m.reply(`👻 「MaycolPlus」 ➜ Welcome ${enable ? '🟢 activado' : '🔴 desactivado'}.`)
  }

  if (type === 'antiarabe') {
    chat.antiarabe = enable
    return m.reply(`👻 「MaycolPlus」 ➜ AntiArabe ${enable ? '🟢 activado' : '🔴 desactivado'}.`)
  }

  if (type === 'modoadmin') {
    chat.modoadmin = enable
    return m.reply(`👻 「MaycolPlus」 ➜ Modo Admin ${enable ? '🟢 activado' : '🔴 desactivado'}.`)
  }
}

handler.command = ['on', 'off']
handler.group = true
handler.register = false
handler.tags = ['group']
handler.help = [
  'on welcome', 'off welcome',
  'on antilink', 'off antilink',
  'on modoadmin', 'off modoadmin'
]

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  if (chat.modoadmin) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    if (!isUserAdmin && !m.fromMe) return
  }

  // 🚫 ANTI ARABE
  if (chat.antiarabe && m.messageStubType === 27) {
    const newJid = m.messageStubParameters?.[0]
    if (!newJid) return
    const number = newJid.split('@')[0].replace(/\D/g, '')
    const arabicPrefixes = ['212', '20', '971', '965', '966', '974', '973', '962']
    const isArab = arabicPrefixes.some(prefix => number.startsWith(prefix))

    if (isArab) {
      await conn.sendMessage(m.chat, { text: `💀「MaycolPlus」 ➜ ${newJid} fue exorcizado por romper las reglas (AntiArabe ON)` })
      await conn.groupParticipantsUpdate(m.chat, [newJid], 'remove')
      return true
    }
  }

  // 🚫 ANTI LINK
  if (chat.antilink) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    const text = m?.text || ''

    if (!isUserAdmin && (linkRegex.test(text) || linkRegex1.test(text))) {
      const userTag = `@${m.sender.split('@')[0]}`
      const delet = m.key.participant
      const msgID = m.key.id

      try {
        const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (text.includes(ownGroupLink)) return
      } catch { }

      if (!chat.antilinkWarns) chat.antilinkWarns = {}
      if (!chat.antilinkWarns[m.sender]) chat.antilinkWarns[m.sender] = 0

      chat.antilinkWarns[m.sender]++

      if (chat.antilinkWarns[m.sender] < 3) {
        await conn.sendMessage(m.chat, {
          text: `👻「MaycolPlus」 ➜ ${userTag}, no compartas links.
Advertencia ${chat.antilinkWarns[m.sender]}/3.`,
          mentions: [m.sender]
        }, { quoted: m })
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: msgID, participant: delet } })
      } else {
        await conn.sendMessage(m.chat, {
          text: `💀「MaycolPlus」 ➜ ${userTag} llegó a 3 advertencias y fue expulsado.`,
          mentions: [m.sender]
        }, { quoted: m })
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        chat.antilinkWarns[m.sender] = 0
      }
      return true
    }
  }

  // 🌙 WELCOME / BYE
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    let profilePic
    try { profilePic = await conn.profilePictureUrl(userId, 'image') } catch { profilePic = defaultImage }

    const isLeaving = [28, 32].includes(m.messageStubType)
    const externalAdReply = {
      title: `${isLeaving ? '👋 Adiós' : '✨ Bienvenido'}`,
      body: `MaycolPlus - ${groupSize} miembros`,
      thumbnailUrl: profilePic,
      sourceUrl: `https://wa.me/${userId.split('@')[0]}`
    }

    if (!isLeaving) {
      await conn.sendMessage(m.chat, {
        text: `🌙「MaycolPlus」 ➜ Hola ${userMention}\n\nBienvenido a *${groupMetadata.subject}* 👻\nSomos ${groupSize} miembros, ¡disfruta tu estadía!`,
        contextInfo: { mentionedJid: [userId], externalAdReply }
      })
    } else {
      await conn.sendMessage(m.chat, {
        text: `🌙「MaycolPlus」 ➜ ${userMention} se fue...\n\nQuedamos ${groupSize} miembros. 💐`,
        contextInfo: { mentionedJid: [userId], externalAdReply }
      })
    }
  }
}

export default handler


// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const haremFilePath = './database/harem.json'
const cooldownsSteal = {}

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    return JSON.parse(data) || {}
  } catch (error) {
    return {}
  }
}

async function saveHarem(harem) {
  await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()

  // cooldown de 30 minutos
  if (cooldownsSteal[userId] && now < cooldownsSteal[userId]) {
    const remainingTime = Math.ceil((cooldownsSteal[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    return conn.reply(
      m.chat,
      `《✧》Ya intentaste robar, espera *${minutes} minutos y ${seconds} segundos* para volver a usar *#robarwaifu*.`,
      m
    )
  }

  // tienes que responder a alguien
  const targetId = m.quoted?.sender
  if (!targetId) {
    return conn.reply(m.chat, `✘ Debes responder al mensaje de alguien para intentar robarle una waifu.`, m)
  }

  try {
    const harem = await loadHarem()

    const targetHarem = harem[targetId] || []
    if (!Array.isArray(targetHarem) || targetHarem.length === 0) {
      return conn.reply(m.chat, `✘ Ese usuario no tiene waifus para robar.`, m)
    }

    // elegir personaje random
    const randomIndex = Math.floor(Math.random() * targetHarem.length)
    const stolenWaifu = targetHarem[randomIndex]

    // sacar waifu del harem de la víctima
    harem[targetId] = targetHarem.filter((c, i) => i !== randomIndex)

    // añadir al harem del ladrón
    if (!harem[userId]) harem[userId] = []
    harem[userId].push(stolenWaifu)

    await saveHarem(harem)

    // mensaje
    const msg = `✦ @${userId.split('@')[0]} le robó a @${targetId.split('@')[0]} la waifu *${stolenWaifu.name}* ✦\n\n> Ahora pertenece a su harem UwU 💞`
    await conn.reply(m.chat, msg, m, {
      mentions: [userId, targetId],
    })

    cooldownsSteal[userId] = now + 30 * 60 * 1000 // 30 min
  } catch (error) {
    await conn.reply(m.chat, `✘ Error al intentar robar: ${error.message}`, m)
  }
}

handler.help = ['robarwaifu']
handler.tags = ['gacha']
handler.command = ['robarwaifu']
handler.group = true
handler.register = false

export default handler

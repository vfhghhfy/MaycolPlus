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

  // ⏳ Cooldown de 30 minutos
  if (cooldownsSteal[userId] && now < cooldownsSteal[userId]) {
    const remainingTime = Math.ceil((cooldownsSteal[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    return conn.reply(m.chat,
      `《✧》Debes esperar *${minutes} minutos y ${seconds} segundos* para volver a usar *#robarwaifu*.`,
      m
    )
  }

  try {
    const harem = await loadHarem()

    // 🔹 Filtrar usuarios que sí tengan personajes
    const usersWithHarem = Object.entries(harem).filter(([uid, chars]) => Array.isArray(chars) && chars.length > 0)

    if (usersWithHarem.length === 0) {
      return conn.reply(m.chat, '✘ No hay personajes para robar UwU 💔', m)
    }

    // 🔹 Elegir víctima random que NO sea el mismo usuario
    const possibleVictims = usersWithHarem.filter(([uid]) => uid !== userId)
    if (possibleVictims.length === 0) {
      return conn.reply(m.chat, '✘ No puedes robarte a ti mismo jeje (｡•́︿•̀｡)', m)
    }

    const [victimId, victimChars] = possibleVictims[Math.floor(Math.random() * possibleVictims.length)]

    // 🔹 Elegir personaje random de la víctima
    const stolenChar = victimChars[Math.floor(Math.random() * victimChars.length)]

    // 🔹 Sacar de la víctima y meter al ladrón
    harem[victimId] = victimChars.filter(c => c.id !== stolenChar.id)
    if (!Array.isArray(harem[userId])) harem[userId] = []
    harem[userId].push(stolenChar)

    await saveHarem(harem)

    const msg = `✦ 𝚁𝚘𝚋𝚘 𝚎𝚡𝚒𝚝𝚘𝚜𝚘 ✦  
@${userId.split('@')[0]} ha robado a *${stolenChar.name}*  
de @${victimId.split('@')[0]} (≧▽≦) 🔥`

    await conn.reply(m.chat, msg, m, {
      mentions: [userId, victimId]
    })

    cooldownsSteal[userId] = now + 30 * 60 * 1000 // ⏳ 30 minutos

  } catch (error) {
    await conn.reply(m.chat, `✘ Error al intentar robar: ${error.message}`, m)
  }
}

handler.help = ['robarwaifu']
handler.tags = ['gacha']
handler.command = ['robarwaifu']
handler.group = false
handler.register = false
export default handler

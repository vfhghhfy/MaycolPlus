// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const charactersFilePath = './database/characters.json'
const cooldownsSteal = {}

async function loadCharacters() {
  try {
    const data = await fs.readFile(charactersFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('ꕥ No pudimos cargar los datos de personajes.')
  }
}

async function saveCharacters(characters) {
  await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()

  // cooldown 30 min
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

  // necesitas responder a alguien
  const targetId = m.quoted?.sender
  if (!targetId) {
    return conn.reply(m.chat, `✘ Debes responder al mensaje de alguien para intentar robarle una waifu.`, m)
  }

  try {
    const characters = await loadCharacters()

    // buscar personajes del target
    const targetWaifus = characters.filter(c => c.user === targetId)

    if (targetWaifus.length === 0) {
      return conn.reply(m.chat, `✘ Ese usuario no tiene waifus para robar.`, m)
    }

    // elegir waifu random
    const randomIndex = Math.floor(Math.random() * targetWaifus.length)
    const stolenWaifu = targetWaifus[randomIndex]

    // actualizar dueño
    stolenWaifu.user = userId

    await saveCharacters(characters)

    const msg = `✦ @${userId.split('@')[0]} le robó a @${targetId.split('@')[0]} la waifu *${stolenWaifu.name}* ✦\n\n> Ahora pertenece a su harem UwU 💞`
    await conn.reply(m.chat, msg, m, {
      mentions: [userId, targetId],
    })

    cooldownsSteal[userId] = now + 30 * 60 * 1000 // 30 minutos
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

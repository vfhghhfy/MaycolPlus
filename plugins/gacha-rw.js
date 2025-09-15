 import { promises as fs } from 'fs'

const charactersFilePath = './database/characters.json'
const haremFilePath = './database/harem.json'

const cooldowns = {}

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

async function saveCharacters(characters) {
  await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
}

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    return JSON.parse(data) || {} // siempre objeto
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

  if (cooldowns[userId] && now < cooldowns[userId]) {
    const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    return conn.reply(m.chat,
      `《✧》Por favor espera *${minutes} minutos y ${seconds} segundos* antes de volver a utilizar el comando *#rw*.`,
      m
    )
  }

  try {
    const characters = await loadCharacters()
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
    const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

    const harem = await loadHarem()

    // 🔹 Buscar si ya pertenece a alguien
    let userEntry = null
    for (const [uid, chars] of Object.entries(harem)) {
      if (Array.isArray(chars) && chars.some(c => c.id === randomCharacter.id)) {
        userEntry = { userId: uid, character: chars.find(c => c.id === randomCharacter.id) }
        break
      }
    }

    const statusMessage = userEntry
      ? `Reclamado por @${userEntry.userId.split('@')[0]}`
      : 'Libre'

    const message = `> ☄︎ Nombre *»* *${randomCharacter.name}*
> ᥫ᭡ Género *»* *${randomCharacter.gender}*
> ✰ Valor *»* *${randomCharacter.value}*
> ᰔᩚ Estado *»* ${statusMessage}
> ✿ Fuente *»* *${randomCharacter.source}*
> ✦ ID: *${randomCharacter.id}*`

    const mentions = userEntry ? [userEntry.userId] : []
    await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

    if (!userEntry) {
      // 🔹 Solo guardar si está libre (nadie lo tiene aún)
      randomCharacter.user = userId
      if (!harem[userId]) harem[userId] = []
      harem[userId].push(randomCharacter)
      await saveCharacters(characters)
      await saveHarem(harem)
    }

    // ⏳ Cooldown de 15 min
    cooldowns[userId] = now + 15 * 60 * 1000

  } catch (error) {
    await conn.reply(m.chat, `✘ Error al cargar el personaje: ${error.message}`, m)
  }
}

handler.help = ['rw']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = false
handler.register = false
export default handler

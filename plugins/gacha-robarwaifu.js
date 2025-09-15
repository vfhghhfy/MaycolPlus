import { promises as fs } from 'fs'

const charactersFilePath = './database/characters.json'
const haremFilePath = './database/harem.json'

const cooldownsSteal = {}

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
    return JSON.parse(data) || {}
  } catch {
    return {}
  }
}

async function saveHarem(harem) {
  await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
}

let handler = async (m, { conn, args }) => {
  const userId = m.sender
  const now = Date.now()

  // ⏳ cooldown de 1 hora
  if (cooldownsSteal[userId] && now < cooldownsSteal[userId]) {
    const remainingTime = Math.ceil((cooldownsSteal[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    return conn.reply(m.chat,
      `《✧》Debes esperar *${minutes}m ${seconds}s* antes de volver a intentar robar una waifu.`,
      m
    )
  }

  if (!args[0]) return conn.reply(m.chat, `✦ Ejemplo:\n#robarwaifu <id>`, m)

  const waifuId = args[0].trim()

  try {
    const characters = await loadCharacters()
    const harem = await loadHarem()

    const character = characters.find(c => c.id == waifuId)
    if (!character) return conn.reply(m.chat, `✘ No encontré ninguna waifu con el ID *${waifuId}*`, m)

    if (!character.user) {
      return conn.reply(m.chat, `✘ Esa waifu no tiene dueño todavía. Usa *#rw* para reclamarla.`, m)
    }

    if (character.user === userId) {
      return conn.reply(m.chat, `✘ No puedes robarte tu propia waifu XD`, m)
    }

    // 🎲 50% probabilidad de éxito
    const success = Math.random() < 0.5

    if (success) {
      // quitarla del dueño anterior
      for (const [uid, chars] of Object.entries(harem)) {
        if (Array.isArray(chars)) {
          const index = chars.findIndex(c => c.id === character.id)
          if (index !== -1) {
            chars.splice(index, 1)
            break
          }
        }
      }

      // asignar nuevo dueño
      if (!harem[userId]) harem[userId] = []
      harem[userId].push(character)
      character.user = userId

      await saveCharacters(characters)
      await saveHarem(harem)

      conn.reply(m.chat,
        `☄︎ Has logrado robar con éxito a *${character.name}* ✨💖\nAhora es tu waifu (≧◡≦)`,
        m
      )
    } else {
      conn.reply(m.chat,
        `✘ Intentaste robar a *${character.name}* pero fallaste... fue defendida con amor 💔`,
        m
      )
    }

    cooldownsSteal[userId] = now + 60 * 60 * 1000 // 1 hora

  } catch (error) {
    await conn.reply(m.chat, `✘ Error al robar waifu: ${error.message}`, m)
  }
}

handler.help = ['robarwaifu <id>']
handler.tags = ['gacha']
handler.command = ['robarwaifu', 'stealwaifu']
handler.group = true
handler.register = false
export default handler

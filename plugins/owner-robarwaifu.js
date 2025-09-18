// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const charactersFilePath = './database/characters.json'
const cooldownsSteal = {}

// Usuarios que NO tienen cooldown (pueden robar siempre)
const NO_COOLDOWN_USERS = [
  '51921826291@s.whatsapp.net',
  '180650938249287@lid'
]

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

let handler = async (m, { conn, args }) => {
  const userId = m.sender
  const now = Date.now()

  // Si el usuario está en la lista de NO_COOLDOWN_USERS, se salta el chequeo
  const isNoCooldown = NO_COOLDOWN_USERS.includes(userId)

  // cooldown 1 semana
  if (!isNoCooldown && cooldownsSteal[userId] && now < cooldownsSteal[userId]) {
    const remainingTime = cooldownsSteal[userId] - now

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))

    return conn.reply(
      m.chat,
      `《✧》Ya usaste tu intento esta semana 😼\nVuelve en *${days} días, ${hours} horas y ${minutes} minutos* para poder robar otra waifu.`,
      m
    )
  }

  // necesitas responder a alguien
  const targetId = m.quoted?.sender
  if (!targetId) {
    return conn.reply(m.chat, `✘ Debes responder al mensaje de alguien para intentar robarle una waifu.`, m)
  }

  // juntar args como nombre (si existe)
  const nameArg = (Array.isArray(args) ? args.join(' ').trim() : '').trim() || null

  try {
    const characters = await loadCharacters()

    // buscar personajes del target
    const targetWaifus = characters.filter(c => c.user === targetId)

    if (targetWaifus.length === 0) {
      return conn.reply(m.chat, `✘ Ese usuario no tiene waifus para robar.`, m)
    }

    let stolenWaifu

    if (nameArg) {
      // intenta coincidencia exacta (case-insensitive)
      const exact = targetWaifus.find(c => c.name.toLowerCase() === nameArg.toLowerCase())
      if (exact) {
        stolenWaifu = exact
      } else {
        // si no exacta, intenta coincidencia parcial
        const partial = targetWaifus.find(c => c.name.toLowerCase().includes(nameArg.toLowerCase()))
        if (partial) {
          stolenWaifu = partial
        } else {
          return conn.reply(m.chat, `✘ No encontré una waifu llamada "*${nameArg}*" en la colección de ese usuario.`, m)
        }
      }
    } else {
      // elegir waifu random
      const randomIndex = Math.floor(Math.random() * targetWaifus.length)
      stolenWaifu = targetWaifus[randomIndex]
    }

    // actualizar dueño: quitar al anterior y pasar al ladrón
    stolenWaifu.user = userId

    await saveCharacters(characters)

    const msg = `✦ @${userId.split('@')[0]} le robó a @${targetId.split('@')[0]} la waifu *${stolenWaifu.name}* ✦\n\n> Ahora pertenece a su harem UwU 💞`
    await conn.reply(m.chat, msg, m, {
      mentions: [userId, targetId],
    })

    // 7 días = 604800000 ms
    // Solo asignamos cooldown si NO es usuario con bypass
    if (!isNoCooldown) {
      cooldownsSteal[userId] = now + 7 * 24 * 60 * 60 * 1000
    }
  } catch (error) {
    await conn.reply(m.chat, `✘ Error al intentar robar: ${error.message}`, m)
  }
}

handler.help = ['robarwaifu']
handler.tags = ['gacha']
handler.command = ['robarwaifu']
handler.group = true
handler.register = false
handler.owner = true;

export default handler

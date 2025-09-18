// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const haremFilePath = './database/harem.json'

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveHarem(harem) {
  await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
}

let handler = async (m, { conn }) => {
  try {
    let harem = await loadHarem()

    // 🔄 Si harem es objeto (nuevo formato), lo paso a array
    if (!Array.isArray(harem) && typeof harem === 'object') {
      let fixed = []
      for (let userId of Object.keys(harem)) {
        for (let char of harem[userId]) {
          fixed.push({
            userId,
            characterId: char.id || char.characterId,
            characterName: char.name || char.characterName,
            character: char // opcional, por si quieres guardar todo el objeto original
          })
        }
      }
      await saveHarem(fixed)
      return conn.reply(m.chat, `✦ Se convirtió harem.json al formato de array ✅`, m)
    }

    // Si ya es array, confirmar
    if (Array.isArray(harem)) {
      return conn.reply(m.chat, `✦ El archivo harem.json ya está en formato array correcto ✅`, m)
    }

    return conn.reply(m.chat, `✘ Formato de harem.json no reconocido`, m)

  } catch (err) {
    return conn.reply(m.chat, `✘ Error al procesar harem.json: ${err.message}`, m)
  }
}

handler.help = ['test53']
handler.tags = ['tools']
handler.command = ['test53']

export default handler

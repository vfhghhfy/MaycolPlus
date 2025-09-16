// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const haremFilePath = './database/harem.json'

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function saveHarem(harem) {
  await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
}

let handler = async (m, { conn }) => {
  try {
    let harem = await loadHarem()

    // Si harem es un array viejo -> convertir a objeto
    if (Array.isArray(harem)) {
      let fixed = {}
      for (let entry of harem) {
        // antes podía ser: { userId: "...", character: {...} }
        if (entry.userId && entry.character) {
          if (!fixed[entry.userId]) fixed[entry.userId] = []
          fixed[entry.userId].push(entry.character)
        }
      }
      await saveHarem(fixed)
      return conn.reply(m.chat, `✦ Se convirtió el archivo harem.json al nuevo formato sin perder info ✨`, m)
    }

    // Si ya es objeto, solo confirmar
    if (typeof harem === 'object' && !Array.isArray(harem)) {
      return conn.reply(m.chat, `✦ El archivo harem.json ya está en el formato correcto ✅`, m)
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

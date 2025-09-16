// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'

const haremFilePath = './database/harem.json'

let handler = async (m, { conn }) => {
  try {
    const rawData = await fs.readFile(haremFilePath, 'utf-8')
    let haremData = JSON.parse(rawData)
    let fixedHarem = {}

    // Si haremData es un array de objetos con userId, lo convertimos
    if (Array.isArray(haremData)) {
      for (const char of haremData) {
        if (!char.user) continue
        if (!fixedHarem[char.user]) fixedHarem[char.user] = []
        fixedHarem[char.user].push(char)
      }
    } else if (typeof haremData === 'object' && haremData !== null) {
      // Si ya es un objeto, lo revisamos y copiamos los arrays tal cual
      for (const [uid, chars] of Object.entries(haremData)) {
        if (Array.isArray(chars)) {
          fixedHarem[uid] = chars
        } else if (chars) {
          // si por error es un solo objeto
          fixedHarem[uid] = [chars]
        }
      }
    }

    // Guardamos el harem arreglado
    await fs.writeFile(haremFilePath, JSON.stringify(fixedHarem, null, 2), 'utf-8')

    conn.reply(m.chat, '✅ El harem ha sido arreglado y ahora tiene la estructura correcta.', m)
  } catch (error) {
    conn.reply(m.chat, `✘ Error arreglando el harem: ${error.message}`, m)
  }
}

handler.help = ['test53']
handler.tags = ['admin']
handler.command = ['test53']
handler.group = false
handler.register = false
export default handler

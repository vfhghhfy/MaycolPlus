// Codigo hecho por SoyMaycol <3
import { promises as fs } from 'fs'
import path from 'path'

const pluginsFolder = './plugins' // carpeta de tus comandos

let handler = async (m, { conn }) => {
  try {
    const files = await fs.readdir(pluginsFolder)
    let logs = []

    for (let file of files) {
      if (!file.endsWith('.js')) continue
      const fullPath = path.join(pluginsFolder, file)
      try {
        const code = await fs.readFile(fullPath, 'utf-8')
        new Function(code) // solo verifica sintaxis
      } catch (err) {
        logs.push(`✘ ${file} → ${err.message}`)
      }
    }

    if (logs.length === 0) {
      await conn.reply(m.chat, `✔ Todos los plugins cargan correctamente.`, m)
    } else {
      await conn.reply(m.chat, `⚠ Errores detectados:\n\n${logs.join('\n')}`, m)
    }
  } catch (error) {
    await conn.reply(m.chat, `✘ Error al revisar plugins: ${error.message}`, m)
  }
}

handler.help = ['checkErrors']
handler.tags = ['tools']
handler.command = ['checkErrors']

export default handler

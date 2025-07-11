import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, args }) => {
  const comando = args[0]
  if (!comando) return await conn.reply(m.chat, '⚠️ Escribe un nombre para el plugin: *crearplugin saludo*', m)

  const prompt = `haz un plugin perfecto y perfecto para ${comando} hazlo a tu manera`
  const apiURL = `https://nightapi.is-a.dev/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`

  try {
    const res = await fetch(apiURL)
    const json = await res.json()

    if (!json?.code) return await conn.reply(m.chat, '❌ No se generó código válido UwU', m)

    // Verificamos qué número usar para el archivo
    const pluginsDir = path.join(process.cwd(), 'plugins')
    const files = fs.readdirSync(pluginsDir)
    const prefix = 'ai-command-'
    const nums = files
      .filter(f => f.startsWith(prefix) && f.endsWith('.js'))
      .map(f => parseInt(f.replace(prefix, '').replace('.js', '')))
      .filter(n => !isNaN(n))

    const nextNumber = (Math.max(...nums, 0) + 1)
    const filename = `${prefix}${nextNumber}.js`
    const filepath = path.join(pluginsDir, filename)

    // Guardar el archivo
    fs.writeFileSync(filepath, json.code)

    await conn.reply(m.chat, `✅ ¡Plugin creado y guardado como *${filename}*!`, m)
  } catch (e) {
    console.error('💥 Error:', e)
    await conn.reply(m.chat, '💥 Error generando o guardando el plugin 😿', m)
  }
}

handler.help = ['crearplugin <nombre>']
handler.tags = ['ai']
handler.command = /^crearplugin$/i
handler.register = true

export default handler

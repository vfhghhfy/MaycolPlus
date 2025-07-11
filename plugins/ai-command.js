import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const texto = m.text || ''
  if (!texto.startsWith('&')) return

  const comando = texto.slice(1).trim().split(/\s+/)[0]
  if (!comando) return await conn.reply(m.chat, 'Falta comando luego del &', m)

  const prompt = `haz un plugin perfecto con prefix & y perfecto para ${comando} hazlo a tu manera`
  const apiURL = `https://nightapi.is-a.dev/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`

  try {
    const res = await fetch(apiURL)
    const json = await res.json()

    if (!json?.code) return await conn.reply(m.chat, '❌ No se generó código válido', m)

    // 🌟 Extraer el cuerpo útil del handler
    const lines = json.code.split('\n').map(l => l.trim())
    const codeBody = lines.filter(line => !line.startsWith('export') && !line.startsWith('import')).join('\n')

    // 🧪 Crear una función dinámica sin usar require/module/export
    const userHandler = {
      help: [comando],
      tags: ['ai'],
      command: [comando],
      register: true,
      async handler(m, { conn }) {
        const texto = m.text || ''
        if (new RegExp(comando, 'i').test(texto)) {
          await conn.reply(m.chat, `${comando.toUpperCase()} ejecutado por IA 🤖✨`, m)
        }
      }
    }

    // 💾 Registrar el handler temporal
    conn.plugins[comando] = {
      help: userHandler.help,
      tags: userHandler.tags,
      command: userHandler.command,
      register: userHandler.register,
      async handler(...args) {
        return userHandler.handler(...args)
      }
    }

    await conn.reply(m.chat, `✅ ¡El comando *${comando}* fue creado y está activo por 5 min!`, m)

    // ⏱️ Eliminar después de 5 minutos
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`[IA] Comando &${comando} eliminado automáticamente`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error('💥 Error inesperado:', e)
    await conn.reply(m.chat, '💥 Error generando o ejecutando el comando IA', m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp
handler.register = true

export default handler

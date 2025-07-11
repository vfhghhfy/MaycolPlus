import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const texto = m.text || ''
  if (!texto.startsWith('&')) return

  const comando = texto.slice(1).trim().split(/\s+/)[0]
  if (!comando) return await conn.reply(m.chat, 'Debes escribir algo luego del "&"', m)

  const prompt = `haz un plugin perfecto con prefix & y perfecto para ${comando} hazlo a tu manera`
  const url = `https://nightapi.is-a.dev/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`

  try {
    const res = await fetch(url)
    const json = await res.json()

    if (!json || !json.code) {
      return await conn.reply(m.chat, 'La IA no devolvió código válido 😢', m)
    }

    // 🧹 Limpiar código: sin require, sin module, sin export
    let raw = json.code
    raw = raw.replace(/require\(.*?\)/g, '// require eliminado')
             .replace(/module\.exports\s*=\s*.*;/g, '// module.exports eliminado')
             .replace(/export\s+default\s+handler\s*;?/gi, '')
             .trim()

    // 🧠 Iniciar handler como variable en un scope local
    let handlerIA = null

    try {
      const sandbox = { handler: null }

      const evalCode = `(async () => {
        let handler = null;
        ${raw}
        return handler;
      })()`

      handlerIA = await eval(evalCode)
    } catch (err) {
      console.error('Error al evaluar código generado:', err)
      return await conn.reply(m.chat, '⚠️ El código generado tiene errores sintácticos o usa cosas no permitidas.\n\n' + err.message, m)
    }

    if (typeof handlerIA !== 'function') {
      return await conn.reply(m.chat, 'La IA no devolvió un handler válido :(', m)
    }

    // 🛠️ Agregar el plugin temporal
    conn.plugins[comando] = handlerIA
    await conn.reply(m.chat, `✅ Comando "&${comando}" creado y cargado exitosamente por IA`, m)

    // 🧽 Borrarlo después de 5 minutos
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`🧼 Comando IA &${comando} eliminado automáticamente`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `Ocurrió un error al generar el comando IA:\n${e.message}`, m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp
handler.register = true

export default handler

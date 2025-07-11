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

    // 🧹 Limpiar código prohibido
    let raw = json.code
    raw = raw
      .replace(/require\(.*?\)/g, '// require eliminado')
      .replace(/module\.exports\s*=\s*.*;/g, '// module.exports eliminado')
      .replace(/export\s+default\s+handler\s*;?/gi, '')
      .replace(/\bimport .*?;?/g, '// import eliminado') // por si acaso

    // 🧠 Guardamos en globalThis
    globalThis.__temp_handler__ = undefined

    const wrapped = `(async () => {
      try {
        ${raw}
        globalThis.__temp_handler__ = handler
      } catch (e) {
        globalThis.__temp_handler__ = e
      }
    })()`

    await eval(wrapped)

    const handlerIA = globalThis.__temp_handler__

    if (typeof handlerIA !== 'function') {
      console.error('Código generado inválido:', handlerIA)
      return await conn.reply(m.chat, '⚠️ El código generado tiene errores o no devolvió un handler válido', m)
    }

    // ✅ Cargar el comando en runtime
    conn.plugins[comando] = handlerIA
    await conn.reply(m.chat, `✅ Comando "&${comando}" creado por IA y cargado`, m)

    // ⏳ Eliminar después de 5 minutos
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`🧹 Comando &${comando} eliminado automáticamente`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error('Error al generar el comando:', e)
    await conn.reply(m.chat, `💥 Error inesperado:\n${e.message}`, m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp
handler.register = true

export default handler

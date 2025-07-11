import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const texto = m.text || ''
  if (!texto.startsWith('&')) return // Solo comandos que empiezan con "&"

  const comando = texto.slice(1).trim().split(/\s+/)[0]
  if (!comando) return await conn.reply(m.chat, '⚠️ Falta el nombre del comando luego de "&"', m)

  const prompt = `haz un plugin perfecto con prefix & y perfecto para ${comando} hazlo a tu manera`
  const apiURL = `https://nightapi.is-a.dev/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`

  try {
    const res = await fetch(apiURL)
    const json = await res.json()

    if (!json || typeof json.code !== 'string') {
      return await conn.reply(m.chat, '❌ No se pudo generar el plugin UwU', m)
    }

    // 💣 Elimina export, require, module y demás bichos
    let code = json.code
      .replace(/export\s+default\s+handler\s*;?/gi, '') // Elimina export
      .replace(/require\(.+?\)/g, 'null') // Evita require
      .replace(/module\.exports\s*=.+/g, '') // Evita module.exports
      .replace(/import.+?from.+?;/g, '') // Evita imports

    // 🧪 Ejecutar el handler como código dinámico
    let handlerIA = null
    const context = { conn, m }
    const sandbox = {}

    const wrapper = `
      (async () => {
        ${code}
        return typeof handler === 'function' ? handler : null
      })()
    `

    handlerIA = await eval(wrapper)

    if (typeof handlerIA !== 'function') {
      return await conn.reply(m.chat, '❌ La IA no devolvió un handler válido 😢', m)
    }

    // ✅ Registrar temporalmente
    conn.plugins[comando] = handlerIA
    await conn.reply(m.chat, `✅ Comando *${comando}* cargado correctamente por IA~ (⁠｡⁠♥⁠‿⁠♥⁠｡⁠)`, m)

    // 🧹 Eliminar el comando después de 5 minutos
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`🧽 Plugin &${comando} removido automáticamente`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error('💥 Error inesperado:', e)
    await conn.reply(m.chat, '💥 Error inesperado al generar el comando IA', m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp
handler.register = true

export default handler

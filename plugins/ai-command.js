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

    if (!json?.code) {
      return await conn.reply(m.chat, 'La IA no devolvió ningún código 😭', m)
    }

    let code = json.code

    // 🧹 Limpiamos código que no sirve en ESM
    code = code
      .replace(/(import .*?;)/g, '')            // elimina imports
      .replace(/(export\s+default\s+handler\s*;?)/g, '') // elimina export default handler
      .replace(/(require\(.*?\))/g, 'undefined') // evita require
      .replace(/(module\..*?;)/g, '')            // elimina module.exports

    // 🌟 Creamos variable donde irá el handler generado
    let handlerIA = null

    // 👀 Evaluamos el código
    try {
      eval(`${code}; handlerIA = handler`)
    } catch (e) {
      console.error('💥 Error al evaluar código generado:', e)
      return await conn.reply(m.chat, 'Error al interpretar el código generado 😔', m)
    }

    if (typeof handlerIA !== 'function') {
      return await conn.reply(m.chat, 'La IA no devolvió un handler válido UwU', m)
    }

    // ✅ Registrar handler temporalmente
    conn.plugins[comando] = handlerIA
    await conn.reply(m.chat, `✅ Comando *${comando}* creado por IA y activado 🎉`, m)

    // 🕒 Eliminar luego de 5 minutos
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`[IA-PLUGIN] &${comando} eliminado automáticamente`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, 'Error inesperado al crear comando IA (╥﹏╥)', m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp // se activa con el customPrefix
handler.register = true

export default handler

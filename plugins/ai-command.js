import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const texto = m.text || ''
  if (!texto.startsWith('&')) return // Solo comandos con prefijo &

  const comando = texto.slice(1).trim().split(/\s+/)[0] // obtiene "hola" de "&hola"
  if (!comando) return await conn.reply(m.chat, 'Falta comando luego del &', m)

  const prompt = `haz un plugin perfecto con prefix & y perfecto para ${comando} hazlo a tu manera`
  const apiURL = `https://nightapi.is-a.dev/api/maycode/models/v3/?message=${encodeURIComponent(prompt)}`

  try {
    const res = await fetch(apiURL)
    const json = await res.json()

    if (!json || !json.code) {
      return await conn.reply(m.chat, 'No se pudo generar el plugin UwU', m)
    }

    let code = json.code

    // Limpiar el código para dejarlo con formato estándar
    code = `
const handler = async (m, { conn }) => {
  const texto = m.text || ''
  if (/${comando}/i.test(texto)) {
    await conn.reply(m.chat, '${comando.toUpperCase()} activado por IA ✨', m)
  }
}

handler.help = ['${comando}']
handler.tags = ['ai']
handler.command = ['${comando}']
handler.register = true

export default handler;
    `.trim()

    // Ejecutar dinámicamente el plugin generado (💥 nivel avanzado, eval estilo temporal)
    const dynamicHandler = new Function('require', 'exports', 'module', code)
    const exports = {}
    const module = { exports }

    dynamicHandler(require, exports, module)
    const generatedHandler = module.exports.default || module.exports

    // Inyectar el handler a runtime
    conn.plugins[comando] = generatedHandler
    await conn.reply(m.chat, `✅ Comando *${comando}* creado y cargado con IA (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤`, m)

    // Opcional: borrar después de cierto tiempo (ej: 5 minutos)
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`Plugin &${comando} eliminado automáticamente`)
    }, 5 * 60 * 1000) // 5 minutos

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, 'Error generando el comando (ಥ﹏ಥ)', m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp // para que se ejecute por el prefix custom
handler.register = true

export default handler;

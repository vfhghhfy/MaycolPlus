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

    if (!json || !json.code) {
      return await conn.reply(m.chat, 'No se pudo generar el plugin UwU', m)
    }

    let code = json.code

    // Limpiar "export default handler;"
    code = code.replace(/export\s+default\s+handler\s*;?/gi, '')

    // Sandbox seguro con require fake
    const sandbox = {
      handler: null,
      require: (name) => {
        // Evitar errores si la IA pone require('fs') o cosas random
        console.warn(`⚠️ Se intentó usar require("${name}") pero está bloqueado.`)
        return {}
      },
      console,
    }

    const script = new Function('sandbox', `
      with (sandbox) {
        ${code}
        if (typeof handler === 'function') handlerIA = handler
      }
    `)

    script(sandbox)

    if (typeof sandbox.handler !== 'function') {
      return await conn.reply(m.chat, 'La IA no devolvió un handler válido 😔', m)
    }

    conn.plugins[comando] = sandbox.handler
    await conn.reply(m.chat, `✅ Comando *${comando}* generado y activado por IA 💥`, m)

    // Autodestrucción a los 5 minutos ⏳
    setTimeout(() => {
      delete conn.plugins[comando]
      console.log(`⛔ Plugin &${comando} eliminado automáticamente.`)
    }, 5 * 60 * 1000)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '💥 Error ejecutando el plugin IA (ಥ﹏ಥ)', m)
  }
}

handler.customPrefix = /^&[^\s]+/
handler.command = new RegExp
handler.register = true

export default handler

import fetch from 'node-fetch'

const handler = async (m, { conn, text, command, usedPrefix }) => {
    // Validación inicial
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `⚡ Uso correcto:\n${usedPrefix + command} Texto a convertir`
        }, { quoted: m })
    }

    const apiBase = "https://api.nekorinn.my.id/tools/openai-tts"
    const voice = "nova"
    const query = encodeURIComponent(text)
    const apiUrl = `${apiBase}?text=${query}&voice=${voice}`

    try {
        // Hacemos la petición
        const response = await fetch(apiUrl)

        if (!response.ok) {
            throw new Error(`Fallo en la API (status: ${response.status})`)
        }

        // Convertimos la respuesta a Buffer
        const audio = Buffer.from(await response.arrayBuffer())

        // Enviar como nota de voz
        await conn.sendMessage(m.chat, {
            audio,
            mimetype: "audio/mpeg",
            ptt: true
        }, { quoted: m })

    } catch (err) {
        await conn.sendMessage(m.chat, {
            text: `❌ Ocurrió un error al generar el audio:\n${err.message}`
        }, { quoted: m })
    }
}

handler.help = ["tts <texto>"]
handler.tags = ["tools"]
handler.command = /^tts$/i

export default handler

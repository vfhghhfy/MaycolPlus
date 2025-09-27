import axios from 'axios'
import { writeFile } from 'fs/promises'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `✎ Usa: ${usedPrefix}${command} opción1 opción2 ...`, m)

    // Convertimos texto a array de opciones
    const opciones = text.split(' ').filter(Boolean)
    if (opciones.length < 2) return conn.reply(m.chat, '❌ Debes enviar al menos 2 opciones', m)

    try {
        // Hacemos la petición a la API
        const res = await axios.get('https://mayapi.ooguy.com/roulette', {
            params: {
                options: JSON.stringify(opciones),
                apikey: 'nevi'
            }
        })

        if (!res.data.status) return conn.reply(m.chat, '❌ Error al generar la ruleta', m)

        const { winner, url } = res.data

        // Descargamos el gif
        const gifData = await axios.get(url, { responseType: 'arraybuffer' })

        // Lo guardamos temporalmente
        const tmpFile = `/tmp/${Date.now()}.gif`
        await writeFile(tmpFile, gifData.data)

        // Enviamos como sticker animado
        await conn.sendMessage(m.chat, { 
            sticker: { url: tmpFile },
            mentions: [m.sender]
        })

        // Mensaje de ganador
        conn.reply(m.chat, `🎉 ¡Ganador: *${winner}*! 🎉`, m)

    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '❌ Ocurrió un error al intentar girar la ruleta', m)
    }
}

handler.help = ['ruleta']
handler.tags = ['game']
handler.command = ['ruleta']
handler.register = false
handler.group = false

export default handler

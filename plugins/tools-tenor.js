import { getTenorGif } from '../lib/tenor.js'

const handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '🔎 *Escribe una palabra para buscar un GIF en Tenor.*', m)

    try {
        const gifUrl = await getTenorGif(text)

        if (!gifUrl) return conn.reply(m.chat, '❌ *No encontré ningún GIF para esa búsqueda.*', m)

        await conn.sendFile(m.chat, gifUrl, 'gif.gif', '', m)

    } catch (e) {
        console.log(e)
        conn.reply(m.chat, '❌ *Error al buscar el GIF.*', m)
    }
}

handler.command = ['gif', 'tenor']
handler.tags = ['tools'];
handler.register = true;

export default handler

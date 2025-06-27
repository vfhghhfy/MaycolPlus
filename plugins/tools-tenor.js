import { getTenorGifs } from '../lib/tenor.js'

const handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '🔎 *Escribe algo para buscar gifs de Tenor, cielo~* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤', m)

    try {
        const gifs = await getTenorGifs(text)

        if (!gifs.length) return conn.reply(m.chat, '❌ *No encontré ningún gif para eso, lo siento...* (╥﹏╥)', m)

        const gifPrincipal = gifs[0]

        let decorado = `✎ 𝐆𝐢𝐟𝐬 𝐃𝐞 𝐇𝐚𝐧𝐚𝐤𝐨-𝐁𝐨𝐭 ✎\n\n`
        decorado += `Hola jeje ^^ Aquí tienes tus gifs sobre: *${text}* UwU\n\n`
        decorado += `> Hecho por *_SoyMaycol <3_*\n\n`
        decorado += `~*Encontré ${gifs.length} gifs super lindos para ti*~\n\n`

        gifs.forEach((url, i) => {
            decorado += `┏━━━━•(=^●ω●^=)•━━━━┓\n`
            decorado += `🔸 𝔾𝕚𝕗 #${i + 1}\n`
            decorado += `┣━ 🔗: ${url}\n`
            decorado += `┗━━━━━━━━━━━━━━━┛\n\n`
        })

        await conn.sendFile(m.chat, gifPrincipal, 'hanako.gif', decorado, m)

    } catch (e) {
        console.log("❌ Error general:", e)
        conn.reply(m.chat, '❌ *Ocurrió un error al buscar el gif, perdona...* (⁠｡⁠•́︿•̀⁠｡⁠)', m)
    }
}

handler.command = ['gif', 'tenor']
handler.tags = ['tools'];
handler.register = true;

export default handler

/* Creditos a SoyMaycol <3
---> GitHub: SoySapo6 */

import fetch from 'node-fetch'

let partidas = {} // guardamos el estado de cada partida (por user)

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let id = m.sender

    // si no tiene partida activa, iniciar nueva
    if (!partidas[id]) {
        partidas[id] = {
            fen: 'start' // posición inicial
        }
    }

    let partida = partidas[id]

    if (!text) {
        let url = `https://fen2image.chessvision.ai/${partida.fen}`
        return conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙿𝚊𝚛𝚝𝚒𝚍𝚊 𝚍𝚎 𝙰𝚓𝚎𝚍𝚛𝚎𝚣
│
├─
│   ⇝  Usa: *${usedPrefix + command} e2e4*
╰─✦`, 
        }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
    }

    // mover la jugada del usuario usando la API de stockfish simple
    let move = text.trim()
    let urlApi = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(partida.fen)}&multiPv=1`

    try {
        // jugada del user (no validamos muy fuerte aquí)
        let res = await fetch(`https://chess-api.com/v1/${partida.fen}/move/${move}`)
        let data = await res.json()

        if (!data.success) {
            return m.reply("⚠️ Movimiento inválido, prueba otro.")
        }

        // actualizar la partida con el nuevo fen
        partida.fen = data.fen

        // IA responde (movimiento automático)
        let resIA = await fetch(`https://chess-api.com/v1/${partida.fen}/bestmove`)
        let dataIA = await resIA.json()

        if (dataIA.success) {
            partida.fen = dataIA.fen
        }

        let url = `https://fen2image.chessvision.ai/${partida.fen}`

        conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙼𝚘𝚟𝚒𝚖𝚒𝚎𝚗𝚝𝚘𝚜
│
├─  Tú: *${move}*
│   IA: *${dataIA.move || "?"}*
│
│   ⇝ Juega con: *${usedPrefix + command} <jugada>*
╰─✦`, 
        }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
        
    } catch (e) {
        console.error(e)
        return m.reply("❌ Error con la API de ajedrez.")
    }
}

handler.help = ['chess']
handler.tags = ['game']
handler.command = ['chess']
handler.register = true

export default handler

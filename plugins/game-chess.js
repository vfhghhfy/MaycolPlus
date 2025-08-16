/* Creditos a SoyMaycol <3
---> GitHub: SoySapo6 */

import { Chess } from 'chess.js'
import fetch from 'node-fetch'

let partidas = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let id = m.sender

  if (!partidas[id]) {
    partidas[id] = new Chess()
  }

  let partida = partidas[id]

  // si no ponen movimiento, mostrar el tablero actual
  if (!text) {
    let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`
    return conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙿𝚊𝚛𝚝𝚒𝚍𝚊 𝚍𝚎 𝙰𝚓𝚎𝚍𝚛𝚎𝚣
│
├─
│   ⇝  Juega con: *${usedPrefix + command} e2e4*
╰─✦`, 
    }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
  }

  let move = partida.move(text, { sloppy: true }) // sloppy permite notación flexible como e2e4
  if (!move) {
    return m.reply("⚠️ Movimiento inválido, prueba de nuevo.")
  }

  // Turno de la IA (random por ahora)
  if (!partida.game_over()) {
    let moves = partida.moves()
    let randomMove = moves[Math.floor(Math.random() * moves.length)]
    partida.move(randomMove)
  }

  let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`

  conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙼𝚘𝚟𝚒𝚖𝚒𝚎𝚗𝚝𝚘𝚜
│
├─  Tú: *${move.san}*
│   IA: *${partida.history().slice(-1)[0]}*
│
│   ⇝ Juega con: *${usedPrefix + command} <jugada>*
╰─✦`, 
  }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
}

handler.help = ['chess']
handler.tags = ['game']
handler.command = ['chess']
handler.register = true

export default handler

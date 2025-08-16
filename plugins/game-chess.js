/* Creditos a SoyMaycol <3
---> GitHub: SoySapo6 */

import { Chess } from 'chess.js'

let partidas = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let id = m.sender

  // si no tiene partida activa, iniciar nueva
  if (!partidas[id]) {
    partidas[id] = new Chess()
  }

  let partida = partidas[id]

  // si no puso movimiento → mostrar tablero
  if (!text) {
    let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`
    return conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙿𝚊𝚛𝚝𝚒𝚍𝚊 𝚍𝚎 𝙰𝚓𝚎𝚍𝚛𝚎𝚣
│
├─ Estado: ${partida.isGameOver() ? "✅ Finalizada" : "⏳ En juego"}
│
│   ⇝ Usa: *${usedPrefix + command} e2e4*
╰─✦`, 
    }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
  }

  // intentar mover el jugador
  let move = partida.move(text.trim(), { sloppy: true })

  if (!move) {
    return m.reply("⚠️ Movimiento inválido. Ejemplo: *e2e4*")
  }

  // verificar si terminó tras el movimiento del jugador
  if (partida.isGameOver()) {
    let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`
    delete partidas[id]
    return conn.sendMessage(m.chat, { text: 
`♟️ Tu jugada: *${text}*  

✅ ¡La partida ha terminado!
Resultado: ${partida.isCheckmate() ? "Jaque mate" : "Tablas"}`, 
    }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
  }

  // turno IA → elige un movimiento random válido
  let moves = partida.moves()
  let iaMove = moves[Math.floor(Math.random() * moves.length)]
  partida.move(iaMove)

  // verificar si terminó tras el movimiento IA
  let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`

  if (partida.isGameOver()) {
    delete partidas[id]
    return conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝚄𝚕𝚝𝚒𝚖𝚊𝚜 𝙹𝚞𝚐𝚊𝚍𝚊𝚜
│
├─  Tú: *${move.san}*
│   IA: *${iaMove}*
│
╰─✦

✅ ¡La partida terminó!
Resultado: ${partida.isCheckmate() ? "Jaque mate" : "Tablas"}`, 
    }, { quoted: m, contextInfo: { externalAdReply: { mediaType: 1, thumbnailUrl: url, renderLargerThumbnail: true }}})
  }

  // si sigue en juego → mostrar estado
  conn.sendMessage(m.chat, { text: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙼𝚘𝚟𝚒𝚖𝚒𝚎𝚗𝚝𝚘𝚜
│
├─  Tú: *${move.san}*
│   IA: *${iaMove}*
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

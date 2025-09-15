/* Creditos a SoyMaycol <3
---> GitHub: SoySapo6 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let id = m.sender.replace(/[^0-9]/g, '') // sessionId = números random/únicos
  let sessionId = `${id}${Math.floor(Math.random() * 1000)}`
  let apikey = "soymaycol<3"
  let level = 5

  // si no se pasa jugada, solo muestra tablero actual
  if (!text) {
    let res = await fetch(`https://mayapi.ooguy.com/chess?sessionId=${sessionId}&level=${level}&apikey=${apikey}`)
    let data = await res.json()
    return conn.sendMessage(m.chat, { 
      image: { url: data.url },
      caption: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙿𝚊𝚛𝚝𝚒𝚍𝚊 𝚍𝚎 𝙰𝚓𝚎𝚍𝚛𝚎𝚣
│
├─ Estado: ${data.message}
│
│   ⇝ Usa: *${usedPrefix + command} e2e4*
╰─✦`
    }, { quoted: m })
  }

  // movimiento del usuario
  let res = await fetch(`https://mayapi.ooguy.com/chess?sessionId=${sessionId}&move=${encodeURIComponent(text)}&level=${level}&apikey=${apikey}`)
  let data = await res.json()

  if (!data.status) return m.reply("⚠️ Movimiento inválido o error con la API")

  if (data.message.includes("terminado")) {
    return conn.sendMessage(m.chat, { 
      image: { url: data.url },
      caption: `♟️ Tu jugada: *${data.userMove}*\nIA: *${data.aiMove}*\n\n✅ ¡La partida ha terminado!`
    }, { quoted: m })
  }

  conn.sendMessage(m.chat, { 
    image: { url: data.url },
    caption: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙼𝚘𝚟𝚒𝚖𝚒𝚎𝚗𝚝𝚘𝚜
│
├─ Tú: *${data.userMove}*
│   IA: *${data.aiMove}*
│
│   ⇝ Juega con: *${usedPrefix + command} <jugada>*
╰─✦`
  }, { quoted: m })
}

handler.help = ['chess']
handler.tags = ['game']
handler.command = ['chess']
handler.register = true

export default handler

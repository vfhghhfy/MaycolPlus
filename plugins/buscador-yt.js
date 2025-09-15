// Codigo hecho por SoyMaycol <3
import fetch from "node-fetch"

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✦ Ejemplo:\n.${command} Gato`)

  try {
    let api = await fetch(`https://mayapi.ooguy.com/yts?query=${encodeURIComponent(text)}&apikey=may-35c2e70b`)
    let res = await api.json()

    if (!res.status || !res.result?.length) 
      return m.reply("No encontré nada uwu (╥﹏╥)")

    let vid = res.result[0] // primer resultado

    let msg = `
╭─❍「 ✦ YT Search ✦ 」
│
├─ 🎬 *Título:* ${vid.title}
├─ 👤 *Autor:* ${vid.autor}
├─ ⏱ *Duración:* ${vid.duration}
├─ 👀 *Vistas:* ${vid.views}
├─ 📅 *Subido:* ${vid.uploaded}
│
├─ 🔗 *Enlace:* ${vid.url}
╰──────────────────
    `.trim()

    await conn.sendMessage(m.chat, { 
      image: { url: vid.banner }, 
      caption: msg 
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply("Error al buscar (╯︵╰,)")
  }
}

handler.help = ["yts <texto>", "ytsearch <texto>"]
handler.tags = ["search"]
handler.command = /^yts|ytsearch$/i

export default handler

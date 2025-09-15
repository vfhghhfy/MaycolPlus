// by SoyMaycol <3

import fetch from "node-fetch"

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`
╭─❍「 ✦ MaycolPlus ✦ 」
│  
├─ Necesito un nombre para buscar 🐾
├─ Ejemplo:  *.yts gatos*
│  
╰───❍
  `)

  try {
    let url = `https://mayapi.ooguy.com/yts?query=${encodeURIComponent(text)}&apikey=may-35c2e70b`
    let res = await fetch(url)
    let json = await res.json()

    if (!json.status || !json.result?.length) return m.reply("No encontré nada 🥺")

    let txt = `╭─❍「 ✦ YouTube Search ✦ 」\n│\n`
    for (let i = 0; i < Math.min(5, json.result.length); i++) {
      let v = json.result[i]
      txt += `├─ 🎬 *${v.title}*\n`
      txt += `│ 👤 ${v.autor}\n`
      txt += `│ ⏳ ${v.duration} | 👀 ${v.views}\n`
      txt += `│ 📅 ${v.uploaded}\n`
      txt += `│ 🔗 ${v.url}\n`
      txt += `│ 🖼️ ${v.banner}\n│\n`
    }
    txt += `╰───❍`

    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply("Error al buscar 😿")
  }
}

handler.command = /^(yts|ytsearch)$/i
export default handler

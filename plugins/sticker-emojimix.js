import MessageType from '@soymaycol/maybailyes'
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
import fs from 'fs'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`📌 Ejemplo: *${usedPrefix + command}* 😎+🤑`)

  let [emoji, emoji2] = text.split`+`
  let url = `https://nightapi.is-a.dev/api/emojimix?emoji1=${encodeURIComponent(emoji)}&emoji2=${encodeURIComponent(emoji2)}`

  try {
    let res = await fetch(url)
    if (!res.ok) throw new Error(`Error al descargar la imagen: ${res.statusText}`)

    let buffer = await res.buffer()
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker
    let texto2 = packstickers.text2 || global.packsticker2

    let stiker = await sticker(buffer, false, texto1, texto2)
    await conn.sendFile(m.chat, stiker, null, { asSticker: true }, m)
  } catch (e) {
    console.error(e)
    m.reply('🥲 Hubo un error al crear el sticker. Asegúrate de que los emojis estén bien escritos, porfa~')
  }
}

handler.help = ['emojimix <emoji+emoji>']
handler.tags = ['sticker']
handler.command = ['emojimix']
handler.register = true

export default handler

/* Codigo De Recojer el Archivo Guardado
--> Creador: Ado926
--> Mejorado por: SoyMaycol*/

import fs from 'fs'

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid

  const removeEmojis = text =>
    text.replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')

  const normalizeText = text => removeEmojis(text).toLowerCase().trim()

  const searchKey = normalizeText(args.join(' '))

  if (!searchKey) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ ⚠️ *Advertencia:*
├─ Debes proporcionar una palabra clave válida
├─ para recuperar un archivo multimedia.
│
╰─✦`
    }, { quoted: msg })
  }

  if (!fs.existsSync('./guar.json')) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 📂 *Información:*
├─ Aún no hay archivos almacenados.
├─ Usa el comando *.guardar* para guardar uno.
│
╰─✦`
    }, { quoted: msg })
  }

  let guarData = JSON.parse(fs.readFileSync('./guar.json', 'utf-8'))

  const keys = Object.keys(guarData)
  const foundKey = keys.find(key => normalizeText(key) === searchKey)

  if (!foundKey) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ ❌ *ERROR 404*
├─ No se encontró el nombre: *"${searchKey}"*
├─ Intenta guardar tu archivo con:
├─ *#guardararchivo ${searchKey}*
│
╰─✦`
    }, { quoted: msg })
  }

  const storedMedia = guarData[foundKey]
  const mediaBuffer = Buffer.from(storedMedia.buffer, 'base64')

  let messageOptions = {
    mimetype: storedMedia.mimetype
  }

  if (storedMedia.mimetype.startsWith('image') && storedMedia.extension !== 'webp') {
    messageOptions.image = mediaBuffer
  } else if (storedMedia.mimetype.startsWith('video')) {
    messageOptions.video = mediaBuffer
  } else if (storedMedia.mimetype.startsWith('audio')) {
    messageOptions.audio = mediaBuffer
  } else if (storedMedia.mimetype.startsWith('application')) {
    messageOptions.document = mediaBuffer
    messageOptions.fileName = `Archivo.${storedMedia.extension}`
  } else if (
    storedMedia.mimetype === 'image/webp' ||
    storedMedia.extension === 'webp'
  ) {
    messageOptions.sticker = mediaBuffer
  } else {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ ❌ *ERROR*
├─ El archivo es muy pesado o incompatible.
├─ Inténtalo más tarde ⏰
│
╰─✦`
    }, { quoted: msg })
  }

  await conn.sendMessage(chatId, messageOptions, { quoted: msg })
}

handler.command = ['recogerarchivo']
handler.group = true
handler.private = false

export default handler

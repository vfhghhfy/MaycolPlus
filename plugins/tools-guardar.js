/* Codigo De Guardar
--> Creador: Ado926
--> Mejorado por: SoyMaycol*/

import fs from 'fs'
import { downloadContentFromMessage } from '@soymaycol/maybailyes'

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid

  if (
    !msg.message?.extendedTextMessage ||
    !msg.message.extendedTextMessage.contextInfo?.quotedMessage
  ) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 📛 *Error:*
├─ Debes responder a un archivo multimedia
├─ (imagen, video, audio, sticker o documento)
├─ con una palabra clave para guardarlo.
│
╰─✦`
    }, { quoted: msg })
  }

  const saveKey = args.join(' ').trim().toLowerCase()

  if (!/[a-zA-Z0-9]/.test(saveKey)) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ ⚠️ *Advertencia:*
├─ La palabra clave debe contener
├─ al menos una letra o número.
├─ No se permiten solo símbolos o emojis.
│
╰─✦`
    }, { quoted: msg })
  }

  if (!fs.existsSync('./guar.json')) {
    fs.writeFileSync('./guar.json', JSON.stringify({}, null, 2))
  }

  let guarData = JSON.parse(fs.readFileSync('./guar.json', 'utf-8'))

  if (guarData[saveKey]) {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 🚫 *Aviso:*
├─ Ya existe un archivo guardado con la palabra:
├─ *"${saveKey}"*
├─ Usa otra diferente para evitar conflictos.
│
╰─✦`
    }, { quoted: msg })
  }

  const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage
  let mediaType, mediaMessage, fileExtension

  if (quotedMsg.imageMessage) {
    mediaType = 'image'
    mediaMessage = quotedMsg.imageMessage
    fileExtension = 'jpg'
  } else if (quotedMsg.videoMessage) {
    mediaType = 'video'
    mediaMessage = quotedMsg.videoMessage
    fileExtension = 'mp4'
  } else if (quotedMsg.audioMessage) {
    mediaType = 'audio'
    mediaMessage = quotedMsg.audioMessage
    fileExtension = 'mp3'
  } else if (quotedMsg.stickerMessage) {
    mediaType = 'sticker'
    mediaMessage = quotedMsg.stickerMessage
    fileExtension = 'webp'
  } else if (quotedMsg.documentMessage) {
    mediaType = 'document'
    mediaMessage = quotedMsg.documentMessage
    fileExtension = mediaMessage.mimetype.split('/')[1] || 'bin'
  } else {
    return conn.sendMessage(chatId, {
      text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ 📎 *Error:*
├─ Solo se permiten archivos de tipo:
├─ imagen, video, audio, sticker o documento.
│
╰─✦`
    }, { quoted: msg })
  }

  const mediaStream = await downloadContentFromMessage(mediaMessage, mediaType)
  let mediaBuffer = Buffer.alloc(0)
  for await (const chunk of mediaStream) {
    mediaBuffer = Buffer.concat([mediaBuffer, chunk])
  }

  guarData[saveKey] = {
    buffer: mediaBuffer.toString('base64'),
    mimetype: mediaMessage.mimetype,
    extension: fileExtension,
    savedBy: msg.key.participant || msg.key.remoteJid
  }

  fs.writeFileSync('./guar.json', JSON.stringify(guarData, null, 2))

  return conn.sendMessage(chatId, {
    text: `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ ✅ *Éxito:*
├─ Archivo almacenado bajo la clave:
├─ *"${saveKey}"*
│
╰─✦`
  }, { quoted: msg })
}

handler.command = ['guardararchivo']
handler.group = true
handler.private = true

export default handler

import { WAMessageStubType } from '@soymaycol/maybaileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '𝐇𝐨𝐥𝐚𝐚𝐚 (⁠・⁠∀⁠・⁠)'
  let txt1 = '𝐀𝐝𝐢𝐨𝐬 (⁠╥⁠﹏⁠╥⁠)'
  let groupSize = participants.length
  groupSize--;
  let groupSize2 = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `[★] *Holaa!* Eres bienvenid@ a ${groupMetadata.subject}!\n➜ @${m.messageStubParameters[0].split`@`[0]}\n${global.welcom1}\n Esas ${groupSize} ya me usaron, Ahora faltas tu!!! (⁠◠⁠ᴥ⁠◕⁠ʋ⁠)`    
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `𝐍𝐚𝐡, 𝐈𝐠𝐮𝐚𝐥 𝐲𝐚 𝐞𝐫𝐚 𝐮𝐧𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐪𝐮𝐞 𝐧𝐨 𝐬𝐞 𝐬𝐚𝐛í𝐚 𝐥𝐚𝐯𝐚𝐫 𝐞𝐥 𝐜𝐮𝐥𝐨\n\n┇ Un gey se salio de ${groupMetadata.subject} ಠ⁠_⁠ಠ\n★ @${m.messageStubParameters[0].split`@`[0]}\n${global.welcom2}\n✎ Al menos somos ${groupSize2} Miembros.\nSi vuelves te juro que le rompere la cabeza >:(`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }}

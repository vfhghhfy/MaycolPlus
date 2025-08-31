import fetch from 'node-fetch'
import FormData from 'form-data'

let linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
let linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i
const defaultImage = 'https://raw.githubusercontent.com/SoySapo6/tmp/refs/heads/main/Permanentes/images.jpeg'

const nsfwWords = [
  'porno', 'porn', 'xxx', 'sex', 'sexo', 'pene', 'vagina', 'coño', 'culo', 
  'tetas', 'puta', 'puto', 'joder', 'follar', 'coger', 'verga', 'polla',
  'masturbarse', 'masturbar', 'orgasmo', 'eyacular', 'correrse', 'venirse',
  'cachondo', 'cachonda', 'caliente', 'excitado', 'excitada', 'desnudo', 
  'desnuda', 'nude', 'naked', 'dick', 'pussy', 'cock', 'cum', 'fuck',
  'bitch', 'horny', 'naked', 'strip', 'boobs', 'ass', 'anal', 'oral'
]

async function uploadToCatbox(buffer) {
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, 'image.jpg')
    
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })
    
    return await response.text()
  } catch (error) {
    console.error('Error uploading to Catbox:', error)
    return null
  }
}

// Función mejorada para verificar si es admin
async function isAdminOrOwner(m, conn) {
  try {
    if (m.fromMe) return true // El bot siempre tiene permisos
    
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(p => p.id === m.sender)
    
    // Verificar si es admin o super admin
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

const handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('♡ ¡Oye! Solo funciona en grupos~ ¿No sabías eso? ♡')
  
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'
  
  if (!['antilink', 'welcome', 'antiarabe', 'modoadmin', 'antinsfw'].includes(type)) {
    return m.reply(`♡ ¡Usa estos hechizos mágicos! ♡\n\n✧ *.on antilink* / *.off antilink*\n✧ *.on welcome* / *.off welcome*\n✧ *.on antiarabe* / *.off antiarabe*\n✧ *.on modoadmin* / *.off modoadmin*\n✧ *.on antinsfw* / *.off antinsfw*\n\n～ MaycolPlus por SoyMaycol ～`)
  }
  
  // Verificación mejorada de admin
  const isUserAdmin = await isAdminOrOwner(m, conn)
  if (!isUserAdmin && !isAdmin && !isOwner) {
    return m.reply('♡ ¡Ara ara~! Solo los admins pueden usar estos poderes especiales ♡')
  }
  
  if (type === 'antilink') {
    chat.antilink = enable
    if(!chat.antilinkWarns) chat.antilinkWarns = {}
    if(!enable) chat.antilinkWarns = {}
    return m.reply(`♡ ¡Antilink ${enable ? 'activado' : 'desactivado'}! ${enable ? '¡Ahora protegeré este lugar!' : '¡Ya no vigilaré los enlaces!'} ♡`)
  }
  
  if (type === 'welcome') {
    chat.welcome = enable
    return m.reply(`♡ ¡Welcome ${enable ? 'activado' : 'desactivado'}! ${enable ? '¡Daré la bienvenida a todos!' : '¡Ya no saludaré a nadie~'} ♡`)
  }
  
  if (type === 'antiarabe') {
    chat.antiarabe = enable
    return m.reply(`♡ ¡Anti-árabe ${enable ? 'activado' : 'desactivado'}! ${enable ? '¡Cuidaré que no entren!' : '¡Ya no los vigilaré~'} ♡`)
  }
  
  if (type === 'modoadmin') {
    chat.modoadmin = enable
    return m.reply(`♡ ¡Modo Admin ${enable ? 'activado' : 'desactivado'}! ${enable ? '¡Solo admins podrán hablar!' : '¡Todos pueden hablar libremente~'} ♡`)
  }
  
  if (type === 'antinsfw') {
    chat.antinsfw = enable
    return m.reply(`♡ ¡Anti-NSFW ${enable ? 'activado' : 'desactivado'}! ${enable ? '¡Mantendré este lugar puro!' : '¡Ya no vigilaré el contenido~'} ♡`)
  }
}

handler.command = ['on', 'off']
handler.group = true
handler.register = false
handler.tags = ['group']
handler.help = ['on welcome', 'off welcome', 'on antilink', 'off antilink', 'on modoadmin', 'off modoadmin', 'on antinsfw', 'off antinsfw']

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  
  // Verificación mejorada para modo admin
  if (chat.modoadmin) {
    try {
      const groupMetadata = await conn.groupMetadata(m.chat)
      const participant = groupMetadata.participants.find(p => p.id === m.sender)
      const isUserAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
      
      // Si no es admin y no es el bot, bloquear el mensaje
      if (!isUserAdmin && !m.fromMe) {
        const delet = m.key.participant
        const msgID = m.key.id
        
        try {
          await conn.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: msgID,
              participant: delet
            }
          })
        } catch (error) {
          console.error('Error deleting message in admin mode:', error)
        }
        return true // Bloquear el procesamiento del mensaje
      }
    } catch (error) {
      console.error('Error in admin mode check:', error)
    }
  }
  
  if (chat.antiarabe && m.messageStubType === 27) {
    const newJid = m.messageStubParameters?.[0]
    if (!newJid) return
  
    const number = newJid.split('@')[0].replace(/\D/g, '')
    const arabicPrefixes = ['212', '20', '971', '965', '966', '974', '973', '962']
    const isArab = arabicPrefixes.some(prefix => number.startsWith(prefix))
  
    if (isArab) {
      await conn.sendMessage(m.chat, { text: `♡ ¡Ara ara~! @${newJid.split('@')[0]} será expulsado. No queremos العرب aquí~ ¡Anti-Árabe activado! ♡`, mentions: [newJid] })
      await conn.groupParticipantsUpdate(m.chat, [newJid], 'remove')
      return true
    }
  }
  
  if (chat.antinsfw) {
    try {
      const groupMetadata = await conn.groupMetadata(m.chat)
      const participant = groupMetadata.participants.find(p => p.id === m.sender)
      const isUserAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
      const text = m?.text?.toLowerCase() || ''
      
      if (!isUserAdmin && !m.fromMe) {
        const containsNSFW = nsfwWords.some(word => text.includes(word))
        
        if (containsNSFW) {
          const userTag = `@${m.sender.split('@')[0]}`
          const delet = m.key.participant
          const msgID = m.key.id
          
          try {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Kyaa~! ${userTag} usó palabras impuras... ¡No permitiré eso aquí! ¡Serás expulsado por mantener este lugar sagrado! ♡\n\n～ Anti-NSFW activado por MaycolPlus ～`,
              mentions: [m.sender]
            }, { quoted: m })
            
            await conn.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: msgID,
                participant: delet
              }
            })
            
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
          } catch {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Ara ara~! No pude expulsar a ${userTag}... Parece que no tengo suficiente poder~ ♡`,
              mentions: [m.sender]
            }, { quoted: m })
          }
          return true
        }
        
        if (m.mtype === 'imageMessage' && m.message?.imageMessage) {
          try {
            const buffer = await m.download()
            const catboxUrl = await uploadToCatbox(buffer)
            
            if (catboxUrl) {
              const response = await fetch(`https://delirius-apiofc.vercel.app/tools/checknsfw?image=${encodeURIComponent(catboxUrl)}`)
              const data = await response.json()
              
              if (data?.status && data?.data?.NSFW) {
                const userTag = `@${m.sender.split('@')[0]}`
                const delet = m.key.participant
                const msgID = m.key.id
                
                try {
                  await conn.sendMessage(m.chat, {
                    text: `♡ ¡Kyaa kyaa~! ${userTag} envió una imagen impura... ¡Detecté contenido NSFW con ${data.data.percentage} de certeza! ¡No permitiré eso aquí! ♡\n\n✧ ${data.data.response}\n\n～ Anti-NSFW activado por MaycolPlus ～`,
                    mentions: [m.sender]
                  }, { quoted: m })
                  
                  await conn.sendMessage(m.chat, {
                    delete: {
                      remoteJid: m.chat,
                      fromMe: false,
                      id: msgID,
                      participant: delet
                    }
                  })
                  
                  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                } catch {
                  await conn.sendMessage(m.chat, {
                    text: `♡ ¡Ara ara~! No pude expulsar a ${userTag}... Parece que no tengo suficiente poder~ ♡`,
                    mentions: [m.sender]
                  }, { quoted: m })
                }
                return true
              }
            }
          } catch (error) {
            console.error('Error checking NSFW image:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error in antinsfw check:', error)
    }
  }
  
  if (chat.antilink) {
    try {
      const groupMetadata = await conn.groupMetadata(m.chat)
      const participant = groupMetadata.participants.find(p => p.id === m.sender)
      const isUserAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
      const text = m?.text || ''
    
      if (!isUserAdmin && !m.fromMe && (linkRegex.test(text) || linkRegex1.test(text))) {
        const userTag = `@${m.sender.split('@')[0]}`
        const delet = m.key.participant
        const msgID = m.key.id
    
        try {
          const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
          if (text.includes(ownGroupLink)) return
        } catch { }
    
        if (!chat.antilinkWarns) chat.antilinkWarns = {}
        if (!chat.antilinkWarns[m.sender]) chat.antilinkWarns[m.sender] = 0
    
        chat.antilinkWarns[m.sender]++
    
        if (chat.antilinkWarns[m.sender] < 3) {
          try {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Ara ara~! ${userTag}, no se permiten enlaces aquí~ Esta es tu advertencia ${chat.antilinkWarns[m.sender]}/3 ♡\n\n～ MaycolPlus te está cuidando ～`,
              mentions: [m.sender]
            }, { quoted: m })
    
            await conn.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: msgID,
                participant: delet
              }
            })
          } catch {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Kyaa~! No pude eliminar el mensaje de ${userTag}... ¡Parece que no tengo suficiente poder! ♡`,
              mentions: [m.sender]
            }, { quoted: m })
          }
        } else {
          try {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Ara ara~! ${userTag} alcanzó 3 advertencias por enviar enlaces... ¡Ahora serás expulsado para mantener este lugar seguro! ♡\n\n～ Anti-Link de MaycolPlus ～`,
              mentions: [m.sender]
            }, { quoted: m })
    
            await conn.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: msgID,
                participant: delet
              }
            })
    
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    
            chat.antilinkWarns[m.sender] = 0
          } catch {
            await conn.sendMessage(m.chat, {
              text: `♡ ¡Kyaa~! No pude expulsar a ${userTag}... ¡Parece que no tengo suficientes permisos! ♡`,
              mentions: [m.sender]
            }, { quoted: m })
          }
        }
    
        return true
      }
    } catch (error) {
      console.error('Error in antilink check:', error)
    }
  }
  
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    let profilePic
  
    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      profilePic = defaultImage
    }
  
    const isLeaving = [28, 32].includes(m.messageStubType)
    const externalAdReply = {
      forwardingScore: 999,
      isForwarded: true,
      title: `${isLeaving ? '♡ ¡Sayonara~!' : '♡ ¡Yokoso~!'}`,
      body: `✧ Grupo mágico con ${groupSize} miembros ✧`,
      mediaType: 1,
      renderLargerThumbnail: true,
      thumbnailUrl: profilePic,
      sourceUrl: `https://wa.me/${userId.split('@')[0]}`
    }
  
    if (!isLeaving) {
      const txtWelcome = '♡ ¡BIENVENIDO/A AL LUGAR MÁGICO! ♡'
      const bienvenida = `
✧ ¡Ara ara~! ¡Hola ${userMention}! ✧

♡ Te doy la bienvenida a *${groupMetadata.subject}*
✧ Somos *${groupSize}* almas en esta comunidad mágica
♡ Por favor sigue las reglas para que todos seamos felices~
✧ Si necesitas ayuda, habla con algún admin
♡ ¡Disfruta de tu estadía en este lugar especial!

～ Con amor, MaycolPlus creado por SoyMaycol ～
`.trim()
  
      await conn.sendMessage(m.chat, {
        text: `${txtWelcome}\n\n${bienvenida}`,
        contextInfo: { mentionedJid: [userId], externalAdReply }
      })
    } else {
      const txtBye = '♡ ¡MATA NE~! ♡'
      const despedida = `
✧ ¡Ara ara~! El usuario ${userMention} ha salido de *${groupMetadata.subject}* ✧

♡ Quedamos *${groupSize}* miembros en este lugar mágico
✧ Gracias por tu tiempo aquí y esperamos verte pronto~
♡ Recuerda que las puertas siempre están abiertas para ti
✧ ¡Que tengas un buen viaje!

～ Con cariño, MaycolPlus creado por SoyMaycol ～
`.trim()
  
      await conn.sendMessage(m.chat, {
        text: `${txtBye}\n\n${despedida}`,
        contextInfo: { mentionedJid: [userId], externalAdReply }
      })
    }
  }
}

export default handler

import fetch from 'node-fetch'

// Almacenamiento temporal para las acciones de control del grupo
if (!global.groupControlCache) global.groupControlCache = new Map()

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos')
  
  try {
    // Obtener metadata del grupo para verificaciones manuales
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    
    // Función para normalizar números (quitar lid si existe)
    const normalizeJid = (jid) => {
      if (!jid) return null
      // Si contiene 'lid', extraer el número real
      if (jid.includes(':') && jid.includes('@lid')) {
        let number = jid.split(':')[0]
        return number + '@s.whatsapp.net'
      }
      return jid
    }
    
    // Normalizar el JID del usuario
    let userJid = normalizeJid(m.sender)
    let botJid = normalizeJid(conn.user.jid)
    
    // Verificar si el usuario es admin manualmente
    let isUserAdmin = false
    let isBotAdmin = false
    
    for (let participant of participants) {
      let participantJid = normalizeJid(participant.id)
      
      // Verificar admin del usuario
      if (participantJid === userJid && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
        isUserAdmin = true
      }
      
      // Verificar admin del bot
      if (participantJid === botJid && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
        isBotAdmin = true
      }
      
      // También verificar con el JID original por si acaso
      if (participant.id === m.sender && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
        isUserAdmin = true
      }
      
      if (participant.id === conn.user.jid && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
        isBotAdmin = true
      }
    }
    
    // Debug info (opcional, puedes comentar estas líneas)
    console.log('Debug Info:')
    console.log('User JID original:', m.sender)
    console.log('User JID normalizado:', userJid)
    console.log('Bot JID original:', conn.user.jid)
    console.log('Bot JID normalizado:', botJid)
    console.log('Es usuario admin:', isUserAdmin)
    console.log('Es bot admin:', isBotAdmin)
    
    // Verificaciones con mensajes informativos
    if (!isUserAdmin) {
      let debugMsg = `❌ Solo los administradores pueden usar este comando\n\n`
      debugMsg += `🔍 *Debug Info:*\n`
      debugMsg += `• Tu ID: \`${m.sender}\`\n`
      debugMsg += `• ID Normalizado: \`${userJid}\`\n`
      debugMsg += `• Detectado como admin: ${isUserAdmin ? '✅' : '❌'}\n\n`
      debugMsg += `📋 *Admins del grupo:*\n`
      
      let adminList = participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(admin => `• ${admin.id} (${admin.admin})`)
        .join('\n')
      
      debugMsg += adminList || 'No se encontraron admins'
      
      return m.reply(debugMsg)
    }
    
    if (!isBotAdmin) {
      let debugMsg = `❌ El bot necesita ser administrador para controlar el grupo\n\n`
      debugMsg += `🔍 *Debug Info:*\n`
      debugMsg += `• Bot ID: \`${conn.user.jid}\`\n`
      debugMsg += `• ID Normalizado: \`${botJid}\`\n`
      debugMsg += `• Detectado como admin: ${isBotAdmin ? '✅' : '❌'}\n\n`
      debugMsg += `💡 *Solución:* Haz que un admin del grupo promueva al bot a administrador`
      
      return m.reply(debugMsg)
    }
    
    await m.react('🔧')
    
    // Si es una selección de acción (abrir o cerrar)
    if (args[0] && (args[0].startsWith('abrir_') || args[0].startsWith('cerrar_'))) {
      return await handleGroupControl(conn, m, args[0])
    }
    
    // Mostrar menú principal de control
    await showGroupControlMenu(conn, m, usedPrefix)
    
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al procesar la solicitud.' }, { quoted: m })
  }
}

// Función para mostrar el menú de control con botones
async function showGroupControlMenu(conn, m, usedPrefix) {
  try {
    // Obtener información del grupo
    let groupMetadata = await conn.groupMetadata(m.chat)
    let groupName = groupMetadata.subject
    let isGroupClosed = groupMetadata.announce // true = cerrado, false = abierto
    let participantsCount = groupMetadata.participants.length
    
    // Crear ID único para esta sesión
    let sessionId = `${Date.now()}_${m.sender.split('@')[0]}`
    
    // Guardar sesión en caché
    global.groupControlCache.set(sessionId, {
      groupId: m.chat,
      adminId: m.sender,
      groupInfo: {
        name: groupName,
        participants: participantsCount,
        isClosed: isGroupClosed
      },
      timestamp: Date.now()
    })
    
    // Limpiar caché antiguo después de 5 minutos
    setTimeout(() => {
      if (global.groupControlCache.has(sessionId)) {
        let cached = global.groupControlCache.get(sessionId)
        if (Date.now() - cached.timestamp > 300000) {
          global.groupControlCache.delete(sessionId)
        }
      }
    }, 300000)
    
    let statusText = isGroupClosed ? '🔒 *CERRADO* (Solo admins)' : '🔓 *ABIERTO* (Todos pueden escribir)'
    
    let message = `🔧 *Control del Grupo*\n\n`
    message += `📱 *Grupo:* ${groupName}\n`
    message += `👥 *Participantes:* ${participantsCount}\n`
    message += `📊 *Estado actual:* ${statusText}\n\n`
    message += `Selecciona la acción que deseas realizar:`
    
    // Método 1: Intentar con conn.sendButton
    let buttons = [
      [`🔓 Abrir Grupo`, `${usedPrefix + 'grupo'} abrir_${sessionId}`, null],
      [`🔒 Cerrar Grupo`, `${usedPrefix + 'grupo'} cerrar_${sessionId}`, null]
    ]
    
    try {
      await conn.sendButton(m.chat, message, 
        `🔧 Control de Grupo • ${groupName}`, 
        null, buttons, m)
        
    } catch (error) {
      console.log("conn.sendButton no funciona, probando método alternativo...")
      
      try {
        // Método 2: sendMessage con buttons
        let buttonList = [
          {
            buttonId: `${usedPrefix + 'grupo'} abrir_${sessionId}`,
            buttonText: { displayText: `🔓 Abrir Grupo` },
            type: 1
          },
          {
            buttonId: `${usedPrefix + 'grupo'} cerrar_${sessionId}`,
            buttonText: { displayText: `🔒 Cerrar Grupo` },
            type: 1
          }
        ]
        
        await conn.sendMessage(m.chat, {
          text: message,
          footer: `🔧 Control de Grupo - ${groupName}`,
          buttons: buttonList,
          headerType: 1
        }, { quoted: m })
        
      } catch (error2) {
        console.log("Método alternativo tampoco funciona, enviando con externalAdReply...")
        
        try {
          // Método 3: Con externalAdReply
          await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
              externalAdReply: {
                title: `🔧 Control del Grupo`,
                body: `${groupName} • ${participantsCount} miembros`,
                thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e8c5b46f-2920-4dcd-8def-8292b06c3ccf.png',
                sourceUrl: 'https://github.com',
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: m })
          
          // Enviar opciones por separado
          setTimeout(async () => {
            let optionsText = `🔧 *Comandos disponibles:*\n\n`
            optionsText += `🔓 \`${usedPrefix}grupo abrir_${sessionId}\`\n`
            optionsText += `🔒 \`${usedPrefix}grupo cerrar_${sessionId}\``
            
            await conn.sendMessage(m.chat, { text: optionsText }, { quoted: m })
          }, 1000)
          
        } catch (error3) {
          // Fallback final: solo texto
          let fallbackText = message + `\n\n🔧 *Comandos disponibles:*\n`
          fallbackText += `🔓 ${usedPrefix}grupo abrir_${sessionId}\n`
          fallbackText += `🔒 ${usedPrefix}grupo cerrar_${sessionId}`
          
          await conn.sendMessage(m.chat, { text: fallbackText }, { quoted: m })
        }
      }
    }
    
    await m.react('✅')
    
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: '❌ Error al mostrar el menú de control.' }, { quoted: m })
  }
}

// Función para manejar las acciones de control del grupo
async function handleGroupControl(conn, m, selection) {
  let parts = selection.split('_')
  let action = parts[0] // 'abrir' o 'cerrar'
  let sessionId = parts.slice(1).join('_')
  
  if (!global.groupControlCache.has(sessionId)) {
    return conn.sendMessage(m.chat, { 
      text: '❌ Sesión no encontrada o expirada. Usa el comando principal nuevamente.' 
    }, { quoted: m })
  }
  
  let cached = global.groupControlCache.get(sessionId)
  
  // Función para normalizar JIDs
  const normalizeJid = (jid) => {
    if (!jid) return null
    if (jid.includes(':') && jid.includes('@lid')) {
      let number = jid.split(':')[0]
      return number + '@s.whatsapp.net'
    }
    return jid
  }
  
  // Verificar que el admin sea el correcto (con normalización)
  let userJid = normalizeJid(m.sender)
  let cachedAdminJid = normalizeJid(cached.adminId)
  
  if (cachedAdminJid !== userJid && cached.adminId !== m.sender) {
    return conn.sendMessage(m.chat, { text: '❌ Esta acción no es para ti.' }, { quoted: m })
  }
  
  // Verificar que sea el mismo grupo
  if (cached.groupId !== m.chat) {
    return conn.sendMessage(m.chat, { text: '❌ Esta acción es para otro grupo.' }, { quoted: m })
  }
  
  // Verificar expiración (5 minutos)
  if (Date.now() - cached.timestamp > 300000) {
    global.groupControlCache.delete(sessionId)
    return conn.sendMessage(m.chat, { 
      text: '⏰ La sesión ha expirado. Usa el comando principal nuevamente.' 
    }, { quoted: m })
  }
  
  try {
    await m.react('🕓')
    
    if (action === 'abrir') {
      await handleOpenGroup(conn, m, cached.groupInfo)
    } else if (action === 'cerrar') {
      await handleCloseGroup(conn, m, cached.groupInfo)
    } else {
      await conn.sendMessage(m.chat, { text: '❌ Acción no reconocida.' }, { quoted: m })
    }
    
    // Limpiar caché después de la acción
    global.groupControlCache.delete(sessionId)
    
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar la acción.' }, { quoted: m })
  }
}

// Función para abrir el grupo
async function handleOpenGroup(conn, m, groupInfo) {
  try {
    // Verificar si el grupo ya está abierto
    let groupMetadata = await conn.groupMetadata(m.chat)
    if (!groupMetadata.announce) {
      return conn.sendMessage(m.chat, { 
        text: 'ℹ️ El grupo ya está abierto. Todos los participantes pueden enviar mensajes.' 
      }, { quoted: m })
    }
    
    // Abrir el grupo (permitir que todos envíen mensajes)
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    
    let openMessage = `🔓 *GRUPO ABIERTO*\n\n`
    openMessage += `📱 *Grupo:* ${groupInfo.name}\n`
    openMessage += `👑 *Abierto por:* @${m.sender.split('@')[0]}\n`
    openMessage += `📅 *Fecha:* ${new Date().toLocaleString('es-ES')}\n\n`
    openMessage += `✅ Ahora todos los participantes pueden enviar mensajes.\n`
    openMessage += `📝 *Estado:* 🔓 Abierto para todos`
    
    await conn.sendMessage(m.chat, { 
      text: openMessage,
      mentions: [m.sender]
    }, { quoted: m })
    
    await m.react('🔓')
    
  } catch (error) {
    console.error('Error al abrir grupo:', error)
    await conn.sendMessage(m.chat, { 
      text: '❌ No se pudo abrir el grupo. Verifica que el bot tenga permisos de administrador.' 
    }, { quoted: m })
    await m.react('❌')
  }
}

// Función para cerrar el grupo
async function handleCloseGroup(conn, m, groupInfo) {
  try {
    // Verificar si el grupo ya está cerrado
    let groupMetadata = await conn.groupMetadata(m.chat)
    if (groupMetadata.announce) {
      return conn.sendMessage(m.chat, { 
        text: 'ℹ️ El grupo ya está cerrado. Solo los administradores pueden enviar mensajes.' 
      }, { quoted: m })
    }
    
    // Cerrar el grupo (solo admins pueden enviar mensajes)
    await conn.groupSettingUpdate(m.chat, 'announcement')
    
    let closeMessage = `🔒 *GRUPO CERRADO*\n\n`
    closeMessage += `📱 *Grupo:* ${groupInfo.name}\n`
    closeMessage += `👑 *Cerrado por:* @${m.sender.split('@')[0]}\n`
    closeMessage += `📅 *Fecha:* ${new Date().toLocaleString('es-ES')}\n\n`
    closeMessage += `🔒 Solo los administradores pueden enviar mensajes ahora.\n`
    closeMessage += `📝 *Estado:* 🔒 Cerrado (Solo admins)`
    
    await conn.sendMessage(m.chat, { 
      text: closeMessage,
      mentions: [m.sender]
    }, { quoted: m })
    
    await m.react('🔒')
    
  } catch (error) {
    console.error('Error al cerrar grupo:', error)
    await conn.sendMessage(m.chat, { 
      text: '❌ No se pudo cerrar el grupo. Verifica que el bot tenga permisos de administrador.' 
    }, { quoted: m })
    await m.react('❌')
  }
}

handler.help = ['grupo']
handler.tags = ['group']
handler.command = ['grupo', 'group', 'controlgrupo']
handler.group = true

export default handler


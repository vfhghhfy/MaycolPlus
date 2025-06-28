let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    // Verificar si es grupo (compatible con @g.us y @lid)
    if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
        return conn.reply(m.chat, `${emoji2} Este comando solo funciona en grupos.`, m)
    }
    
    // Verificar permisos manualmente
    let isUserAdmin = false
    let isBotAdmin = false
    let isOwner = false
    
    // Verificar si es owner
    if (global.owner) {
        isOwner = global.owner.some(owner => {
            let ownerNumber = Array.isArray(owner) ? owner[0] : owner
            return ownerNumber === m.sender.split('@')[0]
        })
    }
    
    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        if (!groupMetadata || !groupMetadata.participants) {
            return conn.reply(m.chat, `${emoji2} No pude obtener información del grupo. Intenta de nuevo.`, m)
        }
        
        let participants = groupMetadata.participants
        
        // Verificar si el usuario es admin (o si es owner)
        if (!isOwner) {
            let userParticipant = participants.find(p => p.id === m.sender)
            if (userParticipant) {
                isUserAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
            }
        } else {
            isUserAdmin = true // Owner siempre puede usar el comando
        }
        
        // Verificar si el bot es admin
        let botJid = conn.user?.jid || conn.user?.id
        if (botJid) {
            let botParticipant = participants.find(p => p.id === botJid)
            if (botParticipant) {
                isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
            }
        }
        
        // Debug info
        console.log('=== DEBUG INVITE ===')
        console.log('Chat:', m.chat)
        console.log('User admin:', isUserAdmin)
        console.log('Bot admin:', isBotAdmin)
        console.log('Is owner:', isOwner)
        
    } catch (error) {
        console.error('Error verificando permisos:', error)
        return conn.reply(m.chat, `${emoji2} Error al verificar permisos del grupo.`, m)
    }
    
    // Verificar si el usuario puede usar el comando
    if (!isUserAdmin && !isOwner) {
        return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para generar enlaces de invitación.`, m)
    }
    
    // Validar número
    if (!text) {
        return conn.reply(m.chat, `${emoji} Por favor, ingrese el número al que quiere enviar una invitación al grupo.\n\n*Ejemplo:* ${usedPrefix}${command} 521234567890`, m)
    }
    
    if (text.includes('+')) {
        return conn.reply(m.chat, `${emoji2} Ingrese el número todo junto sin el *+*`, m)
    }
    
    if (isNaN(text)) {
        return conn.reply(m.chat, `${emoji2} Ingrese sólo números sin su código de país y sin espacios.`, m)
    }
    
    try {
        // Generar link de invitación
        let group = m.chat
        let inviteCode = await conn.groupInviteCode(group)
        let link = 'https://chat.whatsapp.com/' + inviteCode
        
        // Obtener info del grupo
        let groupMetadata = await conn.groupMetadata(group)
        let groupName = groupMetadata.subject || 'este grupo'
        
        // Mensaje de invitación personalizado
        let inviteMessage = `${emoji} *INVITACIÓN A GRUPO*\n\n` +
                           `👋 ¡Hola! Un usuario te invitó a unirte al grupo *${groupName}*\n\n` +
                           `🔗 *Enlace de invitación:*\n${link}\n\n` +
                           `💬 ¡Esperamos verte pronto en el grupo!`
        
        // Enviar invitación
        await conn.reply(text + '@s.whatsapp.net', inviteMessage, m, {
            mentions: [m.sender]
        })
        
        // Confirmar envío
        await conn.reply(m.chat, `${emoji} ✅ Se envió un enlace de invitación al número *${text}*\n\n📱 El usuario recibirá la invitación en su chat privado.`, m)
        
    } catch (error) {
        console.error('Error enviando invitación:', error)
        
        if (error.message?.includes('not-admin')) {
            return conn.reply(m.chat, `${emoji2} Error: El bot no tiene permisos de administrador para generar enlaces.`, m)
        } else if (error.message?.includes('forbidden')) {
            return conn.reply(m.chat, `${emoji2} Error: No se pudo enviar la invitación al número ${text}. Verifica que el número sea correcto.`, m)
        } else {
            return conn.reply(m.chat, `${emoji2} Error al enviar la invitación: ${error.message}`, m)
        }
    }
}

handler.help = ['invite *<número>*', 'add *<número>*']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir', 'invite', 'invitar']
// Removemos handler.group, handler.admin y handler.botAdmin
// Ya que manejamos todo manualmente

export default handler

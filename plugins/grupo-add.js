let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const emoji = '📩'
    const emoji2 = '⚠️'
    
    // Verificar si es grupo
    if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
        return conn.reply(m.chat, `${emoji2} Este comando solo funciona en grupos.`, m)
    }
    
    // Verificar permisos manualmente
    let isAdmin = false
    let isBotAdmin = false
    let isOwner = false
    
    // Verificar si es owner
    if (global.owner) {
        isOwner = global.owner.some(owner => {
            let ownerNumber = Array.isArray(owner) ? owner[0] : owner
            return ownerNumber === m.sender.split('@')[0]
        })
    }
    
    // Verificar admins del grupo
    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        if (groupMetadata && groupMetadata.participants) {
            let participants = groupMetadata.participants
            
            // Verificar si el usuario es admin
            let userParticipant = participants.find(p => p.id === m.sender)
            if (userParticipant) {
                isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
            }
            
            // Verificar si el bot es admin
            let botJid = conn.user?.jid || conn.user?.id
            if (botJid) {
                let botParticipant = participants.find(p => p.id === botJid)
                if (botParticipant) {
                    isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                }
            }
        }
    } catch (error) {
        console.error('Error verificando permisos del grupo:', error)
        return conn.reply(m.chat, `${emoji2} Error al verificar permisos. Intenta de nuevo.`, m)
    }
    
    // Verificar si el usuario puede usar el comando (admin o owner)
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return conn.reply(m.chat, `${emoji2} Necesito ser administrador del grupo para enviar invitaciones.`, m)
    }
    
    // Validar texto ingresado
    if (!text) {
        return conn.reply(m.chat, `${emoji} Por favor, ingrese el número al que quiere enviar una invitación al grupo.\n\n*Ejemplo:* ${usedPrefix}${command} 521234567890`, m)
    }
    
    if (text.includes('+')) {
        return conn.reply(m.chat, `${emoji2} Ingrese el número todo junto sin el *+*`, m)
    }
    
    if (isNaN(text)) {
        return conn.reply(m.chat, `${emoji2} Ingrese sólo números sin su código de país y sin espacios.`, m)
    }
    
    // Validar longitud del número
    if (text.length < 10 || text.length > 15) {
        return conn.reply(m.chat, `${emoji2} El número debe tener entre 10 y 15 dígitos.`, m)
    }
    
    try {
        // Obtener código de invitación del grupo
        let group = m.chat
        let inviteCode = await conn.groupInviteCode(group)
        let link = 'https://chat.whatsapp.com/' + inviteCode
        
        // Obtener información del grupo
        let groupMetadata = await conn.groupMetadata(group)
        let groupName = groupMetadata.subject || 'Grupo'
        
        // Mensaje de invitación
        let inviteMessage = `${emoji} *INVITACIÓN A GRUPO*\n\n` +
                           `👥 *Grupo:* ${groupName}\n` +
                           `👤 *Invitado por:* @${m.sender.split('@')[0]}\n` +
                           `🔗 *Enlace:* ${link}\n\n` +
                           `¡Te invitamos a unirte a nuestro grupo! 🎉`
        
        // Enviar invitación
        await conn.reply(text + '@s.whatsapp.net', inviteMessage, m, { 
            mentions: [m.sender] 
        })
        
        // Confirmar envío
        await conn.reply(m.chat, `${emoji} *Invitación enviada exitosamente*\n\n` +
                                `📱 *Número:* +${text}\n` +
                                `🔗 *Enlace:* ${link}\n` +
                                `👤 *Enviado por:* @${m.sender.split('@')[0]}`, m, {
            mentions: [m.sender]
        })
        
    } catch (error) {
        console.error('Error enviando invitación:', error)
        
        // Errores específicos
        if (error.message?.includes('invite')) {
            return conn.reply(m.chat, `${emoji2} Error al obtener el enlace de invitación. Verifica que tenga permisos de administrador.`, m)
        } else if (error.message?.includes('not-whatsapp-user')) {
            return conn.reply(m.chat, `${emoji2} El número +${text} no está registrado en WhatsApp.`, m)
        } else {
            return conn.reply(m.chat, `${emoji2} Error al enviar la invitación: ${error.message || 'Error desconocido'}`, m)
        }
    }
}

handler.help = ['invite *<numero>*', 'add *<numero>*']
handler.tags = ['group']
handler.command = ['add','agregar','añadir','invite','invitar']

export default handler

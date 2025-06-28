let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // Verificar si es grupo (funciona con @g.us y @lid)
    if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
        return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el número al que quiere enviar una invitación al grupo.`, m)
    if (text.includes('+')) return conn.reply(m.chat, `${emoji2} Ingrese el número todo junto sin el *+*`, m)
    if (isNaN(text)) return conn.reply(m.chat, `${emoji2} Ingrese sólo números sin su código de país y sin espacios.`, m)
    
    // Verificar permisos manualmente
    let isOwner = global.owner && global.owner.some(owner => {
        let ownerNumber = Array.isArray(owner) ? owner[0] : owner
        return ownerNumber === m.sender.split('@')[0]
    })
    
    let isAdmin = false
    let isBotAdmin = false
    
    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        if (!groupMetadata || !groupMetadata.participants) {
            return conn.reply(m.chat, '❌ No pude obtener información del grupo. Intenta de nuevo.', m)
        }
        
        let participants = groupMetadata.participants
        
        // Verificar si el usuario es admin
        if (!isOwner) {
            let userParticipant = participants.find(p => p.id === m.sender)
            if (userParticipant) {
                isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
            }
        }
        
        // Verificar si el bot es admin (múltiples formas de obtener el JID)
        let botJid = conn.user?.jid || conn.user?.id || conn.decodeJid?.(conn.user?.id) || conn.user?.number + '@s.whatsapp.net'
        
        // Debug para ver qué JID estamos usando
        console.log('=== DEBUG BOT ADMIN ===')
        console.log('Bot JID detectado:', botJid)
        console.log('Conn.user:', conn.user)
        
        // Buscar el bot en participantes de diferentes formas
        let botParticipant = participants.find(p => {
            console.log('Comparando:', p.id, 'con:', botJid)
            return p.id === botJid || 
                   p.id.includes(botJid.split('@')[0]) ||
                   botJid.includes(p.id.split('@')[0])
        })
        
        console.log('Bot participant encontrado:', botParticipant)
        
        if (botParticipant) {
            isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
            console.log('Bot es admin:', isBotAdmin, 'Nivel:', botParticipant.admin)
        } else {
            // Si no encontramos al bot, intentemos de otra forma
            console.log('No encontré bot participant, buscando por número...')
            if (conn.user?.number) {
                botParticipant = participants.find(p => p.id.includes(conn.user.number))
                if (botParticipant) {
                    isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                    console.log('Bot encontrado por número - es admin:', isBotAdmin)
                }
            }
        }
        
    } catch (error) {
        console.error('Error verificando permisos del grupo:', error)
        return conn.reply(m.chat, '❌ Error al verificar permisos. Intenta de nuevo.', m)
    }
    
    // Verificar si el usuario puede usar el comando
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
    }
    
    // Verificar si el bot es admin (con fallback si la detección falla)
    if (!isBotAdmin) {
        // Intentar generar el código como prueba
        try {
            await conn.groupInviteCode(group)
            // Si llegamos aquí, el bot SÍ es admin
            isBotAdmin = true
            console.log('Bot confirmado como admin mediante prueba de inviteCode')
        } catch (testError) {
            console.log('Bot confirmado NO admin - error:', testError.message)
            return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para generar enlaces de invitación.`, m)
        }
    }
    
    try {
        let group = m.chat
        let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
        
        // Formatear el número correctamente
        let targetNumber = text.trim()
        if (!targetNumber.includes('@')) {
            targetNumber = targetNumber + '@s.whatsapp.net'
        }
        
        // Enviar invitación
        await conn.reply(targetNumber, `${emoji} *INVITACIÓN A GRUPO*\n\nUn usuario te invitó a unirte a este grupo\n\n${link}`, m, {mentions: [m.sender]})
        
        // Confirmar envío
        await conn.reply(m.chat, `${emoji} Se envió un enlace de invitación al número *${text}*.`, m)
        
    } catch (error) {
        console.error('Error enviando invitación:', error)
        await conn.reply(m.chat, `${emoji2} No pude enviar la invitación. Verifica que el número sea válido.`, m)
    }
}

handler.help = ['invite *<521>*']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir', 'invite', 'invitar']
// Removemos handler.admin, handler.group, handler.botAdmin ya que lo manejamos manualmente

export default handler

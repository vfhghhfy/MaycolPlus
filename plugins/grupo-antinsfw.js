import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Verificar si es owner primero
    let isOwner = global.owner && global.owner.some(owner => {
        let ownerNumber = Array.isArray(owner) ? owner[0] : owner
        return ownerNumber === m.sender.split('@')[0]
    })
    
    let isAdmin = false
    
    // Si es owner, no necesita ser admin
    if (!isOwner) {
        // Verificar si es grupo (funciona con @g.us y @lid)
        if (!m.chat.includes('@g.us') && !m.chat.includes('@lid')) {
            return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
        }
        
        try {
            let groupMetadata = await conn.groupMetadata(m.chat)
            if (!groupMetadata || !groupMetadata.participants) {
                return conn.reply(m.chat, '❌ No pude obtener información del grupo. Intenta de nuevo.', m)
            }
            
            // Debug: mostrar información
            console.log('=== DEBUG ADMIN ===')
            console.log('Chat ID:', m.chat)
            console.log('Sender:', m.sender)
            console.log('Participants count:', groupMetadata.participants.length)
            
            let participants = groupMetadata.participants
            let userParticipant = participants.find(p => p.id === m.sender)
            
            console.log('User participant found:', userParticipant)
            
            if (userParticipant) {
                isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                console.log('Is admin:', isAdmin, 'Admin level:', userParticipant.admin)
            }
            
        } catch (error) {
            console.error('Error obteniendo metadata del grupo:', error)
            return conn.reply(m.chat, '❌ Error al verificar permisos. Intenta de nuevo.', m)
        }
    }
    
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, '❌ Solo los administradores del grupo o el owner pueden usar este comando.', m)
    }
    
    let chat = global.db.data.chats[m.chat]
    if (!chat) {
        global.db.data.chats[m.chat] = {}
        chat = global.db.data.chats[m.chat]
    }
    
    let action = args[0]?.toLowerCase()
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return conn.reply(m.chat, `📋 *Uso del comando:*\n\n• ${usedPrefix}${command} on - Activar anti-NSFW\n• ${usedPrefix}${command} off - Desactivar anti-NSFW\n\n*Estado actual:* ${chat.antiNsfw ? '✅ Activado' : '❌ Desactivado'}`, m)
    }
    
    if (action === 'on') {
        if (chat.antiNsfw) {
            return conn.reply(m.chat, '⚠️ El sistema anti-NSFW ya está activado en este grupo.', m)
        }
        
        chat.antiNsfw = true
        await conn.reply(m.chat, `✅ *Sistema Anti-NSFW Activado*\n\n🔒 Se eliminaran automáticamente:\n• Imágenes NSFW (>50%)\n• Mensajes con contenido +18\n• Stickers inapropiados\n\n⚡ Sistema activo para mantener el grupo seguro.`, m)
        
    } else if (action === 'off') {
        if (!chat.antiNsfw) {
            return conn.reply(m.chat, '⚠️ El sistema anti-NSFW ya está desactivado en este grupo.', m)
        }
        
        chat.antiNsfw = false
        await conn.reply(m.chat, '❌ *Sistema Anti-NSFW Desactivado*\n\nEl bot ya no filtrará contenido NSFW en este grupo.', m)
    }
}

handler.help = ['antinsfw']
handler.tags = ['group']
handler.command = ['antinsfw']

export default handler

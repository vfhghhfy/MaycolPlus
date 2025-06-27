import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Verificar si es admin del grupo manualmente (sin usar handler.admin)
    let groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) {
        return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    let participants = groupMetadata.participants
    let isAdmin = participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'))
    let isOwner = global.owner.some(owner => owner[0] === m.sender.split('@')[0])
    
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, '❌ Solo los administradores del grupo pueden usar este comando.', m)
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

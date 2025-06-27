import stringSimilarity from 'string-similarity'
import fetch from 'node-fetch'

export async function before(m) {
    // Sistema Anti-NSFW
    if (m.chat && global.db.data.chats && global.db.data.chats[m.chat]?.antiNsfw) {
        await detectarNSFW(m, this)
    }
    
    // Resto del código original para comandos
    if (!m.text || !global.prefix.test(m.text)) return

    const usedPrefix = global.prefix.exec(m.text)[0]
    const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()

    if (!command || command === 'bot') return

    const allCommands = Object.values(global.plugins)
        .flatMap(plugin => Array.isArray(plugin.command) ? plugin.command : [plugin.command])
        .filter(Boolean)
        .map(cmd => typeof cmd === 'string' ? cmd : (cmd instanceof RegExp ? cmd.source : null))
        .filter(cmd => typeof cmd === 'string')

    const exists = allCommands.includes(command)

    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]

    // ⚡ Detecta comandos en mantenimiento
    global.comandosEnMantenimiento = global.comandosEnMantenimiento || []

    if (global.comandosEnMantenimiento.includes(command)) {
        const mensaje = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」\n│\n├─ El hechizo *${usedPrefix}${command}* está en *mantenimiento*.\n│\n├─ Vuelve a intentarlo más tarde~\n╰─✦`
        await m.reply(mensaje)
        return
    }

    if (!exists) {
        const { bestMatch } = stringSimilarity.findBestMatch(command, allCommands)
        const suggestion = bestMatch.rating > 0.3 ? `¿Quisiste decir *${usedPrefix}${bestMatch.target}*?` : ''

        const mensaje = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」\n│\n├─ El hechizo *${usedPrefix}${command}* no existe en los registros del más allá.\n│\n├─ ${suggestion || 'Consulta los conjuros disponibles con:'}\n│   ⇝ *${usedPrefix}help*\n╰─✦`    
        await m.reply(mensaje)    
        return
    }

    if (chat?.isBanned) {
        const avisoDesactivado = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」\n│\n├─ El poder de Hanako ha sido *sellado* en este grupo.\n│\n├─ Invoca su regreso con:\n│   ⇝ *${usedPrefix}bot on*\n╰─✦`
        await m.reply(avisoDesactivado)
        return
    }

    if (!user.commands) user.commands = 0
    user.commands += 1
}

// 🔞 Sistema Anti-NSFW
async function detectarNSFW(m, conn) {
    try {
        let isAdmin = false
        let isBotAdmin = false
        
        // Verificar si el usuario es admin (manualmente para evitar @lid)
        if (m.chat.includes('@g.us') || m.chat.includes('@lid')) {
            try {
                let groupMetadata = await conn.groupMetadata(m.chat)
                if (groupMetadata && groupMetadata.participants) {
                    let participants = groupMetadata.participants
                    
                    // Verificar si el usuario es admin
                    let userParticipant = participants.find(p => p.id === m.sender)
                    if (userParticipant) {
                        isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                    }
                    
                    // Verificar si el bot es admin (múltiples métodos para JID)
                    let botJid = conn.user?.jid || conn.user?.id || conn.decodeJid?.(conn.user?.id)
                    
                    // Debug del bot JID
                    console.log('=== DEBUG BOT ADMIN ===')
                    console.log('Bot JID methods:', {
                        'conn.user?.jid': conn.user?.jid,
                        'conn.user?.id': conn.user?.id,
                        'conn.decodeJid': conn.decodeJid?.(conn.user?.id)
                    })
                    
                    if (botJid) {
                        // Buscar bot en participantes (puede tener variaciones en el JID)
                        let botParticipant = participants.find(p => {
                            return p.id === botJid || 
                                   p.id.split('@')[0] === botJid.split('@')[0] ||
                                   p.id.includes(botJid.split('@')[0])
                        })
                        
                        console.log('Bot participant found:', botParticipant)
                        console.log('All participants JIDs:', participants.map(p => p.id))
                        
                        if (botParticipant) {
                            isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                            console.log('Bot is admin:', isBotAdmin, 'Admin level:', botParticipant.admin)
                        } else {
                            console.log('Bot participant not found in group')
                        }
                    }
                }
            } catch (e) {
                console.log('Error verificando admins:', e.message)
            }
        }
        
        // También verificar si es owner
        if (!isAdmin && global.owner) {
            isAdmin = global.owner.some(owner => {
                let ownerNumber = Array.isArray(owner) ? owner[0] : owner
                return ownerNumber === m.sender.split('@')[0]
            })
        }
        
        // Lista de palabras NSFW
        const palabrasNSFW = [
            'porno', 'porn', 'xxx', 'sexo', 'sex', 'pene', 'vagina', 'masturbacion', 
            'masturbar', 'coger', 'follar', 'fuck', 'shit', 'bitch', 'puta', 'puto',
            'verga', 'chupar', 'mamar', 'correrse', 'venirse', 'orgasmo', 'cum',
            'pussy', 'dick', 'cock', 'ass', 'culo', 'tetas', 'boobs', 'nude',
            'desnudo', 'desnuda', 'caliente', 'horny', 'cachondo', 'excitado',
            'placer', 'gemir', 'penetrar', 'chuparla', 'mamada', 'oral',
            'anal', 'threesome', 'orgia', 'prostituta', 'escort', 'webcam',
            'onlyfans', 'pack', 'nudes', 'hot', 'sexy', 'sensual'
        ]
        
        // 1. Detectar texto NSFW
        if (m.text) {
            const textoLower = m.text.toLowerCase()
            const tieneNSFW = palabrasNSFW.some(palabra => textoLower.includes(palabra))
            
            if (tieneNSFW && !isAdmin) {
                await eliminarMensaje(m, conn, isBotAdmin, '🔞 Contenido inapropiado detectado en texto')
                return
            }
        }
        
        // 2. Detectar imágenes NSFW
        if (m.mtype === 'imageMessage' && m.message?.imageMessage) {
            await detectarImagenNSFW(m, conn, isAdmin, isBotAdmin)
        }
        
        // 3. Detectar stickers NSFW
        if (m.mtype === 'stickerMessage' && m.message?.stickerMessage) {
            // Los stickers también pueden ser imágenes
            await detectarImagenNSFW(m, conn, isAdmin, isBotAdmin, 'sticker')
        }
        
    } catch (error) {
        console.error('Error en sistema anti-NSFW:', error)
    }
}

async function detectarImagenNSFW(m, conn, isAdmin, isBotAdmin, tipo = 'imagen') {
    if (isAdmin) return // Los admins pueden enviar lo que quieran
    
    try {
        // Descargar la imagen
        let buffer = await m.download()
        if (!buffer) return
        
        // Convertir a base64 para la API
        let base64 = buffer.toString('base64')
        let dataUrl = `data:image/jpeg;base64,${base64}`
        
        // Hacer petición a la API
        const response = await fetch(`https://delirius-apiofc.vercel.app/tools/checknsfw?image=${encodeURIComponent(dataUrl)}`)
        const data = await response.json()
        
        if (data.status && data.data) {
            const porcentaje = parseFloat(data.data.percentage)
            const esNSFW = data.data.NSFW && porcentaje > 50
            
            if (esNSFW) {
                const mensaje = `🔞 ${tipo === 'sticker' ? 'Sticker' : 'Imagen'} NSFW detectada (${data.data.percentage})`
                await eliminarMensaje(m, conn, isBotAdmin, mensaje)
                
                // Mensaje adicional con detalles
                const detalles = `⚠️ *Contenido inapropiado removido*\n\n` +
                              `📊 *Análisis:*\n` +
                              `• Nivel NSFW: ${data.data.percentage}\n` +
                              `• Estado: ${data.data.safe ? 'Seguro' : 'No seguro'}\n` +
                              `• Tipo: ${tipo === 'sticker' ? 'Sticker' : 'Imagen'}\n\n` +
                              `${data.data.response || 'Contenido no apropiado para el grupo.'}`
                
                await conn.reply(m.chat, detalles, m)
            }
        }
        
    } catch (error) {
        console.error('Error detectando imagen NSFW:', error)
    }
}

async function eliminarMensaje(m, conn, isBotAdmin, razon) {
    try {
        console.log('=== ELIMINANDO MENSAJE ===')
        console.log('isBotAdmin:', isBotAdmin)
        console.log('Message key:', m.key)
        
        // Intentar eliminar el mensaje si el bot es admin
        if (isBotAdmin) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key })
                console.log('✅ Mensaje eliminado exitosamente')
            } catch (deleteError) {
                console.error('❌ Error eliminando mensaje:', deleteError)
                // Intentar método alternativo
                try {
                    await conn.deleteMessage(m.chat, m.key)
                    console.log('✅ Mensaje eliminado con método alternativo')
                } catch (altError) {
                    console.error('❌ Error con método alternativo:', altError)
                    isBotAdmin = false // Marcar como no admin si no puede eliminar
                }
            }
        }
        
        // Mensaje de advertencia
        const advertencia = `🚫 *Mensaje eliminado*\n\n` +
                          `👤 *Usuario:* @${m.sender.split('@')[0]}\n` +
                          `⚠️ *Razón:* ${razon}\n` +
                          `📝 *Nota:* ${isBotAdmin ? 'Mensaje eliminado exitosamente' : 'No pude eliminar el mensaje (verificar permisos de bot)'}`
        
        await conn.reply(m.chat, advertencia, m, { mentions: [m.sender] })
        
    } catch (error) {
        console.error('Error eliminando mensaje:', error)
        await conn.reply(m.chat, `❌ Error al procesar: ${razon}`, m)
    }
}

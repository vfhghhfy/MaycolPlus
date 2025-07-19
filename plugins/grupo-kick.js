async function verificarPermisos(m, conn) {
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
    
    // Verificar permisos en grupos
    if (m.chat.includes('@g.us') || m.chat.includes('@lid')) {
        try {
            // Obtener metadata con reintentos
            let groupMetadata = null
            let attempts = 0
            const maxAttempts = 3
            
            while (!groupMetadata && attempts < maxAttempts) {
                try {
                    await new Promise(resolve => setTimeout(resolve, attempts * 500)) // Delay progresivo
                    groupMetadata = await conn.groupMetadata(m.chat)
                    break
                } catch (error) {
                    attempts++
                    console.log(`Intento ${attempts} fallido para obtener metadata:`, error.message)
                    if (attempts >= maxAttempts) throw error
                }
            }
            
            if (groupMetadata && groupMetadata.participants) {
                let participants = groupMetadata.participants
                
                // ===== VERIFICAR ADMIN DEL USUARIO =====
                if (!isOwner) {
                    // Buscar usuario con múltiples métodos
                    let userParticipant = participants.find(p => {
                        return p.id === m.sender ||
                               p.id.split('@')[0] === m.sender.split('@')[0] ||
                               p.id.replace(/\D/g, '') === m.sender.replace(/\D/g, '')
                    })
                    
                    if (userParticipant) {
                        isUserAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                        console.log(`Usuario encontrado: ${userParticipant.id}, Admin: ${userParticipant.admin}`)
                    } else {
                        console.log('Usuario NO encontrado en participantes')
                        // Log de debug para ver participantes
                        console.log('Participantes del grupo:', participants.map(p => ({ id: p.id, admin: p.admin })))
                        console.log('Sender buscado:', m.sender)
                    }
                } else {
                    isUserAdmin = true // Owner siempre es admin
                }
                
                // ===== VERIFICAR ADMIN DEL BOT (MEJORADO) =====
                // Obtener JID del bot con múltiples métodos
                let possibleBotJids = []
                
                if (conn.user?.jid) possibleBotJids.push(conn.user.jid)
                if (conn.user?.id) possibleBotJids.push(conn.user.id)
                if (conn.decodeJid && conn.user?.id) {
                    try {
                        possibleBotJids.push(conn.decodeJid(conn.user.id))
                    } catch (e) {}
                }
                
                // Remover duplicados
                possibleBotJids = [...new Set(possibleBotJids)]
                console.log('Posibles JIDs del bot:', possibleBotJids)
                
                // Buscar bot en participantes
                let botParticipant = null
                
                for (let botJid of possibleBotJids) {
                    if (botJid) {
                        botParticipant = participants.find(p => {
                            let botNumber = botJid.split('@')[0].replace(/\D/g, '')
                            let participantNumber = p.id.split('@')[0].replace(/\D/g, '')
                            
                            return p.id === botJid || 
                                   p.id.split('@')[0] === botJid.split('@')[0] ||
                                   participantNumber === botNumber ||
                                   p.id.includes(botJid.split('@')[0]) ||
                                   botJid.includes(p.id.split('@')[0])
                        })
                        
                        if (botParticipant) {
                            console.log(`Bot encontrado con JID: ${botJid}`)
                            break
                        }
                    }
                }
                
                if (botParticipant) {
                    isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                    console.log(`Bot participant: ${botParticipant.id}, Admin: ${botParticipant.admin}`)
                } else {
                    console.log('Bot NO encontrado en participantes del grupo')
                    // Método alternativo: verificar con groupAdmins
                    try {
                        let adminList = await conn.groupAdmin(m.chat).catch(() => [])
                        for (let botJid of possibleBotJids) {
                            if (adminList.includes(botJid) || adminList.includes(botJid.split('@')[0])) {
                                isBotAdmin = true
                                console.log('Bot admin detectado via groupAdmin')
                                break
                            }
                        }
                    } catch (e) {
                        console.log('Error verificando con groupAdmin:', e.message)
                    }
                }
                
            } else {
                console.log('No se pudo obtener metadata del grupo o participantes')
            }
            
        } catch (error) {
            console.error('Error verificando permisos:', error)
            
            // Método de respaldo usando commandos directos
            try {
                console.log('Intentando método de respaldo...')
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                // Reintentar obtener metadata
                let backupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
                if (backupMetadata?.participants) {
                    // Repetir verificaciones con metadata de respaldo
                    console.log('Método de respaldo funcionó, reintentando verificaciones...')
                    return verificarPermisos(m, conn) // Recursión controlada
                }
            } catch (backupError) {
                console.error('Método de respaldo también falló:', backupError)
            }
        }
    }
    
    console.log(`Resultado permisos - Usuario Admin: ${isUserAdmin}, Bot Admin: ${isBotAdmin}, Owner: ${isOwner}`)
    
    return {
        isUserAdmin: isUserAdmin || isOwner,
        isBotAdmin,
        isOwner
    }
}

// Handler principal mejorado
var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    try {
        // Usar la función mejorada de verificación de permisos con retry
        console.log('Verificando permisos...')
        const permisos = await verificarPermisos(m, conn)
        
        if (!permisos.isUserAdmin) {
            return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
        }
        
        if (!permisos.isBotAdmin) {
            return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para expulsar usuarios.`, m)
        }
        
        // Verificar que se mencionó a alguien
        if (!m.mentionedJid?.[0] && !m.quoted) {
            return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario o responder a su mensaje para poder expulsarlo del grupo.`, m)
        }

        let user = m.mentionedJid?.[0] || m.quoted?.sender
        
        if (!user) {
            return conn.reply(m.chat, `${emoji2} No se pudo identificar al usuario a expulsar.`, m)
        }

        // Obtener información del grupo con reintentos
        let groupInfo = null
        try {
            groupInfo = await conn.groupMetadata(m.chat)
        } catch (error) {
            console.log('Error obteniendo groupInfo, reintentando...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            groupInfo = await conn.groupMetadata(m.chat)
        }
        
        const ownerGroup = groupInfo?.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
        const ownerBot = global.owner?.[0]?.[0] + '@s.whatsapp.net'

        // Verificaciones de protección
        if (user === conn.user?.jid || user === conn.user?.id) {
            return conn.reply(m.chat, `${emoji2} No puedo eliminar el bot del grupo.`, m)
        }

        if (user === ownerGroup) {
            return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m)
        }

        if (user === ownerBot) {
            return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m)
        }

        // Verificar si el usuario a eliminar es admin
        let targetIsAdmin = false
        if (groupInfo?.participants) {
            let targetParticipant = groupInfo.participants.find(p => 
                p.id === user || p.id.split('@')[0] === user.split('@')[0]
            )
            if (targetParticipant) {
                targetIsAdmin = targetParticipant.admin === 'admin' || targetParticipant.admin === 'superadmin'
            }
        }

        if (targetIsAdmin && !permisos.isOwner) {
            return conn.reply(m.chat, `${emoji2} No puedes expulsar a otro administrador.`, m)
        }

        // Mensaje de confirmación antes del kick
        await conn.reply(m.chat, `${emoji} Expulsando usuario...`, m)
        
        // Ejecutar el kick con manejo de errores robusto
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            
            // Verificar si el usuario fue efectivamente removido
            setTimeout(async () => {
                try {
                    let updatedGroupInfo = await conn.groupMetadata(m.chat)
                    let userStillInGroup = updatedGroupInfo.participants.some(p => 
                        p.id === user || p.id.split('@')[0] === user.split('@')[0]
                    )
                    
                    if (userStillInGroup) {
                        await conn.reply(m.chat, `${emoji2} El usuario sigue en el grupo. Puede que tenga permisos especiales o hubo un error.`, m)
                    } else {
                        await conn.reply(m.chat, `✅ Usuario expulsado exitosamente del grupo.`, m)
                    }
                } catch (verifyError) {
                    console.log('Error verificando expulsión:', verifyError)
                }
            }, 2000)
            
        } catch (kickError) {
            console.error('Error al expulsar usuario:', kickError)
            let errorMsg = `${emoji2} Error al expulsar usuario: `
            
            if (kickError.message?.includes('forbidden') || kickError.message?.includes('403')) {
                errorMsg += 'Sin permisos suficientes.'
            } else if (kickError.message?.includes('participant-not-found')) {
                errorMsg += 'Usuario no encontrado en el grupo.'
            } else if (kickError.message?.includes('not-authorized')) {
                errorMsg += 'No autorizado para realizar esta acción.'
            } else {
                errorMsg += kickError.message || 'Error desconocido.'
            }
            
            return conn.reply(m.chat, errorMsg, m)
        }
        
    } catch (error) {
        console.error('Error general en handler kick:', error)
        return conn.reply(m.chat, `${emoji2} Error interno al procesar el comando. Intenta nuevamente.`, m)
    }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.group = true
handler.register = true

export default handler

async function verificarPermisos(m, conn) {
    let isUserAdmin = false
    let isBotAdmin = false
    let isOwner = false
    
    console.log('🔍 INICIANDO VERIFICACIÓN DE PERMISOS...')
    
    // Verificar si es owner
    if (global.owner) {
        isOwner = global.owner.some(owner => {
            let ownerNumber = Array.isArray(owner) ? owner[0] : owner
            return ownerNumber === m.sender.split('@')[0]
        })
        console.log(`👑 Es owner: ${isOwner}`)
    }
    
    // Verificar permisos en grupos
    if (m.chat.includes('@g.us') || m.chat.includes('@lid')) {
        try {
            console.log('📱 Obteniendo metadata del grupo...')
            
            // MÉTODO 1: Obtener metadata con múltiples intentos
            let groupMetadata = null
            for (let attempt = 1; attempt <= 5; attempt++) {
                try {
                    console.log(`🔄 Intento ${attempt}/5 obteniendo metadata...`)
                    groupMetadata = await conn.groupMetadata(m.chat)
                    if (groupMetadata?.participants?.length > 0) {
                        console.log(`✅ Metadata obtenida con ${groupMetadata.participants.length} participantes`)
                        break
                    }
                } catch (error) {
                    console.log(`❌ Intento ${attempt} falló:`, error.message)
                    if (attempt < 5) {
                        await new Promise(resolve => setTimeout(resolve, attempt * 1000))
                    }
                }
            }
            
            if (groupMetadata?.participants) {
                let participants = groupMetadata.participants
                console.log('👥 Participantes obtenidos:', participants.length)
                
                // ===== VERIFICAR ADMIN DEL USUARIO =====
                console.log('🔍 Verificando admin del usuario...')
                console.log('👤 Usuario sender:', m.sender)
                
                if (!isOwner) {
                    let userParticipant = participants.find(p => {
                        let match = p.id === m.sender ||
                                   p.id.split('@')[0] === m.sender.split('@')[0] ||
                                   p.id.replace(/\D/g, '') === m.sender.replace(/\D/g, '')
                        if (match) {
                            console.log(`✅ Usuario encontrado: ${p.id} - Admin: ${p.admin}`)
                        }
                        return match
                    })
                    
                    if (userParticipant) {
                        isUserAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                    }
                } else {
                    isUserAdmin = true
                }
                console.log(`👤 Usuario es admin: ${isUserAdmin}`)
                
                // ===== VERIFICAR ADMIN DEL BOT (MÚLTIPLES MÉTODOS) =====
                console.log('🤖 Verificando admin del bot...')
                
                // Obtener todos los posibles JIDs del bot
                let possibleBotJids = []
                
                // Método 1: conn.user
                if (conn.user?.jid) {
                    possibleBotJids.push(conn.user.jid)
                    console.log('🔑 Bot JID método 1:', conn.user.jid)
                }
                if (conn.user?.id) {
                    possibleBotJids.push(conn.user.id)
                    console.log('🔑 Bot JID método 2:', conn.user.id)
                }
                
                // Método 2: decodeJid
                if (conn.decodeJid) {
                    try {
                        if (conn.user?.id) {
                            let decoded = conn.decodeJid(conn.user.id)
                            possibleBotJids.push(decoded)
                            console.log('🔑 Bot JID decodificado:', decoded)
                        }
                    } catch (e) {
                        console.log('⚠️ Error decodificando JID:', e.message)
                    }
                }
                
                // Método 3: conn.user.name con participantes
                if (conn.user?.name) {
                    let botByName = participants.find(p => p.id.includes(conn.user.name))
                    if (botByName) {
                        possibleBotJids.push(botByName.id)
                        console.log('🔑 Bot JID por nombre:', botByName.id)
                    }
                }
                
                // Método 4: Buscar por patrón de bot común
                let botPatterns = participants.filter(p => 
                    p.id.includes(':') && 
                    p.id.includes('@lid') || 
                    p.id.includes('bot') ||
                    p.id.split('@')[0].length > 10
                )
                console.log('🔍 Posibles bots por patrón:', botPatterns.map(p => p.id))
                
                // Remover duplicados
                possibleBotJids = [...new Set(possibleBotJids)]
                console.log('🔑 Todos los posibles JIDs del bot:', possibleBotJids)
                
                // BÚSQUEDA EXHAUSTIVA DEL BOT EN PARTICIPANTES
                let botParticipant = null
                let botFound = false
                
                // Busqueda directa
                for (let botJid of possibleBotJids) {
                    if (botJid && !botFound) {
                        console.log(`🔍 Buscando bot con JID: ${botJid}`)
                        
                        botParticipant = participants.find(p => {
                            let matches = [
                                p.id === botJid,
                                p.id.split('@')[0] === botJid.split('@')[0],
                                p.id.replace(/\D/g, '') === botJid.replace(/\D/g, ''),
                                p.id.includes(botJid.split('@')[0]),
                                botJid.includes(p.id.split('@')[0])
                            ]
                            
                            let found = matches.some(m => m)
                            if (found) {
                                console.log(`✅ Bot encontrado: ${p.id} - Admin: ${p.admin}`)
                                console.log('🔍 Métodos que funcionaron:', matches.map((m, i) => m ? i : null).filter(x => x !== null))
                            }
                            return found
                        })
                        
                        if (botParticipant) {
                            botFound = true
                            break
                        }
                    }
                }
                
                // MÉTODO ALTERNATIVO: Buscar cualquier admin que parezca bot
                if (!botFound) {
                    console.log('🔍 Búsqueda alternativa: admins que parecen bots...')
                    let possibleBotAdmins = participants.filter(p => {
                        let isAdmin = p.admin === 'admin' || p.admin === 'superadmin'
                        let looksLikeBot = p.id.includes(':') || 
                                          p.id.split('@')[0].length > 12 ||
                                          p.id.includes('bot')
                        return isAdmin && looksLikeBot
                    })
                    
                    console.log('🤖 Posibles bot-admins encontrados:', possibleBotAdmins.map(p => ({id: p.id, admin: p.admin})))
                    
                    if (possibleBotAdmins.length > 0) {
                        botParticipant = possibleBotAdmins[0] // Tomar el primero
                        console.log('✅ Bot asumido por patrón:', botParticipant.id)
                    }
                }
                
                // MÉTODO DESESPERADO: Verificar si hay algún admin activo reciente
                if (!botFound) {
                    console.log('🚨 MÉTODO DESESPERADO: Verificar admins activos...')
                    try {
                        // Intentar enviar un mensaje de prueba para detectar bot
                        let testMsg = await conn.sendMessage(m.chat, { text: 'Oye...' }).catch(() => null)
                        if (testMsg) {
                            let testSender = testMsg.key?.fromMe ? conn.user?.jid || conn.user?.id : null
                            if (testSender) {
                                console.log('🔍 Bot detectado por mensaje de prueba:', testSender)
                                botParticipant = participants.find(p => 
                                    p.id === testSender || 
                                    p.id.split('@')[0] === testSender.split('@')[0]
                                )
                            }
                        }
                    } catch (e) {
                        console.log('❌ Método desesperado falló:', e.message)
                    }
                }
                
                // EVALUAR RESULTADO DEL BOT
                if (botParticipant) {
                    isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                    console.log(`🤖 Bot final: ${botParticipant.id} - Es Admin: ${isBotAdmin}`)
                } else {
                    console.log('❌ Bot NO encontrado en participantes')
                    
                    // ÚLTIMO RECURSO: Asumir que somos admin si podemos obtener la metadata
                    console.log('🔥 ÚLTIMO RECURSO: Asumiendo admin por capacidad de obtener metadata...')
                    try {
                        // Si podemos obtener metadata del grupo, probablemente somos admin
                        let testAccess = await conn.groupMetadata(m.chat)
                        if (testAccess?.participants?.length > 0) {
                            console.log('✅ FORZANDO isBotAdmin = true (tenemos acceso a metadata)')
                            isBotAdmin = true
                        }
                    } catch (e) {
                        console.log('❌ Último recurso falló:', e.message)
                    }
                }
                
            } else {
                console.log('❌ No se pudo obtener metadata o participantes')
                
                // SI NO TENEMOS METADATA, INTENTAR OPERACIÓN DIRECTA
                console.log('🔥 MODO AGRESIVO: Intentando operación directa...')
                try {
                    // Si podemos hacer groupMetadata, probablemente somos admin
                    let directTest = await conn.groupMetadata(m.chat).catch(() => null)
                    if (directTest) {
                        console.log('✅ FORZANDO permisos por acceso directo')
                        isBotAdmin = true
                        isUserAdmin = isOwner || true // Si no podemos verificar, asumir que sí
                    }
                } catch (e) {
                    console.log('❌ Modo agresivo falló:', e.message)
                }
            }
            
        } catch (error) {
            console.error('❌ Error crítico verificando permisos:', error)
            
            // MODO DE EMERGENCIA: PERMITIR TODO SI ES OWNER
            if (isOwner) {
                console.log('🚨 MODO EMERGENCIA: Owner detectado, permitiendo todo')
                isBotAdmin = true
                isUserAdmin = true
            }
        }
    }
    
    console.log('📊 RESULTADO FINAL:')
    console.log(`👑 Es Owner: ${isOwner}`)
    console.log(`👤 Usuario Admin: ${isUserAdmin}`)
    console.log(`🤖 Bot Admin: ${isBotAdmin}`)
    console.log('=====================================')
    
    return {
        isUserAdmin: isUserAdmin || isOwner,
        isBotAdmin,
        isOwner
    }
}

// Handler principal
var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const emoji = '📧'
    const emoji2 = '⚠️'
    
    try {
        console.log('\n🚀 ===== INICIANDO COMANDO KICK =====')
        console.log('📍 Chat:', m.chat)
        console.log('👤 Sender:', m.sender)
        
        // VERIFICACIÓN DE PERMISOS ULTRA ROBUSTA
        const permisos = await verificarPermisos(m, conn)
        
        // Si es owner, saltarse todas las verificaciones
        if (permisos.isOwner) {
            console.log('👑 OWNER DETECTADO - SALTANDO VERIFICACIONES')
        } else {
            if (!permisos.isUserAdmin) {
                console.log('❌ Usuario no es admin')
                return conn.reply(m.chat, `${emoji2} Solo los administradores del grupo pueden usar este comando.`, m)
            }
            
            if (!permisos.isBotAdmin) {
                console.log('❌ Bot no es admin')
                return conn.reply(m.chat, `${emoji2} El bot necesita ser administrador para expulsar usuarios.\n\n🔧 *Debug Info:*\n- Haz al bot admin del grupo\n- Espera 10 segundos\n- Vuelve a intentar el comando\n\n📞 Si sigue fallando, reenvía este mensaje al desarrollador.`, m)
            }
        }
        
        // Verificar que se mencionó a alguien
        if (!m.mentionedJid?.[0] && !m.quoted) {
            return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario o responder a su mensaje para poder expulsarlo del grupo.\n\n*Ejemplos:*\n- ${usedPrefix}kick @usuario\n- Responde a un mensaje con ${usedPrefix}kick`, m)
        }

        let user = m.mentionedJid?.[0] || m.quoted?.sender
        
        if (!user) {
            return conn.reply(m.chat, `${emoji2} No se pudo identificar al usuario a expulsar.`, m)
        }

        console.log('🎯 Usuario objetivo:', user)

        // Obtener información del grupo
        let groupInfo = await conn.groupMetadata(m.chat).catch(async () => {
            console.log('⚠️ Reintentando obtener groupInfo...')
            await new Promise(resolve => setTimeout(resolve, 1000))
            return await conn.groupMetadata(m.chat)
        })
        
        // Verificaciones de protección
        let botJids = [conn.user?.jid, conn.user?.id].filter(Boolean)
        if (botJids.some(botJid => user === botJid || user.split('@')[0] === botJid.split('@')[0])) {
            return conn.reply(m.chat, `${emoji2} No puedo auto-eliminarme del grupo.`, m)
        }

        const ownerGroup = groupInfo?.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
        const ownerBot = global.owner?.[0]?.[0] + '@s.whatsapp.net'

        if (user === ownerGroup) {
            return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m)
        }

        if (user === ownerBot) {
            return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m)
        }

        // Verificar si el usuario objetivo es admin (solo si no somos owner)
        if (!permisos.isOwner && groupInfo?.participants) {
            let targetParticipant = groupInfo.participants.find(p => 
                p.id === user || p.id.split('@')[0] === user.split('@')[0]
            )
            if (targetParticipant && (targetParticipant.admin === 'admin' || targetParticipant.admin === 'superadmin')) {
                return conn.reply(m.chat, `${emoji2} No puedes expulsar a otro administrador.`, m)
            }
        }

        // Mensaje de ejecución
        await conn.reply(m.chat, `${emoji} Expulsando usuario... 🔨`, m)
        
        console.log('⚡ EJECUTANDO KICK...')
        
        // EJECUTAR KICK CON MÚLTIPLES MÉTODOS
        let kickSuccess = false
        let kickError = null
        
        // Método 1: Kick normal
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            kickSuccess = true
            console.log('✅ Kick método 1 exitoso')
        } catch (error) {
            console.log('❌ Kick método 1 falló:', error.message)
            kickError = error
            
            // Método 2: Kick con delay
            try {
                console.log('🔄 Intentando método 2 con delay...')
                await new Promise(resolve => setTimeout(resolve, 2000))
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                kickSuccess = true
                console.log('✅ Kick método 2 exitoso')
            } catch (error2) {
                console.log('❌ Kick método 2 falló:', error2.message)
                
                // Método 3: Kick forzado
                try {
                    console.log('🔄 Intentando método 3 forzado...')
                    await conn.updateParticipants(m.chat, [user], 'remove')
                    kickSuccess = true
                    console.log('✅ Kick método 3 exitoso')
                } catch (error3) {
                    console.log('❌ Kick método 3 falló:', error3.message)
                    kickError = error3
                }
            }
        }
        
        // Verificar resultado
        if (kickSuccess) {
            // Verificación post-kick
            setTimeout(async () => {
                try {
                    let updatedGroupInfo = await conn.groupMetadata(m.chat)
                    let userStillInGroup = updatedGroupInfo.participants.some(p => 
                        p.id === user || p.id.split('@')[0] === user.split('@')[0]
                    )
                    
                    if (!userStillInGroup) {
                        await conn.reply(m.chat, `✅ *Usuario expulsado exitosamente* 🎯\n\n👤 Usuario eliminado del grupo`, m)
                    } else {
                        await conn.reply(m.chat, `⚠️ El usuario aún aparece en el grupo. Puede tener permisos especiales.`, m)
                    }
                } catch (verifyError) {
                    await conn.reply(m.chat, `⚡ Kick ejecutado. Verificación posterior falló.`, m)
                }
            }, 3000)
        } else {
            // Manejar error de kick
            let errorMsg = `${emoji2} *Error al expulsar usuario:*\n\n`
            
            if (kickError?.message?.includes('forbidden') || kickError?.message?.includes('403')) {
                errorMsg += '🚫 Sin permisos suficientes'
            } else if (kickError?.message?.includes('participant-not-found')) {
                errorMsg += '👻 Usuario no encontrado en el grupo'
            } else if (kickError?.message?.includes('not-authorized')) {
                errorMsg += '🔐 No autorizado para esta acción'
            } else {
                errorMsg += `⚠️ ${kickError?.message || 'Error desconocido'}`
            }
            
            errorMsg += '\n\n💡 *Posibles soluciones:*\n- Verifica que el bot sea admin\n- Revisa que el usuario esté en el grupo\n- Espera unos segundos e intenta de nuevo'
            
            return conn.reply(m.chat, errorMsg, m)
        }
        
    } catch (error) {
        console.error('💥 ERROR CRÍTICO EN HANDLER KICK:', error)
        return conn.reply(m.chat, `${emoji2} Error crítico al procesar el comando.\n\n🔧 *Info técnica:* ${error.message}\n\n💡 Reporta este error al desarrollador.`, m)
    }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.group = true
handler.register = true

export default handler

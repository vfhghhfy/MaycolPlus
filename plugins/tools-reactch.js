const font2 = {    
  a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',    
  h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',    
  o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',    
  v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩'    
}

const handler = async (m, { conn, text }) => {    
  if (!text.includes('|')) {    
    return m.reply(`❌ Formato incorrecto.\nUsa:\n.reactch https://whatsapp.com/channel/abc/123|Hola Mundo`)    
  }    
    
  let [link, ...messageParts] = text.split('|')    
  link = link.trim()    
  const msg = messageParts.join('|').trim().toLowerCase()    
    
  if (!link.startsWith("https://whatsapp.com/channel/")) {    
    return m.reply("❌ El enlace no es válido.\nDebe comenzar con: https://whatsapp.com/channel/")    
  }    
    
  const emoji = msg.split('').map(c => c === ' ' ? '―' : (font2[c] || c)).join('')    
  
  try {    
    const [, , , , channelId] = link.split('/')
    
    // Obtener metadata del canal
    const channelInfo = await conn.newsletterMetadata("invite", channelId)
    
    // Obtener los mensajes más recientes del canal
    let messages = null
    let latestMessageId = null
    
    // Intentar diferentes métodos para obtener mensajes
    try {
      messages = await conn.newsletterFetchMessages(channelInfo.id, 10)
      if (messages && messages.length > 0) {
        latestMessageId = messages[0].key.id
      }
    } catch (fetchError) {
      console.log("Método 1 falló, intentando método 2...")
      
      // Método alternativo: usar el ID del mensaje del enlace como referencia
      const urlParts = link.split('/')
      if (urlParts.length > 5 && urlParts[5]) {
        latestMessageId = urlParts[5]
      }
    }
    
    // Si no pudimos obtener el ID del mensaje de ninguna manera
    if (!latestMessageId) {
      // Intentar con un ID genérico común
      const commonIds = [
        '1', 'BAE5', 'BAEK', 'BAE6', 'BAEQ', 'BAER', 'BAES', 'BAET'
      ]
      
      for (const testId of commonIds) {
        try {
          await conn.newsletterReactMessage(channelInfo.id, testId, emoji)
          return m.reply(`✅ Reacción enviada como: *${emoji}*\nCanal: *${channelInfo.name}*\n📝 Método: ID genérico`)
        } catch (testError) {
          continue
        }
      }
    }
    
    // Intentar múltiples veces con el ID obtenido
    const maxRetries = 3
    let success = false
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await conn.newsletterReactMessage(channelInfo.id, latestMessageId, emoji)
        success = true
        break
      } catch (retryError) {
        console.log(`Intento ${attempt} falló:`, retryError.message)
        
        if (attempt < maxRetries) {
          // Esperar un poco antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }
    
    if (success) {
      m.reply(`✅ Reacción enviada como: *${emoji}*\nCanal: *${channelInfo.name}*`)
    } else {
      // Último intento: buscar cualquier mensaje válido en el canal
      try {
        // Intentar reaccionar a diferentes IDs de mensajes posibles
        const possibleIds = [
          '1', '2', '3', 'BAE5', 'BAEK', 'BAE6', 'BAEQ', 'BAER', 'BAES', 'BAET',
          latestMessageId, channelInfo.id.split('@')[0]
        ].filter(Boolean)
        
        for (const testId of possibleIds) {
          try {
            await conn.newsletterReactMessage(channelInfo.id, testId, emoji)
            return m.reply(`✅ Reacción enviada como: *${emoji}*\nCanal: *${channelInfo.name}*\n📝 Método: Búsqueda automática`)
          } catch (testError) {
            continue
          }
        }
        
        m.reply(`⚠️ No se pudo encontrar un mensaje válido para reaccionar.\nCanal: *${channelInfo.name}*\nIntenta con un enlace directo a un mensaje específico.`)
      } catch (finalError) {
        m.reply(`❌ Error de conexión con el canal.\nVerifica que:\n• El enlace sea correcto\n• Tengas acceso al canal\n• El bot esté conectado`)
      }
    }
    
  } catch (e) {    
    console.error('Error principal:', e)
    
    // Mensajes de error más específicos
    if (e.message.includes('not found') || e.message.includes('404')) {
      m.reply("❌ Canal no encontrado.\nVerifica que el enlace sea correcto y que tengas acceso al canal.")
    } else if (e.message.includes('forbidden') || e.message.includes('403')) {
      m.reply("❌ Sin permisos.\nEl bot no tiene acceso a este canal o no puede reaccionar.")
    } else if (e.message.includes('network') || e.message.includes('timeout')) {
      m.reply("❌ Error de conexión.\nRevisa tu conexión a internet e intenta nuevamente.")
    } else {
      m.reply(`❌ Error inesperado.\nDetalles: ${e.message}\nIntenta con otro canal o contacta al administrador.`)
    }
  }    
}    
    
handler.command = ['reactch', 'rch']    
handler.tags = ['tools']    
handler.help = ['reactch <link>|<texto>']    
    
export default handler

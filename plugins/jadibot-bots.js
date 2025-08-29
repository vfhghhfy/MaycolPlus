import ws from 'ws'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    // Mostrar información de subbots con botón
    await showSubBotInfo(conn, m, usedPrefix)
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: 'Error al mostrar información de subbots.' }, { quoted: m })
  }
}

// Función para mostrar info de subbots con botón
async function showSubBotInfo(conn, m, usedPrefix) {
  try {
    let uniqueUsers = new Map()
    if (!global.conns || !Array.isArray(global.conns)) global.conns = []
    
    for (const connSub of global.conns) {
      if (connSub.user && connSub.ws?.socket?.readyState !== ws.CLOSED) {
        const jid = connSub.user.jid
        const numero = jid?.split('@')[0]
        let nombre = connSub.user.name
        if (!nombre && typeof conn.getName === 'function') {
          try {
            nombre = await conn.getName(jid)
          } catch {
            nombre = `Usuario ${numero}`
          }
        }
        uniqueUsers.set(jid, nombre || `Usuario ${numero}`)
      }
    }
    
    const uptime = process.uptime() * 1000
    const formatUptime = clockString(uptime)
    const totalUsers = uniqueUsers.size
    
    let txt = `🌟 SUBS ACTIVOS 🌟\n\n`
    txt += `⏳ Tiempo Activo: ${formatUptime}\n`
    txt += `👥 Total Conectados: ${totalUsers}\n`
    
    if (totalUsers > 0) {
      txt += `\n📋 LISTA DE SUBS\n\n`
      let i = 1
      for (const [jid, nombre] of uniqueUsers) {
        const numero = jid.split('@')[0]
        txt += `💎 ${i++}. ${nombre}\n`
        txt += `🔗 https://wa.me/${numero}\n\n`
      }
    } else {
      txt += `https://chat.whatsapp.com/HztBH5HP4kpBE86Nbuax4i?mode=ems_copy_c\n⚠️ No hay subbots conectados actualmente.`
    }
    
    // Crear botón "Ser SubBot"
    let buttons = [
      [`🤖 Ser SubBot`, `.code`, null]
    ]
    
    try {
      // Método 1: conn.sendButton
      await conn.sendButton(m.chat, txt.trim(), 
        `Haz clic para convertirte en SubBot`, 
        null, buttons, m)
    } catch (error) {
      console.log("conn.sendButton no funciona, probando método alternativo...")
      
      try {
        // Método 2: sendMessage con buttons
        let buttonList = [
          {
            buttonId: `.code`,
            buttonText: { displayText: `🤖 Ser SubBot` },
            type: 1
          }
        ]
        
        await conn.sendMessage(m.chat, {
          text: txt.trim(),
          footer: `Haz clic para convertirte en SubBot`,
          buttons: buttonList,
          headerType: 1
        }, { quoted: m })
        
      } catch (error2) {
        console.log("Método alternativo tampoco funciona, enviando texto simple...")
        
        // Fallback final: solo texto
        await conn.sendMessage(m.chat, {
          text: txt.trim() + `\n\n🤖 *Para ser SubBot usa:* .code`
        }, { quoted: m })
      }
    }
    
  } catch (e) {
    console.error('Error en showSubBotInfo:', e)
    await conn.sendMessage(m.chat, { text: 'Error al mostrar información de subbots.' }, { quoted: m })
  }
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
handler.register = false

export default handler

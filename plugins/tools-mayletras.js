import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {

    if (!args[0] || !args.join(' ').includes('|')) {
        return m.reply('⚠️ Usa el formato correcto:\n*mayletras Artista | Canción*\n\nEjemplo:\nmayletras Coldplay | Yellow')
    }

    let [artista, cancion] = args.join(' ').split('|').map(v => v.trim())
  
    if (!artista || !cancion) {
        return m.reply('⚠️ Faltan datos, recuerda:\n*mayletras Artista | Canción*')
    }

    let res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`)
  
    if (!res.ok) return m.reply('🚫 No encontré la letra, revisa los datos UwU')
  
    let json = await res.json()
  
    if (!json.lyrics) return m.reply('🚫 No encontré la letra, revisa los datos UwU')
  
    let letras = json.lyrics.split('\n').filter(v => v.trim())
  
    if (!letras.length) return m.reply('🚫 No hay líneas de letra para mostrar UwU')
  
    let textoFinal = ''
  
    // Primer mensaje
    let msg = await conn.sendMessage(m.chat, { text: '🎶 Mostrando letras en tiempo real...\nEspera un momento UwU (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤' }, { quoted: m })

    for (let linea of letras) {
        textoFinal += linea + '\n'

        await conn.relayMessage(m.chat, {
            conversation: `🎤 *${artista} - ${cancion}*\n\n${textoFinal}`
        }, { messageId: msg.key.id })

        await new Promise(r => setTimeout(r, 1000)) // Espera de 1 segundo
    }

    await conn.relayMessage(m.chat, {
        conversation: `✅ *Letra completa de:* ${artista} - ${cancion}\n\n${textoFinal}`
    }, { messageId: msg.key.id })
}

handler.help = ['mayletras artista | canción']
handler.tags = ['musica']
handler.command = /^mayletras$/i

export default handler

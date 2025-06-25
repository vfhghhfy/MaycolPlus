import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0] || !args.join(' ').includes('|')) {
        return m.reply(`⚠️ Usa el comando así:\n*${usedPrefix + command} Artista | Canción*\n\nEjemplo:\n${usedPrefix + command} Coldplay | Yellow`)
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
    const msg = await m.reply(`🎤 *${artista} - ${cancion}*\nMostrando letra...\n(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤`)

    for (let linea of letras) {
        textoFinal += linea + '\n'

        try {
            await conn.sendMessage(m.chat, {
                text: `🎤 *${artista} - ${cancion}*\n\n${textoFinal}`
            }, { edit: msg.key })
        } catch (e) {
            console.log('Error actualizando letras:', e)
        }

        await new Promise(r => setTimeout(r, 3000)) // Espera 3 segundos entre líneas
    }

    // Mensaje final al terminar toda la letra
    try {
        await conn.sendMessage(m.chat, {
            text: `✅ *Letra completa de:* ${artista} - ${cancion}\n\n${textoFinal}`
        }, { edit: msg.key })
    } catch (e) {
        console.log('Error finalizando letras:', e)
    }
}

handler.help = ['mayletras artista | canción']
handler.tags = ['musica']
handler.command = ['mayletras']

export default handler

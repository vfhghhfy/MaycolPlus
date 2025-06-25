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
  
    let msg = await m.reply('🎶 Mostrando letras en tiempo real...\nEspera un momento UwU (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤')
  
    let textoFinal = ''
  
    for (let linea of letras) {
        textoFinal += linea + '\n'
        await conn.editMessage(m.chat, msg.key.id, `🎤 *${artista} - ${cancion}*\n\n${textoFinal}`)
        await new Promise(r => setTimeout(r, 1000)) // 1 seg entre línea
    }
  
    await conn.editMessage(m.chat, msg.key.id, `✅ *Letra completa de:* ${artista} - ${cancion}\n\n${textoFinal}`)
}

handler.help = ['mayletras artista | canción']
handler.tags = ['musica']
handler.command = ['mayletras']

export default handler

//>>⟩ Creado por GianPoolS < github.com/GianPoolS >

import fg from 'api-dylux'

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) throw *💬 Ejemplo de uso:*\n${usedPrefix + command} https://twitter.com/fernandavasro/status/1569741835555291139

await m.react('⏳') // reacción de espera

try {
// Obtener datos del tweet
let { SD, HD, desc, thumb, audio } = await fg.twitter(args[0])
let type = (args[1] || '').toLowerCase() // verifica si pidió hd / sd / audio

// Mensaje base  
let caption = `

`彡 T W I T T E R - D L`

📌 Descripción: ${desc || 'Sin descripción'}
🔗 Link: ${args[0]}
`

// Si no pidió calidad específica, mostramos menú con preview y botones  
if (!['hd', 'sd', 'audio'].includes(type)) {  
  return await conn.sendMessage(m.chat, {  
    image: { url: thumb }, // miniatura  
    caption,  
    footer: "Selecciona una opción de descarga:",  
    buttons: [  
      { buttonId: `${usedPrefix + command} ${args[0]} hd`, buttonText: { displayText: "🎥 Descargar HD" }, type: 1 },  
      { buttonId: `${usedPrefix + command} ${args[0]} sd`, buttonText: { displayText: "📺 Descargar SD" }, type: 1 },  
      { buttonId: `${usedPrefix + command} ${args[0]} audio`, buttonText: { displayText: "🎧 Descargar Audio" }, type: 1 }  
    ]  
  }, { quoted: m })  
}  

// Si ya pidió calidad → enviamos el archivo correspondiente  
if (type === 'hd') {  
  await conn.sendMessage(m.chat, { video: { url: HD }, caption }, { quoted: m })  
} else if (type === 'sd') {  
  await conn.sendMessage(m.chat, { video: { url: SD }, caption }, { quoted: m })  
} else if (type === 'audio') {  
  await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mp4' }, { quoted: m })  
}  

await m.react('✅') // éxito

} catch (e) {
console.error(e)
await m.react('❌')
await m.reply('ⓘ Hubo un error al descargar el tweet.')
}
}

handler.help = ['twitter <url>','x <url>']
handler.tags = ['downloader']
handler.command = ['twitter', 'tw', 'x']
//handler.register = true

export default handler


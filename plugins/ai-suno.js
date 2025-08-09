/* Creditos a Ado (Wirk) */
import fetch from 'node-fetch' 

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let text = args.join(" ")
  if (!text) return m.reply(`🎧 Ingresa un prompt pa generar música\n*Ejemplo:* ${usedPrefix + command} un rap triste sobre gatos`)

  try {
    await m.react('🕓') 

    const res = await fetch(`https://myapiadonix.vercel.app/api/AImusic?prompt=${encodeURIComponent(text)}`)
    if (!res.ok) return m.reply("⚠️ No se pudo generar la música, intenta más tarde")

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await conn.sendFile(m.chat, buffer, 'AImusic-Adonix.mp3', `🎤 Aquí tu canción generada con IA\nPrompt: ${text}`, m)

  } catch (e) {
    console.error(e)
    m.reply("❌ Ocurrió un error generando la canción.")
  }
}

handler.help = ['iamusic']
handler.tags = ['ia']
handler.command = ['iamusic', 'suno', 'cancionia']
export default handler

import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📎 *Por favor ingresa un enlace de Mediafire*')
  if (!/^https?:\/\/.*mediafire\.com/.test(text)) return m.reply('❗ Ingresa un enlace válido de *Mediafire*')

  try {
    // Reacciona con el reloj mientras procesa
    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })

    const apiUrl = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`
    const res = await axios.get(apiUrl)
    const { filename, size, extension, link } = res.data.data

    await conn.sendFile(
      m.chat,
      link,
      filename,
      `✅ *Nombre:* ${filename}\n📦 *Tamaño:* ${size}\n📄 *Tipo:* ${extension || 'desconocido'}`,
      m
    )
  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error al procesar el enlace o la API está caída.')
  }
}

handler.help = ['mediafire']
handler.tags = ['downloader']
handler.command = ['mediafire']
handler.register = false
export default handler
import axios from 'axios'
import fetch from 'node-fetch'

const nightAPI = 'https://nightapi.is-a.dev/api/gemini?message='

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ')
  const chatId = msg.key.remoteJid

  if (!text) {
    return conn.sendMessage(chatId, {
      text: `✳️ Ingresa tu pregunta\nEjemplo: *${usedPrefix + command}* ¿quién inventó WhatsApp?`
    }, { quoted: msg })
  }

  try {
    await conn.sendMessage(chatId, { react: { text: '🕳️', key: msg.key } })

    const prompt = await getPrompt()
    const fullText = `${prompt}\n\n${text}`

    const res = await axios.get(nightAPI + encodeURIComponent(fullText))
    const data = res.data

    if (!data.status) throw new Error('La API no devolvió respuesta válida')

    const result = `${data.result}\n\n> ${data.creator}`

    await conn.sendMessage(chatId, { text: result }, { quoted: msg })
    await conn.sendMessage(chatId, { react: { text: '💩', key: msg.key } })

  } catch (error) {
    console.error(error)
    await conn.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: msg })

    await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key } })
  }
}

async function getPrompt() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/SoySapo6/SoySapo6/refs/heads/main/prompt-xex.may')
    return await res.text()
  } catch {
    return 'Eres un asistente inteligente'
  }
}

handler.help = ['xex <pregunta>']
handler.command = ['xex', 'ai', 'ask']
handler.tags = ['ai']
handler.register = true

export default handler

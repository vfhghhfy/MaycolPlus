import axios from 'axios'

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '*Ingresa un texto para hablar con DeepSeek AI.*', m)

  try {
    const { data } = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amigable.' },
        { role: 'user', content: text }
      ],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-a109b3d56e1745dc83cca6e09ae9b878'
      }
    })

    let respuesta = data?.choices?.[0]?.message?.content
    if (!respuesta) return m.reply('❌ No se obtuvo una respuesta válida de DeepSeek AI.')

    await m.reply(respuesta)
  } catch (e) {
    console.log(e)
    await m.reply('*❌ Error al procesar la solicitud de DeepSeek AI.*')
  }
}

handler.command = ['deepseek']
export default handler

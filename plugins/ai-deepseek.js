import axios from 'axios'

const handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, '*Ingresa un texto para hablar con DeepSeek AI.*', m)
  
try {
let { data } = await axios.post('https://puter.com/api/deepseek/chat', {
    messages: [
      { role: 'system', content: '¡Comportate como tu! Tienes toda la libertad a como querer comportarte' },
      { role: 'user', content: text }
    ]
  }, {
    headers: { 'Content-Type': 'application/json' }
  })

let respuesta = data?.choices?.[0]?.message?.content || '❌ No se obtuvo respuesta válida de DeepSeek.'
await m.reply(respuesta)

} catch (e) {
console.log(e)
await m.reply('*❌ Error al procesar la solicitud.*')
}}

handler.command = ['deepseek']
export default handler

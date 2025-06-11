import axios from 'axios'

const handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, '*Ingresa un texto para hablar con DeepSeek AI.*', m)
  
try {
let { data } = await axios.get(`https://archive-ui.tanakadomp.biz.id/ai/deepseek?text=${encodeURIComponent(text)}`)
await m.reply(data?.result || '❌ No se obtuvo una respuesta válida de DeepSeek AI.')
} catch {
await m.reply('*❌ Error al procesar la solicitud.*')
}}

handler.command = ['deepseek'];
export default handler

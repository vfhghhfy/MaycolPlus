import { ejecutarCodigo, mapearLenguaje } from '../lib/glot.js'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.fileName) {
        return conn.reply(m.chat, '*Responde a un archivo de código para ejecutarlo.*', m)
    }

    try {
        const fileName = m.quoted.fileName || ''
        const extension = fileName.split('.').pop().toLowerCase()
        const lenguaje = mapearLenguaje(extension)

        if (!lenguaje) {
            return conn.reply(m.chat, '*Lenguaje no soportado.* Solo: js, py, c, cpp, java.', m)
        }

        const messageKeys = Object.keys(m.quoted.message || {})
        if (!messageKeys.length) return conn.reply(m.chat, '❌ No se pudo detectar el tipo de mensaje.', m)

        const messageType = messageKeys[0]
        const stream = await downloadContentFromMessage(m.quoted.message[messageType], messageType.replace('Message', ''))

        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        const codigo = buffer.toString()
        if (!codigo.trim()) return conn.reply(m.chat, '*El archivo está vacío o ilegible.*', m)

        conn.reply(m.chat, '⏳ Ejecutando el código, dame un segundo...', m)

        const resultado = await ejecutarCodigo(lenguaje, codigo)
        await conn.reply(m.chat, `✅ *Resultado:* \n\n${resultado}`, m)

    } catch (e) {
        console.log(e)
        conn.reply(m.chat, '❌ Error al procesar el archivo.')
    }
}

handler.command = ['maycodigo']
export default handler

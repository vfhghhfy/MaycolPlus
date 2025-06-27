import { ejecutarCodigo, mapearLenguaje } from '../lib/glot.js'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.fileSha256 || !m.quoted.fileName) {
        return conn.reply(m.chat, '*Responde a un documento de código para ejecutarlo.*', m)
    }

    try {
        const fileName = m.quoted.fileName || ''
        const extension = fileName.split('.').pop().toLowerCase()
        const lenguaje = mapearLenguaje(extension)

        if (!lenguaje) {
            return conn.reply(m.chat, '*Lenguaje no soportado.* Solo: js, py, c, cpp, java.', m)
        }

        const msgContent = m.quoted.message?.documentMessage
        if (!msgContent) return conn.reply(m.chat, '❌ El mensaje no es un documento válido.', m)

        const stream = await downloadContentFromMessage(msgContent, 'document')

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

import { ejecutarCodigo, mapearLenguaje } from '../lib/glot.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.fileSha256) {
        return conn.reply(m.chat, '*Responde a un archivo de código para ejecutarlo.*', m)
    }

    try {
        const fileName = m.quoted.fileName || ''
        const extension = fileName.split('.').pop().toLowerCase()
        const lenguaje = mapearLenguaje(extension)

        if (!lenguaje) {
            return conn.reply(m.chat, `*Lenguaje no soportado.* Solo se aceptan: js, py, c, cpp, java.`, m)
        }

        const fileBuffer = await downloadMediaMessage(m.quoted, 'buffer', {}, { reuploadRequest: conn })
        if (!fileBuffer) return conn.reply(m.chat, '❌ No se pudo descargar el archivo.', m)

        const codigo = fileBuffer.toString()

        if (!codigo.trim()) return conn.reply(m.chat, '*El archivo está vacío o no se pudo leer correctamente.*', m)

        conn.reply(m.chat, '⏳ Ejecutando el código, dame un segundo...', m)

        const resultado = await ejecutarCodigo(lenguaje, codigo)

        await conn.reply(m.chat, `✅ *Resultado de ejecución:* \n\n${resultado}`, m)

    } catch (e) {
        console.log(e)
        conn.reply(m.chat, '❌ Ocurrió un error al procesar el archivo.', m)
    }
}

handler.command = ['maycodigo']
export default handler

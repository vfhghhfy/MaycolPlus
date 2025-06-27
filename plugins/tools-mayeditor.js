import { ejecutarCodigo, mapearLenguaje } from '../lib/glot.js'
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.fileSha256) {
        return conn.reply(m.chat, '*Responde a un archivo de código para ejecutarlo.*', m)
    }

    try {
        const mime = m.quoted.mimetype || ''
        if (!mime.includes('text')) return conn.reply(m.chat, '*Solo se permiten archivos de texto/código.*', m)

        const fileBuffer = await conn.download(m.quoted)
        const extension = (m.quoted.fileName || '').split('.').pop().toLowerCase()
        const lenguaje = mapearLenguaje(extension)

        if (!lenguaje) return conn.reply(m.chat, `*Lenguaje no soportado. Solo: js, py, c, cpp, java.*`, m)

        const codigo = fileBuffer.toString()

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

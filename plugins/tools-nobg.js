import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!mime) {
        return conn.sendMessage(m.chat, {
            text: `⚠️ Envía un archivo con el texto *.${command}* o responde al archivo con este comando.`,
        }, { quoted: m })
    }

    // Descargar archivo del usuario
    const media = await q.download()
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const ext = mime.split('/')[1] || 'dat'
    const fileName = `media_${Date.now()}.${ext}`
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, media)

    const buffer = fs.readFileSync(filePath)

    // Reacción de carga
    await conn.sendMessage(m.chat, {
        react: { text: '⏳', key: m.key }
    })

    // Subir la imagen original a FreeImageHost
    const uploadToFreeImageHost = async (buffer) => {
        try {
            const form = new FormData()
            form.append('source', buffer, 'file')
            const res = await axios.post('https://freeimage.host/api/1/upload', form, {
                params: { key: '6d207e02198a847aa98d0a2a901485a5' }, // tu API key
                headers: form.getHeaders()
            })
            return res.data.image.url
        } catch (err) {
            console.error('Error FreeImageHost:', err?.response?.data || err.message)
            return null
        }
    }

    // Subir imagen original
    const freehostUrl = await uploadToFreeImageHost(buffer)

    // Llamar a API para remover fondo
    try {
        const apiKey = 'may-2b02ac57e684a1c5ba9281d8dabf019c'
        const nobgRes = await axios.get('https://mayapi.giize.com/nobg', {
            params: { 
                image: freehostUrl, // enviamos la imagen subida a freeimagehost
                apikey: apiKey
            },
            responseType: 'arraybuffer' // para descargar la imagen resultante
        })

        const outputPath = path.join(tempDir, `nobg_${Date.now()}.png`)
        fs.writeFileSync(outputPath, Buffer.from(nobgRes.data))

        // Enviar imagen al usuario como documento
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(outputPath),
            mimetype: 'image/png',
            fileName: `nobg_${Date.now()}.png`
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        })

        // Limpiar archivos temporales
        fs.unlinkSync(filePath)
        fs.unlinkSync(outputPath)

    } catch (err) {
        console.error('Error al remover fondo:', err.message)
        await conn.sendMessage(m.chat, {
            text: `❌ Error al procesar la imagen: ${err.message}`
        }, { quoted: m })
        fs.unlinkSync(filePath)
    }
}

handler.help = ['nobg']
handler.tags = ['tools']
handler.command = /^(nobg)$/i

export default handler

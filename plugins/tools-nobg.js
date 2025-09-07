import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!mime) return conn.sendMessage(m.chat, { text: `⚠️ Envía un archivo con el comando *.${command}* o responde a un archivo con él.` }, { quoted: m })

    // Descargar el archivo
    const media = await q.download()
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const ext = mime.split('/')[1] || 'dat'
    const fileName = `media_${Date.now()}.${ext}`
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, media)

    const buffer = fs.readFileSync(filePath)

    // Reacción de carga
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Subir la imagen original a FreeImageHost
    const uploadToFreeImageHost = async (buffer) => {
        try {
            const form = new FormData()
            form.append('source', buffer, 'file')
            const res = await axios.post('https://freeimage.host/api/1/upload', form, {
                params: { key: '6d207e02198a847aa98d0a2a901485a5' },
                headers: form.getHeaders()
            })
            return res.data.image.url
        } catch (err) {
            console.error('Error FreeImageHost:', err?.response?.data || err.message)
            return null
        }
    }

    const freehost = await uploadToFreeImageHost(buffer)

    // Hacer petición a la API de nobg
    const apiKey = 'may-2b02ac57e684a1c5ba9281d8dabf019c'
    let nobgResult = null
    try {
        const form = new FormData()
        form.append('image', fs.createReadStream(filePath))
        const res = await axios.post(`https://mayapi.giize.com/nobg?apikey=${apiKey}`, form, {
            headers: form.getHeaders()
        })
        if (res.data?.status) nobgResult = res.data.result
    } catch (err) {
        console.error('Error Nobg:', err?.response?.data || err.message)
    }

    // Descargar la imagen sin fondo
    let nobgFilePath = null
    if (nobgResult) {
        const nobgBuffer = (await axios.get(nobgResult, { responseType: 'arraybuffer' })).data
        nobgFilePath = path.join(tempDir, `nobg_${Date.now()}.png`)
        fs.writeFileSync(nobgFilePath, nobgBuffer)
        await conn.sendMessage(m.chat, { document: { url: nobgFilePath }, mimetype: 'image/png', fileName: `nobg_${Date.now()}.png` }, { quoted: m })
    }

    // Mensaje de confirmación con FreeImageHost
    if (freehost) {
        await conn.sendMessage(m.chat, { text: `✅ Imagen original subida a FreeImageHost:\n${freehost}` }, { quoted: m })
    }

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    // Borra los archivos temporales
    fs.unlinkSync(filePath)
    if (nobgFilePath) fs.unlinkSync(nobgFilePath)
}

handler.help = ['nobg']
handler.tags = ['tools']
handler.command = /^(nobg)$/i

export default handler

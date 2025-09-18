import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    
    if (!mime.startsWith('image/')) {
        return conn.sendMessage(m.chat, {
            text: `★ Eh? ¿Dónde está la imagen? ★\n† No puedo quitar el fondo de la nada... †\n\n∘ Envía una imagen con *.${command}*\n∘ O responde a una imagen con este comando`,
        }, { quoted: m })
    }

    // Descargar la imagen del usuario
    const media = await q.download()
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const ext = mime.split('/')[1] || 'jpg'
    const fileName = `media_${Date.now()}.${ext}`
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, media)

    // Reacción de carga
    await conn.sendMessage(m.chat, {
        react: { text: '⏳', key: m.key }
    })

    // Función para subir a FreeImageHost
    const uploadToFreeImageHost = async (buffer) => {
        try {
            const form = new FormData()
            form.append('source', buffer, 'image.jpg')
            const res = await axios.post('https://freeimage.host/api/1/upload', form, {
                params: {
                    key: '6d207e02198a847aa98d0a2a901485a5'
                },
                headers: form.getHeaders()
            })
            return res.data.image.url
        } catch (err) {
            console.error('Error FreeImageHost:', err?.response?.data || err.message)
            return null
        }
    }

    try {
        // Subir imagen a FreeImageHost
        const buffer = fs.readFileSync(filePath)
        const imageUrl = await uploadToFreeImageHost(buffer)
        
        if (!imageUrl) {
            throw new Error('No se pudo subir la imagen')
        }

        // Hacer petición a la API de remove background
        const response = await axios.get('https://mayapi.ooguy.com/nobg', {
            params: {
                image: imageUrl,
                apikey: 'soymaycol<3'
            }
        })

        if (!response.data.status) {
            throw new Error('API respondió con error')
        }

        // Descargar la imagen sin fondo
        const resultImageUrl = response.data.result
        const imageResponse = await axios.get(resultImageUrl, {
            responseType: 'arraybuffer'
        })

        const processedImageBuffer = Buffer.from(imageResponse.data)
        const processedFileName = `nobg_${Date.now()}.png`
        const processedFilePath = path.join(tempDir, processedFileName)
        fs.writeFileSync(processedFilePath, processedImageBuffer)

        // Mensaje travieso de Hanako-kun
        const hanakoMessage = `† Jejeje~ ¿Viste eso? † \n★ Le quité el fondo como por arte de magia ★\n\n┌─────────────────┐\n│ ★ MaycolPlus ★ │\n└─────────────────┘`

        // Enviar como documento
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(processedFilePath),
            mimetype: 'image/png',
            fileName: `${Date.now()}.png`,
            caption: hanakoMessage
        }, { quoted: m })

        // Reacción de éxito
        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        })

        // Limpiar archivos temporales
        fs.unlinkSync(filePath)
        fs.unlinkSync(processedFilePath)

    } catch (error) {
        console.error('Error:', error)
        
        await conn.sendMessage(m.chat, {
            text: `★ Oops~ Algo salió mal ★\n† ${error.message || 'Error desconocido'} †\n\n∘ Inténtalo de nuevo más tarde`,
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        })

        // Limpiar archivo temporal si existe
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

handler.help = ['removebg', 'nobg', 'rmbg']
handler.tags = ['tools']
handler.command = /^(removebg|nobg|rmbg)$/i

export default handler

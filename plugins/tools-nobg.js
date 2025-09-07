import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    
    // Verificar que sea una imagen
    if (!mime || !mime.startsWith('image/')) {
        return conn.sendMessage(m.chat, {
            text: '⚠️ Envía una imagen con el texto *.' + command + '* o responde a una imagen con este comando.',
        }, { quoted: m })
    }

    // Descargar la imagen del usuario
    const media = await q.download()
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const ext = mime.split('/')[1] || 'png'
    const fileName = `media_${Date.now()}.${ext}`
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, media)

    const buffer = fs.readFileSync(filePath)

    // Reacción de carga
    await conn.sendMessage(m.chat, {
        react: { text: '⏳', key: m.key }
    })

    try {
        // Subir imagen a FreeImageHost
        const uploadToFreeImageHost = async (buffer) => {
            try {
                const form = new FormData()
                form.append('source', buffer, 'image.png')
                const res = await axios.post('https://freeimage.host/api/1/upload', form, {
                    params: {
                        key: '6d207e02198a847aa98d0a2a901485a5' // Cambia si se acaba la cuota
                    },
                    headers: form.getHeaders()
                })
                return res.data.image.url
            } catch (err) {
                console.error('Error FreeImageHost:', err?.response?.data || err.message)
                throw new Error('Error al subir imagen a FreeImageHost')
            }
        }

        // Subir imagen original a FreeImageHost
        const imageUrl = await uploadToFreeImageHost(buffer)
        
        // Hacer petición a la API para remover fondo
        const apiResponse = await axios.get('https://mayapi.giize.com/nobg', {
            params: {
                image: imageUrl,
                apikey: 'may-2b02ac57e684a1c5ba9281d8dabf019c'
            }
        })

        if (!apiResponse.data.status) {
            throw new Error('La API no pudo procesar la imagen')
        }

        const resultImageUrl = apiResponse.data.result
        
        // Descargar la imagen procesada
        const processedImageResponse = await axios.get(resultImageUrl, {
            responseType: 'arraybuffer'
        })
        
        const processedImageBuffer = Buffer.from(processedImageResponse.data)
        
        // Guardar imagen procesada temporalmente
        const processedFileName = `rembg_${Date.now()}.png`
        const processedFilePath = path.join(tempDir, processedFileName)
        fs.writeFileSync(processedFilePath, processedImageBuffer)

        // Enviar como documento
        await conn.sendMessage(m.chat, {
            document: processedImageBuffer,
            fileName: `imagen_sin_fondo_${Date.now()}.png`,
            mimetype: 'image/png',
            caption: `✅ *Fondo removido exitosamente*\n\n📊 *Información de la API:*\n👤 Usuario: ${apiResponse.data.user.username}\n📈 Solicitudes hoy: ${apiResponse.data.user.requests_made_today}\n🎯 Límite: ${apiResponse.data.user.limit}`
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
        
        // Reacción de error
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        })
        
        await conn.sendMessage(m.chat, {
            text: `❌ Error al procesar la imagen: ${error.message}`
        }, { quoted: m })
        
        // Limpiar archivo temporal en caso de error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

handler.help = ['rembg', 'removebg', 'nobg']
handler.tags = ['tools']
handler.command = /^(rembg|removebg|nobg)$/i

export default handler

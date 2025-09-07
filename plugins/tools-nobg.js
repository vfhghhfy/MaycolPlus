import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime || !mime.startsWith('image/')) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Envía una imagen con el comando *.${command}* o responde a una imagen con este comando.`,
    }, { quoted: m })
  }

  // Descargar la imagen del usuario
  const media = await q.download()
  const tempDir = './temp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const ext = mime.split('/')[1] || 'jpg'
  const originalFileName = `input_${Date.now()}.${ext}`
  const originalFilePath = path.join(tempDir, originalFileName)
  fs.writeFileSync(originalFilePath, media)

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    // 1️⃣ Enviar la imagen a la API para remover fondo
    const form = new FormData()
    form.append('file', fs.createReadStream(originalFilePath))

    const response = await axios.post('https://mayapi.giize.com/nobg', form, {
      headers: form.getHeaders(),
      params: { apikey: 'may-2b02ac57e684a1c5ba9281d8dabf019c' }
    })

    if (!response.data?.status || !response.data?.result) {
      throw new Error('No se pudo procesar la imagen.')
    }

    // 2️⃣ Descargar la imagen resultante
    const { data: nobgImageBuffer } = await axios.get(response.data.result, { responseType: 'arraybuffer' })
    const nobgFileName = `nobg_${Date.now()}.png`
    const nobgFilePath = path.join(tempDir, nobgFileName)
    fs.writeFileSync(nobgFilePath, Buffer.from(nobgImageBuffer))

    // 3️⃣ Subir la imagen a FreeImageHost
    const freeForm = new FormData()
    freeForm.append('source', fs.createReadStream(nobgFilePath), 'nobg.png')

    const freeRes = await axios.post('https://freeimage.host/api/1/upload', freeForm, {
      params: { key: '6d207e02198a847aa98d0a2a901485a5' },
      headers: freeForm.getHeaders()
    })

    const freeUrl = freeRes.data?.image?.url
    if (!freeUrl) throw new Error('No se pudo subir la imagen a FreeImageHost.')

    // 4️⃣ Enviar la imagen al usuario como documento
    await conn.sendMessage(m.chat, {
      document: fs.createReadStream(nobgFilePath),
      fileName: 'nobg.png',
      mimetype: 'image/png'
    }, { quoted: m })

    // Reacción final ✅
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    // Limpiar archivos temporales
    fs.unlinkSync(originalFilePath)
    fs.unlinkSync(nobgFilePath)

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, {
      text: `❌ Error al procesar la imagen: ${err.message}`
    }, { quoted: m })
  }
}

handler.help = ['nobg']
handler.tags = ['tools']
handler.command = /^(nobg)$/i

export default handler

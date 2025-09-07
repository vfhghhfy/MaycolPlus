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

  // Descargar el archivo enviado
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

  try {
    // Llamada a la API de remove background
    const apiKey = 'may-2b02ac57e684a1c5ba9281d8dabf019c'
    const form = new FormData()
    form.append('image', buffer, 'file.png')

    const nobgResponse = await axios.post(`https://mayapi.giize.com/nobg?apikey=${apiKey}`, form, {
      headers: form.getHeaders()
    })

    if (!nobgResponse.data?.status) throw new Error('No se pudo procesar la imagen')

    const imageUrl = nobgResponse.data.result

    // Descargar la imagen resultante
    const imageBuffer = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data

    // Subir a FreeImageHost
    const uploadForm = new FormData()
    uploadForm.append('source', imageBuffer, 'nobg.png')
    const freeHostRes = await axios.post('https://freeimage.host/api/1/upload', uploadForm, {
      params: { key: '6d207e02198a847aa98d0a2a901485a5' },
      headers: uploadForm.getHeaders()
    })

    const freeHostUrl = freeHostRes.data.image.url

    // Enviar la imagen como documento al usuario
    await conn.sendMessage(m.chat, {
      document: imageBuffer,
      mimetype: 'image/png',
      fileName: 'nobg.png',
      caption: `✅ Fondo removido y subido a FreeImageHost:\n${freeHostUrl}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al remover el fondo o subir la imagen.' }, { quoted: m })
  } finally {
    // Borra el archivo temporal
    fs.unlinkSync(filePath)
  }
}

handler.help = ['nobg']
handler.tags = ['tools']
handler.command = /^(nobg)$/i

export default handler

import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix, groupMetadata }) => {
  if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')
  
  let type = args[0]?.toLowerCase()
  if (type !== '1') {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1`)
  }

  // Rate limiting: 3 veces al día por usuario
  const userId = m.sender
  const today = new Date().toDateString()
  
  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {}
  }
  
  if (!global.db.data.users[userId].mayeditor) {
    global.db.data.users[userId].mayeditor = { count: 0, date: today }
  }
  
  const userLimit = global.db.data.users[userId].mayeditor
  
  // Resetear contador si es un nuevo día
  if (userLimit.date !== today) {
    userLimit.count = 0
    userLimit.date = today
  }
  
  // Verificar límite
  if (userLimit.count >= 3) {
    return m.reply('✧ Ya has usado tu magia 3 veces hoy, espíritu.\n✧ Vuelve mañana para más hechizos visuales... 🌙')
  }
  
  // Incrementar contador
  userLimit.count++

  // Obtener información del usuario
  const targetUserId = userId.split('@')[0]
  
  try {
    m.reply(`🎬 Procesando tu video mágico... (${userLimit.count}/3 usos hoy)\n✧ Esto tomará unos momentos...`)
    
    // Obtener foto de perfil del usuario
    const pp = await conn.profilePictureUrl(userId, 'image').catch(_ =>
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
    
    // Descargar la foto de perfil
    const profileResponse = await fetch(pp)
    const profileBuffer = await profileResponse.buffer()
    
    // Crear directorios temporales si no existen
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Rutas de archivos
    const profilePath = path.join(tempDir, `profile_${targetUserId}.jpg`)
    const inputVideoPath = './videos/lv_7507655713968164149_20250607160908.mp4'
    const outputVideoPath = path.join(tempDir, `output_${targetUserId}_${Date.now()}.mp4`)
    
    // Verificar que el video de entrada existe
    if (!fs.existsSync(inputVideoPath)) {
      return m.reply('❌ No se encontró el video base. Verifica la ruta del archivo.')
    }
    
    // Guardar foto de perfil temporalmente
    fs.writeFileSync(profilePath, profileBuffer)
    
    // Procesar video con ffmpeg (optimizado para WhatsApp)
    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
        .input(profilePath)
        .complexFilter([
          // Aplicar colorkey para remover el fondo morado (#ba00ff)
          '[0:v]colorkey=0xba00ff:0.3:0.2[ckout]',
          // Escalar la imagen de fondo al tamaño del video y redimensionar todo
          '[1:v][ckout]scale2ref=720:1280[bg][fg]',
          // Superponer el video procesado sobre el fondo
          '[bg][fg]overlay=format=auto[final]'
        ], 'final')
        .audioCodec('aac') // AAC es mejor para WhatsApp
        .audioFrequency(44100)
        .audioBitrate('128k')
        .videoCodec('libx264')
        .videoBitrate('1000k') // Bitrate optimizado
        .fps(30) // FPS estándar
        .format('mp4') // Formato compatible
        .outputOptions([
          '-pix_fmt yuv420p', // Formato de píxeles compatible
          '-movflags +faststart', // Optimización for streaming
          '-preset ultrafast', // Velocidad de codificación muy rápida
          '-crf 23', // Calidad optimizada
          '-maxrate 1500k',
          '-bufsize 2000k'
        ])
        .output(outputVideoPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg iniciado:', commandLine)
        })
        .on('progress', (progress) => {
          const percent = Math.round(progress.percent || 0)
          if (percent % 25 === 0) { // Solo mostrar cada 25%
            console.log(`Procesando... ${percent}%`)
          }
        })
        .on('end', () => {
          console.log('✅ Procesamiento completado')
          resolve()
        })
        .on('error', (err) => {
          console.error('❌ Error en FFmpeg:', err)
          reject(err)
        })
        .run()
    })
    
    // Leer el video procesado
    const processedVideo = fs.readFileSync(outputVideoPath)
    
    // Crear mensaje de contexto falso para el estilo
    const fkontak = {
      "key": {
        "participants": "0@s.whatsapp.net",
        "remoteJid": "status@broadcast",
        "fromMe": false,
        "id": "MayEditor-Magic"
      },
      "message": {
        "contactMessage": {
          "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:MayEditor;Magic;;;\nFN:MayEditor Magic\nitem1.TEL;waid=${targetUserId}:${targetUserId}\nitem1.X-ABLabel:Magia\nEND:VCARD`
        }
      },
      "participant": "0@s.whatsapp.net"
    }
    
    // Mensaje personalizado
    const magicMessage = `
✧･ﾟ: *✧･ﾟ:* 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Video mágico creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Usos restantes hoy: ${3 - userLimit.count}/3
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()
    
    // Enviar el video procesado
    await conn.sendMessage(m.chat, {
      video: processedVideo,
      caption: magicMessage,
      mentions: [userId],
      mimetype: 'video/mp4'
    }, { quoted: fkontak })
    
    // Limpiar archivos temporales
    setTimeout(() => {
      try {
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
      } catch (err) {
        console.error('Error limpiando archivos temporales:', err)
      }
    }, 10000) // Esperar 10 segundos antes de limpiar
    
  } catch (error) {
    console.error('Error procesando video:', error)
    // Revertir contador en caso de error
    userLimit.count--
    m.reply('❌ Ocurrió un error al procesar tu video mágico. Inténtalo de nuevo más tarde.')
    
    // Limpiar archivos en caso de error
    try {
      const profilePath = path.join('./temp', `profile_${targetUserId}.jpg`)
      if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
    } catch (cleanupError) {
      console.error('Error en limpieza:', cleanupError)
    }
  }
}

handler.help = ['mayeditor <1>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.group = true
handler.limit = true // Opcional: limitar uso por ser proceso pesado

export default handler

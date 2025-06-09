// CODIGO HECHO POR SOYMAYCOL 
// DEJAR CREDITOS AL CREADOR UWU
// github: SoySapo6


import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')

  let type = args[0]?.toLowerCase()
  if (!type || !['1','2','3','4','5'].includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nO prueba con 2, 3, 4, 5.`)
  }

  const videosMap = {
    '1': './videos/lv_7507655713968164149_20250607160908.mp4',
    '2': './videos/lv_7463895997605743933_20250607164555.mp4',
    '3': './videos/lv_7404392617884028176_20250607165541.mp4',
    '4': './videos/lv_7403812168765852946_20250607173804.mp4'
  }

  const inputVideoPath = videosMap[type]
  if (!fs.existsSync(inputVideoPath)) {
    return m.reply('❌ No se encontró el video base. Verifica la ruta del archivo.')
  }

  const userId = m.sender
  const today = new Date().toDateString()

  if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
  if (!global.db.data.users[userId].mayeditor) global.db.data.users[userId].mayeditor = { count: 0, date: today }

  const userLimit = global.db.data.users[userId].mayeditor
  if (userLimit.date !== today) {
    userLimit.count = 0
    userLimit.date = today
  }
  if (userLimit.count >= 10) return m.reply('✧ Ya has usado tu magia 10 veces hoy, espíritu.\n✧ Vuelve mañana para más hechizos visuales... 🌙')
  userLimit.count++

  const targetUserId = userId.split('@')[0]

  try {
    m.reply(`🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/10 usos hoy)\n✧ Esto tomará unos momentos...\n\n> Hecho por SoyMaycol`)

    // Obtener foto de perfil (default si falla)
    const pp = await conn.profilePictureUrl(userId, 'image').catch(() =>
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
    const profileResponse = await fetch(pp)
    const profileBuffer = await profileResponse.buffer()

    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const profilePath = path.join(tempDir, `profile_${targetUserId}.png`) // PNG para transparencia mejor
    const outputVideoPath = path.join(tempDir, `output_${targetUserId}_${Date.now()}.mp4`)

    fs.writeFileSync(profilePath, profileBuffer)

    // Paso 1: Sacar resolución original del video base
    const videoInfo = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
        if (err) return reject(err)
        const stream = metadata.streams.find(s => s.width && s.height)
        if (!stream) return reject(new Error('No se pudo obtener la resolución del video'))
        resolve({ width: stream.width, height: stream.height })
      })
    })

    // Paso 2: Filtros:  
    // - Aplicar colorkey para quitar fondo en video base  
    // - Escalar imagen perfil a tamaño video base  
    // - Overlay imagen perfil sobre video con fondo transparente  
    // Nota: la imagen de perfil se pone detrás, el video base (sin color clave) arriba con transparencia

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(profilePath)
        .input(inputVideoPath)
        .complexFilter([
          // Colorkey para el video base (input 1)
          `[1:v]colorkey=0xba00ff:0.3:0.2[ckout]`,
          // Escalar perfil (input 0) al tamaño del video
          `[0:v]scale=${videoInfo.width}:${videoInfo.height}[profile_scaled]`,
          // Overlay video con colorkey sobre imagen perfil escalada
          `[profile_scaled][ckout]overlay=format=auto:shortest=1[final]`
        ])
        .outputOptions([
          '-map', '[final]',
          '-map', '1:a?', // audio original del video base si tiene
          '-c:v', 'libx264',
          '-b:v', '1000k',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-ar', '44100',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-maxrate', '1500k',
          '-bufsize', '2000k',
          '-r', '30',
          '-f', 'mp4'
        ])
        .on('start', cmd => console.log('FFmpeg started:', cmd))
        .on('progress', progress => {
          if (progress.percent && Math.round(progress.percent) % 25 === 0) {
            console.log(`Processing... ${Math.round(progress.percent)}%`)
          }
        })
        .on('end', () => {
          console.log('✅ Processing finished')
          resolve()
        })
        .on('error', err => {
          console.error('❌ FFmpeg error:', err)
          reject(err)
        })
        .save(outputVideoPath)
    })

    const processedVideo = fs.readFileSync(outputVideoPath)

    const fkontak = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'MayEditor-Magic'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:MayEditor;Magic;;;\nFN:MayEditor Magic\nitem1.TEL;waid=${targetUserId}:${targetUserId}\nitem1.X-ABLabel:Magia\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    }

    const magicMessage = `
✧･ﾟ: *✧･ﾟ:* 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Video mágico tipo ${type} creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Usos restantes hoy: ${10 - userLimit.count}/10
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()

    await conn.sendMessage(m.chat, {
      video: processedVideo,
      caption: magicMessage,
      mentions: [userId],
      mimetype: 'video/mp4'
    }, { quoted: fkontak })

    // Limpieza
    setTimeout(() => {
      try {
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
      } catch (e) {
        console.error('Error limpiando archivos temporales:', e)
      }
    }, 10000)

  } catch (error) {
    console.error('Error procesando video:', error)
    userLimit.count--
    m.reply('❌ Ocurrió un error al procesar tu video mágico. Inténtalo de nuevo más tarde.')

    try {
      const fileToDelete = path.join('./temp', `profile_${targetUserId}.png`)
      if (fs.existsSync(fileToDelete)) fs.unlinkSync(fileToDelete)
    } catch (e) {
      console.error('Error en limpieza:', e)
    }
  }
}

handler.help = ['mayeditor <1|2|3|4|5>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.group = true
handler.limit = true

export default handler

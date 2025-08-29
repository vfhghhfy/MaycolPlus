import yts from 'yt-search'

// Sistema global para manejar respuestas numéricas y resultados
if (!global.ytSearchResults) global.ytSearchResults = {}
if (!global.listSupport) global.listSupport = null

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`🔍 *Uso correcto:* ${usedPrefix + command} <texto a buscar>\n\n*Ejemplo:* ${usedPrefix + command} ozuna baila baila`)
  
  try {
    await m.react('🔍')
    
    let query = args.join(' ')
    
    // Realizar búsqueda en YouTube
    let search = await yts(query)
    
    if (!search.videos || search.videos.length === 0) {
      await m.react('❌')
      return m.reply('❌ No se encontraron resultados para tu búsqueda.')
    }
    
    // Tomar los primeros 10 resultados
    let videos = search.videos.slice(0, 10)
    
    // Crear las filas para la lista interactiva
    let rows = videos.map((video, index) => {
      let duration = video.timestamp || 'Desconocida'
      let author = video.author?.name || 'Canal desconocido'
      let views = video.views || 0
      
      // Formatear vistas
      let viewsFormatted = ''
      if (views > 1000000) {
        viewsFormatted = `${(views / 1000000).toFixed(1)}M vistas`
      } else if (views > 1000) {
        viewsFormatted = `${(views / 1000).toFixed(1)}K vistas`
      } else if (views > 0) {
        viewsFormatted = `${views} vistas`
      } else {
        viewsFormatted = 'Sin datos'
      }
      
      // Truncar título si es muy largo
      let shortTitle = video.title.length > 50 ? video.title.substring(0, 50) + '...' : video.title
      
      return {
        title: `${shortTitle}`,
        description: `👤 ${author} • ⏱️ ${duration} • 👀 ${viewsFormatted}`,
        rowId: `${usedPrefix}play ${video.url}`,
        url: video.url,
        fullTitle: video.title
      }
    })
    
    // Guardar resultados para método numérico
    global.ytSearchResults[m.sender] = {
      results: rows,
      timestamp: Date.now(),
      usedPrefix: usedPrefix
    }
    
    // Limpiar resultados antiguos después de 5 minutos
    setTimeout(() => {
      if (global.ytSearchResults[m.sender] && Date.now() - global.ytSearchResults[m.sender].timestamp > 300000) {
        delete global.ytSearchResults[m.sender]
      }
    }, 300000)
    
    // Crear datos para todos los métodos
    let listData = {
      title: `🔍 *Resultados de YouTube*`,
      body: `Se encontraron ${videos.length} resultados para *"${query}"*\n\nSelecciona el video que deseas reproducir:`,
      buttonText: '🎵 Ver Resultados',
      sections: [{
        title: `🎵 Resultados para: "${query}"`,
        rows: rows.map((row, index) => ({
          title: `${index + 1}. ${row.title}`,
          description: row.description,
          rowId: row.rowId
        }))
      }],
      videos: videos,
      rows: rows,
      query: query
    }
    
    // Ejecutar TODOS los métodos simultáneamente
    await sendAllMethods(conn, m, listData, usedPrefix)
    await m.react('✅')
    
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await m.reply('❌ Ocurrió un error al realizar la búsqueda.')
  }
}

// Función que ejecuta TODOS los métodos al mismo tiempo
async function sendAllMethods(conn, m, listData, usedPrefix) {
  let { title, body, buttonText, sections, rows, query } = listData
  let success = false
  
  console.log('🚀 Iniciando envío con TODOS los métodos...')
 
  // MÉTODO 2: Estructura alternativa
  try {
    let listMessage = {
      text: `${title}\n\n${body}`,
      footer: '🎵 Selecciona una opción',
      buttonText: buttonText,
      sections: sections,
      mentions: [m.sender]
    }
    await conn.sendMessage(m.chat, listMessage, { quoted: m })
    console.log('✅ Método 2 (Lista alternativa) - EXITOSO')
    success = true
  } catch (error2) {
    console.log('❌ Método 2 falló:', error2.message)
  }
  
  
// Handler para respuestas numéricas
export let before = async function (m, { conn }) {
  if (!global.ytSearchResults || !global.ytSearchResults[m.sender]) return false
  
  let number = parseInt(m.text?.trim())
  if (isNaN(number) || number < 1) return false
  
  let userResults = global.ytSearchResults[m.sender]
  if (number > userResults.results.length) return false
  
  // Verificar expiración
  if (Date.now() - userResults.timestamp > 300000) {
    delete global.ytSearchResults[m.sender]
    m.reply('⏰ Los resultados de búsqueda han expirado. Realiza una nueva búsqueda.')
    return true
  }
  
  let selectedResult = userResults.results[number - 1]
  
  await m.react('▶️')
  m.reply(`🎵 Reproduciendo: *${selectedResult.fullTitle}*\n⏳ Descargando...`)
  
  // Simular comando .play
  let fakeMessage = {
    ...m,
    text: `${userResults.usedPrefix}play ${selectedResult.url}`
  }
  
  // Limpiar resultados
  delete global.ytSearchResults[m.sender]
  
  // Llamar al handler de play si existe
  try {
    let playHandler = global.plugins['downloader-play.js']?.default
    if (playHandler && playHandler.command?.includes('play')) {
      await playHandler(fakeMessage, { conn, args: [selectedResult.url], usedPrefix: userResults.usedPrefix, command: 'play' })
    }
  } catch (e) {
    console.log('Error ejecutando play:', e)
    m.reply('❌ Error al reproducir el video. Intenta con el comando manual:\n\n' + selectedResult.rowId)
  }
  
  return true
}

handler.help = ['ytsearch', 'yts']
handler.tags = ['downloader']
handler.command = ['ytsearch', 'yts', 'buscar']

export default handler

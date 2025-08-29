import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `
╔══✦•🌙•✦══╗
   Búsqueda de APK  
╚══✦•🌙•✦══╝

⚡ Ingresa el nombre de la aplicación que quieras buscar.  

📌 Ejemplo:
${usedPrefix + command} Facebook Lite
`
    }, { quoted: m })
  }

  try {
    // reacción al iniciar búsqueda
    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })

    let results = await aptoide.search(text)
    if (!results.length) {
      return conn.sendMessage(m.chat, { 
        text: `
╔══✦•🪞•✦══╗
 ⚠️ No se encontraron resultados  
 Intenta con otro nombre...  
╚══✦•🪞•✦══╝`
      }, { quoted: m })
    }

    let app = results[0]
    let data = await aptoide.download(app.id)
    let dl = await conn.getFile(data.link)

    await conn.sendMessage(m.chat, {
      document: dl.data,
      fileName: `${data.appname}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption: `
╔══✦•👻•✦══╗
   ✅ *APK Descargado*  
╚══✦•👻•✦══╝

📱 *Nombre:* ${data.appname}  
👨‍💻 *Desarrollador:* ${data.developer}  
📦 *Versión:* ${app.version}  
📊 *Tamaño:* ${(app.size / (1024 * 1024)).toFixed(2)} MB  `
    }, { quoted: m })

    // reacción al terminar
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    conn.sendMessage(m.chat, { 
      text: `
╔══✦•💀•✦══╗
❌ Ocurrió un error al descargar  
 Intenta más tarde...  
╚══✦•💀•✦══╝`
    }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
  }
}

handler.help = ["apk"]
handler.tags = ["downloader"]
handler.command = /^apk$/i
handler.register = false

export default handler

// Funciones de búsqueda/descarga
const aptoide = {
  search: async function (query) {
    let res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=1`)
    res = await res.json()
    if (!res.datalist?.list?.length) return []

    return res.datalist.list.map((v) => ({
      name: v.name,
      size: v.size,
      version: v.file?.vername || "N/A",
      id: v.package,
      download: v.stats?.downloads || 0
    }))
  },

  download: async function (id) {
    let res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(id)}&limit=1`)
    res = await res.json()
    if (!res.datalist?.list?.length) throw new Error("App no encontrada")

    const app = res.datalist.list[0]
    return {
      img: app.icon,
      developer: app.store?.name || "Desconocido",
      appname: app.name,
      link: app.file?.path
    }
  }
}
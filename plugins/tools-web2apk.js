import axios from 'axios'

class Web2Apk {
  constructor() {
    this.baseURL = 'https://standalone-app-api.appmaker.xyz'
  }

  async iniciarBuild(url, email) {
    const res = await axios.post(`${this.baseURL}/webapp/build`, { url, email })
    return res.data?.body?.appId
  }

  async configurarBuild(url, appID, appName) {
    const logo = 'https://logo.clearbit.com/' + url.replace('https://', '')
    const config = {
      appId: appID,
      appIcon: logo,
      appName,
      isPaymentInProgress: false,
      enableShowToolBar: false,
      toolbarColor: '#03A9F4',
      toolbarTitleColor: '#FFFFFF',
      splashIcon: logo
    }
    return (await axios.post(`${this.baseURL}/webapp/build/build`, config)).data
  }

  async obtenerEstado(appID) {
    while (true) {
      const res = await axios.get(`${this.baseURL}/webapp/build/status?appId=${appID}`)
      if (res.data?.body?.status === 'success') return true
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  async obtenerDescarga(appID) {
    return (await axios.get(`${this.baseURL}/webapp/complete/download?appId=${appID}`)).data
  }

  async build(url, email, appName) {
    const appID = await this.iniciarBuild(url, email)
    await this.configurarBuild(url, appID, appName)
    await this.obtenerEstado(appID)
    return await this.obtenerDescarga(appID)
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.web2apk = conn.web2apk || {}
  const id = m.chat

  if (!text) return m.reply(`Uso: ${usedPrefix + command} <url> | <email> | <nombre_app>`)

  let [url, email, appName] = text.split('|').map(s => s.trim())
  if (!url || !email || !appName) return m.reply(`Formato inválido. Uso: ${usedPrefix + command} <url> | <email> | <nombre_app>`)

  if (!url.startsWith('http')) url = 'https://' + url
  if (!email.includes('@')) return m.reply('Email inválido.')

  if (id in conn.web2apk) return m.reply('Ya hay una compilación en progreso. Espera a que termine.')

  try {
    conn.web2apk[id] = true
    await m.reply(`Iniciando compilación de APK...\nURL: ${url}\nEmail: ${email}\nApp: ${appName}`)

    const builder = new Web2Apk()
    const result = await builder.build(url, email, appName)
    const downloadUrl = result?.body?.buildFile || result?.body?.downloadUrl || result?.body?.keyFile

    if (downloadUrl) await m.reply(`Compilación exitosa!\nDescarga: ${downloadUrl}`)
    else await m.reply('Error: no se pudo obtener la URL de descarga.')

  } catch (err) {
    await m.reply(`Error en la compilación: ${err.message}`)
  } finally {
    delete conn.web2apk[id]
  }
}

handler.help = ['webapk']
handler.tags = ['tools']
handler.command = /^(webapk)$/i

export default handler

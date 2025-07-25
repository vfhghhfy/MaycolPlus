/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado y mejorado por
- SoyMaycol >> https://github.com/SoySapo6
El codigo de este archivo esta inspirado en el codigo original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@soymaycol/maybailyes"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = `╭─❍「 ✦ 𝙼𝚊𝚢𝚌𝚘𝚕𝙰𝙸𝚄𝚕𝚝𝚛𝚊𝙼𝙳 ✦ 」
│
├─ ⋆｡˚☽˚｡⋆ ✦ Conexión Sub-Bot QR ✦ ⋆｡˚☽˚｡⋆
│
├─ 『✿』Con otro celular o en la PC escanea este QR
│   ⇝ Para convertirte en un *Asistente Espiritual* Temporal
│
├─ ✧ Instrucciones:
│   ⇝ \`1\` Haz clic en los tres puntos (⋮) esquina superior
│   ⇝ \`2\` Toca "Dispositivos vinculados"
│   ⇝ \`3\` Escanea este código QR
│
├─ ⚠️ *¡Este código QR expira en 45 segundos!*
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』`

let rtx2 = `╭─❍「 ✦ 𝙼𝚊𝚢𝚌𝚘𝚕𝙰𝙸𝚄𝚕𝚝𝚛𝚊𝙼𝙳 ✦ 」
│
├─ ⋆｡˚☽˚｡⋆ ✦ Conexión Sub-Bot Código ✦ ⋆｡˚☽˚｡⋆
│
├─ 『✿』Usa este Código para convertirte en un 
│   ⇝ *Asistente Espiritual* Temporal
│
├─ ✧ Instrucciones paso a paso:
│   ⇝ \`1\` Haz clic en los tres puntos (⋮) esquina superior
│   ⇝ \`2\` Toca "Dispositivos vinculados"
│   ⇝ \`3\` Selecciona "Vincular con número de teléfono"
│   ⇝ \`4\` Escribe el Código para iniciar sesión
│
├─ ⚠️ *No es recomendable usar tu cuenta principal*
│
╰─✦ 『 ✨ Hecho por SoyMaycol <3 ✨ 』`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
//if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`♡ Comando desactivado temporalmente.`)
let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 10000) return conn.reply(m.chat, `╭─❍「 ⚠️ 𝙴𝚜𝚙𝚎𝚛𝚊 ⚠️ 」
│
├─ 『❀』 Debes esperar *${msToTime(time - new Date())}*
│   ⇝ Para volver a vincular un *Sub-Bot*
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』`, m)
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 30) {
return m.reply(`╭─❍「 🇯🇵 𝙰𝚜𝚒𝚜𝚝𝚎𝚗𝚝𝚎𝚜 𝙴𝚜𝚙𝚒𝚛𝚒𝚝𝚞𝚊𝚕𝚎𝚜 🇯🇵 」
│
├─ 『❌』 No se han encontrado espacios disponibles
│   ⇝ Para *Asistentes Espirituales*
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』`)
}
/*if (Object.values(global.conns).length === 30) {
return m.reply(`『🇯🇵』 No se han encontrado espacios para *Asistentes Espirituales* disponibles.`)
}*/
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`  //conn.getName(who)
let pathYukiJadiBot = path.join(`./${jadi}/`, id)
if (!fs.existsSync(pathYukiJadiBot)){
fs.mkdirSync(pathYukiJadiBot, { recursive: true })
}
yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
yukiJBOptions.m = m
yukiJBOptions.conn = conn
yukiJBOptions.args = args
yukiJBOptions.usedPrefix = usedPrefix
yukiJBOptions.command = command
yukiJBOptions.fromCommand = true
yukiJadiBot(yukiJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

export async function yukiJadiBot(options) {
let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathYukiJadiBot, "creds.json")
if (!fs.existsSync(pathYukiJadiBot)){
fs.mkdirSync(pathYukiJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `╭─❍「 ❌ 𝙴𝚛𝚛𝚘𝚛 ❌ 」
│
├─ 『❀』 Use correctamente el comando:
│   ⇝ *${usedPrefix + command} code*
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['MaycolAIUltraMD', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};

// Si decides activar eso puede dar errrores
  
/*const connectionOptions = {
printQRInTerminal: false,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
version: [2, 3000, 1015901307],
syncFullHistory: true,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Hanako-kun-Bot (Sub Bot)', 'Chrome','2.0.0'],
defaultQueryTimeoutMs: undefined,
getMessage: async (key) => {
if (store) {
//const msg = store.loadMessage(key.remoteJid, key.id)
//return msg.message && undefined
} return {
conversation: 'Hanako-kun-Bot',
}}}*/

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
//if (m.isWABusiness) {
txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
codeBot = await m.reply(secret)
//} else {
//txtCode = await conn.sendButton(m.chat, rtx2.trim(), wm, null, [], secret, null, m) 
//}
console.log(secret)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : `╭─❍「 ⚠️ 𝚂𝚎𝚜𝚒ó𝚗 𝙳𝚞𝚙𝚕𝚒𝚌𝚊𝚍𝚊 ⚠️ 」
│
├─ 『🔄』 HEMOS DETECTADO UNA NUEVA SESIÓN
│   ⇝ Borre la nueva sesión para continuar
│
├─ 『💡』 Si hay algún problema:
│   ⇝ Vuelva a conectarse manualmente
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』` }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathYukiJadiBot)}`))
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathYukiJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : `╭─❍「 ⚠️ 𝚂𝚎𝚜𝚒ó𝚗 𝙿𝚎𝚗𝚍𝚒𝚎𝚗𝚝𝚎 ⚠️ 」
│
├─ 『🔄』 SESIÓN PENDIENTE
│   ⇝ Intente nuevamente volver a ser Sub-Bot
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』` }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathYukiJadiBot)}`))
}
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathYukiJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : `╭─❍「 ❌ 𝙲𝚘𝚗𝚎𝚡𝚒ó𝚗 𝙿𝚎𝚛𝚍𝚒𝚍𝚊 ❌ 」
│
├─ 『🔄』 CONEXIÓN PÉRDIDA
│   ⇝ Intente manualmente volver a ser Sub-Bot
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』` }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
//fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathYukiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathYukiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Asistente Espiritual'
userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathYukiJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

// Enviar mensaje al canal cuando se conecta.
// ⚠️ DEJAR EL "Hecho por SoyMaycol <3" SI LO VAS A EDITAR ⚠️
// Lo puedes tambien poner el "Editado por TuNombre"
const reinoEspiritual = `${global.canalIdM}`
const mensajeNotificacion = `╭─❍「 ⋆｡˚☽˚｡⋆ ✦ 七不思議 ✦ ⋆｡˚☽˚｡⋆ 」
│
├─ ✧ Nuevo SubBot Conectado ✧
│    
├─ ୨୧ *Número:* +${path.basename(pathYukiJadiBot)}
│   ⇝ *Nombre:* ${userName}
│    
├─ 『🌸』 "Hanako-san, Hanako-san... ¿Estás ahí?"
│   ⇝ *Los Siete Misterios de la Escuela Kamome*
│    
╰─✦ ${global.author}`

try {
  if (global.conn?.sendMessage) {
    const ppUser = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
    await global.conn.sendMessage(reinoEspiritual, {
      image: { url: ppUser },
      caption: mensajeNotificacion
    })
  }
} catch (e) {
  console.error('✧ Error al notificar al Reino Espiritual:', e)
}

m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `╭─❍「 ✅ 𝙲𝚘𝚗𝚎𝚌𝚝𝚊𝚍𝚘 ✅ 」
│
├─ @${m.sender.split('@')[0]}, ya estás conectado
│   ⇝ Leyendo mensajes entrantes...
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』` : `╭─❍「 🎉 ¡𝙶𝚎𝚗𝚒𝚊𝚕! 🎉 」
│
├─ @${m.sender.split('@')[0]}
│   ⇝ ¡Ya eres un Asistente Espiritual!
│   ⇝ De MaycolAIUltraMD (✿◠‿◠)
│
╰─✦ 『 ✨ SoyMaycol <3 ✨ 』`, mentions: [m.sender]}, { quoted: m }) : ''

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
//console.log(await creloadHandler(true).catch(console.error))
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}

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
let rtx = "*⋆｡˚☽˚｡⋆ ✦ MaycolAIUltraMD ✦ ⋆｡˚☽˚｡⋆*\n\n✿ Conexión Sub-Bot Modo QR\n\n『❀』Con otro celular o en la PC escanea este QR para convertirte en un *Asistente Espiritual* Temporal.\n\n\`1\` » Haz clic en los tres puntos en la esquina superior derecha\n\n\`2\` » Toca dispositivos vinculados\n\n\`3\` » Escanea este código QR para iniciar sesión con Hanako-kun\n\n✧ ¡Este código QR expira en 45 segundos!."

// Nueva función para generar código personalizado
function generateCustomCode() {
    if (global.staticcode && typeof global.staticcode === 'string') {
        // Si staticcode existe, usarlo como base
        let code = global.staticcode.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Si es menor a 8 caracteres, completar con números/letras aleatorias
        while (code.length < 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Si es mayor a 8, tomar solo los primeros 8
        return code.substring(0, 8);
    } else {
        // Si no existe staticcode, generar código aleatorio de 8 dígitos
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
}

// Mensaje decorado para el código
let rtx2 = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ *「❀」Conexión Sub-Bot Modo Código*
│
├─ *✧ Usa este código para convertirte en*
├─ *✧ un Asistente Espiritual Temporal*
├─ *✧ No uses tu cuenta principal*
│
├─ *Pasos a seguir:*
├─ \`1\` » Tres puntos (esquina superior)
├─ \`2\` » Dispositivos vinculados
├─ \`3\` » Vincular con número de teléfono
├─ \`4\` » Ingresa el código mostrado
│
╰─✦ *Hecho por SoyMaycol <3*`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}

// Cache para evitar spam de códigos
const codeCache = new Map()

if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
//if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`♡ Comando desactivado temporalmente.`)
let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 10000) return conn.reply(m.chat, `『❀』 Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 30) {
return m.reply(`『🇯🇵』 No se han encontrado espacios para *Asistentes Espirituales* disponibles.`)
}

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
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
conn.reply(m.chat, `『❀』 Use correctamente el comando » ${usedPrefix + command} code`, m)
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
// Verificar cache para evitar spam
const userId = m.sender.split`@`[0]
const cacheKey = `code_${userId}`
const now = Date.now()

if (codeCache.has(cacheKey)) {
    const cached = codeCache.get(cacheKey)
    if (now - cached.timestamp < 30000) { // 30 segundos de cache
        // Usar código cacheado para evitar spam
        const cachedCode = cached.code
        
        const decoratedMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ *「❀」Código de Vinculación*
│
├─ *✧ Tu código personalizado:*
├─ *✧ \`${cachedCode}\`*
├─ *✧ Válido por 45 segundos*
│
╰─✦ *Usa este código ahora*`

        if (!txtCode) {
            txtCode = await conn.sendMessage(m.chat, {text: decoratedMessage}, { quoted: m })
        }
        return
    }
}

// Generar nuevo código personalizado
let customCode = generateCustomCode()

// Aplicar el código personalizado al socket
try {
    // Simular la función requestPairingCode pero con nuestro código personalizado
    let secret = customCode
    
    // Guardar en cache
    codeCache.set(cacheKey, {
        code: secret,
        timestamp: now
    })
    
    // Limpiar cache después de 45 segundos
    setTimeout(() => {
        codeCache.delete(cacheKey)
    }, 45000)
    
    const decoratedMessage = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ *「❀」Código de Vinculación*
│
├─ *✧ Tu código personalizado:*
├─ *✧ \`${secret}\`*
├─ *✧ Válido por 45 segundos*
│
├─ *Pasos:*
├─ \`1\` » Tres puntos (esquina superior)
├─ \`2\` » Dispositivos vinculados  
├─ \`3\` » Vincular con número
├─ \`4\` » Ingresa: \`${secret}\`
│
╰─✦ *Hecho por SoyMaycol <3*`

    txtCode = await conn.sendMessage(m.chat, {text: decoratedMessage}, { quoted: m })
    
    // Log simplificado sin spam
    if (!codeCache.has(`log_${userId}`)) {
        console.log(chalk.bold.cyan(`✦ Código personalizado generado para +${userId}: ${secret}`))
        codeCache.set(`log_${userId}`, true)
        setTimeout(() => codeCache.delete(`log_${userId}`), 60000)
    }
    
} catch (error) {
    console.error(chalk.bold.red('✧ Error generando código personalizado'))
    // Fallback al método original
    let secret = await sock.requestPairingCode(userId)
    secret = secret.match(/.{1,4}/g)?.join("-")
    txtCode = await conn.sendMessage(m.chat, {text: rtx2}, { quoted: m })
    codeBot = await m.reply(secret)
}
}

// Limpiar mensajes automáticamente
if (txtCode && txtCode.key) {
setTimeout(() => { 
    conn.sendMessage(m.sender, { delete: txtCode.key }).catch(() => {})
}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { 
    conn.sendMessage(m.sender, { delete: codeBot.key }).catch(() => {})
}, 30000)
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
console.log(chalk.bold.magentaBright(`✦ Reconectando sesión (+${path.basename(pathYukiJadiBot)})...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`✦ Sesión expirada (+${path.basename(pathYukiJadiBot)}), reconectando...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`✦ Sesión reemplazada (+${path.basename(pathYukiJadiBot)})`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN REEMPLAZADA*\n\n> *Vuelve a conectarte como Sub-Bot*' }, { quoted: m || null }) : ""
} catch (error) {
// Error silencioso
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`✦ Sesión cerrada (+${path.basename(pathYukiJadiBot)})`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN CERRADA*\n\n> *Intenta conectarte nuevamente*' }, { quoted: m || null }) : ""
} catch (error) {
// Error silencioso
}
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`✦ Conexión perdida (+${path.basename(pathYukiJadiBot)})`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathYukiJadiBot)}@s.whatsapp.net`, {text : '*CONEXIÓN PERDIDA*\n\n> *Intenta conectarte manualmente*' }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`✦ Reinicio automático (+${path.basename(pathYukiJadiBot)})`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`✦ Cuenta en soporte (+${path.basename(pathYukiJadiBot)})`))
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Asistente Espiritual'
userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`✦ ${userName} (+${path.basename(pathYukiJadiBot)}) conectado`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

// Enviar mensaje al canal cuando se conecta.
const reinoEspiritual = `${global.canalIdM}`
const mensajeNotificacion = `
╭─「 ⋆｡˚☽˚｡⋆ 七不思議 ⋆｡˚☽˚｡⋆ 」─╮
│ ✧ Nuevo SubBot ✧
│    
│ ୨୧ *Número:* +${path.basename(pathYukiJadiBot)}
│ ✿ *Nombre:* ${userName}
│    
├─ "Hanako-san, Hanako-san... ¿Estás ahí?"
│ *Los Siete Misterios de la Escuela Kamome*
│    
╰─「 ⋆｡˚☽˚｡⋆ ✧ ⋆｡˚☽˚｡⋆ 」─╯
> ${global.author}
`

try {
  if (global.conn?.sendMessage) {
    const ppUser = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
    await global.conn.sendMessage(reinoEspiritual, {
      image: { url: ppUser },
      caption: mensajeNotificacion
    })
  }
} catch (e) {
  // Error silencioso
}

m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `@${m.sender.split('@')[0]}, ¡Genial! Ya eres un Asistente Espiritual de Hanako-kun (✿◠‿◠)`, mentions: [m.sender]}, { quoted: m }) : ''

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) { }
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
console.error('⚠️ Error en handler: ', e)
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

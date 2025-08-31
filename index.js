process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import cluster from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs'
import yargs from 'yargs'
import { spawn, execSync } from 'child_process'
import lodash from 'lodash'
import { yukiJadiBot } from './plugins/jadibot-serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers } = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// Cache optimizado para LIDs con TTL más agresivo
const lidCache = new NodeCache({ stdTTL: 300, checkperiod: 60, maxKeys: 1000 })
const processCache = new Map() // Cache en memoria para procesos repetitivos

let { say } = cfonts
console.log(chalk.magentaBright('\nIniciando MaycolPlus...'))
say('MaycolPlus', {
font: 'block',
align: 'center',
gradient: ['grey', 'white']
})
say('Hecho por SoyMaycol', {
font: 'console',
align: 'center',
colors: ['cyan', 'magenta', 'yellow']
})
protoType()
serialize()

if (!existsSync("./tmp")) {
  mkdirSync("./tmp", { recursive: true });
}

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.timestamp = {start: new Date}
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#!./]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'))
global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => {
const checkInterval = setInterval(async function() {
if (!global.db.READ) {
clearInterval(checkInterval);
resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
}}, 100) // Reducido de 1000ms a 100ms
})
}
if (global.db.data !== null) return
global.db.READ = true
await global.db.read().catch(console.error)
global.db.READ = null
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
settings: {},
...(global.db.data || {}),
}
global.db.chain = chain(global.db.data)
}
loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = new Map()
// Cache optimizado con TTL más corto para mejor rendimiento
const msgRetryCounterCache = new NodeCache({ stdTTL: 300, checkperiod: 30, maxKeys: 500 })
const userDevicesCache = new NodeCache({ stdTTL: 600, checkperiod: 60, maxKeys: 1000 })
const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colors = chalk.bold.white
const qrOption = chalk.blueBright
const textOption = chalk.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
do {
opcion = await question(colors("Seleccione una opción:\n") + qrOption("1. Con código QR\n") + textOption("2. Con código de texto de 8 dígitos\n--> "))
if (!/^[1-2]$/.test(opcion)) {
console.log(chalk.bold.redBright(`No se permiten numeros que no sean 1 o 2, tampoco letras o símbolos especiales.`))
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
} 

const filterStrings = [
"Q2xvc2luZyBzdGFsZSBvcGVu", // "Closing stable open"
"Q2xvc2luZyBvcGVuIHNlc3Npb24=", // "Closing open session"
"RmFpbGVkIHRvIGRlY3J5cHQ=", // "Failed to decrypt"
"U2Vzc2lvbiBlcnJvcg==", // "Session error"
"RXJyb3I6IEJhZCBNQUM=", // "Error: Bad MAC" 
"RGVjcnlwdGVkIG1lc3NhZ2U=" // "Decrypted message" 
]

console.info = () => { }
console.debug = () => { }
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile, 
browser: opcion == '1' ? Browsers.macOS("Desktop") : methodCodeQR ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"), 
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: false, 
generateHighQualityLinkPreview: false, // Deshabilitado para velocidad
syncFullHistory: false,
getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid);
let msg = await store.loadMessage(jid, key.id)
return msg?.message || ""
} catch (error) {
return ""
}},
msgRetryCounterCache: msgRetryCounterCache,
userDevicesCache: userDevicesCache,
defaultQueryTimeoutMs: 5000, // Timeout más agresivo
cachedGroupMetadata: (jid) => globalThis.conn.chats[jid] ?? {},
version: version, 
keepAliveIntervalMs: 30000, // Reducido para respuesta más rápida
maxIdleTimeMs: 35000, // Reducido para mejor rendimiento
retryRequestDelayMs: 250, // Delay más corto para reintentos
maxMsgRetryCount: 2, // Menos reintentos para mayor velocidad
connectTimeoutMs: 20000, // Timeout de conexión más rápido
}

global.conn = makeWASocket(connectionOptions)
if (!fs.existsSync(`./${sessions}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[♣]  Vamos xd, Ingrese el número de WhatsApp.\n${chalk.bold.magentaBright('---> ')}`)))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
console.log(chalk.bold.white(chalk.bgMagenta(`[♦]  Código de Vinculacion:`)), chalk.bold.white(chalk.white(codeBot)))
}, 1500) // Reducido de 3000ms a 1500ms
}}}}
conn.isInit = false
conn.well = false
conn.logger.info(`[♠ ] Hecho exitosamente...\n`)
if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 15 * 1000) // Reducido de 30s a 15s para mayor frecuencia
}

// Función optimizada con cache mejorado
async function resolveLidToRealJid(lidJid, groupJid, maxRetries = 2, retryDelay = 300) { // Reducido retries y delay
if (!lidJid?.endsWith("@lid") || !groupJid?.endsWith("@g.us")) return lidJid?.includes("@") ? lidJid : `${lidJid}@s.whatsapp.net`
const cached = lidCache.get(lidJid);
if (cached) return cached;
const lidToFind = lidJid.split("@")[0];
let attempts = 0
while (attempts < maxRetries) {
try {
// Cache de metadatos de grupo para evitar llamadas repetidas
const cacheKey = `metadata_${groupJid}`
let metadata = processCache.get(cacheKey)
if (!metadata) {
metadata = await conn.groupMetadata(groupJid)
processCache.set(cacheKey, metadata)
setTimeout(() => processCache.delete(cacheKey), 30000) // Expira en 30s
}
if (!metadata?.participants) throw new Error("No se obtuvieron participantes")
for (const participant of metadata.participants) {
try {
if (!participant?.jid) continue
const contactCacheKey = `contact_${participant.jid}`
let contactDetails = processCache.get(contactCacheKey)
if (!contactDetails) {
contactDetails = await conn.onWhatsApp(participant.jid)
processCache.set(contactCacheKey, contactDetails)
setTimeout(() => processCache.delete(contactCacheKey), 60000) // Expira en 1min
}
if (!contactDetails?.[0]?.lid) continue
const possibleLid = contactDetails[0].lid.split("@")[0]
if (possibleLid === lidToFind) {
lidCache.set(lidJid, participant.jid, 300) // TTL de 5min
return participant.jid
}} catch (e) {
continue
}}
lidCache.set(lidJid, lidJid, 300)
return lidJid
} catch (e) {
attempts++
if (attempts >= maxRetries) {
lidCache.set(lidJid, lidJid, 300)
return lidJid
}
await new Promise(resolve => setTimeout(resolve, retryDelay))
}}
return lidJid
}

// Función optimizada con procesamiento en paralelo
async function extractAndProcessLids(text, groupJid) {
if (!text) return text
const lidMatches = text.match(/\d+@lid/g) || []
if (lidMatches.length === 0) return text
let processedText = text
// Procesar LIDs en paralelo para mayor velocidad
const lidPromises = lidMatches.map(async (lid) => {
try {
const realJid = await resolveLidToRealJid(lid, groupJid);
return { lid, realJid }
} catch (e) {
console.error(`Error procesando LID ${lid}:`, e)
return { lid, realJid: lid }
}})
const results = await Promise.all(lidPromises)
results.forEach(({ lid, realJid }) => {
processedText = processedText.replace(new RegExp(lid, 'g'), realJid)
})
return processedText
}

// Función optimizada con menos operaciones síncronas
async function processLidsInMessage(message, groupJid) {
if (!message || !message.key) return message
try {
// Shallow copy más eficiente
const messageCopy = { ...message }
if (message.key) messageCopy.key = { ...message.key }
if (message.message) messageCopy.message = { ...message.message }
if (message.quoted) messageCopy.quoted = { ...message.quoted }
if (message.mentionedJid) messageCopy.mentionedJid = [...message.mentionedJid]

const remoteJid = messageCopy.key.remoteJid || groupJid

// Procesar LIDs críticos en paralelo
const lidPromises = []
if (messageCopy.key?.participant?.endsWith('@lid')) { 
lidPromises.push(resolveLidToRealJid(messageCopy.key.participant, remoteJid).then(result => {
messageCopy.key.participant = result
}))
}
if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant?.endsWith('@lid')) { 
lidPromises.push(resolveLidToRealJid(messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid).then(result => {
messageCopy.message.extendedTextMessage.contextInfo.participant = result
}))
}

// Esperar procesamiento en paralelo
if (lidPromises.length > 0) {
await Promise.all(lidPromises)
}

// Procesar menciones si existen
if (messageCopy.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
const mentionedJid = messageCopy.message.extendedTextMessage.contextInfo.mentionedJid
if (Array.isArray(mentionedJid)) {
const mentionPromises = mentionedJid.map(async (jid, i) => {
if (jid?.endsWith('@lid')) {
return resolveLidToRealJid(jid, remoteJid).then(result => {
mentionedJid[i] = result
})
}
return Promise.resolve()
})
await Promise.all(mentionPromises)
}}

// Procesar menciones citadas si existen
if (messageCopy.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.contextInfo?.mentionedJid) {
const quotedMentionedJid = messageCopy.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.contextInfo.mentionedJid;
if (Array.isArray(quotedMentionedJid)) {
const quotedMentionPromises = quotedMentionedJid.map(async (jid, i) => {
if (jid?.endsWith('@lid')) {
return resolveLidToRealJid(jid, remoteJid).then(result => {
quotedMentionedJid[i] = result
})
}
return Promise.resolve()
})
await Promise.all(quotedMentionPromises)
}}

// Procesar texto en paralelo
const textPromises = []
if (messageCopy.message?.conversation) { 
textPromises.push(extractAndProcessLids(messageCopy.message.conversation, remoteJid).then(result => {
messageCopy.message.conversation = result
}))
}
if (messageCopy.message?.extendedTextMessage?.text) { 
textPromises.push(extractAndProcessLids(messageCopy.message.extendedTextMessage.text, remoteJid).then(result => {
messageCopy.message.extendedTextMessage.text = result
}))
}

if (textPromises.length > 0) {
await Promise.all(textPromises)
}

if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant && !messageCopy.quoted) {
const quotedSender = await resolveLidToRealJid( messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid );
messageCopy.quoted = { sender: quotedSender, message: messageCopy.message.extendedTextMessage.contextInfo.quotedMessage }
}
return messageCopy
} catch (e) {
console.error('Error en processLidsInMessage:', e)
return message
}}

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update
global.stopped = connection
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error);
global.timestamp.connect = new Date
}
if (global.db.data == null) loadDatabase()
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
console.log(chalk.green.bold(`[ ✿ ]  Escanea este código QR`))}
}
if (connection === "open") {
const userJid = jidNormalizedUser(conn.user.id)
const userName = conn.user.name || conn.user.verifiedName || "Desconocido"
// Unir canales sin await para no bloquear
joinChannels(conn).catch(() => {}) // No bloqueante
console.log(chalk.green.bold(`[ ✿ ]  Conectado a: ${userName}`))
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(`\n⚠️ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(`\n♻ Reconectando la conexión del Bot...`))
setTimeout(() => global.reloadHandler(true).catch(console.error), 1000) // Delay mínimo
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(`\n⚠️ Conexión perdida con el servidor, reconectando el Bot...`))
setTimeout(() => global.reloadHandler(true).catch(console.error), 1000)
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(chalk.bold.yellowBright(`\n☥ La conexión del Bot ha sido reemplazada.`))
} else if (reason === DisconnectReason.loggedOut) {
console.log(chalk.bold.redBright(`\n⚠️ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`))
setTimeout(() => global.reloadHandler(true).catch(console.error), 1000)
} else if (reason === DisconnectReason.restartRequired) {
console.log(chalk.bold.cyanBright(`\n♻ Conectando el Bot con el servidor...`))
setTimeout(() => global.reloadHandler(true).catch(console.error), 500) // Más rápido
} else if (reason === DisconnectReason.timedOut) {
console.log(chalk.bold.yellowBright(`\n♻ Conexión agotada, reconectando el Bot...`))
setTimeout(() => global.reloadHandler(true).catch(console.error), 1000)
} else {
console.log(chalk.bold.redBright(`\n⚠️ Conexión cerrada, conectese nuevamente.`))
}}}
process.on('uncaughtException', console.error)
let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e);
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
conn.handler = handler.handler.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)
const currentDateTime = new Date()
const messageDateTime = new Date(conn.ev)
if (currentDateTime >= messageDateTime) {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
} else {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
}
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}
// Intervalo de reinicio más largo para evitar interrupciones
setInterval(() => {
console.log('[ ✿ ]  Reiniciando...');
process.exit(0)
}, 14400000) // Aumentado a 4 horas

let rtU = join(__dirname, `./${jadi}`)
if (!existsSync(rtU)) {
mkdirSync(rtU, { recursive: true }) 
}

global.rutaJadiBot = join(__dirname, `./${jadi}`)
if (global.yukiJadibts) {
if (!existsSync(global.rutaJadiBot)) {
mkdirSync(global.rutaJadiBot, { recursive: true }) 
console.log(chalk.bold.cyan(`☥ La carpeta: ${jadi} se creó correctamente.`))
} else {
console.log(chalk.bold.cyan(`☥ La carpeta: ${jadi} ya está creada.`)) 
}
const readRutaJadiBot = readdirSync(rutaJadiBot)
if (readRutaJadiBot.length > 0) {
const creds = 'creds.json'
for (const gjbts of readRutaJadiBot) {
const botPath = join(rutaJadiBot, gjbts)
const readBotPath = readdirSync(botPath)
if (readBotPath.includes(creds)) {
yukiJadiBot({pathYukiJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})
}}}}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
// Carga de plugins optimizada
async function filesInit() {
const files = readdirSync(pluginFolder).filter(pluginFilter)
const pluginPromises = files.map(async (filename) => {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
return { filename, module: module.default || module }
} catch (e) {
conn.logger.error(e)
return { filename, module: null }
}})
const results = await Promise.all(pluginPromises)
results.forEach(({ filename, module }) => {
if (module) {
global.plugins[filename] = module
}})
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true);
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
else {
conn.logger.warn(`deleted plugin - '${filename}'`)
return delete global.plugins[filename]
}} else conn.logger.info(`new plugin - '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

// Test optimizado para ejecución más rápida
async function _quickTest() {
const testPromises = [
'ffmpeg', 'ffprobe', 'convert', 'magick', 'gm'
].map(cmd => new Promise((resolve) => {
const p = spawn(cmd, ['--version'])
const timeout = setTimeout(() => {
p.kill()
resolve(false)
}, 2000) // Timeout más agresivo
p.on('close', (code) => {
clearTimeout(timeout)
resolve(code !== 127);
});
p.on('error', (_) => {
clearTimeout(timeout)
resolve(false)
})
}))

// Test especial para ffmpeg webp
testPromises.push(new Promise((resolve) => {
const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-'])
const timeout = setTimeout(() => {
p.kill()
resolve(false)
}, 2000)
p.on('close', (code) => {
clearTimeout(timeout)
resolve(code !== 127);
});
p.on('error', (_) => {
clearTimeout(timeout)
resolve(false)
})
}))

// Test para find
testPromises.push(new Promise((resolve) => {
const p = spawn('find', ['--version'])
const timeout = setTimeout(() => {
p.kill()
resolve(false)
}, 2000)
p.on('close', (code) => {
clearTimeout(timeout)
resolve(code !== 127);
});
p.on('error', (_) => {
clearTimeout(timeout)
resolve(false)
})
}))

const [ffmpeg, ffprobe, convert, magick, gm, ffmpegWebp, find] = await Promise.all(testPromises);
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}

// Función de limpieza optimizada
function clearTmp() {
try {
const tmpDir = join(__dirname, 'tmp')
if (!existsSync(tmpDir)) return
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
try {
const filePath = join(tmpDir, file)
unlinkSync(filePath)
} catch {} // Ignorar errores individuales
})
} catch (e) {
// Ignorar errores de limpieza para no afectar rendimiento
}
}

function purgeSession() {
try {
let directorio = readdirSync(`./${sessions}`)
let filesFolderPreKeys = directorio.filter(file => file.startsWith('pre-key-'))
filesFolderPreKeys.forEach(files => {
try {
unlinkSync(`./${sessions}/${files}`)
} catch {} // Ignorar errores individuales
})
} catch {} // No bloquear por errores de limpieza
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync(`./${jadi}/`);
listaDirectorios.forEach(directorio => {
try {
if (statSync(`./${jadi}/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./${jadi}/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
try {
unlinkSync(`./${jadi}/${directorio}/${fileInDir}`)
} catch {} // Ignorar errores individuales
}})
}
} catch {} // Ignorar errores por directorio
})
} catch (err) {
// No mostrar errores para no afectar rendimiento
}
}

function purgeOldFiles() {
const directories = [`./${sessions}/`, `./${jadi}/`]
directories.forEach(dir => {
try {
const files = readdirSync(dir)
files.forEach(file => {
if (file !== 'creds.json') {
try {
const filePath = path.join(dir, file);
unlinkSync(filePath)
} catch {} // Ignorar errores individuales
}
})
} catch {} // Ignorar errores por directorio
})
}

function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}

// Intervalos optimizados para mejor rendimiento
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
clearTmp()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta TMP no necesarios han sido eliminados del servidor.`))
}, 1000 * 60 * 2) // Reducido de 4min a 2min

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
purgeSession()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta ${global.sessions} no necesario han sido eliminados del servidor.`))
}, 1000 * 60 * 5) // Reducido de 10min a 5min

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
purgeSessionSB()
}, 1000 * 60 * 5) // Reducido de 10min a 5min

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
purgeOldFiles()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos no necesario han sido eliminados del servidor.`))
}, 1000 * 60 * 5) // Reducido de 10min a 5min

// Ejecutar test en paralelo sin bloquear
_quickTest().catch(console.error)

// Validación de teléfono con cache
const phoneValidationCache = new Map()
async function isValidPhoneNumber(number) {
try {
if (phoneValidationCache.has(number)) {
return phoneValidationCache.get(number)
}
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
const isValid = phoneUtil.isValidNumber(parsedNumber)
phoneValidationCache.set(number, isValid)
// Limpiar cache después de 5 minutos
setTimeout(() => phoneValidationCache.delete(number), 300000)
return isValid
} catch (error) {
return false
}}

// Función optimizada para unirse a canales
async function joinChannels(conn) {
const channelPromises = Object.values(global.ch || {}).map(channelId => 
conn.newsletterFollow(channelId).catch(() => {}) // Fallar silenciosamente
)
// Procesar en lotes de 5 para no sobrecargar
const batchSize = 5
for (let i = 0; i < channelPromises.length; i += batchSize) {
const batch = channelPromises.slice(i, i + batchSize)
await Promise.allSettled(batch)
// Pequeño delay entre lotes
if (i + batchSize < channelPromises.length) {
await new Promise(resolve => setTimeout(resolve, 100))
}
}
}

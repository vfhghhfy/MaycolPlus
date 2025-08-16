process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './settings.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import {createRequire} from 'module'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import fs, {readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch, writeFileSync} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import { yukiJadiBot } from './plugins/jadibot-serbot.js';
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'
import pkg from 'google-libphonenumber'
// Importar express y otras dependencias para el servidor
import express from 'express'
import { Server } from 'http'
import os from 'os'

const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
import baileys from '@soymaycol/maybailyes'
const {proto, DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser} = baileys
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const {CONNECTING} = ws
const {chain} = lodash

// Archivo para guardar la configuración del puerto
const configFile = './src/config/port.json'

// Función para crear logs decorados
global.decoratedLog = (title, message, type = 'info') => {
    const colors = {
        info: chalk.cyan,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        magic: chalk.magenta
    }
    
    const color = colors[type] || colors.info
    
    console.log(color(`
╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ${message}
│
╰─✦`))
}

// Función para cargar o crear configuración de puerto
function loadPortConfig() {
    try {
        if (existsSync(configFile)) {
            const config = JSON.parse(readFileSync(configFile, 'utf8'))
            return config.port || null
        }
    } catch (error) {
        global.decoratedLog('CONFIG', 'Error al leer configuración de puerto, creando nueva...', 'warning')
    }
    return null
}

// Función para guardar configuración de puerto
function savePortConfig(port) {
    try {
        const configDir = './src/config'
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true })
        }
        writeFileSync(configFile, JSON.stringify({ port: parseInt(port) }, null, 2))
        global.decoratedLog('CONFIG', `Puerto ${port} guardado exitosamente`, 'success')
    } catch (error) {
        global.decoratedLog('CONFIG', 'Error al guardar configuración de puerto', 'error')
    }
}

// Cargar puerto guardado o preguntar por uno nuevo
let savedPort = loadPortConfig()
let PORT = savedPort || process.env.PORT || process.env.SERVER_PORT

const __dirname = global.__dirname(import.meta.url)

let { say } = cfonts

console.log(chalk.bold.redBright(`\n♥ Iniciando MaycolAIUltraMD ☆\n`))

say(global.namebotttt, {
    font: 'block',
    align: 'center',
    colors: ['yellowBright']
})

say(`Hecho por ${global.nameqr}`, {
    font: 'console',
    align: 'center',
    gradient: ['magenta', 'cyan']
})

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

const __dirname = global.__dirname(import.meta.url)
let PORT = savedPort || process.env.PORT || process.env.SERVER_PORT

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))

global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this)
resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
}}, 1 * 1000))
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
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const carpeta = path.join('./tmp')

// Crear carpeta tmp si no existe
if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true })
    global.decoratedLog('SISTEMA', 'Carpeta tmp creada exitosamente', 'success')
} else {
    global.decoratedLog('SISTEMA', 'Carpeta tmp verificada correctamente', 'info')
}

const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

// Preguntar por el puerto si no está guardado
if (!savedPort) {
    let validPort = false
    do {
        try {
            PORT = await question(chalk.bgBlue.white('🌐 Configuración del Servidor:\n') + 
                               chalk.bold.cyan('Ingresa el puerto para el servidor web (ej: 3000): '))
            
            const portNum = parseInt(PORT)
            if (portNum && portNum > 0 && portNum <= 65535) {
                validPort = true
                savePortConfig(PORT)
                global.decoratedLog('SERVIDOR', `Puerto ${PORT} configurado correctamente`, 'success')
            } else {
                console.log(chalk.bold.red('❌ Puerto inválido. Debe ser un número entre 1 y 65535'))
            }
        } catch (error) {
            console.log(chalk.bold.red('❌ Error al procesar el puerto'))
        }
    } while (!validPort)
} else {
    global.decoratedLog('SERVIDOR', `Usando puerto guardado: ${PORT}`, 'info')
}

// Inicializar servidor Express
const app = express()
const server = Server(app)

// Variables globales para estadísticas
global.botStats = {
    startTime: new Date(),
    messagesProcessed: 0,
    connections: 0,
    uptime: 0
}

// Middleware
app.use(express.json())
app.use(express.static('./src/public'))

// Endpoint principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/index.html'))
})

// Endpoint de estado del bot
app.get('/api/status', (req, res) => {
    const uptime = Date.now() - global.botStats.startTime.getTime()
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60))
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))
    
    const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        cpus: os.cpus().length,
        loadAverage: os.loadavg()
    }
    
    const botInfo = {
        status: global.conn?.user ? 'conectado' : 'desconectado',
        user: global.conn?.user || null,
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        startTime: global.botStats.startTime,
        messagesProcessed: global.botStats.messagesProcessed,
        connections: global.botStats.connections,
        database: {
            users: Object.keys(global.db?.data?.users || {}).length,
            chats: Object.keys(global.db?.data?.chats || {}).length,
            messages: Object.keys(global.db?.data?.msgs || {}).length
        }
    }
    
    res.json({
        success: true,
        timestamp: new Date(),
        system: systemInfo,
        bot: botInfo,
        server: {
            port: PORT,
            environment: process.env.NODE_ENV || 'development'
        }
    })
})

// Iniciar servidor
server.listen(PORT, () => {
    global.decoratedLog('SERVIDOR', `Servidor web iniciado en puerto ${PORT}`, 'success')
    global.decoratedLog('SERVIDOR', `Panel disponible en: http://localhost:${PORT}`, 'info')
    global.decoratedLog('SERVIDOR', `API Status: http://localhost:${PORT}/api/status`, 'info')
})

let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
do {
opcion = await question(colores('⌨ Seleccione una opción:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de texto de 8 dígitos\n--> '))

if (!/^[1-2]$/.test(opcion)) {
global.decoratedLog('INPUT', 'Solo se permiten números 1 o 2', 'warning')
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
} 

// Silenciar logs innecesarios
console.info = () => {} 
console.debug = () => {} 

const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile, 
browser: opcion == '1' ? [`${nameqr}`, 'Edge', '20.0.04'] : methodCodeQR ? [`${nameqr}`, 'Edge', '20.0.04'] : ['Ubuntu', 'Edge', '110.0.1587.56'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: true, 
generateHighQualityLinkPreview: true, 
getMessage: async (clave) => {
let jid = jidNormalizedUser(clave.remoteJid)
let msg = await store.loadMessage(jid, clave.id)
return msg?.message || ""
},
msgRetryCounterCache,
msgRetryCounterMap,
defaultQueryTimeoutMs: undefined,
version,
}

global.conn = makeWASocket(connectionOptions);

if (!fs.existsSync(`./${sessions}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`✦ Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright(`✠ Ejemplo: 57321×××××××`)}\n${chalk.bold.magentaBright('---> ')}`)))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}
} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
global.decoratedLog('CONEXIÓN', `Código de vinculación: ${codeBot}`, 'magic')
}, 3000)
}}}
}

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
}, 30 * 1000);
}

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update;
global.stopped = connection;
if (isNewLogin) conn.isInit = true;
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error);
global.timestamp.connect = new Date;
}
if (global.db.data == null) loadDatabase();
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
global.decoratedLog('QR', 'Escanea el código QR (expira en 45 segundos)', 'warning')
}
}
if (connection == 'open') {
global.decoratedLog('CONEXIÓN', 'YukiBot-MD conectado exitosamente', 'success')
global.botStats.connections++
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
global.decoratedLog('ERROR', `Sin conexión, elimina la carpeta ${global.sessions} y escanea el código QR`, 'error')
} else if (reason === DisconnectReason.connectionClosed) {
global.decoratedLog('CONEXIÓN', 'Conexión cerrada, reconectando...', 'warning')
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
global.decoratedLog('CONEXIÓN', 'Conexión perdida con el servidor, reconectando...', 'warning')
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionReplaced) {
global.decoratedLog('CONEXIÓN', 'Conexión reemplazada, cierra la sesión actual primero', 'error')
} else if (reason === DisconnectReason.loggedOut) {
global.decoratedLog('ERROR', `Sin conexión, elimina la carpeta ${global.sessions} y escanea el código QR`, 'error')
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.restartRequired) {
global.decoratedLog('SISTEMA', 'Conectando al servidor...', 'info')
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.timedOut) {
global.decoratedLog('CONEXIÓN', 'Tiempo de conexión agotado, reconectando...', 'warning')
await global.reloadHandler(true).catch(console.error)
} else {
global.decoratedLog('ERROR', `Razón de desconexión desconocida: ${reason || 'No encontrado'} >> ${connection || 'No encontrado'}`, 'error')
}}
}

process.on('uncaughtException', (error) => {
global.decoratedLog('ERROR', `Error no capturado: ${error.message}`, 'error')
})

let isInit = true;
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
const isGroupId = jid => jid.endsWith('@g.us') || jid.endsWith('@lid');

let chats
if (currentDateTime >= messageDateTime) {
  chats = Object.entries(conn.chats)
    .filter(([jid, chat]) => !isGroupId(jid) && chat.isChats)
    .map(([jid]) => jid);
} else {
  chats = Object.entries(conn.chats)
    .filter(([jid, chat]) => !isGroupId(jid) && chat.isChats)
    .map(([jid]) => jid);
  }
  
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
};

global.rutaJadiBot = join(__dirname, global.jadi)

if (global.yukiJadibts) {
if (!existsSync(global.rutaJadiBot)) {
mkdirSync(global.rutaJadiBot, { recursive: true }) 
global.decoratedLog('JADIBOTS', `Carpeta ${jadi} creada correctamente`, 'success')
} else {
global.decoratedLog('JADIBOTS', `Carpeta ${jadi} ya existe`, 'info')
}

const readRutaJadiBot = readdirSync(rutaJadiBot)
if (readRutaJadiBot.length > 0) {
const creds = 'creds.json'
for (const gjbts of readRutaJadiBot) {
const botPath = join(rutaJadiBot, gjbts)
const readBotPath = readdirSync(botPath)
if (readBotPath.includes(creds)) {
yukiJadiBot({pathYukiJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})
}
}
}
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
global.decoratedLog('PLUGINS', `Error cargando plugin ${filename}: ${e.message}`, 'error')
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true);
if (filename in global.plugins) {
if (existsSync(dir)) global.decoratedLog('PLUGINS', `Plugin actualizado: ${filename}`, 'info')
else {
global.decoratedLog('PLUGINS', `Plugin eliminado: ${filename}`, 'warning')
return delete global.plugins[filename]
}} else global.decoratedLog('PLUGINS', `Nuevo plugin: ${filename}`, 'success');
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) global.decoratedLog('PLUGINS', `Error de sintaxis en ${filename}: ${format(err)}`, 'error')
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
global.decoratedLog('PLUGINS', `Error requiriendo plugin ${filename}: ${format(e)}`, 'error')
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}
}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
const test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version']),
].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127);
});
}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false));
})]);
}));
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}

function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}

function purgeSession() {
let prekey = []
let directorio = readdirSync(`./${sessions}`)
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./${sessions}/${files}`)
})
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync(`./${jadi}/`);
let SBprekey = [];
listaDirectorios.forEach(directorio => {
if (statSync(`./${jadi}/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./${jadi}/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys];
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
unlinkSync(`./${jadi}/${directorio}/${fileInDir}`)
}})
}})
if (SBprekey.length === 0) {
global.decoratedLog('LIMPIEZA', `${jadi} - Nada por eliminar`, 'info')
} else {
global.decoratedLog('LIMPIEZA', `${jadi} - Archivos no esenciales eliminados`, 'success')
}} catch (err) {
global.decoratedLog('LIMPIEZA', `Error en ${jadi}: ${err}`, 'error')
}}

function purgeOldFiles() {
const directories = [`./${sessions}/`, `./${jadi}/`]
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
if (file !== 'creds.json') {
const filePath = path.join(dir, file);
unlinkSync(filePath, err => {
if (err) {
global.decoratedLog('LIMPIEZA', `${file} no se logró borrar`, 'error')
} else {
global.decoratedLog('LIMPIEZA', `${file} borrado con éxito`, 'success')
} }) }
}) }) }) }

function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}

// Intervalos de limpieza con logs mejorados
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await clearTmp()
global.decoratedLog('LIMPIEZA', 'Archivos temporales eliminados', 'info')
}, 1000 * 60 * 4) // 4 min 

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeSession()
global.decoratedLog('LIMPIEZA', `Sesiones no esenciales de ${global.sessions} eliminadas`, 'info')
}, 1000 * 60 * 10) // 10 min

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeSessionSB()
}, 1000 * 60 * 10) 

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeOldFiles()
global.decoratedLog('LIMPIEZA', 'Archivos residuales eliminados', 'info')
}, 1000 * 60 * 10)

_quickTest().then(() => global.decoratedLog('SISTEMA', 'Inicialización completada exitosamente', 'success')).catch(console.error)

async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}
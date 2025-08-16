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

// ╭──────────────────────────────⊷
// │ OPTIMIZACIONES PRINCIPALES
// ╰──────────────────────────────⊷

// Cache optimizado para mejorar rendimiento
const messageCache = new NodeCache({ 
    stdTTL: 3600, // 1 hora
    checkperiod: 300, // verificar cada 5 minutos
    maxKeys: 10000, // máximo 10k mensajes en cache
    useClones: false // mejor rendimiento sin clonación
})

const userCache = new NodeCache({
    stdTTL: 1800, // 30 minutos
    checkperiod: 300,
    maxKeys: 5000,
    useClones: false
})

// Pool de conexiones reutilizable
const connectionPool = new Map()

// Buffer para escritura de base de datos (batch writing)
let dbWriteBuffer = []
let dbWriteTimeout = null

// ╭──────────────────────────────⊷
// │ FUNCIONES GLOBALES OPTIMIZADAS
// ╰──────────────────────────────⊷

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
};

global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

const __dirname = global.__dirname(import.meta.url)
const configFile = './src/config/port.json'

// Logger optimizado con less overhead
const createOptimizedLogger = () => {
    const logColors = {
        info: chalk.cyan,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        magic: chalk.magenta
    }
    
    return {
        log: (title, message, type = 'info') => {
            if (process.env.NODE_ENV === 'production' && type === 'info') return
            
            const color = logColors[type] || logColors.info
            console.log(color(`
╭─⊷〖 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 〈🏹 ✦ 〗
│
├─ ${message}
│
╰─✦`))
        }
    }
}

global.decoratedLog = createOptimizedLogger().log

// Configuración de puerto optimizada
const portConfig = {
    load() {
        try {
            if (existsSync(configFile)) {
                return JSON.parse(readFileSync(configFile, 'utf8')).port || null
            }
        } catch (error) {
            global.decoratedLog('CONFIG', 'Error al leer configuración de puerto', 'warning')
        }
        return null
    },
    
    save(port) {
        try {
            const configDir = './src/config'
            if (!existsSync(configDir)) {
                mkdirSync(configDir, { recursive: true })
            }
            writeFileSync(configFile, JSON.stringify({ port: parseInt(port) }, null, 2))
            global.decoratedLog('CONFIG', `Puerto ${port} guardado`, 'success')
        } catch (error) {
            global.decoratedLog('CONFIG', 'Error al guardar puerto', 'error')
        }
    }
}

let savedPort = portConfig.load()
let PORT = savedPort || process.env.PORT || process.env.SERVER_PORT || 3000

// Inicialización optimizada
const initializeBot = async () => {
    console.log(chalk.bold.redBright(`\n♥ Iniciando MaycolAIUltraMD ☆\n`))
    
    let { say } = cfonts
    
    say(global.namebotttt || 'MaycolAI', {
        font: 'block',
        align: 'center',
        colors: ['yellowBright']
    })
    
    say(`Hecho por ${global.nameqr || 'MayCol'}`, {
        font: 'console',
        align: 'center',
        gradient: ['magenta', 'cyan']
    })
}

// Configuración de prototipos más eficiente
const setupPrototypes = () => {
    protoType()
    serialize()
}

// API global optimizada con cache
global.API = (() => {
    const apiCache = new Map()
    return (name, path = '/', query = {}, apikeyqueryname) => {
        const cacheKey = `${name}:${path}:${JSON.stringify(query)}`
        
        if (apiCache.has(cacheKey)) {
            return apiCache.get(cacheKey)
        }
        
        const result = (name in global.APIs ? global.APIs[name] : name) + path + 
            (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
                ...query, 
                ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})
            })) : '')
            
        apiCache.set(cacheKey, result)
        return result
    }
})()

global.timestamp = {start: new Date}
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')

// Base de datos optimizada con escritura en lotes
global.db = new Low(/https?:\/\//.test(global.opts['db'] || '') ? new cloudDBAdapter(global.opts['db']) : new JSONFile('./src/database/database.json'))
global.DATABASE = global.db 

// Función de carga de base de datos optimizada
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) {
        return new Promise((resolve) => {
            const checkInterval = setInterval(async function() {
                if (!global.db.READ) {
                    clearInterval(checkInterval)
                    resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
                }
            }, 500) // Reducido de 1000ms a 500ms
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

// Escritura optimizada de base de datos (batch)
const optimizedDbWrite = () => {
    if (dbWriteBuffer.length === 0) return
    
    if (dbWriteTimeout) {
        clearTimeout(dbWriteTimeout)
    }
    
    dbWriteTimeout = setTimeout(async () => {
        if (global.db.data) {
            await global.db.write().catch(console.error)
        }
        dbWriteBuffer = []
    }, 2000) // Escribir cada 2 segundos máximo
}

// Configuración de autenticación optimizada
const setupAuth = async () => {
    const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
    const msgRetryCounterMap = (MessageRetryMap) => { };
    const msgRetryCounterCache = new NodeCache({
        stdTTL: 300, // 5 minutos
        checkperiod: 60,
        maxKeys: 1000
    })
    
    const {version} = await fetchLatestBaileysVersion();
    return { state, saveState, saveCreds, msgRetryCounterMap, msgRetryCounterCache, version }
}

// Configuración del servidor Express optimizada
const setupServer = () => {
    const app = express()
    const server = Server(app)
    
    // Middleware optimizado
    app.use(express.json({ limit: '10mb' }))
    app.use(express.static('./src/public', {
        maxAge: '1d', // Cache estático por 1 día
        etag: true
    }))
    
    // Comprensión gzip
    app.use((req, res, next) => {
        res.setHeader('Content-Encoding', 'gzip')
        next()
    })
    
    // Variables globales para estadísticas optimizadas
    global.botStats = {
        startTime: new Date(),
        messagesProcessed: 0,
        connections: 0,
        uptime: 0,
        cacheHits: 0,
        cacheMisses: 0
    }
    
    // Endpoint principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'src/public/index.html'))
    })
    
    // Endpoint de estado optimizado con cache
    app.get('/api/status', (req, res) => {
        const cacheKey = 'status'
        const cached = messageCache.get(cacheKey)
        
        if (cached) {
            global.botStats.cacheHits++
            return res.json(cached)
        }
        
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
            cacheHits: global.botStats.cacheHits,
            cacheMisses: global.botStats.cacheMisses,
            database: {
                users: Object.keys(global.db?.data?.users || {}).length,
                chats: Object.keys(global.db?.data?.chats || {}).length,
                messages: Object.keys(global.db?.data?.msgs || {}).length
            }
        }
        
        const response = {
            success: true,
            timestamp: new Date(),
            system: systemInfo,
            bot: botInfo,
            server: {
                port: PORT,
                environment: process.env.NODE_ENV || 'development'
            }
        }
        
        // Cache por 10 segundos
        messageCache.set(cacheKey, response, 10)
        global.botStats.cacheMisses++
        
        res.json(response)
    })
    
    // Endpoint de métricas de rendimiento
    app.get('/api/metrics', (req, res) => {
        res.json({
            cache: {
                messageCache: messageCache.getStats(),
                userCache: userCache.getStats()
            },
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage()
        })
    })
    
    server.listen(PORT)
    
    return { app, server }
}

// Configuración de conexión optimizada
const createOptimizedConnection = async (authState) => {
    // Logger silencioso para mejor rendimiento
    const logger = pino({ 
        level: 'silent',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: false,
                translateTime: false,
                ignore: 'pid,hostname'
            }
        }
    })
    
    const connectionOptions = {
        logger,
        printQRInTerminal: true,
        mobile: false,
        browser: [`${global.nameqr || 'MaycolAI'}`, 'Chrome', '120.0.0'],
        auth: {
            creds: authState.state.creds,
            keys: makeCacheableSignalKeyStore(authState.state.keys, logger.child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false, // Optimización importante
        getMessage: async (clave) => {
            const cacheKey = `${clave.remoteJid}:${clave.id}`
            let cachedMsg = messageCache.get(cacheKey)
            
            if (cachedMsg) {
                global.botStats.cacheHits++
                return cachedMsg
            }
            
            let jid = jidNormalizedUser(clave.remoteJid)
            let msg = await store.loadMessage(jid, clave.id)
            let result = msg?.message || ""
            
            if (result) {
                messageCache.set(cacheKey, result)
            }
            
            global.botStats.cacheMisses++
            return result
        },
        msgRetryCounterCache: authState.msgRetryCounterCache,
        msgRetryCounterMap: authState.msgRetryCounterMap,
        defaultQueryTimeoutMs: 60000, // 60 segundos timeout
        version: authState.version,
        keepAliveIntervalMs: 30000, // Keep alive cada 30 segundos
        connectTimeoutMs: 20000, // 20 segundos para conectar
        qrTimeout: 45000, // QR expira en 45 segundos
        maxMsgRetryCount: 3, // Máximo 3 reintentos
        retryRequestDelayMs: 200, // 200ms entre reintentos
    }
    
    return makeWASocket(connectionOptions)
}

// Manejo optimizado de actualizaciones de conexión
const createConnectionHandler = () => {
    return async function connectionUpdate(update) {
        const {connection, lastDisconnect, isNewLogin, qr} = update;
        global.stopped = connection;
        
        if (isNewLogin) {
            global.conn.isInit = true;
            global.decoratedLog('CONEXIÓN', 'Nueva sesión iniciada', 'success')
        }
        
        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        
        if (code && code !== DisconnectReason.loggedOut && global.conn?.ws.socket == null) {
            await global.reloadHandler(true).catch(console.error);
            global.timestamp.connect = new Date;
        }
        
        if (global.db.data == null) await loadDatabase();
        
        if (qr) {
            global.decoratedLog('QR', 'Código QR generado (expira en 45s)', 'warning')
        }
        
        if (connection == 'open') {
            global.decoratedLog('CONEXIÓN', 'MaycolAI conectado exitosamente', 'success')
            global.botStats.connections++
            
            // Optimización: precargar chats importantes
            setTimeout(() => {
                if (global.conn?.chats) {
                    Object.keys(global.conn.chats).slice(0, 50).forEach(jid => {
                        userCache.set(jid, global.conn.chats[jid])
                    })
                }
            }, 5000)
        }
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            await handleDisconnection(reason)
        }
    }
}

// Manejo optimizado de desconexiones
const handleDisconnection = async (reason) => {
    const messages = {
        [DisconnectReason.badSession]: `Sin conexión, elimina ${global.sessions} y reescanea QR`,
        [DisconnectReason.connectionClosed]: 'Conexión cerrada, reconectando...',
        [DisconnectReason.connectionLost]: 'Conexión perdida, reconectando...',
        [DisconnectReason.connectionReplaced]: 'Conexión reemplazada',
        [DisconnectReason.loggedOut]: `Sesión cerrada, elimina ${global.sessions}`,
        [DisconnectReason.restartRequired]: 'Reinicio requerido...',
        [DisconnectReason.timedOut]: 'Timeout, reconectando...'
    }
    
    const message = messages[reason] || `Desconexión desconocida: ${reason}`
    const logType = [DisconnectReason.badSession, DisconnectReason.loggedOut].includes(reason) ? 'error' : 'warning'
    
    global.decoratedLog('CONEXIÓN', message, logType)
    
    if (![DisconnectReason.connectionReplaced, DisconnectReason.badSession].includes(reason)) {
        setTimeout(async () => {
            await global.reloadHandler(true).catch(console.error)
        }, 3000) // Esperar 3 segundos antes de reconectar
    }
}

// Carga optimizada de plugins
const loadPluginsOptimized = async () => {
    const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
    const pluginFilter = (filename) => /\.js$/.test(filename)
    global.plugins = {}
    
    const pluginFiles = readdirSync(pluginFolder).filter(pluginFilter)
    const loadPromises = pluginFiles.map(async (filename) => {
        try {
            const file = global.__filename(join(pluginFolder, filename))
            const module = await import(`${file}?t=${Date.now()}`)
            global.plugins[filename] = module.default || module
            return filename
        } catch (e) {
            global.decoratedLog('PLUGINS', `Error en ${filename}: ${e.message}`, 'error')
            return null
        }
    })
    
    const results = await Promise.allSettled(loadPromises)
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length
    
}

// Sistema de limpieza optimizado
const createCleanupSystem = () => {
    const cleanupTasks = {
        // Limpiar archivos temporales (cada 3 minutos)
        clearTmp: {
            interval: 3 * 60 * 1000,
            task: async () => {
                if (global.stopped === 'close') return
                const tmpDir = join(__dirname, 'tmp')
                if (!existsSync(tmpDir)) return
                
                const files = readdirSync(tmpDir)
                let cleaned = 0
                
                files.forEach(file => {
                    try {
                        const filePath = join(tmpDir, file)
                        const stats = statSync(filePath)
                        const age = Date.now() - stats.mtime.getTime()
                        
                        // Eliminar archivos más viejos de 5 minutos
                        if (age > 5 * 60 * 1000) {
                            unlinkSync(filePath)
                            cleaned++
                        }
                    } catch (e) {
                        // Ignorar errores individuales
                    }
                })
                
                if (cleaned > 0) {
                    global.decoratedLog('LIMPIEZA', `${cleaned} archivos temporales eliminados`, 'info')
                }
            }
        },
        
        // Limpiar cache (cada 10 minutos)
        clearCache: {
            interval: 10 * 60 * 1000,
            task: async () => {
                const beforeKeys = messageCache.keys().length + userCache.keys().length
                messageCache.flushAll()
                userCache.del(userCache.keys().slice(0, Math.floor(userCache.keys().length * 0.5)))
                const afterKeys = messageCache.keys().length + userCache.keys().length
                
                global.decoratedLog('LIMPIEZA', `Cache reducido de ${beforeKeys} a ${afterKeys} entradas`, 'info')
            }
        },
        
        // Guardar base de datos (cada 30 segundos)
        saveDatabase: {
            interval: 30 * 1000,
            task: optimizedDbWrite
        }
    }
    
    Object.entries(cleanupTasks).forEach(([name, {interval, task}]) => {
        setInterval(task, interval)
    })
}

// Función principal de inicialización optimizada
const initializeOptimizedBot = async () => {
    try {
        await initializeBot()
        setupPrototypes()
        await loadDatabase()
        
        const authState = await setupAuth()
        const { app, server } = setupServer()
        
        global.conn = await createOptimizedConnection(authState)
        global.conn.connectionUpdate = createConnectionHandler()
        
        await loadPluginsOptimized()
        createCleanupSystem()
        
        // Manejo optimizado de errores
        process.on('uncaughtException', (error) => {
            global.decoratedLog('ERROR', `Error no capturado: ${error.message}`, 'error')
        })
        
        process.on('unhandledRejection', (reason, promise) => {
            global.decoratedLog('ERROR', `Promesa rechazada: ${reason}`, 'error')
        })
        
        global.decoratedLog('SISTEMA', 'MaycolAIUltraMD iniciado exitosamente', 'success')
        
    } catch (error) {
        global.decoratedLog('ERROR', `Error crítico en inicialización: ${error.message}`, 'error')
        process.exit(1)
    }
}

// Handler de recarga optimizado
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
        global.conn.ev.removeAllListeners()
        
        const authState = await setupAuth()
        global.conn = await createOptimizedConnection(authState)
        
        // Restaurar chats importantes en cache
        setTimeout(() => {
            if (oldChats) {
                Object.entries(oldChats).slice(0, 100).forEach(([jid, chat]) => {
                    userCache.set(jid, chat)
                })
            }
        }, 2000)
        
        isInit = true
    }
    
    if (!isInit) {
        global.conn.ev.off('messages.upsert', global.conn.handler)
        global.conn.ev.off('connection.update', global.conn.connectionUpdate)
        global.conn.ev.off('creds.update', global.conn.credsUpdate)
    }
    
    global.conn.handler = handler.handler.bind(global.conn)
    global.conn.connectionUpdate = global.conn.connectionUpdate.bind(global.conn)
    global.conn.credsUpdate = authState.saveCreds.bind(global.conn, true)
    
    global.conn.ev.on('messages.upsert', global.conn.handler)
    global.conn.ev.on('connection.update', global.conn.connectionUpdate)
    global.conn.ev.on('creds.update', global.conn.credsUpdate)
    isInit = false
    return true
};

// Validación optimizada de números de teléfono
const isValidPhoneNumber = (() => {
    const phoneCache = new Map()
    return async (number) => {
        if (phoneCache.has(number)) {
            return phoneCache.get(number)
        }
        
        try {
            let cleanNumber = number.replace(/\s+/g, '')
            if (cleanNumber.startsWith('+521')) {
                cleanNumber = cleanNumber.replace('+521', '+52');
            } else if (cleanNumber.startsWith('+52') && cleanNumber[4] === '1') {
                cleanNumber = cleanNumber.replace('+52 1', '+52');
            }
            
            const parsedNumber = phoneUtil.parseAndKeepRawInput(cleanNumber)
            const isValid = phoneUtil.isValidNumber(parsedNumber)
            
            phoneCache.set(number, isValid)
            return isValid
        } catch (error) {
            phoneCache.set(number, false)
            return false
        }
    }
})()

// Iniciar bot optimizado
initializeOptimizedBot()
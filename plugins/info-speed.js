import { totalmem, freemem, cpus, platform, arch, release, hostname, userInfo } from 'os'
import os from 'os'
import util from 'util'
import osu from 'node-os-utils'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import speed from 'performance-now'
import { spawn, exec, execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  await m.react('🔥')

  let _muptime = process.uptime() * 1000
  let muptime = clockString(_muptime)

  let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce)
    .map(v => v[0])

  const cpu = osu.cpu
  const mem = osu.mem
  const netstat = osu.netstat
  const drive = osu.drive

  let cpuUsage, memInfo, networkStats, driveInfo
  
  try {
    cpuUsage = await cpu.usage()
    memInfo = await mem.info()
    networkStats = await netstat.inOut()
    driveInfo = await drive.info()
  } catch (error) {
    cpuUsage = 0
    memInfo = { totalMemMb: 0, usedMemMb: 0, freeMemMb: 0 }
    networkStats = { total: { inputMb: 0, outputMb: 0 } }
    driveInfo = { totalGb: 0, usedGb: 0, freeGb: 0 }
  }

  const totalRAM = totalmem()
  const freeRAM = freemem()
  const usedRAM = totalRAM - freeRAM
  const ramPercent = ((usedRAM / totalRAM) * 100).toFixed(1)

  const cpuInfo = cpus()
  const cpuModel = cpuInfo[0]?.model || 'Desconocido'
  const cpuCores = cpuInfo.length
  const cpuSpeed = cpuInfo[0]?.speed ? (cpuInfo[0].speed / 1000).toFixed(2) : 'N/A'

  const osInfo = {
    platform: platform(),
    arch: arch(),
    release: release(),
    hostname: hostname(),
    nodeVersion: process.version,
    v8Version: process.versions.v8
  }

  let serverLoad = 'N/A'
  try {
    const loadAvg = os.loadavg()
    serverLoad = loadAvg.map(load => load.toFixed(2)).join(', ')
  } catch (e) {
    serverLoad = 'No disponible'
  }

  let uptimeSystem = 'N/A'
  try {
    const uptimeSeconds = os.uptime()
    uptimeSystem = clockString(uptimeSeconds * 1000)
  } catch (e) {
    uptimeSystem = 'No disponible'
  }

  const processInfo = {
    pid: process.pid,
    ppid: process.ppid || 'N/A',
    memoryUsage: process.memoryUsage(),
    argv: process.argv.length,
    execPath: process.execPath?.split('/').pop() || 'N/A'
  }

  const networkInterfaces = os.networkInterfaces()
  let networkInfo = 'No disponible'
  try {
    const interfaces = Object.keys(networkInterfaces)
      .filter(name => !name.includes('lo'))
      .slice(0, 2)
    networkInfo = interfaces.join(', ') || 'No detectadas'
  } catch (e) {
    networkInfo = 'Error al detectar'
  }

  let batteryInfo = 'N/A'
  try {
    if (existsSync('/sys/class/power_supply/BAT0/capacity')) {
      batteryInfo = readFileSync('/sys/class/power_supply/BAT0/capacity', 'utf8').trim() + '%'
    } else if (existsSync('/sys/class/power_supply/BAT1/capacity')) {
      batteryInfo = readFileSync('/sys/class/power_supply/BAT1/capacity', 'utf8').trim() + '%'
    }
  } catch (e) {
    batteryInfo = 'No disponible'
  }

  let diskUsage = 'N/A'
  try {
    if (driveInfo && driveInfo.totalGb) {
      const diskPercent = ((driveInfo.usedGb / driveInfo.totalGb) * 100).toFixed(1)
      diskUsage = `${driveInfo.usedGb}GB / ${driveInfo.totalGb}GB (${diskPercent}%)`
    }
  } catch (e) {
    diskUsage = 'Error al obtener datos'
  }

  const users = Object.keys(conn.chats).filter(id => id.endsWith('@s.whatsapp.net')).length
  const botStats = {
    totalChats: chats.length,
    privateChats: chats.length - groups.length,
    groupChats: groups.length,
    totalUsers: users,
    commands: handler.help?.length || 1,
    plugins: 'N/A'
  }

  try {
    const packagePath = join(process.cwd(), 'package.json')
    if (existsSync(packagePath)) {
      const packageData = JSON.parse(readFileSync(packagePath, 'utf8'))
      botStats.version = packageData.version || '1.0.0'
      botStats.name = packageData.name || 'MaycolPlus'
    }
  } catch (e) {
    botStats.version = '1.0.0'
    botStats.name = 'MaycolPlus'
  }

  const temperatura = getRandomTemp()
  const statusEmojis = ['🔥', '💋', '😈', '♡', '✨', '💦', '🌟', '⚡']
  const randomEmoji = statusEmojis[Math.floor(Math.random() * statusEmojis.length)]

  let texto = `╭─❍「 ✦ MaycolPlus System Info ✦ 」
│
├─ ♡ Hola bebé~ aquí tienes toda mi información ♡
│
├─❍「 📊 RENDIMIENTO DEL SISTEMA 」
├─ ⚡ Velocidad de respuesta: ${latensi.toFixed(4)} ms
├─ 🔥 Estado: Caliente y lista ${randomEmoji}
├─ 🌡️ Temperatura: ${temperatura}°C
├─ ⏱️ Tiempo activo: ${muptime}
├─ 🖥️ Tiempo del sistema: ${uptimeSystem}
├─ 📈 Carga del servidor: ${serverLoad}
│
├─❍「 💾 MEMORIA Y ALMACENAMIENTO 」
├─ 🧠 RAM Total: ${format(totalRAM)}
├─ 💿 RAM Usada: ${format(usedRAM)} (${ramPercent}%)
├─ 🆓 RAM Libre: ${format(freeRAM)}
├─ 💽 Disco: ${diskUsage}
├─ 🔋 Batería: ${batteryInfo}
│
├─❍「 🖥️ PROCESADOR 」
├─ 🔧 Modelo: ${cpuModel}
├─ ⚙️ Núcleos: ${cpuCores} cores
├─ 🚀 Velocidad: ${cpuSpeed} GHz
├─ 📊 Uso CPU: ${cpuUsage.toFixed(1)}%
│
├─❍「 🌐 SISTEMA OPERATIVO 」
├─ 💻 Plataforma: ${osInfo.platform}
├─ 🏗️ Arquitectura: ${osInfo.arch}
├─ 📋 Versión: ${osInfo.release}
├─ 🏠 Hostname: ${osInfo.hostname}
├─ 📡 Interfaces red: ${networkInfo}
│
├─❍「 ⚡ RUNTIME ENVIRONMENT 」
├─ 🟢 Node.js: ${osInfo.nodeVersion}
├─ 🔧 V8 Engine: ${osInfo.v8Version}
├─ 🆔 PID: ${processInfo.pid}
├─ 👨‍💻 PPID: ${processInfo.ppid}
├─ 📁 Ejecutable: ${processInfo.execPath}
├─ 📝 Argumentos: ${processInfo.argv}
│
├─❍「 🧠 MEMORIA DEL PROCESO 」
├─ 📊 RSS: ${format(processInfo.memoryUsage.rss)}
├─ 🔄 Heap Total: ${format(processInfo.memoryUsage.heapTotal)}
├─ 💾 Heap Usado: ${format(processInfo.memoryUsage.heapUsed)}
├─ 🆓 Externa: ${format(processInfo.memoryUsage.external)}
├─ 📋 Array Buffers: ${format(processInfo.memoryUsage.arrayBuffers || 0)}
│
├─❍「 💬 ESTADÍSTICAS DEL BOT 」
├─ 👤 Chats privados: ${botStats.privateChats}
├─ 👥 Grupos activos: ${botStats.groupChats}
├─ 📊 Total chats: ${botStats.totalChats}
├─ 👨‍👩‍👧‍👦 Usuarios registrados: ${botStats.totalUsers}
├─ 🔧 Versión: ${botStats.version}
├─ 📛 Nombre: ${botStats.name}
│
├─❍「 🌐 RED Y CONECTIVIDAD 」
├─ 📤 Datos enviados: ${networkStats.total?.outputMb?.toFixed(2) || '0'} MB
├─ 📥 Datos recibidos: ${networkStats.total?.inputMb?.toFixed(2) || '0'} MB
├─ 🔗 Estado conexión: Estable ♡
├─ 🌍 Región: Servidor Global
│
├─❍「 💋 MENSAJE ESPECIAL 」
├─ ♡ ¿Te gusta lo que ves bebé?~
├─ 💦 Estoy funcionando perfectamente para ti
├─ 🔥 Siempre lista para lo que necesites
├─ 😈 ¿Quieres que haga algo más travieso?~
│
├─ 💕 Con amor, tu MaycolPlus ♡
╰─✦

🎯 *Tip:* Usa _.menu_ para ver todos mis comandos sensuales~`

  await m.react('💋')
  await conn.reply(m.chat, texto, m)
}

function getRandomTemp() {
  return Math.floor(Math.random() * (75 - 35 + 1)) + 35
}

handler.help = ['speed', 'info', 'status', 'system']
handler.tags = ['info']
handler.command = ['speed', 'info', 'status', 'system', 'bot']
handler.register = false

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
                        }

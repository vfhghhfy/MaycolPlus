import os from 'os'
import { sizeFormatter } from 'human-readable'
import speed from 'performance-now'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

const getInfo = async (conn) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  let _muptime = process.uptime() * 1000
  let muptime = clockString(_muptime)

  let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let groups = Object.entries(conn.chats).filter(([jid, chat]) =>
    jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce
  ).map(v => v[0])

  let totalRam = os.totalmem()
  let freeRam = os.freemem()
  let usedRam = totalRam - freeRam

  return {
    latensi,
    muptime,
    chats: chats.length,
    groups: groups.length,
    ram: {
      used: format(usedRam),
      total: format(totalRam),
    }
  }
}

const clockString = (ms) => {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

export default getInfo

/**
 * Comando: .copiabots
 * Autor: Ado-rgb
 * Repositorio: github.com/Ado-rgb
 * 🚫 No quitar créditos
 * 
 * Funcionalidad:
 * 📦 Crea un ZIP de ./JadiBots usando solo Node.js nativo y lo envía
 */

import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

let handler = async (m, { conn }) => {
  try {
    const carpeta = './JadiBots'
    if (!fs.existsSync(carpeta)) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontró la carpeta ./JadiBots', ...global.rcanal }, { quoted: m })
    }

    await m.react('⏳')

    // Función para listar todos los archivos dentro de la carpeta
    function listarArchivos(dir) {
      let archivos = []
      for (let file of fs.readdirSync(dir)) {
        let ruta = path.join(dir, file)
        let stat = fs.statSync(ruta)
        if (stat.isDirectory()) {
          archivos = archivos.concat(listarArchivos(ruta))
        } else {
          archivos.push(ruta)
        }
      }
      return archivos
    }

    // Crear el ZIP en memoria
    function crearZip(archivos) {
      const chunks = []
      let offset = 0
      const entradas = []
      const fileBuffers = []

      for (let archivo of archivos) {
        const data = fs.readFileSync(archivo)
        const nombre = path.relative(carpeta, archivo).replace(/\\/g, '/')
        const comprimido = zlib.deflateRawSync(data)
        const crc32 = crc32buf(data)

        const localHeader = Buffer.concat([
          Buffer.from('504b0304', 'hex'),
          Buffer.from([20, 0, 0, 0, 8, 0]),
          Buffer.alloc(4), // Fecha/hora
          toBytesInt32(crc32),
          toBytesInt32(comprimido.length),
          toBytesInt32(data.length),
          toBytesInt16(nombre.length),
          toBytesInt16(0),
          Buffer.from(nombre, 'utf8'),
          comprimido
        ])

        const centralHeader = Buffer.concat([
          Buffer.from('504b0102', 'hex'),
          Buffer.from([20, 0, 20, 0, 0, 0, 8, 0]),
          Buffer.alloc(4), // Fecha/hora
          toBytesInt32(crc32),
          toBytesInt32(comprimido.length),
          toBytesInt32(data.length),
          toBytesInt16(nombre.length),
          toBytesInt16(0),
          toBytesInt16(0),
          Buffer.alloc(8),
          toBytesInt32(offset),
          Buffer.from(nombre, 'utf8')
        ])

        offset += localHeader.length
        chunks.push(localHeader)
        entradas.push(centralHeader)
      }

      const centralDir = Buffer.concat(entradas)
      const endRecord = Buffer.concat([
        Buffer.from('504b0506', 'hex'),
        Buffer.alloc(2),
        Buffer.alloc(2),
        toBytesInt16(entradas.length),
        toBytesInt16(entradas.length),
        toBytesInt32(centralDir.length),
        toBytesInt32(offset),
        Buffer.alloc(0)
      ])

      return Buffer.concat([...chunks, centralDir, endRecord])
    }

    // Funciones auxiliares para enteros
    function toBytesInt16(num) {
      return Buffer.from([num & 0xff, (num >> 8) & 0xff])
    }
    function toBytesInt32(num) {
      return Buffer.from([
        num & 0xff,
        (num >> 8) & 0xff,
        (num >> 16) & 0xff,
        (num >> 24) & 0xff
      ])
    }
    function crc32buf(buf) {
      let crcTable = []
      for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
        }
        crcTable[n] = c >>> 0
      }
      let crc = 0 ^ -1
      for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF]
      }
      return (crc ^ -1) >>> 0
    }

    const archivos = listarArchivos(carpeta)
    const zipBuffer = crearZip(archivos)

    await conn.sendMessage(
      m.chat,
      {
        document: zipBuffer,
        fileName: 'JadiBots.zip',
        mimetype: 'application/zip',
        ...global.rcanal
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (err) {
    console.error(err)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al crear o enviar el ZIP', ...global.rcanal }, { quoted: m })
  }
}

handler.help = ['copiabots']
handler.tags = ['owner']
handler.command = /^copiabots$/i
handler.rowner = true

export default handler
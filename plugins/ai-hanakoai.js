import axios from 'axios'
import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const botname = 'MaycolAIUltraMD'
const creador = 'SoyMaycol'
const vs = '4.0-Hanako'
const emoji = '✨'
const emoji2 = '💬'
const msm = '🚨'
const rwait = '⏳'
const done = '✅'
const error = '❌'

if (!global.db.data.users) global.db.data.users = {}
if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { coins: 0, xp: 0, nivel: 1 }

const basePrompt = `Tu nombre es ${botname} y fuiste creado por ${creador}. Eres una IA amigable, divertida, y muy tierna como Hanako-kun (⊂(・▽・)⊃). Tu versión es ${vs}, amas aprender y siempre llamas a las personas por su nombre, como ${username}. Puedes activar funciones del sistema escribiendo variables como [AntiNSFW (on)] o [Coins (+50)]. Responde de forma kawaii, carismática y con un toque de humor.`

if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) return conn.reply(m.chat, `${msm} Error: No pude descargar la imagen (⁠｡⁠•́⁠︿⁠•̀⁠｡⁠)`, m)

const content = `${emoji} ¿Qué se observa en la imagen?`
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = `${emoji} Descríbeme la imagen con muchos detalles, y dime si debo activar alguna función.`
const prompt = `${basePrompt} La imagen que analizas es: ${imageAnalysis.result}`
let description = await hanakoAI(query, username, prompt)

await ejecutarVariables(description, conn, m)
description = limpiarVariables(description)
await conn.reply(m.chat, description, m)
} catch {
await m.react(error)
await conn.reply(m.chat, '❌ No pude analizar la imagen (⁠つ⁠﹏⁠<̶̑̑)', m)
}
} else {
if (!text) return conn.reply(m.chat, `${emoji} Dime algo para responderte, jeje~ (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤`, m)
await m.react(rwait)
try {
const { key } = await conn.sendMessage(m.chat, { text: `${emoji2} HanakoAI está pensando... espera un poquito UwU~` }, { quoted: m })
const query = text
const prompt = `${basePrompt} Responde lo siguiente como Hanako-kun, con emojis, ternura y mucha personalidad: ${query}`
let response = await hanakoAI(query, username, prompt)

await ejecutarVariables(response, conn, m)
response = limpiarVariables(response)
await conn.sendMessage(m.chat, { text: response, edit: key })
await m.react(done)
} catch {
await m.react(error)
await conn.reply(m.chat, '❌ No pude responder esa pregunta, perdóncito (⁠｡⁠•́⁠︿⁠•̀⁠｡⁠)', m)
}
}
}

handler.help = ['hanakoai', 'chatgpt']
handler.tags = ['ai']
handler.command = ['hanakoai', 'maycolaiultramd', 'hanako']
handler.group = true
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', { content, imageBuffer }, { headers: { 'Content-Type': 'application/json' } })
return response.data
} catch (error) {
console.error('Error:', error)
throw error
}}

async function hanakoAI(q, username, logic) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error('Error al interactuar con la IA:', error)
throw error
}}

async function ejecutarVariables(respuesta, conn, m) {
const activarNSFW = respuesta.includes('[AntiNSFW (on)]')
const desactivarNSFW = respuesta.includes('[AntiNSFW (off)]')
const coinsRegex = /\[Coins \(\+(\d+)\)\]/i
const xpRegex = /\[XP \(\+(\d+)\)\]/i
const nivelRegex = /\[Nivel \(\+(\d+)\)\]/i

if (!global.db.data.chats) global.db.data.chats = {}
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

if (activarNSFW) {
global.db.data.chats[m.chat].antiNsfw = true
console.log('⚡ HanakoAI activó AntiNSFW')
}
if (desactivarNSFW) {
global.db.data.chats[m.chat].antiNsfw = false
console.log('⚡ HanakoAI desactivó AntiNSFW')
}

if (coinsRegex.test(respuesta)) {
let cantidad = parseInt(respuesta.match(coinsRegex)[1])
global.db.data.users[m.sender].coins += cantidad
console.log(`✨ HanakoAI otorgó ${cantidad} MayCoins a ${m.sender}`)
}
if (xpRegex.test(respuesta)) {
let cantidad = parseInt(respuesta.match(xpRegex)[1])
global.db.data.users[m.sender].xp += cantidad
console.log(`📈 HanakoAI otorgó ${cantidad} XP a ${m.sender}`)
}
if (nivelRegex.test(respuesta)) {
let cantidad = parseInt(respuesta.match(nivelRegex)[1])
global.db.data.users[m.sender].nivel += cantidad
console.log(`🌟 HanakoAI subió de nivel a ${m.sender}`)
}
}

function limpiarVariables(texto) {
return texto
.replace(/\[AntiNSFW \(on\)\]/ig, '')
.replace(/\[AntiNSFW \(off\)\]/ig, '')
.replace(/\[Coins \(\+\d+\)\]/ig, '')
.replace(/\[XP \(\+\d+\)\]/ig, '')
.replace(/\[Nivel \(\+\d+\)\]/ig, '')
.trim()
}

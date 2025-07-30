import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import fetch from 'node-fetch';

const defaultLang = 'it';

const handler = async (m, { conn, args }) => {
  let lang = args[0];
  let text = args.slice(1).join(' ');
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }
  if (!text && m.quoted?.text) text = m.quoted.text;
  if (!text) throw `❌ Por favor, ingresá un texto para convertir a audio~`;

  try {
    const audioBuffer = await tts(text); // No necesita lang según tu API
    const filename = join(tmpdir(), `tts_${Date.now()}.mp3`);
    writeFileSync(filename, audioBuffer);
    await conn.sendFile(m.chat, filename, 'tts.mp3', null, m, true);
    unlinkSync(filename);
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Hubo un error al generar el audio: ' + e.message);
  }
};

handler.help = ['tts <lang?> <texto>'];
handler.tags = ['transformador'];
handler.register = true;
handler.command = ['tts'];

export default handler;

// 🗣️ Esta función hace la petición a tu API de TTS
async function tts(text) {
  const url = `http://nightapi.duckdns.org:3084/api/tts?text=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al generar TTS: ${res.statusText}`);
  return await res.buffer();
}

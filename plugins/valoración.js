import fetch from 'node-fetch';
import { deviceid } from '../lib/deviceid.js';
import { ip } from '../lib/ip.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let numero = m.sender.split('@')[0]; // Sacamos el número del usuario
  let mensaje;

  if (args.length > 0) {
    mensaje = args.join(' ');
  } else if (m.quoted && m.quoted.text) {
    mensaje = m.quoted.text;
  } else {
    return conn.reply(m.chat, `🌟 Usa el comando así:\n${usedPrefix + command} Me encanta tu bot, es un 10/10 😎`, m);
  }

  const username = `${global.owner_ngl}`; // Tu usuario de NGL sin @
  const msg = `[Bot] ${numero}: ${mensaje}`; // Formato personalizado uwu

  const ipadd = await ip(); // Obtenemos IP aleatoria o real
  const devId = await deviceid(); // Obtenemos un deviceId random

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-forwarded-for': ipadd
  };

  const body = new URLSearchParams({
    username: username,
    question: msg,
    deviceId: devId
  });

  try {
    const res = await fetch('https://ngl.link/api/submit', {
      method: 'POST',
      headers,
      body
    });

    if (res.status === 200) {
      await m.react('📨');
      conn.reply(m.chat, `✅ ¡Gracias por tu valoración! Tu opinión fue enviada a mi creador con amor (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤`, m);
    } else {
      throw new Error(`NGL respondió con estado ${res.status}`);
    }
  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `⚠️ Ocurrió un error al enviar la valoración...\n${e.message}`, m);
  }
};

handler.help = ['valoracion <texto>'];
handler.tags = ['info', 'feedback'];
handler.command = ['valoracion', 'feedbackbot', 'opinion'];

export default handler;

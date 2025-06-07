// Importamos las librerías necesarias (≧◡≦)
import fetch from 'node-fetch'; // Para hacer las peticiones HTTP
import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verificamos si el usuario proporcionó una URL (≧◡≦)
  if (!text) {
    throw `¡Necesitas proporcionar una URL! Usa: ${usedPrefix}${command} <URL>`;
  }

  try {
    // Hacemos la petición HTTP con node-fetch (≧◡≦)
    const res = await fetch(text);

    // Obtenemos el tipo de contenido de la respuesta (≧◡≦)
    const contentType = res.headers.get('content-type');

    // Verificamos si la petición fue exitosa (≧◡≦)
    if (!res.ok) {
      throw `¡La petición falló con el código de estado ${res.status}!`;
    }

    // Manejamos diferentes tipos de contenido (≧◡≦)
    if (contentType.startsWith('image')) {
      // Si es una imagen, la enviamos como sticker (≧◡≦)
      const buffer = await res.buffer();
      conn.sendFile(m.chat, sticker, 'sticker.webp', '', m)
    } else if (contentType.startsWith('application/json')) {
      // Si es JSON, lo enviamos como texto formateado (≧◡≦)
      const json = await res.json();
      const prettyJson = JSON.stringify(json, null, 2);
      await conn.reply(m.chat, `\`\`\`json\n${prettyJson}\`\`\``, m);
    } else {
      // Para otros tipos de contenido, enviamos el texto de la respuesta (≧◡≦)
      const data = await res.text();
      await conn.reply(m.chat, data, m);
    }

  } catch (error) {
    // Manejamos cualquier error que pueda ocurrir (≧◡≦)
    console.error(error);
    await conn.reply(m.chat, `¡Ocurrió un error! ${error}`, m);
  }
};

handler.help = ['peticion <URL>'];
handler.tags = ['herramientas'];
handler.command = ['peticion']; // Para cuando alguien diga "peticion <URL>"

export default handler;

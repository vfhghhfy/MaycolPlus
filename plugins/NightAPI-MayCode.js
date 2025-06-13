import axios from 'axios';
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const NIGHT_API_ENDPOINTS = [
  'https://nightapioficial.onrender.com',
  'https://nightapi-2a6l.onrender.com',
  'https://nightapi.is-a.dev'
];

async function fetchMayCode(version, prompt, imageUrl = null) {
  let paths;
  
  if (imageUrl) {
    // Si hay imagen, incluirla en la URL
    paths = {
      v1: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`,
      v2: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`
    };
  } else {
    // Sin imagen, usar la URL original
    paths = {
      v1: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}`,
      v2: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}`
    };
  }

  for (let baseURL of NIGHT_API_ENDPOINTS) {
    try {
      const res = await axios.get(baseURL + paths[version]);
      const data = res.data;

      // Verifica si la API devolvió lo esperado
      if (data && (data.MayCode || data.code)) return data;

      console.log(`⚠️ Respuesta vacía de ${baseURL}, intentando con otro...`);
    } catch (err) {
      console.log(`❌ Falló ${baseURL}: ${err.message}`);
    }
  }

  throw new Error('Todas las instancias de NightAPI están fuera de servicio.');
}

// Función para subir imagen a catbox
async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}

const handler = async (m, { conn, text }) => {
  // Verificar si hay imagen adjunta
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  let hasImage = /image\/(png|jpe?g|gif)/.test(mime);
  let imageUrl = null;

  // Si no hay texto y no hay imagen, mostrar error
  if (!text && !hasImage) {
    conn.reply(m.chat, `⚠️ 𝙃𝙚𝙮 𝙘𝙤𝙣𝙚𝙟𝙞𝙩𝙤 ✨ Te faltó el texto para usar *MayCode* ✍️\n\nUsa:\n— *--v1* para el modelo básico\n— *--v2* para el modelo avanzado Hanako-Kawaii\n\n📸 También puedes enviar una imagen junto con tu mensaje`, m);
    return;
  }

  let version = 'v1';
  let prompt = text || 'Analiza esta imagen';

  if (text && text.startsWith('--v1 ')) {
    version = 'v1';
    prompt = text.substring(5).trim();
  } else if (text && text.startsWith('--v2 ')) {
    version = 'v2';
    prompt = text.substring(5).trim();
  }

  // Mostrar mensaje de carga
  let loadingMsg = `━━━━━━━━━━━━━━━━━━━━━  
✧･ﾟ: *✧･ﾟ:* *𝙈𝙖𝙮𝘾𝙤𝙙𝙚* *:･ﾟ✧*:･ﾟ✧  
━━━━━━━━━━━━━━━━━━━━━  

(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ *Espérame que estoy pensando código mágico...*  
*Modelo:* MayCode ${version}`;

  if (hasImage) {
    loadingMsg += `\n📸 *Procesando imagen...*`;
  }

  loadingMsg += `\n✨ Hecho con amor por *SoyMaycol* ✨  
━━━━━━━━━━━━━━━━━━━━━`;

  await conn.reply(m.chat, loadingMsg, m);

  try {
    // Si hay imagen, subirla a catbox primero
    if (hasImage) {
      try {
        let media = await q.download();
        imageUrl = await catbox(media);
        console.log(`📸 Imagen subida: ${imageUrl}`);
      } catch (imgError) {
        console.error('Error al subir imagen:', imgError);
        await conn.reply(m.chat, `❌ Error al procesar la imagen. Continuando solo con texto...`, m);
      }
    }

    // Llamar a MayCode con o sin imagen
    const data = await fetchMayCode(version, prompt, imageUrl);

    const userText = data.user || prompt;
    const mayCodeText = data.MayCode || '(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄ No pude darte una respuesta, lo siento';
    const codeBlock = data.code || '(⁠・⁠∀⁠・⁠) Al Parecer MayCode solo te Hablo ^^';

    let respuesta = `
*┏━━━━━━✦°•✦°•✦━━━━━━┓*
   『 𝗠𝗔𝗬𝗖𝗢𝗗𝗘 ${version.toUpperCase()} 』
*┗━━━━━━✦°•✦°•✦━━━━━━┛*

╭───────────────╮  
│ 🧑‍💻 𝙏𝙪: *${userText}*`;

    if (imageUrl) {
      respuesta += `\n│ 📸 𝙄𝙢𝙖𝙜𝙚𝙣: Procesada ✅`;
    }

    respuesta += `  
│ ✨ 𝙈𝙖𝙮𝘾𝙤𝙙𝙚: *${mayCodeText}*  
╰───────────────╯

⊹︰𝗖𝗼𝗱𝗶𝗴𝗼 𝗘𝗻𝘁𝗿𝗲𝗴𝗮𝗱𝗼:
\`\`\`
${codeBlock}
\`\`\`

> (｡･ω･｡)ﾉ♡ Usando NightAPI — powered by SoyMaycol

━━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, {
      text: `⊹⊱⋛⋋(◍'◊'◍)⋌⋚⊰⊹

(｡╯︵╰｡) Ay no… ¡algo falló con NightAPI!

Todas las instancias están fuera de servicio…  
Intenta de nuevo más tardecito, mi cielito ☁️✨

> Código con amor por *SoyMaycol* 💖
`
    }, { quoted: m });
  }
};

handler.help = ['maycode'];
handler.tags = ['tools'];
handler.command = ['maycode', 'codigo'];
handler.register = true;

export default handler;

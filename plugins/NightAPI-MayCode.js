import axios from 'axios';

const NIGHT_API_ENDPOINTS = [
  'https://nightapioficial.onrender.com',
  'https://nightapi-2a6l.onrender.com',
  'https://nightapi.is-a.dev'
];

async function fetchMayCode(version, prompt) {
  const paths = {
    v1: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}`,
    v2: `/api/maycode/models/v2/?message=${encodeURIComponent(prompt)}`
  };

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

const handler = async (m, { conn, text }) => {
  if (!text) {
    conn.reply(m.chat, `⚠️ 𝙃𝙚𝙮 𝙘𝙤𝙣𝙚𝙟𝙞𝙩𝙤 ✨ Te faltó el texto para usar *MayCode* ✍️\n\nUsa:\n— *--v1* para el modelo básico\n— *--v2* para el modelo avanzado Hanako-Kawaii`, m);
    return;
  }

  let version = 'v1';
  let prompt = text;

  if (text.startsWith('--v1 ')) {
    version = 'v1';
    prompt = text.substring(5).trim();
  } else if (text.startsWith('--v2 ')) {
    version = 'v2';
    prompt = text.substring(5).trim();
  }

  await conn.reply(m.chat, `━━━━━━━━━━━━━━━━━━━━━  
✧･ﾟ: *✧･ﾟ:* *𝙈𝙖𝙮𝘾𝙤𝙙𝙚* *:･ﾟ✧*:･ﾟ✧  
━━━━━━━━━━━━━━━━━━━━━  

(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ *Espérame que estoy pensando código mágico...*  
*Modelo:* MayCode ${version}  
✨ Hecho con amor por *SoyMaycol* ✨  
━━━━━━━━━━━━━━━━━━━━━`, m);

  try {
    const data = await fetchMayCode(version, prompt);

    const userText = data.user || prompt;
    const mayCodeText = data.MayCode || '(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄ No pude darte una respuesta, lo siento';
    const codeBlock = data.code || '(⁠・⁠∀⁠・⁠) Al Parecer MayCode solo te Hablo ^^';

    const respuesta = `
*┏━━━━━━✦°•✦°•✦━━━━━━┓*
   『 𝗠𝗔𝗬𝗖𝗢𝗗𝗘 ${version.toUpperCase()} 』
*┗━━━━━━✦°•✦°•✦━━━━━━┛*

╭───────────────╮  
│ 🧑‍💻 𝙏𝙪: *${userText}*  
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
handler.group = false;
handler.register = true;

export default handler;

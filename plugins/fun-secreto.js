import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  const secreto = text?.trim();
  if (!secreto) throw 'Debes escribir tu secreto después de "secreto".';

  try {
    // Secreto random en inglés
    const res = await fetch('https://dummyjson.com/quotes/random');
    const json = await res.json();

    const fraseIngles = json?.quote || 'Someone left their secret in the shadows...';
    const autor = json?.author || 'Anónimo';

    // Traducimos al español
    const resTrad = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(fraseIngles)}&langpair=en|es`);
    const jsonTrad = await resTrad.json();

    const secretoTraducido = jsonTrad?.responseData?.translatedText || fraseIngles;

    const texto = `
╭───〔  𖣔  〕───⛩️
│ *Hanako-kun ha escuchado tu secreto...*
│ 『✧』 ${secreto}
│
│ Y también escuchó este pensamiento anónimo... 🌑
│ 『✧』 ${secretoTraducido} — *${autor}*
│
│ Puedes revisar más secretos aquí...
> *_https://maysecretos.onrender.com_*
╰─────────────────⛩️`;

    await conn.sendMessage(m.chat, {
      text: texto,
      contextInfo: {
        externalAdReply: {
          title: 'Tu secreto ha sido registrado',
          body: 'MaycolAIUltraMD • SoyMaycol',
          thumbnailUrl: 'https://files.catbox.moe/ut05k5.jpeg',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R'
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.log(e);
    await m.reply('Hubo un error al registrar el secreto o al buscar otro... Intenta más tarde.');
  }
};

handler.help = ['secreto soy un gato'];
handler.tags = ['fun'];
handler.command = ['secreto'];
handler.group = false;
handler.register = true;

export default handler;

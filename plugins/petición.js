import axios from 'axios';

const handler = async (m, { conn }) => {
  const texto = m.text || '';
  const regex = /^peticion\s+(https?:\/\/[^\s]+)$/i;
  const match = texto.match(regex);

  if (!match) {
    await conn.reply(m.chat, 'Usa: peticion <URL>', m);
    return;
  }

  const url = match[1];

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // Importante para archivos binarios
    });

    const contentType = response.headers['content-type'];
    const buffer = Buffer.from(response.data, 'binary');

    if (contentType.startsWith('image')) {
      // Envía la imagen
      await conn.sendFile(m.chat, buffer, 'image', 'Aquí tienes tu imagen', m);
    } else if (contentType.startsWith('application/json')) {
      // Envía el JSON formateado
      const json = JSON.stringify(response.data, null, 2);
      await conn.reply(m.chat, `\`\`\`${json}\`\`\``, m);
    } else {
      // Envía como texto (si es posible)
      const text = buffer.toString('utf8');
      await conn.reply(m.chat, text, m);
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `Error: ${error}`, m);
  }
};

handler.help = ['peticion <URL>'];
handler.tags = ['herramienta'];
handler.command = ['peticion'];
handler.register = true;

export default handler;

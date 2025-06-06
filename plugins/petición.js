import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';

const handler = async (m, { conn, text }) => {
  if (!text) throw '*¡Necesitas darme una URL programadorcito bello!* (≧◡≦)';

  try {
    const url = text;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const fileType = await fileTypeFromBuffer(buffer);

    if (fileType) {
      // Es una imagen u otro tipo de archivo
      const { mime, ext } = fileType;
      const fileName = `downloaded.${ext}`;
      fs.writeFileSync(fileName, buffer);

      await conn.sendFile(m.chat, fileName, fileName, '*¡Aquí está tu archivo descargado!*', m, false, { mimetype: mime });

      fs.unlinkSync(fileName); // Elimina el archivo después de enviarlo
    } else {
      // Intentar analizar como JSON
      try {
        const jsonData = JSON.parse(buffer.toString('utf8'));
        const prettyJson = JSON.stringify(jsonData, null, 2);
        await conn.reply(m.chat, `*¡JSON Detectado!*\n\n${prettyJson}`, m);
      } catch (jsonError) {
        await conn.reply(m.chat, '*¡No pude detectar ni archivo ni JSON! (｡>﹏<｡)*', m);
      }
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '*¡Ocurrió un error al procesar la URL! (╥﹏╥)*', m);
  }
};

handler.help = ['petición <url>'];
handler.tags = ['downloader'];
handler.command = /^petición$/i;
handler.register = true;

export default handler;

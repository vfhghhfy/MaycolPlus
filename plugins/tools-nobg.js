import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Envía un archivo con el texto *.${command}* o responde al archivo con este comando.`,
    }, { quoted: m });
  }

  // Descargar el archivo
  const media = await q.download();
  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const ext = mime.split('/')[1] || 'dat';
  const fileName = `media_${Date.now()}.${ext}`;
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, media);

  const buffer = fs.readFileSync(filePath);

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    // Enviar a API de remover fondo
    const apiKey = 'may-2b02ac57e684a1c5ba9281d8dabf019c';
    const apiUrl = `https://mayapi.giize.com/nobg?image=&apikey=${apiKey}`;

    // Subimos la imagen a un hosting temporal para obtener un link público
    const uploadTemp = async (buffer) => {
      const form = new FormData();
      form.append('file', buffer, 'upload.png');
      const res = await axios.post('https://i.supa.codes/api/upload', form, { headers: form.getHeaders() });
      return res.data?.link || null;
    };

    const imageUrl = await uploadTemp(buffer);
    if (!imageUrl) throw new Error('No se pudo subir la imagen temporal');

    // Llamamos a la API para remover el fondo
    const response = await axios.get(`https://mayapi.giize.com/nobg?image=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`);
    if (!response.data.status) throw new Error('Error al procesar la imagen');

    // Descargamos la imagen resultante
    const resultBuffer = (await axios.get(response.data.result, { responseType: 'arraybuffer' })).data;

    // Guardamos temporalmente
    const outPath = path.join(tempDir, `nobg_${Date.now()}.png`);
    fs.writeFileSync(outPath, resultBuffer);

    // Enviamos como documento
    await conn.sendMessage(m.chat, { 
      document: fs.readFileSync(outPath), 
      mimetype: 'image/png', 
      fileName: `nobg_${Date.now()}.png` 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Limpiar archivos temporales
    fs.unlinkSync(filePath);
    fs.unlinkSync(outPath);

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al remover el fondo.' }, { quoted: m });
  }
};

handler.help = ['nobg'];
handler.tags = ['tools'];
handler.command = /^(nobg)$/i;

export default handler;

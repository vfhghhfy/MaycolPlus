import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw 'No se encontraron medios';
  let media = await q.download();
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
  let link = await (isTele ? uploadImage : uploadFile)(media);
  conn.sendFile(m.chat, `https://api.xteam.xyz/imagetopdf?url=${link}&APIKEY=cristian9407`, 'MultiverseBot.pdf', null, m);
};

handler.help = ['topdf <responde imagen>'];
handler.tags = ['tools'];
handler.command = /^(topdf)$/i;

handler.limit = true;

export default handler;

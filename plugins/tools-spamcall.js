import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `Uso correcto:\n${usedPrefix}spamcall 628xxxxxxxx`;
  let numero = text.replace(/[^0-9]/gi, '').slice(2);
  if (!numero.startsWith('8')) throw `Uso correcto:\n${usedPrefix}spamcall 628xxxxxxxx`;
  m.reply('_*Por favor espera, tu solicitud está en proceso...*_');
  let respuesta = await fetch(`https://id.jagreward.com/member/verify-mobile/${numero}`).then(res => res.json());
  let mensaje = `*Número del bot*: _${respuesta.phone_prefix}_\n\n_¡El bot te ha llamado con éxito!_`;
  conn.reply(m.chat, mensaje.trim(), m);
};

handler.help = ['spamcall <numero>'];
handler.tags = ['tools'];
handler.command = /^(spamcall)$/i;
handler.limit = true;
handler.premium = true;

export default handler;

import axios from "axios";

const handler = async (m, { conn, text }) => {
  let [email, mensaje] = text.split('|');

  if (!email) return conn.reply(m.chat, 'Por favor ingresa el email al que quieres enviar spam', m);
  if (!mensaje) return conn.reply(m.chat, 'Por favor ingresa el mensaje que quieres enviar', m);

  try {
    const res = await axios.get(`https://videfikri.com/api/spamemail/?email=${email}&subjek=SPAM%20GMAIL%20BOT&pesan=${mensaje}`);
    let resultado = `${res.data.result.log_lengkap}`;
    conn.reply(m.chat, resultado, m);
  } catch (error) {
    conn.reply(m.chat, 'Error al enviar el spam, intenta más tarde.', m);
  }
};

handler.help = ['spamgmail <@email|mensaje>'];
handler.tags = ['tools'];
handler.command = /^(spamgmail)$/i;
handler.limit = true;

export default handler;

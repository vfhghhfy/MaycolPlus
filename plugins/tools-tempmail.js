import axios from "axios";

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor ingresa un usuario para crear el correo temporal.\n\nEjemplo: *.tempmail maycol*', m);

  try {
    const res = await axios.get(`https://nightapi.is-a.dev/api/tempmail?user=${text}`);
    const data = res.data;

    if (!data.success) return conn.reply(m.chat, 'No se pudo generar el correo temporal.', m);

    let inbox = '';
    if (data.total > 0) {
      for (let msg of data.messages) {
        inbox += `
📩 *Nuevo Mensaje*
────────────────
📅 Fecha: ${msg.date}
👤 De: ${msg.from}
✉️ Asunto: ${msg.subject}
🔗 Link: ${msg.link}
────────────────\n`;
      }
    } else {
      inbox = '\n✉️ No hay mensajes en la bandeja todavía.\n';
    }

    let replyMsg = `
╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ ✉️ *Correo Temporal*: ${data.mailbox}
│
├─ 📬 *Mensajes (${data.total})*
${inbox.trim()}
│
├─ Impulsado por *NightAPI*
╰─✦`;

    conn.reply(m.chat, replyMsg, m);

  } catch (error) {
    conn.reply(m.chat, 'Error al consultar la API de NightAPI.', m);
  }
};

handler.help = ['tempmail <user>'];
handler.tags = ['tools'];
handler.command = /^tempmail$/i;

export default handler;

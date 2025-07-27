import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `${msm} Error: No se pudo realizar la actualización.\nRazón: ${err.message}`, m);
      return;
    }

    if (stderr) {
      console.warn('Advertencia durante la actualización:', stderr);
    }

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ [${emoji4}] El bot ya esta Actualizado
│
├─ Espera que el creador haga una Actualización...
│   ⇝ *${global.yahecho}*
╰─✦`, m);
    } else {
      conn.reply(m.chat, `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ [${emoji}] Actualización realizada con éxito.
│
├─ Los archivos del bot se Actualizaron Correctamente...
│   ⇝ *${stdout}*
╰─✦`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update'];

export default handler;

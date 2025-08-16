import fetch from "node-fetch";

  let handler = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return m.reply(`《✦》El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con el comando » *#nsfw on*`);
  }
  try {
    // Hacemos la petición a la API de gatos
    let res = await fetch("https://delirius-apiofc.vercel.app/nsfw/boobs");
    let buffer = await res.buffer();

    // Mensaje con decoración
    let mensaje = `
╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [🔥] Aquí tienes tus tetas pajero
│
├─ Suerte pajeandote bro 👻
│   ⇝ *Boobs*
╰─✦
    `;

    // Enviamos imagen + mensaje
    await conn.sendFile(m.chat, buffer, "gato.jpg", mensaje, m);
  } catch (e) {
    m.reply("⚠️ Ocurrió un error al obtener el gatito.");
  }
};

handler.help = ["boobs"];
handler.tags = ["nsfw"];
handler.command = ["boobs"];

export default handler;

const handler = async (m, { conn }) => {
  try {
    const jid = m.chat;

    // 💬 Mensaje directo sin quoted
    await conn.sendMessage(jid, {
      text: `
╭─〔 𝑯𝑶𝑳𝑨 𝑯𝑼𝑴𝑨𝑵𝑶 ✦ 𝑺𝑶𝒀 𝑬𝑳 𝑩𝑶𝑻 〕─╮
┃✨ ¡Hola! ¿Qué tal estás?
┃🌈 Estoy funcionando correctamente.
┃🔁 Si ves este mensaje, todo está bien.
╰─────────────────────────────╯`.trim()
    });
  } catch (err) {
    console.error('[ERROR en comando de prueba]', err);
    await conn.reply(m.chat, `
✘ 「 𝑼𝑷𝑺... 𝑯𝑼𝑩𝑶 𝑼𝑵 𝑬𝑹𝑹𝑶𝑹 」
➤ Algo salió mal al intentar enviarte el mensaje 😢
➤ Error técnico: ${err.message}`, m);
  }
};

handler.command = ['test'];
handler.help = ['test'];
handler.tags = ['test'];
handler.register = true;

export default handler;

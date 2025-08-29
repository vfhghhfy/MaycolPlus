var handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('🔒 Este comando solo se usa en grupos');

    const groupMetadata = await conn.groupMetadata(m.chat);

    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    const isUserAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin' || m.sender === groupMetadata.owner;

    if (!isUserAdmin) {
        return m.reply('❌ Solo los admins pueden usar este comando');
    }

    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ Número inválido');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('⚠️ Mencioná, respondé o escribí un número para expulsar');
    }

    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) return m.reply('❌ No puedo expulsarme a mí mismo');
    if (user === ownerGroup) return m.reply('❌ No se puede expulsar al dueño del grupo');
    if (user === ownerBot) return m.reply('❌ No se puede expulsar al dueño del bot');

    const fkontak = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: m.chat },
        message: { contactMessage: { displayName: '🍿 Kick User', vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Kick User\nTEL;type=CELL;waid=0:0\nEND:VCARD' } }
    };

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        await conn.sendMessage(m.chat, { text: '🌤️ Usuario expulsado con éxito' }, { quoted: fkontak });
    } catch (e) {
        await conn.sendMessage(m.chat, { text: '⚠️ No se pudo expulsar al usuario, puede que no tenga permisos' }, { quoted: fkontak });
    }
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.register = false;

export default handler;

let handler = async (m, { conn }) => {
  const name = 'SoyMaycol'
  const number = '51921826291'
  const email = 'soymaycol.cn@gmail.com'
  const org = 'Programador de Webs,Bots y mas'
  const note = 'Tengo 12 años XD'

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
ORG:${org}
EMAIL;type=EMAIL:${email}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
NOTE:${note}
END:VCARD
`.trim()

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }],
    },
  }, { quoted: m })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner', 'creator']

export default handler

let handler = async (m, { conn, text }) => {

let user = global.db.data.users[m.sender]

user.registered = false
return conn.reply(m.chat, `> ⭐ Tu registro fue borrado de mi base de datos.`, m)

}

handler.command = ['unreg']
handler.register = false
export default handler
import Starlights from "@StarlightsTeam/Scraper"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, '[ ✰ ] Qué le quieres decir a *Hanako*?.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* Holaa`, m, rcanal)
  
  try {
    let character_id = "7dNFCYh0JOVzRz3e9ISOM6fi6q5mQBwfSfWCUPDW_dU" //Consigue el ID de tu preferencia en https://spicychat.ai
    let name = conn.getName(m.sender)
    let { msg } = await Starlights.characterAi(character_id, text, name)

    await conn.reply(m.chat, `${msg.join("\n")}`, m, rcanal)
  } catch {
    await m.react('✖️')
  }
}
handler.tags = ["tools"]
handler.help = ["ai *<texto>*"]
handler.command = ["hanako"]
handler.register = true 
export default handler

import Starlights from "@StarlightsTeam/Scraper"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(
    m.chat, 
    '[ ✰ ] Qué le quieres decir a *Hanako*?.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* Holaa`, 
    m, 
    rcanal
  )
  
  try {
    let character_id = "7dNFCYh0JOVzRz3e9ISOM6fi6q5mQBwfSfWCUPDW_dU"
    let name = conn.getName(m.sender)
    let response = await Starlights.characterAi(character_id, text, name)

    // Debug: ver qué devuelve realmente
    console.log("Respuesta CharacterAI:", response)

    if (!response || !response.msg) {
      return conn.reply(m.chat, "⚠️ No recibí respuesta de Hanako.", m, rcanal)
    }

    let msg = Array.isArray(response.msg) ? response.msg.join("\n") : response.msg
    await conn.reply(m.chat, msg, m, rcanal)

  } catch (e) {
    console.error("Error en Hanako:", e)
    await m.react('✖️')
  }
}
handler.tags = ["tools"]
handler.help = ["ai *<texto>*"]
handler.command = ["hanako"]
handler.register = true 
export default handler

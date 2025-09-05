// Plugin para detectar comandos desconocidos
export async function before(m, { conn, usedPrefix }) {
    // Solo procesar si es un comando (empieza con prefix)
    if (!usedPrefix) return false
    
    // Obtener el comando sin el prefix
    let noPrefix = m.text.replace(usedPrefix, '')
    let [command] = noPrefix.trim().split` `.filter(v => v)
    
    // Si no hay comando, no hacer nada
    if (!command) return false
    
    command = command.toLowerCase()
    
    // Variable para verificar si el comando existe
    let commandExists = false
    
    // Recorrer todos los plugins para verificar si el comando existe
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin || plugin.disabled) continue
        
        // Verificar si el plugin tiene comandos definidos
        if (plugin.command) {
            let isMatch = plugin.command instanceof RegExp ? plugin.command.test(command) :
                Array.isArray(plugin.command) ? plugin.command.some(cmd => 
                    cmd instanceof RegExp ? cmd.test(command) : cmd === command
                ) :
                typeof plugin.command === 'string' ? plugin.command === command : false
            
            if (isMatch) {
                commandExists = true
                break
            }
        }
    }
    
    // Si el comando no existe, enviar mensaje de error
    if (!commandExists) {
        let response = `╭─✦ Comando Desconocido ✦─╮
│ 🌙 *Comando:* ${usedPrefix}${command}
│ 
│ 👻 No conozco ese conjuro...
│ Usa *${usedPrefix}menu* para ver 
│ todos los hechizos disponibles.
│
╰─✦ MaycolPlus ✦─╯`
        
        await conn.reply(m.chat, response, m)
        return true // Detener el procesamiento
    }
    
    return false // Continuar con el procesamiento normal
}

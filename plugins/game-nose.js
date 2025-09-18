// Sistema de Roba un Braindot - Comando unificado
// Base de datos temporal para braindots (se guarda en global.db)

// Lista completa de braindots del brainrot italiano
const braindotsList = [
  // Personajes principales del brainrot italiano
  "Tralalero Tralala", "Tung Tung Tung Sahur", "Bombardiro Crocodilo", "Ballerina Cappuccina",
  "Cappuccino Assassino", "Lirilì Larilà", "Gusini", "Frigo Cammello Buffo Fardello",
  
  // Personajes secundarios y variaciones
  "Brr Brr Patapim", "Cannolo Siciliano", "Pepperoni Pistolero", "Mozzarella Mafiosa",
  "Spaghetti Samurai", "Parmigiano Paladino", "Prosciutto Pirata", "Lasagna Ladra",
  "Ravioli Rebelde", "Tortellini Terrorista", "Risotto Revolucionario", "Carbonara Criminal",
  
  // Braindots de comida italiana épicos
  "Pizza Parlante Suprema", "Gelato Gigante Dorado", "Tiramisu Travieso Místico", "Minestrone Misterioso Legendario",
  "Focaccia Furiosa Ancestral", "Pesto Peligroso Arcano", "Bruschetta Bandita Celestial", "Ossobuco Oxidado Cósmico",
  "Pancetta Poderosa Imperial", "Ricotta Ruidosa Divina", "Mascarpone Malvado Supremo", "Gorgonzola Guerrero Eterno",
  
  // Braindots de animales italianos
  "Gatto Gangster Boss", "Cane Capo Mafioso", "Pollo Pistolero Legendario", "Pecora Peligrosa Suprema",
  "Mucca Mafiosa Divina", "Porco Pirata Dorado", "Cavallo Criminal Cósmico", "Coniglio Corrupto Místico",
  
  // Braindots de objetos italianos mágicos
  "Vespa Veloz Turbo", "Mandolina Mortal Encantada", "Gondola Guerrera Celestial", "Espresso Explosivo Nuclear",
  "Chianti Chocante Vintage", "Amaretto Armado Supremo", "Limoncello Letal Divino", "Sambuca Siniestra Cósmica",
  
  // Braindots épicos históricos
  "Romano Imperatore Magnus", "Gladiatore Supremo Maximus", "Centurione Cósmico Eternal", "Caesar Celestial Augustus",
  "Nero Nebuloso Infernal", "Augustus Absoluto Divine", "Marco Polo Místico Legendary", "Leonardo Legendario Renaissance",
  
  // Braindots místicos sobrenaturales
  "Fantasma Florentino Spectral", "Espíritu Siciliano Ethereal", "Alma Napolitana Celestial", "Sombra Veneciana Phantom",
  "Demonio Lombardo Infernal", "Ángel Toscano Seraphim", "Brujo Boloñés Arcane", "Mago Milanés Supreme",
  
  // Braindots de ciudades legendarias
  "Romano Ruidoso Colosseum", "Milanés Malvado Fashion", "Napolitano Ninja Vesuvio", "Veneciano Veloz Canal",
  "Florentino Feroz Renaissance", "Boloñés Bravo Academia", "Turines Terrorífico Alps", "Genovés Guerrero Maritime",
  
  // Braindots artísticos especiales
  "Paparazzi Poderoso Celebrity", "Fashionista Feroz Milano", "Tenor Terrorífico Opera", "Soprano Siniestra Divine",
  "Baritono Bandido Dramatic", "Director Diabolico Cinema", "Actor Armado Hollywood", "Pintor Peligroso Renaissance",
  
  // Braindots modernos digitales
  "TikToker Toscano Viral", "Influencer Italiano Trending", "Streamer Siciliano Gaming", "YouTuber Veronés Content",
  "Gamer Genovés Pro", "Cosplayer Calabrés Epic", "Vlogger Veneciano Travel", "Podcaster Pugliese Audio",
  
  // Braindots ultra raros legendarios
  "Il Supremo Braindottore", "La Regina dei Braindots", "Il Dragone Italiano Cosmico", "La Fenice Siciliana Eterna",
  "Il Kraken Napoletano Abissal", "La Sirena Veneciana Mística", "Il Leone Romano Dorado", "La Lupa Toscana Ancestral"
]

// Sistema de rareza con probabilidades
const obtenerBraindotAleatorio = () => {
  const rand = Math.random()
  let braindot
  
  if (rand < 0.45) { // 45% común (primeros 30)
    braindot = braindotsList.slice(0, 30)[Math.floor(Math.random() * 30)]
  } else if (rand < 0.75) { // 30% raro (siguiente 25)
    braindot = braindotsList.slice(30, 55)[Math.floor(Math.random() * 25)]
  } else if (rand < 0.92) { // 17% épico (siguiente 20)
    braindot = braindotsList.slice(55, 75)[Math.floor(Math.random() * 20)]
  } else { // 8% legendario (últimos 13)
    braindot = braindotsList.slice(75)[Math.floor(Math.random() * (braindotsList.length - 75))]
  }
  
  return braindot
}

// Función para inicializar datos de braindots en la base de datos
const inicializarBraindotData = (userId) => {
  if (!global.db.data.braindots) {
    global.db.data.braindots = {}
  }
  
  if (!global.db.data.braindots[userId]) {
    global.db.data.braindots[userId] = {
      braindots: ["Tralalero Tralala"], // Braindot inicial
      dinero: 100,
      nivelBase: 1,
      defensa: 0,
      lastDaily: "",
      baseCerrada: 0
    }
  }
  
  if (!global.db.data.basesCerradas) {
    global.db.data.basesCerradas = {}
  }
  
  return global.db.data.braindots[userId]
}

const handler = async (m, { conn, text, command, usedPrefix }) => {
  const sender = m.sender
  
  // Inicializar datos del usuario
  const userData = inicializarBraindotData(sender)
  
  switch(command) {
    case 'braindots':
    case 'misbraindots':
      let mensaje = `🧠 *BRAINDOTS DE ${await conn.getName(sender)}*\n\n`
      mensaje += `💰 *Dinero:* ${userData.dinero} monedas\n`
      mensaje += `🏰 *Nivel de Base:* ${userData.nivelBase}\n`
      mensaje += `🛡️ *Defensa:* ${userData.defensa}%\n\n`
      mensaje += `📦 *Braindots (${userData.braindots.length}):*\n`
      
      userData.braindots.forEach((braindot, index) => {
        mensaje += `${index + 1}. ${braindot}\n`
      })
      
      mensaje += `\n> Hecho por SoyMaycol <3`
      return conn.reply(m.chat, mensaje, m)

    case 'robarbraindot':
    case 'robar':
      if (!m.quoted) return conn.reply(m.chat, '⚠️ *Debes responder al mensaje de la persona a quien quieres robar!*\n\n> Hecho por SoyMaycol <3', m)
      
      const victim = m.quoted.sender
      if (sender === victim) return conn.reply(m.chat, '🚫 *No puedes robarte a ti mismo, genio!*\n\n> Hecho por SoyMaycol <3', m)
      
      const victimData = inicializarBraindotData(victim)
      
      // Verificar si la base está cerrada
      if (global.db.data.basesCerradas[victim] && Date.now() < global.db.data.basesCerradas[victim]) {
        const tiempoRestante = Math.ceil((global.db.data.basesCerradas[victim] - Date.now()) / 1000)
        return conn.reply(m.chat, `🔒 *La base de ${await conn.getName(victim)} está cerrada por ${tiempoRestante} segundos más!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      if (victimData.braindots.length === 0) {
        return conn.reply(m.chat, '😢 *Esta persona no tiene braindots para robar!*\n\n> Hecho por SoyMaycol <3', m)
      }
      
      // Calcular probabilidad de éxito
      const probabilidadBase = 70
      const probabilidadFinal = Math.max(10, probabilidadBase - victimData.defensa)
      const exito = Math.random() * 100 < probabilidadFinal
      
      if (!exito) {
        return conn.reply(m.chat, `🛡️ *${await conn.getName(victim)} logró defender su base! El robo falló!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      // Robo exitoso
      const indiceAleatorio = Math.floor(Math.random() * victimData.braindots.length)
      const braindotRobado = victimData.braindots[indiceAleatorio]
      
      victimData.braindots.splice(indiceAleatorio, 1)
      userData.braindots.push(braindotRobado)
      
      const dineroBonificacion = Math.floor(Math.random() * 50) + 10
      userData.dinero += dineroBonificacion
      
      let mensajeRobo = `🏴‍☠️ *ROBO EXITOSO!*\n\n`
      mensajeRobo += `${await conn.getName(sender)} le robó *${braindotRobado}* a ${await conn.getName(victim)}!\n\n`
      mensajeRobo += `💰 Bonificación: +${dineroBonificacion} monedas\n\n`
      mensajeRobo += `> Hecho por SoyMaycol <3`
      
      return conn.reply(m.chat, mensajeRobo, m)

    case 'cerrarbase':
    case 'protegerbase':
      const costoBase = 50 + (userData.nivelBase * 25)
      
      if (userData.dinero < costoBase) {
        return conn.reply(m.chat, `💸 *Necesitas ${costoBase} monedas para cerrar tu base!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      if (global.db.data.basesCerradas[sender] && Date.now() < global.db.data.basesCerradas[sender]) {
        const tiempoRestante = Math.ceil((global.db.data.basesCerradas[sender] - Date.now()) / 1000)
        return conn.reply(m.chat, `🔒 *Tu base ya está cerrada por ${tiempoRestante} segundos más!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      userData.dinero -= costoBase
      global.db.data.basesCerradas[sender] = Date.now() + 60000 // 60 segundos
      
      let mensajeCerrar = `🔒 *BASE CERRADA!*\n\n`
      mensajeCerrar += `Tu base estará protegida por 60 segundos!\n`
      mensajeCerrar += `💰 Costo: ${costoBase} monedas\n\n`
      mensajeCerrar += `> Hecho por SoyMaycol <3`
      
      conn.reply(m.chat, mensajeCerrar, m)
      
      // Auto-abrir después de 60 segundos
      setTimeout(() => {
        delete global.db.data.basesCerradas[sender]
        conn.sendMessage(m.chat, { 
          text: `🔓 *La base de ${conn.getName(sender)} se ha abierto automáticamente!*\n\n> Hecho por SoyMaycol <3` 
        })
      }, 60000)
      break

    case 'mejorarbase':
    case 'upgradebase':
      const nivelActual = userData.nivelBase
      const siguienteNivel = nivelActual + 1
      
      if (siguienteNivel > 5) {
        return conn.reply(m.chat, '🏰 *Ya tienes la base al nivel máximo (5)!*\n\n> Hecho por SoyMaycol <3', m)
      }
      
      const costoMonedas = 200 * siguienteNivel
      const braindotsRequeridos = 5 + (siguienteNivel * 2)
      
      // Braindots específicos requeridos
      const braindotsEspecificos = {
        2: ["Tralalero Tralala", "Tung Tung Tung Sahur"],
        3: ["Bombardiro Crocodilo", "Ballerina Cappuccina", "Cappuccino Assassino"],
        4: ["Romano Imperatore Magnus", "Gladiatore Supremo Maximus"],
        5: ["Fantasma Florentino Spectral", "Leonardo Legendario Renaissance"]
      }
      
      if (userData.dinero < costoMonedas) {
        return conn.reply(m.chat, `💸 *Necesitas ${costoMonedas} monedas para mejorar a nivel ${siguienteNivel}!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      if (userData.braindots.length < braindotsRequeridos) {
        return conn.reply(m.chat, `📦 *Necesitas al menos ${braindotsRequeridos} braindots para mejorar a nivel ${siguienteNivel}!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      // Verificar braindots específicos
      if (braindotsEspecificos[siguienteNivel]) {
        const requeridos = braindotsEspecificos[siguienteNivel]
        const faltantes = requeridos.filter(braindot => !userData.braindots.includes(braindot))
        
        if (faltantes.length > 0) {
          let mensajeFaltantes = `🧩 *Necesitas estos braindots específicos para nivel ${siguienteNivel}:*\n\n`
          faltantes.forEach(braindot => {
            mensajeFaltantes += `• ${braindot}\n`
          })
          mensajeFaltantes += `\n> Hecho por SoyMaycol <3`
          return conn.reply(m.chat, mensajeFaltantes, m)
        }
      }
      
      // Realizar mejora
      userData.dinero -= costoMonedas
      userData.nivelBase = siguienteNivel
      userData.defensa = (siguienteNivel - 1) * 15
      
      let mensajeMejora = `🏰 *BASE MEJORADA!*\n\n`
      mensajeMejora += `Nivel: ${nivelActual} → ${siguienteNivel}\n`
      mensajeMejora += `🛡️ Defensa: ${userData.defensa}%\n`
      mensajeMejora += `💰 Costo: ${costoMonedas} monedas\n\n`
      mensajeMejora += `¡Tu base ahora es más fuerte contra robos!\n\n`
      mensajeMejora += `> Hecho por SoyMaycol <3`
      
      return conn.reply(m.chat, mensajeMejora, m)

    case 'dailybraindot':
    case 'daily':
      const ahora = new Date()
      const hoyKey = `${ahora.getFullYear()}-${ahora.getMonth()}-${ahora.getDate()}`
      
      if (userData.lastDaily === hoyKey) {
        return conn.reply(m.chat, '⏰ *Ya reclamaste tu braindot diario! Vuelve mañana.*\n\n> Hecho por SoyMaycol <3', m)
      }
      
      const braindotDiario = obtenerBraindotAleatorio()
      const dineroBonificacion = Math.floor(Math.random() * 100) + 50
      
      userData.braindots.push(braindotDiario)
      userData.dinero += dineroBonificacion
      userData.lastDaily = hoyKey
      
      let mensajeDaily = `🎁 *BRAINDOT DIARIO!*\n\n`
      mensajeDaily += `Has recibido: *${braindotDiario}*\n`
      mensajeDaily += `💰 Bonificación: +${dineroBonificacion} monedas\n\n`
      mensajeDaily += `¡Vuelve mañana por otro braindot!\n\n`
      mensajeDaily += `> Hecho por SoyMaycol <3`
      
      return conn.reply(m.chat, mensajeDaily, m)

    case 'comprarbdt':
    case 'comprarbdts':
      const cantidad = parseInt(text) || 1
      if (cantidad < 1 || cantidad > 10) {
        return conn.reply(m.chat, '🛒 *Puedes comprar entre 1 y 10 braindots por vez*\n\n> Hecho por SoyMaycol <3', m)
      }
      
      const costoPorBraindot = 150
      const costoTotal = costoPorBraindot * cantidad
      
      if (userData.dinero < costoTotal) {
        return conn.reply(m.chat, `💸 *Necesitas ${costoTotal} monedas para comprar ${cantidad} braindot${cantidad > 1 ? 's' : ''}!*\n\n> Hecho por SoyMaycol <3`, m)
      }
      
      userData.dinero -= costoTotal
      const braindotsComprados = []
      
      for (let i = 0; i < cantidad; i++) {
        const nuevoBraindot = obtenerBraindotAleatorio()
        userData.braindots.push(nuevoBraindot)
        braindotsComprados.push(nuevoBraindot)
      }
      
      let mensajeCompra = `🛒 *COMPRA EXITOSA!*\n\n`
      mensajeCompra += `Has comprado ${cantidad} braindot${cantidad > 1 ? 's' : ''} por ${costoTotal} monedas:\n\n`
      braindotsComprados.forEach((braindot, index) => {
        mensajeCompra += `${index + 1}. ${braindot}\n`
      })
      mensajeCompra += `\n> Hecho por SoyMaycol <3`
      
      return conn.reply(m.chat, mensajeCompra, m)

    default:
      return conn.reply(m.chat, '❓ *Comando no reconocido*\n\n> Hecho por SoyMaycol <3', m)
  }
}

handler.help = ['braindots', 'robarbraindot', 'cerrarbase', 'mejorarbase', 'dailybraindot', 'comprarbdt']
handler.tags = ['game']
handler.command = ['braindots', 'misbraindots', 'robarbraindot', 'robar', 'cerrarbase', 'protegerbase', 'mejorarbase', 'upgradebase', 'dailybraindot', 'daily', 'comprarbdt', 'comprarbdts']
handler.register = true

export default handler

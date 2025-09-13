// Base de datos temporal para los braindots y usuarios
let braindotData = {}
let basesCerradas = {}
let mejorasBases = {}

// Lista extensa de braindots inspirados en el brainrot italiano
const braindotsList = [
  // Personajes principales
  "Tralalero Tralala", "Tung Tung Tung Sahur", "Bombardiro Crocodilo", "Ballerina Cappuccina",
  "Cappuccino Assassino", "Lirilì Larilà", "Gusini", "Frigo Cammello Buffo Fardello",
  
  // Personajes secundarios y variaciones
  "Brr Brr Patapim", "Cannolo Siciliano", "Pepperoni Pistolero", "Mozzarella Mafiosa",
  "Spaghetti Samurai", "Parmigiano Paladino", "Prosciutto Pirata", "Lasagna Ladra",
  "Ravioli Rebelde", "Tortellini Terrorista", "Risotto Revolucionario", "Carbonara Criminal",
  
  // Braindots de comida italiana
  "Pizza Parlante", "Gelato Gigante", "Tiramisu Travieso", "Minestrone Misterioso",
  "Focaccia Furiosa", "Pesto Peligroso", "Bruschetta Bandita", "Ossobuco Oxidado",
  "Pancetta Poderosa", "Ricotta Ruidosa", "Mascarpone Malvado", "Gorgonzola Guerrero",
  
  // Braindots de animales italianos
  "Gatto Gangster", "Cane Capo", "Pollo Pistolero", "Pecora Peligrosa",
  "Mucca Mafiosa", "Porco Pirata", "Cavallo Criminal", "Coniglio Corrupto",
  
  // Braindots de objetos italianos
  "Vespa Veloz", "Mandolina Mortal", "Gondola Guerrera", "Espresso Explosivo",
  "Chianti Chocante", "Amaretto Armado", "Limoncello Letal", "Sambuca Siniestra",
  
  // Braindots épicos (más raros)
  "Romano Imperatore", "Gladiatore Supremo", "Centurione Cósmico", "Caesar Celestial",
  "Nero Nebuloso", "Augustus Absoluto", "Marco Polo Místico", "Leonardo Legendario",
  
  // Braindots místicos
  "Fantasma Florentino", "Espíritu Siciliano", "Alma Napolitana", "Sombra Veneciana",
  "Demonio Lombardo", "Ángel Toscano", "Brujo Boloñés", "Mago Milanés",
  
  // Braindots de ciudades
  "Romano Ruidoso", "Milanés Malvado", "Napolitano Ninja", "Veneciano Veloz",
  "Florentino Feroz", "Boloñés Bravo", "Turines Terrorífico", "Genovés Guerrero",
  
  // Braindots especiales
  "Paparazzi Poderoso", "Fashionista Feroz", "Tenor Terrorífico", "Soprano Siniestra",
  "Baritono Bandido", "Director Diabolico", "Actor Armado", "Pintor Peligroso",
  
  // Braindots modernos
  "TikToker Toscano", "Influencer Italiano", "Streamer Siciliano", "YouTuber de Verona",
  "Gamer Genovés", "Cosplayer Calabrés", "Vlogger Veneciano", "Podcaster Pugliese"
]

// Rareza de braindots (probabilidades)
const rarezaBraindots = {
  comun: braindotsList.slice(0, 40),
  raro: braindotsList.slice(40, 60),
  epico: braindotsList.slice(60, 75),
  legendario: braindotsList.slice(75)
}

// Función para inicializar usuario
function inicializarUsuario(userId) {
  if (!braindotData[userId]) {
    braindotData[userId] = {
      braindots: ["Tralalero Tralala"], // Braindot inicial
      dinero: 100,
      nivelBase: 1,
      defensa: 0
    }
  }
}

// Función para obtener braindot aleatorio
function obtenerBraindotAleatorio() {
  const rand = Math.random()
  let listaBraindots
  
  if (rand < 0.5) { // 50% común
    listaBraindots = rarezaBraindots.comun
  } else if (rand < 0.8) { // 30% raro
    listaBraindots = rarezaBraindots.raro
  } else if (rand < 0.95) { // 15% épico
    listaBraindots = rarezaBraindots.epico
  } else { // 5% legendario
    listaBraindots = rarezaBraindots.legendario
  }
  
  return listaBraindots[Math.floor(Math.random() * listaBraindots.length)]
}

// Comando principal: .braindots
const braindotsHandler = async (m, { conn }) => {
  const userId = m.sender
  inicializarUsuario(userId)
  
  const userData = braindotData[userId]
  let mensaje = `🧠 *BRAINDOTS DE ${await conn.getName(m.sender)}*\n\n`
  mensaje += `💰 *Dinero:* ${userData.dinero} monedas\n`
  mensaje += `🏰 *Nivel de Base:* ${userData.nivelBase}\n`
  mensaje += `🛡️ *Defensa:* ${userData.defensa}%\n\n`
  mensaje += `📦 *Braindots (${userData.braindots.length}):*\n`
  
  userData.braindots.forEach((braindot, index) => {
    mensaje += `${index + 1}. ${braindot}\n`
  })
  
  mensaje += `\n> Hecho por SoyMaycol <3`
  
  conn.reply(m.chat, mensaje, m)
}

// Comando: .robarbraindot
const robarBraindotHandler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, '⚠️ *Debes responder al mensaje de la persona a quien quieres robar!*', m)
  
  const ladrón = m.sender
  const víctima = m.quoted.sender
  
  if (ladrón === víctima) return conn.reply(m.chat, '🚫 *No puedes robarte a ti mismo, genio!*', m)
  
  inicializarUsuario(ladrón)
  inicializarUsuario(víctima)
  
  // Verificar si la base de la víctima está cerrada
  if (basesCerradas[víctima] && Date.now() < basesCerradas[víctima]) {
    const tiempoRestante = Math.ceil((basesCerradas[víctima] - Date.now()) / 1000)
    return conn.reply(m.chat, `🔒 *La base de ${await conn.getName(víctima)} está cerrada por ${tiempoRestante} segundos más!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  const datosVíctima = braindotData[víctima]
  const datosLadrón = braindotData[ladrón]
  
  if (datosVíctima.braindots.length === 0) {
    return conn.reply(m.chat, '😢 *Esta persona no tiene braindots para robar!*\n\n> Hecho por SoyMaycol <3', m)
  }
  
  // Calcular probabilidad de éxito (considerando defensa)
  const probabilidadBase = 70 // 70% base
  const penalizacionDefensa = datosVíctima.defensa
  const probabilidadFinal = Math.max(10, probabilidadBase - penalizacionDefensa)
  
  const éxito = Math.random() * 100 < probabilidadFinal
  
  if (!éxito) {
    return conn.reply(m.chat, `🛡️ *${await conn.getName(víctima)} logró defender su base! El robo falló!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  // Robo exitoso
  const índiceAleatorio = Math.floor(Math.random() * datosVíctima.braindots.length)
  const braindotRobado = datosVíctima.braindots[índiceAleatorio]
  
  // Remover de la víctima y agregar al ladrón
  datosVíctima.braindots.splice(índiceAleatorio, 1)
  datosLadrón.braindots.push(braindotRobado)
  
  // Dar dinero al ladrón
  const dineroBonificación = Math.floor(Math.random() * 50) + 10
  datosLadrón.dinero += dineroBonificación
  
  let mensaje = `🏴‍☠️ *ROBO EXITOSO!*\n\n`
  mensaje += `${await conn.getName(ladrón)} le robó *${braindotRobado}* a ${await conn.getName(víctima)}!\n\n`
  mensaje += `💰 Bonificación: +${dineroBonificación} monedas\n\n`
  mensaje += `> Hecho por SoyMaycol <3`
  
  conn.reply(m.chat, mensaje, m)
}

// Comando: .cerrarbase
const cerrarBaseHandler = async (m, { conn }) => {
  const userId = m.sender
  inicializarUsuario(userId)
  
  const userData = braindotData[userId]
  const costoBase = 50 + (userData.nivelBase * 25)
  
  if (userData.dinero < costoBase) {
    return conn.reply(m.chat, `💸 *Necesitas ${costoBase} monedas para cerrar tu base!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  // Verificar si ya está cerrada
  if (basesCerradas[userId] && Date.now() < basesCerradas[userId]) {
    const tiempoRestante = Math.ceil((basesCerradas[userId] - Date.now()) / 1000)
    return conn.reply(m.chat, `🔒 *Tu base ya está cerrada por ${tiempoRestante} segundos más!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  // Cerrar base
  userData.dinero -= costoBase
  basesCerradas[userId] = Date.now() + 60000 // 60 segundos
  
  let mensaje = `🔒 *BASE CERRADA!*\n\n`
  mensaje += `Tu base estará protegida por 60 segundos!\n`
  mensaje += `💰 Costo: ${costoBase} monedas\n\n`
  mensaje += `> Hecho por SoyMaycol <3`
  
  conn.reply(m.chat, mensaje, m)
  
  // Auto-abrir después de 60 segundos
  setTimeout(() => {
    delete basesCerradas[userId]
    conn.sendMessage(m.chat, { text: `🔓 *La base de ${conn.getName(m.sender)} se ha abierto automáticamente!*\n\n> Hecho por SoyMaycol <3` })
  }, 60000)
}

// Comando: .mejorarbase
const mejorarBaseHandler = async (m, { conn }) => {
  const userId = m.sender
  inicializarUsuario(userId)
  
  const userData = braindotData[userId]
  const nivelActual = userData.nivelBase
  const siguienteNivel = nivelActual + 1
  
  // Requisitos para mejorar (escalan con el nivel)
  const costoMonedas = 200 * siguienteNivel
  const braindotsRequeridos = 5 + (siguienteNivel * 2)
  
  // Braindots específicos requeridos según el nivel
  const braindotsEspecíficos = {
    2: ["Tralalero Tralala", "Tung Tung Tung Sahur"],
    3: ["Bombardiro Crocodilo", "Ballerina Cappuccina", "Cappuccino Assassino"],
    4: ["Romano Imperatore", "Gladiatore Supremo"],
    5: ["Fantasma Florentino", "Leonardo Legendario"]
  }
  
  if (siguienteNivel > 5) {
    return conn.reply(m.chat, '🏰 *Ya tienes la base al nivel máximo (5)!*\n\n> Hecho por SoyMaycol <3', m)
  }
  
  // Verificar dinero
  if (userData.dinero < costoMonedas) {
    return conn.reply(m.chat, `💸 *Necesitas ${costoMonedas} monedas para mejorar a nivel ${siguienteNivel}!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  // Verificar cantidad de braindots
  if (userData.braindots.length < braindotsRequeridos) {
    return conn.reply(m.chat, `📦 *Necesitas al menos ${braindotsRequeridos} braindots para mejorar a nivel ${siguienteNivel}!*\n\n> Hecho por SoyMaycol <3`, m)
  }
  
  // Verificar braindots específicos
  if (braindotsEspecíficos[siguienteNivel]) {
    const requeridos = braindotsEspecíficos[siguienteNivel]
    const faltantes = requeridos.filter(braindot => !userData.braindots.includes(braindot))
    
    if (faltantes.length > 0) {
      let mensaje = `🧩 *Necesitas estos braindots específicos para nivel ${siguienteNivel}:*\n\n`
      faltantes.forEach(braindot => {
        mensaje += `• ${braindot}\n`
      })
      mensaje += `\n> Hecho por SoyMaycol <3`
      return conn.reply(m.chat, mensaje, m)
    }
  }
  
  // Realizar mejora
  userData.dinero -= costoMonedas
  userData.nivelBase = siguienteNivel
  userData.defensa = (siguienteNivel - 1) * 15 // +15% defensa por nivel
  
  let mensaje = `🏰 *BASE MEJORADA!*\n\n`
  mensaje += `Nivel: ${nivelActual} → ${siguienteNivel}\n`
  mensaje += `🛡️ Defensa: ${userData.defensa}%\n`
  mensaje += `💰 Costo: ${costoMonedas} monedas\n\n`
  mensaje += `¡Tu base ahora es más fuerte contra robos!\n\n`
  mensaje += `> Hecho por SoyMaycol <3`
  
  conn.reply(m.chat, mensaje, m)
}

// Comando: .dailybraindot (bonus diario)
const dailyBraindotHandler = async (m, { conn }) => {
  const userId = m.sender
  inicializarUsuario(userId)
  
  const userData = braindotData[userId]
  const ahora = new Date()
  const hoyKey = `${ahora.getFullYear()}-${ahora.getMonth()}-${ahora.getDate()}`
  
  if (!userData.lastDaily) userData.lastDaily = ""
  
  if (userData.lastDaily === hoyKey) {
    return conn.reply(m.chat, '⏰ *Ya reclamaste tu braindot diario! Vuelve mañana.*\n\n> Hecho por SoyMaycol <3', m)
  }
  
  const braindotDiario = obtenerBraindotAleatorio()
  const dineroBonificación = Math.floor(Math.random() * 100) + 50
  
  userData.braindots.push(braindotDiario)
  userData.dinero += dineroBonificación
  userData.lastDaily = hoyKey
  
  let mensaje = `🎁 *BRAINDOT DIARIO!*\n\n`
  mensaje += `Has recibido: *${braindotDiario}*\n`
  mensaje += `💰 Bonificación: +${dineroBonificación} monedas\n\n`
  mensaje += `¡Vuelve mañana por otro braindot!\n\n`
  mensaje += `> Hecho por SoyMaycol <3`
  
  conn.reply(m.chat, mensaje, m)
}

// Configuración de los handlers
braindotsHandler.help = ['braindots']
braindotsHandler.tags = ['game']
braindotsHandler.command = ['braindots', 'misbraindots']
braindotsHandler.register = true

robarBraindotHandler.help = ['robarbraindot']
robarBraindotHandler.tags = ['game']
robarBraindotHandler.command = ['robarbraindot', 'robar']
robarBraindotHandler.register = true

cerrarBaseHandler.help = ['cerrarbase']
cerrarBaseHandler.tags = ['game']
cerrarBaseHandler.command = ['cerrarbase', 'protegerbase']
cerrarBaseHandler.register = true

mejorarBaseHandler.help = ['mejorarbase']
mejorarBaseHandler.tags = ['game']
mejorarBaseHandler.command = ['mejorarbase', 'upgradebase']
mejorarBaseHandler.register = true

dailyBraindotHandler.help = ['dailybraindot']
dailyBraindotHandler.tags = ['game']
dailyBraindotHandler.command = ['dailybraindot', 'daily']
dailyBraindotHandler.register = true

// Exportar todos los handlers
export {
  braindotsHandler as default,
  robarBraindotHandler as robar,
  cerrarBaseHandler as cerrarbase,
  mejorarBaseHandler as mejorarbase,
  dailyBraindotHandler as daily
}

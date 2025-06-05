import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

let globalBot = null;
let botRestartInterval = null;
let isShuttingDown = false;
let restartCount = 0;
let lastRestartTime = 0;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de límites para evitar bucles infinitos
const MAX_RESTART_ATTEMPTS = 5;
const RESTART_COOLDOWN = 60000; // 1 minuto
const RESTART_DELAY = 5000; // 5 segundos

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Ruta para escribir el número manualmente
app.get('/auth/:numero', (req, res) => {
  const numero = req.params.numero;
  console.log(`Escribiendo número manualmente: ${numero}`);

  if (globalBot && globalBot.stdin && !globalBot.killed) {
    try {
      globalBot.stdin.write(numero + '\n');
      res.json({ 
        success: true, 
        message: `Número ${numero} enviado al bot correctamente` 
      });
    } catch (error) {
      console.error('Error al enviar número al bot:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al enviar número al bot' 
      });
    }
  } else {
    res.status(503).json({ 
      success: false, 
      message: 'El bot no está disponible actualmente' 
    });
  }
});

// Ruta para obtener el estado del bot
app.get('/status', (req, res) => {
  const status = {
    botRunning: globalBot && !globalBot.killed,
    restartCount: restartCount,
    uptime: process.uptime(),
    isShuttingDown: isShuttingDown
  };
  res.json(status);
});

// Ruta para reiniciar manualmente el bot
app.post('/restart', (req, res) => {
  console.log('Reinicio manual solicitado...');
  restartBot(true);
  res.json({ success: true, message: 'Bot reiniciado manualmente' });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor web iniciado en el puerto ${PORT}`);
});

// Función mejorada para iniciar el bot
function startBot(isManualRestart = false) {
  if (isShuttingDown) {
    console.log('Sistema cerrándose, no se iniciará el bot');
    return;
  }

  const now = Date.now();
  
  // Control de reinicio automático para evitar bucles
  if (!isManualRestart && lastRestartTime && (now - lastRestartTime < RESTART_COOLDOWN)) {
    restartCount++;
    if (restartCount >= MAX_RESTART_ATTEMPTS) {
      console.error(`Demasiados reinicios (${restartCount}). Deteniendo intentos automáticos.`);
      console.log('Para reiniciar manualmente, usa: POST /restart');
      return;
    }
  } else if (now - lastRestartTime >= RESTART_COOLDOWN) {
    // Reset del contador si ha pasado suficiente tiempo
    restartCount = 0;
  }

  lastRestartTime = now;

  console.log(`Iniciando YukiBot-MD... (Intento ${restartCount + 1})`);

  // Detener bot anterior de forma segura
  if (globalBot && !globalBot.killed) {
    try {
      globalBot.removeAllListeners();
      globalBot.kill('SIGTERM');
      console.log('Bot anterior detenido');
    } catch (error) {
      console.error('Error al detener bot anterior:', error);
    }
  }

  // Crear nuevo proceso del bot
  const bot = spawn('node', ['index.js', '--max-old-space-size=146'], {
    stdio: ['pipe', 'inherit', 'inherit'],
    detached: false
  });

  globalBot = bot;

  // Manejar errores del proceso
  bot.on('error', (error) => {
    console.error('Error al iniciar el bot:', error);
    if (!isShuttingDown) {
      console.log(`Reintentando en ${RESTART_DELAY / 1000} segundos...`);
      setTimeout(() => startBot(), RESTART_DELAY);
    }
  });

  // Manejar cierre del proceso
  bot.on('close', (code, signal) => {
    console.log(`Bot finalizado - Código: ${code}, Señal: ${signal}`);
    
    if (isShuttingDown) {
      console.log('Sistema cerrándose, no se reiniciará el bot');
      return;
    }

    // Solo reiniciar si fue un error inesperado
    if (code !== null && code !== 0) {
      console.log(`Error en el bot (código ${code}). Reiniciando en ${RESTART_DELAY / 1000} segundos...`);
      setTimeout(() => startBot(), RESTART_DELAY);
    } else if (signal === 'SIGTERM' || signal === 'SIGINT') {
      console.log('Bot terminado por señal de sistema');
    } else if (code === null && signal === null) {
      console.log('Bot terminado inesperadamente. Reiniciando...');
      setTimeout(() => startBot(), RESTART_DELAY);
    }
  });

  // Configurar reinicio automático programado
  setupScheduledRestart();
}

// Función para configurar reinicio programado
function setupScheduledRestart() {
  if (botRestartInterval) {
    clearInterval(botRestartInterval);
  }
  
  botRestartInterval = setInterval(() => {
    if (!isShuttingDown) {
      console.log('Reinicio programado (cada 30 minutos)...');
      restartBot(true);
    }
  }, 30 * 60 * 1000); // 30 minutos
}

// Función para reiniciar el bot de forma controlada
function restartBot(isManual = false) {
  console.log(isManual ? 'Reinicio manual iniciado...' : 'Reinicio automático iniciado...');
  
  if (globalBot && !globalBot.killed) {
    globalBot.removeAllListeners();
    globalBot.kill('SIGTERM');
    
    // Esperar un momento antes de iniciar el nuevo proceso
    setTimeout(() => {
      startBot(isManual);
    }, 2000);
  } else {
    startBot(isManual);
  }
}

// Función para cerrar todo de forma segura
function gracefulShutdown() {
  console.log('Iniciando cierre seguro del sistema...');
  isShuttingDown = true;
  
  // Limpiar intervalos
  if (botRestartInterval) {
    clearInterval(botRestartInterval);
    botRestartInterval = null;
  }
  
  // Cerrar bot
  if (globalBot && !globalBot.killed) {
    console.log('Cerrando bot...');
    globalBot.removeAllListeners();
    globalBot.kill('SIGTERM');
    
    // Esperar a que el bot se cierre antes de cerrar el servidor
    setTimeout(() => {
      server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
      });
    }, 3000);
  } else {
    server.close(() => {
      console.log('Servidor cerrado');
      process.exit(0);
    });
  }
}

// Iniciar el bot
startBot();

// Manejar señales de cierre
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

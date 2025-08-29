import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, args, command }) => {
  let url = args[0];
  let calidad = args[1] || '1080';

  if (!url) {
    return m.reply(`❗ *Debes proporcionar un enlace de YouTube.*\n\n📌 *Ejemplo:*\n*.ytdl https://youtu.be/dQw4w9WgXcQ*`);
  }

  if (!esUrlYouTubeValida(url)) {
    return m.reply(`🚫 *El enlace no es válido.*\nAsegúrate de que sea un enlace de YouTube.`);
  }

  m.reply("🔄 *Procesando tu solicitud...*\nPor favor, espera unos segundos.");

  let resultado;
  if (command.includes("mp3")) {
    resultado = await convertirYoutubeMp3(url);
  } else {
    resultado = await descargarVideo(url, calidad);
  }

  if (!resultado.success) {
    return m.reply(`❌ *Error:* ${resultado.error.message}`);
  }

  let { title, downloadUrl, image, type, quality: q } = resultado.data;

  if (type === 'mp3') {
    await conn.sendFile(m.chat, downloadUrl, `${title}.mp3`, `🎧 *Audio:* ${title}`, m, false, { mimetype: 'audio/mp4' });
  } else {
    await conn.sendFile(m.chat, downloadUrl, `${title}.mp4`, `🎬 *Video:* ${title}\n📥 *Calidad:* ${q}`, m);
  }
};

handler.command = ['ytdl', 'ytdlmp3'];
export default handler;

// ✅ Funciones auxiliares

function esUrlYouTubeValida(url) {
  const regexYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regexYouTube.test(url);
}

async function convertirYoutubeMp3(url) {
  try {
    const form = new FormData();
    form.append("url", url);

    const { data } = await axios.post(
      "https://www.youtubemp3.ltd/convert",
      form,
      {
        headers: {
          ...form.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 45000
      }
    );

    if (!data || !data.link) {
      return { success: false, error: { message: "🔗 No se encontró el enlace de descarga." } };
    }

    return {
      success: true,
      data: {
        title: data.filename || "Título desconocido",
        downloadUrl: data.link,
        type: "mp3"
      }
    };

  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || error.message || "⚠️ Error al convertir a MP3."
      }
    };
  }
}

async function descargarVideo(url, calidad = "360") {
  try {
    const calidadesPermitidas = {
      "480": 480,
      "1080": 1080,
      "720": 720,
      "360": 360,
      "audio": "mp3",
    };

    if (!Object.keys(calidadesPermitidas).includes(calidad)) {
      return {
        success: false,
        error: {
          message: `⚠️ *Calidad no válida.*\n\n🎚️ Calidades disponibles: ${Object.keys(calidadesPermitidas).join(', ')}`
        }
      };
    }

    const q = calidadesPermitidas[calidad];

    const { data: primeraPeticion } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${q}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!primeraPeticion || !primeraPeticion.progress_url) {
      return {
        success: false,
        error: { message: "❌ No se pudo iniciar la descarga." }
      };
    }

    const { progress_url } = primeraPeticion;
    let intentos = 0, maxIntentos = 40, datos;

    do {
      if (intentos >= maxIntentos) {
        return { success: false, error: { message: "⏱️ La operación tardó demasiado tiempo." } };
      }

      await new Promise(r => setTimeout(r, 3000));

      try {
        const { data } = await axios.get(progress_url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        datos = data;
      } catch {}

      intentos++;
    } while (!datos?.download_url);

    return {
      success: true,
      data: {
        title: primeraPeticion.info?.title || "Título desconocido",
        image: primeraPeticion.info?.image || "",
        downloadUrl: datos.download_url,
        quality: calidad,
        type: calidad === "audio" ? "mp3" : "mp4"
      }
    };

  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || error.message || "❌ Error durante la descarga."
      }
    };
  }
}
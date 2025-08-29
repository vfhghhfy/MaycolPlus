import axios from "axios";
import FormData from "form-data";
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

class EarthZoomOutAPI {
  constructor() {
    this.baseURL = "https://aiearthzoomout.space/api";
    this.commonHeaders = {
      accept: "*/*",
      "accept-language": "id-ID,id;q=0.9",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": '"Lemur";v="135", "", "", "Microsoft Edge Simulate";v="135"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
      origin: "https://aiearthzoomout.space",
      referer: "https://aiearthzoomout.space/"
    };
  }

  async upload(imageBuffer, filename = "image.webp") {
    const formData = new FormData();
    formData.append("file", imageBuffer, { filename, contentType: "image/webp" });
    const headers = { ...this.commonHeaders, ...formData.getHeaders() };
    const response = await axios.post(`${this.baseURL}/upload`, formData, { headers, timeout: 30000 });
    return response.data;
  }

  async create({ imageUrl, quality = "1080p", zoomLevel = 15, duration = 6 }) {
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 30000 });
    const imageBuffer = Buffer.from(imageResponse.data);
    const filename = imageUrl.split("/").pop() || "image.webp";
    const uploadResponse = await this.upload(imageBuffer, filename);

    const generateData = {
      uploadId: uploadResponse.uploadId || `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quality,
      zoomLevel,
      duration
    };

    const generateHeaders = { ...this.commonHeaders, "content-type": "application/json" };
    const generateResponse = await axios.post(`${this.baseURL}/generate`, generateData, { headers: generateHeaders, timeout: 60000 });
    return generateResponse.data;
  }

  async status(task_id) {
    const response = await axios.get(`${this.baseURL}/status/${task_id}`, { headers: this.commonHeaders, timeout: 15000 });
    return response.data;
  }
}

const earthZoom = new EarthZoomOutAPI();

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const senderId = msg.key.participant || msg.key.remoteJid;

  // Initial reaction
  await conn.sendMessage(chatId, {
    react: { text: '🛰️', key: msg.key }
  });

  // Get image URL from quoted message or text
  const context = msg.message?.extendedTextMessage?.contextInfo;
  const quotedImage = context?.quotedMessage?.imageMessage;
  let imageUrl = null;

  if (quotedImage) {
    // Download quoted image
    const stream = await downloadContentFromMessage(context.quotedMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    const uploadResponse = await earthZoom.upload(buffer, 'quoted.webp');
    imageUrl = uploadResponse.url;
  } else if (msg.message?.conversation) {
    imageUrl = msg.message.conversation.trim(); // Direct URL
  }

  if (!imageUrl) return conn.sendMessage(chatId, { text: "❌ I need an image URL or a quoted image." }, { quoted: msg });

  await conn.sendMessage(chatId, { text: "🌌 Generating zoom effect video..." }, { quoted: msg });

  try {
    const result = await earthZoom.create({ imageUrl });
    await conn.sendMessage(chatId, {
      text: `✅ Video generated successfully!\nTask ID: ${result.taskId || result.id}`
    }, { quoted: msg });
  } catch (err) {
    await conn.sendMessage(chatId, { text: `❌ Error generating video: ${err.message}` }, { quoted: msg });
  }
};

handler.command = ['earthzoom', 'zoomvideo'];
handler.group = true;


export default handler;
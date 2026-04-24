const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;

const initWhatsApp = () => {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  });

  client.on('qr', (qr) => {
    console.log('--- ESCANEA ESTE CÓDIGO QR PARA VINCULAR WHATSAPP ---');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('¡WhatsApp está listo!');
  });

  client.initialize();
};

const sendWhatsAppMessage = async (number, message) => {
  if (!client) return;
  const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
  await client.sendMessage(chatId, message);
};

module.exports = { initWhatsApp, sendWhatsAppMessage };

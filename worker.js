const { initWhatsApp } = require('./src/lib/whatsapp');
const { startNotificationCron } = require('./src/lib/cron');

console.log('--- INICIANDO SERVICIOS DE NOTIFICACIÓN ---');
initWhatsApp();
startNotificationCron();
console.log('Bot de WhatsApp y Cron de notificaciones activos.');

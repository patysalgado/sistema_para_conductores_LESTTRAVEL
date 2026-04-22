const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendWhatsAppMessage } = require('./whatsapp');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const logToFile = (msg) => {
  const time = new Date().toISOString();
  fs.appendFileSync(path.join(__dirname, '../../cron_log.txt'), `[${time}] ${msg}\n`);
};

const startNotificationCron = () => {
  logToFile('--- INICIANDO CRON DE NOTIFICACIONES ---');
  // Se ejecuta cada minuto para máxima precisión
  cron.schedule('* * * * *', async () => {
    const ahora = new Date();
    logToFile(`Ejecutando revisión: ${ahora.toLocaleString()}`);
    
    // Crear fechas de inicio y fin de hoy sin mutar 'ahora'
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);
    
    // Buscar servicios de hoy que no han sido notificados
    const servicios = await prisma.servicio.findMany({
      where: {
        estado: 'Pendiente',
        notificado: false,
        fecha_servicio: {
          gte: inicioHoy,
          lt: finHoy
        }
      },
      include: { creado_por: true }
    });

    logToFile(`Servicios pendientes hoy: ${servicios.length}`);

    // Buscar todos los usuarios para notificarles a todos (admin y conductores)
    const usuarios = await prisma.usuario.findMany();

    for (const servicio of servicios) {
      if (!servicio.hora_servicio) continue;

      const [horas, minutos] = servicio.hora_servicio.split(':');
      const fechaServicioConHora = new Date(servicio.fecha_servicio);
      fechaServicioConHora.setHours(parseInt(horas), parseInt(minutos), 0, 0);

      const diferenciaMinutos = (fechaServicioConHora - ahora) / (1000 * 60);

      logToFile(`Servicio ${servicio.id} (${servicio.hora_servicio}): faltan ${Math.round(diferenciaMinutos)} min`);

      // Si faltan 2 horas (120 minutos)
      if (diferenciaMinutos > 0 && diferenciaMinutos <= 120.5) {
        const mensaje = `🕒 AVISO: Viaje programado de ${servicio.origen} a ${servicio.destino}.\nHora: ${servicio.hora_servicio}\nConductor: ${servicio.conductor}\nPrecio: $${servicio.precio}`;
        
        logToFile(`🔔 Enviando notificación masiva a ${usuarios.length} usuarios.`);
        
        try {
          for (const u of usuarios) {
            const tel1 = u.telefono_notificacion?.replace('+', '').replace(' ', '');
            const tel2 = u.telefono_notificacion_2?.replace('+', '').replace(' ', '');

            if (tel1) await sendWhatsAppMessage(tel1, mensaje);
            if (tel2) await sendWhatsAppMessage(tel2, mensaje);
          }
          
          await prisma.servicio.update({
            where: { id: servicio.id },
            data: { notificado: true }
          });
          logToFile(`✅ Notificación masiva enviada correctamente.`);
        } catch (err) {
          logToFile(`❌ Error en notificación masiva: ${err.message}`);
        }
      }
    }
  });
};

module.exports = { startNotificationCron };

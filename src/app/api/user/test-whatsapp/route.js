import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    if (!phone) return Response.json({ error: 'Número no proporcionado' }, { status: 400 });

    const cleanPhone = phone.replace('+', '').replace(' ', '');
    await sendWhatsAppMessage(cleanPhone, '✅ Driver Sync: Tu sistema de notificaciones está funcionando correctamente.');
    
    return Response.json({ message: 'Mensaje de prueba enviado. Revisa tu WhatsApp.' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Error al enviar mensaje: ' + error.message }, { status: 500 });
  }
}

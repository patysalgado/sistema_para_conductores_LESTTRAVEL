import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function PUT(request) {
  try {
    const data = await request.json()
    const actualizado = await prisma.usuario.update({
      where: { id: data.id },
      data: {
        telefono_notificacion: data.telefono_notificacion,
        telefono_notificacion_2: data.telefono_notificacion_2
      }
    })
    return Response.json(actualizado)
  } catch (error) {
    return Response.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
  }
}

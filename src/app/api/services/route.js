import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const rol = searchParams.get('rol')

  let where = {}
  if (rol === 'usuario' && userId) {
    where = {
      OR: [
        { creado_por_id: userId }, // Sus propios viajes
        { estado: 'Pendiente' }    // Todos los pendientes
      ]
    }
  }

  const servicios = await prisma.servicio.findMany({
    where,
    orderBy: { fecha_registro: 'desc' },
    include: { creado_por: true }
  })
  return Response.json(servicios)
}

export async function POST(request) {
  try {
    const data = await request.json()
    const nuevoServicio = await prisma.servicio.create({
      data: {
        fecha_servicio: new Date(data.fecha_servicio + 'T12:00:00'),
        hora_servicio: data.hora_servicio || '',
        fecha_limite: new Date(data.fecha_limite + 'T12:00:00'),
        precio: parseFloat(data.precio) || 0,
        conductor: data.conductor || 'Sin nombre',
        origen: data.origen || '',
        destino: data.destino || '',
        gastos: parseFloat(data.gastos) || 0,
        combustible: parseFloat(data.combustible) || 0,
        observaciones: data.observaciones || '',
        estado: 'Pendiente',
        creado_por_id: data.creado_por_id
      }
    })
    return Response.json(nuevoServicio)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear servicio: ' + error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()
    const actualizado = await prisma.servicio.update({
      where: { id: data.id },
      data: {
        fecha_servicio: new Date(data.fecha_servicio + 'T12:00:00'),
        hora_servicio: data.hora_servicio || '',
        fecha_limite: new Date(data.fecha_limite + 'T12:00:00'),
        precio: parseFloat(data.precio) || 0,
        conductor: data.conductor || '',
        origen: data.origen || '',
        destino: data.destino || '',
        gastos: parseFloat(data.gastos) || 0,
        combustible: parseFloat(data.combustible) || 0,
        observaciones: data.observaciones || '',
        estado: data.estado
      }
    })
    return Response.json(actualizado)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar servicio: ' + error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'ID no proporcionado' }, { status: 400 })

    await prisma.servicio.delete({
      where: { id }
    })
    return Response.json({ message: 'Servicio eliminado correctamente' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar servicio: ' + error.message }, { status: 500 })
  }
}

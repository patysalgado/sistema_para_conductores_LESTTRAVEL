import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json()

    // Verificar si ya existe
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) {
      return Response.json({ error: 'El correo ya está registrado' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        rol: 'usuario', // Por defecto todos son conductores
        password_hash: hash
      }
    })

    return Response.json({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol })
  } catch (error) {
    return Response.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}

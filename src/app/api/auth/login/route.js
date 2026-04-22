import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordMatch) {
      return Response.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    // Por ahora devolvemos el usuario. En un sistema real usaríamos JWT o Sessions.
    return Response.json({ 
      id: usuario.id, 
      nombre: usuario.nombre, 
      rol: usuario.rol 
    })
  } catch (error) {
    return Response.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

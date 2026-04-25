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
    
    // El primer usuario que se registre será el administrador
    const totalUsuarios = await prisma.usuario.count()
    const rol = totalUsuarios === 0 ? 'admin' : 'usuario'

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        rol: rol,
        password_hash: hash
      }
    })

    return Response.json({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol })
  } catch (error) {
    return Response.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}

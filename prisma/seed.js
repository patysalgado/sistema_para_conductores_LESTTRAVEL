const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@driversync.com' },
    update: {},
    create: {
      email: 'admin@driversync.com',
      nombre: 'Administrador',
      rol: 'admin',
      password_hash: hash,
    },
  });

  const conductor = await prisma.usuario.upsert({
    where: { email: 'conductor@ejemplo.com' },
    update: {},
    create: {
      email: 'conductor@ejemplo.com',
      nombre: 'Juan Conductor',
      rol: 'usuario',
      password_hash: hash,
    },
  });

  console.log({ admin, conductor });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

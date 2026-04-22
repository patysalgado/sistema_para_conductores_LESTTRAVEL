const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const servicios = await prisma.servicio.findMany({
    where: { estado: 'Pendiente' },
    orderBy: { fecha_servicio: 'asc' },
    include: { creado_por: true }
  });
  console.log(JSON.stringify(servicios, null, 2));
  await prisma.$disconnect();
}

check();

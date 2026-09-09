import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed inicial…');

  // Placeholder — o worker é quem povoa o catálogo real.
  // Aqui só criamos um usuário de dev para facilitar testes manuais.
  const devEmail = 'dev@pkmn.local';

  const existing = await prisma.user.findUnique({ where: { email: devEmail } });
  if (!existing) {
    // Hash gerado offline para 'devpass123' (argon2). Trocar em produção.
    await prisma.user.create({
      data: {
        email: devEmail,
        name: 'Dev User',
        passwordHash:
          '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzYWx0$Nk1r0lJv0G4/9ZfL0i7Z6f0KKp0m5Y5jQvY0f/1nA/E',
      },
    });
    console.log(`✅ Usuário dev criado: ${devEmail} / devpass123`);
  } else {
    console.log(`ℹ️  Usuário dev já existe: ${devEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

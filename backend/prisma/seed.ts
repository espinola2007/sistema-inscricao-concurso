
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma.js";

async function main() {
  // 1. Usuário administrador
  const email = "admin@concursos.com";
  const senha = "Admin@123456";
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.upsert({
    where: { email },
        update: { isAdmin: true },
    create: {
      nome: "Administrador",
      email,
      senhaHash,
      isAdmin: true,
    },
    },
  );

  // 2. Concurso de exemplo
  const nomeConcurso = "Concurso de Demonstração A2";

  let concurso = await prisma.concurso.findFirst({
    where: { nome: nomeConcurso },
  });

  if (!concurso) {
    concurso = await prisma.concurso.create({
      data: {
        nome: nomeConcurso,
        orgao: "Prefeitura Municipal",
        descricao: "Concurso fictício para demonstração do sistema",
        dataAbertura: new Date("2027-03-01T00:00:00.000Z"),
        dataEncerramento: new Date("2027-04-30T23:59:59.000Z"),
        status: "ABERTO",
      },
    });
  }

  // 3. Cargo vinculado ao concurso
  const cargoExistente = await prisma.cargo.findFirst({
    where: {
      nome: "Analista de Sistemas",
      concursoId: concurso.id,
    },
  });

  if (!cargoExistente) {
    await prisma.cargo.create({
      data: {
        nome: "Analista de Sistemas",
        concursoId: concurso.id,
      },
    });
  }

  // 4. Candidato de exemplo
  const candidato = await prisma.candidato.upsert({
    where: { cpf: "52998224725" },
    update: {},
    create: {
      nome: "Candidato Exemplo",
      cpf: "52998224725",
      email: "candidato.exemplo@example.com",
      telefone: "83999999999",
    },
  });

  // 5. Inscrição vinculada ao candidato e ao concurso
  await prisma.inscricao.upsert({
    where: {
      candidatoId_concursoId: {
        candidatoId: candidato.id,
        concursoId: concurso.id,
      },
    },
    update: {},
    create: {
      candidatoId: candidato.id,
      concursoId: concurso.id,
      status: "CONFIRMADA",
    },
  });

  console.log("Seed concluído: dados de exemplo disponíveis.");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

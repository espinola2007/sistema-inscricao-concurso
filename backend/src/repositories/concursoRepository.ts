
import { prisma } from "../config/prisma.js";

import type {
  CriarConcursoInput,
  AtualizarConcursoInput,
} from "@concursos/shared";

// Mantém a função usada pelo módulo de inscrições de Anny.
export async function findById(id: number) {
  return prisma.concurso.findUnique({
    where: { id },
  });
}

export async function findAll() {
  return prisma.concurso.findMany({
    orderBy: { id: "asc" },
  });
}

export async function create(dados: CriarConcursoInput) {
  return prisma.concurso.create({
    data: {
      ...dados,
      dataAbertura: new Date(dados.dataAbertura),
      dataEncerramento: new Date(dados.dataEncerramento),
    },
  });
}


export async function update(
  id: number,
  dados: AtualizarConcursoInput,
) {
  return prisma.concurso.update({
    where: { id },
    data: {
      ...(dados.nome !== undefined && { nome: dados.nome }),
      ...(dados.orgao !== undefined && { orgao: dados.orgao }),
      ...(dados.descricao !== undefined && {
        descricao: dados.descricao,
      }),
      ...(dados.status !== undefined && {
        status: dados.status,
      }),
      ...(dados.dataAbertura !== undefined && {
        dataAbertura: new Date(dados.dataAbertura),
      }),
      ...(dados.dataEncerramento !== undefined && {
        dataEncerramento: new Date(dados.dataEncerramento),
      }),
    },
  });
}


export async function remove(id: number) {
  return prisma.concurso.delete({
    where: { id },
  });
}

export async function countInscricoes(id: number) {
  return prisma.inscricao.count({
    where: { concursoId: id },
  });
}

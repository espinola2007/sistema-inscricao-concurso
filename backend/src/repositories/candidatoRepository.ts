
import { prisma } from "../config/prisma.js";

import type {
  CriarCandidatoInput,
  AtualizarCandidatoInput,
} from "@concursos/shared";

// Mantém a função utilizada pelo módulo de Inscrições.
export async function findById(id: number) {
  return prisma.candidato.findUnique({
    where: { id },
  });
}

export async function findAll() {
  return prisma.candidato.findMany({
    orderBy: { id: "asc" },
  });
}

export async function findByCpf(cpf: string) {
  return prisma.candidato.findUnique({
    where: { cpf },
  });
}

export async function create(dados: CriarCandidatoInput) {
  return prisma.candidato.create({
    data: {
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      ...(dados.telefone !== undefined && {
        telefone: dados.telefone,
      }),
    },
  });
}

export async function update(
  id: number,
  dados: AtualizarCandidatoInput,
) {
  return prisma.candidato.update({
    where: { id },
    data: {
      ...(dados.nome !== undefined && {
        nome: dados.nome,
      }),
      ...(dados.cpf !== undefined && {
        cpf: dados.cpf,
      }),
      ...(dados.email !== undefined && {
        email: dados.email,
      }),
      ...(dados.telefone !== undefined && {
        telefone: dados.telefone,
      }),
    },
  });
}

export async function remove(id: number) {
  return prisma.candidato.delete({
    where: { id },
  });
}

export async function countInscricoes(id: number) {
  return prisma.inscricao.count({
    where: { candidatoId: id },
  });
}

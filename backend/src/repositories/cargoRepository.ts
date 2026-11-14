
import { prisma } from "../config/prisma.js";

import type {
  CriarCargoInput,
  AtualizarCargoInput,
} from "@concursos/shared";

export async function findAll() {
  return prisma.cargo.findMany({
    include: {
      concurso: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function findById(id: number) {
  return prisma.cargo.findUnique({
    where: { id },
    include: {
      concurso: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });
}

export async function create(dados: CriarCargoInput) {
  return prisma.cargo.create({
    data: {
      nome: dados.nome,
      concursoId: dados.concursoId,
    },
  });
}

export async function update(
  id: number,
  dados: AtualizarCargoInput,
) {
  return prisma.cargo.update({
    where: { id },
    data: {
      ...(dados.nome !== undefined && {
        nome: dados.nome,
      }),
      ...(dados.concursoId !== undefined && {
        concursoId: dados.concursoId,
      }),
    },
  });
}

export async function remove(id: number) {
  return prisma.cargo.delete({
    where: { id },
  });
}

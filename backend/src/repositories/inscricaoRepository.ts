import { prisma } from "../config/prisma.js";
import type { InscricaoFiltroInput } from "../schemas/inscricao.js";

const incluir = { candidato: true, concurso: true };

export async function findAll(filtro: InscricaoFiltroInput = {}) {
  return await prisma.inscricao.findMany({
    where: {
      ...(filtro.candidatoId ? { candidatoId: filtro.candidatoId } : {}),
      ...(filtro.concursoId ? { concursoId: filtro.concursoId } : {}),
    },
    include: incluir,
    orderBy: { id: "asc" },
  });
  //SELECT i.*, ca.*, co.* FROM inscricoes i
  //JOIN candidatos ca ON i.candidato_id = ca.id
  //JOIN concursos co ON i.concurso_id = co.id;
}

export async function findById(id: number) {
  return await prisma.inscricao.findUnique({
    where: { id },
    include: incluir,
  });
  //SELECT ... FROM inscricoes i JOIN ... WHERE i.id = ?;
}

export async function findByCandidatoConcurso(
  candidatoId: number,
  concursoId: number,
) {
  return await prisma.inscricao.findUnique({
    where: { candidatoId_concursoId: { candidatoId, concursoId } },
  });
  //SELECT * FROM inscricoes WHERE candidato_id = ? AND concurso_id = ?;
}

export async function create(data: { candidatoId: number; concursoId: number }) {
  return await prisma.inscricao.create({ data, include: incluir });
  //INSERT INTO inscricoes (candidato_id, concurso_id) VALUES (?, ?);
}

export async function update(
  id: number,
  dados: { candidatoId: number; concursoId: number },
) {
  return prisma.inscricao.update({
    where: { id },
    data: {
      candidatoId: dados.candidatoId,
      concursoId: dados.concursoId,
    },
    include: incluir,
  });
}

export async function remove(id: number) {
  return prisma.inscricao.delete({
    where: { id },
  });
}

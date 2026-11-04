// STUB: este arquivo é da Maria Vitória. Só tem o que o módulo de inscrições usa.
// Ao juntar o projeto, use o dela (precisa exportar findById).
import { prisma } from "../config/prisma.js";

export async function findById(id: number) {
  return await prisma.concurso.findUnique({ where: { id } });
}

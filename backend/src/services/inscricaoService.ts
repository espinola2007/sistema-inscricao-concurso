import * as inscricaoRepository from "../repositories/inscricaoRepository.js";
import * as candidatoRepository from "../repositories/candidatoRepository.js";
import * as concursoRepository from "../repositories/concursoRepository.js";
import { HttpError } from "../middlewares/errorHandler.js";
import type {
  InscricaoInput,
  InscricaoFiltroInput,
} from "../schemas/inscricao.js";

// Regra de negócio: concurso aceita inscrição se o status é ABERTO
// e a data de hoje está entre a abertura e o encerramento.
// (Se a Maria Vitória usar outros valores de status, ajuste só aqui.)
function inscricoesAbertas(concurso: {
  status: string;
  dataAbertura: Date;
  dataEncerramento: Date;
}): boolean {
  const agora = new Date();
  return (
    concurso.status.toUpperCase() === "ABERTO" &&
    agora >= concurso.dataAbertura &&
    agora <= concurso.dataEncerramento
  );
}

export async function listarInscricoes(filtro: InscricaoFiltroInput = {}) {
  return await inscricaoRepository.findAll(filtro);
}

export async function encontrarUmaInscricao(id: number) {
  return await inscricaoRepository.findById(id);
}

export async function criarInscricao({ candidatoId, concursoId }: InscricaoInput) {
  // 1. O candidato precisa existir
  const candidato = await candidatoRepository.findById(candidatoId);
  if (!candidato) {
    throw new HttpError(404, `Candidato com ID ${candidatoId} não encontrado.`);
  }

  // 2. O concurso precisa existir
  const concurso = await concursoRepository.findById(concursoId);
  if (!concurso) {
    throw new HttpError(404, `Concurso com ID ${concursoId} não encontrado.`);
  }

  // 3. O concurso precisa estar com inscrições abertas
  if (!inscricoesAbertas(concurso)) {
    throw new HttpError(
      422,
      `As inscrições do concurso "${concurso.nome}" não estão abertas.`,
    );
  }

  // 4. O mesmo candidato não pode se inscrever duas vezes no mesmo concurso
  const jaInscrito = await inscricaoRepository.findByCandidatoConcurso(
    candidatoId,
    concursoId,
  );
  if (jaInscrito) {
    throw new HttpError(
      409,
      `O candidato ${candidato.nome} já está inscrito no concurso "${concurso.nome}".`,
    );
  }

  return await inscricaoRepository.create({ candidatoId, concursoId });
}


import * as repository from "../repositories/concursoRepository.js";

import { HttpError } from "../middlewares/errorHandler.js";

import {
  criarConcursoSchema,
  type CriarConcursoInput,
  type AtualizarConcursoInput,
} from "../schemas/concurso.js";

export async function listarConcursos() {
  return repository.findAll();
}

export async function buscarConcurso(id: number) {
  const concurso = await repository.findById(id);

  if (!concurso) {
    throw new HttpError(404, "Concurso não encontrado.");
  }

  return concurso;
}

export async function criarConcurso(dados: CriarConcursoInput) {
  return repository.create(dados);
}

export async function atualizarConcurso(
  id: number,
  dados: AtualizarConcursoInput,
) {
  const atual = await buscarConcurso(id);

  const validacao = criarConcursoSchema.safeParse({
    nome: dados.nome ?? atual.nome,
    orgao: dados.orgao ?? atual.orgao,
    descricao: dados.descricao ?? atual.descricao,
    dataAbertura:
      dados.dataAbertura ?? atual.dataAbertura.toISOString(),
    dataEncerramento:
      dados.dataEncerramento ?? atual.dataEncerramento.toISOString(),
    status: dados.status ?? atual.status,
  });

  if (!validacao.success) {
    throw new HttpError(
      400,
      validacao.error.issues
        .map((i) => i.message)
        .join("; "),
    );
  }

  return repository.update(id, dados);
}

export async function excluirConcurso(id: number) {
  await buscarConcurso(id);

  const totalInscricoes =
    await repository.countInscricoes(id);

  if (totalInscricoes > 0) {
    throw new HttpError(
      409,
      "Não é possível excluir concurso com inscrições vinculadas.",
    );
  }

  await repository.remove(id);
}

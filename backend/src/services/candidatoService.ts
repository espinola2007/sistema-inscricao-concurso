
import * as repository from "../repositories/candidatoRepository.js";
import { HttpError } from "../middlewares/errorHandler.js";

import type {
  CriarCandidatoInput,
  AtualizarCandidatoInput,
} from "@concursos/shared";

export async function listarCandidatos() {
  return repository.findAll();
}

export async function buscarCandidato(id: number) {
  const candidato = await repository.findById(id);

  if (!candidato) {
    throw new HttpError(404, "Candidato não encontrado.");
  }

  return candidato;
}

export async function criarCandidato(dados: CriarCandidatoInput) {
  const existente = await repository.findByCpf(dados.cpf);

  if (existente) {
    throw new HttpError(409, "Este CPF já está cadastrado.");
  }

  return repository.create(dados);
}

export async function atualizarCandidato(
  id: number,
  dados: AtualizarCandidatoInput,
) {
  await buscarCandidato(id);

  if (dados.cpf !== undefined) {
    const existente = await repository.findByCpf(dados.cpf);

    if (existente && existente.id !== id) {
      throw new HttpError(409, "Este CPF já está cadastrado.");
    }
  }

  return repository.update(id, dados);
}

export async function excluirCandidato(id: number) {
  await buscarCandidato(id);

  const totalInscricoes = await repository.countInscricoes(id);

  if (totalInscricoes > 0) {
    throw new HttpError(
      409,
      "Não é possível excluir candidato com inscrições vinculadas.",
    );
  }

  await repository.remove(id);
}

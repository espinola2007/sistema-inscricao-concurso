
import * as repository from "../repositories/cargoRepository.js";
import * as concursoRepository from "../repositories/concursoRepository.js";

import { HttpError } from "../middlewares/errorHandler.js";

import type {
  CriarCargoInput,
  AtualizarCargoInput,
} from "@concursos/shared";

async function verificarConcurso(concursoId: number) {
  const concurso = await concursoRepository.findById(concursoId);

  if (!concurso) {
    throw new HttpError(404, "Concurso não encontrado.");
  }

  return concurso;
}

export async function listarCargos() {
  return repository.findAll();
}

export async function buscarCargo(id: number) {
  const cargo = await repository.findById(id);

  if (!cargo) {
    throw new HttpError(404, "Cargo não encontrado.");
  }

  return cargo;
}

export async function criarCargo(dados: CriarCargoInput) {
  await verificarConcurso(dados.concursoId);

  return repository.create(dados);
}

export async function atualizarCargo(
  id: number,
  dados: AtualizarCargoInput,
) {
  await buscarCargo(id);

  if (dados.concursoId !== undefined) {
    await verificarConcurso(dados.concursoId);
  }

  return repository.update(id, dados);
}

export async function excluirCargo(id: number) {
  await buscarCargo(id);

  await repository.remove(id);
}

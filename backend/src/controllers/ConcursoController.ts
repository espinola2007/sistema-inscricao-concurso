
import type { Request, Response } from "express";

import * as service from "../services/concursoService.js";

import { HttpError } from "../middlewares/errorHandler.js";


function idValido(valor: string | string[] | undefined): number {
  if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
    throw new HttpError(400, "ID de concurso inválido.");
  }

  const id = Number(valor);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, "ID de concurso inválido.");
  }

  return id;
}


export async function listar(
  _req: Request,
  res: Response,
) {
  return res.json(await service.listarConcursos());
}

export async function buscarPorId(
  req: Request,
  res: Response,
) {
  return res.json(
    await service.buscarConcurso(idValido(req.params.id)),
  );
}

export async function cadastrar(
  req: Request,
  res: Response,
) {
  return res.status(201).json(
    await service.criarConcurso(req.body),
  );
}

export async function atualizar(
  req: Request,
  res: Response,
) {
  return res.json(
    await service.atualizarConcurso(
      idValido(req.params.id),
      req.body,
    ),
  );
}

export async function excluir(
  req: Request,
  res: Response,
) {
  await service.excluirConcurso(
    idValido(req.params.id),
  );

  return res.status(204).send();
}

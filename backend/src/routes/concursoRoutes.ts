
import Router from "express";

import * as controller from "../controllers/ConcursoController.js";

import { validarBody } from "../middlewares/validarSchema.js";

import {
  criarConcursoSchema,
  atualizarConcursoSchema,
} from "../schemas/concurso.js";

const router = Router();

router.get(
  "/concursos",
  controller.listar,
);

router.get(
  "/concursos/:id",
  controller.buscarPorId,
);

router.post(
  "/concursos",
  validarBody(criarConcursoSchema),
  controller.cadastrar,
);

router.put(
  "/concursos/:id",
  validarBody(atualizarConcursoSchema),
  controller.atualizar,
);

router.delete(
  "/concursos/:id",
  controller.excluir,
);

export default router;

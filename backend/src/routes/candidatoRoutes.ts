
import { Router } from "express";
import * as controller from "../controllers/CandidatoController.js";
import { validarBody } from "../middlewares/validarSchema.js";

import {
  criarCandidatoSchema,
  atualizarCandidatoSchema,
} from "@concursos/shared";

const router = Router();

router.get("/candidatos", controller.listar);

router.get("/candidatos/:id", controller.buscarPorId);

router.post(
  "/candidatos",
  validarBody(criarCandidatoSchema),
  controller.cadastrar,
);

router.put(
  "/candidatos/:id",
  validarBody(atualizarCandidatoSchema),
  controller.atualizar,
);

router.delete("/candidatos/:id", controller.excluir);

export default router;

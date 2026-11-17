
import Router from "express";
import * as controller from "../controllers/InscricaoController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { inscricaoSchema } from "../schemas/inscricao.js";

const router = Router();

router.get("/inscricoes", controller.listar);

router.get("/inscricoes/:id", controller.buscarPorId);

router.post(
  "/inscricoes",
  validarBody(inscricaoSchema),
  controller.cadastrar,
);

router.put(
  "/inscricoes/:id",
  validarBody(inscricaoSchema),
  controller.atualizar,
);

router.delete("/inscricoes/:id", controller.excluir);

export default router;


import { Router } from "express";
import { login, cadastro } from "../controllers/AuthController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import {
  loginUsuarioSchema,
  cadastroUsuarioSchema,
} from "@concursos/shared";

const router = Router();

router.post("/login", validarBody(loginUsuarioSchema), login);

router.post("/usuarios", validarBody(cadastroUsuarioSchema), cadastro);

export default router;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import inscricaoRoutes from "./routes/inscricaoRoutes.js";
// Ao juntar o projeto, importe aqui as rotas de concursos e candidatos.

import concursoRoutes from "./routes/concursoRoutes.js";
import cargoRoutes from "./routes/cargoRoutes.js";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(inscricaoRoutes);

app.use(concursoRoutes);
app.use(cargoRoutes);
// Sempre por último
app.use(authRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`A API subiu na porta ${PORT}`);
    console.log(`Documentação disponível em: http://localhost:${PORT}/docs`);
  });
}


import { z } from "zod";

export const criarCargoSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  concursoId: z.number().int().positive(
    "O ID do concurso deve ser um número positivo",
  ),
});

export const atualizarCargoSchema = criarCargoSchema.partial().refine(
  (dados) => Object.keys(dados).length > 0,
  { message: "Informe ao menos um campo para atualizar" },
);

export type CriarCargoInput = z.infer<typeof criarCargoSchema>;
export type AtualizarCargoInput = z.infer<typeof atualizarCargoSchema>;

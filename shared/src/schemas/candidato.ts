
import { z } from "zod";

export const criarCandidatoSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 números"),
  email: z.email("E-mail inválido"),
  telefone: z.string().trim().optional().nullable(),
});

export const atualizarCandidatoSchema = criarCandidatoSchema
  .partial()
  .refine(
    (dados) => Object.keys(dados).length > 0,
    { message: "Informe ao menos um campo para atualizar" },
  );

export type CriarCandidatoInput = z.infer<
  typeof criarCandidatoSchema
>;

export type AtualizarCandidatoInput = z.infer<
  typeof atualizarCandidatoSchema
>;

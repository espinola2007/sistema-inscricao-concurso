import { z } from "zod";

export function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf)) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;

  if (digito !== Number(cpf[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;

  return digito === Number(cpf[10]);
}

export const criarCandidatoSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 números")
    .refine(cpfValido, "CPF inválido"),
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


import { z } from "zod";

export const cadastroUsuarioSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  email: z.email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginUsuarioSchema = z.object({
  email: z.email("E-mail inválido"),
  senha: z.string().min(1, "Senha obrigatória"),
});

export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;
export type LoginUsuarioInput = z.infer<typeof loginUsuarioSchema>;

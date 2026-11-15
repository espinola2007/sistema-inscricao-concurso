
import bcrypt from "bcrypt";
import { buscarPorEmail } from "../repositories/usuarioRepository.js";

export async function autenticar(email: string, senha: string) {
  const usuario = await buscarPorEmail(email);

  if (!usuario) {
    return null;
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaCorreta) {
    return null;
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

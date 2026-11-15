
import bcrypt from "bcrypt";
import {
  buscarPorEmail,
  criarUsuario,
} from "../repositories/usuarioRepository.js";

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

export async function cadastrar(
  nome: string,
  email: string,
  senha: string
) {
  const usuarioExistente = await buscarPorEmail(email);

  if (usuarioExistente) {
    return null;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await criarUsuario({
    nome,
    email,
    senhaHash,
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

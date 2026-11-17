import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../models/usuarios.models.js";

// READ
export function obterUsuarios() {
  return listarUsuarios();
}

export function obterUsuarioPorId(id) {
  return buscarUsuarioPorId(id);
}

// CREATE
export function cadastrarUsuario(nome, email) {
  if (
    !nome ||
    typeof nome !== "string" ||
    !nome.trim() ||
    !email ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return {
      erro: 'Os campos "nome" e "email" são obrigatórios',
    };
  }

  const emailExiste = listarUsuarios().find(
    (usuario) =>
      usuario.email.toLocaleLowerCase() === email.trim().toLocaleLowerCase(),
  );

  if (emailExiste) {
    return {
      erro: "Esse email já está cadastrado",
    };
  }

  const novoUsuario = criarUsuario(nome, email);

  return { usuario: novoUsuario };
}

// UPDATE
export function editarUsuario(id, nome, email) {
  const usuario = buscarUsuarioPorId(id);

  if (!usuario) {
    return { naoEncontrado: true };
  }

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return {
      erro: 'Os campos "nome" e "email" são obrigatórios',
    };
  }

  const emailExiste = listarUsuarios().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id,
  );

  if (emailExiste) {
    return {
      erro: "Este email já está cadastrado por outro usuário",
    };
  }

  const usuarioAtualizado = atualizarUsuario(id, nome, email);

  return { usuario: usuarioAtualizado };
}

// DELETE
export function removerUsuario(id) {
  return deletarUsuario(id);
}

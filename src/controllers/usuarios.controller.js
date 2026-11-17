import {
  obterUsuarios,
  obterUsuarioPorId,
  cadastrarUsuario,
  editarUsuario,
  removerUsuario,
} from "../services/usuarios.services.js";

// READ
export function listar(req, res) {
  const usuarios = obterUsuarios();

  res.json(usuarios);
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);

  const usuario = obterUsuarioPorId(id);

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
    });
  }

  res.json(usuario);
}

// CREATE
export function criar(req, res) {
  const { nome, email } = req.body;

  const resultado = cadastrarUsuario(nome, email);

  if (resultado.erro) {
    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  res.status(201).json(resultado.usuario);
}

// UPDATE
export function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, email } = req.body;

  const resultado = editarUsuario(id, nome, email);

  if (resultado.naoEncontrado) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
    });
  }

  if (resultado.erro) {
    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  res.json(resultado.usuario);
}

// DELETE
export function excluir(req, res) {
  const id = Number(req.params.id);

  const removido = removerUsuario(id);

  if (!removido) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
    });
  }

  res.status(204).json({
    mensagem: "Usuário deletado",
  });
}

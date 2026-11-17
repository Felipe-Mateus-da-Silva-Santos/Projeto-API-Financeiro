import {
  obterContas,
  obterContaPorId,
  cadastrarConta,
  editarConta,
  removerConta,
} from "../services/contas.services.js";

import { obterUsuarioPorId } from "../services/usuarios.services.js";

// READ
export function listar(req, res) {
  const { idUsuario } = req.query;

  let resultado = obterContas();

  if (idUsuario !== undefined) {
    const id = Number(idUsuario);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID do usuário inválido",
      });
    }

    const usuarioExiste = obterUsuarioPorId(id);

    if (!usuarioExiste) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    resultado = resultado.filter((conta) => conta.idUsuario === id);
  }

  res.json(resultado);
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);

  const conta = obterContaPorId(id);

  if (!conta) {
    return res.status(404).json({
      mensagem: "Conta não encontrada",
    });
  }

  res.json(conta);
}

// CREATE
export function criar(req, res) {
  const { nome, tipo, saldoInicial, idUsuario } = req.body;

  const resultado = cadastrarConta(nome, tipo, saldoInicial, idUsuario);

  if (resultado.naoEncontrado) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
    });
  }

  if (resultado.erro) {
    if (resultado.erro === "O usuário já possui o limite de três contas") {
      return res.status(400).json(resultado.erro);
    }

    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  res.status(201).json(resultado.conta);
}

// UPDATE
export function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, tipo } = req.body;

  const resultado = editarConta(id, nome, tipo);

  if (resultado.naoEncontrado) {
    return res.status(404).json("Conta não encontrada");
  }

  if (resultado.erro) {
    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  res.json(resultado.conta);
}

// DELETE
export function excluir(req, res) {
  const id = Number(req.params.id);

  const resultado = removerConta(id);

  if (resultado.naoEncontrado) {
    return res.status(404).json("Conta não encontrada");
  }

  if (resultado.possuiLancamentos) {
    return res
      .status(400)
      .json("Não é possível excluir uma conta que possui lançamentos");
  }

  res.status(204).send();
}

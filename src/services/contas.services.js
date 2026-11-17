import {
  listarContas,
  buscarContaPorId,
  criarConta,
  atualizarConta,
  deletarConta,
} from "../models/contas.models.js";

import { buscarUsuarioPorId } from "../models/usuarios.models.js";

import { listarLancamentos } from "../models/lancamentos.models.js";

// READ
export function obterContas() {
  return listarContas();
}

export function obterContaPorId(id) {
  return buscarContaPorId(id);
}

// CREATE
export function cadastrarConta(nome, tipo, saldoInicial, idUsuario) {
  if (typeof nome !== "string" || !nome.trim()) {
    return { erro: "O nome da conta é obrigatório" };
  }

  if (!["corrente", "poupanca"].includes(tipo)) {
    return { erro: "O tipo deve ser corrente ou poupanca" };
  }

  if (
    typeof saldoInicial !== "number" ||
    !Number.isFinite(saldoInicial) ||
    saldoInicial < 0
  ) {
    return {
      erro: "O saldo inicial deve ser um número maior ou igual a zero",
    };
  }

  const usuarioExiste = buscarUsuarioPorId(idUsuario);

  if (!usuarioExiste) {
    return { naoEncontrado: true };
  }

  const quantidadeContas = listarContas().filter(
    (conta) => conta.idUsuario === idUsuario,
  ).length;

  if (quantidadeContas >= 3) {
    return {
      erro: "O usuário já possui o limite de três contas",
    };
  }

  const novaConta = criarConta(nome.trim(), tipo, saldoInicial, idUsuario);

  return { conta: novaConta };
}

// UPDATE
export function editarConta(id, nome, tipo) {
  const conta = buscarContaPorId(id);

  if (!conta) {
    return { naoEncontrado: true };
  }

  if (typeof nome !== "string" || !nome.trim()) {
    return { erro: "O nome da conta é obrigatório" };
  }

  if (!["corrente", "poupanca"].includes(tipo)) {
    return { erro: "O tipo deve ser corrente ou poupanca" };
  }

  const contaAtualizada = atualizarConta(id, nome.trim(), tipo);

  return { conta: contaAtualizada };
}

// DELETE
export function removerConta(id) {
  const conta = buscarContaPorId(id);

  if (!conta) {
    return { naoEncontrado: true };
  }

  const possuiLancamentos = listarLancamentos().some(
    (lancamento) => lancamento.idConta === id,
  );

  if (possuiLancamentos) {
    return { possuiLancamentos: true };
  }

  deletarConta(id);

  return { removida: true };
}

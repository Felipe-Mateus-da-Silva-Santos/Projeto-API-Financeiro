import {
  listarLancamentos,
  buscarLancamentoPorId,
  criarLancamento,
} from "../models/lancamentos.models.js";

import { buscarContaPorId, listarContas } from "../models/contas.models.js";

// READ
export function obterLancamentos() {
  return listarLancamentos();
}

export function obterLancamentoPorId(id) {
  return buscarLancamentoPorId(id);
}

// CREATE
export function cadastrarLancamento(
  tipo,
  descricao,
  valor,
  categoria,
  data,
  idConta,
) {
  if (!["receita", "despesa"].includes(tipo)) {
    return { erro: "O tipo deve ser receita ou despesa" };
  }

  if (typeof descricao !== "string" || !descricao.trim()) {
    return { erro: "A descrição é obrigatória" };
  }

  if (typeof categoria !== "string" || !categoria.trim()) {
    return { erro: "A categoria é obrigatória" };
  }

  if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
    return { erro: "O valor deve ser um numero maior que zero" };
  }

  const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  if (typeof data !== "string" || !DATA_REGEX.test(data)) {
    return { erro: "estar no formato AAAA-MM-DD" };
  }

  const conta = buscarContaPorId(idConta);

  if (!conta) {
    return { naoEncontrado: true };
  }

  const valorCentavos = Math.round(valor * 100);
  const saldoCentavos = Math.round(conta.saldo * 100);

  if (tipo === "despesa" && valorCentavos > saldoCentavos) {
    return { erro: "Saldo insuficiente para realizar esta despesa" };
  }

  const novoLancamento = criarLancamento(
    tipo,
    descricao.trim(),
    valorCentavos / 100,
    categoria.trim(),
    data,
    idConta,
  );

  if (tipo === "receita") {
    conta.saldo = (saldoCentavos + valorCentavos) / 100;
  } else {
    conta.saldo = (saldoCentavos - valorCentavos) / 100;
  }

  return {
    lancamento: novoLancamento,
    novoSaldo: conta.saldo,
  };
}

// FILTROS
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function filtrarLancamentos({
  idUsuario,
  idConta,
  categoria,
  inicio,
  fim,
}) {
  if (inicio && !DATA_REGEX.test(inicio)) {
    return { erro: 'O campo "inicio" deve estar no formato AAAA-MM-DD' };
  }

  if (fim && !DATA_REGEX.test(fim)) {
    return { erro: 'O campo "fim" deve estar no formato AAAA-MM-DD' };
  }

  if (inicio && fim && inicio > fim) {
    return { erro: '"inicio" não pode ser maior que "fim"' };
  }

  let resultado = listarLancamentos();

  if (idUsuario) {
    const idsContas = listarContas()
      .filter((conta) => conta.idUsuario === Number(idUsuario))
      .map((conta) => conta.id);

    resultado = resultado.filter((lancamento) =>
      idsContas.includes(lancamento.idConta),
    );
  }

  if (idConta) {
    resultado = resultado.filter(
      (lancamento) => lancamento.idConta === Number(idConta),
    );
  }

  if (categoria) {
    resultado = resultado.filter(
      (lancamento) => lancamento.categoria === categoria,
    );
  }

  if (inicio) {
    resultado = resultado.filter((lancamento) => lancamento.data >= inicio);
  }

  if (fim) {
    resultado = resultado.filter((lancamento) => lancamento.data <= fim);
  }

  return { resultado };
}

// RESUMO / TOTAL
export function obterTotalLancamentos(filtros) {
  const resultado = filtrarLancamentos(filtros);

  if (resultado.erro) {
    return resultado;
  }

  const lancamentosFiltrados = resultado.resultado;

  let receitas = 0;
  let despesas = 0;

  const porCategoria = {};

  for (const lancamento of lancamentosFiltrados) {
    const { tipo, valor, categoria } = lancamento;

    if (!porCategoria[categoria]) {
      porCategoria[categoria] = {
        receitas: 0,
        despesas: 0,
      };
    }

    if (tipo === "receita") {
      receitas += valor;
      porCategoria[categoria].receitas += valor;
    } else if (tipo === "despesa") {
      despesas += valor;
      porCategoria[categoria].despesas += valor;
    }
  }

  receitas = Math.round((receitas + Number.EPSILON) * 100) / 100;
  despesas = Math.round((despesas + Number.EPSILON) * 100) / 100;

  const saldo = Math.round((receitas - despesas + Number.EPSILON) * 100) / 100;

  for (const categoria in porCategoria) {
    porCategoria[categoria].receitas =
      Math.round((porCategoria[categoria].receitas + Number.EPSILON) * 100) /
      100;

    porCategoria[categoria].despesas =
      Math.round((porCategoria[categoria].despesas + Number.EPSILON) * 100) /
      100;
  }

  return {
    quantidade: lancamentosFiltrados.length,
    receitas,
    despesas,
    saldo,
    porCategoria,
  };
}

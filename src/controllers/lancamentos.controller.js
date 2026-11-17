import {
  obterLancamentos,
  obterLancamentoPorId,
  cadastrarLancamento,
  filtrarLancamentos,
  obterTotalLancamentos,
} from "../services/lancamentos.services.js";

// READ
export function listar(req, res) {
  const resultado = filtrarLancamentos(req.query);

  if (resultado.erro) {
    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  const lancamentosFiltrados = resultado.resultado;

  lancamentosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));

  res.json(lancamentosFiltrados);
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);

  const lancamento = obterLancamentoPorId(id);

  if (!lancamento) {
    return res.status(404).json({
      mensagem: "Lançamento não encontrado",
    });
  }

  res.json(lancamento);
}

// CREATE
export function criar(req, res) {
  const { tipo, descricao, valor, categoria, data, idConta } = req.body;

  const resultado = cadastrarLancamento(
    tipo,
    descricao,
    valor,
    categoria,
    data,
    idConta,
  );

  if (resultado.naoEncontrado) {
    return res.status(404).json("Conta não encontrada");
  }

  if (resultado.erro) {
    return res.status(400).json(resultado.erro);
  }

  res.status(201).json({
    mensagem: "Lançamento cadastrado com sucesso",
    lancamento: resultado.lancamento,
    novoSaldo: resultado.novoSaldo,
  });
}

// RESUMO / TOTAL
export function total(req, res) {
  const resultado = obterTotalLancamentos(req.query);

  if (resultado.erro) {
    return res.status(400).json({
      mensagem: resultado.erro,
    });
  }

  res.json(resultado);
}

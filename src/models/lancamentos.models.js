const lancamentos = [
  // TIPO receita ou despesa | DATA: AAAA-MM-DD
  {
    id: 1,
    tipo: "receita",
    descricao: "Freelance Website",
    valor: 150.0,
    categoria: "trabalho",
    data: "2026-10-04",
    idConta: 1,
  },
  {
    id: 2,
    tipo: "despesa",
    descricao: "Supermercado Mensal",
    valor: 450.3,
    categoria: "alimentacao",
    data: "2026-10-02",
    idConta: 1,
  },
  {
    id: 3,
    tipo: "despesa",
    descricao: "Assinatura Netflix",
    valor: 55.9,
    categoria: "lazer",
    data: "2026-10-04",
    idConta: 1,
  },
  {
    id: 4,
    tipo: "receita",
    descricao: "Salário Mensal",
    valor: 3200.0,
    categoria: "trabalho",
    data: "2026-10-01",
    idConta: 3,
  },
  {
    id: 5,
    tipo: "despesa",
    descricao: "Combustível",
    valor: 120.0,
    categoria: "transporte",
    data: "2026-10-04",
    idConta: 3,
  },
  {
    id: 6,
    tipo: "despesa",
    descricao: "Farmácia",
    valor: 85.2,
    categoria: "saude",
    data: "2026-10-02",
    idConta: 4,
  },
  {
    id: 7,
    tipo: "receita",
    descricao: "Venda de Fotos",
    valor: 400.0,
    categoria: "trabalho",
    data: "2026-10-04",
    idConta: 5,
  },
  {
    id: 8,
    tipo: "despesa",
    descricao: "Jantar Pizzaria",
    valor: 75.0,
    categoria: "alimentacao",
    data: "2026-10-03",
    idConta: 5,
  },
  {
    id: 9,
    tipo: "receita",
    descricao: "Aporte Investidor",
    valor: 5000.0,
    categoria: "trabalho",
    data: "2026-10-01",
    idConta: 6,
  },
  {
    id: 10,
    tipo: "despesa",
    descricao: "Aluguel Escritório",
    valor: 1500.0,
    categoria: "habitacao",
    data: "2026-10-02",
    idConta: 6,
  },
];

let proximoIdLancamento = 11;

// READ
export function listarLancamentos() {
  return lancamentos;
}

export function buscarLancamentoPorId(id) {
  return lancamentos.find((lancamento) => lancamento.id === id);
}

// CREATE
export function criarLancamento(
  tipo,
  descricao,
  valor,
  categoria,
  data,
  idConta,
) {
  const novoLancamento = {
    id: proximoIdLancamento++,
    tipo,
    descricao,
    valor,
    categoria,
    data,
    idConta,
  };

  lancamentos.push(novoLancamento);

  return novoLancamento;
}

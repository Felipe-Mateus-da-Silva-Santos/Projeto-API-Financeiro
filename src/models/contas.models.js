const contas = [
  // TIPOS: corrente ou poupanca
  {
    id: 1,
    nome: "Conta Principal",
    tipo: "corrente",
    saldoInicial: 1000.0,
    saldo: 1000.0,
    idUsuario: 2,
  },
  {
    id: 2,
    nome: "Reserva de Emergência",
    tipo: "poupanca",
    saldoInicial: 700.0,
    saldo: 700.0,
    idUsuario: 2,
  },
  {
    id: 3,
    nome: "Corrente Inter",
    tipo: "corrente",
    saldoInicial: 2500.0,
    saldo: 2500.0,
    idUsuario: 1,
  },
  {
    id: 4,
    nome: "Poupança Caixa",
    tipo: "poupanca",
    saldoInicial: 500.0,
    saldo: 500.0,
    idUsuario: 3,
  },
  {
    id: 5,
    nome: "Carteira Diária",
    tipo: "corrente",
    saldoInicial: 350.0,
    saldo: 350.0,
    idUsuario: 4,
  },
  {
    id: 6,
    nome: "Conta PJ",
    tipo: "corrente",
    saldoInicial: 8000.0,
    saldo: 8000.0,
    idUsuario: 5,
  },
];

let proximoIdConta = 7;

// READ
export function listarContas() {
  return contas;
}

export function buscarContaPorId(id) {
  return contas.find((conta) => conta.id === id);
}

// CREATE
export function criarConta(nome, tipo, saldoInicial, idUsuario) {
  const novaConta = {
    id: proximoIdConta++,
    nome,
    tipo,
    saldoInicial,
    saldo: saldoInicial,
    idUsuario,
  };

  contas.push(novaConta);

  return novaConta;
}

// UPDATE
export function atualizarConta(id, nome, tipo) {
  const conta = buscarContaPorId(id);

  if (!conta) {
    return null;
  }

  conta.nome = nome;
  conta.tipo = tipo;

  return conta;
}

// DELETE
export function deletarConta(id) {
  const posicao = contas.findIndex((conta) => conta.id === id);

  if (posicao === -1) {
    return false;
  }

  contas.splice(posicao, 1);

  return true;
}

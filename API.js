const express = require('express');
const API = express();
const PORT = 3000;

API.use(express.json());

const usuarios = [
    { id: 1, nome: 'Maria da Silva',   email: 'maria@email.com' },
    { id: 2, nome: 'João dos Santos',  email: 'joao@email.com' },
    { id: 3, nome: 'Mara Maravilha',   email: 'mara@email.com' },
    { id: 4, nome: 'Peter Parker',     email: 'peter@email.com' },
    { id: 5, nome: 'Yudi Itadori',     email: 'Yudi@email.com' }
];

const contas = [
    // TIPOS: corrente ou poupanca
    { id: 1, nome: 'Conta Principal', tipo: 'corrente', saldoInicial: 1000.00, saldo: 1000.00, idUsuario: 2 },
    { id: 2, nome: 'Reserva de Emergência', tipo: 'poupanca', saldoInicial: 700.00, saldo: 700.00, idUsuario: 2 },
    { id: 3, nome: 'Corrente Inter', tipo: 'corrente', saldoInicial: 2500.00, saldo: 2500.00, idUsuario: 1 },
    { id: 4, nome: 'Poupança Caixa', tipo: 'poupanca', saldoInicial: 500.00, saldo: 500.00, idUsuario: 3 },
    { id: 5, nome: 'Carteira Diária', tipo: 'corrente', saldoInicial: 350.00, saldo: 350.00, idUsuario: 4 },
    { id: 6, nome: 'Conta PJ', tipo: 'corrente', saldoInicial: 8000.00, saldo: 8000.00, idUsuario: 5 }
];

const lancamentos = [
    // TIPO receita ou despesa | DATA: AAAA-MM-DD
    { id: 1, tipo: 'receita', descricao: 'Freelance Website', valor: 150.00, categoria: 'trabalho', data: '2026-10-04', idConta: 1 },
    { id: 2, tipo: 'despesa', descricao: 'Supermercado Mensal', valor: 450.30, categoria: 'alimentacao', data: '2026-10-02', idConta: 1 },
    { id: 3, tipo: 'despesa', descricao: 'Assinatura Netflix', valor: 55.90, categoria: 'lazer', data: '2026-10-04', idConta: 1 },
    { id: 4, tipo: 'receita', descricao: 'Salário Mensal', valor: 3200.00, categoria: 'trabalho', data: '2026-10-01', idConta: 3 },
    { id: 5, tipo: 'despesa', descricao: 'Combustível', valor: 120.00, categoria: 'transporte', data: '2026-10-04', idConta: 3 },
    { id: 6, tipo: 'despesa', descricao: 'Farmácia', valor: 85.20, categoria: 'saude', data: '2026-10-02', idConta: 4 },
    { id: 7, tipo: 'receita', descricao: 'Venda de Fotos', valor: 400.00, categoria: 'trabalho', data: '2026-10-04', idConta: 5 },
    { id: 8, tipo: 'despesa', descricao: 'Jantar Pizzaria', valor: 75.00, categoria: 'alimentacao', data: '2026-10-03', idConta: 5 },
    { id: 9, tipo: 'receita', descricao: 'Aporte Investidor', valor: 5000.00, categoria: 'trabalho', data: '2026-10-01', idConta: 6 },
    { id: 10, tipo: 'despesa', descricao: 'Aluguel Escritório', valor: 1500.00, categoria: 'habitacao', data: '2026-10-02', idConta: 6 }
];

API.post('/contas', (req, res) => {
    const novaConta = req.body;

    contas.push(novaConta);

    res.status(201).json(novaConta);
});

API.get('/contas/:id', (req, res) => {
    const id = Number(req.params.id);

    const conta = contas.find(conta => conta.id === id);

    res.json(conta);
});

API.put('/contas/:id', (req, res) => {
    const id = Number(req.params.id);

    const conta = contas.find(conta => conta.id === id);
    
    if (!contas) {
        return res.status(404).json("Conta não encontrada");
    }

    conta.nome = req.body.nome;
    conta.tipo = req.body.tipo;

    res.json(conta);
});

API.delete('/contas/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = contas.findIndex(conta => conta.id === id);

    if (indice === -1) {
        return res.status(404).json("Conta não encontrada");
    }

    contas.splice(indice, 1);
    
    res.status(204).send();
});



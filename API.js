const express = require('express');
const API = express();
const PORT = 3000;

API.use(express.json());

const usuarios = [
    { id: 1, nome: 'Maria da Silva', email: 'maria@email.com' },
    { id: 2, nome: 'João dos Santos', email: 'joao@email.com' },
    { id: 3, nome: 'Mara Maravilha', email: 'mara@email.com' },
    { id: 4, nome: 'Peter Parker', email: 'peter@email.com' },
    { id: 5, nome: 'Yudi Itadori', email: 'Yudi@email.com' }
];
let proximoIdUsuario = 6;
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


//CRUD Usuários
// R => read
API.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

API.get('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    const usuario = usuarios.find(usuario => usuario.id === id);
    if (!usuario) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado'
        });
    }
    res.json(usuario);
});

// C => create
API.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    const novoUsuario = {
        id: proximoIdUsuario++,
        nome: nome,
        email: email
    }
    if (!nome || typeof nome !== 'string' || !email || typeof email !== 'string') {
        return res.status(400).json({
            mensagem: 'Os campos "nome" e "email" são obrigatórios'
        });
    }
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

//U => Update
API.put('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    const usuario = usuarios.find(usuario => usuario.id === id);
    if (!usuario) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado'
        });
    }
    const { nome, email } = req.body;
    if (!nome || typeof nome !== 'string' || !email || typeof email !== 'string') {
        return res.status(400).json({
            mensagem: 'Os campos "nome" e "email" são obrigatórios'
        });
    }

    usuario.nome = nome;
    usuario.email = email;
    res.json(usuario);
});

//D => delete
API.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    const posicao = usuarios.findIndex(u => u.id === id);

    if (posicao === -1) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado'
        })
    };
    usuarios.splice(posicao, 1);
    res.status(204).json({
        mensagem: 'Usuário deletado'
    });

});

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
function filtrarLancamentos({ idUsuario, idConta, categoria, inicio, fim }) {
    if (inicio && !DATA_REGEX.test(inicio)) {
        return { erro: 'O campo "inicio" deve estar no formato AAAA-MM-DD' };
    }
    if (fim && !DATA_REGEX.test(fim)) {
        return { erro: 'O campo "fim" deve estar no formato AAAA-MM-DD' };
    }
    if (inicio && fim && inicio > fim) {
        return { erro: '"inicio" não pode ser maior que "fim"' };
    }

    let resultado = lancamentos;

    if (idUsuario) {
        const idsContas = contas
            .filter(c => c.idUsuario === Number(idUsuario))
            .map(c => c.id);
        resultado = resultado.filter(l => idsContas.includes(l.idConta));
    }
    if (idConta) {
        resultado = resultado.filter(l => l.idConta === Number(idConta));
    }
    if (categoria) {
        resultado = resultado.filter(l => l.categoria === categoria);
    }
    if (inicio) {
        resultado = resultado.filter(l => l.data >= inicio);
    }
    if (fim) {
        resultado = resultado.filter(l => l.data <= fim);
    }
    return { resultado };
}

API.get('/lancamentos', (req, res) => {
    const { erro, resultado } = filtrarLancamentos(req.query);
    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    const ordenado = [...resultado].sort((a, b) => b.data.localeCompare(a.data));
    res.json(ordenado);
});

API.get('/lancamentos/total', (req, res) => {
    const { erro, resultado } = filtrarLancamentos(req.query);
    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    let receitas = 0;
    let despesas = 0;
    const porCategoria = {};

    for (const l of resultado) {
        if (!porCategoria[l.categoria]) {
            porCategoria[l.categoria] = { receitas: 0, despesas: 0 };
        }
        if (l.tipo === 'receita') {
            receitas += l.valor;
            porCategoria[l.categoria].receitas += l.valor;
        } else {
            despesas += l.valor;
            porCategoria[l.categoria].despesas += l.valor;
        }
    }

    for (const cat in porCategoria) {
        porCategoria[cat].receitas = arredondar(porCategoria[cat].receitas);
        porCategoria[cat].despesas = arredondar(porCategoria[cat].despesas);
    }

    res.json({
        quantidade: resultado.length,
        receitas: arredondar(receitas),
        despesas: arredondar(despesas),
        saldo: arredondar(receitas - despesas),
        porCategoria
    });
});
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
let proximoIdConta = 7;

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
let proximoIdLancamento = 11;

// CREATE
API.post('/contas', (req, res) => {
    const { nome, tipo, saldoInicial, idUsuario } = req.body;

    if (typeof nome !== 'string' || !nome.trim()) {
        return res.status(400).json({
            mensagem: 'O nome da conta é obrigatório'
        });
    }

    if (!['corrente', 'poupanca'].includes(tipo)) {
        return res.status(400).json({
            mensagem: 'O tipo deve ser corrente ou poupanca'
        });
    }

    if (typeof saldoInicial !== 'number' ||
        !Number.isFinite(saldoInicial) || saldoInicial < 0) {
        return res.status(400).json({
            mensagem: 'O saldo inicial deve ser um número maior ou igual a zero'
        });
    }

    const usuarioExiste = usuarios.some(
        usuario => usuario.id === idUsuario
    );

    if (!usuarioExiste) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado'
        });
    }

    const quantidadeContas = contas.filter(
        conta => conta.idUsuario === idUsuario
    ).length;

    if (quantidadeContas >= 3) {
        return res.status(400).json("O usuário já possui o limite de três contas"
        );
    }

    const novaConta = {
        id: proximoIdConta++,
        nome: nome.trim(),
        tipo,
        saldoInicial,
        saldo: saldoInicial,
        idUsuario
    };

    contas.push(novaConta);
    res.status(201).json(novaConta);
});

//READ
API.get('/contas', (req, res) => {
    const { idUsuario } = req.query;

    let resultado = contas;

    if (idUsuario !== undefined) {
        const id = Number(idUsuario);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID do usuário inválido'
            });
        }

        const usuarioExiste = usuarios.some(
            usuario => usuario.id === id
        );

        if (!usuarioExiste) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        resultado = contas.filter(
            conta => conta.idUsuario === id
        );
    }

    res.json(resultado);
});

API.get('/contas/:id', (req, res) => {

    const id = Number(req.params.id);
    const conta = contas.find(conta => conta.id === id);
    if (!conta) {
        return res.status(404).json({
            mensagem: 'Conta não encontrada'
        });
    }
    res.json(conta);
});

//UPDATE
API.put('/contas/:id', (req, res) => {
    const id = Number(req.params.id);

    const conta = contas.find(conta => conta.id === id);

    if (!conta) {
        return res.status(404).json("Conta não encontrada");
    }

    conta.nome = req.body.nome;
    conta.tipo = req.body.tipo;

    if (typeof nome !== 'string' || !nome.trim()) {
        return res.status(400).json({
            mensagem: 'O nome da conta é obrigatório'
        });
    }

    if (!['corrente', 'poupanca'].includes(tipo)) {
        return res.status(400).json({
            mensagem: 'O tipo deve ser corrente ou poupanca'
        });
    }

    conta.nome = nome.trim();
    conta.tipo = tipo;

    res.json(conta);
});

//DELETE
API.delete('/contas/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = contas.findIndex(conta => conta.id === id);

    if (indice === -1) {
        return res.status(404).json("Conta não encontrada");
    }

    const possuiLancamentos = lancamentos.some(
        lancamento => lancamento.idConta === id
    );

    if (possuiLancamentos) {
        return res.status(400).json("Não é possível excluir uma conta que possui lançamentos");
    }

    contas.splice(indice, 1);

    res.status(204).send();
});


//CREATE
API.post('/lancamentos', (req, res) => {
    const { tipo, descricao, valor, categoria, data, idConta} = req.body;
    
    if (!['receita', 'despesa'].incluides(tipo)){
        return res.status(400).json("O tipo deve ser receita ou despesa")
    }

    if(typeof descricao !== 'string' || !descricao.trim()){
        return res.status(400).json("A descrição é obrigatória")
    }

    if(typeof categoria !== 'string' || !categoria.trim()) {
        return res.status(400).json("A categoria é obrigatória");
    }
     
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <=0){
        return res.status(400).json("O valor deve ser um numero maior que zero");
    }

    const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof data !== 'string' || !DATA_REGEX.test(data)){
        return res.status(400).json("estar no formato AAAA-MM-DD")
    }

     const conta = contas.find(conta => conta.id === idConta);

    if (!conta) {
        return res.status(404).json("Conta não encontrada");
    }

    const valorCentavos = Math.round(valor * 100);
    const saldoCentavos = Math.round(conta.saldo * 100);

    if (tipo === 'despesa' && valorCentavos > saldoCentavos) {
        return res.status(400).json("Saldo insuficiente para realizar esta despesa");
    }

    const novoLancamento = {
        id: proximoIdLancamento++,
        tipo,
        descricao: descricao.trim(),
        valor: valorCentavos / 100,
        categoria: categoria.trim(),
        data,
        idConta
    };

    if (tipo === 'receita') {
        conta.saldo = (saldoCentavos + valorCentavos) / 100;
    } else {
        conta.saldo = (saldoCentavos - valorCentavos) / 100;
    }

    lancamentos.push(novoLancamento);

    res.status(201).json({
        mensagem: 'Lançamento cadastrado com sucesso',
        lancamento: novoLancamento,
        novoSaldo: conta.saldo
    });


});

//READ
API.get('/lancamentos', (req, res) => {

    const { idUsuario, idConta, categoria, inicio, fim } = req.query;

    const resultado = filtrarLancamentos({
        idUsuario,
        idConta,
        categoria,
        inicio,
        fim
    });

    if (resultado.erro) {
        return res.status(400).json({
            mensagem: resultado.erro
        });
    }

    const lancamentosFiltrados = resultado.resultado;

    lancamentosFiltrados.sort((a, b) =>
        new Date(b.data) - new Date(a.data)
    );

    res.json(lancamentosFiltrados);
});

API.get('/lancamentos/total', (req, res) => {

    const { idUsuario, idConta, categoria, inicio, fim } = req.query;

    const resultado = filtrarLancamentos({
        idUsuario,
        idConta,
        categoria,
        inicio,
        fim
    });

    if (resultado.erro) {
        return res.status(400).json({
            mensagem: resultado.erro
        });
    }

    const lancamentosFiltrados = resultado.resultado;

    let receitas = 0;
    let despesas = 0;
    const porCategoria = {};

    lancamentosFiltrados.forEach(lancamento => {

        if (lancamento.tipo === 'receita') {
            receitas += lancamento.valor;
        } else if (lancamento.tipo === 'despesa') {
            despesas += lancamento.valor;
        }

        if (!porCategoria[lancamento.categoria]) {
            porCategoria[lancamento.categoria] = {
                receitas: 0,
                despesas: 0
            };
        }

        if (lancamento.tipo === 'receita') {
            porCategoria[lancamento.categoria].receitas += lancamento.valor;
        } else if (lancamento.tipo === 'despesa') {
            porCategoria[lancamento.categoria].despesas += lancamento.valor;
        }
    });

    receitas = Math.round((receitas + Number.EPSILON) * 100) / 100;
    despesas = Math.round((despesas + Number.EPSILON) * 100) / 100;

    const saldo = Math.round((receitas - despesas + Number.EPSILON) * 100) / 100;

    Object.keys(porCategoria).forEach(categoria => {
        porCategoria[categoria].receitas =
            Math.round((porCategoria[categoria].receitas + Number.EPSILON) * 100) / 100;

        porCategoria[categoria].despesas =
            Math.round((porCategoria[categoria].despesas + Number.EPSILON) * 100) / 100;
    });

    res.json({
        quantidade: lancamentosFiltrados.length,
        receitas,
        despesas,
        saldo,
        porCategoria
    });
});

API.get('/lancamentos/:id', (req, res) => {

    const id = Number(req.params.id);

    const lancamento = lancamentos.find(l => l.id === id);

    if (!lancamento) {
        return res.status(404).json({
            mensagem: 'Lançamento não encontrado'
        });
    }

    res.json(lancamento);
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
    
    if (!nome || typeof nome !== 'string' || !nome.trim() ||
        !email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            mensagem: 'Os campos "nome" e "email" são obrigatórios'
        });
    }

    const emailExiste = usuarios.find(
        usuario => usuario.email.toLocaleLowerCase() === email.trim().toLocaleLowerCase()
    );

    if (emailExiste){
        return res.status(400).json({
            mensagem: 'Esse email já está cadastrado'
        });
    }
    const novoUsuario = {
        id: proximoIdUsuario++,
        nome: nome,
        email: email
    };

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

    if (typeof nome !== 'string' || !nome.trim() ||
        typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            mensagem: 'Os campos "nome" e "email" são obrigatórios'
        });
    }
     const emailExiste = usuarios.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
        && u.id !== id
    );

    if (emailExiste) {
        return res.status(400).json({
            mensagem: 'Este email já está cadastrado por outro usuário'
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

API.listen(3000, () => console.log('API em http://localhost:3000'));
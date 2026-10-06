# API de Controle Financeiro Pessoal

API REST em JavaScript com Express.js para registrar e consultar ganhos e despesas de forma simples.

## Entidades

**Usuário:** `id`, `nome`, `email`

**Conta:** `id`, `nome`, `tipo` (`corrente` ou `poupanca`), `saldoInicial`, `saldo`, `idUsuario`

**Lançamento:** `id`, `tipo` (`receita` ou `despesa`), `descricao`, `valor` (sempre positivo), `categoria`, `data` (`AAAA-MM-DD`), `idConta`

## Regras de negócio

1. Toda operação está vinculada a um usuário.
2. Um usuário pode ter no máximo 3 contas.
3. Não é possível registrar uma despesa maior que o saldo da conta.

## Como executar

Antes de iniciar o projeto, instale o Express:

```bash
npm init -y
npm install express
```

No `package.json`, adicione ou substitua o campo `type`:

```json
"type": "module"
```

Inicie o servidor:

```bash
node --watch app.js
```

A API fica disponível em `http://localhost:3000`. Os dados ficam em memória e voltam ao inicial quando o servidor reinicia.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista usuários |
| GET | `/usuarios/:id` | Busca um usuário |
| POST | `/usuarios` | Cadastra usuário |
| PUT | `/usuarios/:id` | Atualiza usuário |
| DELETE | `/usuarios/:id` | Exclui usuário |
| GET | `/contas/:id` | Busca uma conta |
| POST | `/contas` | Cadastra conta |
| PUT | `/contas/:id` | Atualiza nome e tipo da conta |
| DELETE | `/contas/:id` | Exclui conta |
| POST | `/lancamentos` | Registra receita ou despesa |
| GET | `/lancamentos` | Extrato com filtros |
| GET | `/lancamentos/total` | Totais por categoria e período |
| GET | `/lancamentos/:id` | Busca um lançamento |

## Usuários

### POST /usuarios

```json
{ "nome": "Bruce Wayne", "email": "bruce@email.com" }
```

Resposta `201`:

```json
{ "id": 6, "nome": "Bruce Wayne", "email": "bruce@email.com" }
```

Erros: `400` se `nome` ou `email` estiverem ausentes ou não forem texto.

### PUT /usuarios/:id

Mesmo corpo do POST. Retorna `200` com o usuário atualizado. Erros: `404` (não encontrado) e `400` (dados inválidos).

### GET /usuarios e GET /usuarios/:id

Retornam `200` com a lista ou o usuário. Erro: `404` se o id não existir.

### DELETE /usuarios/:id

Retorna `204` sem corpo. Erro: `404` se o id não existir.

## Contas

### POST /contas

```json
{ "nome": "Poupança Viagem", "tipo": "poupanca", "saldoInicial": 300, "idUsuario": 1 }
```

Resposta `201`:

```json
{ "id": 7, "nome": "Poupança Viagem", "tipo": "poupanca", "saldoInicial": 300, "saldo": 300, "idUsuario": 1 }
```

Erros: `400` (dados inválidos), `404` (usuário não encontrado) e `409` (usuário já tem 3 contas).

### PUT /contas/:id

```json
{ "nome": "Conta Salário", "tipo": "corrente" }
```

Retorna `200` com a conta atualizada. O saldo não muda por esta rota. Erro: `404`.

### GET /contas/:id e DELETE /contas/:id

O GET retorna `200` com a conta e o DELETE retorna `204`. Erro: `404` se o id não existir.

## Lançamentos

### POST /lancamentos

```json
{
  "tipo": "despesa",
  "descricao": "Cinema",
  "valor": 40.00,
  "categoria": "lazer",
  "data": "2026-10-05",
  "idConta": 1
}
```

Resposta `201` com o lançamento criado. Uma receita soma ao saldo da conta e uma despesa subtrai.

Erros: `400` (dados inválidos), `404` (conta não encontrada) e `422` (despesa maior que o saldo).

### GET /lancamentos

Retorna o extrato, do mais recente para o mais antigo. Todos os filtros são opcionais e podem ser combinados:

| Parâmetro | Exemplo | Descrição |
|---|---|---|
| `idUsuario` | `2` | Contas do usuário |
| `idConta` | `1` | Uma conta |
| `categoria` | `lazer` | Uma categoria |
| `inicio` | `2026-10-01` | Data inicial (inclusive) |
| `fim` | `2026-10-31` | Data final (inclusive) |

Exemplo:

```
GET /lancamentos?idConta=1&categoria=lazer&inicio=2026-10-01&fim=2026-10-31
```

Erro: `400` se a data não estiver no formato `AAAA-MM-DD` ou se `inicio` for maior que `fim`.

### GET /lancamentos/total

Aceita os mesmos parâmetros do extrato e retorna os totais.

```
GET /lancamentos/total?idUsuario=2&inicio=2026-10-01&fim=2026-10-31
```

Resposta `200`:

```json
{
  "quantidade": 3,
  "receitas": 150,
  "despesas": 506.2,
  "saldo": -356.2,
  "porCategoria": {
    "trabalho": { "receitas": 150, "despesas": 0 },
    "alimentacao": { "receitas": 0, "despesas": 450.3 },
    "lazer": { "receitas": 0, "despesas": 55.9 }
  }
}
```

### GET /lancamentos/:id

Retorna `200` com o lançamento. Erro: `404` se o id não existir.

## Códigos de status

| Código | Significado |
|---|---|
| 200 | Sucesso |
| 201 | Criado |
| 204 | Excluído, sem corpo |
| 400 | Dados inválidos |
| 404 | Não encontrado |
| 409 | Limite de 3 contas atingido |
| 422 | Despesa maior que o saldo |

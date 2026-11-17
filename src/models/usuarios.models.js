const usuarios = [
  { id: 1, nome: "Maria da Silva", email: "maria@email.com" },
  { id: 2, nome: "João dos Santos", email: "joao@email.com" },
  { id: 3, nome: "Mara Maravilha", email: "mara@email.com" },
  { id: 4, nome: "Peter Parker", email: "peter@email.com" },
  { id: 5, nome: "Yudi Itadori", email: "Yudi@email.com" },
];

let proximoIdUsuario = 6;

// READ
export function listarUsuarios() {
  return usuarios;
}

export function buscarUsuarioPorId(id) {
  return usuarios.find((usuario) => usuario.id === id);
}

// CREATE
export function criarUsuario(nome, email) {
  const novoUsuario = {
    id: proximoIdUsuario++,
    nome,
    email,
  };

  usuarios.push(novoUsuario);

  return novoUsuario;
}

// UPDATE
export function atualizarUsuario(id, nome, email) {
  const usuario = buscarUsuarioPorId(id);

  if (!usuario) {
    return null;
  }

  usuario.nome = nome;
  usuario.email = email;

  return usuario;
}

// DELETE
export function deletarUsuario(id) {
  const posicao = usuarios.findIndex((usuario) => usuario.id === id);

  if (posicao === -1) {
    return false;
  }

  usuarios.splice(posicao, 1);

  return true;
}

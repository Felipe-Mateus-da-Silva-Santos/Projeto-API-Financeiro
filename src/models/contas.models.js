import { ObjectId } from 'mongodb';
import { obterBanco } from '../config/database.js';

function colecao() {
  return obterBanco().collection('contas');
}
// READ
export async function listarContas() {
  return colecao().find().toArray();
}

export async function buscarContaPorId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return colecao().findOne({ _id: new ObjectId(id) });
}

// CREATE
export async function inserir(conta) {
  const resultado = await colecao().insertOne(conta);
  return resultado.insertedId;
}


// UPDATE
export async function atualizar(id, campos) {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const resultado = await colecao().updateOne({ _id: new ObjectId(id) }, { $set: campos });
  return resultado.matchedCount > 0;
}

// DELETE
export async function remover(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount > 0;
}

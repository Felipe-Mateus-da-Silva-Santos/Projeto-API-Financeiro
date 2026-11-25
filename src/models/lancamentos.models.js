import { ObjectId } from 'mongodb';
import { obterBanco } from '../config/database.js';

function colecao() {
  return obterBanco().collection('lancamentos');
}
// READ
export async function listarLancamentos() {
   return colecao().find().toArray();
}

export async function buscarLancamentoPorId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return colecao().findOne({ _id: new ObjectId(id) });
}

// CREATE
export async function inserir(lancamento) {
  const resultado = await colecao().insertOne(lancamento);
  return resultado.insertedId;
}
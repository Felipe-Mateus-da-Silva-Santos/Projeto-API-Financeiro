import { ObjectId } from 'mongodb';
import { obterBanco } from '../config/database.js';

function colecao() {
  return obterBanco().collection('usuarios');
}

// READ
export async function listarUsuarios() {
  return colecao().find().toArray();
}

export async function buscarUsuarioPorId(id) {
   if (!ObjectId.isValid(id)) {
    return null;
    }
    return colecao().findOne({ _id: new ObjectId(id) });
}
// Inserir
export async function inserir (usuario){
  const usuarios = await colecao();
  const resultado = await usuarios.insertOne(usuario);
}

// Atualizar
export async function atualizar (id, dados) {
  if (!ObjectId.isValid(id)){
    return false;
  }
   const resultado = await colecao().updateOne({ _id: new ObjectId(id) }, { $set: dados });
   return resultado.matchedCount > 0;
  
}

// Remover
export async function remover(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount > 0;
 }

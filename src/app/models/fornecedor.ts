import { BaseModel } from './base';

export class Fornecedor extends BaseModel {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  tipo: string;
  endereco: string;
}

import { BaseModel } from './base';

export class Fornecedor extends BaseModel {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  tipo: string;
}

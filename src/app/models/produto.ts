import { BaseModel } from './base';
import { Fornecedor } from './fornecedor';

export class Produto extends BaseModel {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  quantidadeEstoque: number;
  valorUnitario: number;
  valorCobrado: number;
  fornecedor: Fornecedor;
}

import { BaseModel } from './base';
import { Fornecedor } from './fornecedor';

export class Produto extends BaseModel {
  nome: string;
  tipo: string;
  descricao: string;
  quantidadeProduto: number;
  valorUnitario: number;
  valorCobrado: number;
  fornecedor: Fornecedor;
}

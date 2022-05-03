import { BaseModel } from './base';
import { Fornecedor } from './fornecedor';

export class Produto extends BaseModel {
  nome: string;
  tipo: string;
  descricao: string;
  codigoNCM: string;
  quantidadeEstoque: number;
  valorUnitario: number;
  fornecedor: Fornecedor;
  ativo: boolean;
}

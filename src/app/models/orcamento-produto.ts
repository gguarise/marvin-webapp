import { BaseModel } from './base';

export class OrcamentoProduto extends BaseModel {
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  percentual: number;
  valorTotal: number;
}

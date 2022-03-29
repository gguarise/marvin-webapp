import { BaseModel } from './base';

export class OrcamentoProduto extends BaseModel {
  produtoId: string;
  quantidade: number;
  percentual: number;
  valorTotal: number;
}

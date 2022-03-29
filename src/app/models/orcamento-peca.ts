import { BaseModel } from './base';

export class OrcamentoPeca extends BaseModel {
  nome: string;
  descricao: string;
  valorUnitario: number;
  valorCobrado: number;
}

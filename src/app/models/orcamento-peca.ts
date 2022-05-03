import { BaseModel } from './base';

export class OrcamentoPeca extends BaseModel {
  nome: string;
  descricao: string;
  codigoNCM: string;
  quantidade: number;
  percentual: number;
  valorUnitarioCompra: number;
  valorUnitarioVenda: number;
  valorCobrado: number;
}

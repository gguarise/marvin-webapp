import { BaseModel } from './base';
import { OrcamentoModoPagamento } from './orcamento-modo-pagamento';

export class OrcamentoPagamento extends BaseModel {
  percentual: string;
  desconto: number;
  valorFinal: number;
  pagamentoEfetuado: boolean;
  modoPagamento: OrcamentoModoPagamento;
}

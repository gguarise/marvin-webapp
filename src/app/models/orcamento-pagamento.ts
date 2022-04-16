import { BaseModel } from './base';
import { OrcamentoModoPagamento } from './orcamento-modo-pagamento';

export class OrcamentoPagamento extends BaseModel {
  percentual: string;
  desconto: string;
  valorFinal: number;
  pagamentoEfetuado: number;
  modoPagamento: OrcamentoModoPagamento;
}

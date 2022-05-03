import { BaseModel } from './base';

export class OrcamentoModoPagamento extends BaseModel {
  cartaoCredito: boolean;
  cartaoDebito: boolean;
  dinheiro: boolean;
  pix: boolean;
}

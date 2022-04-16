import { BaseModel } from './base';

export class OrcamentoServico extends BaseModel {
  servicoId: string;
  valor: number;
  descricao: string;
}

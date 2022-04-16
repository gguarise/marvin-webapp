import { BaseModel } from './base';
import { OrcamentoProduto } from './orcamento-produto';
import { OrcamentoPeca } from './orcamento-peca';
import { OrcamentoServico } from './orcamento-servico';
import { OrcamentoPagamento } from './orcamento-pagamento';

export class Orcamento extends BaseModel {
  clienteId: string;
  carroId: string;
  descricao: string;
  dataCadastro: Date;
  dataAgendamento: Date;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  duracao: number;
  produtos: OrcamentoProduto[];
  pecas: OrcamentoPeca[];
  servicos: OrcamentoServico[];
  pagamento: OrcamentoPagamento;
  status: string;
}

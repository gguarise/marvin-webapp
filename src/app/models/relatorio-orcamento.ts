import { BaseModel } from './base';
import { OrcamentoProduto } from './orcamento-produto';
import { OrcamentoPeca } from './orcamento-peca';
import { OrcamentoServico } from './orcamento-servico';
import { OrcamentoPagamento } from './orcamento-pagamento';
import { Cliente } from './cliente';
import { Carro } from './carro';

export class RelatorioOrcamento extends BaseModel {
  cliente: Cliente;
  carro: Carro;
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
  subtotal: number;
  status: string;
}

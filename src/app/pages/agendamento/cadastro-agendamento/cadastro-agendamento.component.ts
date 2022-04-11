import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { AtendimentoService } from 'src/app/services/atendimento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { CadastroOrcamentoComponent } from '../../orcamento/cadastro-orcamento/cadastro-orcamento.component';
import { OrcamentoComponent } from '../../orcamento/orcamento.component';
import { DateAdapter, DateUnit } from '@matheo/datepicker/core';
import { StatusOrcamento } from 'src/app/models/enum/status-orcamento';

@Component({
  selector: 'app-cadastro-agendamento',
  templateUrl: './cadastro-agendamento.component.html',
  styleUrls: ['./cadastro-agendamento.component.scss'],
})
export class CadastroAgendamentoComponent extends BaseComponent {
  selectedOrcamentoId: string;
  clientes: Cliente[];
  clientesFiltrados: Cliente[];
  carros: Carro[];
  screenSize: number;
  finalizeButtonLabel = 'Finalizar Agora';
  statusOrcamento: StatusOrcamento;
  // Variáveis e funções de Data estão reunidas no final do arquivo

  sumReducer = (accumulator: any, current: any) => accumulator + current;

  @ViewChild('dataAgendamentoPicker') dataAgendamentoPicker: any;
  @ViewChild('dataFinalizacaoPicker') dataFinalizacaoPicker: any;

  constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    public orcamentoService: OrcamentoService,
    public atendimentoService: AtendimentoService,
    public clienteService: ClienteService,
    public router: Router,
    private adapter: DateAdapter<Date>
  ) {
    super(orcamentoService, elementRef, cdr, route);
    this.mainForm = this.fb.group({
      id: [],
      clienteId: [],
      carroId: [],
      descricao: [],
      dataCadastro: [],
      dataAgendamento: [null, Validators.required],
      dataFinalizacao: [],
      status: [],
      pagamento: this.fb.group({
        id: [],
        percentual: [],
        desconto: [],
        valorFinal: [],
        pagamentoEfetuado: [],
        modoPagamento: this.fb.group({
          id: [],
          cartaoCredito: [],
          cartaoDebito: [],
          dinheiro: [],
          pix: [],
        }),
      }),
      // Tabelas - Usado para calcular totais das tabelas
      servicos: [],
      produtos: [],
      pecas: [],
      // Usados apenas em Tela
      totalProdutos: [],
      totalPecas: [],
      totalServicos: [],
      subtotal: [],
    });
    this.getClientes();
  }

  override setMainFormData(item: any = this.originalData) {
    super.setMainFormData(item);

    // Operações após tela estar com valores
    const clienteId = this.mainForm.get('clienteId')?.value;
    this.carros = this.clientes.find((c) => c.id === clienteId)?.carros ?? [];

    this.calculateCustoProdutos();
    this.calculateCustoPecas();
    this.calculateCustoServicos();

    this.setStatusConfig();
  }

  ngAfterViewInit() {
    this.disableOrcamentoSelecionadoFields();
    this.screenSize = window.innerWidth;
    this.cdr.detectChanges();
  }

  override afterFormEnable() {
    this.disableOrcamentoSelecionadoFields();
    this.fillMinimalDateVariables();
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/agendamento']);
  }

  override afterInsert(response: any) {
    this.router.navigate(['/cadastro-agendamento', response?.id]);
  }

  override async beforeSave() {
    if (this.isNewRecord && !this.selectedOrcamentoId) {
      this.toastr.error('É preciso selecionar um orçamento para agendar.');
    } else {
      super.beforeSave();
    }
  }

  // #region Operações nos Campos e Dialogs
  disableOrcamentoSelecionadoFields() {
    const disabledFields = [
      'clienteId',
      'carroId',
      'pagamento.valorFinal',
      'pagamento.desconto',
      'pagamento.pagamentoEfetuado',
      'totalProdutos',
      'totalPecas',
      'totalServicos',
      'subtotal',
      'dataCadastro',
    ];

    if (this.isNewRecord) {
      disabledFields.push('dataAgendamento');
    }

    disabledFields.forEach((field) => this.mainForm.get(field)?.disable());
    this.cdr.detectChanges();
  }

  // Para aparecer o nome no select de Cliente
  displayFnCliente(value?: string) {
    return this.clientes?.find((c) => c.id === value)?.nome ?? '';
  }

  compareWith(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  getClientes() {
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c;
    });
  }

  selectOrcamento() {
    const dialogRef = this.dialog.open(OrcamentoComponent, {
      data: true,
      width: this.screenSize > 599 ? '70%' : '95%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((id) => {
      this.selectedOrcamentoId = id;
      if (!!this.selectedOrcamentoId) {
        this.routeId = this.selectedOrcamentoId;
        this.select();
        this.mainForm.get('dataAgendamento')?.enable();
      } else {
        if (this.mainForm.get('dataAgendamento')?.enabled) {
          this.mainForm.get('dataAgendamento')?.disable();
        }
      }
    });
  }

  visualizeOrcamento() {
    this.dialog.open(CadastroOrcamentoComponent, {
      data: this.mainForm.get('id')?.value,
      width: this.screenSize > 599 ? '70%' : '95%',
      height: 'auto',
      disableClose: false,
    });
  }

  // TODO trocar metodo chamado
  setStatusConfig(status: StatusOrcamento | null = null) {
    const statusAtual = status ?? this.mainForm.get('status')?.value;
    switch (statusAtual) {
      case StatusOrcamento.Cadastrado:
        this.statusOrcamento = StatusOrcamento.Cadastrado;
        break;
      case StatusOrcamento.Agendado:
        this.statusOrcamento = StatusOrcamento.Agendado;
        this.finalizeButtonLabel = 'Finalizar Agora';
        break;
      case StatusOrcamento.Finalizado:
        this.statusOrcamento = StatusOrcamento.Finalizado;
        this.finalizeButtonLabel = 'Desfinalizar';
        this.mainForm.get('dataAgendamento')?.disable();
        break;
      default:
        break;
    }
  }

  // #endregion

  // #region Operações do Agendamento
  // Realiza o Agendamento e altera Data de Agendamento se necessário
  override async save() {
    const data = this.getRawData();

    await firstValueFrom(this.atendimentoService.putAgendar(data))
      .then(() => {
        if (this.isNewRecord) {
          this.afterInsert({ id: this.selectedOrcamentoId });
        } else {
          this.onClear();
          this.select();
        }
        this.setStatusConfig(StatusOrcamento.Agendado);
        this.toastr.success('Agendamento salvo com sucesso.');
      })
      .catch(() => this.toastr.error('Não foi possível salvar o atendimento.'));
  }

  // Cancela o Agendamento
  override async delete() {
    await firstValueFrom(
      this.atendimentoService.putCancelar({ id: this.routeId })
    )
      .then(() => {
        this.afterDelete();
        this.toastr.success('Agendamento cancelado com sucesso.');
      })
      .catch(() => {
        this.toastr.error('Não foi possível cancelar o agendamento.');
      });
  }

  // Finaliza um Agendamento
  async finalizeAgendamento() {
    const data = this.getRawData();

    firstValueFrom(this.atendimentoService.putFinalizar(data))
      .then(() => {
        this.toastr.success('Agendamento finalizado com sucesso.');
        this.setStatusConfig(StatusOrcamento.Finalizado);
      })
      .catch((e) => {
        this.throwErrorMessage(e);
      });
  }

  // Finaliza um Agendamento
  async undoAgendamento() {
    const data = this.getRawData();

    await firstValueFrom(this.atendimentoService.putDesfinalizar(data))
      .then(() => {
        this.onClear();
        this.select();
        this.toastr.success('Agendamento desfinalizado com sucesso.');
      })
      .catch((e) => {
        this.throwErrorMessage(e);
      });
  }
  // #endregion

  // #region Cálculos
  calculateCustoProdutos() {
    const tabela = this.mainForm.get('produtos')?.value;
    if (!!tabela && tabela.length > 0) {
      const total = tabela
        .map((x: any) => x.valorTotal)
        .reduce(this.sumReducer);
      this.mainForm.get('totalProdutos')?.setValue(total);
    }
  }

  calculateCustoPecas() {
    const tabela = this.mainForm.get('pecas')?.value;
    if (!!tabela && tabela.length > 0) {
      const total = tabela
        .map((x: any) => x.valorCobrado)
        .reduce(this.sumReducer);
      this.mainForm.get('totalPecas')?.setValue(total);
    }
  }

  calculateCustoServicos() {
    const tabela = this.mainForm.get('servicos')?.value;
    if (!!tabela && tabela.length > 0) {
      const total = tabela.map((x: any) => x.valor).reduce(this.sumReducer);
      this.mainForm.get('totalServicos')?.setValue(total);
      this.calculateSubtotal();
    }
  }

  calculateSubtotal() {
    const total =
      this.mainForm.get('totalProdutos')?.value +
      this.mainForm.get('totalPecas')?.value +
      this.mainForm.get('totalServicos')?.value;
    this.mainForm.get('subtotal')?.setValue(total.toFixed(2));
  }
  // #endregion

  // #region Datas
  datePickerControler(datePicker: any) {
    if (!datePicker.opened) {
      datePicker.open();
    }
  }

  minimalDateAgendamento: Date;
  minimalDateAgendamentoDay: number;
  minimalDateAgendamentoMonth: number;
  minimalDateAgendamentoYear: number;
  minimalDateFinalizacao: Date;
  minimalDateFinalizacaoDay: number;
  minimalDateFinalizacaoMonth: number;
  minimalDateFinalizacaoYear: number;

  filterTimeAgendamento = (d: Date | null, unit?: DateUnit): boolean => {
    if (!!d && !!this.minimalDateAgendamento) {
      const day = this.adapter.getDate(d);
      const month = this.adapter.getMonth(d);
      const year = this.adapter.getYear(d);

      if (
        this.minimalDateAgendamentoDay === day &&
        this.minimalDateAgendamentoMonth === month &&
        this.minimalDateAgendamentoYear === year
      ) {
        const hourCadastro = this.adapter.getHours(this.minimalDateAgendamento);
        const hour = this.adapter.getHours(d);
        if (unit === 'hour') {
          // Deixa selecionar apenas a hora superior/igual do Cadastro
          return hour >= hourCadastro;
        }

        if (unit === 'minute' && hour === hourCadastro) {
          const minutesCadastro = this.adapter.getMinutes(
            this.minimalDateAgendamento
          );
          const minutes = this.adapter.getMinutes(d || this.adapter.today());
          // Deixa selecionar apenas o minuto superior/igual do Cadastro
          return minutes >= minutesCadastro;
        }
      }
    }
    return true;
  };

  filterTimeFinalizacao = (d: Date | null, unit?: DateUnit): boolean => {
    if (!!d && !!this.minimalDateFinalizacao) {
      const day = this.adapter.getDate(d);
      const month = this.adapter.getMonth(d);
      const year = this.adapter.getYear(d);

      if (
        this.minimalDateFinalizacaoDay === day &&
        this.minimalDateFinalizacaoMonth === month &&
        this.minimalDateFinalizacaoYear === year
      ) {
        const hourAgendamento = this.adapter.getHours(
          this.minimalDateFinalizacao
        );
        const hour = this.adapter.getHours(d);
        if (unit === 'hour') {
          // Deixa selecionar apenas a hora superior/igual do Agendamento
          return hour >= hourAgendamento;
        }

        if (unit === 'minute' && hour === hourAgendamento) {
          const minutesAgendamento = this.adapter.getMinutes(
            this.minimalDateFinalizacao
          );
          const minutes = this.adapter.getMinutes(d || this.adapter.today());
          // Deixa selecionar apenas o minuto superior/igual do Agendamento
          return minutes >= minutesAgendamento;
        }
      }
    }
    return true;
  };

  fillMinimalDateVariables() {
    const dataCadastro = this.mainForm.get('dataCadastro')?.value;
    if (!!dataCadastro) {
      this.minimalDateAgendamento = new Date(dataCadastro);
      this.minimalDateAgendamentoDay = this.minimalDateAgendamento.getDate();
      this.minimalDateAgendamentoMonth = this.minimalDateAgendamento.getMonth();
      this.minimalDateAgendamentoYear =
        this.minimalDateAgendamento.getFullYear();

      // Para não bloquear o dia do Cadastro no [min]
      this.minimalDateAgendamento.setDate(
        this.minimalDateAgendamento.getDate() - 1
      );
    }

    const dataAgendamento = this.mainForm.get('dataAgendamento')?.value;
    if (!!dataAgendamento) {
      this.minimalDateFinalizacao = new Date(dataAgendamento);
      this.minimalDateFinalizacaoDay = this.minimalDateFinalizacao.getDate();
      this.minimalDateFinalizacaoMonth = this.minimalDateFinalizacao.getMonth();
      this.minimalDateFinalizacaoYear =
        this.minimalDateFinalizacao.getFullYear();

      // Para não bloquear o dia da Agendamento no [min]
      this.minimalDateFinalizacao.setDate(
        this.minimalDateFinalizacao.getDate() - 1
      );
    }
  }

  // #endregion
}

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
import { DialogHelper } from 'src/core/helpers/dialog-helper';
import { CarroService } from 'src/app/services/carro.service';

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
    public carroService: CarroService,
    public router: Router,
    private adapter: DateAdapter<Date>
  ) {
    super(orcamentoService, elementRef, cdr, route);
    this.mainForm = this.fb.group({
      id: [null, Validators.required],
      clienteId: [],
      carroId: [],
      descricao: [],
      dataCadastro: [],
      dataAgendamento: [null, Validators.required],
      dataHoraFim: [null, Validators.required],
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
  }

  override setMainFormData(item: any = this.originalData) {
    super.setMainFormData(item);

    // Preenche lista de Clientes
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c;
    });

    // Preenche lista de Carros
    this.carroService.getAll().subscribe((c: Carro[]) => {
      this.carros = c;
    });

    // Calcula valores para totais das tabelas
    this.calculateCustoProdutos();
    this.calculateCustoPecas();
    this.calculateCustoServicos();

    // Chama nesse momento e novamente depois de habilitar, para ficar certo na visualização
    this.setStatusConfig(this.mainForm.get('status')?.value);
  }

  ngAfterViewInit() {
    this.disableFields();
    this.screenSize = window.innerWidth;
    this.cdr.detectChanges();
  }

  override afterFormEnable() {
    this.disableFields();
    this.setStatusConfig(this.mainForm.get('status')?.value);
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/agendamento']);
  }

  override afterInsert(response: any) {
    super.afterInsert();
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
  disableFields() {
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

  selectOrcamento() {
    const dialogRef = this.dialog.open(OrcamentoComponent, {
      data: true,
      width: this.screenSize > 599 ? '70%' : '95%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(async (id) => {
      // Caso abra e feche dialog sem querer mantem ultimo selecionado
      if (!!id) {
        this.selectedOrcamentoId = id;
      }
      if (!!this.selectedOrcamentoId) {
        this.routeId = this.selectedOrcamentoId;
        this.select();
        this.mainForm.get('dataAgendamento')?.enable();
        this.mainForm.markAsDirty();
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

  setStatusConfig(status: StatusOrcamento | null = null) {
    const statusAtual = status ?? this.mainForm.get('status')?.value;
    switch (statusAtual) {
      case StatusOrcamento.Cadastrado:
        this.statusOrcamento = StatusOrcamento.Cadastrado;
        this.mainForm.get('dataHoraFim')?.disable();
        this.fillMinimalDateVariables('dataCadastro');
        break;
      case StatusOrcamento.Agendado:
        this.statusOrcamento = StatusOrcamento.Agendado;
        this.finalizeButtonLabel = 'Finalizar Agora';
        this.mainForm.get('dataHoraFim')?.disable();
        this.fillMinimalDateVariables('dataCadastro');
        break;
      case StatusOrcamento.Finalizado:
        this.statusOrcamento = StatusOrcamento.Finalizado;
        this.finalizeButtonLabel = 'Desfinalizar';
        this.mainForm.get('dataAgendamento')?.disable();
        this.fillMinimalDateVariables('dataAgendamento');
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

    if (this.statusOrcamento !== StatusOrcamento.Finalizado) {
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
        .catch((e) => {
          this.throwErrorMessage(e);
        });
    } else {
      // Se o Agendamento estiver Finalizado
      await firstValueFrom(this.atendimentoService.putFinalizar(data))
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
        .catch((e) => {
          this.throwErrorMessage(e);
        });
    }
  }

  override getRawData() {
    const dados = super.getRawData();
    dados.dataAgendamento = this.convertDateValue(dados.dataAgendamento);
    dados.dataHoraFim = this.convertDateValue(dados.dataHoraFim);
    return dados;
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
      .catch((e) => {
        this.throwErrorMessage(e);
      });
  }

  async buttonClickEvent() {
    const confirma = await DialogHelper.openDialog(
      'Confirmação',
      `Deseja ${
        this.statusOrcamento === StatusOrcamento.Agendado
          ? 'finalizar o'
          : 'desfazer a finalização do'
      } agendamento?`
    );
    if (confirma) {
      if (this.statusOrcamento === StatusOrcamento.Agendado) {
        this.finalizeAgendamento();
      } else if (this.statusOrcamento === StatusOrcamento.Finalizado) {
        this.undoAgendamento();
      }
    }
  }

  // Finaliza um Agendamento
  async finalizeAgendamento() {
    await firstValueFrom(
      this.atendimentoService.putFinalizar({ id: this.routeId })
    )
      .then(() => {
        this.toastr.success('Agendamento finalizado com sucesso.');
        this.setStatusConfig(StatusOrcamento.Finalizado);
        this.onClear();
        this.select();
      })
      .catch((e) => {
        this.throwErrorMessage(e);
      });
  }

  // Desfinaliza um Agendamento
  async undoAgendamento() {
    await firstValueFrom(
      this.atendimentoService.putDesfinalizar({ id: this.routeId })
    )
      .then(async () => {
        this.toastr.success('Finalização desfeita com sucesso.');
        this.setStatusConfig(StatusOrcamento.Agendado);
        this.onClear();
        this.select();
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

  minimalDate: Date;
  minimalDateDay: number;
  minimalDateMonth: number;
  minimalDateYear: number;

  filterTime = (d: Date | null, unit?: DateUnit): boolean => {
    if (!!d && !!this.minimalDate) {
      const day = this.adapter.getDate(d);
      const month = this.adapter.getMonth(d);
      const year = this.adapter.getYear(d);

      if (
        this.minimalDateDay === day &&
        this.minimalDateMonth === month &&
        this.minimalDateYear === year
      ) {
        const hourFilterField = this.adapter.getHours(this.minimalDate);
        const hour = this.adapter.getHours(d);
        if (unit === 'hour') {
          // Deixa selecionar apenas a hora superior/igual do FilterField
          return hour >= hourFilterField;
        }

        if (unit === 'minute' && hour === hourFilterField) {
          const minutesFilterField = this.adapter.getMinutes(this.minimalDate);
          const minutes = this.adapter.getMinutes(d || this.adapter.today());
          // Deixa selecionar apenas o minuto superior/igual do FilterField
          return minutes >= minutesFilterField;
        }
      }
    }
    return true;
  };

  // Quando a data de agendamento estiver habilitada a data de finalização não estará, e vice-verse
  // Por isso usa-se apenas um método
  fillMinimalDateVariables(dateName: string) {
    const data = this.mainForm.get(dateName)?.value;
    if (!!data) {
      this.minimalDate = new Date(data);
      this.minimalDateDay = this.minimalDate.getDate();
      this.minimalDateMonth = this.minimalDate.getMonth();
      this.minimalDateYear = this.minimalDate.getFullYear();

      // Para permitir data de Agendamento ou Finalização no mesmo dia
      this.minimalDate.setDate(this.minimalDate.getDate() - 1);
    }
  }

  // #endregion
}

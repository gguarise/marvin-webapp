import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { OrcamentoPeca } from 'src/app/models/orcamento-peca';
import { CarroService } from 'src/app/services/carro.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { CadastroClienteComponent } from '../../cliente/cadastro-cliente/cadastro-cliente.component';
import { RelatorioOrdemServicoComponent } from '../../relatorio-ordem-servico/relatorio-ordem-servico.component';
import { PecasTableComponent } from './pecas-table/pecas-table.component';
import { ProdutoTableComponent } from './produto-table/produto-table.component';
import { ServicoTableComponent } from './servico-table/servico-table.component';

@Component({
  selector: 'app-cadastro-orcamento',
  templateUrl: './cadastro-orcamento.component.html',
  styleUrls: ['./cadastro-orcamento.component.scss'],
})
export class CadastroOrcamentoComponent
  extends BaseComponent
  implements AfterViewInit
{
  clientes: Cliente[];
  clientesFiltrados: Cliente[];
  carros: Carro[];
  isDialogComponent: boolean = false;
  showForm = true;
  showReport = false;
  dataAgora: Date;
  dadosRelatorio: any;
  numberFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };
  idCarroDesassociado: string;
  idClienteDoCarroDesassociado: string;

  sumReducer = (accumulator: any, current: any) => accumulator + current;

  @ViewChild(ProdutoTableComponent, { static: false })
  produtosTable: ProdutoTableComponent;
  @ViewChild(ServicoTableComponent, { static: false })
  servicosTable: ServicoTableComponent;
  @ViewChild(PecasTableComponent, { static: false })
  pecasTable: PecasTableComponent;
  @ViewChild('appHeader', { static: false })
  appHeader: HeaderComponent;

  constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    public carroService: CarroService,
    public router: Router,
    // Ambos abaixo para controlar o comportamento para Tela de Agendamento > Selecionar Orçamento
    @Optional() public dialogRef: MatDialogRef<CadastroOrcamentoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public idAgendamento: any = null
  ) {
    super(orcamentoService, elementRef, cdr, route);
    this.mainForm = this.fb.group({
      id: [],
      clienteId: [null, Validators.required],
      carroId: [null, Validators.required],
      descricao: [null, Validators.maxLength(500)],
      pagamento: this.fb.group({
        id: [],
        percentual: [null, Validators.compose([Validators.max(100)])],
        desconto: [],
        valorFinal: [{ value: 0, disabled: true }],
        pagamentoEfetuado: [false],
        modoPagamento: this.fb.group({
          id: [],
          cartaoCredito: [false],
          cartaoDebito: [false],
          dinheiro: [false],
          pix: [false],
        }),
      }),
      // Tabelas
      servicos: [],
      produtos: [],
      pecas: [],
      // Usados apenas em Tela
      totalProdutos: [{ value: 0, disabled: true }],
      totalPecas: [{ value: 0, disabled: true }],
      totalServicos: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }],
    });
  }

  override async ngOnInit() {
    super.ngOnInit(this.idAgendamento);
    this.saveTablesIndividually = false; // Rotas de orçamento que salvam as tabelas
    if (!!this.idAgendamento) {
      this.isDialogComponent = true;
    }
  }

  ngAfterViewInit() {
    this.componentTables = [
      this.produtosTable,
      this.servicosTable,
      this.pecasTable,
    ];

    if (this.isNewRecord) {
      this.getClientes();
    }
  }

  override async afterSetMainFormData() {
    // Operações após tela estar com valores
    await this.getClientes();

    this.calculateCustoProdutos(true);
    this.calculateCustoPecas(true);
    this.calculateCustoServicos(true);
  }

  override afterFormEnable() {
    const disabledFields = [
      'pagamento.valorFinal',
      'totalProdutos',
      'totalPecas',
      'totalServicos',
      'subtotal',
    ];

    disabledFields.forEach((field) => this.mainForm.get(field)?.disable());
  }

  override async beforeSave() {
    const produtos = this.produtosTable.formArray.getRawValue();
    const pecas = this.pecasTable.formArray.getRawValue();
    const servicos = this.servicosTable.formArray.getRawValue();

    if (
      (!produtos || produtos?.length === 0) &&
      (!pecas || pecas?.length === 0) &&
      (!servicos || servicos?.length === 0)
    ) {
      this.toastr.error('É preciso inserir itens em ao menos uma tabela.');
    } else if (this.calculateTotal()) {
      super.beforeSave();
    }
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/orcamento']);
  }

  override afterInsert(response: any) {
    super.afterInsert();
    this.router.navigate(['/cadastro-orcamento', response?.id]);
  }

  override getRawData() {
    const form = super.getRawData();
    form.produtos = this.produtosTable.formArray.getRawValue();
    form.pecas = this.pecasTable.formArray.getRawValue();
    form.pecas?.forEach((peca: OrcamentoPeca) => {
      peca.codigoNCM = peca.codigoNCM.replace(/\D/g, '');
    });
    form.servicos = this.servicosTable.formArray.getRawValue();
    return form;
  }

  isValidCliente() {
    const clienteId = this.mainForm.get('clienteId')?.value;
    if (!!clienteId) {
      const cliente = this.clientes.find((c) => c.id === clienteId);
      if (!cliente) {
        this.mainForm.get('clienteId')?.setValue(null);
      }
    }
  }

  filterClientes() {
    const filterValue =
      this.mainForm.get('clienteId')?.value.toLowerCase() ?? '';
    this.clientesFiltrados = this.clientes?.filter((cliente) =>
      cliente.nome.toLowerCase().includes(filterValue)
    );
  }

  updateCarros() {
    const clienteId = this.mainForm.get('clienteId')?.value;
    this.mainForm.get('carroId')?.setValue(null);
    if (!!clienteId) {
      this.carros = this.clientes.find((c) => c.id === clienteId)?.carros ?? [];
      this.carros = this.carros.filter((c) => c.ativo);
      this.mainForm.get('carroId')?.enable();
    } else {
      this.carros = [];
      this.mainForm.get('carroId')?.disable();
    }
  }

  // Para aparecer o nome no select de Cliente
  displayFnCliente(value?: string) {
    return this.clientes?.find((c) => c.id === value)?.nome ?? '';
  }

  compareWith(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  addCliente() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(CadastroClienteComponent, {
      data: true,
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        // true se cadastrou novo cliente
        this.getClientes();
      }
    });
  }

  async getClientes() {
    const searchParams = { Ativo: 'true' };
    await this.clienteService
      .getAll(searchParams)
      .subscribe(async (c: Cliente[]) => {
        this.clientes = c;
        this.clientesFiltrados = c;

        const clienteId = this.mainForm.get('clienteId')?.value;
        // Caso esteja inativo irá mostrar
        const ativo = this.clientes.find((x) => x.id === clienteId);
        if (!!clienteId && (ativo === null || ativo === undefined)) {
          await firstValueFrom(this.clienteService.getById(clienteId)).then(
            (c: Cliente) => {
              this.clientes.push(c);
            }
          );
        }

        // Lista de carros
        this.carros =
          this.clientes.find((c) => c.id === clienteId)?.carros ?? [];

        const carroId = this.mainForm.get('carroId')?.value;
        this.carros = this.carros.filter(
          (c: Carro) => c.ativo || c.id === carroId
        );

        // Caso carro tenha sido desassociado do cliente / inativado

        if (!this.carros.find((c) => c.id === carroId)) {
          await firstValueFrom(this.carroService.getById(carroId)).then(
            (c: Carro) => {
              this.idClienteDoCarroDesassociado = clienteId;
              this.idCarroDesassociado = c.id;
              this.carros.push(c);
            }
          );
        } else {
          this.idClienteDoCarroDesassociado = '';
          this.idCarroDesassociado = '';
        }

        this.mainForm.get('clienteId')?.setValue(clienteId);
        this.cdr.detectChanges();
      });
  }

  calculateCustoProdutos(onInit: boolean = false) {
    const tabela = this.produtosTable.formArray.getRawValue();
    if (!!tabela && tabela.length > 0) {
      const total = tabela
        .map((x: any) => x.valorTotal)
        .reduce(this.sumReducer);
      this.mainForm.get('totalProdutos')?.setValue(total);
    } else {
      this.mainForm.get('totalPecas')?.setValue(null);
    }
    // Só calcula caso não seja na abertura da tela para não chamar repetido
    if (!onInit) {
      this.calculateSubtotal();
    }
  }

  calculateCustoPecas(onInit: boolean = false) {
    const tabela = this.pecasTable.formArray.getRawValue();
    if (!!tabela && tabela.length > 0) {
      const total = tabela
        .map((x: any) => x.valorCobrado)
        .reduce(this.sumReducer);
      this.mainForm.get('totalPecas')?.setValue(total);
    } else {
      this.mainForm.get('totalPecas')?.setValue(null);
    }
    // Só calcula caso não seja na abertura da tela para não chamar repetido
    if (!onInit) {
      this.calculateSubtotal();
    }
  }

  calculateCustoServicos(onInit: boolean = false) {
    const tabela = this.servicosTable.formArray.getRawValue();
    if (!!tabela && tabela.length > 0) {
      const total = tabela.map((x: any) => x.valor).reduce(this.sumReducer);
      this.mainForm.get('totalServicos')?.setValue(total);
    } else {
      this.mainForm.get('totalServicos')?.setValue(null);
    }
    this.calculateSubtotal(onInit);
  }

  calculateSubtotal(onInit: boolean = false) {
    const total =
      this.mainForm.get('totalProdutos')?.value +
      this.mainForm.get('totalPecas')?.value +
      this.mainForm.get('totalServicos')?.value;
    this.mainForm.get('subtotal')?.setValue(total.toFixed(2));
    if (!onInit) {
      this.calculateDesconto(true);
    }
  }

  calculateDesconto(isPercent = false) {
    const subtotal = this.mainForm.get('subtotal')?.value;

    if (subtotal > 0) {
      if (isPercent) {
        const porcentagem = this.mainForm.get('pagamento.percentual')?.value;
        const porcentagemCalculada = porcentagem / 100;
        if (porcentagemCalculada > 0) {
          const valorDesconto = (subtotal * porcentagemCalculada).toFixed(2);
          this.mainForm.get('pagamento.desconto')?.setValue(valorDesconto);
        } else {
          this.mainForm.get('pagamento.desconto')?.setValue(0);
        }
      } else {
        const valor = this.mainForm.get('pagamento.desconto')?.value;
        const porcentagem = ((valor * 100) / subtotal).toFixed(2); // Math.round tirava casas decimais
        this.mainForm.get('pagamento.percentual')?.setValue(porcentagem);
      }
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const subtotal = Number(this.mainForm.get('subtotal')?.value);
    const desconto = Number(this.mainForm.get('pagamento.desconto')?.value);
    const valorFinal = subtotal - desconto;
    if (valorFinal >= 0) {
      this.mainForm.get('pagamento.valorFinal')?.setValue(valorFinal);
      return true;
    } else {
      this.toastr.error('Desconto informado superior ao total.');
      return false;
    }
  }

  imprimir() {
    this.dialog.open(RelatorioOrdemServicoComponent, {
      data: this.getReportData(),
      width: '100%',
      height: '100%',
      disableClose: false,
    });
    this.cdr.detectChanges();
  }

  getReportData() {
    const orcamento = this.getRawData();
    orcamento.subtotal = Number(this.mainForm.get('subtotal')?.value);
    orcamento.pagamento.desconto = Number(orcamento.pagamento.desconto);
    orcamento.cliente =
      this.clientes.find((x) => x.id === orcamento.clienteId) ?? new Cliente();
    orcamento.carro =
      this.carros.find((x) => x.id === orcamento.carroId) ?? new Carro();
    return orcamento;
  }
}

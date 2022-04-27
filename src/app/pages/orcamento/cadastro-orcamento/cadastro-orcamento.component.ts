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
import { BaseComponent } from 'src/app/components/base/base.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { CadastroClienteComponent } from '../../cliente/cadastro-cliente/cadastro-cliente.component';
import { PecasTableComponent } from './pecas-table/pecas-table.component';
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

  sumReducer = (accumulator: any, current: any) => accumulator + current;

  @ViewChild(ServicoTableComponent, { static: false })
  servicosTable: ServicoTableComponent;
  @ViewChild(PecasTableComponent, { static: false })
  pecasTable: PecasTableComponent;

  constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    public router: Router
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
    this.getClientes();
  }

  override async ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.componentTables = [this.servicosTable, this.pecasTable];
  }

  override setMainFormData(item: any = this.originalData) {
    super.setMainFormData(item);

    // Operações após tela estar com valores
    const clienteId = this.mainForm.get('clienteId')?.value;
    this.carros = this.clientes.find((c) => c.id === clienteId)?.carros ?? [];

    this.calculateCustoPecas(true);
    this.calculateCustoServicos();
  }

  override afterFormEnable() {
    const disabledFields = [
      'pagamento.valorFinal',
      'totalPecas',
      'totalServicos',
      'subtotal',
    ];

    disabledFields.forEach((field) => this.mainForm.get(field)?.disable());
  }

  override async beforeSave() {
    const pecas = this.pecasTable.formArray.getRawValue();
    const servicos = this.servicosTable.formArray.getRawValue();

    if (
      (!pecas || pecas?.length === 0) &&
      (!servicos || servicos?.length === 0)
    ) {
      this.toastr.error('É preciso inserir itens em ao menos uma tabela.');
    } else if (this.calculateTotal()) {
      this.toastr.success('Orçamento salvo com sucesso.');
      this.afterInsert(null);
    }
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/orcamento']);
  }

  override afterInsert(response: any) {
    this.router.navigate([
      '/cadastro-orcamento',
      '6e6f0643-961a-40a0-b0cb-2f27b1c3ea87',
    ]);
  }

  override getRawData() {
    const form = super.getRawData();
    form.pecas = this.pecasTable.formArray.getRawValue();
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
    this.clientesFiltrados = this.clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(filterValue)
    );
  }

  updateCarros() {
    const clienteId = this.mainForm.get('clienteId')?.value;
    this.mainForm.get('carroId')?.setValue(null);
    if (!!clienteId) {
      this.carros = this.clientes.find((c) => c.id === clienteId)?.carros ?? [];
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
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClientes();
    });
  }

  getClientes() {
    this.clienteService.getAll({ Ativo: 'true' }).subscribe((c: Cliente[]) => {
      this.clientes = c;
      this.clientesFiltrados = c;
    });
  }

  calculateCustoPecas(onInit: boolean = false) {
    const tabela = this.pecasTable.formArray.getRawValue();
    if (!!tabela && tabela.length > 0) {
      const total = tabela
        .map((x: any) => x.valorCobrado)
        .reduce(this.sumReducer);
      this.mainForm.get('totalPecas')?.setValue(total);

      // Só calcula caso não seja na abertura da tela
      if (!onInit) {
        this.calculateSubtotal();
      }
    }
  }

  calculateCustoServicos() {
    const tabela = this.servicosTable.formArray.getRawValue();
    if (!!tabela && tabela.length > 0) {
      const total = tabela.map((x: any) => x.valor).reduce(this.sumReducer);
      this.mainForm.get('totalServicos')?.setValue(total);
      this.calculateSubtotal();
    }
  }

  calculateSubtotal() {
    const total =
      this.mainForm.get('totalPecas')?.value +
      this.mainForm.get('totalServicos')?.value;
    this.mainForm.get('subtotal')?.setValue(total.toFixed(2));
    this.calculateDesconto(true);
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
        const porcentagem = Math.round((valor * 100) / subtotal);
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
}

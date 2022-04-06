import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { OrcamentoComponent } from '../../orcamento/orcamento.component';

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

  sumReducer = (accumulator: any, current: any) => accumulator + current;

  constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    public orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    public router: Router
  ) {
    super(orcamentoService, elementRef, cdr, route);
    this.mainForm = this.fb.group({
      id: [],
      clienteId: [],
      carroId: [],
      descricao: [],
      dataCadastro: [],
      dataAgendamento: [],
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
  }

  ngAfterViewInit() {
    this.disableOrcamentoSelecionadoFields();
  }

  override afterFormEnable() {
    this.disableOrcamentoSelecionadoFields();
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/agendamento']);
  }

  override afterInsert(response: any) {
    this.router.navigate(['/cadastro-agendamento', response?.id]);
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
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(OrcamentoComponent, {
      data: true,
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((id) => {
      this.selectedOrcamentoId = id;
      if (!!this.selectedOrcamentoId) {
        this.select();
      } else {
        this.mainForm.reset();
      }
    });
  }

  override select() {
    this.orcamentoService.getById(this.selectedOrcamentoId).subscribe({
      next: (item) => {
        if (!!item) {
          this.setMainFormData(item);
        }
      },
      error: () => this.toastr.error('Um erro ocorreu ao buscar orçamento.'),
    });
  }

  override async beforeSave() {
    if (!this.selectedOrcamentoId) {
      this.toastr.error('É preciso selecionar um orçamento para agendar.');
    } else {
      super.beforeSave();
    }
  }

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
    ];

    disabledFields.forEach((field) => this.mainForm.get(field)?.disable());
    this.cdr.detectChanges();
  }

  // TODO Opcional - Colocar numa classe separada que nem field-validator
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
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PecasTableComponent } from './pecas-table/pecas-table.component';
import { ProdutoTableComponent } from './produto-table/produto-table.component';
import { ServicoTableComponent } from './servico-table/servico-table.component';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { ClienteComponent } from '../../cliente/cliente.component';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Carro } from 'src/app/models/carro';
import { ClienteService } from 'src/app/services/cliente.service';
import { CarroService } from 'src/app/services/carro.service';
import { Dialog } from 'src/app/models/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CadastroClienteComponent } from '../../cliente/cadastro-cliente/cadastro-cliente.component';

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

  sumReducer = (accumulator: any, current: any) => accumulator + current;

  @ViewChild(ProdutoTableComponent, { static: false })
  produtosTable: ProdutoTableComponent;
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
      descricao: [],
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
    this.updateCarros();
  }

  ngAfterViewInit() {
    this.componentTables = [
      this.produtosTable,
      this.servicosTable,
      this.pecasTable,
    ];
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
    this.router.navigate(['/cadastro-orcamento', response?.id]);
  }

  override getRawData() {
    const form = super.getRawData();
    form.produtos = this.produtosTable.formArray.getRawValue();
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
    const filterValue = this.mainForm.get('clienteId')?.value ?? '';
    this.clientesFiltrados = this.clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(filterValue)
    );
  }

  updateCarros() {
    const clienteId = this.mainForm.get('clienteId')?.value;
    if (!!clienteId) {
      this.carros = this.clientes.find((c) => c.id === clienteId)?.carros ?? [];
      this.mainForm.get('carroId')?.enable();
    } else {
      this.carros = [];
      this.mainForm.get('carroId')?.setValue(null);
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
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c; // antes: this.clientes$ = of(c);
      this.clientesFiltrados = c;
      // c.forEach((cliente: Cliente) => { // teste 1
      //   this.carros$[cliente.id] = of(cliente.carros);
      // });
    });
  }

  // TODO Colocar numa classe separada que nem field-validator
  calculateDesconto(isPercent = false) {
    const subtotal = this.mainForm.get('subtotal')?.value;

    if (subtotal > 0) {
      if (isPercent) {
        const porcentagem = this.mainForm.get('pagamento.percentual')?.value;
        const porcentagemCalculada = porcentagem / 100;
        if (porcentagemCalculada > 0) {
          this.mainForm
            .get('pagamento.desconto')
            ?.setValue(subtotal * porcentagemCalculada);
        } else {
          this.mainForm.get('pagamento.desconto')?.setValue(0);
        }
      } else {
        const valor = this.mainForm.get('pagamento.desconto')?.value;
        const porcentagem = (valor * 100) / subtotal;
        this.mainForm.get('pagamento.percentual')?.setValue(porcentagem);
      }
      this.calculateTotal();
    }
  }

  calculateCustoProdutos() {
    const tabela = this.produtosTable.formArray.getRawValue();
    const total = tabela.map((x: any) => x.valorTotal).reduce(this.sumReducer);
    this.mainForm.get('totalProdutos')?.setValue(total);
    this.calculateSubtotal();
  }

  calculateCustoPecas() {
    const tabela = this.pecasTable.formArray.getRawValue();
    const total = tabela.map((x) => x.valorCobrado).reduce(this.sumReducer);
    this.mainForm.get('totalPecas')?.setValue(total);
    this.calculateSubtotal();
  }

  calculateCustoServicos() {
    const tabela = this.servicosTable.formArray.getRawValue();
    const total = tabela.map((x) => x.valor).reduce(this.sumReducer);
    this.mainForm.get('totalServicos')?.setValue(total);
    this.calculateSubtotal();
  }

  calculateSubtotal() {
    const total =
      this.mainForm.get('totalProdutos')?.value +
      this.mainForm.get('totalPecas')?.value +
      this.mainForm.get('totalServicos')?.value;
    this.mainForm.get('subtotal')?.setValue(total);
    this.calculateTotal();
  }

  calculateTotal() {
    const subtotal = this.mainForm.get('subtotal')?.value;
    const desconto = this.mainForm.get('pagamento.desconto')?.value;
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
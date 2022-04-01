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
      percentual: [null, Validators.compose([Validators.max(100)])],
      desconto: [],
      valorFinal: [{ value: 0, disabled: true }],
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
      // Tabelas
      custoServicos: [],
      produtoOrcamentos: [],
      pecas: [],
      // Usados apenas em Tela
      totalProdutos: [{ value: 0, disabled: true }],
      totalPecas: [{ value: 0, disabled: true }],
      totalServicos: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }],
    });
    this.getClients();
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.updateCarros();
  }

  ngAfterViewInit() {
    this.componentTables = [this.produtosTable];
  }

  // override async beforeSave() {
  //   // TODO VALIDAR TODAS
  //   const carros = this.produtosTable.formArray.getRawValue();
  //   if (!carros || carros?.length <= 0) {
  //     this.toastr.error('O cliente deve ter ao menos um carro cadastrado');
  //   } else {
  //     super.beforeSave();
  //   }
  // }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/orcamento']);
  }

  override afterInsert(response: any) {
    this.router.navigate(['/cadastro-orcamento', response?.id]);
  }

  // override getRawData() {
  //   const form = super.getRawData();

  //   if (this.isNewRecord) {
  //     // TODO VER SE FUNCIONAMENTO TA IGUAL
  //     form.produtoOrcamentos = this.produtosTable.formArray.getRawValue();
  //   }
  //   return form;
  // }

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
  displayFnCliente(value?: number) {
    return this.clientes?.find((c) => c.id === value)?.nome ?? '';
  }

  compareWith(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  addClient() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(CadastroClienteComponent, {
      data: 'a',
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClients();
    });
  }

  getClients() {
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
        const porcentagem = this.mainForm.get('porcentagemDesconto')?.value;
        const porcentagemCalculada = porcentagem / 100;
        if (porcentagemCalculada > 0) {
          this.mainForm
            .get('valorDesconto')
            ?.setValue(subtotal * porcentagemCalculada);
        } else {
          this.mainForm.get('valorDesconto')?.setValue(0);
        }
      } else {
        const valor = this.mainForm.get('valorDesconto')?.value;
        const porcentagem = (valor * 100) / subtotal;
        this.mainForm.get('porcentagemDesconto')?.setValue(porcentagem);
      }
      this.calculateTotal();
    }
  }

  calculateCustoProdutos() {
    const tabela = this.produtosTable.formArray.getRawValue();
    const total = tabela.map((x: any) => x.total).reduce(this.sumReducer);
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
    const total = tabela.map((x) => x.honorario).reduce(this.sumReducer);
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
    const desconto = this.mainForm.get('valorDesconto')?.value;
    this.mainForm.get('valorFinal')?.setValue(subtotal - desconto);
  }
}

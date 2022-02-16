import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Produto } from 'src/app/models/produto';
import { BaseComponent } from '../base/base.component';
import { ClienteComponent } from '../cliente/cliente.component';
import { PecasTableComponent } from './pecas-table/pecas-table.component';
import { ProdutoTableComponent } from './produto-table/produto-table.component';
import { ServicoComponent } from './servico/servico.component';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.scss'],
})
export class OrcamentoComponent extends BaseComponent {
  mainForm: FormGroup;
  clientes$ = of([
    { id: 1, nome: 'Cliente 1' },
    { id: 2, nome: 'Cliente 2' },
    { id: 3, nome: 'Cliente 3' },
    { id: 4, nome: 'Cliente 4' },
  ]);
  carros$ = of([
    { id: 1, nome: 'Carro 1 Cliente 1', idCliente: 1 },
    { id: 2, nome: 'Carro 2 Cliente 1', idCliente: 1 },
    { id: 3, nome: 'Carro 1 Cliente 2', idCliente: 2 },
  ]);
  sumReducer = (accumulator: any, current: any) => accumulator + current;

  @ViewChild(ProdutoTableComponent, { static: false })
  produtosTable: ProdutoTableComponent;
  @ViewChild(ServicoComponent, { static: false })
  servicosTable: ServicoComponent;
  @ViewChild(PecasTableComponent, { static: false })
  pecasTable: PecasTableComponent;

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService
  ) {
    super(dialog, elementRef, fb, toastr, cdr);
    this.mainForm = this.fb.group({
      cliente: [],
      carro: [],
      totalProdutos: [{ value: 0, disabled: true }],
      totalPecas: [{ value: 0, disabled: true }],
      totalServicos: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }],
      porcentagemDesconto: [null, Validators.compose([Validators.max(100)])],
      valorDesconto: [],
      valorFinal: [{ value: 0, disabled: true }],
      pagamentoEfetuado: [],
      servicos: [],
      produtos: [],
      pecas: [],
    });
  }

  compareWith(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  addClient() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(ClienteComponent, {
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

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
    const total = tabela.map((x) => x.total).reduce(this.sumReducer);
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

  salvar() {
    this.toastr.success('Salvo!');
  }

  descartar() {
    this.toastr.success('Descartado!');
  }
}

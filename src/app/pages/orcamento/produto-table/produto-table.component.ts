import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Produto } from 'src/app/models/produto';
import { ProdutoService } from 'src/app/services/produto.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-produto-table',
  templateUrl: './produto-table.component.html',
  styleUrls: ['./produto-table.component.scss'],
})
export class ProdutoTableComponent extends BaseComponent {
  displayedColumns: string[] = [
    'select',
    'produto',
    'quantidade',
    'valorCobrado',
    'total',
  ];
  produtos$: Observable<Produto[]>;

  @Output() calculateCustoProdutos = new EventEmitter();

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService,
    produtoService: ProdutoService
  ) {
    super(dialog, elementRef, fb, toastr, cdr);
    this.formGroupConfig = {
      select: [false],
      id: [],
      produto: [null, Validators.required],
      quantidade: [
        1,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(2147483647),
        ]),
      ],
      valorCobrado: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999999999999999999999.99),
        ]),
      ],
      total: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999999999999999999999.99),
        ]),
      ],
      modified: [],
      new: [],
    };
    produtoService.getAll().subscribe((t) => {
      this.produtos$ = of(t);
    });
  }

  compare(o1: any, o2: any): boolean {
    return o1.produto.nome === o2.produto.nome;
  }

  fillProductPrice(element: any) {
    const produto = element.get('produto').value;
    element.get('valorCobrado').setValue(produto.valorCobrado);
    this.calculateTotalPrice(element);
  }

  calculateTotalPrice(element: any) {
    const quantidade = element.get('quantidade').value;
    const valorCobrado = element.get('valorCobrado').value;
    element.get('total').setValue(valorCobrado * quantidade);
    this.emitCalculateCustoTotalEvent();
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoProdutos.emit();
  }
}

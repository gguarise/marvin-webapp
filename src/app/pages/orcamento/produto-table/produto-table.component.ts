import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Produto } from 'src/app/models/produto';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-produto-table',
  templateUrl: './produto-table.component.html',
  styleUrls: ['./produto-table.component.scss'],
})
export class ProdutoTableComponent extends ChildBaseTableComponent {
  produtos$: Observable<Produto[]>;

  @Output() calculateCustoProdutos = new EventEmitter();

  constructor(
    elementRef: ElementRef,
    produtoService: ProdutoService
  ) {
    super(produtoService, elementRef);
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
    this.displayedColumns = [
      'select',
      'produto',
      'quantidade',
      'valorCobrado',
      'total',
    ];
    produtoService.getAll().subscribe((t) => {
      this.produtos$ = of(t);
    });
  }

  override compare(o1: any, o2: any): boolean {
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

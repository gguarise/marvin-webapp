import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
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

  constructor(elementRef: ElementRef, produtoService: ProdutoService) {
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
      valorUnitario: [
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
      'valorUnitario',
      'porcentagemLucro',
      'total',
    ];
    produtoService.getAll().subscribe((p: any) => {
      this.produtos$ = of(p);
    });
  }

  override ngOnInit() {}

  override select() {
    // super.select(this.parentId);
  }

  override compare(o1: any, o2: any): boolean {
    return o1.produto.nome === o2.produto.nome;
  }

  override setNewItem() {
    super.setNewItem();
    this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  }

  fillProductPrice(element: any) {
    const produto = element.get('produto').value;
    element.get('valorUnitario').setValue(produto.valorUnitario);
    this.calculateTotalPrice(element);
  }

  calculateTotalPrice(element: any) {
    const quantidade = element.get('quantidade').value;
    const valorUnitario = element.get('valorUnitario').value;
    const porcentagemLucro = element.get('porcentagemLucro').value;

    element
      .get('total')
      .setValue(valorUnitario * quantidade * (porcentagemLucro / 100));
    this.emitCalculateCustoTotalEvent();
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoProdutos.emit();
  }
}

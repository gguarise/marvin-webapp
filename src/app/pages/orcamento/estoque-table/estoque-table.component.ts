import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Estoque } from 'src/app/models/estoque';
import { EstoqueService } from 'src/app/services/estoque.service';

@Component({
  selector: 'app-estoque-table',
  templateUrl: './estoque-table.component.html',
  styleUrls: ['./estoque-table.component.scss'],
})
export class EstoqueTableComponent extends ChildBaseTableComponent {
  estoques$: Observable<Estoque[]>;

  @Output() calculateCustoEstoques = new EventEmitter();

  constructor(elementRef: ElementRef, estoqueService: EstoqueService) {
    super(estoqueService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      estoque: [null, Validators.required],
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
      'estoque',
      'quantidade',
      'valorUnitario',
      'porcentagemLucro',
      'total',
    ];
    estoqueService.getAll().subscribe((t: any) => {
      this.estoques$ = of(t);
    });
  }

  override ngOnInit() {}

  override select() {
    // super.select(this.parentId);
  }

  override compare(o1: any, o2: any): boolean {
    return o1.estoque.nome === o2.estoque.nome;
  }

  override setNewItem() {
    super.setNewItem();
    this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  }

  fillProductPrice(element: any) {
    const estoque = element.get('estoque').value;
    element.get('valorUnitario').setValue(estoque.valorUnitario);
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
    this.calculateCustoEstoques.emit();
  }
}

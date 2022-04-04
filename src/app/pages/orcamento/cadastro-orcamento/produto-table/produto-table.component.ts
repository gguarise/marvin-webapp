import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Produto } from 'src/app/models/produto';
import { ProdutoComponent } from 'src/app/pages/produto/produto.component';
import { ProdutoService } from 'src/app/services/produto.service';
import { duplicateTableValueValidator } from 'src/core/validators/duplicate-table-value-validator';

@Component({
  selector: 'app-produto-table',
  templateUrl: './produto-table.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProdutoTableComponent),
      multi: true,
    },
  ],
  styleUrls: ['./produto-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoTableComponent extends ChildBaseTableComponent {
  produtos: Produto[];

  @Output() calculateCustoProdutos = new EventEmitter();

  constructor(elementRef: ElementRef, public produtoService: ProdutoService) {
    super(produtoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      produtoId: [
        null,
        Validators.compose([
          Validators.required,
          duplicateTableValueValidator('produtoId', 'Produto'),
        ]),
      ],
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
      percentual: [],
      valorTotal: [
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
      'produtoId',
      'percentual',
      'valorUnitario',
      'quantidade',
      'valorTotal',
    ];
  }

  override ngOnInit() {
    this.getProdutos();
  }

  // Salva no próprio orçamento
  override async beforeSave() {}

  addProduto() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(ProdutoComponent, {
      data: 'a',
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProdutos();
    });
  }

  verifyQuantidadeDisponivel(element: any) {
    const produto = this.returnProdutoById(element.get('produtoId')?.value);
    const quantidadeColocada = element.get('quantidade')?.value;
    if (!!produto && !!quantidadeColocada) {
      if (produto.quantidadeEstoque < quantidadeColocada) {
        this.toastr.warning(
          `A quantidade em estoque do produto "${produto.nome}" é inferior a informada.`
        );
      }
    }
  }

  getProdutos() {
    this.produtoService.getAll().subscribe((p: Produto[]) => {
      this.produtos = p;
    });
  }

  returnProdutoById(id: string = '') {
    return this.produtos.find((x) => x.id === id);
  }

  override compare(o1: any, o2: any): boolean {
    return o1.produtoId === o2.produtoId;
  }

  override afterFormEnable() {
    // Pode ser usado pra desabilitar campos após formulário ser habilitado
    this.formArray.controls.forEach((item) => {
      item.get('valorUnitario')?.disable();
      item.get('valorTotal')?.disable();
    });
  }

  // override setNewItem() {
  //   super.setNewItem();
  //   this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  // }

  setValorUnitario(element: any) {
    const produto = this.returnProdutoById(element.get('produtoId')?.value);
    if (!!produto) {
      const valorUnitarioProduto = produto.valorUnitario;
      const percentual = element.get('percentual')?.value;
      if (!!percentual) {
        element
          .get('valorUnitario')
          .setValue(
            valorUnitarioProduto * (percentual / 100) + valorUnitarioProduto
          );
      } else {
        element.get('valorUnitario').setValue(valorUnitarioProduto);
      }
      this.calculateTotalPrice(element);
    }
  }

  calculateTotalPrice(element: any) {
    const quantidade = element.get('quantidade').value;
    const valorUnitario = element.get('valorUnitario').value;

    element.get('valorTotal').setValue(valorUnitario * quantidade);
    this.emitCalculateCustoTotalEvent();
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoProdutos.emit();
  }
}
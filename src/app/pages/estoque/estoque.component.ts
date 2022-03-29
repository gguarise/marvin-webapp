import { Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Fornecedor } from 'src/app/models/fornecedor';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { EstoqueService } from 'src/app/services/estoque.service';
import { BaseTableComponent } from '../../components/base/base-table/base-table.component';
import { FornecedorComponent } from '../fornecedor/fornecedor.component';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss'],
})
export class EstoqueComponent extends BaseTableComponent {
  fornecedores$: Observable<Fornecedor[]>;

  constructor(
    public estoqueService: EstoqueService,
    elementRef: ElementRef,
    public fornecedorService: FornecedorService
  ) {
    super(estoqueService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      tipo: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      descricao: [null, Validators.maxLength(500)],
      quantidadeEstoque: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(2147483647),
        ]),
      ],
      valorUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999999.99),
        ]),
      ],
      fornecedor: [null, Validators.required],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome',
      'tipo',
      'descricao',
      'quantidadeEstoque',
      'valorUnitario',
      'fornecedor',
    ];

    fornecedorService.getAll().subscribe((t) => {
      this.fornecedores$ = of(t);
    });
  }

  override select() {
    const sortItems = (a: Fornecedor, b: Fornecedor) =>
      a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
    super.select(null, sortItems);
  }

  override getRawData() {
    return this.formArray.getRawValue();
  }

  compareFornecedor(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  async openFornecedorDialog() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(FornecedorComponent, {
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fornecedorService.getAll().subscribe((t) => {
        this.fornecedores$ = of(t);
      });
    });
  }
}

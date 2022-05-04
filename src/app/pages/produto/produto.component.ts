import { Component, ElementRef, Optional } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Fornecedor } from 'src/app/models/fornecedor';
import { Produto } from 'src/app/models/produto';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { BaseTableComponent } from '../../components/base/base-table/base-table.component';
import { FornecedorComponent } from '../fornecedor/fornecedor.component';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss'],
})
export class ProdutoComponent extends BaseTableComponent {
  fornecedores$: Observable<Fornecedor[]>;

  constructor(
    public produtoService: ProdutoService,
    elementRef: ElementRef,
    public fornecedorService: FornecedorService,
    @Optional() public dialogRef: MatDialogRef<ProdutoComponent>
  ) {
    super(produtoService, elementRef);
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
          Validators.max(99999.99),
        ]),
      ],
      codigoNCM: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(8)]),
      ],
      fornecedor: [null, Validators.required],
      ativo: [true],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome',
      'tipo',
      'codigoNCM',
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
    const searchParams = { Ativo: 'true' };
    super.select(null, sortItems, searchParams);
  }

  compareFornecedor(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  async openFornecedorDialog() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(FornecedorComponent, {
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fornecedorService.getAll().subscribe((t) => {
        this.fornecedores$ = of(t);
      });
    });
  }

  override getRawData() {
    const form = this.formArray.getRawValue();
    form?.forEach((produto: Produto) => {
      produto.codigoNCM = produto.codigoNCM.replace(/\D/g, '');
    });
    return form;
  }
}
